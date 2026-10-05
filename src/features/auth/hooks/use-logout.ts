import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "@/components/common/toast";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { logout } from "../service";
import { authKeys } from "./auth-query-keys";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.all });
      router.replace("/login");
      toast.info("از حساب خود خارج شدید");
    },
    onError: (error: unknown) => {
      // حتی در خطا، نشست کلاینت را می‌بندیم تا کاربر گیر نکند
      queryClient.removeQueries({ queryKey: authKeys.all });
      router.replace("/login");
      toast.error(getApiErrorMessage(error, "خروج ناموفق بود"));
    },
  });
}
