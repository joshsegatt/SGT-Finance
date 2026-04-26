/**
 * Salt Edge Account Information API v5 client
 * Docs: https://docs.saltedge.com/account_information/v5/
 *
 * NOTE: API v5 is scheduled for deprecation. Migrate to v6 when ready:
 * https://docs.saltedge.com/v6/#migration-guide
 *
 * Auth: App-id + Secret headers (service API keys)
 * Env:  SALTEDGE_APP_ID, SALTEDGE_SECRET
 */

const BASE = "https://www.saltedge.com/api/v5";

function seHeaders(): Record<string, string> {
  const appId = process.env.SALTEDGE_APP_ID;
  const secret = process.env.SALTEDGE_SECRET;
  if (!appId || !secret) {
    throw new Error("SALTEDGE_APP_ID and SALTEDGE_SECRET environment variables must be set");
  }
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    "App-id": appId,
    Secret: secret,
  };
}

async function seRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { ...seHeaders(), ...(options?.headers ?? {}) },
  });
  const body = await res.json();
  if (!res.ok) {
    const msg =
      body?.error?.message ?? `Salt Edge API error ${res.status}: ${res.statusText}`;
    throw new Error(msg);
  }
  return body.data as T;
}

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SECustomer {
  id: string;
  identifier: string;
  secret: string;
}

export interface SEConnectSession {
  expires_at: string;
  connect_url: string;
}

export interface SEConnection {
  id: string;
  provider_name: string;
  provider_code: string;
  status: string;
  customer_id: string;
  country_code: string;
}

export interface SEAccount {
  id: string;
  name: string;
  nature: string; // "account" | "card" | "savings" | "bonus" | ...
  balance: number;
  currency_code: string;
  connection_id: string;
  extra?: {
    iban?: string;
    account_number?: string;
    sort_code?: string;
    card_type?: string;
    cards?: string[];
  };
}

// ─── Customer management ────────────────────────────────────────────────────

/**
 * Returns the Salt Edge customer ID for a given identifier.
 * Creates a new customer if one does not exist.
 */
export async function getOrCreateCustomer(identifier: string): Promise<string> {
  // Check if customer already exists
  const existing = await seRequest<SECustomer[]>(
    `/customers?identifier=${encodeURIComponent(identifier)}`
  );
  if (existing.length > 0) return existing[0].id;

  // Create new customer
  const customer = await seRequest<SECustomer>("/customers", {
    method: "POST",
    body: JSON.stringify({ data: { identifier } }),
  });
  return customer.id;
}

// ─── Connect session ─────────────────────────────────────────────────────────

/**
 * Creates a Salt Edge Connect session.
 * Returns the connect_url to redirect the user to.
 *
 * @param customerId - Salt Edge customer ID
 * @param returnTo   - URL to redirect back to after bank auth
 */
export async function createConnectSession(
  customerId: string,
  returnTo: string
): Promise<string> {
  const fromDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const session = await seRequest<SEConnectSession>("/connect_sessions/create", {
    method: "POST",
    body: JSON.stringify({
      data: {
        customer_id: customerId,
        consent: {
          scopes: ["account_details", "transactions_details"],
          from_date: fromDate,
        },
        attempt: {
          return_to: returnTo,
          fetch_scopes: ["accounts", "transactions"],
        },
        return_connection_id: true,
        daily_refresh: false,
      },
    }),
  });
  return session.connect_url;
}

// ─── Connection & accounts ───────────────────────────────────────────────────

export async function getConnection(connectionId: string): Promise<SEConnection> {
  return seRequest<SEConnection>(`/connections/${connectionId}`);
}

export async function getConnectionAccounts(connectionId: string): Promise<SEAccount[]> {
  return seRequest<SEAccount[]>(`/accounts?connection_id=${connectionId}`);
}
