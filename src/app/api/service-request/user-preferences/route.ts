import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/database/db";
import { userPreferences } from "@/database/schema/users";
import { vehicleTrackers } from "@/database/schema/vehicles";
import { computeTrackerProgress } from "@/features/vehicles/utils/tracker-helpers";
import {
  fail,
  getAuthorizedUser,
  handleRouteError,
  ok,
  unauthorized,
} from "@/app/api/service-request/route-helpers";

const updatePreferencesSchema = z.object({
  odometerKm: z.coerce
    .number("کیلومتر باید عدد باشد")
    .int("کیلومتر باید عدد صحیح باشد")
    .min(0, "کیلومتر نمی‌تواند منفی باشد")
    .max(10_000_000, "کیلومتر معتبر نیست"),
});

export async function GET(request: Request) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const db = getDb();
    // ردیف ترجیحات برای کاربران قدیمی به‌صورت تنبل ساخته می‌شود
    const [row] = await db
      .insert(userPreferences)
      .values({ userId: user.userId, odometerKm: 0 })
      .onConflictDoNothing()
      .returning();
    const preferences =
      row ??
      (
        await db
          .select()
          .from(userPreferences)
          .where(eq(userPreferences.userId, user.userId))
          .limit(1)
      )[0];
    return ok({ odometerKm: preferences.odometerKm });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const body: unknown = await request.json();
    const parsed = updatePreferencesSchema.safeParse(body);
    if (!parsed.success) {
      return fail("مقدار کیلومتر معتبر نیست", 422);
    }
    const odometerKm = parsed.data.odometerKm;
    const db = getDb();

    await db
      .insert(userPreferences)
      .values({ userId: user.userId, odometerKm })
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: { odometerKm, updatedAt: new Date() },
      });

    // قاعده همگام‌سازی: کیلومتر جدید همه ردیاب‌های کاربر را بازمحاسبه می‌کند
    const trackers = await db
      .select()
      .from(vehicleTrackers)
      .where(eq(vehicleTrackers.userId, user.userId));
    for (const tracker of trackers) {
      const progress = computeTrackerProgress({
        currentKm: odometerKm,
        targetKm: tracker.targetKm,
        intervalKm: tracker.intervalKm,
      });
      await db
        .update(vehicleTrackers)
        .set({
          currentKm: odometerKm,
          category: progress.category,
          badgeText: progress.badgeText,
          badgeType: progress.badgeType,
          percentage: progress.percentage,
          updatedAt: new Date(),
        })
        .where(eq(vehicleTrackers.id, tracker.id));
    }

    return ok({ odometerKm });
  } catch (error) {
    return handleRouteError(error);
  }
}
