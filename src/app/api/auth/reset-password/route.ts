import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verify } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { rateLimit, getIdentifier } from "@/lib/rateLimit";

const Schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(128),
});

export async function POST(req: NextRequest) {
  const { allowed } = rateLimit(getIdentifier(req), 5, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { token, password } = parsed.data;
  const secret = process.env.AUTH_SECRET!;

  let payload: { sub?: string; purpose?: string };
  try {
    payload = verify(token, secret) as typeof payload;
  } catch {
    return NextResponse.json({ error: "Token is invalid or expired" }, { status: 400 });
  }

  if (payload.purpose !== "reset" || !payload.sub) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 12);
  await db.user.update({
    where: { id: payload.sub },
    data: { password: hashed },
  });

  return NextResponse.json({ ok: true });
}
