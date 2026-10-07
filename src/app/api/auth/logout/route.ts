import { clearAuthCookies } from "@/lib/auth";
import { ok } from "@/utils/server-helpers/route-helpers";

export async function POST() {
  const response = ok({ success: true });
  clearAuthCookies(response);
  return response;
}
