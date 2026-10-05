"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthBanner } from "../components/auth-banner";
import { AuthShell } from "../components/auth-shell";
import { LoginForm } from "../components/login-form";

export function LoginView() {
  const searchParams = useSearchParams();
  const expired = searchParams.get("expired") === "1";
  const resetDone = searchParams.get("reset") === "1";

  return (
    <AuthShell
      title="ورود به حساب"
      subtitle="برای مدیریت خودرو، وام‌ها و یادآورها وارد شوید"
      footer={
        <p className="text-xs text-muted-foreground">
          حساب ندارید؟{" "}
          <Link
            href="/register"
            className="font-bold text-primary hover:underline"
          >
            ثبت‌نام کنید
          </Link>
        </p>
      }
    >
      <div className="space-y-4">
        {expired && (
          <AuthBanner
            tone="warning"
            message="نشست شما منقضی شده است؛ لطفاً دوباره وارد شوید."
          />
        )}
        {resetDone && (
          <AuthBanner
            tone="success"
            message="رمز عبور با موفقیت تغییر کرد؛ با رمز جدید وارد شوید."
          />
        )}
        <LoginForm expired={expired} resetDone={resetDone} />
      </div>
    </AuthShell>
  );
}
