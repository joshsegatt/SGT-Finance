import "server-only";
import { db } from "@/lib/db";
import { startOfMonth, subMonths, format } from "date-fns";
import { getFxRates } from "@/lib/fx";
import { getAggregatedTaxSummary, getFinancialMix } from "@/lib/tax-engine";
import { getForecastChartData } from "@/lib/forecast";

// ─── Dashboard ───────────────────────────────────────────────────────────────

export async function getDashboardKPIs(userId: string) {
  const [accounts, invoices, alerts, fx, taxSummary, financialMix] = await Promise.all([
    db.bankAccount.findMany({ 
      where: { entity: { userId } },
      select: { balance: true, accountType: true, currency: true } 
    }),
    db.invoice.findMany({
      where: { entity: { userId }, status: "OVERDUE" },
      include: { lines: true },
    }),
    db.alert.findMany({ where: { userId, isRead: false } }),
    getFxRates(),
    getAggregatedTaxSummary(userId),
    getFinancialMix(userId),
  ]);

  const toGbp = (amount: number, currency: string) =>
    amount * (fx[currency] ?? 1);

  const totalBalance = accounts.reduce(
    (sum, a) => sum + toGbp(a.balance, a.currency),
    0
  );

  const cashReserve = accounts
    .filter((a) => a.accountType === "SAVINGS")
    .reduce((sum, a) => sum + toGbp(a.balance, a.currency), 0);

  // Real tax exposure from tax engine (replaces hardcoded 6.5%)
  const taxExposure = taxSummary.totals.totalExposure;

  const overdueInvoicesTotal = invoices.reduce(
    (sum, inv) => sum + inv.lines.reduce((s, l) => s + l.amount, 0),
    0
  );

  return {
    totalBalance,
    cashReserve,
    taxExposure,
    taxProvision: {
      effectiveRate: taxSummary.totals.effectiveRate,
      provisionedPct: taxSummary.totals.provisionedPct,
      corporateTaxDue: taxSummary.totals.corporateTaxDue,
      vatPayable: taxSummary.totals.vatPayable,
    },
    financialMix,
    overdueInvoicesCount: invoices.length,
    overdueInvoicesTotal,
    unreadAlerts: alerts.length,
  };
}

export async function getMonthlyTransactions(userId: string, months: number = 6) {
  const [start, fx] = [startOfMonth(subMonths(new Date(), months - 1)), await getFxRates()];
  const txs = await db.transaction.findMany({
    where: { 
      account: { entity: { userId } },
      date: { gte: start } 
    },
    select: { date: true, amount: true, currency: true },
    orderBy: { date: "asc" },
  });

  // Group by month
  const map = new Map<string, { income: number; expense: number }>();
  for (let i = 0; i < months; i++) {
    const label = format(subMonths(new Date(), months - 1 - i), "MMM yy");
    map.set(label, { income: 0, expense: 0 });
  }

  for (const tx of txs) {
    const label = format(new Date(tx.date), "MMM yy");
    if (!map.has(label)) continue;
    const gbp = tx.amount * (fx[tx.currency] ?? 1);
    const entry = map.get(label)!;
    if (gbp > 0) entry.income += gbp;
    else entry.expense += Math.abs(gbp);
  }

  return Array.from(map.entries()).map(([month, v]) => ({ month, ...v }));
}

export async function getRecentTransactions(userId: string, limit: number = 8) {
  return db.transaction.findMany({
    where: { account: { entity: { userId } } },
    take: limit,
    orderBy: { date: "desc" },
    include: { account: { include: { entity: true } } },
  });
}

// ─── Smart Alerts ─────────────────────────────────────────────────────────────

/** Auto-mark invoices as OVERDUE when dueDate has passed */
async function autoMarkOverdueInvoices(userId: string) {
  const today = new Date();
  await db.invoice.updateMany({
    where: {
      entity: { userId },
      dueDate: { lt: today },
      status: { in: ["DRAFT", "SENT"] },
    },
    data: { status: "OVERDUE" },
  });
}

