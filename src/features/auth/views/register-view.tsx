"use client";

import { AuthShell } from "../components/auth-shell";
import { RegisterForm } from "../components/register-form";

export function RegisterView() {
  return (
    <AuthShell title="ساخت حساب کاربری" subtitle="در چند ثانیه عضو لایف‌هاب شوید">
      <RegisterForm />
    </AuthShell>
  );
}
