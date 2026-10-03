import { desc, eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import { serviceLogs } from "@/database/schema/vehicles";
import { createServiceSchema } from "@/features/vehicles/validations/service-schema";
import { fail, handleRouteError, ok } from "@/app/api/service-request/route-helpers";
import { mapVehicleService } from "@/app/api/service-request/vehicles/vehicle-mappers";

interface IRouteParams {
  params: Promise<{ vehicleId: string }>;
}

export async function GET(_request: Request, { params }: IRouteParams) {
  try {
    const { vehicleId } = await params;
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

export async function POST(request: Request, { params }: IRouteParams) {
  try {
    const { vehicleId } = await params;
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
