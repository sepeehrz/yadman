import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "@/components/common/toast";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { fetchSecurityQuestion, requestPasswordReset } from "../service";
import type { ForgotPasswordRequest } from "../types";

export function useSecurityQuestion() {
  const router = useRouter();
  return useMutation({
    mutationFn: (username: string) => fetchSecurityQuestion(username),
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "کاربری با این نام پیدا نشد"));
    },
  });
}

export function useForgotPassword() {
  const router = useRouter();
  return useMutation({
    mutationFn: (input: ForgotPasswordRequest) => requestPasswordReset(input),
    onSuccess: ({ resetToken }) => {
      // توکن یک‌بارمصرف ۱۵ دقیقه‌ای به صفحه ریست منتقل می‌شود
      router.replace(`/reset-password?token=${encodeURIComponent(resetToken)}`);
      toast.success("هویت شما تأیید شد؛ رمز جدید را تعیین کنید");
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "پاسخ سوال امنیتی صحیح نیست"));
    },
  });
}
