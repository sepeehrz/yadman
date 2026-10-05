import type { Metadata } from "next";
import { RegisterView } from "@/features/auth/views/register-view";

export const metadata: Metadata = {
  title: "ثبت‌نام | لایف‌هاب",
  description: "ساخت حساب کاربری جدید در لایف‌هاب",
};

export default function RegisterPage() {
  return <RegisterView />;
}
