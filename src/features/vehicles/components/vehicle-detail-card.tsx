"use client";

import { faKm, faNum } from "@/lib/format";
import type { Vehicle } from "../types";
import { AppIcon } from "@/components/ui/app-icon";

interface IProps {
  vehicle: Vehicle;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export function VehicleDetailCard({
  vehicle,
  onEdit,
  onDelete,
  isDeleting,
}: IProps) {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-sm border border-border/70 relative overflow-hidden">
      <div className="absolute -left-10 -bottom-10 w-44 h-44 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-foreground">{vehicle.name}</h2>
          <p className="text-xs text-muted-foreground font-semibold">
            {vehicle.brand} {vehicle.model}
            {vehicle.year ? ` • مدل ${faNum(vehicle.year)}` : ""}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span
              className="px-2.5 py-1 rounded-lg bg-primary/10 text-foreground text-xs font-mono font-bold"
              dir="ltr"
            >
              {vehicle.plateNumber}
            </span>
            {vehicle.color ? (
              <span className="px-2.5 py-1 rounded-lg bg-primary/5 text-xs font-semibold text-muted-foreground">
                {vehicle.color}
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={onEdit}
            aria-label="ویرایش خودرو"
            className="w-9 h-9 rounded-full bg-primary/5 text-primary flex items-center justify-center hover:bg-primary/10 active:scale-95 transition-all"
          >
            <AppIcon name="edit" className="size-[20px]" />
          </button>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            aria-label="حذف خودرو"
            className="w-9 h-9 rounded-full bg-destructive/50 text-destructive flex items-center justify-center hover:bg-destructive/15 active:scale-95 transition-all disabled:opacity-50"
          >
            <AppIcon name="delete" className="size-[20px]" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-3 relative z-10">
        <div className="rounded-xl bg-primary/5 p-3 border border-primary/60">
          <span className="text-[11px] font-bold text-muted-foreground block">
            کیلومتر فعلی
          </span>
          <span className="text-lg font-extrabold text-foreground">
            {faKm(vehicle.odometerKm)}
          </span>
        </div>
        <div className="rounded-xl bg-primary/5 p-3 border border-primary/60">
          <span className="text-[11px] font-bold text-muted-foreground block">
            سوخت
          </span>
          <span className="text-sm font-bold text-foreground">
            {vehicle.fuelType === "electric"
              ? "برقی"
              : vehicle.fuelType === "hybrid"
                ? "هیبرید"
                : vehicle.fuelType === "dual"
                  ? "دوگانه‌سوز"
                  : vehicle.fuelType === "diesel"
                    ? "گازوئیل"
                    : "بنزین"}
          </span>
          {vehicle.vin ? (
            <span
              className="text-[10px] text-muted-foreground block font-mono"
              dir="ltr"
            >
              VIN: {vehicle.vin}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
