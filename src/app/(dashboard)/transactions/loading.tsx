import { Skeleton } from "@/components/ui/skeleton";

export default function TransactionsLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-4 w-56" />
      </div>

      {/* Filters bar */}
      <div className="flex gap-3 flex-wrap">
        <Skeleton className="h-8 w-52 rounded-full" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-8 w-24 ml-auto" />
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border/60 overflow-hidden">
        <div className="px-4 py-3 border-b border-border/40 grid grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-3.5 w-full" />
          ))}
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="px-4 py-3.5 border-b border-border/30 grid grid-cols-6 gap-4 items-center">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3.5 w-16 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
