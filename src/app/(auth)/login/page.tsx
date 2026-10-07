import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginView } from "@/features/auth/views/login-view";

export const metadata: Metadata = {
  title: "ورود | یادمان",
  description: "ورود به حساب کاربری یادمان",
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginView />
    </Suspense>
  );
}
