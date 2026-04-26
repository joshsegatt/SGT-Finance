"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useChartTheme } from "@/hooks/use-chart-theme";

interface DataPoint { month: string; income: number; expense: number; }

function fmt(v: number) {
  if (v >= 1000) return `£${(v / 1000).toFixed(0)}k`;
  return `£${v.toFixed(0)}`;
}

interface ChartPayloadItem { dataKey?: unknown; value?: number | string; }
interface TooltipArgs { active?: boolean; payload?: readonly ChartPayloadItem[]; label?: string; theme: ReturnType<typeof useChartTheme>; }

function CustomTooltip({ active, payload, label, theme }: TooltipArgs) {
  if (!active || !payload?.length) return null;
  const income = payload.find((p) => p.dataKey === "income")?.value ?? 0;
  const expense = payload.find((p) => p.dataKey === "expense")?.value ?? 0;
  return (
    <div style={{
      backgroundColor: theme.tooltipBg,
      border: `1px solid ${theme.tooltipBorder}`,
      borderRadius: "10px",
      padding: "10px 14px",
      boxShadow: theme.tooltipShadow,
      minWidth: "148px",
    }}>
      <p style={{ fontSize: "11px", color: theme.tooltipMuted, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "8px" }}>{label}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: theme.tooltipMuted }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4979EF", display: "inline-block" }} /> Income
          </span>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "#4979EF" }}>£{Number(income).toLocaleString("en-GB", { maximumFractionDigits: 0 })}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: theme.tooltipMuted }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#8b5cf6", display: "inline-block" }} /> Expenses
          </span>
          <span style={{ fontSize: "12px", fontWeight: 700, color: theme.tooltipText }}>£{Number(expense).toLocaleString("en-GB", { maximumFractionDigits: 0 })}</span>
        </div>
        <div style={{ marginTop: "6px", paddingTop: "6px", borderTop: `1px solid ${theme.tooltipBorder}`, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "11px", color: theme.tooltipMuted }}>Net</span>
          <span style={{ fontSize: "12px", fontWeight: 700, color: Number(income) >= Number(expense) ? "#10b981" : "#f87171" }}>
            {Number(income) >= Number(expense) ? "+" : ""}£{Math.abs(Number(income) - Number(expense)).toLocaleString("en-GB", { maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>
    </div>
  );
}

export function AnalyticsCashFlowChart({ data }: { data: DataPoint[] }) {
  const theme = useChartTheme();
  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-[#4979EF] inline-block" /> Income
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-[#8b5cf6] inline-block" /> Expenses
        </span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="aIncomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4979EF" stopOpacity={0.20} />
              <stop offset="100%" stopColor="#4979EF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="aExpenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 4" stroke={theme.grid} vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: theme.tick }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={fmt} tick={{ fontSize: 11, fill: theme.tick }} axisLine={false} tickLine={false} width={52} />
          <Tooltip
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            content={(props: any) => <CustomTooltip active={props.active} payload={props.payload} label={props.label} theme={theme} />}
            cursor={{ stroke: theme.grid, strokeWidth: 1.5 }}
          />
          <Area type="monotone" dataKey="income" stroke="#4979EF" strokeWidth={2.5} fill="url(#aIncomeGrad)" dot={false} activeDot={{ r: 4, fill: "#4979EF", stroke: "#fff", strokeWidth: 2 }} />
          <Area type="monotone" dataKey="expense" stroke="#8b5cf6" strokeWidth={2} fill="url(#aExpenseGrad)" dot={false} activeDot={{ r: 4, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
