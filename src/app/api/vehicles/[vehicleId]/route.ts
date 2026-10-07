import type { IVehicleRouteParams } from "@/types/server-types";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import { vehicles } from "@/database/schema/garage";
import { updateVehicleSchema } from "@/features/vehicles/validations/vehicle-schema";
import {
  fail,
  getAuthorizedUser,
  handleRouteError,
  ok,
  unauthorized,
} from "@/utils/server-helpers/route-helpers";
import { mapVehicle } from "@/utils/server-helpers/vehicles-helpers";



export async function GET(request: Request, { params }: IVehicleRouteParams) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const { vehicleId } = await params;
    const rows = await getDb()
      .select()
      .from(vehicles)
      .where(and(eq(vehicles.id, vehicleId), eq(vehicles.userId, user.userId)))
      .limit(1);
    if (rows.length === 0) {
      return fail("خودرو پیدا نشد", 404);
    }
    return ok(mapVehicle(rows[0]));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request, { params }: IVehicleRouteParams) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const { vehicleId } = await params;
    const body: unknown = await request.json();
    const parsed = updateVehicleSchema.safeParse(body);
    if (!parsed.success) {
      return fail("اطلاعات خودرو معتبر نیست", 422);
    }
    const input = parsed.data;
    const [row] = await getDb()
      .update(vehicles)
      .set({ ...input, updatedAt: new Date() })
      .where(and(eq(vehicles.id, vehicleId), eq(vehicles.userId, user.userId)))
      .returning();
    if (!row) {
      return fail("خودرو پیدا نشد", 404);
    }
    return ok(mapVehicle(row));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: Request, { params }: IVehicleRouteParams) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const { vehicleId } = await params;
    const deleted = await getDb()
      .delete(vehicles)
      .where(and(eq(vehicles.id, vehicleId), eq(vehicles.userId, user.userId)))
      .returning({ id: vehicles.id });
    if (deleted.length === 0) {
      return fail("خودرو پیدا نشد", 404);
    }
    return ok({ deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
