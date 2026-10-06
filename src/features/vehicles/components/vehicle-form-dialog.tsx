"use client";

import { useEffect, useRef, useState } from "react";
import { BaseDialog } from "@/components/ui/dialog";
import { NumberInput } from "@/components/common/number-input";
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

const inputClass =
  "w-full h-12 bg-primary/5 text-foreground rounded-xl px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }
  return <p className="text-[11px] text-destructive font-semibold">{message}</p>;
}

/** وضعیت فرم — کیلومتر به شکل رشته نگه داشته می‌شود تا تایپ عددی راحت باشد. */
type VehicleFormState = Omit<CreateVehicleForm, "odometerKm"> & {
  odometerKm: string;
};

function toForm(initial: Vehicle | null): VehicleFormState {
  return {
    name: initial?.name ?? "",
    year: initial?.year ?? null,
    odometerKm:
      initial && initial.odometerKm > 0 ? String(initial.odometerKm) : "",
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
  const [form, setForm] = useState<VehicleFormState>(() => toForm(initial));
  const [errors, setErrors] = useState<FieldErrors>({});

  const initialRef = useRef(initial);
  initialRef.current = initial;

  useEffect(() => {
    if (open) {
      setForm(toForm(initialRef.current));
      setErrors({});
    }
  }, [open]);

  function set<K extends keyof VehicleFormState>(
    key: K,
    value: VehicleFormState[K],
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
                htmlFor="vehicle-km"
              >
                کیلومتر فعلی
              </label>
              <NumberInput
                id="vehicle-km"
                value={form.odometerKm}
                onChange={(value) => set("odometerKm", value)}
                placeholder="مثلاً 85,420"
              />
              <FieldError message={errors.odometerKm} />
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
