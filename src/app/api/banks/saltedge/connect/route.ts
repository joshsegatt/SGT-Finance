import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getOrCreateCustomer, createConnectSession } from "@/lib/saltedge";
import { rateLimit, getIdentifier } from "@/lib/rateLimit";
import { z } from "zod";

const BodySchema = z.object({
  entityId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const { allowed } = rateLimit(getIdentifier(req), 10, 60_000);
  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const session = await auth();
  if (!session?.user?.id) {
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
  const returnTo = `${baseUrl}/accounts/saltedge-callback?entityId=${entityId}`;

  try {
    // Use userId-scoped identifier so each user gets their own Salt Edge customer
    const customerId = await getOrCreateCustomer(`user-${session.user.id}`);
    const connectUrl = await createConnectSession(customerId, returnTo);
    return NextResponse.json({ link: connectUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create Salt Edge session";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
