import "server-only";
import { db } from "@/lib/db";
import { getFxRates } from "@/lib/fx";
import { startOfQuarter, startOfMonth, subMonths, endOfMonth } from "date-fns";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface EntityTaxProvision {
  entityId: string;
  entityName: string;
  currency: string;
  taxRegime: string | null;

  /** Revenue received this quarter (positive transactions on BUSINESS accounts) */
  quarterIncome: number;
  /** Costs incurred this quarter (negative transactions on BUSINESS accounts) */
  quarterExpenses: number;
  /** Income minus deductible expenses */
  taxableProfit: number;

  /** Corp tax rate from TaxProfile (e.g. 25% UK, 21% PT) */
  corporateTaxRate: number;
  /** Corp tax amount due on taxable profit */
  corporateTaxDue: number;

  /** VAT rate from TaxProfile (e.g. 20% UK, 23% PT) */
  vatRate: number;
  /** VAT collected on sales */
  vatCollected: number;
  /** VAT deductible on purchases */
  vatDeductible: number;
  /** Net VAT payable to authorities */
  vatPayable: number;

  /** Sum of corp tax + VAT */
  totalTaxExposure: number;
  /** How much has already been set aside */
  provisionedAmount: number;
  /** provisionedAmount / totalTaxExposure as 0-100 */
  provisionedPct: number;
  /** Blended effective rate on income */
  effectiveRate: number;
}

export interface AggregatedTaxSummary {
  entities: EntityTaxProvision[];
  totals: {
    income: number;
    expenses: number;
    corporateTaxDue: number;
    vatPayable: number;
    totalExposure: number;
    totalProvisioned: number;
    provisionedPct: number;
    effectiveRate: number;
  };
}

// ─── Default VAT rates by country ────────────────────────────────────────────

const DEFAULT_VAT: Record<string, number> = {
  UK: 20,
  PT: 23,
  DE: 19,
  FR: 20,
  ES: 21,
  IT: 22,
  NL: 21,
  CH: 8.1,
  US: 0, // no federal VAT
};

const DEFAULT_CORP_TAX: Record<string, number> = {
  UK: 25,
  PT: 21,
  DE: 15, // KStG (+ Soli ~15.825 total, but we keep simple)
  FR: 25,
  ES: 25,
  IT: 24,
  NL: 25.8,
  CH: 14.6,
  US: 21,
};

// ─── Core Engine ─────────────────────────────────────────────────────────────

/**
 * Calculates real-time tax provision for a single entity.
 * Uses actual transactions from the current fiscal quarter,
 * the entity's TaxProfile rates, and currency conversion to GBP.
 */
export async function calculateEntityTaxProvision(
  entityId: string,
): Promise<EntityTaxProvision | null> {
  const fx = await getFxRates();

  const entity = await db.entity.findUnique({
    where: { id: entityId },
    include: {
      taxProfile: true,
      bankAccounts: {
        include: {
          transactions: {
            where: {
              taxRelevant: true,
              date: { gte: startOfQuarter(new Date()) },
            },
            select: { amount: true, currency: true, scope: true } as any,
          },
        },
      },
    },
  });

  if (!entity) return null;

  const toGbp = (amount: number, currency: string) =>
    amount * (fx[currency] ?? 1);

  // Only BUSINESS-scoped transactions count for tax
  const businessTxs = (entity as any).bankAccounts.flatMap((acc: any) =>
    acc.transactions.filter((tx: any) => {
      // Transaction.scope overrides Entity.scope
      const scope = tx.scope ?? (entity as any).scope;
      return scope === "BUSINESS";
    }),
  );

  const quarterIncome = businessTxs
    .filter((t: any) => t.amount > 0)
    .reduce((s: number, t: any) => s + toGbp(t.amount, t.currency), 0);

  const quarterExpenses = businessTxs
    .filter((t: any) => t.amount < 0)
    .reduce((s: number, t: any) => s + toGbp(Math.abs(t.amount), t.currency), 0);

  const taxableProfit = Math.max(0, quarterIncome - quarterExpenses);

  // Resolve rates: TaxProfile > country default > 0
  const corporateTaxRate =
    (entity as any).taxProfile?.corporateTaxRate ??
    DEFAULT_CORP_TAX[entity.country] ??
    0;

  const vatRate =
    (entity as any).taxProfile?.vatRate ?? DEFAULT_VAT[entity.country] ?? 0;

  const corporateTaxDue = taxableProfit * (corporateTaxRate / 100);

  // VAT: collected on sales, deductible on purchases
  const vatCollected = quarterIncome * (vatRate / 100);
  const vatDeductible = quarterExpenses * (vatRate / 100);
  const vatPayable = Math.max(0, vatCollected - vatDeductible);

  const totalTaxExposure = corporateTaxDue + vatPayable;
  const provisionedAmount = (entity as any).taxProfile?.provisionedAmount ?? 0;
  const provisionedPct =
    totalTaxExposure > 0
      ? Math.min(100, Math.round((provisionedAmount / totalTaxExposure) * 100))
      : 100; // fully provisioned if nothing owed

  const effectiveRate =
    quarterIncome > 0
      ? Math.round((totalTaxExposure / quarterIncome) * 1000) / 10
      : 0;

  return {
    entityId: entity.id,
    entityName: entity.name,
    currency: entity.currency,
    taxRegime: (entity as any).taxProfile?.taxRegime ?? null,
    quarterIncome,
    quarterExpenses,
    taxableProfit,
    corporateTaxRate,
    corporateTaxDue,
    vatRate,
    vatCollected,
    vatDeductible,
    vatPayable,
    totalTaxExposure,
    provisionedAmount,
    provisionedPct,
    effectiveRate,
  };
}

