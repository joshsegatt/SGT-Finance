"use client";

import { ResponsiveContainer, AreaChart, Area } from "recharts";

interface KpiSparklineProps {
  data: number[];
  color?: string;
  positive?: boolean;
}

export function KpiSparkline({ data, color, positive = true }: KpiSparklineProps) {
  const chartColor = color ?? (positive ? "#22c55e" : "#f59e0b");
  const chartData = data.map((v, i) => ({ i, v }));

  return (
    <div className="h-10 w-full mt-2 opacity-70">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
          <defs>
            <linearGradient id={`sparkGrad-${chartColor.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColor} stopOpacity={0.25} />
              <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={chartColor}
            strokeWidth={1.5}
            fill={`url(#sparkGrad-${chartColor.replace("#", "")})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
