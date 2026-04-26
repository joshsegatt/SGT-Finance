import { getDashboardKPIs, getMonthlyTransactions, getRecentTransactions, getAlerts } from "@/lib/data";
import { formatCurrency, formatRelative } from "@/lib/format";
import { CashFlowChart } from "@/components/cash-flow-chart";
import { AlertCard } from "@/components/alert-card";
import { KpiSparkline } from "@/components/kpi-sparkline";
import { Landmark, TrendingUp, AlertTriangle, FileWarning } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";

export const metadata = {
  title: "Dashboard",
  description: "Financial overview: balances, cash flow, alerts and recent transactions.",
};

export default async function DashboardPage() {
  const [kpis, monthlyData, recentTxs, alerts, t, locale] = await Promise.all([
    getDashboardKPIs(),
    getMonthlyTransactions(6),
    getRecentTransactions(8),
    getAlerts(),
    getTranslations("Dashboard"),
    getLocale(),
  ]);

  const unreadAlerts = alerts.filter((a) => !a.isRead);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between animate-fade-up stagger-1">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("title")}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{t("subtitle")}</p>
        </div>
        <div className="text-xs text-muted-foreground/60 text-right mt-1">
          {new Date().toLocaleDateString(locale === "pt" ? "pt-BR" : locale === "fr" ? "fr-FR" : "en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Total Balance */}
        <div className="animate-fade-up stagger-1 relative bg-card rounded-xl border border-border/60 p-5 card-shadow overflow-hidden hover:border-border hover:-translate-y-0.5 transition-all duration-200">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">{t("kpi.totalBalance")}</span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Landmark className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground tracking-tight">
            {formatCurrency(kpis.totalBalance)}
          </div>
          <KpiSparkline data={monthlyData.map((m) => m.income - m.expense)} color="#4979EF" positive />
          <div className="text-xs text-muted-foreground mt-1">{t("kpi.acrossAllAccounts")}</div>
        </div>

        {/* Cash Reserve */}
        <div className="animate-fade-up stagger-2 relative bg-card rounded-xl border border-border/60 p-5 card-shadow overflow-hidden hover:border-border hover:-translate-y-0.5 transition-all duration-200">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">{t("kpi.cashReserve")}</span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground tracking-tight">
            {formatCurrency(kpis.cashReserve)}
          </div>
          <KpiSparkline data={monthlyData.map((m) => m.income)} color="#22c55e" positive />
          <div className="text-xs text-muted-foreground mt-1">{t("kpi.savingsOnly")}</div>
        </div>

        {/* Tax Exposure */}
        <div className="animate-fade-up stagger-3 relative bg-card rounded-xl border border-primary/20 p-5 card-shadow overflow-hidden hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-primary/70 uppercase tracking-widest">{t("kpi.taxExposure")}</span>
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground tracking-tight">
            {formatCurrency(kpis.taxExposure)}
          </div>
          <KpiSparkline data={monthlyData.map((m) => m.expense * 0.25)} color="#4979EF" positive={false} />
          <div className="text-xs text-muted-foreground mt-1">{t("kpi.effectiveRate")}</div>
        </div>

        {/* Overdue Invoices */}
        <div className={`animate-fade-up stagger-4 relative bg-card rounded-xl border p-5 card-shadow overflow-hidden hover:-translate-y-0.5 transition-all duration-200 ${
          kpis.overdueInvoicesCount > 0
            ? "border-amber-500/30 hover:border-amber-500/50"
            : "border-border/60 hover:border-border"
        }`}>
          <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent ${
            kpis.overdueInvoicesCount > 0 ? "via-amber-500/70" : "via-primary/40"
          }`} />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">{t("kpi.overdueInvoices")}</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              kpis.overdueInvoicesCount > 0 ? "bg-amber-500/10" : "bg-primary/10"
            }`}>
              <FileWarning className={`w-4 h-4 ${kpis.overdueInvoicesCount > 0 ? "text-amber-500" : "text-primary"}`} />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground tracking-tight">{kpis.overdueInvoicesCount}</div>
          <div className={`text-xs mt-2 ${kpis.overdueInvoicesCount > 0 ? "text-amber-500/80" : "text-muted-foreground"}`}>
            {kpis.overdueInvoicesCount > 0
              ? `${formatCurrency(kpis.overdueInvoicesTotal)} ${t("kpi.outstanding")}`
              : t("kpi.allUpToDate")}
          </div>
        </div>
      </div>

      {/* Charts + Alerts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 animate-fade-up stagger-3">
        {/* Cash Flow Chart */}
        <div className="xl:col-span-2 relative bg-card rounded-xl border border-border/60 p-6 panel-shadow overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-foreground">{t("cashFlow")}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{t("last6Months")}</p>
            </div>
          </div>
          <CashFlowChart data={monthlyData} />
        </div>

        {/* Alerts */}
        <div className="relative bg-card rounded-xl border border-border/60 p-6 panel-shadow overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">{t("alerts")}</h2>
            {unreadAlerts.length > 0 && (
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-semibold">
                {t("alertsNew", { count: unreadAlerts.length })}
              </span>
            )}
          </div>
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">{t("noAlerts")}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="animate-fade-up stagger-4 relative bg-card rounded-xl border border-border/60 panel-shadow overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">{t("recentTransactions")}</h2>
          <a href="/transactions" className="text-xs text-primary hover:text-primary/80 font-medium transition-colors">
            {t("viewAll")} →
          </a>
        </div>
        {recentTxs.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
              <svg className="w-7 h-7 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{t("noTransactions")}</p>
              <p className="text-xs text-muted-foreground mt-1">Connect a bank account to import transactions</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border/30">
            {recentTxs.map((tx) => (
              <div key={tx.id} className="flex items-center px-6 py-3 hover:bg-muted/20 border-l-2 border-transparent hover:border-primary/30 transition-all">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{tx.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {tx.account.entity.name} · {tx.category ?? t("uncategorised")}
                  </p>
                </div>
                <div className="text-right ml-4 shrink-0">
                  <p className={`text-sm font-semibold ${tx.amount >= 0 ? "text-emerald-400" : "text-foreground/80"}`}>
                    {tx.amount >= 0 ? "+" : ""}{formatCurrency(tx.amount, tx.currency)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatRelative(tx.date)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}