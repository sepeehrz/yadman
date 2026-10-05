"use client";

interface IProps {
  rows?: number;
}

export function LoadingSkeleton({ rows = 3 }: IProps) {
  return (
    <div className="space-y-2.5" aria-busy="true" aria-label="در حال بارگذاری">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl bg-card p-4 shadow-xs border border-border/70 animate-pulse"
        >
          <div className="h-4 w-2/3 rounded bg-primary/10" />
          <div className="h-3 w-1/3 rounded bg-primary/5 mt-2" />
        </div>
      ))}
    </div>
  );
}
