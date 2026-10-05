"use client";

import type { AppNotification } from "../types";
import { faNum } from "@/lib/format";

/** استایل هر سطح شدت — از فوری‌ترین تا نزدیک */
const SEVERITY_STYLE: Record<
  AppNotification["severity"],
  { card: string; badge: string; label: string }
> = {
  overdue: {
    card: "bg-destructive/10 hover:bg-destructive/20 border-r-destructive",
    badge: "bg-destructive/15 text-destructive",
    label: "گذشته از موعد",
  },
  urgent: {
    card: "bg-warning/10 hover:bg-warning/20 border-r-warning",
    badge: "bg-warning text-warning-foreground",
    label: "فوری",
  },
  soon: {
    card: "bg-primary/5 hover:bg-primary/10 border-r-primary",
    badge: "bg-primary/10 text-primary",
    label: "نزدیک",
  },
};

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

/** فاصله‌ی زمانی تا موعد به زبان فارسی — مثل «۱۰ دقیقه پیش» */
export function formatTimeDistance(value: string, now: Date = new Date()): string {
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return "";
  const delta = now.getTime() - time;
  const past = delta >= 0;
  const abs = Math.abs(delta);

  let text: string;
  if (abs < MINUTE_MS) {
    return "همین الان";
  }
  if (abs < HOUR_MS) {
    text = `${faNum(Math.floor(abs / MINUTE_MS))} دقیقه`;
  } else if (abs < DAY_MS) {
    text = `${faNum(Math.floor(abs / HOUR_MS))} ساعت`;
  } else {
    text = `${faNum(Math.floor(abs / DAY_MS))} روز`;
  }

  return past ? `${text} پیش` : `${text} دیگر`;
}

interface IProps {
  notification: AppNotification & { read?: boolean };
  onSelect?: () => void;
}

export function NotificationCard({ notification, onSelect }: IProps) {
  const style = SEVERITY_STYLE[notification.severity];
  const unread = notification.read === false;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-right p-3 rounded-xl border-r-4 transition-all ${style.card} ${
        unread ? "ring-1 ring-primary/25" : "opacity-75"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${style.badge}`}
        >
          {notification.category}
        </span>
        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
          {formatTimeDistance(notification.dueAt)}
        </span>
      </div>
      <h4 className="text-xs font-bold text-foreground mt-1">
        {notification.title}
      </h4>
      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
        {notification.body}
      </p>
    </button>
  );
}