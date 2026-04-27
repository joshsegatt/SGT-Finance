import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { enabled } = await req.json();

  await db.user.update({
    where: { id: session.user.id },
    data: { twoFactorEnabled: !!enabled },
  });

  await createAuditLog(session.user.id, enabled ? "MFA_ENABLED" : "MFA_DISABLED", { type: "EMAIL" });

  return NextResponse.json({ ok: true });
}
