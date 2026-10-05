import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "./auth-constants";
import {
  verifyAuthToken,
  type AuthenticatedUser,
} from "./auth-token";

/** خواندن کاربر جاری در Server Component / Server Action */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const cookieStore = await cookies();
  return verifyAuthToken(cookieStore.get(AUTH_COOKIE_NAME)?.value);
}
