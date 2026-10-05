import { and, eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import { checklistPacks } from "@/database/schema/tasks";
import {
  fail,
  getAuthorizedUser,
  handleRouteError,
  ok,
  unauthorized,
} from "@/app/api/service-request/route-helpers";

interface IRouteParams {
  params: Promise<{ checklistId: string }>;
}

export async function DELETE(request: Request, { params }: IRouteParams) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const { checklistId } = await params;
    const deleted = await getDb()
      .delete(checklistPacks)
      .where(
        and(
          eq(checklistPacks.id, checklistId),
          eq(checklistPacks.userId, user.userId),
        ),
      )
      .returning({ id: checklistPacks.id });
    if (deleted.length === 0) {
      return fail("چک‌لیست پیدا نشد", 404);
    }
    // اقلام با onDelete cascade همراه بسته حذف می‌شوند.
    return ok({ deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}