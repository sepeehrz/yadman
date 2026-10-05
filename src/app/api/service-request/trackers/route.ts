import { desc, eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import { vehicleTrackers } from "@/database/schema/vehicles";
import { createTrackerSchema } from "@/features/vehicles/validations/tracker-schema";
import { computeTrackerProgress, trackerIconForService } from "@/features/vehicles/utils/tracker-helpers";
import {
  fail,
  getAuthorizedUser,
  handleRouteError,
  ok,
  unauthorized,
} from "@/app/api/service-request/route-helpers";
import { mapTracker } from "./tracker-mappers";

export async function GET(request: Request) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const rows = await getDb()
      .select()
      .from(vehicleTrackers)
      .where(eq(vehicleTrackers.userId, user.userId))
      .orderBy(desc(vehicleTrackers.createdAt));
    return ok(rows.map(mapTracker));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const body: unknown = await request.json();
    const parsed = createTrackerSchema.safeParse(body);
    if (!parsed.success) {
      return fail("اطلاعات ردیاب معتبر نیست", 422);
    }
    const input = parsed.data;
    const progress = computeTrackerProgress(input);
    const [row] = await getDb()
      .insert(vehicleTrackers)
      .values({
        id: crypto.randomUUID(),
        userId: user.userId,
        title: input.title,
        subtitle: input.subtitle || "",
        category: progress.category,
        badgeText: progress.badgeText,
        badgeType: progress.badgeType,
        icon: input.icon || trackerIconForService(input.title),
        currentKm: input.currentKm ?? null,
        targetKm: input.targetKm ?? null,
        intervalKm: input.intervalKm ?? null,
        percentage: progress.percentage,
        timeTotalMonths: input.intervalMonths ?? null,
        targetDate: input.targetDate ? input.targetDate : null,
        extraDetail: input.extraDetail || null,
        autoPay: input.autoPay ?? false,
      })
      .returning();
    return ok(mapTracker(row), 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
