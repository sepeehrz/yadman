import { asc } from "drizzle-orm";
import { getDb } from "@/database/db";
import { serviceCategories } from "@/database/schema/garage";
import { handleRouteError, ok } from "@/app/api/service-request/route-helpers";
import { mapServiceCategory } from "../vehicles/vehicle-mappers";

export async function GET() {
  try {
    const rows = await getDb()
      .select()
      .from(serviceCategories)
      .orderBy(asc(serviceCategories.title));
    return ok(rows.map(mapServiceCategory));
  } catch (error) {
    return handleRouteError(error);
  }
}
