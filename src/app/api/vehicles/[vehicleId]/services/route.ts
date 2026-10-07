import { getOwnedVehicle } from "@/utils/server-helpers/vehicles-helpers";
import type { IVehicleRouteParams } from "@/types/server-types";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import { serviceLogs } from "@/database/schema/vehicles";
import { createServiceSchema } from "@/features/vehicles/validations/service-schema";
import {
  fail,
  getAuthorizedUser,
  handleRouteError,
  ok,
  unauthorized,

} from "@/utils/server-helpers/route-helpers";
import { mapVehicleService } from "@/utils/server-helpers/vehicle-services-helpers";



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
      .from(serviceLogs)
      .where(eq(serviceLogs.vehicleId, vehicleId))
      .orderBy(desc(serviceLogs.date));
    return ok(rows.map(mapVehicleService));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request, { params }: IVehicleRouteParams) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const { vehicleId } = await params;
    const ownedVehicle = await getOwnedVehicle(user.userId, vehicleId);
    if (!ownedVehicle) {
      return fail("خودرو پیدا نشد", 404);
    }
    const body: unknown = await request.json();
    const parsed = createServiceSchema.safeParse(body);
    if (!parsed.success) {
      return fail("اطلاعات سرویس معتبر نیست", 422);
    }
    const input = parsed.data;
    const [row] = await getDb()
      .insert(serviceLogs)
      .values({
        id: crypto.randomUUID(),
        userId: user.userId,
        vehicleId,
        categoryId: input.categoryId ?? null,
        title: input.title,
        date: input.serviceDate,
        provider: input.provider ?? "",
        odometerKm: input.odometerKm,
        cost: input.cost ?? 0,
        receiptVerified: false,
        notes: input.notes || null,
        category: "Service",
        nextDueDate: input.nextDueDate ?? null,
        nextDueKm: input.nextDueKm ?? null,
      })
      .returning();
    return ok(mapVehicleService(row), 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
