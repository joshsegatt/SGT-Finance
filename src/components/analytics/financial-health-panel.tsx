"use client";

import { formatCurrency } from "@/lib/format";
import { TrendingUp, TrendingDown, Flame, Clock, DollarSign, Activity } from "lucide-react";

interface FinancialHealthPanelProps {
  stats: {
    burnRate: number;
    incomeRate: number;
    netMonthly: number;
    runway: number;
    totalBalance: number;
    incomeChange: number;
  };
}

export function FinancialHealthPanel({ stats }: FinancialHealthPanelProps) {
  const { burnRate, incomeRate, netMonthly, runway, totalBalance, incomeChange } = stats;

  const runwayLabel =
    runway === Infinity || runway > 120
      ? "120+ months"
      : runway < 1
      ? "< 1 month"
      : `${runway.toFixed(1)} months`;

  const runwayColor =
    runway < 3 ? "text-red-500" : runway < 6 ? "text-amber-500" : "text-emerald-500";

  const netPositive = netMonthly >= 0;
  const incomeUp = incomeChange >= 0;

  const cards = [
    {
      icon: Flame,
      iconColor: "#ef4444",
      iconBg: "bg-red-500/10",
      label: "Monthly Burn Rate",
      value: formatCurrency(burnRate),
      sub: "avg expenses last 3 months",
    },
    {
      icon: DollarSign,
      iconColor: "#22c55e",
      iconBg: "bg-emerald-500/10",
      label: "Monthly Revenue",
      value: formatCurrency(incomeRate),
      sub: incomeUp ? `▲ ${Math.abs(incomeChange).toFixed(1)}% MoM` : `▼ ${Math.abs(incomeChange).toFixed(1)}% MoM`,
      subColor: incomeUp ? "text-emerald-500" : "text-red-400",
    },
    {
      icon: netPositive ? TrendingUp : TrendingDown,
      iconColor: netPositive ? "#22c55e" : "#ef4444",
      iconBg: netPositive ? "bg-emerald-500/10" : "bg-red-500/10",
      label: "Net Monthly Flow",
      value: (netPositive ? "+" : "") + formatCurrency(netMonthly),
      valueColor: netPositive ? "text-emerald-500" : "text-red-500",
      sub: netPositive ? "Profitable period" : "Spending exceeds income",
    },
    {
      icon: Clock,
      iconColor: runway < 3 ? "#ef4444" : runway < 6 ? "#f59e0b" : "#22c55e",
      iconBg: runway < 3 ? "bg-red-500/10" : runway < 6 ? "bg-amber-500/10" : "bg-emerald-500/10",
      label: "Cash Runway",
      value: runwayLabel,
      valueColor: runwayColor,
      sub: `Based on ${formatCurrency(totalBalance)} liquid balance`,
    },
  ];

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border/50 flex items-center gap-2">
        <Activity className="h-4 w-4 text-muted-foreground" />
        <div>
          <h3 className="text-sm font-semibold text-foreground">Financial Health</h3>
          <p className="text-xs text-muted-foreground">Burn rate, runway & cash flow velocity</p>
        </div>
      </div>
      <div className="grid grid-cols-4 divide-x divide-border/40">
        {cards.map((card) => (
          <div key={card.label} className="p-5 space-y-3">
            <div className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center`}>
              <card.icon className="h-4 w-4" style={{ color: card.iconColor }} />
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                {card.label}
              </div>
              <div className={`text-xl font-bold ${card.valueColor ?? "text-foreground"}`}>
                {card.value}
              </div>
              {card.sub && (
                <div className={`text-xs mt-1 ${card.subColor ?? "text-muted-foreground"}`}>
                  {card.sub}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
