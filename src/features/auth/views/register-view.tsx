"use client";

import Link from "next/link";
import { AuthShell } from "../components/auth-shell";
import { RegisterForm } from "../components/register-form";

export function RegisterView() {
  return (
    <AuthShell
      title="ساخت حساب کاربری"
      subtitle="در چند ثانیه عضو لایف‌هاب شوید"
      footer={
        <p className="text-xs text-muted-foreground">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link
            href="/login"
            className="font-bold text-primary hover:underline"
          >
            وارد شوید
          </Link>
        </p>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
