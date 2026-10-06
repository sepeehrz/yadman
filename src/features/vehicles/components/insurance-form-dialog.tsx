"use client";

import { useEffect, useState } from "react";
import { BaseDialog } from "@/components/ui/dialog";
import { DatePickerComponent } from "@/components/common/date-picker";
import type { CreateInsuranceInput, Insurance } from "../types";
import {
  parseInsuranceForm,
  type CreateInsuranceForm,
} from "../validations/insurance-schema";
import type { FieldErrors } from "../validations/shared-schema";
import { AppIcon } from "@/components/ui/app-icon";

interface IProps {
  open: boolean;
  pending: boolean;
  onClose: () => void;
  onSubmit: (input: CreateInsuranceInput) => void;
}

const inputClass =
  "w-full h-12 bg-primary/5 text-foreground rounded-xl px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }
  return <p className="text-[11px] text-destructive font-semibold">{message}</p>;
}

const EMPTY_FORM: CreateInsuranceForm = {
  type: "third-party",
  company: "",
  policyNumber: "",
  startDate: "",
  endDate: "",
  cost: null,
  notes: "",
};

export function InsuranceFormDialog({
  open,
  pending,
  onClose,
  onSubmit,
}: IProps) {
  const [form, setForm] = useState<CreateInsuranceForm>({ ...EMPTY_FORM });
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (open) {
      setForm({ ...EMPTY_FORM });
      setErrors({});
    }
  }, [open]);

  function set<K extends keyof CreateInsuranceForm>(
    key: K,
    value: CreateInsuranceForm[K],
  ): void {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent): void {
    event.preventDefault();
    const parsed = parseInsuranceForm(form);
    if (!parsed.ok) {
      setErrors(parsed.errors);
      return;
    }
    setErrors({});
    onSubmit(parsed.data);
  }

  return (
    <BaseDialog open={open} onClose={onClose} title="ثبت بیمه‌نامه" size="lg">
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h3 className="text-base font-bold text-foreground">ثبت بیمه‌نامه</h3>
          <button
            onClick={onClose}
            aria-label="بستن"
            className="w-8 h-8 rounded-full bg-primary/5 text-muted-foreground flex items-center justify-center hover:bg-primary/10"
          >
            <AppIcon name="close" className="size-[18px]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 pt-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label
                className="text-xs font-bold text-muted-foreground"
                htmlFor="insurance-type"
              >
                نوع بیمه
              </label>
              <select
                id="insurance-type"
                value={form.type}
                onChange={(e) =>
                  set("type", e.target.value as Insurance["type"])
                }
                className={inputClass}
              >
                <option value="third-party">شخص ثالث</option>
                <option value="body">بدنه</option>
              </select>
            </div>
            <div className="space-y-1">
              <label
                className="text-xs font-bold text-muted-foreground"
                htmlFor="insurance-company"
              >
                شرکت بیمه
              </label>
              <input
                id="insurance-company"
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                placeholder="مثلاً ایران"
                className={inputClass}
              />
              <FieldError message={errors.company} />
            </div>
          </div>

          <div className="space-y-1">
            <label
              className="text-xs font-bold text-muted-foreground"
              htmlFor="insurance-policy"
            >
              شماره بیمه‌نامه (اختیاری)
            </label>
            <input
              id="insurance-policy"
              value={form.policyNumber}
              onChange={(e) => set("policyNumber", e.target.value)}
              className={inputClass}
              dir="ltr"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label
                className="text-xs font-bold text-muted-foreground"
                htmlFor="insurance-start"
              >
                شروع اعتبار
              </label>
              <DatePickerComponent
                id="insurance-start"
                value={form.startDate || null}
                onChange={(value) => set("startDate", value ?? "")}
                placeholder="انتخاب تاریخ"
              />
              <FieldError message={errors.startDate} />
            </div>
            <div className="space-y-1">
              <label
                className="text-xs font-bold text-muted-foreground"
                htmlFor="insurance-end"
              >
                پایان اعتبار
              </label>
              <DatePickerComponent
                id="insurance-end"
                value={form.endDate || null}
                onChange={(value) => set("endDate", value ?? "")}
                placeholder="انتخاب تاریخ"
              />
              <FieldError message={errors.endDate} />
            </div>
          </div>

          <div className="space-y-1">
            <label
              className="text-xs font-bold text-muted-foreground"
              htmlFor="insurance-cost"
            >
              هزینه (اختیاری)
            </label>
            <input
              id="insurance-cost"
              type="number"
              value={form.cost ?? ""}
              onChange={(e) =>
                set(
                  "cost",
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
              className={inputClass}
            />
            <FieldError message={errors.cost} />
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
              {pending ? "در حال ذخیره..." : "ثبت بیمه‌نامه"}
            </button>
          </div>
        </form>
      </div>
    </BaseDialog>
  );
}
