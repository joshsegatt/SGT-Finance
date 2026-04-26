import { getCashFlowReport, getCategoryReport, getEntities, getBurnRateStats, getTopClientsByRevenue } from "@/lib/data";
import { AnalyticsCashFlowChart } from "@/components/analytics/cash-flow-chart";
import { CategoryChart } from "@/components/analytics/category-chart";
import { AnalyticsFilters } from "@/components/analytics/analytics-filters";
import { FinancialHealthPanel } from "@/components/analytics/financial-health-panel";
import { TopClientsChart } from "@/components/analytics/top-clients-chart";
import { formatCurrency } from "@/lib/format";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Analytics",
  description: "Cash flow analysis, burn rate, runway forecast and spending breakdown.",
};

interface PageProps {
  searchParams: Promise<{ period?: string; entityId?: string }>;
}

function periodToMonths(period?: string): number {
  switch (period) {
    case "30d": return 1;
    case "90d": return 3;
    case "1y": return 12;
    default: return 6;
  }
}

export default async function AnalyticsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const months = periodToMonths(params.period);

  const [cashFlow, categoryData, entities, burnStats, topClients, t] = await Promise.all([
    getCashFlowReport(months),
    getCategoryReport(),
    getEntities(),
    getBurnRateStats(),
    getTopClientsByRevenue(5),
    getTranslations("Analytics"),
  ]);

  const totalIncome = cashFlow.reduce((s, m) => s + m.income, 0);
  const totalExpense = cashFlow.reduce((s, m) => s + m.expense, 0);
  const netFlow = totalIncome - totalExpense;

  return (
    <div className="space-y-8">
      <div className="animate-fade-up stagger-1 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("title")}</h1>
          <p className="text-muted-foreground mt-1.5">{t("subtitle")}</p>
        </div>
        <AnalyticsFilters entities={entities} />
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t("kpi.totalIncome"), value: totalIncome, positive: true },
          { label: t("kpi.totalExpenses"), value: totalExpense, positive: false },
          { label: t("kpi.netFlow"), value: netFlow, positive: netFlow >= 0 },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card/80 rounded-xl border border-border p-5 shadow-md">
            <div className="text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-3">
              {kpi.label}
            </div>
            <div className={`text-2xl font-bold ${kpi.positive ? "text-emerald-500" : "text-foreground"}`}>
              {formatCurrency(kpi.value)}
            </div>
          </div>
        ))}
      </div>

      {/* Financial Health Panel */}
      <FinancialHealthPanel stats={burnStats} />

      {/* Cash Flow Chart */}
      <div className="bg-card/80 rounded-xl border border-border p-6 shadow-md">
        <h2 className="text-sm font-semibold text-foreground mb-1">{t("cashFlowTitle")}</h2>
        <p className="text-xs text-muted-foreground mb-6">
          {t("cashFlowSub")} — {months} month{months !== 1 ? "s" : ""}
        </p>
        <AnalyticsCashFlowChart data={cashFlow} />
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-card/80 rounded-xl border border-border p-6 shadow-md">
          <h2 className="text-sm font-semibold text-foreground mb-1">{t("categoryTitle")}</h2>
          <p className="text-xs text-muted-foreground mb-6">{t("categoryAllTime")}</p>
          <CategoryChart data={categoryData} />
        </div>

        <div className="bg-card/80 rounded-xl border border-border p-6 shadow-md">
          <h2 className="text-sm font-semibold text-foreground mb-4">{t("categorySummary")}</h2>
          <div className="divide-y divide-border/30">
            {categoryData.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No data</p>
            ) : (
              categoryData.slice(0, 8).map((cat) => (
                <div key={cat.category} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-sm font-medium text-foreground">{cat.category}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t("income")}: {formatCurrency(cat.income)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {formatCurrency(cat.expense)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t("expenses")}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Top Clients by Revenue */}
      {topClients.length > 0 && (
        <div className="bg-card/80 rounded-xl border border-border p-6 shadow-md">
          <h2 className="text-sm font-semibold text-foreground mb-1">Top Clients by Revenue</h2>
          <p className="text-xs text-muted-foreground mb-5">Largest revenue contributors (billed)</p>
          <TopClientsChart data={topClients} />
        </div>
      )}
    </div>
  );
}
