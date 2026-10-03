import { and, eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import { insurances } from "@/database/schema/garage";
import { updateInsuranceSchema } from "@/features/vehicles/validations/insurance-schema";
import { fail, handleRouteError, ok } from "@/app/api/service-request/route-helpers";
import { mapInsurance } from "@/app/api/service-request/vehicles/vehicle-mappers";

interface IRouteParams {
  params: Promise<{ vehicleId: string; insuranceId: string }>;
}

export async function PATCH(request: Request, { params }: IRouteParams) {
  try {
    const { vehicleId, insuranceId } = await params;
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

export async function DELETE(_request: Request, { params }: IRouteParams) {
  try {
    const { vehicleId, insuranceId } = await params;
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
