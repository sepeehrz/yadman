"use client";

import { useEffect, useRef, useState } from "react";
import { BaseDialog } from "@/components/ui/dialog";
import { AppIcon } from "@/components/ui/app-icon";
import { toISODateOnly } from "@/utils";
import type { CreateReminderInput, Reminder, ReminderPriority, ReminderRecurrence } from "../types";
import {
  parseReminderForm,
  reminderToForm,
  type ReminderForm,
} from "../validations/reminder-schema";
import type { FieldErrors } from "../validations/shared-schema";

interface IProps {
  open: boolean;
  initial: Reminder | null;
  pending: boolean;
  onClose: () => void;
  onSubmit: (input: CreateReminderInput) => void;
}

const inputClass =
  "w-full h-12 bg-primary/5 text-foreground rounded-xl px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium";

const PRIORITY_OPTIONS = [
  { value: "low", label: "کم" },
  { value: "normal", label: "عادی" },
  { value: "high", label: "🚨 فوری (هشدار)" },
] as const;

const RECURRENCE_OPTIONS = [
  { value: "none", label: "یک‌بار یادآوری" },
  { value: "daily", label: "روزانه" },
  { value: "weekly", label: "هفتگی" },
  { value: "monthly", label: "ماهانه" },
  { value: "yearly", label: "سالانه" },
] as const;

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }
  return <p className="text-[11px] text-destructive font-semibold">{message}</p>;
}

function emptyForm(): ReminderForm {
  return {
    title: "",
    description: "",
    dueDate: toISODateOnly(new Date()),
    dueTime: "09:00",
    priority: "normal",
    recurrence: "none",
  };
}

export function ReminderFormDialog({
  open,
  initial,
  pending,
  onClose,
  onSubmit,
}: IProps) {
  const [form, setForm] = useState<ReminderForm>(() => emptyForm());
  const [errors, setErrors] = useState<FieldErrors>({});

  const initialRef = useRef(initial);
  initialRef.current = initial;

  useEffect(() => {
    if (open) {
      setForm(initialRef.current ? reminderToForm(initialRef.current) : emptyForm());
      setErrors({});
    }
  }, [open]);

  function set<K extends keyof ReminderForm>(key: K, value: ReminderForm[K]): void {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent): void {
    event.preventDefault();
    const parsed = parseReminderForm(form);
    if (!parsed.ok) {
      setErrors(parsed.errors);
      return;
    }
    setErrors({});
    onSubmit(parsed.data);
  }

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title={initial ? "ویرایش یادآور" : "یادآور جدید"}
      size="lg"
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h3 className="text-base font-bold text-foreground">
            {initial ? "ویرایش یادآور" : "یادآور جدید"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="w-8 h-8 rounded-full bg-primary/5 text-muted-foreground flex items-center justify-center hover:bg-primary/10"
          >
            <AppIcon name="close" className="size-[18px]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 pt-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground" htmlFor="reminder-title">
              نام یادآور
            </label>
            <input
              id="reminder-title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="مثلاً جلسه دکتر، پرداخت اقساط"
              className={inputClass}
            />
            <FieldError message={errors.title} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground" htmlFor="reminder-date">
                تاریخ یادآور
              </label>
              <input
                id="reminder-date"
                type="date"
                value={form.dueDate}
                onChange={(e) => set("dueDate", e.target.value)}
                className={inputClass}
              />
              <FieldError message={errors.dueDate} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground" htmlFor="reminder-time">
                ساعت یادآور
              </label>
              <input
                id="reminder-time"
                type="time"
                value={form.dueTime}
                onChange={(e) => set("dueTime", e.target.value)}
                className={inputClass}
              />
              <FieldError message={errors.dueTime} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground" htmlFor="reminder-priority">
                سطح اولویت
              </label>
              <select
                id="reminder-priority"
                value={form.priority}
                onChange={(e) => set("priority", e.target.value as ReminderPriority)}
                className={inputClass}
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground" htmlFor="reminder-recurrence">
                تکرار
              </label>
              <select
                id="reminder-recurrence"
                value={form.recurrence}
                onChange={(e) =>
                  set("recurrence", e.target.value as ReminderRecurrence)
                }
                className={inputClass}
              >
                {RECURRENCE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label
              className="text-xs font-bold text-muted-foreground"
              htmlFor="reminder-description"
            >
              توضیحات تکمیلی
            </label>
            <textarea
              id="reminder-description"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={2}
              placeholder="یادداشت اختیاری برای این یادآور"
              className="w-full p-3 rounded-xl bg-primary/5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
            />
            <FieldError message={errors.description} />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl bg-primary/5 text-muted-foreground font-semibold text-xs hover:bg-primary/10"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary active:scale-95 transition-all disabled:opacity-60"
            >
              {pending
                ? "در حال ذخیره..."
                : initial
                  ? "ذخیره تغییرات"
                  : "ساخت یادآور"}
            </button>
          </div>
        </form>
      </div>
    </BaseDialog>
  );
}
