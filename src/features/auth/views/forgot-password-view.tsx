"use client";

import Link from "next/link";
import { AuthShell } from "../components/auth-shell";
import { ForgotPasswordForm } from "../components/forgot-password-form";

export function ForgotPasswordView() {
  return (
    <AuthShell
      title="فراموشی رمز عبور"
      subtitle="با سوال امنیتی هویت خود را تأیید کنید"
      footer={
        <p className="text-xs text-muted-foreground">
          به یاد آوردید؟{" "}
          <Link
            href="/login"
            className="font-bold text-primary hover:underline"
          >
            بازگشت به ورود
          </Link>
        </p>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
