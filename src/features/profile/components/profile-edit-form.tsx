"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { AppIcon } from "@/components/ui/app-icon";
import { useUpdateProfile } from "../hooks/use-profile";
import type { ProfileDto } from "../types";
import {
  profileUpdateFormSchema,
  type ProfileUpdateFormValues,
} from "../validations/profile-schema";
import type { Gender } from "@/features/auth/types";

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "male", label: "مرد" },
  { value: "female", label: "زن" },
];

interface IProps {
  profile: ProfileDto;
  onDone?: () => void;
}

export function ProfileEditForm({ profile, onDone }: IProps) {
  const updateMutation = useUpdateProfile();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileUpdateFormValues>({
    resolver: zodResolver(profileUpdateFormSchema),
    defaultValues: {
      name: profile.name,
      lastName: profile.lastName,
      gender: profile.gender,
    },
    mode: "onTouched",
  });

  return (
    <form
      onSubmit={handleSubmit((values) =>
        updateMutation.mutate(values, { onSuccess: () => onDone?.() }),
      )}
      noValidate
      className="space-y-3"
    >
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label htmlFor="profile-name" className="block text-xs font-bold text-muted-foreground">
            نام
          </label>
          <input
            id="profile-name"
            {...register("name")}
            className={`h-11 w-full rounded-xl bg-primary/5 px-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 ${
              errors.name ? "ring-2 ring-destructive/60" : ""
            }`}
          />
          {errors.name && (
            <p className="text-[11px] font-semibold text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <label htmlFor="profile-last-name" className="block text-xs font-bold text-muted-foreground">
            نام خانوادگی
          </label>
          <input
            id="profile-last-name"
            {...register("lastName")}
            className={`h-11 w-full rounded-xl bg-primary/5 px-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 ${
              errors.lastName ? "ring-2 ring-destructive/60" : ""
            }`}
          />
          {errors.lastName && (
            <p className="text-[11px] font-semibold text-destructive">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <span className="block text-xs font-bold text-muted-foreground">جنسیت</span>
        <div className="grid grid-cols-2 gap-2">
          {GENDER_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-primary/5 px-3 py-2 text-xs font-semibold text-foreground transition-all has-[:checked]:bg-primary/15 has-[:checked]:text-primary has-[:checked]:ring-2 has-[:checked]:ring-primary/40"
            >
              <input
                type="radio"
                value={option.value}
                {...register("gender")}
                className="sr-only"
              />
              <AppIcon
                name={option.value === "male" ? "man" : "woman"}
                className="size-[15px]"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        {errors.gender && (
          <p className="text-[11px] font-semibold text-destructive">
            {errors.gender.message}
          </p>
        )}
      </div>

      <FormSubmitButton
        label="ذخیره تغییرات"
        pendingLabel="در حال ذخیره…"
        isPending={updateMutation.isPending || isSubmitting}
      />
    </form>
  );
}
