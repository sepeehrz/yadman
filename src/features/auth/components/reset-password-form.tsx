"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components/ui/form-input";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { useResetPassword } from "../hooks/use-reset-password";
import {
  resetPasswordFormSchema,
  type ResetPasswordFormValues,
} from "../validations/reset-password-schema";

interface IProps {
  resetToken: string;
}

export function ResetPasswordForm({ resetToken }: IProps) {
  const resetMutation = useResetPassword();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
    mode: "onTouched",
  });

  return (
    <form
      onSubmit={handleSubmit((values) =>
        resetMutation.mutate({
          resetToken,
          newPassword: values.newPassword,
        }),
      )}
      noValidate
      className="space-y-4"
    >
      <FormInput
        label="رمز عبور جدید"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        icon="lock"
        hint="حداقل ۸ کاراکتر شامل حرف و رقم"
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />

      <FormInput
        label="تکرار رمز عبور جدید"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        icon="lock_reset"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <FormSubmitButton
        label="تغییر رمز عبور"
        pendingLabel="در حال تغییر…"
        isPending={resetMutation.isPending || isSubmitting}
      />
    </form>
  );
}
