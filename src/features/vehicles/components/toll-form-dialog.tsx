"use client";

import { useState } from "react";
import { BaseDialog } from "@/components/ui/dialog";
import type { CreateTollInput } from "../types";
import { parseTollForm, type CreateTollForm } from "../validations/toll-schema";
import type { FieldErrors } from "../validations/shared-schema";
import { AppIcon } from "@/components/ui/app-icon";

interface IProps {
  open: boolean;
  pending: boolean;
  onClose: () => void;
  onSubmit: (input: CreateTollInput) => void;
}

const inputClass =
  "w-full h-12 bg-[#eff4ff] text-[#0b1c30] rounded-xl px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/40 font-medium";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }
  return <p className="text-[11px] text-[#ba1a1a] font-semibold">{message}</p>;
}

export function TollFormDialog({ open, pending, onClose, onSubmit }: IProps) {
  const [form, setForm] = useState<CreateTollForm>({
    year: "",
    amount: 0,
    dueDate: undefined,
    notes: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});

  function set<K extends keyof CreateTollForm>(
    key: K,
    value: CreateTollForm[K],
  ): void {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent): void {
    event.preventDefault();
    const parsed = parseTollForm(form);
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
      title="ثبت عوارض سالیانه"
      size="lg"
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
          <h3 className="text-base font-bold text-[#0b1c30]">
            ثبت عوارض سالیانه
          </h3>
          <button
            onClick={onClose}
            aria-label="بستن"
            className="w-8 h-8 rounded-full bg-[#eff4ff] text-[#545f73] flex items-center justify-center hover:bg-[#e5eeff]"
          >
            <AppIcon name="close" className="size-[18px]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 pt-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label
                className="text-xs font-bold text-[#545f73]"
                htmlFor="toll-year"
              >
                سال
              </label>
              <input
                id="toll-year"
                value={form.year}
                onChange={(e) => set("year", e.target.value)}
                placeholder="۱۴۰۳"
                className={inputClass}
              />
              <FieldError message={errors.year} />
            </div>
            <div className="space-y-1">
              <label
                className="text-xs font-bold text-[#545f73]"
                htmlFor="toll-amount"
              >
                مبلغ
              </label>
              <input
                id="toll-amount"
                type="number"
                value={form.amount}
                onChange={(e) => set("amount", Number(e.target.value))}
                className={inputClass}
              />
              <FieldError message={errors.amount} />
            </div>
          </div>

          <div className="space-y-1">
            <label
              className="text-xs font-bold text-[#545f73]"
              htmlFor="toll-due"
            >
              مهلت پرداخت (اختیاری)
            </label>
            <input
              id="toll-due"
              type="date"
              value={form.dueDate ?? ""}
              onChange={(e) => set("dueDate", e.target.value || undefined)}
              className={inputClass}
            />
            <FieldError message={errors.dueDate} />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl bg-[#eff4ff] text-[#545f73] font-semibold text-xs hover:bg-[#e5eeff]"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex-1 h-11 rounded-xl bg-[#4f46e5] text-white font-bold text-xs hover:bg-[#3525cd] active:scale-95 transition-all disabled:opacity-60"
            >
              {pending ? "در حال ذخیره..." : "ثبت عوارض"}
            </button>
          </div>
        </form>
      </div>
    </BaseDialog>
  );
}
