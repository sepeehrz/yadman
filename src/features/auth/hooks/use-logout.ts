import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "@/components/common/toast";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { setLogoutInProgress } from "@/lib/query-client";
import { logout } from "../service";
import { authKeys } from "./auth-query-keys";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => logout(),

    onMutate: () => {
      setLogoutInProgress(true);
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.all });
      router.replace("/login");
      toast.info("از حساب خود خارج شدید");
    },
    onError: (error: unknown) => {
      queryClient.removeQueries({ queryKey: authKeys.all });
      router.replace("/login");
      toast.error(getApiErrorMessage(error, "خروج ناموفق بود"));
    },
    onSettled: () => {
      setLogoutInProgress(false);
    },
  });
}
