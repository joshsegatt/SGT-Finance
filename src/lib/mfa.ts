import { db } from "./db";
import { resend } from "@/lib/resend";

export async function sendMfaCode(userId: string, email: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  // Store in a temporary VerificationToken or a dedicated MFA table
  // For this demo, I'll use the VerificationToken table
  await db.verificationToken.upsert({
    where: { identifier_token: { identifier: `mfa-${userId}`, token: code } },
    create: { identifier: `mfa-${userId}`, token: code, expires },
    update: { token: code, expires },
  });

  // Send email (Mock if resend not fully configured)
  console.log(`[MFA] Security code for ${email}: ${code}`);
  
  try {
    await resend.emails.send({
      from: "SGT-Finance <security@sgt-finance.com>",
      to: email,
      subject: "Security Code - SGT-Finance",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #111;">Security Code</h2>
          <p style="color: #666;">Enter the following code to complete your login to SGT-Finance:</p>
          <div style="background: #f4f4f4; padding: 20px; border-radius: 10px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000; margin: 20px 0;">
            ${code}
          </div>
          <p style="color: #999; font-size: 12px;">This code will expire in 10 minutes. If you didn't request this, please change your password immediately.</p>
        </div>
      `,
    });
  } catch (err) {
    console.warn("Failed to send MFA email via Resend:", err);
  }

  return { success: true };
}

export async function verifyMfaCode(userId: string, code: string) {
  const token = await db.verificationToken.findFirst({
    where: { identifier: `mfa-${userId}`, token: code },
  });

  if (!token || token.expires < new Date()) {
    return { success: false, error: "Invalid or expired code" };
  }

  // Delete token after use
  await db.verificationToken.delete({
    where: { token: code },
  });

  return { success: true };
}
