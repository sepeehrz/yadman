import type { Metadata } from "next";
import { RegisterView } from "@/features/auth/views/register-view";

export const metadata: Metadata = {
  title: "ثبت‌نام | یادمان",
  description: "ساخت حساب کاربری جدید در یادمان",
};

export default function RegisterPage() {
  return <RegisterView />;
}
