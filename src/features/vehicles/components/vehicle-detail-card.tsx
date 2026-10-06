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
          {vehicle.year ? (
            <p className="text-xs text-muted-foreground font-semibold">
              سال ساخت {faNum(vehicle.year)}
            </p>
          ) : null}
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
            className="w-9 h-9 rounded-full bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/15 active:scale-95 transition-all disabled:opacity-50"
          >
            <AppIcon name="delete" className="size-[20px]" />
          </button>
        </div>
      </div>

      <div className="pt-3 relative z-10">
        <div className="rounded-xl bg-primary/5 p-3 border border-primary/60">
          <span className="text-[11px] font-bold text-muted-foreground block">
            کیلومتر فعلی
          </span>
          <span className="text-lg font-extrabold text-foreground">
            {faKm(vehicle.odometerKm)}
          </span>
        </div>
      </div>
    </div>
  );
}
