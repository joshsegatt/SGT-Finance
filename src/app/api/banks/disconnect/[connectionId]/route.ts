import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { rateLimit, getIdentifier } from "@/lib/rateLimit";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ connectionId: string }> }
) {
  const { allowed } = rateLimit(getIdentifier(req), 10, 60_000);
  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { connectionId } = await params;

  const connection = await db.bankConnection.findUnique({
    where: { id: connectionId },
    include: { accounts: true },
  });

  if (!connection) {
    return NextResponse.json({ error: "Connection not found" }, { status: 404 });
  }

  // Delete all transactions for accounts in this connection, then accounts, then connection
  const accountIds = connection.accounts.map((a) => a.id);

  await db.transaction.deleteMany({ where: { accountId: { in: accountIds } } });
  await db.bankAccount.deleteMany({ where: { bankConnectionId: connectionId } });
  await db.bankConnection.delete({ where: { id: connectionId } });

  return NextResponse.json({ success: true });
}
