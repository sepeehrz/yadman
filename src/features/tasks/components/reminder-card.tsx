"use client";

import { AppIcon } from "@/components/ui/app-icon";
import { faNum } from "@/lib/format";
import { formatFaDateWithTime } from "@/utils";
import type { Reminder } from "../types";
import {
  getEffectiveDueAt,
  isReminderOverdue,
  PRIORITY_LABEL,
  RECURRENCE_LABEL,
} from "../utils/reminder-helpers";
import { SnoozeMenu } from "./snooze-menu";

interface IProps {
  reminder: Reminder;
  pending?: boolean;
  onToggle: (reminder: Reminder) => void;
  onSnooze: (reminder: Reminder, minutes: number) => void;
  onEdit: (reminder: Reminder) => void;
  onDelete: (reminder: Reminder) => void;
}

const STRIPE_CLASS: Record<Reminder["priority"], string> = {
  high: "bg-[#ba1a1a]",
  normal: "bg-[#4f46e5]",
  low: "bg-[#c7c4d8]",
};

export function ReminderCard({
  reminder,
  pending = false,
  onToggle,
  onSnooze,
  onEdit,
  onDelete,
}: IProps) {
  const overdue = isReminderOverdue(reminder);
  const dueLabel = formatFaDateWithTime(getEffectiveDueAt(reminder));

  return (
    <div
      className={`bg-white rounded-2xl p-4 shadow-xs border relative overflow-hidden transition-all duration-300 ${
        reminder.done ? "opacity-60 bg-[#f8f9ff]" : "border-[#e2e8f0]/80"
      }`}
    >
      <div
        className={`absolute right-0 top-0 bottom-0 w-1.5 ${STRIPE_CLASS[reminder.priority]}`}
      />
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => onToggle(reminder)}
          disabled={pending}
          aria-label={
            reminder.done ? "بازگرداندن یادآور" : "علامت‌زدن به‌عنوان انجام‌شده"
          }
          aria-pressed={reminder.done}
          className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all active:scale-90 ${
            reminder.done
              ? "bg-[#006e4b] text-white"
              : "bg-[#eff4ff] text-transparent hover:bg-[#e5eeff] border border-[#c7c4d8]"
          }`}
        >
          <AppIcon name="check" className="size-[16px]" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              {reminder.priority !== "normal" ? (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    reminder.priority === "high"
                      ? "bg-[#ffdad6] text-[#93000a]"
                      : "bg-[#e5eeff] text-[#545f73]"
                  }`}
                >
                  اولویت {PRIORITY_LABEL[reminder.priority]}
                </span>
              ) : null}
              {reminder.recurrence !== "none" ? (
                <span className="inline-flex items-center gap-0.5 text-[#545f73] text-[10px] font-semibold">
                  <AppIcon name="sync" className="size-[12px]" />{" "}
                  {RECURRENCE_LABEL[reminder.recurrence]}
                </span>
              ) : null}
              {reminder.snoozedUntil ? (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#3525cd]">
                  <AppIcon name="schedule" className="size-[12px]" /> به تعویق
                  افتاد
                </span>
              ) : null}
              {overdue ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a]">
                  گذشته از موعد
                </span>
              ) : null}
            </div>
            <span className="text-[11px] font-semibold flex items-center gap-1 text-[#545f73]">
              <AppIcon name="schedule" className="size-[13px]" /> {dueLabel}
            </span>
          </div>

          <p
            className={`text-sm sm:text-base font-bold text-[#0b1c30] mt-1 transition-all ${
              reminder.done ? "line-through text-[#545f73]" : ""
            }`}
          >
            {reminder.title}
          </p>

          {reminder.description ? (
            <p className="text-xs text-[#545f73] mt-1 leading-snug">
              {reminder.description}
            </p>
          ) : null}

          {!reminder.done ? (
            <div className="flex items-center gap-1.5 mt-2.5">
              <SnoozeMenu
                disabled={pending}
                onSelect={(minutes) => onSnooze(reminder, minutes)}
              />
              <button
                type="button"
                onClick={() => onEdit(reminder)}
                disabled={pending}
                aria-label={`ویرایش ${reminder.title}`}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#eff4ff] text-[#545f73] text-[11px] font-bold hover:bg-[#e5eeff] active:scale-95 transition-all"
              >
                <AppIcon name="edit" className="size-[14px]" />
                <span>ویرایش</span>
              </button>
              <button
                type="button"
                onClick={() => onDelete(reminder)}
                disabled={pending}
                aria-label={`حذف ${reminder.title}`}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#ffdad6]/50 text-[#93000a] text-[11px] font-bold hover:bg-[#ffdad6] active:scale-95 transition-all"
              >
                <AppIcon name="delete" className="size-[14px]" />
                <span>حذف</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
