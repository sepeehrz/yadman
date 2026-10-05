import { clearAuthCookies } from "@/lib/auth";
import { ok } from "@/app/api/service-request/route-helpers";

export async function POST() {
  const response = ok({ success: true });
  clearAuthCookies(response);
  return response;
}
