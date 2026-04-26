import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-52" />
      </div>

      {/* Profile card */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-5">
        <Skeleton className="h-4 w-16" />
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-64 rounded-md" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-10 w-64 rounded-md opacity-50" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      </div>

      {/* Account info card */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-5">
        <Skeleton className="h-4 w-36" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-3.5 w-32" />
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone card */}
      <div className="bg-card rounded-xl border border-destructive/30 p-6 space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-72" />
        <Skeleton className="h-8 w-32 rounded-md" />
      </div>
    </div>
  );
}
