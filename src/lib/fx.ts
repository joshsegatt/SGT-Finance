/**
 * FX rates module — fetches live rates from open.er-api.com (free, no key required).
 * Falls back to hardcoded rates if the request fails.
 * Caches rates for 1 hour in memory.
 */

const FALLBACK: Record<string, number> = { GBP: 1, EUR: 0.86, USD: 0.79, CHF: 0.89 };

let cache: { rates: Record<string, number>; fetchedAt: number } | null = null;
const TTL_MS = 60 * 60 * 1000; // 1 hour

export async function getFxRates(base = "GBP"): Promise<Record<string, number>> {
  const now = Date.now();
  if (cache && now - cache.fetchedAt < TTL_MS) {
    return cache.rates;
  }

  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${base}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.result !== "success") throw new Error("API error");

    // Convert to "to-GBP" rates (how many GBP per unit of currency)
    // data.rates are base→X, so to convert X→GBP: 1 / rate
    const toGbp: Record<string, number> = { GBP: 1 };
    for (const [currency, rate] of Object.entries(data.rates as Record<string, number>)) {
      toGbp[currency] = 1 / rate;
    }

    cache = { rates: toGbp, fetchedAt: now };
    return toGbp;
  } catch (err) {
    console.warn("[FX] Failed to fetch rates, using fallback.", err);
    return FALLBACK;
  }
}

/** Returns GBP equivalent of an amount in the given currency */
export async function toGbp(amount: number, currency: string): Promise<number> {
  const rates = await getFxRates();
  const rate = rates[currency] ?? FALLBACK[currency] ?? 1;
  return amount * rate;
}

/** Synchronous version using fallback only (for places that can't await) */
export function toGbpSync(amount: number, currency: string): number {
  return amount * (FALLBACK[currency] ?? 1);
}
