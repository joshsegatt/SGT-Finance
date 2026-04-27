"use client";

import { useEffect, useState } from "react";

// ─── Chart-Shaped Skeleton ───────────────────────────────────────────────────

/** Animated wave-form skeleton that mimics an area chart loading */
export function ChartSkeleton({
  height = 240,
  className = "",
}: {
  height?: number;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{ height }}
    >
      {/* Grid lines */}
      <div className="absolute inset-0 flex flex-col justify-between py-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-px bg-border/30"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>

      {/* Wave skeleton shape */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="skeleton-wave-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--muted))" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(var(--muted))" stopOpacity="0" />
          </linearGradient>
          {/* Shimmer sweep */}
          <linearGradient id="skeleton-shimmer" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="hsl(var(--muted-foreground))" stopOpacity="0.08" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path
          d="M0,150 C50,120 80,80 120,100 C160,120 180,60 220,70 C260,80 300,40 340,60 C360,70 380,50 400,65 L400,200 L0,200 Z"
          fill="url(#skeleton-wave-grad)"
          className="animate-pulse"
        />

        {/* Line */}
        <path
          d="M0,150 C50,120 80,80 120,100 C160,120 180,60 220,70 C260,80 300,40 340,60 C360,70 380,50 400,65"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="2"
          className="animate-pulse"
        />

        {/* Shimmer overlay */}
        <rect
          x="-100%"
          y="0"
          width="100%"
          height="100%"
          fill="url(#skeleton-shimmer)"
        >
          <animate
            attributeName="x"
            from="-100%"
            to="200%"
            dur="2s"
            repeatCount="indefinite"
          />
        </rect>
      </svg>

      {/* X-axis labels */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-2.5 w-8 rounded-sm bg-muted/60 animate-pulse"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── KPI Card Skeleton ──────────────────────────────────────────────────────

export function KpiSkeleton() {
  return (
    <div className="relative bg-card rounded-xl border border-border/60 p-5 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-muted/60 to-transparent" />

      {/* Shimmer sweep overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-muted-foreground/5 to-transparent" />
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="h-3 w-24 rounded-sm bg-muted animate-pulse" />
        <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
      </div>
      <div className="h-7 w-28 rounded-sm bg-muted animate-pulse mb-2" />
      {/* Mini sparkline skeleton */}
      <div className="flex items-end gap-[2px] h-6 mt-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-muted/40 rounded-t-sm animate-pulse"
            style={{
              height: `${30 + Math.sin(i * 0.8) * 40 + 30}%`,
              animationDelay: `${i * 80}ms`,
            }}
          />
        ))}
      </div>
      <div className="h-3 w-32 rounded-sm bg-muted/60 animate-pulse mt-2" />
    </div>
  );
}

// ─── Table Row Skeleton ─────────────────────────────────────────────────────

export function TableRowSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="divide-y divide-border/30">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center px-6 py-3 gap-4"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="flex-1 space-y-1.5">
            <div
              className="h-3.5 rounded-sm bg-muted animate-pulse"
              style={{ width: `${45 + Math.random() * 30}%` }}
            />
            <div
              className="h-3 rounded-sm bg-muted/60 animate-pulse"
              style={{ width: `${25 + Math.random() * 20}%` }}
            />
          </div>
          <div className="text-right space-y-1.5">
            <div className="h-3.5 w-20 rounded-sm bg-muted animate-pulse ml-auto" />
            <div className="h-3 w-16 rounded-sm bg-muted/60 animate-pulse ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Suspense Wrapper with Transition ───────────────────────────────────────

/** Wrap any async-loaded component — shows skeleton then fades in content */
export function SkeletonTransition({
  loading,
  skeleton,
  children,
}: {
  loading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
}) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!loading) {
      // Small delay to allow fade transition
      const timer = setTimeout(() => setShowContent(true), 50);
      return () => clearTimeout(timer);
    }
    setShowContent(false);
  }, [loading]);

  if (loading) {
    return <>{skeleton}</>;
  }

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      {children}
    </div>
  );
}
