"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppIcon } from "@/components/ui/app-icon";
import { FormInput } from "@/components/ui/form-input";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { useRegister } from "../hooks/use-register";
import { SECURITY_QUESTIONS } from "../utils/security-questions";
import {
  registerFormSchema,
  type RegisterFormValues,
} from "../validations/register-schema";
import type { RegisterRequest } from "../types";
import type { Gender } from "../types";

const GENDER_OPTIONS: { value: Gender; label: string; icon: string }[] = [
  { value: "male", label: "مرد", icon: "man" },
  { value: "female", label: "زن", icon: "woman" },
];

export function RegisterForm() {
  const registerMutation = useRegister();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      name: "",
      lastName: "",
      gender: undefined,
      securityQuestion: "",
      securityAnswer: "",
      acceptTerms: false,
    },
    mode: "onTouched",
  });

  const onSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate(
      { ...values, securityQuestion: values.securityQuestion as RegisterRequest["securityQuestion"] },
      {
        onError: () => {
          // نام کاربری تکراری از سرور به فیلد مربوطه برمی‌گردد
          setError("username", {
            message: "این نام کاربری قبلاً گرفته شده است",
          });
        },
      },
    );
  };

  const isPending = registerMutation.isPending || isSubmitting;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <FormInput
          label="نام"
          placeholder="سارا"
          autoComplete="given-name"
          error={errors.name?.message}
          {...register("name")}
        />
        <FormInput
          label="نام خانوادگی"
          placeholder="محمدی"
          autoComplete="family-name"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>

      <FormInput
        label="نام کاربری"
        placeholder="مثلاً sara_92"
        autoComplete="username"
        icon="person"
        hint="فقط حروف انگلیسی، عدد و زیرخط"
        error={errors.username?.message}
        {...register("username")}
      />

      <fieldset className="space-y-1.5">
        <legend className="text-xs font-bold text-muted-foreground">
          جنسیت
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {GENDER_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-primary/5 px-3 py-2.5 text-sm font-semibold text-foreground transition-all has-[:checked]:bg-primary/15 has-[:checked]:text-primary has-[:checked]:ring-2 has-[:checked]:ring-primary/40"
            >
              <input
                type="radio"
                value={option.value}
                {...register("gender")}
                className="sr-only"
              />
              <AppIcon name={option.icon} className="size-[17px]" />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        {errors.gender && (
          <p className="text-[11px] font-semibold text-destructive">
            {errors.gender.message}
          </p>
        )}
      </fieldset>

      <div className="space-y-1.5">
        <label
          htmlFor="security-question"
          className="block text-xs font-bold text-muted-foreground"
        >
          سوال امنیتی (برای بازیابی رمز عبور)
        </label>
        <select
          id="security-question"
          {...register("securityQuestion")}
          className="h-12 w-full rounded-xl bg-primary/5 px-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="">یک سوال انتخاب کنید…</option>
          {SECURITY_QUESTIONS.map((question) => (
            <option key={question} value={question}>
              {question}
            </option>
          ))}
        </select>
        {errors.securityQuestion && (
          <p className="text-[11px] font-semibold text-destructive">
            {errors.securityQuestion.message}
          </p>
        )}
      </div>

      <FormInput
        label="پاسخ امنیتی"
        placeholder="پاسخ خود را وارد کنید"
        error={errors.securityAnswer?.message}
        {...register("securityAnswer")}
      />

      <FormInput
        label="رمز عبور"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        icon="lock"
        hint="حداقل ۸ کاراکتر شامل حرف و رقم"
        error={errors.password?.message}
        {...register("password")}
      />

      <FormInput
        label="تکرار رمز عبور"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        icon="lock_reset"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <div className="space-y-1">
        <label className="flex cursor-pointer items-start gap-2 rounded-xl bg-primary/5 px-3 py-3">
          <input
            type="checkbox"
            {...register("acceptTerms")}
            className="mt-0.5 size-4 shrink-0 cursor-pointer rounded accent-primary"
          />
          <span className="text-xs leading-5 text-foreground">
            <span className="font-bold text-primary">قوانین و مقررات</span>{" "}
            لایف‌هاب را خوانده‌ام و می‌پذیرم.
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="flex items-center gap-1 text-[11px] font-semibold text-destructive">
            <AppIcon name="error" className="size-[13px]" />
            {errors.acceptTerms.message}
          </p>
        )}
      </div>

      <FormSubmitButton
        label="ساخت حساب کاربری"
        pendingLabel="در حال ساخت حساب…"
        isPending={isPending}
      />

      <p className="text-center text-xs text-muted-foreground">
        حساب دارید؟{" "}
        <Link href="/login" className="font-bold text-primary hover:underline">
          وارد شوید
        </Link>
      </p>
    </form>
  );
}
