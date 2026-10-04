import { eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import { checklistPacks } from "@/database/schema/tasks";
import { fail, handleRouteError, ok } from "@/app/api/service-request/route-helpers";

interface IRouteParams {
  params: Promise<{ checklistId: string }>;
}

export async function DELETE(_request: Request, { params }: IRouteParams) {
  try {
    const { checklistId } = await params;
    const db = getDb();
    const existing = await db
      .select({ id: checklistPacks.id })
      .from(checklistPacks)
      .where(eq(checklistPacks.id, checklistId))
      .limit(1);
    if (existing.length === 0) {
      return fail("چک‌لیست پیدا نشد", 404);
    }
    // اقلام با onDelete cascade همراه بسته حذف می‌شوند.
    await db.delete(checklistPacks).where(eq(checklistPacks.id, checklistId));
    return ok({ deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}