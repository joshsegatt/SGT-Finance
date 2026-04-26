import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getConnection, getConnectionAccounts } from "@/lib/saltedge";
import { rateLimit, getIdentifier } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  const { allowed } = rateLimit(getIdentifier(req), 10, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const connectionId = req.nextUrl.searchParams.get("connection_id");
  const entityId = req.nextUrl.searchParams.get("entityId");

  if (!connectionId || !entityId) {
    return NextResponse.json({ error: "Missing connection_id or entityId" }, { status: 400 });
  }

  try {
    const seConnection = await getConnection(connectionId);
    const seAccounts = await getConnectionAccounts(connectionId);

    const connection = await db.bankConnection.create({
      data: {
        provider: "SALTEDGE",
        institution: seConnection.provider_name,
        externalId: connectionId,
        status: "ACTIVE",
        lastSync: new Date(),
      },
    });

    let accountsCreated = 0;

    for (const acct of seAccounts) {
      const existing = await db.bankAccount.findUnique({
        where: { externalId: acct.id },
      });
      if (existing) continue;

      const nature = acct.nature?.toLowerCase() ?? "";
      const accountType =
        nature === "savings" ? "SAVINGS" :
        nature === "card" || nature === "credit_card" ? "CREDIT" :
        "CURRENT";

      await db.bankAccount.create({
        data: {
          entityId,
          bankConnectionId: connection.id,
          name: acct.name,
          accountType,
          currency: acct.currency_code,
          balance: acct.balance ?? 0,
          iban: acct.extra?.iban ?? null,
          externalId: acct.id,
        },
      });
      accountsCreated++;
    }

    return NextResponse.json({
      institution: seConnection.provider_name,
      accountsCreated,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Salt Edge callback failed";
    console.error("[saltedge callback]", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
