"use client";

import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import { useChartTheme } from "@/hooks/use-chart-theme";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

interface DataPoint { category: string; income: number; expense: number; }

function fmt(v: number) {
  if (v >= 1000) return `£${(v / 1000).toFixed(0)}k`;
  return `£${v.toFixed(0)}`;
}

interface ChartPayloadItem { dataKey?: string; value?: number; color?: string; }
interface TooltipArgs { active?: boolean; payload?: readonly ChartPayloadItem[]; label?: string; theme: any; }

function CustomTooltip({ active, payload, label, theme }: TooltipArgs) {
  if (!active || !payload?.length) return null;

  return (
    <div className="backdrop-blur-md bg-card/80 border border-border rounded-xl p-3 shadow-2xl min-w-[160px] animate-in fade-in zoom-in-95 duration-200">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2.5">{label}</p>
      <div className="space-y-2">
        {payload.map((item) => (
          <div key={item.dataKey} className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-muted-foreground capitalize">{item.dataKey}</span>
            </div>
            <span className="text-xs font-bold text-foreground">{formatCurrency(item.value ?? 0)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const INCOME_COLORS = ["#4979EF", "#3b6de0", "#2d5fcf", "#4979EF", "#5b88f5", "#6b94f6", "#4979EF", "#3b6de0"];
const EXPENSE_COLORS = ["#8b5cf6", "#7c4de8", "#7c3aed", "#8b5cf6", "#9d74f8", "#a855f7", "#8b5cf6", "#7c4de8"];

export function CategoryChart({ data }: { data: DataPoint[] }) {
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
          <div className="w-2 h-2 rounded-sm bg-[#4979EF]" />
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
          <div className="w-2 h-2 rounded-sm bg-[#8b5cf6]" />
          <span className="text-[11px] font-semibold uppercase tracking-wider">Expenses</span>
        </button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 40 }} barCategoryGap="35%" barGap={4}>
          <defs>
            <linearGradient id="barIncomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4979EF" stopOpacity={1} />
              <stop offset="100%" stopColor="#4979EF" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="barExpenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} strokeOpacity={0.5} />
          <XAxis
            dataKey="category"
            tick={{ fontSize: 10, fill: theme.tick, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            angle={-35}
            textAnchor="end"
            interval={0}
            dx={-5}
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
            cursor={{ fill: theme.cursorFill, radius: 4 }}
            animationDuration={200}
          />
          {visible.income && (
            <Bar dataKey="income" radius={[4, 4, 0, 0]} maxBarSize={32} animationDuration={1200}>
              {data.map((_, i) => (
                <Cell key={i} fill={INCOME_COLORS[i % INCOME_COLORS.length]} />
              ))}
            </Bar>
          )}
          {visible.expense && (
            <Bar dataKey="expense" radius={[4, 4, 0, 0]} maxBarSize={32} animationDuration={1500}>
              {data.map((_, i) => (
                <Cell key={i} fill={EXPENSE_COLORS[i % EXPENSE_COLORS.length]} />
              ))}
            </Bar>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

