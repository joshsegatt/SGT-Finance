"use client";

import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useChartTheme } from "@/hooks/use-chart-theme";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

interface DataPoint { month: string; income: number; expense: number; }

function fmt(v: number) {
  if (v >= 1000) return `£${(v / 1000).toFixed(0)}k`;
  return `£${v.toFixed(0)}`;
}

interface ChartPayloadItem { dataKey?: string; value?: number; color?: string; }
interface TooltipArgs { active?: boolean; payload?: readonly ChartPayloadItem[]; label?: string; theme: any; }

function CustomTooltip({ active, payload, label, theme }: TooltipArgs) {
  if (!active || !payload?.length) return null;

  const income = payload.find((p) => p.dataKey === "income")?.value ?? 0;
  const expense = payload.find((p) => p.dataKey === "expense")?.value ?? 0;
  const net = income - expense;

  return (
    <div className="backdrop-blur-md bg-card/80 border border-border rounded-xl p-3 shadow-2xl min-w-[160px] animate-in fade-in zoom-in-95 duration-200">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">{label}</p>
      <div className="space-y-2">
        {payload.map((item) => (
          <div key={item.dataKey} className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-muted-foreground capitalize">{item.dataKey}</span>
            </div>
            <span className="text-xs font-bold text-foreground">{formatCurrency(item.value ?? 0)}</span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-border/40 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">Net Position</span>
          <span className={cn("text-xs font-black", net >= 0 ? "text-emerald-500" : "text-rose-500")}>
            {net >= 0 ? "+" : ""}{formatCurrency(net)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function AnalyticsCashFlowChart({ data }: { data: DataPoint[] }) {
  const theme = useChartTheme();
  const [visible, setVisible] = useState({ income: true, expense: true });

  const toggle = (key: keyof typeof visible) => {
    setVisible(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="group/chart">
      {/* Interactive Legend */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => toggle("income")}
          className={cn(
            "flex items-center gap-2 px-2.5 py-1 rounded-full border transition-all duration-300",
            visible.income
              ? "bg-primary/5 border-primary/20 text-primary"
              : "bg-transparent border-transparent text-muted-foreground/40 opacity-50 grayscale"
          )}
        >
          <div className="w-2 h-2 rounded-full bg-[#4979EF] shadow-[0_0_8px_rgba(73,121,239,0.5)]" />
          <span className="text-[11px] font-semibold uppercase tracking-wider">Income</span>
        </button>
        <button
          onClick={() => toggle("expense")}
          className={cn(
            "flex items-center gap-2 px-2.5 py-1 rounded-full border transition-all duration-300",
            visible.expense
              ? "bg-purple-500/5 border-purple-500/20 text-purple-500"
              : "bg-transparent border-transparent text-muted-foreground/40 opacity-50 grayscale"
          )}
        >
          <div className="w-2 h-2 rounded-full bg-[#8b5cf6] shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
          <span className="text-[11px] font-semibold uppercase tracking-wider">Expenses</span>
        </button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="aIncomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4979EF" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#4979EF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="aExpenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} strokeOpacity={0.5} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: theme.tick, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis
            tickFormatter={fmt}
            tick={{ fontSize: 10, fill: theme.tick, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            width={45}
          />
          <Tooltip
            content={(props: any) => <CustomTooltip active={props.active} payload={props.payload} label={props.label} theme={theme} />}
            cursor={{ stroke: theme.grid, strokeWidth: 2, strokeDasharray: "5 5" }}
            animationDuration={200}
          />
          {visible.income && (
            <Area
              type="monotone"
              dataKey="income"
              stroke="#4979EF"
              strokeWidth={3}
              fill="url(#aIncomeGrad)"
              animationDuration={1500}
              activeDot={{ r: 6, fill: "#4979EF", stroke: "#fff", strokeWidth: 3 }}
            />
          )}
          {visible.expense && (
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#8b5cf6"
              strokeWidth={3}
              fill="url(#aExpenseGrad)"
              animationDuration={1800}
              activeDot={{ r: 6, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 3 }}
            />
          )}

        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

