import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/common/toast";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { changePassword } from "../service";
import type { ChangePasswordRequest } from "../types";

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: ChangePasswordRequest) => changePassword(input),
    onSuccess: () => {
      toast.success("رمز عبور با موفقیت تغییر کرد");
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "تغییر رمز عبور ناموفق بود"));
    },
  });
}
