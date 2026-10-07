import { getOwnedVehicle } from "@/utils/server-helpers/vehicles-helpers";
import type { IVehicleServiceRouteParams } from "@/types/server-types";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import { serviceLogs } from "@/database/schema/vehicles";
import { updateServiceSchema } from "@/features/vehicles/validations/service-schema";
import {
  fail,
  getAuthorizedUser,
  handleRouteError,
  ok,
  unauthorized,

} from "@/utils/server-helpers/route-helpers";
import { mapVehicleService } from "@/utils/server-helpers/vehicle-services-helpers";



export async function PATCH(request: Request, { params }: IVehicleServiceRouteParams) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const { vehicleId, serviceId } = await params;
    if (!(await getOwnedVehicle(user.userId, vehicleId))) {
      return fail("رکورد سرویس پیدا نشد", 404);
    }
    const body: unknown = await request.json();
    const parsed = updateServiceSchema.safeParse(body);
    if (!parsed.success) {
      return fail("اطلاعات سرویس معتبر نیست", 422);
    }
    const input = parsed.data;
    const [row] = await getDb()
      .update(serviceLogs)
      .set({ ...input, updatedAt: new Date() })
      .where(and(eq(serviceLogs.id, serviceId), eq(serviceLogs.vehicleId, vehicleId)))
      .returning();
    if (!row) {
      return fail("رکورد سرویس پیدا نشد", 404);
    }
    return ok(mapVehicleService(row));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: Request, { params }: IVehicleServiceRouteParams) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const { vehicleId, serviceId } = await params;
    if (!(await getOwnedVehicle(user.userId, vehicleId))) {
      return fail("رکورد سرویس پیدا نشد", 404);
    }
    const db = getDb();
    const existing = await db
      .select({ id: serviceLogs.id })
      .from(serviceLogs)
      .where(and(eq(serviceLogs.id, serviceId), eq(serviceLogs.vehicleId, vehicleId)))
      .limit(1);
    if (existing.length === 0) {
      return fail("رکورد سرویس پیدا نشد", 404);
    }
    await db
      .delete(serviceLogs)
      .where(and(eq(serviceLogs.id, serviceId), eq(serviceLogs.vehicleId, vehicleId)));
    return ok({ deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
