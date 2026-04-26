import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sign } from "jsonwebtoken";
import { createTransport } from "nodemailer";
import { db } from "@/lib/db";
import { rateLimit, getIdentifier } from "@/lib/rateLimit";

const Schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  const { allowed } = rateLimit(getIdentifier(req), 3, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const { email } = parsed.data;

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ ok: true });
  }

  const secret = process.env.AUTH_SECRET!;
  const token = sign({ sub: user.id, email, purpose: "reset" }, secret, { expiresIn: "1h" });
  const baseUrl = process.env.AUTH_URL ?? "http://localhost:3005";
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM ?? smtpUser ?? "noreply@sgt.dashboard";

  if (smtpHost && smtpUser && smtpPass) {
    const transporter = createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: false,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from,
      to: email,
      subject: "Reset your SGT Dashboard password",
      html: `<div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px"><div style="background:linear-gradient(135deg,#4979EF,#2563eb);width:40px;height:40px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:24px"><span style="color:white;font-weight:700;font-size:12px">SGT</span></div><h1 style="font-size:20px;font-weight:700;margin:0 0 8px;color:#0f172a">Reset your password</h1><p style="color:#64748b;font-size:14px;margin:0 0 24px;line-height:1.6">Click the button below to set a new password. This link expires in 1 hour.</p><a href="${resetUrl}" style="display:inline-block;background:#2563eb;color:white;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px">Reset Password</a><p style="color:#94a3b8;font-size:12px;margin-top:24px">If you didn't request this, you can safely ignore this email.</p></div>`,
    });
  } else {
    console.log(`[DEV] Password reset URL for ${email}: ${resetUrl}`);
  }

  return NextResponse.json({ ok: true });
}
