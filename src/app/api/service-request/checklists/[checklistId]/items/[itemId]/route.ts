import { and, eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import {
  checklistItems,
  checklistPacks,
} from "@/database/schema/tasks";
import {
  updateChecklistItemSchema,
} from "@/features/tasks/validations/checklist-schema";
import {
  fail,
  getAuthorizedUser,
  handleRouteError,
  ok,
  unauthorized,
} from "@/app/api/service-request/route-helpers";
import { mapChecklistItem } from "../../../checklists-mappers";

/** بررسی مالکیت بسته توسط کاربر جاری — شرط لازم برای هر عملیاتی روی اقلام */
async function packBelongsToUser(
  userId: string,
  checklistId: string,
): Promise<boolean> {
  const rows = await getDb()
    .select({ id: checklistPacks.id })
    .from(checklistPacks)
    .where(
      and(
        eq(checklistPacks.id, checklistId),
        eq(checklistPacks.userId, userId),
      ),
    )
    .limit(1);
  return rows.length > 0;
}

interface IRouteParams {
  params: Promise<{ checklistId: string; itemId: string }>;
}

export async function PATCH(request: Request, { params }: IRouteParams) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const { checklistId, itemId } = await params;
    if (!(await packBelongsToUser(user.userId, checklistId))) {
      return fail("قلم چک‌لیست پیدا نشد", 404);
    }
    const body: unknown = await request.json();
    const parsed = updateChecklistItemSchema.safeParse(body);
    if (!parsed.success) {
      return fail("وضعیت قلم معتبر نیست", 422);
    }
    const [row] = await getDb()
      .update(checklistItems)
      .set({ completed: parsed.data.completed, updatedAt: new Date() })
      .where(
        and(
          eq(checklistItems.id, itemId),
          eq(checklistItems.packId, checklistId),
        ),
      )
      .returning();
    if (!row) {
      return fail("قلم چک‌لیست پیدا نشد", 404);
    }
    return ok(mapChecklistItem(row));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: Request, { params }: IRouteParams) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const { checklistId, itemId } = await params;
    if (!(await packBelongsToUser(user.userId, checklistId))) {
      return fail("قلم چک‌لیست پیدا نشد", 404);
    }
    const deleted = await getDb()
      .delete(checklistItems)
      .where(
        and(
          eq(checklistItems.id, itemId),
          eq(checklistItems.packId, checklistId),
        ),
      )
      .returning({ id: checklistItems.id });
    if (deleted.length === 0) {
      return fail("قلم چک‌لیست پیدا نشد", 404);
    }
    return ok({ deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
