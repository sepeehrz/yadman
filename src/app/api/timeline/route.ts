import { createTimelineEventSchema } from "@/features/dashboard/validations/timeline-schema";
import { mapTimelineEvent } from "@/utils/server-helpers/timeline-helpers";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import { timelineEvents } from "@/database/schema/timeline";
import {
  fail,
  getAuthorizedUser,
  handleRouteError,
  ok,
  unauthorized,
} from "@/utils/server-helpers/route-helpers";

export async function GET(request: Request) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const rows = await getDb()
      .select()
      .from(timelineEvents)
      .where(eq(timelineEvents.userId, user.userId))
      .orderBy(desc(timelineEvents.createdAt));
    return ok(rows.map(mapTimelineEvent));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const body: unknown = await request.json();
    const parsed = createTimelineEventSchema.safeParse(body);
    if (!parsed.success) {
      return fail("اطلاعات رویداد معتبر نیست", 422);
    }
    const input = parsed.data;
    const [row] = await getDb()
      .insert(timelineEvents)
      .values({
        id: crypto.randomUUID(),
        userId: user.userId,
        title: input.title,
        timeLabel: input.timeLabel,
        dateBadge: input.dateBadge,
        category: input.category,
        categoryLabel: input.categoryLabel,
        subtitle: input.subtitle,
        icon: input.icon,
      })
      .returning();
    return ok(mapTimelineEvent(row), 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
