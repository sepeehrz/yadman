"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { AuthBanner } from "../components/auth-banner";
import { AuthShell } from "../components/auth-shell";
import { ResetPasswordForm } from "../components/reset-password-form";

export function ResetPasswordView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token");

  useEffect(() => {
    if (!resetToken) {
      router.replace("/forgot-password");
    }
  }, [resetToken, router]);

  if (!resetToken) {
    return null;
  }

  return (
    <AuthShell
      title="تعیین رمز عبور جدید"
      subtitle="توکن بازیابی شما ۱۵ دقیقه اعتبار دارد"
      footer={
        <p className="text-xs text-muted-foreground">
          <Link
            href="/login"
            className="font-bold text-primary hover:underline"
          >
            بازگشت به ورود
          </Link>
        </p>
      }
    >
      <div className="space-y-4">
        <AuthBanner
          tone="info"
          message="هویت شما تأیید شد. رمز جدید را دو بار وارد کنید."
        />
        <ResetPasswordForm resetToken={resetToken} />
      </div>
    </AuthShell>
  );
}
