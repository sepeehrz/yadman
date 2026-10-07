import type { Toll } from "@/features/vehicles/types";
import type { VehicleTollRow } from "@/types/server-types";

export function mapToll(row: VehicleTollRow): Toll {
  return {
    id: row.id,
    vehicleId: row.vehicleId,
    year: row.year,
    amount: row.amount,
    paid: row.paid,
    paidAt: row.paidAt,
    dueDate: row.dueDate,
    notes: row.notes,
    createdAt: row.createdAt.toISOString(),
  };
}
