/**
 * GoCardless Bank Account Data (Nordigen) API client
 * Docs: https://developer.gocardless.com/bank-account-data/overview
 * Base URL: https://bankaccountdata.gocardless.com/api/v2/
 */

const BASE_URL = "https://bankaccountdata.gocardless.com/api/v2";

// ─── Token cache (module-level singleton) ─────────────────────────────────────

interface TokenCache {
  access: string;
  expiresAt: number; // epoch ms
}

let tokenCache: TokenCache | null = null;

async function getAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt - 60_000) {
    return tokenCache.access;
  }

  const secretId = process.env.GOCARDLESS_SECRET_ID;
  const secretKey = process.env.GOCARDLESS_SECRET_KEY;

  if (!secretId || !secretKey) {
    throw new Error("GOCARDLESS_SECRET_ID and GOCARDLESS_SECRET_KEY are not set");
  }

  const res = await fetch(`${BASE_URL}/token/new/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret_id: secretId, secret_key: secretKey }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GoCardless token error ${res.status}: ${body}`);
  }

  const data = await res.json();
  tokenCache = {
    access: data.access as string,
    expiresAt: Date.now() + (data.access_expires as number) * 1000,
  };

  return tokenCache.access;
}

async function gcFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getAccessToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GoCardless ${res.status} on ${path}: ${body}`);
  }

  return res.json() as Promise<T>;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GCInstitution {
  id: string;
  name: string;
  bic: string;
  transaction_total_days: string;
  countries: string[];
  logo: string;
}

export interface GCRequisition {
  id: string;
  status: string;
  link: string;
  accounts: string[];
  institution_id: string;
  reference: string;
  redirect: string;
}

export interface GCAccountDetails {
  resourceId: string;
  iban?: string;
  currency: string;
  ownerName?: string;
  name?: string;
  product?: string;
  cashAccountType?: string;
}

export interface GCBalance {
  balanceAmount: { amount: string; currency: string };
  balanceType: string;
  referenceDate?: string;
}

export interface GCTransaction {
  transactionId?: string;
  internalTransactionId?: string;
  bookingDate?: string;
  valueDate?: string;
  transactionAmount: { amount: string; currency: string };
  creditorName?: string;
  debtorName?: string;
  remittanceInformationUnstructured?: string;
  remittanceInformationStructured?: string;
  purposeCode?: string;
  proprietaryBankTransactionCode?: string;
  merchantCategoryCode?: string;
}

// ─── Public API methods ───────────────────────────────────────────────────────

export async function getInstitutions(country: string): Promise<GCInstitution[]> {
  return gcFetch<GCInstitution[]>(`/institutions/?country=${country.toUpperCase()}`);
}

export async function createRequisition(
  institutionId: string,
  redirectUri: string,
  reference: string,
  userLanguage = "EN"
): Promise<GCRequisition> {
  return gcFetch<GCRequisition>("/requisitions/", {
    method: "POST",
    body: JSON.stringify({
      redirect: redirectUri,
      institution_id: institutionId,
      reference,
      user_language: userLanguage,
    }),
  });
}

export async function getRequisition(requisitionId: string): Promise<GCRequisition> {
  return gcFetch<GCRequisition>(`/requisitions/${requisitionId}/`);
}

export async function getAccountDetails(
  accountId: string
): Promise<{ account: GCAccountDetails }> {
  return gcFetch<{ account: GCAccountDetails }>(`/accounts/${accountId}/details/`);
}

export async function getAccountBalances(
  accountId: string
): Promise<{ balances: GCBalance[] }> {
  return gcFetch<{ balances: GCBalance[] }>(`/accounts/${accountId}/balances/`);
}

export async function getAccountTransactions(
  accountId: string,
  dateFrom?: string
): Promise<{ transactions: { booked: GCTransaction[]; pending: GCTransaction[] } }> {
  const qs = dateFrom ? `?date_from=${dateFrom}` : "";
  return gcFetch(`/accounts/${accountId}/transactions/${qs}`);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Picks the best available balance from the GoCardless response.
 * Priority: closingBooked → expected → interimAvailable → first available
 */
export function pickBalance(balances: GCBalance[]): number {
  const priority = ["closingBooked", "expected", "interimAvailable"];
  for (const type of priority) {
    const b = balances.find((b) => b.balanceType === type);
    if (b) return parseFloat(b.balanceAmount.amount);
  }
  if (balances.length > 0) return parseFloat(balances[0].balanceAmount.amount);
  return 0;
}

/**
 * Derives a human-readable description from a GoCardless transaction.
 */
export function transactionDescription(tx: GCTransaction): string {
  return (
    tx.remittanceInformationUnstructured ||
    tx.remittanceInformationStructured ||
    tx.creditorName ||
    tx.debtorName ||
    tx.proprietaryBankTransactionCode ||
    "Bank transaction"
  );
}

/**
 * Auto-categorise transaction by keyword matching on the description.
 */
export function autoCategory(description: string): string | null {
  const d = description.toLowerCase();
  if (/salary|payroll|wages/.test(d)) return "Salary";
  if (/rent|mortgage|property/.test(d)) return "Rent & Property";
  if (/amazon|ebay|shopify|stripe|paypal/.test(d)) return "E-commerce";
  if (/uber|bolt|lyft|taxi|transport|rail|train|flight|easyjet|ryanair/.test(d)) return "Travel";
  if (/restaurant|cafe|coffee|starbucks|costa|mcdonalds|deliveroo|just eat/.test(d)) return "Food & Drink";
  if (/saas|software|aws|google cloud|azure|vercel|github|notion|slack/.test(d)) return "Software & SaaS";
  if (/insurance|aviva|axa|zurich/.test(d)) return "Insurance";
  if (/hmrc|tax|vat|irs/.test(d)) return "Tax";
  if (/dividend|interest|yield/.test(d)) return "Investment Income";
  if (/utility|electric|gas|water|broadband|bt |virgin media/.test(d)) return "Utilities";
  if (/salary|consultant|invoice|client/.test(d)) return "Professional Services";
  return null;
}
