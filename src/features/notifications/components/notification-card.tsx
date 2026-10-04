"use client";

import type { AppNotification } from "../types";
import { faNum } from "@/lib/format";

/** استایل هر سطح شدت — از فوری‌ترین تا نزدیک */
const SEVERITY_STYLE: Record<
  AppNotification["severity"],
  { card: string; badge: string; label: string }
> = {
  overdue: {
    card: "bg-[#ffdad6]/40 hover:bg-[#ffdad6]/70 border-r-[#ba1a1a]",
    badge: "bg-[#ffdad6] text-[#93000a]",
    label: "گذشته از موعد",
  },
  urgent: {
    card: "bg-amber-50 hover:bg-amber-100/70 border-r-amber-500",
    badge: "bg-amber-100 text-amber-900",
    label: "فوری",
  },
  soon: {
    card: "bg-[#eff4ff] hover:bg-[#e5eeff] border-r-[#4f46e5]",
    badge: "bg-[#e5eeff] text-[#3525cd]",
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
        unread ? "ring-1 ring-[#4f46e5]/25" : "opacity-75"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${style.badge}`}
        >
          {notification.category}
        </span>
        <span className="text-[10px] text-[#545f73] whitespace-nowrap">
          {formatTimeDistance(notification.dueAt)}
        </span>
      </div>
      <h4 className="text-xs font-bold text-[#0b1c30] mt-1">
        {notification.title}
      </h4>
      <p className="text-[11px] text-[#464555] mt-0.5 line-clamp-2">
        {notification.body}
      </p>
    </button>
  );
}