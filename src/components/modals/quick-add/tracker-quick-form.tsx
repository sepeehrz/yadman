"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components/ui/form-input";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { NumberInput } from "@/components/common/number-input";
import { DatePickerComponent } from "@/components/common/date-picker";
import { AppIcon } from "@/components/ui/app-icon";
import { useOdometer } from "@/features/dashboard/hooks/use-odometer";
import { useCreateTracker } from "@/features/vehicles/hooks/use-trackers";
import {
  trackerFormSchema,
  type TrackerFormInput,
  type TrackerFormValues,
} from "@/features/vehicles/validations/tracker-schema";
import { faNum } from "@/lib/format";

function FieldShell({
  label,
  error,
  htmlFor,
  children,
}: {
  label: string;
  error?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-xs font-bold text-muted-foreground"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="flex items-center gap-1 text-[11px] font-semibold text-destructive">
          <AppIcon name="error" className="size-[13px]" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TrackerQuickForm({ onDone }: { onDone: () => void }) {
  const { data: preferences } = useOdometer();
  const createMutation = useCreateTracker();
  const odometerKm = preferences?.odometerKm ?? 0;

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TrackerFormInput, unknown, TrackerFormValues>({
    resolver: zodResolver(trackerFormSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      currentKm: odometerKm,
      targetKm: odometerKm + 5000,
      intervalKm: 5000,
      intervalMonths: 6,
      targetDate: "",
    },
    mode: "onTouched",
  });

  return (
    <form
      onSubmit={handleSubmit((values) =>
        createMutation.mutate(values, { onSuccess: onDone }),
      )}
      noValidate
      className="space-y-3.5"
    >
      <p className="rounded-xl bg-primary/5 px-3.5 py-2.5 text-xs text-muted-foreground">
        ردیاب سرویس روی کیلومتر فعلی{" "}
        <span className="font-bold text-foreground">{faNum(odometerKm)}</span>{" "}
        ساخته می‌شود.
      </p>

      <FormInput
        label="نام سرویس / قطعه"
        placeholder="مثلاً لنت ترمز، روغن موتور"
        error={errors.title?.message}
        {...register("title")}
      />

      <div className="grid grid-cols-2 gap-2">
        <Controller
          control={control}
          name="intervalKm"
          render={({ field }) => (
            <FieldShell
              label="دوره تناوب (کیلومتر)"
              error={errors.intervalKm?.message}
            >
              <NumberInput
                value={field.value == null ? "" : String(field.value)}
                onChange={(value) =>
                  field.onChange(value === "" ? undefined : value)
                }
              />
            </FieldShell>
          )}
        />
        <FormInput
          label="دوره تناوب (ماه)"
          type="number"
          error={errors.intervalMonths?.message}
          {...register("intervalMonths")}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Controller
          control={control}
          name="targetKm"
          render={({ field }) => (
            <FieldShell
              label="آستانه موعد (کیلومتر)"
              error={errors.targetKm?.message}
            >
              <NumberInput
                value={field.value == null ? "" : String(field.value)}
                onChange={(value) =>
                  field.onChange(value === "" ? undefined : value)
                }
              />
            </FieldShell>
          )}
        />
        <Controller
          control={control}
          name="targetDate"
          render={({ field }) => (
            <FieldShell label="تاریخ موعد" error={errors.targetDate?.message}>
              <DatePickerComponent
                value={field.value || null}
                onChange={(value) => field.onChange(value ?? "")}
                placeholder="انتخاب تاریخ"
              />
            </FieldShell>
          )}
        />
      </div>

      <FormSubmitButton
        label="ساخت ردیاب سرویس"
        pendingLabel="در حال ساخت…"
        isPending={createMutation.isPending || isSubmitting}
      />
    </form>
  );
}
