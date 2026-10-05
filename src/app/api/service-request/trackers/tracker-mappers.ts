import type { vehicleTrackers } from "@/database/schema/vehicles";
import type { VehicleTracker } from "@/lib/types";

type TrackerRow = typeof vehicleTrackers.$inferSelect;

export function mapTracker(row: TrackerRow): VehicleTracker {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    category: row.category as VehicleTracker["category"],
    badgeText: row.badgeText,
    badgeType: row.badgeType as VehicleTracker["badgeType"],
    icon: row.icon,
    currentKm: row.currentKm ?? undefined,
    targetKm: row.targetKm ?? undefined,
    intervalKm: row.intervalKm ?? undefined,
    percentage: row.percentage ?? undefined,
    timeElapsedMonths: row.timeElapsedMonths ?? undefined,
    timeTotalMonths: row.timeTotalMonths ?? undefined,
    targetDate: row.targetDate ?? undefined,
    scheduledAtKm: row.scheduledAtKm ?? undefined,
    extraDetail: row.extraDetail ?? undefined,
    autoPay: row.autoPay,
  };
}
