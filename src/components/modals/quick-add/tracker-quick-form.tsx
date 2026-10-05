"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components/ui/form-input";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { useOdometer } from "@/features/dashboard/hooks/use-odometer";
import { useCreateTracker } from "@/features/vehicles/hooks/use-trackers";
import {
  trackerFormSchema,
  type TrackerFormInput,
  type TrackerFormValues,
} from "@/features/vehicles/validations/tracker-schema";
import { faNum } from "@/lib/format";

export function TrackerQuickForm({ onDone }: { onDone: () => void }) {
  const { data: preferences } = useOdometer();
  const createMutation = useCreateTracker();
  const odometerKm = preferences?.odometerKm ?? 0;

  const {
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
        <FormInput
          label="دوره تناوب (کیلومتر)"
          type="number"
          error={errors.intervalKm?.message}
          {...register("intervalKm")}
        />
        <FormInput
          label="دوره تناوب (ماه)"
          type="number"
          error={errors.intervalMonths?.message}
          {...register("intervalMonths")}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <FormInput
          label="آستانه موعد (کیلومتر)"
          type="number"
          error={errors.targetKm?.message}
          {...register("targetKm")}
        />
        <FormInput
          label="تاریخ موعد"
          type="date"
          error={errors.targetDate?.message}
          {...register("targetDate")}
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
