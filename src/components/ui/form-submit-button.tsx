"use client";

import { AppIcon } from "@/components/ui/app-icon";

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isPending?: boolean;
  label: string;
  pendingLabel?: string;
}

export function FormSubmitButton({
  isPending = false,
  label,
  pendingLabel = "لطفاً صبر کنید…",
  disabled,
  ...buttonProps
}: IProps) {
  return (
    <button
      {...buttonProps}
      type="submit"
      disabled={disabled || isPending}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-bold text-sm text-primary-foreground shadow-xs transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isPending ? (
        <>
          <AppIcon name="progress_activity" className="size-4.5 animate-spin" />
          <span>{pendingLabel}</span>
        </>
      ) : (
        <>
          <span>{label}</span>
          <AppIcon name="arrow_back" className="size-4.5 rotate-180" />
        </>
      )}
    </button>
  );
}
