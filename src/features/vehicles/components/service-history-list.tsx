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
          className="bg-card p-4 rounded-2xl shadow-xs border border-border/80 space-y-2"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-primary block">
                {formatFaDate(service.serviceDate)}
              </span>
              <h4 className="font-bold text-sm text-foreground">
                {service.title}
              </h4>
              <p className="text-xs text-muted-foreground">
                {service.provider || "بدون ارائه‌دهنده"} •{" "}
                {faKm(service.odometerKm)}
              </p>
            </div>
            <div className="text-left flex-shrink-0">
              <span className="text-base font-extrabold text-foreground">
                {service.cost.toLocaleString("fa-IR")}
              </span>
              <button
                onClick={() => onDelete(service.id)}
                disabled={deleting}
                aria-label={`حذف ${service.title}`}
                className="text-[11px] font-bold text-destructive hover:underline block mt-1 disabled:opacity-50"
              >
                حذف
              </button>
            </div>
          </div>

          {service.notes ? (
            <p className="text-xs text-muted-foreground bg-primary/5 p-2.5 rounded-xl border border-primary/60">
              {service.notes}
            </p>
          ) : null}

          {service.nextDueDate || service.nextDueKm ? (
            <p className="text-[11px] font-semibold text-primary flex items-center gap-1">
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
