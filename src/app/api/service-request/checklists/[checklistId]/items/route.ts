import { and, eq } from "drizzle-orm";
import { getDb } from "@/database/db";
import {
  checklistItems,
  checklistPacks,
} from "@/database/schema/tasks";
import {
  createChecklistItemSchema,
} from "@/features/tasks/validations/checklist-schema";
import {
  fail,
  getAuthorizedUser,
  handleRouteError,
  ok,
  unauthorized,
} from "@/app/api/service-request/route-helpers";
import { mapChecklistItem } from "../../checklists-mappers";

interface IRouteParams {
  params: Promise<{ checklistId: string }>;
}

export async function POST(request: Request, { params }: IRouteParams) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const { checklistId } = await params;
    const body: unknown = await request.json();
    const parsed = createChecklistItemSchema.safeParse(body);
    if (!parsed.success) {
      return fail("متن قلم معتبر نیست", 422);
    }
    const db = getDb();
    const pack = await db
      .select({ id: checklistPacks.id })
      .from(checklistPacks)
      .where(
        and(
          eq(checklistPacks.id, checklistId),
          eq(checklistPacks.userId, user.userId),
        ),
      )
      .limit(1);
    if (pack.length === 0) {
      return fail("چک‌لیست پیدا نشد", 404);
    }
    const [row] = await db
      .insert(checklistItems)
      .values({
        id: crypto.randomUUID(),
        packId: checklistId,
        text: parsed.data.text,
      })
      .returning();
    return ok(mapChecklistItem(row), 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
