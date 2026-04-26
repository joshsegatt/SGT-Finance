"use client";

import { useTheme } from "next-themes";
import { useMemo } from "react";

export function useChartTheme() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return useMemo(
    () => ({
      grid: isDark ? "#1e2d3f" : "#e8edf5",
      tick: isDark ? "#7A8FAF" : "#6b7fa3",
      tooltipBg: isDark ? "#0D1728" : "#ffffff",
      tooltipBorder: isDark ? "#1e2d3f" : "#dde4f2",
      tooltipText: isDark ? "#E4EAF6" : "#0f172a",
      tooltipMuted: isDark ? "#7A8FAF" : "#6b7fa3",
      tooltipShadow: isDark
        ? "0 4px 24px rgba(0,0,0,0.5)"
        : "0 4px 16px rgba(15,23,42,0.10)",
      cursorFill: isDark ? "rgba(73,121,239,0.06)" : "rgba(37,99,235,0.04)",
      income: "#4979EF",
      expense: "#8b5cf6",
      emerald: "#10b981",
    }),
    [isDark],
  );
}
