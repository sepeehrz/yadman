import { and, eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import { vehicleTrackers } from "@/database/schema/vehicles";
import { updateTrackerSchema } from "@/features/vehicles/validations/tracker-schema";
import { computeTrackerProgress } from "@/features/vehicles/utils/tracker-helpers";
import {
  fail,
  getAuthorizedUser,
  handleRouteError,
  ok,
  unauthorized,
} from "@/app/api/service-request/route-helpers";
import { mapTracker } from "../tracker-mappers";

interface IRouteParams {
  params: Promise<{ trackerId: string }>;
}

export async function PATCH(request: Request, { params }: IRouteParams) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const { trackerId } = await params;
    const body: unknown = await request.json();
    const parsed = updateTrackerSchema.safeParse(body);
    if (!parsed.success) {
      return fail("اطلاعات ردیاب معتبر نیست", 422);
    }
    const input = parsed.data;
    const db = getDb();

    const [current] = await db
      .select()
      .from(vehicleTrackers)
      .where(
        and(
          eq(vehicleTrackers.id, trackerId),
          eq(vehicleTrackers.userId, user.userId),
        ),
      )
      .limit(1);
    if (!current) {
      return fail("ردیاب پیدا نشد", 404);
    }

    const currentKm = input.currentKm ?? current.currentKm;
    const targetKm = input.targetKm ?? current.targetKm;
    const intervalKm = input.intervalKm ?? current.intervalKm;
    const progress = computeTrackerProgress({
      currentKm,
      targetKm,
      intervalKm,
    });

    const [row] = await db
      .update(vehicleTrackers)
      .set({
        title: input.title ?? current.title,
        subtitle: input.subtitle ?? current.subtitle,
        icon: input.icon ?? current.icon,
        currentKm: currentKm ?? null,
        targetKm: targetKm ?? null,
        intervalKm: intervalKm ?? null,
        category: progress.category,
        badgeText: progress.badgeText,
        badgeType: progress.badgeType,
        percentage: progress.percentage,
        targetDate: input.targetDate ?? current.targetDate,
        extraDetail: input.extraDetail ?? current.extraDetail,
        autoPay: input.autoPay ?? current.autoPay,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(vehicleTrackers.id, trackerId),
          eq(vehicleTrackers.userId, user.userId),
        ),
      )
      .returning();
    if (!row) {
      return fail("ردیاب پیدا نشد", 404);
    }
    return ok(mapTracker(row));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: Request, { params }: IRouteParams) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const { trackerId } = await params;
    const deleted = await getDb()
      .delete(vehicleTrackers)
      .where(
        and(
          eq(vehicleTrackers.id, trackerId),
          eq(vehicleTrackers.userId, user.userId),
        ),
      )
      .returning({ id: vehicleTrackers.id });
    if (deleted.length === 0) {
      return fail("ردیاب پیدا نشد", 404);
    }
    return ok({ deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
