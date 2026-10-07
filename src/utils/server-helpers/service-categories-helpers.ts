import type { ServiceCategory } from "@/features/vehicles/types";
import type { ServiceCategoryRow } from "@/types/server-types";

export function mapServiceCategory(row: ServiceCategoryRow): ServiceCategory {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    icon: row.icon,
    defaultIntervalKm: row.defaultIntervalKm,
    defaultIntervalMonths: row.defaultIntervalMonths,
  };
}
