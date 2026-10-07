import type { Insurance } from "@/features/vehicles/types";
import type { VehicleInsuranceRow } from "@/types/server-types";

export function mapInsurance(row: VehicleInsuranceRow): Insurance {
  return {
    id: row.id,
    vehicleId: row.vehicleId,
    type: row.type === "body" ? "body" : "third-party",
    company: row.company,
    policyNumber: row.policyNumber,
    startDate: row.startDate,
    endDate: row.endDate,
    cost: row.cost,
    notes: row.notes,
    createdAt: row.createdAt.toISOString(),
  };
}
