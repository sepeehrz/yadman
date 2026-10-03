import { asc } from "drizzle-orm";
import { getDb } from "@/database/db";
import { taskReminders } from "@/database/schema/tasks";
import {
  createReminderSchema,
} from "@/features/tasks/validations/reminder-schema";
import { fail, handleRouteError, ok } from "@/app/api/service-request/route-helpers";
import { mapReminder } from "./reminders-mappers";

export async function GET() {
  try {
    const rows = await getDb()
      .select()
      .from(taskReminders)
      .orderBy(asc(taskReminders.dueAt));
    return ok(rows.map(mapReminder));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
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
