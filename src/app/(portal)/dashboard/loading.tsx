import { cn } from "@/lib/utils";

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-surface-elevated/60",
        className,
      )}
    />
  );
}

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <Skeleton className="h-8 w-60 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Stats grid - 4 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface-elevated border border-border rounded-xl p-6"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts row - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-elevated border border-border rounded-xl">
          <div className="px-6 py-4 border-b border-border-subtle">
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="p-6">
            <Skeleton className="h-[350px] w-full" />
          </div>
        </div>
        <div className="bg-surface-elevated border border-border rounded-xl">
          <div className="px-6 py-4 border-b border-border-subtle">
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="p-6">
            <Skeleton className="h-[350px] w-full" />
          </div>
        </div>
      </div>

      {/* Submission list */}
      <div>
        <Skeleton className="h-6 w-36 mb-3" />
        <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden">
          {/* Header row */}
          <div className="flex gap-4 px-4 py-3 bg-surface-elevated/50 border-b border-border">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
          {/* Data rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-4 px-4 py-3 border-b border-border-subtle"
            >
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom row - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-elevated border border-border rounded-xl">
          <div className="px-6 py-4 border-b border-border-subtle">
            <Skeleton className="h-4 w-36" />
          </div>
          <div className="p-6">
            <Skeleton className="h-[280px] w-full" />
          </div>
        </div>
        <div className="bg-surface-elevated border border-border rounded-xl">
          <div className="px-6 py-4 border-b border-border-subtle">
            <Skeleton className="h-4 w-44" />
          </div>
          <div className="p-6 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
