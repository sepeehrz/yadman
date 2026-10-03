"use client";

import { useEffect, useRef, useState } from "react";
import { BaseDialog } from "@/components/ui/dialog";
import { faNum } from "@/lib/format";
import { toISODateOnly } from "@/utils";
import type { CreateServiceInput, ServiceCategory } from "../types";
import {
  parseServiceForm,
  type CreateServiceForm,
} from "../validations/service-schema";
import type { FieldErrors } from "../validations/shared-schema";
import { suggestNextService } from "../utils/service-helpers";
import { AppIcon } from "@/components/ui/app-icon";

interface IProps {
  open: boolean;
  categories: ServiceCategory[];
  defaultOdometer: number;
  pending: boolean;
  onClose: () => void;
  onSubmit: (input: CreateServiceInput) => void;
}

const inputClass =
  "w-full h-12 bg-[#eff4ff] text-[#0b1c30] rounded-xl px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/40 font-medium";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }
  return <p className="text-[11px] text-[#ba1a1a] font-semibold">{message}</p>;
}

export function ServiceFormDialog({
  open,
  categories,
  defaultOdometer,
  pending,
  onClose,
  onSubmit,
}: IProps) {
  const [form, setForm] = useState<CreateServiceForm>(() => ({
    title: "",
    categoryId: null,
    serviceDate: toISODateOnly(new Date()),
    provider: "",
    odometerKm: defaultOdometer,
    cost: 0,
    notes: "",
    nextDueDate: undefined,
    nextDueKm: null,
  }));
  const [errors, setErrors] = useState<FieldErrors>({});

  const odometerRef = useRef(defaultOdometer);
  odometerRef.current = defaultOdometer;

  useEffect(() => {
    if (open) {
      setForm({
        title: "",
        categoryId: null,
        serviceDate: toISODateOnly(new Date()),
        provider: "",
        odometerKm: odometerRef.current,
        cost: 0,
        notes: "",
        nextDueDate: undefined,
        nextDueKm: null,
      });
      setErrors({});
    }
  }, [open]);

  function set<K extends keyof CreateServiceForm>(
    key: K,
    value: CreateServiceForm[K],
  ): void {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function applyCategory(categoryId: string): void {
    const category = categories.find((item) => item.id === categoryId) ?? null;
    const suggestion = suggestNextService(
      category,
      form.serviceDate,
      form.odometerKm,
    );
    setForm((prev) => ({
      ...prev,
      categoryId: categoryId || null,
      title: prev.title || category?.title || "",
      nextDueDate: suggestion.nextDueDate ?? prev.nextDueDate,
      nextDueKm: suggestion.nextDueKm ?? prev.nextDueKm,
    }));
  }

  function handleSubmit(event: React.FormEvent): void {
    event.preventDefault();
    const parsed = parseServiceForm(form);
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
        <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
          <h3 className="text-base font-bold text-[#0b1c30]">ثبت سرویس جدید</h3>
          <button
            onClick={onClose}
            aria-label="بستن"
            className="w-8 h-8 rounded-full bg-[#eff4ff] text-[#545f73] flex items-center justify-center hover:bg-[#e5eeff]"
          >
            <AppIcon name="close" className="size-[18px]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 pt-4">
          <div className="space-y-1">
            <label
              className="text-xs font-bold text-[#545f73]"
              htmlFor="service-category"
            >
              دسته‌بندی سرویس
            </label>
            <select
              id="service-category"
              value={form.categoryId ?? ""}
              onChange={(e) => applyCategory(e.target.value)}
              className={inputClass}
            >
              <option value="">بدون دسته‌بندی</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label
              className="text-xs font-bold text-[#545f73]"
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
                className="text-xs font-bold text-[#545f73]"
                htmlFor="service-date"
              >
                تاریخ انجام
              </label>
              <input
                id="service-date"
                type="date"
                value={form.serviceDate}
                onChange={(e) => set("serviceDate", e.target.value)}
                className={inputClass}
              />
              <FieldError message={errors.serviceDate} />
            </div>
            <div className="space-y-1">
              <label
                className="text-xs font-bold text-[#545f73]"
                htmlFor="service-km"
              >
                کیلومتر فعلی
              </label>
              <input
                id="service-km"
                type="number"
                value={form.odometerKm}
                onChange={(e) => set("odometerKm", Number(e.target.value))}
                className={inputClass}
              />
              <FieldError message={errors.odometerKm} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label
                className="text-xs font-bold text-[#545f73]"
                htmlFor="service-cost"
              >
                هزینه
              </label>
              <input
                id="service-cost"
                type="number"
                value={form.cost}
                onChange={(e) => set("cost", Number(e.target.value))}
                className={inputClass}
              />
              <FieldError message={errors.cost} />
            </div>
            <div className="space-y-1">
              <label
                className="text-xs font-bold text-[#545f73]"
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
              className="text-xs font-bold text-[#545f73]"
              htmlFor="service-notes"
            >
              توضیحات تکمیلی
            </label>
            <textarea
              id="service-notes"
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={2}
              className="w-full p-3 rounded-xl bg-[#eff4ff] text-sm text-[#0b1c30] outline-none focus:ring-2 focus:ring-[#4f46e5]/40"
            />
          </div>

          <div className="rounded-xl bg-[#eff4ff] p-3 border border-[#dce9ff]/60 space-y-2">
            <p className="text-xs font-bold text-[#3525cd]">
              مراجعه بعدی (یادآور)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                aria-label="تاریخ مراجعه بعدی"
                value={form.nextDueDate ?? ""}
                onChange={(e) =>
                  set("nextDueDate", e.target.value || undefined)
                }
                className="h-11 bg-white rounded-xl px-3 text-xs font-semibold text-[#0b1c30] outline-none"
              />
              <div className="h-11 bg-white rounded-xl px-3 flex items-center gap-1">
                <input
                  type="number"
                  aria-label="کیلومتر بعدی"
                  value={form.nextDueKm ?? ""}
                  onChange={(e) =>
                    set(
                      "nextDueKm",
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                  placeholder="کیلومتر"
                  className="w-full bg-transparent text-xs font-bold text-[#0b1c30] focus:outline-none"
                />
                <span className="text-[10px] font-bold text-[#545f73] whitespace-nowrap">
                  {form.nextDueKm ? `${faNum(form.nextDueKm)}` : "KM"}
                </span>
              </div>
            </div>
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
              {pending ? "در حال ذخیره..." : "ثبت سرویس"}
            </button>
          </div>
        </form>
      </div>
    </BaseDialog>
  );
}
