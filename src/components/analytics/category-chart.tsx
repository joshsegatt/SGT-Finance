"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import { useChartTheme } from "@/hooks/use-chart-theme";

interface DataPoint { category: string; income: number; expense: number; }

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
      <p style={{ fontSize: "11px", color: theme.tooltipMuted, fontWeight: 600, letterSpacing: "0.04em", marginBottom: "8px" }}>{label}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: theme.tooltipMuted }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: "#4979EF", display: "inline-block" }} /> Income
          </span>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "#4979EF" }}>£{Number(income).toLocaleString("en-GB", { maximumFractionDigits: 0 })}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: theme.tooltipMuted }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: "#8b5cf6", display: "inline-block" }} /> Expenses
          </span>
          <span style={{ fontSize: "12px", fontWeight: 700, color: theme.tooltipText }}>£{Number(expense).toLocaleString("en-GB", { maximumFractionDigits: 0 })}</span>
        </div>
      </div>
    </div>
  );
}

const INCOME_COLORS = ["#4979EF", "#3b6de0", "#2d5fcf", "#4979EF", "#5b88f5", "#6b94f6", "#4979EF", "#3b6de0"];
const EXPENSE_COLORS = ["#8b5cf6", "#7c4de8", "#7c3aed", "#8b5cf6", "#9d74f8", "#a855f7", "#8b5cf6", "#7c4de8"];

export function CategoryChart({ data }: { data: DataPoint[] }) {
  const theme = useChartTheme();
  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-sm bg-[#4979EF] inline-block" /> Income
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-sm bg-[#8b5cf6] inline-block" /> Expenses
        </span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 24 }} barCategoryGap="32%" barGap={3}>
          <CartesianGrid strokeDasharray="2 4" stroke={theme.grid} vertical={false} />
          <XAxis dataKey="category" tick={{ fontSize: 11, fill: theme.tick }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" interval={0} />
          <YAxis tickFormatter={fmt} tick={{ fontSize: 11, fill: theme.tick }} axisLine={false} tickLine={false} width={52} />
          <Tooltip
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            content={(props: any) => <CustomTooltip active={props.active} payload={props.payload} label={props.label} theme={theme} />}
            cursor={{ fill: theme.cursorFill }}
          />
          <Bar dataKey="income" radius={[4, 4, 0, 0]} maxBarSize={28}>
            {data.map((_, i) => (
              <Cell key={i} fill={INCOME_COLORS[i % INCOME_COLORS.length]} fillOpacity={0.85} />
            ))}
          </Bar>
          <Bar dataKey="expense" radius={[4, 4, 0, 0]} maxBarSize={28}>
            {data.map((_, i) => (
              <Cell key={i} fill={EXPENSE_COLORS[i % EXPENSE_COLORS.length]} fillOpacity={0.80} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
