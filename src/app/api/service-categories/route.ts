import { asc } from "drizzle-orm";
import { getDb } from "@/database/db";
import { serviceCategories } from "@/database/schema/garage";
import {
  getAuthorizedUser,
  handleRouteError,
  ok,
  unauthorized,
} from "@/utils/server-helpers/route-helpers";
import { mapServiceCategory } from "@/utils/server-helpers/service-categories-helpers";

export async function GET(request: Request) {
  try {
    // داده مرجع سراسری است ولی خواندنش فقط برای کاربر لاگین‌کرده مجاز است
    if (!getAuthorizedUser(request)) return unauthorized();
    const rows = await getDb()
      .select()
      .from(serviceCategories)
      .orderBy(asc(serviceCategories.title));
    return ok(rows.map(mapServiceCategory));
  } catch (error) {
    return handleRouteError(error);
  }
}
