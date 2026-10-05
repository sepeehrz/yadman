"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppIcon } from "@/components/ui/app-icon";
import { FormInput } from "@/components/ui/form-input";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { useForgotPassword, useSecurityQuestion } from "../hooks/use-forgot-password";
import {
  forgotPasswordFormSchema,
  securityAnswerFormSchema,
  type ForgotPasswordFormValues,
  type SecurityAnswerFormValues,
} from "../validations/forgot-password-schema";

export function ForgotPasswordForm() {
  const [step, setStep] = useState<"username" | "answer">("username");
  const [username, setUsername] = useState("");
  const securityQuestionMutation = useSecurityQuestion();
  const forgotPasswordMutation = useForgotPassword();

  const usernameForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: { username: "" },
    mode: "onTouched",
  });

  const answerForm = useForm<SecurityAnswerFormValues>({
    resolver: zodResolver(securityAnswerFormSchema),
    defaultValues: { securityAnswer: "" },
    mode: "onTouched",
  });

  const onUsernameSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await securityQuestionMutation.mutateAsync(values.username);
      setUsername(values.username);
      setStep("answer");
    } catch {
      // خطا در هوک با toast نمایش داده می‌شود
    }
  };

  const onAnswerSubmit = (values: SecurityAnswerFormValues) => {
    forgotPasswordMutation.mutate({
      username,
      securityAnswer: values.securityAnswer,
    });
  };

  if (step === "username") {
    return (
      <form
        onSubmit={usernameForm.handleSubmit(onUsernameSubmit)}
        noValidate
        className="space-y-4"
      >
        <p className="rounded-xl bg-primary/5 px-3.5 py-2.5 text-xs leading-5 text-muted-foreground">
          نام کاربری خود را وارد کنید تا سوال امنیتی‌تان نمایش داده شود.
        </p>
        <FormInput
          label="نام کاربری"
          placeholder="مثلاً sara_92"
          autoComplete="username"
          icon="person"
          error={usernameForm.formState.errors.username?.message}
          {...usernameForm.register("username")}
        />
        <FormSubmitButton
          label="نمایش سوال امنیتی"
          pendingLabel="در حال جست‌وجو…"
          isPending={securityQuestionMutation.isPending}
        />
      </form>
    );
  }

  return (
    <form
      onSubmit={answerForm.handleSubmit(onAnswerSubmit)}
      noValidate
      className="space-y-4"
    >
      <div className="flex items-start gap-2 rounded-xl bg-primary/5 px-3.5 py-3">
        <AppIcon
          name="help"
          className="mt-0.5 size-[18px] shrink-0 text-primary"
        />
        <div>
          <span className="block text-[11px] font-bold text-muted-foreground">
            سوال امنیتی شما
          </span>
          <span className="text-sm font-bold text-foreground">
            {securityQuestionMutation.data?.securityQuestion}
          </span>
        </div>
      </div>

      <FormInput
        label="پاسخ امنیتی"
        placeholder="پاسخ خود را وارد کنید"
        error={answerForm.formState.errors.securityAnswer?.message}
        {...answerForm.register("securityAnswer")}
      />

      <FormSubmitButton
        label="تأیید و ادامه"
        pendingLabel="در حال بررسی…"
        isPending={forgotPasswordMutation.isPending}
      />

      <button
        type="button"
        onClick={() => setStep("username")}
        className="w-full rounded-xl py-2 text-xs font-semibold text-muted-foreground hover:bg-primary/5"
      >
        بازگشت و تغییر نام کاربری
      </button>
    </form>
  );
}
