"use client";

import { ResponsiveContainer, AreaChart, Area } from "recharts";

interface KpiSparklineProps {
  data: number[];
  color?: string;
  positive?: boolean;
}

export function KpiSparkline({ data, color, positive = true }: KpiSparklineProps) {
  const chartColor = color ?? (positive ? "#10b981" : "#f59e0b");
  const chartData = data.map((v, i) => ({ i, v }));
  const gradId = `sparkGrad-${chartColor.replace("#", "")}`;

  return (
    <div className="h-10 w-full mt-2 transition-opacity duration-500 group-hover:opacity-100 opacity-60">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
              <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={chartColor}
            strokeWidth={2}
            fill={`url(#${gradId})`}
            dot={false}
            animationDuration={2000}
            animationEasing="ease-in-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

