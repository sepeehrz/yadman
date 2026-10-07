import { getOwnedVehicle } from "@/utils/server-helpers/vehicles-helpers";
import type { IVehicleRouteParams } from "@/types/server-types";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import { tolls } from "@/database/schema/garage";
import { createTollSchema } from "@/features/vehicles/validations/toll-schema";
import {
  fail,
  getAuthorizedUser,
  handleRouteError,
  ok,
  unauthorized,

} from "@/utils/server-helpers/route-helpers";
import { mapToll } from "@/utils/server-helpers/vehicle-tolls-helpers";



export async function GET(request: Request, { params }: IVehicleRouteParams) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const { vehicleId } = await params;
    if (!(await getOwnedVehicle(user.userId, vehicleId))) {
      return fail("خودرو پیدا نشد", 404);
    }
    const rows = await getDb()
      .select()
      .from(tolls)
      .where(eq(tolls.vehicleId, vehicleId))
      .orderBy(desc(tolls.year));
    return ok(rows.map(mapToll));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request, { params }: IVehicleRouteParams) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const { vehicleId } = await params;
    if (!(await getOwnedVehicle(user.userId, vehicleId))) {
      return fail("خودرو پیدا نشد", 404);
    }
    const body: unknown = await request.json();
    const parsed = createTollSchema.safeParse(body);
    if (!parsed.success) {
      return fail("اطلاعات عوارض معتبر نیست", 422);
    }
    const input = parsed.data;
    const [row] = await getDb()
      .insert(tolls)
      .values({
        id: crypto.randomUUID(),
        vehicleId,
        year: input.year,
        amount: input.amount,
        paid: false,
        dueDate: input.dueDate ?? null,
        notes: input.notes || null,
      })
      .returning();
    return ok(mapToll(row), 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
