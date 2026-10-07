import { and, asc, eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import { taskReminders } from "@/database/schema/tasks";
import {
  createReminderSchema,
} from "@/features/tasks/validations/reminder-schema";
import {
  fail,
  getAuthorizedUser,
  handleRouteError,
  ok,
  unauthorized,
} from "@/utils/server-helpers/route-helpers";
import { mapReminder } from "@/utils/server-helpers/reminders-helpers";

export async function GET(request: Request) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const rows = await getDb()
      .select()
      .from(taskReminders)
      .where(eq(taskReminders.userId, user.userId))
      .orderBy(asc(taskReminders.dueAt));
    return ok(rows.map(mapReminder));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const body: unknown = await request.json();
    const parsed = createReminderSchema.safeParse(body);
    if (!parsed.success) {
      return fail("اطلاعات یادآور معتبر نیست", 422);
    }
    const input = parsed.data;
    const [row] = await getDb()
      .insert(taskReminders)
      .values({
        id: crypto.randomUUID(),
        userId: user.userId,
        title: input.title,
        description: input.description || null,
        dueAt: new Date(input.dueAt),
        priority: input.priority,
        recurrence: input.recurrence,
      })
      .returning();
    return ok(mapReminder(row), 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
