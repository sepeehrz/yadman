import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/database/db";
import { timelineEvents } from "@/database/schema/timeline";
import type { TimelineEvent } from "@/lib/types";
import {
  fail,
  getAuthorizedUser,
  handleRouteError,
  ok,
  unauthorized,
} from "@/app/api/service-request/route-helpers";

const createTimelineEventSchema = z.object({
  title: z.string().trim().min(2, "عنوان رویداد الزامی است").max(140),
  timeLabel: z.string().trim().min(1, "برچسب زمان الزامی است").max(60),
  dateBadge: z.string().trim().min(1, "برچسب تاریخ الزامی است").max(60),
  category: z.enum(["health", "auto", "finance", "travel"]),
  categoryLabel: z.string().trim().min(1).max(60),
  subtitle: z.string().trim().max(200).optional().default(""),
  icon: z.string().trim().max(60).optional().default("event"),
});

type TimelineRow = typeof timelineEvents.$inferSelect;

function mapTimelineEvent(row: TimelineRow): TimelineEvent {
  return {
    id: row.id,
    title: row.title,
    timeLabel: row.timeLabel,
    dateBadge: row.dateBadge,
    category: row.category as TimelineEvent["category"],
    categoryLabel: row.categoryLabel,
    subtitle: row.subtitle,
    icon: row.icon,
  };
}

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
