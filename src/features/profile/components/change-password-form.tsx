"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components/ui/form-input";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { useChangePassword } from "../hooks/use-change-password";
import {
  changePasswordFormSchema,
  type ChangePasswordFormValues,
} from "../validations/profile-schema";

export function ChangePasswordForm() {
  const changeMutation = useChangePassword();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    mode: "onTouched",
  });

  return (
    <form
      onSubmit={handleSubmit((values) =>
        changeMutation.mutate(
          { currentPassword: values.currentPassword, newPassword: values.newPassword },
          { onSuccess: () => reset() },
        ),
      )}
      noValidate
      className="space-y-3"
    >
      <FormInput
        label="رمز عبور فعلی"
        type="password"
        autoComplete="current-password"
        error={errors.currentPassword?.message}
        {...register("currentPassword")}
      />
      <FormInput
        label="رمز عبور جدید"
        type="password"
        autoComplete="new-password"
        hint="حداقل ۸ کاراکتر شامل حرف و رقم"
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />
      <FormInput
        label="تکرار رمز عبور جدید"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <FormSubmitButton
        label="تغییر رمز عبور"
        pendingLabel="در حال تغییر…"
        isPending={changeMutation.isPending || isSubmitting}
      />
    </form>
  );
}
