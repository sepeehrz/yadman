import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { UNAUTHORIZED_EVENT } from "@/lib/query-client";
import { readTokenExpiryEpoch } from "../utils/token-expiry";
import { authKeys } from "./auth-query-keys";

/**
 * خروج خودکار: با منقضی‌شدن توکن (زمان‌بندی روی کوکی انقضا) یا دریافت ۴۰۱ از
 * سرور، حافظه کوئری پاک و کاربر به صفحه لاگین هدایت می‌شود.
 */
export function useAuthExpiry(): void {
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const handleSessionEnd = () => {
      queryClient.removeQueries({ queryKey: authKeys.all });
      router.replace("/login?expired=1");
    };

    const onUnauthorized = () => handleSessionEnd();
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);

    const expiryEpoch = readTokenExpiryEpoch();
    if (expiryEpoch !== null) {
      const remainingMs = expiryEpoch * 1000 - Date.now();
      timer = setTimeout(handleSessionEnd, Math.max(0, remainingMs));
    }

    return () => {
      window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
      if (timer !== null) clearTimeout(timer);
    };
  }, [queryClient, router]);
}
