import { and, eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import { tolls } from "@/database/schema/garage";
import { updateTollSchema } from "@/features/vehicles/validations/toll-schema";
import {
  fail,
  getAuthorizedUser,
  getOwnedVehicle,
  handleRouteError,
  ok,
  unauthorized,
} from "@/app/api/service-request/route-helpers";
import { mapToll } from "@/app/api/service-request/vehicles/vehicle-mappers";

interface IRouteParams {
  params: Promise<{ vehicleId: string; tollId: string }>;
}

export async function PATCH(request: Request, { params }: IRouteParams) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const { vehicleId, tollId } = await params;
    if (!(await getOwnedVehicle(user.userId, vehicleId))) {
      return fail("رکورد عوارض پیدا نشد", 404);
    }
    const body: unknown = await request.json();
    const parsed = updateTollSchema.safeParse(body);
    if (!parsed.success) {
      return fail("اطلاعات عوارض معتبر نیست", 422);
    }
    const [row] = await getDb()
      .update(tolls)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(and(eq(tolls.id, tollId), eq(tolls.vehicleId, vehicleId)))
      .returning();
    if (!row) {
      return fail("رکورد عوارض پیدا نشد", 404);
    }
    return ok(mapToll(row));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: Request, { params }: IRouteParams) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const { vehicleId, tollId } = await params;
    if (!(await getOwnedVehicle(user.userId, vehicleId))) {
      return fail("رکورد عوارض پیدا نشد", 404);
    }
    const db = getDb();
    const existing = await db
      .select({ id: tolls.id })
      .from(tolls)
      .where(and(eq(tolls.id, tollId), eq(tolls.vehicleId, vehicleId)))
      .limit(1);
    if (existing.length === 0) {
      return fail("رکورد عوارض پیدا نشد", 404);
    }
    await db
      .delete(tolls)
      .where(and(eq(tolls.id, tollId), eq(tolls.vehicleId, vehicleId)));
    return ok({ deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
