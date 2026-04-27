import "server-only";
import { db } from "@/lib/db";
import { getFxRates } from "@/lib/fx";
import {
  addMonths,
  startOfMonth,
  subMonths,
  format,
  isAfter,
  isBefore,
  endOfMonth,
} from "date-fns";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ForecastPoint {
  /** Label for the point: "May 26", "Jun 26", etc. */
  label: string;
  /** ISO date string */
  date: string;
  /** Projected balance at this point */
  projected: number;
  /** Breakdown: expected income for this period */
  expectedIncome: number;
  /** Breakdown: expected expenses for this period (positive number) */
  expectedExpenses: number;
  /** Whether this point is a projection (vs historical) */
  isProjection: boolean;
}

export interface ForecastResult {
  /** Historical data points (past months) */
  historical: ForecastPoint[];
  /** Projected data points (future months) */
  projections: ForecastPoint[];
  /** Combined timeline */
  timeline: ForecastPoint[];
  /** Current liquid balance (starting point) */
  currentBalance: number;
  /** Projected balance at end of forecast period */
  projectedBalance: number;
  /** Change from current to projected */
  balanceChange: number;
  /** Percentage change */
  balanceChangePct: number;
  /** Monthly average net cash flow used for projections */
  avgNetMonthly: number;
  /** Fixed monthly costs from active subscriptions */
  fixedMonthlyCosts: number;
  /** Average variable expenses (total avg expense - fixed) */
  variableMonthlyCosts: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Resolves the average monthly income and expense over the last N months,
 * using real transaction data grouped by calendar month.
 */
async function getMonthlyAverages(lookbackMonths: number = 3) {
  const fx = await getFxRates();
  const start = startOfMonth(subMonths(new Date(), lookbackMonths));

  const txs = await db.transaction.findMany({
    where: { date: { gte: start } },
    select: { date: true, amount: true, currency: true },
    orderBy: { date: "asc" },
  });

  // Bucket by month
  const months = new Map<string, { income: number; expense: number }>();
  for (let i = 0; i < lookbackMonths; i++) {
    const label = format(subMonths(new Date(), lookbackMonths - i), "yyyy-MM");
    months.set(label, { income: 0, expense: 0 });
  }

  for (const tx of txs) {
    const key = format(new Date(tx.date), "yyyy-MM");
    if (!months.has(key)) continue;
    const gbp = tx.amount * (fx[tx.currency] ?? 1);
    const entry = months.get(key)!;
    if (gbp > 0) entry.income += gbp;
    else entry.expense += Math.abs(gbp);
  }

  const data = Array.from(months.values());
  const count = Math.max(data.length, 1);

  return {
    avgIncome: data.reduce((s, m) => s + m.income, 0) / count,
    avgExpense: data.reduce((s, m) => s + m.expense, 0) / count,
    monthlyData: data,
  };
}

/**
 * Gets total fixed monthly costs from active subscriptions,
 * converted to GBP.
 */
async function getFixedMonthlyCosts(): Promise<number> {
  const fx = await getFxRates();

  const subs = await db.subscription.findMany({
    where: { status: "ACTIVE" },
    select: { amount: true, currency: true, interval: true },
  });

  return subs.reduce((total, sub) => {
    const gbp = Math.abs(sub.amount) * (fx[sub.currency] ?? 1);
    // Normalize to monthly
    switch (sub.interval) {
      case "WEEKLY":
        return total + gbp * 4.33;
      case "MONTHLY":
        return total + gbp;
      case "QUARTERLY":
        return total + gbp / 3;
      case "YEARLY":
      case "ANNUAL":
        return total + gbp / 12;
      default:
        return total + gbp; // assume monthly
    }
  }, 0);
}

/**
 * Gets current liquid balance (CHECKING + SAVINGS) in GBP.
 */
async function getLiquidBalance(): Promise<number> {
  const fx = await getFxRates();

  const accounts = await db.bankAccount.findMany({
    where: { accountType: { in: ["CHECKING", "CURRENT", "SAVINGS"] } },
    select: { balance: true, currency: true },
  });

  return accounts.reduce(
    (s, a) => s + a.balance * (fx[a.currency] ?? 1),
    0,
  );
}

/**
 * Gets upcoming known inflows: invoices that are SENT (expected payment).
 */
async function getExpectedInflows(): Promise<
  { amount: number; dueDate: Date }[]
> {
  const fx = await getFxRates();
  const now = new Date();

  const sent = await db.invoice.findMany({
    where: {
      status: { in: ["SENT", "DRAFT"] },
      dueDate: { gte: now },
    },
    include: { lines: { select: { amount: true } } },
  });

  return sent.map((inv) => ({
    amount:
      inv.lines.reduce((s, l) => s + l.amount, 0) *
      (fx[inv.currency] ?? 1),
    dueDate: new Date(inv.dueDate),
  }));
}

// ─── Core Forecast ───────────────────────────────────────────────────────────

/**
 * Generates a cash flow forecast for the next N months.
 *
 * Strategy:
 * 1. Start with current liquid balance
 * 2. For each future month:
 *    - Add average monthly income (weighted by trend if available)
 *    - Subtract fixed costs (active subscriptions)
 *    - Subtract variable costs (avg total expense - fixed costs)
 *    - Add known inflows (pending invoices with due dates in this month)
 * 3. Return a timeline of projected balance points
 *
 * @param forecastMonths Number of months to project (default: 3)
 * @param lookbackMonths Number of past months for averaging (default: 3)
 */
export async function getForecast(
  forecastMonths: number = 3,
  lookbackMonths: number = 3,
): Promise<ForecastResult> {
  const [
    { avgIncome, avgExpense, monthlyData },
    fixedMonthlyCosts,
    currentBalance,
    expectedInflows,
  ] = await Promise.all([
    getMonthlyAverages(lookbackMonths),
    getFixedMonthlyCosts(),
    getLiquidBalance(),
    getExpectedInflows(),
  ]);

  const variableMonthlyCosts = Math.max(0, avgExpense - fixedMonthlyCosts);
  const avgNetMonthly = avgIncome - avgExpense;

  // ── Build historical points ──

  const historical: ForecastPoint[] = monthlyData.map((m, i) => {
    const monthDate = subMonths(new Date(), lookbackMonths - i);
    return {
      label: format(monthDate, "MMM yy"),
      date: format(monthDate, "yyyy-MM-dd"),
      projected: 0, // will be back-calculated
      expectedIncome: m.income,
      expectedExpenses: m.expense,
      isProjection: false,
    };
  });

  // Back-calculate historical balances (approximate)
  // Walk backwards from current balance
  let runningBalance = currentBalance;
  for (let i = historical.length - 1; i >= 0; i--) {
    historical[i].projected = runningBalance;
    runningBalance -= historical[i].expectedIncome - historical[i].expectedExpenses;
  }

  // ── Build projection points ──

  // Detect income trend (is income growing or shrinking?)
  let trendMultiplier = 1;
  if (monthlyData.length >= 2) {
    const recent = monthlyData[monthlyData.length - 1].income;
    const prior = monthlyData[monthlyData.length - 2].income;
    if (prior > 0) {
      const momChange = (recent - prior) / prior;
      // Dampen the trend to avoid wild projections: use 50% of observed change
      trendMultiplier = 1 + momChange * 0.5;
      // Clamp between 0.7x and 1.3x to prevent extremes
      trendMultiplier = Math.max(0.7, Math.min(1.3, trendMultiplier));
    }
  }

  const projections: ForecastPoint[] = [];
  let projectedBalance = currentBalance;
  let projectedIncome = avgIncome;

  for (let m = 1; m <= forecastMonths; m++) {
    const monthStart = startOfMonth(addMonths(new Date(), m));
    const monthEnd = endOfMonth(monthStart);

    // Apply income trend
    const monthIncome = projectedIncome * trendMultiplier;
    projectedIncome = monthIncome; // compound for next month

    // Known inflows in this month (pending invoices)
    const knownInflows = expectedInflows
      .filter(
        (inv) =>
          !isBefore(inv.dueDate, monthStart) &&
          !isAfter(inv.dueDate, monthEnd),
      )
      .reduce((s, inv) => s + inv.amount, 0);

    // Total income: average trend + known inflows (avoid double-counting)
    const totalIncome = Math.max(monthIncome, knownInflows);
    const totalExpenses = fixedMonthlyCosts + variableMonthlyCosts;

    projectedBalance += totalIncome - totalExpenses;

    projections.push({
      label: format(monthStart, "MMM yy"),
      date: format(monthStart, "yyyy-MM-dd"),
      projected: Math.round(projectedBalance * 100) / 100,
      expectedIncome: Math.round(totalIncome * 100) / 100,
      expectedExpenses: Math.round(totalExpenses * 100) / 100,
      isProjection: true,
    });
  }

  const finalBalance = projectedBalance;
  const balanceChange = finalBalance - currentBalance;
  const balanceChangePct =
    currentBalance > 0
      ? Math.round((balanceChange / currentBalance) * 1000) / 10
      : 0;

  return {
    historical,
    projections,
    timeline: [...historical, ...projections],
    currentBalance: Math.round(currentBalance * 100) / 100,
    projectedBalance: Math.round(finalBalance * 100) / 100,
    balanceChange: Math.round(balanceChange * 100) / 100,
    balanceChangePct,
    avgNetMonthly: Math.round(avgNetMonthly * 100) / 100,
    fixedMonthlyCosts: Math.round(fixedMonthlyCosts * 100) / 100,
    variableMonthlyCosts: Math.round(variableMonthlyCosts * 100) / 100,
  };
}

// ─── Quick Accessors ─────────────────────────────────────────────────────────

/**
 * Returns projected balance for a specific horizon.
 * Use in dashboard KPIs: "Projected balance in 30 days".
 */
export async function getProjectedBalance(
  days: 30 | 60 | 90,
): Promise<{ projected: number; change: number; changePct: number }> {
  const months = Math.ceil(days / 30);
  const result = await getForecast(months, 3);
  return {
    projected: result.projectedBalance,
    change: result.balanceChange,
    changePct: result.balanceChangePct,
  };
}

/**
 * Returns the forecast data formatted for chart consumption.
 * Each point has: { month, income, expense, isProjection }
 * Can be directly appended to getMonthlyTransactions() output.
 */
export async function getForecastChartData(
  forecastMonths: number = 3,
): Promise<
  { month: string; income: number; expense: number; isProjection: boolean }[]
> {
  const result = await getForecast(forecastMonths, 3);

  return result.projections.map((p) => ({
    month: p.label,
    income: Math.round(p.expectedIncome),
    expense: Math.round(p.expectedExpenses),
    isProjection: true,
  }));
}
