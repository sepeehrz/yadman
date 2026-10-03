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
          className="rounded-2xl bg-white p-4 shadow-xs border border-[#e2e8f0]/70 animate-pulse"
        >
          <div className="h-4 w-2/3 rounded bg-[#e5eeff]" />
          <div className="h-3 w-1/3 rounded bg-[#eff4ff] mt-2" />
        </div>
      ))}
    </div>
  );
}
