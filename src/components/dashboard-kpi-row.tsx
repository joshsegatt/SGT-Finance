"use client";

import { SortableKpiGrid } from "@/components/sortable-kpi-grid";
import { KpiSparkline } from "@/components/kpi-sparkline";
import { formatCurrency } from "@/lib/format";
import { Landmark, TrendingUp, AlertTriangle, FileWarning } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface KpiRowProps {
  kpis: {
    totalBalance: number;
    cashReserve: number;
    taxExposure: number;
    overdueInvoicesCount: number;
    overdueInvoicesTotal: number;
  };
  monthlyData: { income: number; expense: number }[];
  translations: {
    totalBalance: string;
    cashReserve: string;
    taxExposure: string;
    overdueInvoices: string;
    acrossAllAccounts: string;
    savingsOnly: string;
    effectiveRate: string;
    outstanding: string;
    allUpToDate: string;
  };
}

// ─── Reusable Card Shell ─────────────────────────────────────────────────────

function KpiCardShell({
  borderClass = "border-border/60 hover:border-border",
  accentVia = "via-primary/60",
  children,
}: {
  borderClass?: string;
  accentVia?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`relative bg-card rounded-xl border ${borderClass} p-5 card-shadow overflow-hidden hover:-translate-y-0.5 transition-all duration-200`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${accentVia} to-transparent`}
      />
      {children}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function DashboardKpiRow({ kpis, monthlyData, translations: t }: KpiRowProps) {
  const cards = [
    {
      id: "total-balance",
      children: (
        <KpiCardShell>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              {t.totalBalance}
            </span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Landmark className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground tracking-tight">
            {formatCurrency(kpis.totalBalance)}
          </div>
          <KpiSparkline
            data={monthlyData.map((m) => m.income - m.expense)}
            color="#4979EF"
            positive
          />
          <div className="text-xs text-muted-foreground mt-1">{t.acrossAllAccounts}</div>
        </KpiCardShell>
      ),
    },
    {
      id: "cash-reserve",
      children: (
        <KpiCardShell>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              {t.cashReserve}
            </span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground tracking-tight">
            {formatCurrency(kpis.cashReserve)}
          </div>
          <KpiSparkline data={monthlyData.map((m) => m.income)} color="#22c55e" positive />
          <div className="text-xs text-muted-foreground mt-1">{t.savingsOnly}</div>
        </KpiCardShell>
      ),
    },
    {
      id: "tax-exposure",
      children: (
        <KpiCardShell borderClass="border-primary/20 hover:border-primary/30" accentVia="via-primary/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-primary/70 uppercase tracking-widest">
              {t.taxExposure}
            </span>
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground tracking-tight">
            {formatCurrency(kpis.taxExposure)}
          </div>
          <KpiSparkline
            data={monthlyData.map((m) => m.expense * 0.25)}
            color="#4979EF"
            positive={false}
          />
          <div className="text-xs text-muted-foreground mt-1">{t.effectiveRate}</div>
        </KpiCardShell>
      ),
    },
    {
      id: "overdue-invoices",
      children: (
        <KpiCardShell
          borderClass={
            kpis.overdueInvoicesCount > 0
              ? "border-amber-500/30 hover:border-amber-500/50"
              : "border-border/60 hover:border-border"
          }
          accentVia={kpis.overdueInvoicesCount > 0 ? "via-amber-500/70" : "via-primary/40"}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              {t.overdueInvoices}
            </span>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                kpis.overdueInvoicesCount > 0 ? "bg-amber-500/10" : "bg-primary/10"
              }`}
            >
              <FileWarning
                className={`w-4 h-4 ${
                  kpis.overdueInvoicesCount > 0 ? "text-amber-500" : "text-primary"
                }`}
              />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground tracking-tight">
            {kpis.overdueInvoicesCount}
          </div>
          <div
            className={`text-xs mt-2 ${
              kpis.overdueInvoicesCount > 0 ? "text-amber-500/80" : "text-muted-foreground"
            }`}
          >
            {kpis.overdueInvoicesCount > 0
              ? `${formatCurrency(kpis.overdueInvoicesTotal)} ${t.outstanding}`
              : t.allUpToDate}
          </div>
        </KpiCardShell>
      ),
    },
  ];

  return <SortableKpiGrid cards={cards} />;
}
