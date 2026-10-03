"use client";

import { faKm } from "@/lib/format";
import { formatFaDate } from "@/utils";
import type { VehicleService } from "../types";
import { AppIcon } from "@/components/ui/app-icon";

interface IProps {
  services: VehicleService[];
  onDelete: (serviceId: string) => void;
  deleting: boolean;
}

export function ServiceHistoryList({ services, onDelete, deleting }: IProps) {
  return (
    <div className="space-y-2.5">
      {services.map((service) => (
        <div
          key={service.id}
          className="bg-white p-4 rounded-2xl shadow-xs border border-[#e2e8f0]/80 space-y-2"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-[#3525cd] block">
                {formatFaDate(service.serviceDate)}
              </span>
              <h4 className="font-bold text-sm text-[#0b1c30]">
                {service.title}
              </h4>
              <p className="text-xs text-[#545f73]">
                {service.provider || "بدون ارائه‌دهنده"} •{" "}
                {faKm(service.odometerKm)}
              </p>
            </div>
            <div className="text-left flex-shrink-0">
              <span className="text-base font-extrabold text-[#0b1c30]">
                {service.cost.toLocaleString("fa-IR")}
              </span>
              <button
                onClick={() => onDelete(service.id)}
                disabled={deleting}
                aria-label={`حذف ${service.title}`}
                className="text-[11px] font-bold text-[#ba1a1a] hover:underline block mt-1 disabled:opacity-50"
              >
                حذف
              </button>
            </div>
          </div>

          {service.notes ? (
            <p className="text-xs text-[#464555] bg-[#eff4ff] p-2.5 rounded-xl border border-[#dce9ff]/60">
              {service.notes}
            </p>
          ) : null}

          {service.nextDueDate || service.nextDueKm ? (
            <p className="text-[11px] font-semibold text-[#3525cd] flex items-center gap-1">
              <AppIcon name="event_repeat" className="size-[14px]" />
              مراجعه بعدی:
              {service.nextDueDate
                ? ` ${formatFaDate(service.nextDueDate)}`
                : ""}
              {service.nextDueKm ? ` • ${faKm(service.nextDueKm)}` : ""}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
