"use client";

import { faKm, faNum } from "@/lib/format";
import type { Vehicle } from "../types";
import { AppIcon } from "@/components/ui/app-icon";

interface IProps {
  vehicles: Vehicle[];
  selectedId: string | null;
  onSelect: (vehicleId: string) => void;
  onAdd: () => void;
}

export function VehicleList({ vehicles, selectedId, onSelect, onAdd }: IProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold text-foreground">خودروهای من</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
        >
          <AppIcon name="add_circle" className="size-[16px]" />
          خودرو جدید
        </button>
      </div>

      {vehicles.map((vehicle) => {
        const selected = vehicle.id === selectedId;
        return (
          <button
            key={vehicle.id}
            onClick={() => onSelect(vehicle.id)}
            aria-pressed={selected}
            className={`w-full text-right rounded-2xl bg-card p-4 shadow-xs border transition-all flex items-center gap-3 ${
              selected
                ? "border-primary ring-2 ring-primary/20"
                : "border-border/70 hover:border-border"
            }`}
          >
            <span
              className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                selected
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/5 text-primary"
              }`}
            >
              <AppIcon name="directions_car" className="size-[24px]" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="font-bold text-sm text-foreground block truncate">
                {vehicle.name}
              </span>
              <span className="text-xs text-muted-foreground block truncate">
                {vehicle.year ? `سال ساخت ${faNum(vehicle.year)}` : ""}
              </span>
            </span>
            <span className="text-left flex-shrink-0">
              <span className="text-xs font-extrabold text-foreground block">
                {faKm(vehicle.odometerKm)}
              </span>
              {selected ? (
                <span className="text-[10px] font-bold text-primary">
                  انتخاب شده
                </span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
