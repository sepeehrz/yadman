import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "@/components/common/toast";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { resetPassword } from "../service";
import type { ResetPasswordRequest } from "../types";

export function useResetPassword() {
  const router = useRouter();
  return useMutation({
    mutationFn: (input: ResetPasswordRequest) => resetPassword(input),
    onSuccess: () => {
      router.replace("/login?reset=1");
      toast.success("رمز عبور تغییر کرد؛ با رمز جدید وارد شوید");
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "بازیابی رمز عبور ناموفق بود"));
    },
  });
}
