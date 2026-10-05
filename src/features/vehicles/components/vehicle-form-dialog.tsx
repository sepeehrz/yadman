"use client";

import { useEffect, useRef, useState } from "react";
import { BaseDialog } from "@/components/ui/dialog";
import type { CreateVehicleInput, Vehicle } from "../types";
import {
  parseVehicleForm,
  type CreateVehicleForm,
} from "../validations/vehicle-schema";
import type { FieldErrors } from "../validations/shared-schema";
import { AppIcon } from "@/components/ui/app-icon";

interface IProps {
  open: boolean;
  initial: Vehicle | null;
  pending: boolean;
  onClose: () => void;
  onSubmit: (input: CreateVehicleInput) => void;
}

const FUEL_OPTIONS = [
  { value: "benzin", label: "بنزین" },
  { value: "diesel", label: "گازوئیل" },
  { value: "dual", label: "دوگانه‌سوز" },
  { value: "hybrid", label: "هیبرید" },
  { value: "electric", label: "برقی" },
];

const inputClass =
  "w-full h-12 bg-primary/5 text-foreground rounded-xl px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }
  return <p className="text-[11px] text-destructive font-semibold">{message}</p>;
}

function toForm(initial: Vehicle | null): CreateVehicleForm {
  return {
    name: initial?.name ?? "",
    brand: initial?.brand ?? "",
    model: initial?.model ?? "",
    year: initial?.year ?? null,
    color: initial?.color ?? "",
    plateNumber: initial?.plateNumber ?? "",
    vin: initial?.vin ?? "",
    fuelType: initial?.fuelType ?? "benzin",
    odometerKm: initial?.odometerKm ?? 0,
    imageUrl: initial?.imageUrl ?? "",
  };
}

export function VehicleFormDialog({
  open,
  initial,
  pending,
  onClose,
  onSubmit,
}: IProps) {
  const [form, setForm] = useState<CreateVehicleForm>(() => toForm(initial));
  const [errors, setErrors] = useState<FieldErrors>({});

  const initialRef = useRef(initial);
  initialRef.current = initial;

  useEffect(() => {
    if (open) {
      setForm(toForm(initialRef.current));
      setErrors({});
    }
  }, [open]);

  function set<K extends keyof CreateVehicleForm>(
    key: K,
    value: CreateVehicleForm[K],
  ): void {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent): void {
    event.preventDefault();
    const parsed = parseVehicleForm(form);
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
      title={initial ? "ویرایش خودرو" : "ثبت خودرو جدید"}
      size="lg"
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h3 className="text-base font-bold text-foreground">
            {initial ? "ویرایش خودرو" : "ثبت خودرو جدید"}
          </h3>
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
              htmlFor="vehicle-name"
            >
              نام خودرو
            </label>
            <input
              id="vehicle-name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="مثلاً تسلا مدل ۳"
              className={inputClass}
            />
            <FieldError message={errors.name} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label
                className="text-xs font-bold text-muted-foreground"
                htmlFor="vehicle-brand"
              >
                برند
              </label>
              <input
                id="vehicle-brand"
                value={form.brand}
                onChange={(e) => set("brand", e.target.value)}
                placeholder="تسلا"
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label
                className="text-xs font-bold text-muted-foreground"
                htmlFor="vehicle-model"
              >
                مدل
              </label>
              <input
                id="vehicle-model"
                value={form.model}
                onChange={(e) => set("model", e.target.value)}
                placeholder="لانگ‌رنج"
                className={inputClass}
              />
              <FieldError message={errors.model} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label
                className="text-xs font-bold text-muted-foreground"
                htmlFor="vehicle-year"
              >
                سال ساخت
              </label>
              <input
                id="vehicle-year"
                type="number"
                value={form.year ?? ""}
                onChange={(e) =>
                  set(
                    "year",
                    e.target.value === "" ? null : Number(e.target.value),
                  )
                }
                placeholder="۱۴۰۳"
                className={inputClass}
              />
              <FieldError message={errors.year} />
            </div>
            <div className="space-y-1">
              <label
                className="text-xs font-bold text-muted-foreground"
                htmlFor="vehicle-color"
              >
                رنگ
              </label>
              <input
                id="vehicle-color"
                value={form.color}
                onChange={(e) => set("color", e.target.value)}
                placeholder="سفید"
                className={inputClass}
              />
              <FieldError message={errors.color} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label
                className="text-xs font-bold text-muted-foreground"
                htmlFor="vehicle-plate"
              >
                پلاک
              </label>
              <input
                id="vehicle-plate"
                value={form.plateNumber}
                onChange={(e) => set("plateNumber", e.target.value)}
                placeholder="۱۲ب۳۴۵-۶۷"
                className={inputClass}
              />
              <FieldError message={errors.plateNumber} />
            </div>
            <div className="space-y-1">
              <label
                className="text-xs font-bold text-muted-foreground"
                htmlFor="vehicle-fuel"
              >
                سوخت
              </label>
              <select
                id="vehicle-fuel"
                value={form.fuelType}
                onChange={(e) => set("fuelType", e.target.value)}
                className={inputClass}
              >
                {FUEL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label
                className="text-xs font-bold text-muted-foreground"
                htmlFor="vehicle-km"
              >
                کیلومتر فعلی
              </label>
              <input
                id="vehicle-km"
                type="number"
                value={form.odometerKm}
                onChange={(e) => set("odometerKm", Number(e.target.value))}
                className={inputClass}
              />
              <FieldError message={errors.odometerKm} />
            </div>
            <div className="space-y-1">
              <label
                className="text-xs font-bold text-muted-foreground"
                htmlFor="vehicle-vin"
              >
                شماره شاسی (اختیاری)
              </label>
              <input
                id="vehicle-vin"
                value={form.vin}
                onChange={(e) => set("vin", e.target.value)}
                className={inputClass}
                dir="ltr"
              />
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
              {pending
                ? "در حال ذخیره..."
                : initial
                  ? "ذخیره تغییرات"
                  : "ثبت خودرو"}
            </button>
          </div>
        </form>
      </div>
    </BaseDialog>
  );
}
