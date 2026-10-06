import type {
  Insurance,
  ServiceCategory,
  Toll,
  Vehicle,
  VehicleService,
} from "@/features/vehicles/types";
import type { insurances, serviceCategories, tolls, vehicles } from "@/database/schema/garage";
import type { serviceLogs } from "@/database/schema/vehicles";

type VehicleRow = typeof vehicles.$inferSelect;
type ServiceRow = typeof serviceLogs.$inferSelect;
type CategoryRow = typeof serviceCategories.$inferSelect;
type InsuranceRow = typeof insurances.$inferSelect;
type TollRow = typeof tolls.$inferSelect;

function iso(value: Date): string {
  return value.toISOString();
}

export function mapVehicle(row: VehicleRow): Vehicle {
  return {
    id: row.id,
    name: row.name,
    year: row.year,
    odometerKm: row.odometerKm,
    imageUrl: row.imageUrl,
    createdAt: iso(row.createdAt),
    updatedAt: iso(row.updatedAt),
  };
}

export function mapServiceCategory(row: CategoryRow): ServiceCategory {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    icon: row.icon,
    defaultIntervalKm: row.defaultIntervalKm,
    defaultIntervalMonths: row.defaultIntervalMonths,
  };
}

export function mapVehicleService(row: ServiceRow): VehicleService {
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
    createdAt: iso(row.createdAt),
  };
}

export function mapInsurance(row: InsuranceRow): Insurance {
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
    createdAt: iso(row.createdAt),
  };
}

export function mapToll(row: TollRow): Toll {
  return {
    id: row.id,
    vehicleId: row.vehicleId,
    year: row.year,
    amount: row.amount,
    paid: row.paid,
    paidAt: row.paidAt,
    dueDate: row.dueDate,
    notes: row.notes,
    createdAt: iso(row.createdAt),
  };
}
