import { desc, eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import { tolls } from "@/database/schema/garage";
import { createTollSchema } from "@/features/vehicles/validations/toll-schema";
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
  params: Promise<{ vehicleId: string }>;
}

export async function GET(request: Request, { params }: IRouteParams) {
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

export async function POST(request: Request, { params }: IRouteParams) {
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