async function syncSmartAlerts(userId: string) {
  const today = new Date();
  const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  const [overdueInvoices, upcomingDeadlines, wastedSubs] = await Promise.all([
    db.invoice.findMany({
      where: { entity: { userId }, dueDate: { lt: today }, status: { notIn: ["PAID", "CANCELLED"] } },
      include: { client: true },
      take: 8,
      orderBy: { dueDate: "asc" },
    }),
    db.taxDeadline.findMany({
      where: { taxProfile: { entity: { userId } }, date: { gte: today, lte: in30Days }, status: { not: "COMPLETED" } },
      include: { taxProfile: { include: { entity: true } } },
      take: 8,
      orderBy: { date: "asc" },
    }),
    db.subscription.findMany({
      where: { userId, wasteDetected: true, status: "ACTIVE" },
      take: 5,
    }),
  ]);

  // Compute valid smart IDs
  const validIds: string[] = [
    ...overdueInvoices.map((inv) => `smart-inv-${inv.id}`),
    ...upcomingDeadlines.map((dl) => `smart-dl-${dl.id}`),
    ...wastedSubs.map((sub) => `smart-sub-${sub.id}`),
  ];

  // Delete smart alerts whose source is resolved
  const existingSmartAlerts = await db.alert.findMany({
    where: { id: { startsWith: "smart-" } },
    select: { id: true },
  });
  const toDelete = existingSmartAlerts
    .map((a) => a.id)
    .filter((id) => !validIds.includes(id));
  if (toDelete.length > 0) {
    await db.alert.deleteMany({ where: { id: { in: toDelete } } });
  }

  // Upsert current smart alerts (preserves isRead on update)
  const ops: Promise<unknown>[] = [
    ...overdueInvoices.map((inv) => {
      const daysOverdue = Math.max(
        1,
        Math.floor((today.getTime() - new Date(inv.dueDate).getTime()) / (1000 * 60 * 60 * 24))
      );
      const desc = `Invoice ${inv.number} to ${inv.client.name} is overdue by ${daysOverdue} day${daysOverdue !== 1 ? "s" : ""}.`;
      return db.alert.upsert({
        where: { id: `smart-inv-${inv.id}` },
        create: { id: `smart-inv-${inv.id}`, userId, title: "Overdue Invoice", description: desc, type: "OVERDUE" },
        update: { description: desc },
      });
    }),
    ...upcomingDeadlines.map((dl) => {
      const daysLeft = Math.max(
        1,
        Math.ceil((new Date(dl.date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      );
      const desc = `${dl.title} for ${dl.taxProfile.entity.name} is due in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}.`;
      return db.alert.upsert({
        where: { id: `smart-dl-${dl.id}` },
        create: { id: `smart-dl-${dl.id}`, userId, title: "Tax Deadline Approaching", description: desc, type: "DEADLINE" },
        update: { description: desc },
      });
    }),
    ...wastedSubs.map((sub) => {
      const desc = `${sub.name} hasn't seen recent activity. Consider cancelling to save ${new Intl.NumberFormat("en-GB", { style: "currency", currency: sub.currency.toUpperCase(), maximumFractionDigits: 0 }).format(sub.amount)}/mo.`;
      return db.alert.upsert({
        where: { id: `smart-sub-${sub.id}` },
        create: { id: `smart-sub-${sub.id}`, userId, title: "Unused Subscription Detected", description: desc, type: "WASTE" },
        update: { description: desc },
      });
    }),
  ];

  await Promise.all(ops);
}

export async function getAlerts(userId: string) {
  await autoMarkOverdueInvoices(userId);
  await syncSmartAlerts(userId);
  return db.alert.findMany({
    where: { userId },
    orderBy: [{ isRead: "asc" }, { createdAt: "desc" }],
  });
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export type TransactionFilters = {
  search?: string;
  category?: string;
  status?: string;
  accountId?: string;
  from?: string;
  to?: string;
  sort?: string;
  order?: string;
  page?: number;
};

const PAGE_SIZE = 50;

export async function getTransactions(userId: string, filters: TransactionFilters = {}) {
  const { search, category, status, accountId, from, to, sort = "date", order = "desc", page = 1 } = filters;

  const validSortFields = ["date", "amount", "description", "category", "status"] as const;
  const sortField = validSortFields.includes(sort as (typeof validSortFields)[number])
    ? (sort as (typeof validSortFields)[number])
    : "date";
  const sortOrder = order === "asc" ? "asc" : "desc";

  const where = {
    account: { entity: { userId } },
    ...(search ? { description: { contains: search, mode: "insensitive" as const } } : {}),
    ...(category && category !== "all" ? { category } : {}),
    ...(status && status !== "all" ? { status } : {}),
    ...(accountId && accountId !== "all" ? { accountId } : {}),
    ...(from || to
      ? {
          date: {
            ...(from ? { gte: new Date(from) } : {}),
            ...(to ? { lte: new Date(to + "T23:59:59.999Z") } : {}),
          },
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    db.transaction.findMany({
      where,
      orderBy: { [sortField]: sortOrder },
      include: { account: { include: { entity: true } }, subscription: true },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    db.transaction.count({ where }),
  ]);

  return { items, total, page, pageSize: PAGE_SIZE, totalPages: Math.ceil(total / PAGE_SIZE) };
}

export async function getTransactionById(userId: string, id: string) {
  return db.transaction.findFirst({
    where: { id, account: { entity: { userId } } },
    include: { account: { include: { entity: true } }, subscription: true },
  });
}

export async function getTransactionCategories(userId: string) {
  const txs = await db.transaction.findMany({
    select: { category: true },
    distinct: ["category"],
    where: { account: { entity: { userId } }, category: { not: null } },
  });
  return txs.map((t) => t.category).filter(Boolean) as string[];
}

export async function getBankAccounts(userId: string) {
  return db.bankAccount.findMany({
    where: { entity: { userId } },
    include: { entity: true, connection: true },
    orderBy: { name: "asc" },
  });
}

// ─── Invoices ────────────────────────────────────────────────────────────────

export async function getInvoiceAging(userId: string) {
  const today = new Date();
  const unpaid = await db.invoice.findMany({
    where: { entity: { userId }, status: { notIn: ["PAID", "CANCELLED", "DRAFT"] } },
    include: { client: true, lines: { select: { amount: true, taxRate: true } } },
    orderBy: { dueDate: "asc" },
  });

  const buckets = {
    current: { count: 0, total: 0, invoices: [] as typeof unpaid },
    days30: { count: 0, total: 0, invoices: [] as typeof unpaid },
    days60: { count: 0, total: 0, invoices: [] as typeof unpaid },
    days90plus: { count: 0, total: 0, invoices: [] as typeof unpaid },
  };

  for (const inv of unpaid) {
    const daysOverdue = Math.floor(
      (today.getTime() - new Date(inv.dueDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    const total = inv.lines.reduce((s, l) => s + l.amount * (1 + l.taxRate / 100), 0);

    const bucket =
      daysOverdue <= 0
        ? "current"
        : daysOverdue <= 30
        ? "days30"
        : daysOverdue <= 60
        ? "days60"
        : "days90plus";

    buckets[bucket].count++;
    buckets[bucket].total += total;
    buckets[bucket].invoices.push(inv);
  }

  return buckets;
}

export async function getInvoices(userId: string, filters: { status?: string; clientId?: string } = {}) {
  const { status, clientId } = filters;
  return db.invoice.findMany({
    where: {
      entity: { userId },
      ...(status && status !== "all" ? { status } : {}),
      ...(clientId && clientId !== "all" ? { clientId } : {}),
    },
    include: { client: true, entity: true, lines: true },
    orderBy: { date: "desc" },
  });
}

export async function getInvoiceById(userId: string, id: string) {
  return db.invoice.findFirst({
    where: { id, entity: { userId } },
    include: { client: true, entity: true, lines: true },
  });
}

// ─── Subscriptions ───────────────────────────────────────────────────────────

export async function getSubscriptions(userId: string) {
  return db.subscription.findMany({
    where: { userId },
    orderBy: { amount: "desc" },
    include: { transactions: { take: 1, orderBy: { date: "desc" } } },
  });
}

// ─── Tax ─────────────────────────────────────────────────────────────────────

export async function getTaxSummary(userId: string) {
  return db.entity.findMany({
    where: { userId },
    include: {
      taxProfile: { include: { deadlines: { orderBy: { date: "asc" } } } },
      bankAccounts: { select: { balance: true, currency: true } },
    },
    orderBy: { name: "asc" },
  });
}

// ─── Clients ─────────────────────────────────────────────────────────────────

export async function getClients(userId: string, search?: string) {
  const clients = await db.client.findMany({
    where: {
      userId,
      ...(search ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        } : {}),
    },
    include: {
      _count: { select: { entities: true, invoices: true } },
      invoices: {
        select: {
          status: true,
          lines: { select: { amount: true } },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return clients.map((c) => {
    const totalInvoiced = c.invoices.reduce(
      (sum, inv) => sum + inv.lines.reduce((s, l) => s + l.amount, 0),
      0,
    );
    const totalPaid = c.invoices
      .filter((inv) => inv.status === "PAID")
      .reduce((sum, inv) => sum + inv.lines.reduce((s, l) => s + l.amount, 0), 0);
    const { invoices: _inv, ...rest } = c;
    void _inv;
    return { ...rest, totalInvoiced, totalPaid };
  });
}

export async function getClientById(userId: string, id: string) {
  return db.client.findFirst({
    where: { id, userId },
    include: {
      entities: { include: { bankAccounts: true } },
      invoices: { include: { lines: true }, orderBy: { date: "desc" } },
    },
  });
}

// ─── Accounts ────────────────────────────────────────────────────────────────

export async function getAccounts(userId: string) {
  return db.bankAccount.findMany({
    where: { entity: { userId } },
    include: { entity: true, connection: true },
    orderBy: [{ entity: { name: "asc" } }, { name: "asc" }],
  });
}

// ─── Reports ─────────────────────────────────────────────────────────────────

export async function getCashFlowReport(userId: string, months: number = 12) {
  return getMonthlyTransactions(userId, months);
}

export async function getBurnRateStats(userId: string) {
  // Use last 3 months of transactions for burn rate
  const [monthly, fx] = await Promise.all([
    getMonthlyTransactions(userId, 4),
    getFxRates(),
  ]);

  // Use last 3 months (exclude current incomplete month)
  const last3 = monthly.slice(0, 3);
  const avgExpense = last3.reduce((s, m) => s + m.expense, 0) / Math.max(last3.length, 1);
  const avgIncome = last3.reduce((s, m) => s + m.income, 0) / Math.max(last3.length, 1);

  // Get total liquid balance
  const accounts = await db.bankAccount.findMany({
    where: { entity: { userId }, accountType: { in: ["CURRENT", "SAVINGS"] } },
    select: { balance: true, currency: true },
  });
  const totalBalance = accounts.reduce((s, a) => s + a.balance * (fx[a.currency] ?? 1), 0);

  const burnRate = avgExpense; // monthly
  const incomeRate = avgIncome;
  const netMonthly = incomeRate - burnRate;
  const runway = burnRate > 0 ? totalBalance / burnRate : Infinity;

  // MoM income change
  const lastMonth = monthly[monthly.length - 2];
  const prevMonth = monthly[monthly.length - 3];
  const incomeChange =
    lastMonth && prevMonth && prevMonth.income > 0
      ? ((lastMonth.income - prevMonth.income) / prevMonth.income) * 100
      : 0;

  return { burnRate, incomeRate, netMonthly, runway, totalBalance, incomeChange };
}

export async function getTopClientsByRevenue(userId: string, limit = 5) {
  const invoices = await db.invoice.findMany({
    where: { entity: { userId }, status: { in: ["PAID", "SENT", "OVERDUE"] } },
    select: {
      clientId: true,
      client: { select: { name: true } },
      lines: { select: { amount: true, taxRate: true } },
    },
  });

  const map = new Map<string, { name: string; revenue: number }>();
  for (const inv of invoices) {
    const total = inv.lines.reduce((s, l) => s + l.amount * (1 + l.taxRate / 100), 0);
    if (map.has(inv.clientId)) {
      map.get(inv.clientId)!.revenue += total;
    } else {
      map.set(inv.clientId, { name: inv.client.name, revenue: total });
    }
  }

  return Array.from(map.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

export async function getCategoryReport(userId: string) {
  const [txs, fx] = await Promise.all([
    db.transaction.findMany({
      select: { category: true, amount: true, currency: true },
      where: { account: { entity: { userId } }, category: { not: null } },
    }),
    getFxRates(),
  ]);

  const map = new Map<string, { income: number; expense: number }>();
  for (const tx of txs) {
    const cat = tx.category ?? "Uncategorised";
    const gbp = tx.amount * (fx[tx.currency] ?? 1);
    if (!map.has(cat)) map.set(cat, { income: 0, expense: 0 });
    const entry = map.get(cat)!;
    if (gbp > 0) entry.income += gbp;
    else entry.expense += Math.abs(gbp);
  }

  return Array.from(map.entries())
    .map(([category, v]) => ({ category, ...v }))
    .sort((a, b) => b.expense + b.income - (a.expense + a.income));
}

export async function getEntities(userId: string) {
  return db.entity.findMany({ where: { userId }, orderBy: { name: "asc" } });
}

// ─── Settings ────────────────────────────────────────────────────────────────

export async function getUserById(id: string) {
  return db.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, createdAt: true, image: true },
  });
}
