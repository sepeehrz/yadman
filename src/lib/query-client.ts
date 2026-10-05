import {
  QueryCache,
  QueryClient,
  defaultShouldDehydrateQuery,
} from "@tanstack/react-query";
import { isApiError } from "@/lib/api";

/** رویداد سراسری برای هدایت به صفحه لاگین هنگام ۴۰۱ (انقضای توکن) */
export const UNAUTHORIZED_EVENT = "lifehub:unauthorized";

/** مسیرهای احراز هویت که ۴۰۱ آن‌ها خطای ورود است، نه انقضای نشست */
const AUTH_EXEMPT_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/security-question",
  "/auth/reset-password",
];

function isSessionExpiredError(error: unknown): boolean {
  if (!isApiError(error) || error.status !== 401) return false;
  const url = error.url ?? "";
  return !AUTH_EXEMPT_PATHS.some((path) => url.includes(path));
}

export function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        // انقضای توکن در هر کوئری → خروج خودکار و هدایت به لاگین
        if (isSessionExpiredError(error) && typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));
        }
      },
    }),
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
