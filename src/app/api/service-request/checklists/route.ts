import { asc, desc, inArray } from "drizzle-orm";
import { getDb } from "@/database/db";
import {
  checklistItems,
  checklistPacks,
} from "@/database/schema/tasks";
import {
  createChecklistSchema,
} from "@/features/tasks/validations/checklist-schema";
import { fail, handleRouteError, ok } from "@/app/api/service-request/route-helpers";
import { mapChecklist } from "./checklists-mappers";

export async function GET() {
  try {
    const db = getDb();
    const packs = await db
      .select()
      .from(checklistPacks)
      .orderBy(desc(checklistPacks.createdAt));
    if (packs.length === 0) {
      return ok([]);
    }
    const items = await db
      .select()
      .from(checklistItems)
      .where(
        inArray(
          checklistItems.packId,
          packs.map((pack) => pack.id),
        ),
      )
      .orderBy(asc(checklistItems.createdAt));
    return ok(
      packs.map((pack) =>
        mapChecklist(
          pack,
          items.filter((item) => item.packId === pack.id),
        ),
      ),
    );
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = createChecklistSchema.safeParse(body);
    if (!parsed.success) {
      return fail("اطلاعات چک‌لیست معتبر نیست", 422);
    }
    const input = parsed.data;
    const db = getDb();
    const [pack] = await db
      .insert(checklistPacks)
      .values({
        id: crypto.randomUUID(),
        title: input.title,
        active: true,
      })
      .returning();

    // درایور Neon HTTP تراکنش تعاملی ندارد؛ درج اقلام بعد از ساخت بسته انجام می‌شود.
    const insertedItems =
      input.items.length > 0
        ? await db
            .insert(checklistItems)
            .values(
              input.items.map((text) => ({
                id: crypto.randomUUID(),
                packId: pack.id,
                text,
              })),
            )
            .returning()
        : [];

    return ok(mapChecklist(pack, insertedItems), 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
