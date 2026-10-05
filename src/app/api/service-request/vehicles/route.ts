import { desc, eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import { vehicles } from "@/database/schema/garage";
import { createVehicleSchema } from "@/features/vehicles/validations/vehicle-schema";
import {
  fail,
  getAuthorizedUser,
  handleRouteError,
  ok,
  unauthorized,
} from "@/app/api/service-request/route-helpers";
import { mapVehicle } from "@/app/api/service-request/vehicles/vehicle-mappers";

export async function GET(request: Request) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const rows = await getDb()
      .select()
      .from(vehicles)
      .where(eq(vehicles.userId, user.userId))
      .orderBy(desc(vehicles.createdAt));
    return ok(rows.map(mapVehicle));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const body: unknown = await request.json();
    const parsed = createVehicleSchema.safeParse(body);
    if (!parsed.success) {
      return fail("اطلاعات خودرو معتبر نیست", 422);
    }
    const input = parsed.data;
    const [row] = await getDb()
      .insert(vehicles)
      .values({
        id: crypto.randomUUID(),
        userId: user.userId,
        name: input.name,
        brand: input.brand ?? "",
        model: input.model,
        year: input.year ?? null,
        color: input.color,
        plateNumber: input.plateNumber,
        vin: input.vin || null,
        fuelType: input.fuelType ?? "benzin",
        odometerKm: input.odometerKm ?? 0,
        imageUrl: input.imageUrl || null,
      })
      .returning();
    return ok(mapVehicle(row), 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
