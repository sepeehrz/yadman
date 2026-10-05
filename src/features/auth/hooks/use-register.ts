import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "@/components/common/toast";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { registerUser } from "../service";
import type { RegisterRequest } from "../types";
import { authKeys } from "./auth-query-keys";

export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: RegisterRequest) => registerUser(input),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.currentUser(), user);
      toast.success(`حساب شما ساخته شد؛ خوش آمدی ${user.name}!`);
      router.replace("/");
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "ثبت‌نام ناموفق بود"));
    },
  });
}
