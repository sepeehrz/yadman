import type { ApiError } from "@/lib/api";

/** پیام قابل نمایش برای کاربر از خطای نرمال‌شده API */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  const apiError = error as Partial<ApiError> | null;
  if (apiError && typeof apiError === "object" && apiError.message) {
    return apiError.message;
  }
  return fallback;
}