/**
 * Aggregated tax provision across all BUSINESS entities.
 * This is the function `getDashboardKPIs()` should call instead of
 * the current hardcoded `totalBalance * 0.065`.
 */
export async function getAggregatedTaxSummary(userId: string): Promise<AggregatedTaxSummary> {
  const businessEntities = await db.entity.findMany({
    where: { userId, scope: "BUSINESS" } as any,
    select: { id: true },
  });

  const provisions = await Promise.all(
    businessEntities.map((e) => calculateEntityTaxProvision(e.id)),
  );

  const entities = provisions.filter(
    (p): p is EntityTaxProvision => p !== null,
  );

  const income = entities.reduce((s, e) => s + e.quarterIncome, 0);
  const expenses = entities.reduce((s, e) => s + e.quarterExpenses, 0);
  const corporateTaxDue = entities.reduce(
    (s, e) => s + e.corporateTaxDue,
    0,
  );
  const vatPayable = entities.reduce((s, e) => s + e.vatPayable, 0);
  const totalExposure = corporateTaxDue + vatPayable;
  const totalProvisioned = entities.reduce(
    (s, e) => s + e.provisionedAmount,
    0,
  );
  const provisionedPct =
    totalExposure > 0
      ? Math.min(100, Math.round((totalProvisioned / totalExposure) * 100))
      : 100;
  const effectiveRate =
    income > 0
      ? Math.round((totalExposure / income) * 1000) / 10
      : 0;

  return {
    entities,
    totals: {
      income,
      expenses,
      corporateTaxDue,
      vatPayable,
      totalExposure,
      totalProvisioned,
      provisionedPct,
      effectiveRate,
    },
  };
}

/**
 * Quick accessor: returns the real tax exposure number for the dashboard KPI.
 * Drop-in replacement for `totalBalance * 0.065`.
 */
export async function getRealTaxExposure(userId: string): Promise<number> {
  const summary = await getAggregatedTaxSummary(userId);
  return summary.totals.totalExposure;
}

/**
 * Updates the provisionedAmount for a given entity's tax profile.
 * Called when the user manually sets aside funds for taxes.
 */
export async function updateTaxProvision(
  entityId: string,
  amount: number,
): Promise<void> {
  await db.taxProfile.update({
    where: { entityId },
    data: { provisionedAmount: amount } as any,
  });
}

// ─── Financial Mix (Business vs Personal) ────────────────────────────────────

export interface FinancialMix {
  business: number;
  personal: number;
  total: number;
  businessPct: number;
  personalPct: number;
}

/**
 * Calculates the Business vs Personal split using Entity.scope.
 * All balances are converted to GBP.
 */
export async function getFinancialMix(userId: string): Promise<FinancialMix> {
  const [accounts, fx] = await Promise.all([
    db.bankAccount.findMany({
      include: { entity: { select: { scope: true } as any } },
      where: { entity: { userId } as any, balance: { not: 0 } },
    }),
    getFxRates(),
  ]);

  let business = 0;
  let personal = 0;

  for (const acc of accounts) {
    const gbp = acc.balance * (fx[acc.currency] ?? 1);
    if ((acc as any).entity.scope === "BUSINESS") {
      business += gbp;
    } else {
      personal += gbp;
    }
  }

  const total = business + personal;

  return {
    business,
    personal,
    total,
    businessPct: total > 0 ? Math.round((business / total) * 100) : 0,
    personalPct: total > 0 ? Math.round((personal / total) * 100) : 0,
  };
}
