import { desc, eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import { insurances } from "@/database/schema/garage";
import { createInsuranceSchema } from "@/features/vehicles/validations/insurance-schema";
import {
  fail,
  getAuthorizedUser,
  getOwnedVehicle,
  handleRouteError,
  ok,
  unauthorized,
} from "@/app/api/service-request/route-helpers";
import { mapInsurance } from "@/app/api/service-request/vehicles/vehicle-mappers";

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
      .from(insurances)
      .where(eq(insurances.vehicleId, vehicleId))
      .orderBy(desc(insurances.endDate));
    return ok(rows.map(mapInsurance));
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
    const parsed = createInsuranceSchema.safeParse(body);
    if (!parsed.success) {
      return fail("اطلاعات بیمه‌نامه معتبر نیست", 422);
    }
    const input = parsed.data;
    const [row] = await getDb()
      .insert(insurances)
      .values({
        id: crypto.randomUUID(),
        vehicleId,
        type: input.type,
        company: input.company,
        policyNumber: input.policyNumber || null,
        startDate: input.startDate,
        endDate: input.endDate,
        cost: input.cost ?? null,
        notes: input.notes || null,
      })
      .returning();
    return ok(mapInsurance(row), 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
