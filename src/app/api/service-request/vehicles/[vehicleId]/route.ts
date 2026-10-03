import { and, eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import { vehicles } from "@/database/schema/garage";
import { updateVehicleSchema } from "@/features/vehicles/validations/vehicle-schema";
import { fail, handleRouteError, ok } from "@/app/api/service-request/route-helpers";
import { mapVehicle } from "@/app/api/service-request/vehicles/vehicle-mappers";

interface IRouteParams {
  params: Promise<{ vehicleId: string }>;
}

export async function GET(_request: Request, { params }: IRouteParams) {
  try {
    const { vehicleId } = await params;
    const rows = await getDb().select().from(vehicles).where(eq(vehicles.id, vehicleId)).limit(1);
    if (rows.length === 0) {
      return fail("خودرو پیدا نشد", 404);
    }
    return ok(mapVehicle(rows[0]));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request, { params }: IRouteParams) {
  try {
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
      .where(eq(vehicles.id, vehicleId))
      .returning();
    if (!row) {
      return fail("خودرو پیدا نشد", 404);
    }
    return ok(mapVehicle(row));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, { params }: IRouteParams) {
  try {
    const { vehicleId } = await params;
    const db = getDb();
    const existing = await db
      .select({ id: vehicles.id })
      .from(vehicles)
      .where(eq(vehicles.id, vehicleId))
      .limit(1);
    if (existing.length === 0) {
      return fail("خودرو پیدا نشد", 404);
    }
    await db.delete(vehicles).where(and(eq(vehicles.id, vehicleId)));
    return ok({ deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
