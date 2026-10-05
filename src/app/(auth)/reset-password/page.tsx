import { Suspense } from "react";
import type { Metadata } from "next";
import { ResetPasswordView } from "@/features/auth/views/reset-password-view";

export const metadata: Metadata = {
  title: "تعیین رمز جدید | لایف‌هاب",
  description: "تعیین رمز عبور جدید با توکن بازیابی",
};

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordView />
    </Suspense>
  );
}
