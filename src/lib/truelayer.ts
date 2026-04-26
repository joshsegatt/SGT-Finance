/**
 * TrueLayer Data API client
 * Docs: https://docs.truelayer.com/
 * Sandbox auth:  https://auth.truelayer-sandbox.com
 * Sandbox data:  https://api.truelayer-sandbox.com/data/v1
 */

const IS_SANDBOX = process.env.NODE_ENV !== "production";

const AUTH_BASE = IS_SANDBOX
  ? "https://auth.truelayer-sandbox.com"
  : "https://auth.truelayer.com";

const API_BASE = IS_SANDBOX
  ? "https://api.truelayer-sandbox.com/data/v1"
  : "https://api.truelayer.com/data/v1";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TLTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface TLAccount {
  account_id: string;
  account_type: string; // TRANSACTION | SAVINGS | CREDIT_CARD
  display_name: string;
  currency: string;
  account_number: {
    iban?: string;
    number?: string;
    sort_code?: string;
  };
  provider: {
    display_name: string;
    logo_uri?: string;
    provider_id: string;
  };
  update_timestamp: string;
}

export interface TLBalance {
  current: number;
  available: number;
  currency: string;
  update_timestamp: string;
}

export interface TLTransaction {
  transaction_id: string;
  timestamp: string;
  description: string;
  transaction_type: string; // DEBIT | CREDIT
  transaction_category: string;
  amount: number;
  currency: string;
  merchant_name?: string;
  running_balance?: { amount: number; currency: string };
  meta?: Record<string, string>;
}

// ─── Auth URL builder ────────────────────────────────────────────────────────

/**
 * Builds the TrueLayer OAuth consent URL.
 * The user will be redirected here to pick their bank and authenticate.
 * @param redirectUri  Where TrueLayer should redirect after consent
 * @param state        Opaque value returned unchanged in the callback (we use entityId)
 */
export function buildAuthUrl(redirectUri: string, state: string): string {
  const clientId = process.env.TRUELAYER_CLIENT_ID;
  if (!clientId) throw new Error("TRUELAYER_CLIENT_ID is not set");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: "accounts balance transactions offline_access",
    redirect_uri: redirectUri,
    state,
    // Providers: cover UK + major EU/CH countries + sandbox mock bank
    providers: "uk-ob-all uk-oauth-all de-xs2a-all es-xs2a-all fr-xs2a-all it-xs2a-all pt-xs2a-all ch-xs2a-all at-xs2a-all nl-xs2a-all be-xs2a-all mock",
  });

  return `${AUTH_BASE}/?${params.toString()}`;
}

// ─── Token operations ────────────────────────────────────────────────────────

/** Exchanges an authorisation code for access + refresh tokens. */
export async function exchangeCode(code: string, redirectUri: string): Promise<TLTokens> {
  const clientId = process.env.TRUELAYER_CLIENT_ID;
  const clientSecret = process.env.TRUELAYER_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("TrueLayer credentials not set");

  const res = await fetch(`${AUTH_BASE}/connect/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }).toString(),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`TrueLayer token exchange failed ${res.status}: ${body}`);
  }

  return res.json() as Promise<TLTokens>;
}

/** Refreshes an expired access token using the refresh token. */
export async function refreshAccessToken(refreshToken: string): Promise<TLTokens> {
  const clientId = process.env.TRUELAYER_CLIENT_ID;
  const clientSecret = process.env.TRUELAYER_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("TrueLayer credentials not set");

  const res = await fetch(`${AUTH_BASE}/connect/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    }).toString(),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`TrueLayer token refresh failed ${res.status}: ${body}`);
  }

  return res.json() as Promise<TLTokens>;
}

// ─── Data API ────────────────────────────────────────────────────────────────

async function tlFetch<T>(path: string, accessToken: string): Promise<{ results: T }> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`TrueLayer ${res.status} on ${path}: ${body}`);
  }

  return res.json() as Promise<{ results: T }>;
}

export async function getAccounts(accessToken: string): Promise<TLAccount[]> {
  const { results } = await tlFetch<TLAccount[]>("/accounts", accessToken);
  return results;
}

export async function getBalance(accessToken: string, accountId: string): Promise<TLBalance> {
  const { results } = await tlFetch<TLBalance[]>(`/accounts/${accountId}/balance`, accessToken);
  return results[0];
}

export async function getTransactions(
  accessToken: string,
  accountId: string
): Promise<TLTransaction[]> {
  const { results } = await tlFetch<TLTransaction[]>(
    `/accounts/${accountId}/transactions`,
    accessToken
  );
  return results;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Maps TrueLayer transaction_category + description to a human category string. */
export function tlAutoCategory(category: string, description: string): string | null {
  const cat = (category ?? "").toLowerCase().replace(/_/g, "-");
  const desc = (description ?? "").toLowerCase();

  if (cat === "income") return "Income";
  if (cat === "salary") return "Salary";
  if (cat === "bills" || cat === "direct-debit") return "Bills";
  if (cat === "food-and-drink" || cat === "eating-out") return "Food & Drink";
  if (cat === "travel" || cat === "transport") return "Travel";
  if (cat === "shopping") return "Shopping";
  if (cat === "entertainment" || cat === "leisure") return "Entertainment";
  if (cat === "utilities") return "Utilities";
  if (cat === "tax") return "Tax";

  // Fallback keyword matching on description
  if (/salary|payroll|wages/.test(desc)) return "Salary";
  if (/rent|mortgage/.test(desc)) return "Rent & Property";
  if (/hmrc|tax|vat|irs/.test(desc)) return "Tax";
  if (/amazon|ebay|shopify|stripe|paypal/.test(desc)) return "E-commerce";
  if (/uber|bolt|lyft|taxi|train|flight|easyjet|ryanair/.test(desc)) return "Travel";
  if (/restaurant|cafe|coffee|starbucks|mcdonalds|deliveroo/.test(desc)) return "Food & Drink";
  if (/aws|google cloud|azure|vercel|github|notion|slack/.test(desc)) return "Software & SaaS";
  if (/insurance|aviva|axa|zurich/.test(desc)) return "Insurance";
  if (/dividend|interest|yield/.test(desc)) return "Investment Income";
  if (/electric|gas|water|broadband/.test(desc)) return "Utilities";

  return category || null;
}
