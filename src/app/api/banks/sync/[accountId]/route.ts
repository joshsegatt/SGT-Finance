import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getTransactions, getBalance, refreshAccessToken, tlAutoCategory } from "@/lib/truelayer";
import { rateLimit, getIdentifier } from "@/lib/rateLimit";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ accountId: string }> }
) {
  const { allowed } = rateLimit(`sync:${getIdentifier(req)}`, 30, 60_000);
  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { accountId } = await params;

  const bankAccount = await db.bankAccount.findUnique({
    where: { id: accountId },
    include: { connection: true },
  });

  if (!bankAccount) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const tlAccountId = bankAccount.externalId;
  if (!tlAccountId) {
    // Mock account — just update lastSync
    if (bankAccount.bankConnectionId) {
      await db.bankConnection.update({
        where: { id: bankAccount.bankConnectionId },
        data: { lastSync: new Date() },
      });
    }
    return NextResponse.json({ synced: 0, message: "Mock account — no real sync" });
  }

  const connection = bankAccount.connection;
  if (!connection?.accessToken) {
    return NextResponse.json({ error: "No access token for this connection" }, { status: 400 });
  }

  try {
    // Proactively refresh token if we have a refresh token
    let accessToken = connection.accessToken;
    if (connection.refreshToken) {
      try {
        const newTokens = await refreshAccessToken(connection.refreshToken);
        accessToken = newTokens.access_token;
        await db.bankConnection.update({
          where: { id: connection.id },
          data: { accessToken: newTokens.access_token, refreshToken: newTokens.refresh_token },
        });
      } catch {
        // Continue with existing access token if refresh fails
      }
    }

    const [transactions, balanceData] = await Promise.all([
      getTransactions(accessToken, tlAccountId),
      getBalance(accessToken, tlAccountId),
    ]);

    let synced = 0;
    for (const tx of transactions) {
      const externalId = tx.transaction_id;
      if (!externalId) continue;

      const amount = tx.amount;
      const currency = tx.currency;
      const description = tx.description;
      const date = new Date(tx.timestamp);
      const category = tlAutoCategory(tx.transaction_category, tx.description);

      await db.transaction.upsert({
        where: { accountId_externalId: { accountId: bankAccount.id, externalId } },
        create: { accountId: bankAccount.id, externalId, date, amount, currency, description, category, status: "COMPLETED" },
        update: { amount, description, date },
      });
      synced++;
    }

    await db.bankAccount.update({ where: { id: accountId }, data: { balance: balanceData.current } });

    if (bankAccount.bankConnectionId) {
      await db.bankConnection.update({
        where: { id: bankAccount.bankConnectionId },
        data: { lastSync: new Date(), status: "ACTIVE" },
      });
    }

    return NextResponse.json({ synced, balance: balanceData.current });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
