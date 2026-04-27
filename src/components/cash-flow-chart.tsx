"use client";

import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
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

  return (
    <div className="backdrop-blur-md bg-card/80 border border-border rounded-xl p-3 shadow-2xl min-w-[150px] animate-in fade-in zoom-in-95 duration-200">
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
      </div>
    </div>
  );
}

export function CashFlowChart({ data }: { data: DataPoint[] }) {
  const theme = useChartTheme();
  const [visible, setVisible] = useState({ income: true, expense: true });

  const toggle = (key: keyof typeof visible) => {
    setVisible(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const hasData = data.some(d => d.income > 0 || d.expense > 0);

  if (!hasData) {
    return (
      <div className="relative h-[280px] flex items-center justify-center">
         {/* Ghost Chart Background */}
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={[
               { month: "Jan", income: 100, expense: 80 },
               { month: "Feb", income: 120, expense: 90 },
               { month: "Mar", income: 110, expense: 100 },
               { month: "Apr", income: 140, expense: 110 },
               { month: "May", income: 130, expense: 120 },
               { month: "Jun", income: 160, expense: 130 },
             ]}>
               <Area type="monotone" dataKey="income" stroke="#000" fill="#000" />
             </AreaChart>
           </ResponsiveContainer>
         </div>
         
         <div className="flex flex-col items-center gap-2 text-center z-10">
            <div className="w-12 h-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-primary/40" />
            </div>
            <h3 className="text-sm font-bold text-foreground">No cash flow data yet</h3>
            <p className="text-xs text-muted-foreground max-w-[200px]">
              Connect your bank or create invoices to see your income and expenses here.
            </p>
         </div>
      </div>
    );
  }

  return (
    <div className="group/chart">
      {/* Interactive Legend */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => toggle("income")}
          className={cn(
            "flex items-center gap-2 px-2 py-0.5 rounded-full border transition-all duration-300",
            visible.income
              ? "bg-primary/5 border-primary/20 text-primary"
              : "bg-transparent border-transparent text-muted-foreground/30 grayscale"
          )}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#4979EF]" />
          <span className="text-[10px] font-bold uppercase tracking-tight">Income</span>
        </button>
        <button
          onClick={() => toggle("expense")}
          className={cn(
            "flex items-center gap-2 px-2 py-0.5 rounded-full border transition-all duration-300",
            visible.expense
              ? "bg-purple-500/5 border-purple-500/20 text-purple-500"
              : "bg-transparent border-transparent text-muted-foreground/30 grayscale"
          )}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]" />
          <span className="text-[10px] font-bold uppercase tracking-tight">Expenses</span>
        </button>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="dashIncomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4979EF" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#4979EF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="dashExpenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} strokeOpacity={0.4} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: theme.tick, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={fmt}
            tick={{ fontSize: 10, fill: theme.tick, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            width={42}
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
              fill="url(#dashIncomeGrad)"
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
              fill="url(#dashExpenseGrad)"
              animationDuration={1800}
              activeDot={{ r: 6, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 3 }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

