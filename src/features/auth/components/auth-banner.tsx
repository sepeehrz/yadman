"use client";

import { AppIcon } from "@/components/ui/app-icon";

interface IProps {
  tone: "info" | "success" | "warning";
  message: string;
}

const TONE_STYLES = {
  info: "bg-info/10 text-info border-info/30",
  success: "bg-success/10 text-success border-success/30",
  warning: "bg-warning/15 text-warning-foreground border-warning/40",
} as const;

const TONE_ICONS = {
  info: "info",
  success: "check_circle",
  warning: "timer_off",
} as const;

export function AuthBanner({ tone, message }: IProps) {
  return (
    <div
      role="status"
      className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-semibold ${TONE_STYLES[tone]}`}
    >
      <AppIcon name={TONE_ICONS[tone]} className="size-[17px] shrink-0" />
      <span>{message}</span>
    </div>
  );
}
