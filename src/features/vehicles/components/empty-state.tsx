"use client";

interface IProps {
  icon: string;
  title: string;
  hint?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, hint, actionLabel, onAction }: IProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-xs border border-[#e2e8f0]/70 text-center">
      <span className="material-symbols-outlined text-[32px] text-[#c7c4d8]">{icon}</span>
      <p className="text-sm font-bold text-[#0b1c30] mt-1">{title}</p>
      {hint ? <p className="text-xs text-[#545f73] mt-1">{hint}</p> : null}
      {actionLabel && onAction ? (
        <button
          onClick={onAction}
          className="mt-4 w-full h-11 rounded-xl bg-[#4f46e5] text-white font-bold text-xs hover:bg-[#3525cd] active:scale-95 transition-all flex items-center justify-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">add_circle</span>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
