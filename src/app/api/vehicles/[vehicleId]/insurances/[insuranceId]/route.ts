import { getOwnedVehicle } from "@/utils/server-helpers/vehicles-helpers";
import type { IVehicleInsuranceRouteParams } from "@/types/server-types";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import { insurances } from "@/database/schema/garage";
import { updateInsuranceSchema } from "@/features/vehicles/validations/insurance-schema";
import {
  fail,
  getAuthorizedUser,
  handleRouteError,
  ok,
  unauthorized,

} from "@/utils/server-helpers/route-helpers";
import { mapInsurance } from "@/utils/server-helpers/vehicle-insurances-helpers";



export async function PATCH(request: Request, { params }: IVehicleInsuranceRouteParams) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const { vehicleId, insuranceId } = await params;
    if (!(await getOwnedVehicle(user.userId, vehicleId))) {
      return fail("بیمه‌نامه پیدا نشد", 404);
    }
    const body: unknown = await request.json();
    const parsed = updateInsuranceSchema.safeParse(body);
    if (!parsed.success) {
      return fail("اطلاعات بیمه‌نامه معتبر نیست", 422);
    }
    const [row] = await getDb()
      .update(insurances)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(and(eq(insurances.id, insuranceId), eq(insurances.vehicleId, vehicleId)))
      .returning();
    if (!row) {
      return fail("بیمه‌نامه پیدا نشد", 404);
    }
    return ok(mapInsurance(row));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: Request, { params }: IVehicleInsuranceRouteParams) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const { vehicleId, insuranceId } = await params;
    if (!(await getOwnedVehicle(user.userId, vehicleId))) {
      return fail("بیمه‌نامه پیدا نشد", 404);
    }
    const db = getDb();
    const existing = await db
      .select({ id: insurances.id })
      .from(insurances)
      .where(and(eq(insurances.id, insuranceId), eq(insurances.vehicleId, vehicleId)))
      .limit(1);
    if (existing.length === 0) {
      return fail("بیمه‌نامه پیدا نشد", 404);
    }
    await db
      .delete(insurances)
      .where(and(eq(insurances.id, insuranceId), eq(insurances.vehicleId, vehicleId)));
    return ok({ deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
