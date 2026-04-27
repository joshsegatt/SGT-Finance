import "server-only";
import { db } from "@/lib/db";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ScopeGuess = "BUSINESS" | "PERSONAL" | null;

export interface CategorizationResult {
  scope: ScopeGuess;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  reason: string;
}

// ─── Keyword Dictionaries ────────────────────────────────────────────────────

const BUSINESS_KEYWORDS = [
  // Software & Infrastructure
  "aws", "amazon web services", "google cloud", "azure", "digitalocean",
  "heroku", "vercel", "netlify", "cloudflare", "github", "gitlab",
  "google workspace", "microsoft 365", "office 365", "slack", "notion",
  "figma", "adobe", "canva", "zoom", "jira", "confluence",
  // Operations
  "payroll", "salary", "wages", "contractor", "freelancer",
  "invoice", "consulting", "retainer", "development hours",
  "hosting", "domain", "ssl", "server",
  // Professional services
  "accountant", "solicitor", "lawyer", "legal", "audit",
  "insurance business", "professional indemnity",
  // Office
  "coworking", "wework", "office rent", "office supplies",
  "printer", "stationery",
  // Marketing
  "ads", "advertising", "google ads", "facebook ads", "linkedin",
  "marketing", "seo", "analytics",
] as const;

const PERSONAL_KEYWORDS = [
  // Transport
  "uber", "bolt", "lyft", "taxi",
  // Entertainment
  "netflix", "spotify", "disney", "hbo", "apple music", "youtube premium",
  "playstation", "xbox", "steam", "twitch",
  // Food & Living
  "groceries", "tesco", "sainsbury", "aldi", "lidl", "asda", "waitrose",
  "restaurant", "deliveroo", "uber eats", "just eat",
  "cafe", "starbucks", "costa",
  // Health & Fitness
  "gym", "puregym", "david lloyd", "pharmacy", "boots",
  "dentist", "doctor", "nhs",
  // Personal finance
  "mortgage", "rent payment", "council tax", "utility", "gas bill",
  "electric", "water bill", "broadband home",
  // Shopping
  "amazon marketplace", "ebay", "asos", "zara", "h&m", "primark",
  "john lewis", "argos",
] as const;

// Merchants that are almost always one or the other
const MERCHANT_OVERRIDES: Record<string, ScopeGuess> = {
  "amazon web services": "BUSINESS",
  "google workspace": "BUSINESS",
  "hmrc": "BUSINESS",
  "companies house": "BUSINESS",
  "netflix": "PERSONAL",
  "spotify": "PERSONAL",
  "deliveroo": "PERSONAL",
};

// ─── Core Categorization ─────────────────────────────────────────────────────

/**
 * Suggests whether a transaction is BUSINESS or PERSONAL
 * based on description keywords and amount patterns.
 *
 * Returns null if confidence is too low to suggest.
 */
export function suggestScope(
  description: string,
  amount?: number,
): CategorizationResult {
  const lower = description.toLowerCase().trim();

  // 1. Check merchant overrides (highest confidence)
  for (const [merchant, scope] of Object.entries(MERCHANT_OVERRIDES)) {
    if (lower.includes(merchant)) {
      return {
        scope,
        confidence: "HIGH",
        reason: `Merchant "${merchant}" is typically ${scope?.toLowerCase()}`,
      };
    }
  }

  // 2. Keyword matching with scoring
  let businessScore = 0;
  let personalScore = 0;
  const matchedBusiness: string[] = [];
  const matchedPersonal: string[] = [];

  for (const kw of BUSINESS_KEYWORDS) {
    if (lower.includes(kw)) {
      businessScore += 2;
      matchedBusiness.push(kw);
    }
  }

  for (const kw of PERSONAL_KEYWORDS) {
    if (lower.includes(kw)) {
      personalScore += 2;
      matchedPersonal.push(kw);
    }
  }

  // 3. Amount-based heuristics
  if (amount !== undefined) {
    const absAmount = Math.abs(amount);
    // Large round payments are often business (invoices, contracts)
    if (absAmount >= 1000 && absAmount % 100 === 0) {
      businessScore += 1;
    }
    // Small recurring amounts are often personal subscriptions
    if (absAmount < 30 && absAmount > 0) {
      personalScore += 0.5;
    }
  }

  // 4. Determine result
  const totalScore = businessScore + personalScore;

  if (totalScore === 0) {
    return {
      scope: null,
      confidence: "LOW",
      reason: "No matching keywords found in description",
    };
  }

  if (businessScore > personalScore) {
    const confidence =
      businessScore >= 4
        ? "HIGH"
        : businessScore >= 2
          ? "MEDIUM"
          : "LOW";
    return {
      scope: "BUSINESS",
      confidence,
      reason: `Matched business keywords: ${matchedBusiness.join(", ")}`,
    };
  }

  if (personalScore > businessScore) {
    const confidence =
      personalScore >= 4
        ? "HIGH"
        : personalScore >= 2
          ? "MEDIUM"
          : "LOW";
    return {
      scope: "PERSONAL",
      confidence,
      reason: `Matched personal keywords: ${matchedPersonal.join(", ")}`,
    };
  }

  // Tied score — can't determine
  return {
    scope: null,
    confidence: "LOW",
    reason: `Ambiguous: matched both business (${matchedBusiness.join(", ")}) and personal (${matchedPersonal.join(", ")})`,
  };
}

// ─── Batch Operations ────────────────────────────────────────────────────────

/**
 * Scans all transactions without a scope and suggests categorization.
 * Returns the IDs + suggestions for UI confirmation.
 */
export async function getUncategorizedTransactions(limit: number = 50) {
  const txs = await db.transaction.findMany({
    where: { scope: null },
    select: { id: true, description: true, amount: true, currency: true },
    take: limit,
    orderBy: { date: "desc" },
  });

  return txs.map((tx) => {
    const suggestion = suggestScope(tx.description, tx.amount);
    return {
      id: tx.id,
      description: tx.description,
      amount: tx.amount,
      currency: tx.currency,
      ...suggestion,
    };
  });
}

/**
 * Applies scope to a transaction (used after user confirms suggestion).
 */
export async function applyTransactionScope(
  transactionId: string,
  scope: "BUSINESS" | "PERSONAL",
): Promise<void> {
  await db.transaction.update({
    where: { id: transactionId },
    data: { scope },
  });
}

/**
 * Batch-applies HIGH confidence suggestions automatically.
 * Returns count of auto-categorized transactions.
 */
export async function autoCategorizeTransactions(): Promise<number> {
  const uncategorized = await getUncategorizedTransactions(200);
  const highConfidence = uncategorized.filter(
    (t) => t.scope !== null && t.confidence === "HIGH",
  );

  if (highConfidence.length === 0) return 0;

  await Promise.all(
    highConfidence.map((t) =>
      db.transaction.update({
        where: { id: t.id },
        data: { scope: t.scope! },
      }),
    ),
  );

  return highConfidence.length;
}
