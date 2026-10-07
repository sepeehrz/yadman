import type {
  insurances,
  serviceCategories,
  tolls,
  vehicles,
} from "@/database/schema/garage";
import type { serviceLogs } from "@/database/schema/vehicles";

/** پارامترهای مسیر /api/vehicles/[vehicleId] */
export interface IVehicleRouteParams {
  params: Promise<{ vehicleId: string }>;
}

/** پارامترهای مسیر /api/vehicles/[vehicleId]/insurances(/[insuranceId]) */
export interface IVehicleInsuranceRouteParams {
  params: Promise<{ vehicleId: string; insuranceId: string }>;
}

/** پارامترهای مسیر /api/vehicles/[vehicleId]/services(/[serviceId]) */
export interface IVehicleServiceRouteParams {
  params: Promise<{ vehicleId: string; serviceId: string }>;
}

/** پارامترهای مسیر /api/vehicles/[vehicleId]/tolls(/[tollId]) */
export interface IVehicleTollRouteParams {
  params: Promise<{ vehicleId: string; tollId: string }>;
}

export type VehicleRow = typeof vehicles.$inferSelect;
export type VehicleServiceRow = typeof serviceLogs.$inferSelect;
export type ServiceCategoryRow = typeof serviceCategories.$inferSelect;
export type VehicleInsuranceRow = typeof insurances.$inferSelect;
export type VehicleTollRow = typeof tolls.$inferSelect;
