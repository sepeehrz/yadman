import { and, eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import {
  checklistItems,
  checklistPacks,
} from "@/database/schema/tasks";
import {
  updateChecklistItemSchema,
} from "@/features/tasks/validations/checklist-schema";
import { fail, handleRouteError, ok } from "@/app/api/service-request/route-helpers";
import { mapChecklistItem } from "../../../checklists-mappers";

interface IRouteParams {
  params: Promise<{ checklistId: string; itemId: string }>;
}

export async function PATCH(request: Request, { params }: IRouteParams) {
  try {
    const { checklistId, itemId } = await params;
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
