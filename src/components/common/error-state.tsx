"use client";
import { AppIcon } from "@/components/ui/app-icon";

interface IProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: IProps) {
  return (
    <div className="rounded-2xl bg-destructive/30 p-6 border border-destructive/20 text-center">
      <AppIcon name="error" className="size-7 text-destructive" />
      <p className="text-sm font-bold text-foreground mt-1">{message}</p>
      <button
        onClick={onRetry}
        className="mt-3 px-4 py-2 rounded-xl bg-card text-xs font-bold text-primary border border-border hover:bg-primary/5 transition-colors"
      >
        تلاش مجدد
      </button>
    </div>
  );
}
