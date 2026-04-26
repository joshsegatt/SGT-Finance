import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { buildAuthUrl } from "@/lib/truelayer";
import { rateLimit, getIdentifier } from "@/lib/rateLimit";
import { z } from "zod";

const BodySchema = z.object({
  entityId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const { allowed } = rateLimit(getIdentifier(req), 10, 60_000);
  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { entityId } = parsed.data;

  const entity = await db.entity.findUnique({ where: { id: entityId } });
  if (!entity) {
    return NextResponse.json({ error: "Entity not found" }, { status: 404 });
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? process.env.AUTH_URL ?? "http://localhost:3005";
  const redirectUri = `${baseUrl}/accounts/callback`;

  try {
    const link = buildAuthUrl(redirectUri, entityId);
    return NextResponse.json({ link });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create auth URL";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
