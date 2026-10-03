"use client";

import { faKm } from "@/lib/format";
import type { Vehicle } from "../types";

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
        <h2 className="text-sm font-bold text-[#0b1c30]">خودروهای من</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-1 text-xs font-bold text-[#3525cd] hover:underline"
        >
          <span className="material-symbols-outlined text-[16px]">
            add_circle
          </span>
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
            className={`w-full text-right rounded-2xl bg-white p-4 shadow-xs border transition-all flex items-center gap-3 ${
              selected
                ? "border-[#4f46e5] ring-2 ring-[#4f46e5]/20"
                : "border-[#e2e8f0]/70 hover:border-[#c7c4d8]"
            }`}
          >
            <span
              className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                selected
                  ? "bg-[#4f46e5] text-white"
                  : "bg-[#eff4ff] text-[#3525cd]"
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">
                directions_car
              </span>
            </span>
            <span className="flex-1 min-w-0">
              <span className="font-bold text-sm text-[#0b1c30] block truncate">
                {vehicle.name}
              </span>
              <span className="text-xs text-[#545f73] block truncate">
                {vehicle.model} • <span dir="ltr">{vehicle.plateNumber}</span>
              </span>
            </span>
            <span className="text-left flex-shrink-0">
              <span className="text-xs font-extrabold text-[#0b1c30] block">
                {faKm(vehicle.odometerKm)}
              </span>
              {selected ? (
                <span className="text-[10px] font-bold text-[#3525cd]">
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
