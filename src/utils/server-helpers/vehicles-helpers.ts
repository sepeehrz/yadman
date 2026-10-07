import { and, eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import { vehicles } from "@/database/schema/garage";
import type { Vehicle } from "@/features/vehicles/types";
import { toIsoString } from "@/utils/server-helpers/route-helpers";
import type { VehicleRow } from "@/types/server-types";

export function mapVehicle(row: VehicleRow): Vehicle {
  return {
    id: row.id,
    name: row.name,
    year: row.year,
    odometerKm: row.odometerKm,
    imageUrl: row.imageUrl,
    createdAt: toIsoString(row.createdAt),
    updatedAt: toIsoString(row.updatedAt),
  };
}

/**
 * خودروی متعلق به کاربر جاری را برمی‌گرداند؛ مالکیت خودرو شرط دسترسی به
 * تمام منابع فرعی (بیمه، عوارض، سرویس) است.
 */
export async function getOwnedVehicle(userId: string, vehicleId: string) {
  const [row] = await getDb()
    .select()
    .from(vehicles)
    .where(and(eq(vehicles.id, vehicleId), eq(vehicles.userId, userId)))
    .limit(1);
  return row ?? null;
}
