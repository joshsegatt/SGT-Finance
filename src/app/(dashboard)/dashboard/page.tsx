import { getDashboardKPIs, getMonthlyTransactions, getRecentTransactions, getAlerts } from "@/lib/data";
import { formatCurrency, formatRelative } from "@/lib/format";
import { CashFlowChart } from "@/components/cash-flow-chart";
import { AlertCard } from "@/components/alert-card";
import { DashboardKpiRow } from "@/components/dashboard-kpi-row";
import { EmptyState } from "@/components/ui/empty-state";
import { BellOff, Receipt, CreditCard } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";

export const metadata = {
  title: "Dashboard",
  description: "Financial overview: balances, cash flow, alerts and recent transactions.",
};

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const [kpis, monthlyData, recentTxs, alerts, t, locale] = await Promise.all([
    getDashboardKPIs(userId),
    getMonthlyTransactions(userId, 6),
    getRecentTransactions(userId, 8),
    getAlerts(userId),
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

      {/* KPI Row — Drag & Drop enabled */}
      <DashboardKpiRow
        kpis={kpis}
        monthlyData={monthlyData}
        translations={{
          totalBalance: t("kpi.totalBalance"),
          cashReserve: t("kpi.cashReserve"),
          taxExposure: t("kpi.taxExposure"),
          overdueInvoices: t("kpi.overdueInvoices"),
          acrossAllAccounts: t("kpi.acrossAllAccounts"),
          savingsOnly: t("kpi.savingsOnly"),
          effectiveRate: t("kpi.effectiveRate"),
          outstanding: t("kpi.outstanding"),
          allUpToDate: t("kpi.allUpToDate"),
        }}
      />

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
            <EmptyState
              icon={BellOff}
              title={t("noAlerts")}
              description="Your financial health looks great. We'll notify you if anything needs attention."
              compact
            />
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
          <EmptyState
            icon={CreditCard}
            title={t("noTransactions")}
            description="Connect your first bank account to import transactions and see your cash flow."
            action={{
              label: "Connect Bank",
              href: "/accounts"
            }}
            className="py-12"
          />
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