import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { exchangeCode, getAccounts, getBalance } from "@/lib/truelayer";
import { rateLimit, getIdentifier } from "@/lib/rateLimit";

import { checkQuota } from "@/lib/plans";

export async function GET(req: NextRequest) {
  const { allowed } = rateLimit(getIdentifier(req), 10, 60_000);
  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });


  // TrueLayer returns ?code=...&state=entityId on success, or ?error=...
  const code = req.nextUrl.searchParams.get("code");
  const entityId = req.nextUrl.searchParams.get("state");
  const tlError = req.nextUrl.searchParams.get("error");

  if (tlError) {
    const desc = req.nextUrl.searchParams.get("error_description") ?? tlError;
    return NextResponse.json({ error: desc }, { status: 400 });
  }

  if (!code || !entityId) {
    return NextResponse.json({ error: "Missing code or state parameter" }, { status: 400 });
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? process.env.AUTH_URL ?? "http://localhost:3005";
  const redirectUri = `${baseUrl}/accounts/callback`;

  try {
    const tokens = await exchangeCode(code, redirectUri);
    const accounts = await getAccounts(tokens.access_token);

    if (!accounts || accounts.length === 0) {
      return NextResponse.json(
        { error: "No accounts returned. The user may have cancelled bank authorisation." },
        { status: 422 }
      );
    }

    const institution = accounts[0].provider.display_name;

    const connection = await db.bankConnection.create({
      data: {
        userId: session.user.id,
        provider: "TRUELAYER",
        institution,
        status: "ACTIVE",
        lastSync: new Date(),
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      },
    });

    let accountsCreated = 0;

    for (const tlAccount of accounts) {
      const isAllowed = await checkQuota(user.plan, "bankAccounts", user.id);
      if (!isAllowed) break;

      const existing = await db.bankAccount.findUnique({
        where: { externalId: tlAccount.account_id },
      });
      if (existing) continue;


      const balance = await getBalance(tokens.access_token, tlAccount.account_id).catch(
        () => ({ current: 0, available: 0, currency: tlAccount.currency, update_timestamp: "" })
      );

      const accountType =
        tlAccount.account_type === "SAVINGS" ? "SAVINGS" :
        tlAccount.account_type === "CREDIT_CARD" ? "CREDIT" :
        "CURRENT";

      await db.bankAccount.create({
        data: {
          entityId,
          bankConnectionId: connection.id,
          name: tlAccount.display_name,
          accountType,
          currency: tlAccount.currency,
          balance: balance.current ?? 0,
          iban: tlAccount.account_number?.iban ?? null,
          externalId: tlAccount.account_id,
        },
      });

      accountsCreated++;
    }

    return NextResponse.json({ accountsCreated, institution });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Callback processing failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
