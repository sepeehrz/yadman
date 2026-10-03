"use client";

import { useExpiringReminders } from "../hooks/use-expiring-reminders";
import {
  dueLabel,
  severityLabel,
  severityStyle,
} from "../utils/reminder-helpers";
import { AppIcon } from "@/components/ui/app-icon";

interface IProps {
  vehicleId?: string;
}

const KIND_ICON = {
  insurance: "security",
  toll: "receipt_long",
  service: "event_repeat",
} as const;

export function ExpiringAlerts({ vehicleId }: IProps) {
  const reminders = useExpiringReminders(30, vehicleId);

  if (
    reminders.isPending ||
    reminders.isError ||
    !reminders.data ||
    reminders.data.length === 0
  ) {
    return null;
  }

  return (
    <section className="space-y-2">
      {reminders.data.slice(0, 3).map((reminder) => {
        const style = severityStyle(reminder.severity);
        return (
          <div
            key={`${reminder.kind}-${reminder.refId}`}
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white shadow-xs border border-[#e2e8f0]/60"
          >
            <span
              className={`w-2 h-2 rounded-full flex-shrink-0 ${style.dot}`}
            />
            <AppIcon
              name={KIND_ICON[reminder.kind]}
              className="size-[18px] text-[#545f73]"
            />
            <span className="text-xs text-[#0b1c30] truncate flex-1">
              <span className="font-bold">{reminder.title}</span>
              <span className="text-[#545f73]"> • {reminder.vehicleName}</span>
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${style.badge}`}
            >
              {severityLabel(reminder.severity)} •{" "}
              {dueLabel(reminder.daysRemaining, reminder.dueDate)}
            </span>
          </div>
        );
      })}
    </section>
  );
}
