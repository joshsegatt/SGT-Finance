"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import { useChartTheme } from "@/hooks/use-chart-theme";

interface DataPoint { name: string; revenue: number; }

function fmt(v: number) {
  if (v >= 1_000_000) return `£${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1000) return `£${(v / 1000).toFixed(0)}k`;
  return `£${v.toFixed(0)}`;
}

const COLORS = ["#4979EF", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

interface TooltipArgs { active?: boolean; payload?: readonly { value?: number | string }[]; label?: string; theme: ReturnType<typeof useChartTheme>; }

function CustomTooltip({ active, payload, label, theme }: TooltipArgs) {
  if (!active || !payload?.length) return null;
  const revenue = payload[0]?.value ?? 0;
  return (
    <div style={{
      backgroundColor: theme.tooltipBg,
      border: `1px solid ${theme.tooltipBorder}`,
      borderRadius: "10px",
      padding: "10px 14px",
      boxShadow: theme.tooltipShadow,
    }}>
      <p style={{ fontSize: "11px", color: theme.tooltipMuted, fontWeight: 600, marginBottom: "4px" }}>{label}</p>
      <p style={{ fontSize: "14px", fontWeight: 700, color: "#4979EF" }}>
        £{Number(revenue).toLocaleString("en-GB", { maximumFractionDigits: 0 })}
      </p>
    </div>
  );
}

export function TopClientsChart({ data }: { data: DataPoint[] }) {
  const theme = useChartTheme();

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 72 }}>
        <XAxis
          type="number"
          tickFormatter={fmt}
          tick={{ fontSize: 11, fill: theme.tick }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 11, fill: theme.tick }}
          axisLine={false}
          tickLine={false}
          width={70}
          tickFormatter={(v: string) => v.length > 10 ? v.slice(0, 10) + "…" : v}
        />
        <Tooltip content={(props: any) => <CustomTooltip {...props} theme={theme} />} cursor={{ fill: theme.cursorFill }} />
        <Bar dataKey="revenue" radius={[0, 6, 6, 0]} maxBarSize={32}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
