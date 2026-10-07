import type { VehicleService } from "@/features/vehicles/types";
import type { VehicleServiceRow } from "@/types/server-types";
import { toIsoString } from "@/utils/server-helpers/route-helpers";

export function mapVehicleService(row: VehicleServiceRow): VehicleService {
  return {
    id: row.id,
    vehicleId: row.vehicleId,
    categoryId: row.categoryId,
    title: row.title,
    serviceDate: row.date,
    provider: row.provider,
    odometerKm: row.odometerKm,
    cost: row.cost,
    receiptVerified: row.receiptVerified,
    notes: row.notes,
    category: row.category,
    nextDueDate: row.nextDueDate,
    nextDueKm: row.nextDueKm,
    createdAt: toIsoString(row.createdAt),
  };
}
