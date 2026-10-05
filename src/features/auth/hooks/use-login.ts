import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "@/components/common/toast";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { login } from "../service";
import type { LoginRequest } from "../types";
import { authKeys } from "./auth-query-keys";

/** بازگشت امن به مسیر داخلی درخواستی پس از ورود */
export function safeInternalRedirect(
  target: string | null,
): string {
  if (target && target.startsWith("/") && !target.startsWith("//")) {
    return target;
  }
  return "/";
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: (input: LoginRequest) => login(input),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.currentUser(), user);
      toast.success(`خوش آمدی، ${user.name}!`);
      router.replace(safeInternalRedirect(searchParams.get("redirect")));
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "ورود ناموفق بود"));
    },
  });
}
