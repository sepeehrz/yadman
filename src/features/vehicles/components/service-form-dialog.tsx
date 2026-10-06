"use client";

import { useEffect, useRef, useState } from "react";
import { BaseDialog } from "@/components/ui/dialog";
import { NumberInput } from "@/components/common/number-input";
import { DatePickerComponent } from "@/components/common/date-picker";
import { faNum } from "@/lib/format";
import { toISODateOnly } from "@/utils";
import type { CreateServiceInput } from "../types";
import {
  parseServiceForm,
} from "../validations/service-schema";
import type { FieldErrors } from "../validations/shared-schema";
import { AppIcon } from "@/components/ui/app-icon";

interface IProps {
  open: boolean;
  defaultOdometer: number;
  pending: boolean;
  onClose: () => void;
  onSubmit: (input: CreateServiceInput) => void;
}

const inputClass =
  "w-full h-12 bg-primary/5 text-foreground rounded-xl px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }
  return <p className="text-[11px] text-destructive font-semibold">{message}</p>;
}

/**
 * وضعیت فرم — کیلومترها به شکل رشته نگه داشته می‌شوند تا ورود عدد با جداکننده هزارگان راحت باشد.
 */
interface ServiceFormState {
  title: string;
  serviceDate: string;
  provider: string;
  odometerKm: string;
  cost: string;
  notes: string;
  nextDueDate: string | undefined;
  nextDueKm: string;
}

function toEmptyForm(defaultOdometer: number): ServiceFormState {
  return {
    title: "",
    serviceDate: toISODateOnly(new Date()),
    provider: "",
    odometerKm: defaultOdometer > 0 ? String(defaultOdometer) : "",
    cost: "",
    notes: "",
    nextDueDate: undefined,
    nextDueKm: "",
  };
}

export function ServiceFormDialog({
  open,
  defaultOdometer,
  pending,
  onClose,
  onSubmit,
}: IProps) {
  const [form, setForm] = useState<ServiceFormState>(() =>
    toEmptyForm(defaultOdometer),
  );
  const [errors, setErrors] = useState<FieldErrors>({});

  const odometerRef = useRef(defaultOdometer);
  odometerRef.current = defaultOdometer;

  useEffect(() => {
    if (open) {
      setForm(toEmptyForm(odometerRef.current));
      setErrors({});
    }
  }, [open]);

  function set<K extends keyof ServiceFormState>(
    key: K,
    value: ServiceFormState[K],
  ): void {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent): void {
    event.preventDefault();
    const parsed = parseServiceForm({
      ...form,
      odometerKm: form.odometerKm,
      nextDueKm: form.nextDueKm === "" ? null : form.nextDueKm,
    });
    if (!parsed.ok) {
      setErrors(parsed.errors);
      return;
    }
    setErrors({});
    onSubmit(parsed.data);
  }

  return (
    <BaseDialog open={open} onClose={onClose} title="ثبت سرویس جدید" size="lg">
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h3 className="text-base font-bold text-foreground">ثبت سرویس جدید</h3>
          <button
            onClick={onClose}
            aria-label="بستن"
            className="w-8 h-8 rounded-full bg-primary/5 text-muted-foreground flex items-center justify-center hover:bg-primary/10"
          >
            <AppIcon name="close" className="size-[18px]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 pt-4">
          <div className="space-y-1">
            <label
              className="text-xs font-bold text-muted-foreground"
              htmlFor="service-title"
            >
              نام سرویس
            </label>
            <input
              id="service-title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="مثلاً تعویض روغن موتور"
              className={inputClass}
            />
            <FieldError message={errors.title} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label
                className="text-xs font-bold text-muted-foreground"
                htmlFor="service-date"
              >
                تاریخ انجام
              </label>
              <DatePickerComponent
                id="service-date"
                value={form.serviceDate || null}
                onChange={(value) => set("serviceDate", value ?? "")}
                placeholder="انتخاب تاریخ"
              />
              <FieldError message={errors.serviceDate} />
            </div>
            <div className="space-y-1">
              <label
                className="text-xs font-bold text-muted-foreground"
                htmlFor="service-km"
              >
                کیلومتر فعلی
              </label>
              <NumberInput
                id="service-km"
                value={form.odometerKm}
                onChange={(value) => set("odometerKm", value)}
                placeholder="مثلاً 85,420"
              />
              <FieldError message={errors.odometerKm} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label
                className="text-xs font-bold text-muted-foreground"
                htmlFor="service-cost"
              >
                هزینه
              </label>
              <input
                id="service-cost"
                type="number"
                value={form.cost}
                onChange={(e) => set("cost", e.target.value)}
                className={inputClass}
              />
              <FieldError message={errors.cost} />
            </div>
            <div className="space-y-1">
              <label
                className="text-xs font-bold text-muted-foreground"
                htmlFor="service-provider"
              >
                ارائه‌دهنده
              </label>
              <input
                id="service-provider"
                value={form.provider}
                onChange={(e) => set("provider", e.target.value)}
                placeholder="نام تعمیرگاه"
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              className="text-xs font-bold text-muted-foreground"
              htmlFor="service-notes"
            >
              توضیحات تکمیلی
            </label>
            <textarea
              id="service-notes"
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={2}
              className="w-full p-3 rounded-xl bg-primary/5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="rounded-xl bg-primary/5 p-3 border border-primary/60 space-y-2">
            <p className="text-xs font-bold text-primary">
              مراجعه بعدی (یادآور)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <DatePickerComponent
                value={form.nextDueDate ?? null}
                onChange={(value) => set("nextDueDate", value ?? undefined)}
                placeholder="تاریخ"
                className="h-11 text-xs bg-card"
              />
              <div className="h-11 bg-card rounded-xl px-3 flex items-center gap-1">
                <NumberInput
                  aria-label="کیلومتر بعدی"
                  value={form.nextDueKm}
                  onChange={(value) => set("nextDueKm", value)}
                  placeholder="کیلومتر"
                  className="h-11 flex-1 bg-transparent px-0 text-xs font-bold rounded-none focus:bg-transparent focus:ring-0"
                />
                <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">
                  {form.nextDueKm ? `${faNum(Number(form.nextDueKm))}` : "KM"}
                </span>
              </div>
            </div>
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
              {pending ? "در حال ذخیره..." : "ثبت سرویس"}
            </button>
          </div>
        </form>
      </div>
    </BaseDialog>
  );
}
