import { Skeleton } from "@/components/ui/skeleton";

export default function InvoicesLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-2">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-4 w-36" />
        </div>
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>

      {/* KPI badges */}
      <div className="flex gap-3 flex-wrap">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-24 rounded-full" />
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center flex-wrap">
        <Skeleton className="h-8 w-32 rounded-md" />
        <Skeleton className="h-8 w-40 rounded-md" />
        <div className="ml-auto">
          <Skeleton className="h-4 w-28" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-[1fr_1fr_1fr_80px_80px_90px_90px_90px_90px_32px] gap-4 px-4 py-3 border-b border-border/50">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-full" />
          ))}
          <div />
        </div>
        {/* Body rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_1fr_80px_80px_90px_90px_90px_90px_32px] gap-4 px-4 py-3.5 border-b border-border/30 last:border-0">
            <Skeleton className="h-3.5 w-24 font-mono" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-5 w-16 rounded-full mx-auto" />
            <Skeleton className="h-3.5 w-full ml-auto" />
            <Skeleton className="h-3.5 w-full ml-auto" />
            <Skeleton className="h-3.5 w-full ml-auto" />
            <Skeleton className="h-5 w-5 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
