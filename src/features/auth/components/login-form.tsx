"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components/ui/form-input";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { loginFormSchema, type LoginFormValues } from "../validations/login-schema";
import { useLogin } from "../hooks/use-login";

interface IProps {
  expired?: boolean;
  resetDone?: boolean;
}

export function LoginForm({ expired = false, resetDone = false }: IProps) {
  const loginMutation = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { username: "", password: "" },
    mode: "onTouched",
  });

  const isPending = loginMutation.isPending || isSubmitting;

  return (
    <form onSubmit={handleSubmit((values) => loginMutation.mutate(values))} noValidate className="space-y-4">
      {expired && (
        <p className="rounded-xl bg-warning/15 px-3.5 py-2.5 text-xs font-semibold text-warning-foreground">
          نشست شما منقضی شده است؛ لطفاً دوباره وارد شوید.
        </p>
      )}
      {resetDone && (
        <p className="rounded-xl bg-success/10 px-3.5 py-2.5 text-xs font-semibold text-success">
          رمز عبور با موفقیت تغییر کرد؛ با رمز جدید وارد شوید.
        </p>
      )}

      <FormInput
        label="نام کاربری"
        placeholder="مثلاً sara_92"
        autoComplete="username"
        icon="person"
        error={errors.username?.message}
        {...register("username")}
      />

      <FormInput
        label="رمز عبور"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        icon="lock"
        error={errors.password?.message}
        {...register("password")}
      />

      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-xs font-bold text-primary hover:underline"
        >
          رمز عبور را فراموش کرده‌اید؟
        </Link>
      </div>

      <FormSubmitButton label="ورود به حساب" pendingLabel="در حال ورود…" isPending={isPending} />
    </form>
  );
}
