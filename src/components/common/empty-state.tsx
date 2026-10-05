"use client";
import { AppIcon } from "@/components/ui/app-icon";

interface IProps {
  icon: string;
  title: string;
  hint?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  hint,
  actionLabel,
  onAction,
}: IProps) {
  return (
    <div className="rounded-2xl bg-card p-6 shadow-xs border border-border/70 text-center">
      <AppIcon name={icon} className="size-8 text-muted-foreground/60" />
      <p className="text-sm font-bold text-foreground mt-1">{title}</p>
      {hint ? (
        <p className="text-xs text-muted-foreground mt-1">{hint}</p>
      ) : null}
      {actionLabel && onAction ? (
        <button
          onClick={onAction}
          className="mt-4 w-full h-11 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary active:scale-95 transition-all flex items-center justify-center gap-1"
        >
          <AppIcon name="add_circle" className="size-4" />
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
