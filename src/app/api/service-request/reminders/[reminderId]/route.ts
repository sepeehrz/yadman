import { eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import { taskReminders } from "@/database/schema/tasks";
import {
  updateReminderSchema,
} from "@/features/tasks/validations/reminder-schema";
import { fail, handleRouteError, ok } from "@/app/api/service-request/route-helpers";
import { mapReminder } from "../reminders-mappers";

interface IRouteParams {
  params: Promise<{ reminderId: string }>;
}

export async function PATCH(request: Request, { params }: IRouteParams) {
  try {
    const { reminderId } = await params;
    const body: unknown = await request.json();
    const parsed = updateReminderSchema.safeParse(body);
    if (!parsed.success) {
      return fail("اطلاعات یادآور معتبر نیست", 422);
    }
    const input = parsed.data;

    // ترتیب قواعد: تیک انجام‌شدن یادآوری‌های بعدی را متوقف و Snooze را پاک می‌کند؛
    // جابه‌جایی موعد اصلی Snooze فعلی را باطل می‌کند؛ در غیر این صورت Snooze اعمال می‌شود.
    const set: Partial<typeof taskReminders.$inferInsert> = {
      updatedAt: new Date(),
    };
    if (input.title !== undefined) {
      set.title = input.title;
    }
    if (input.description !== undefined) {
      set.description = input.description || null;
    }
    if (input.priority !== undefined) {
      set.priority = input.priority;
    }
    if (input.recurrence !== undefined) {
      set.recurrence = input.recurrence;
    }
    if (input.dueAt !== undefined) {
      set.dueAt = new Date(input.dueAt);
      set.snoozedUntil = null;
    }
    if (input.done !== undefined) {
      set.done = input.done;
      set.completedAt = input.done ? new Date() : null;
      if (input.done) {
        set.snoozedUntil = null;
      }
    }
    if (
      input.snoozeMinutes !== undefined &&
      input.done !== true &&
      input.dueAt === undefined
    ) {
      set.snoozedUntil = new Date(Date.now() + input.snoozeMinutes * 60_000);
    }

    const [row] = await getDb()
      .update(taskReminders)
      .set(set)
      .where(eq(taskReminders.id, reminderId))
      .returning();
    if (!row) {
      return fail("یادآور پیدا نشد", 404);
    }
    return ok(mapReminder(row));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, { params }: IRouteParams) {
  try {
    const { reminderId } = await params;
    const db = getDb();
    const existing = await db
      .select({ id: taskReminders.id })
      .from(taskReminders)
      .where(eq(taskReminders.id, reminderId))
      .limit(1);
    if (existing.length === 0) {
      return fail("یادآور پیدا نشد", 404);
    }
    await db.delete(taskReminders).where(eq(taskReminders.id, reminderId));
    return ok({ deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
