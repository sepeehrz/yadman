import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "../service";
import { authKeys } from "./auth-query-keys";

/** کاربر جاری — در صفحات محافظت‌شده استفاده می‌شود */
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: fetchCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
