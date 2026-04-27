"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import { useChartTheme } from "@/hooks/use-chart-theme";
import { formatCurrency } from "@/lib/format";

interface DataPoint { name: string; revenue: number; }

function fmt(v: number) {
  if (v >= 1_000_000) return `£${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1000) return `£${(v / 1000).toFixed(0)}k`;
  return `£${v.toFixed(0)}`;
}

const COLORS = ["#4979EF", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

interface TooltipArgs { active?: boolean; payload?: any[]; label?: string; theme: any; }

function CustomTooltip({ active, payload, label, theme }: TooltipArgs) {
  if (!active || !payload?.length) return null;
  const revenue = payload[0]?.value ?? 0;
  const color = payload[0]?.payload?.fill || "#4979EF";

  return (
    <div className="backdrop-blur-md bg-card/80 border border-border rounded-xl p-3 shadow-2xl min-w-[140px] animate-in fade-in zoom-in-95 duration-200">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">{label}</p>
      <div className="flex items-center gap-3 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-xs text-muted-foreground">Revenue</span>
        </div>
        <span className="text-sm font-black text-foreground">{formatCurrency(revenue)}</span>
      </div>
    </div>
  );
}

export function TopClientsChart({ data }: { data: DataPoint[] }) {
  const theme = useChartTheme();

  return (
    <div className="w-full h-full min-h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 30, bottom: 0, left: 100 }}
          barSize={24}
        >
          <defs>
            {COLORS.map((c, i) => (
              <linearGradient key={i} id={`clientGrad-${i}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={c} stopOpacity={0.8} />
                <stop offset="100%" stopColor={c} stopOpacity={1} />
              </linearGradient>
            ))}
          </defs>
          <XAxis
            type="number"
            tickFormatter={fmt}
            tick={{ fontSize: 10, fill: theme.tick, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 10, fill: theme.tick, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            width={90}
            tickFormatter={(v: string) => v.length > 15 ? v.slice(0, 15) + "…" : v}
          />
          <Tooltip
            content={(props: any) => <CustomTooltip {...props} theme={theme} />}
            cursor={{ fill: theme.cursorFill, radius: 4 }}
            animationDuration={200}
          />
          <Bar
            dataKey="revenue"
            radius={[0, 4, 4, 0]}
            animationDuration={1500}
            animationEasing="ease-out"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={`url(#clientGrad-${i % COLORS.length})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

