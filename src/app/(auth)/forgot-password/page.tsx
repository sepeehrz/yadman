import type { Metadata } from "next";
import { ForgotPasswordView } from "@/features/auth/views/forgot-password-view";

export const metadata: Metadata = {
  title: "فراموشی رمز عبور | یادمان",
  description: "بازیابی رمز عبور با سوال امنیتی",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}
