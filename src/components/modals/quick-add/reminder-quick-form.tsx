"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components/ui/form-input";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { useCreateReminder } from "@/features/tasks/hooks/use-reminders";
import {
  reminderFormSchema,
  type ReminderForm,
} from "@/features/tasks/validations/reminder-schema";
import { parseReminderForm } from "@/features/tasks/validations/reminder-schema";

export function ReminderQuickForm({ onDone }: { onDone: () => void }) {
  const createMutation = useCreateReminder();
  const todayIso = new Date().toISOString().slice(0, 10);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReminderForm>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: todayIso,
      dueTime: "12:00",
      priority: "normal",
      recurrence: "none",
    },
    mode: "onTouched",
  });

  return (
    <form
      onSubmit={handleSubmit((values) => {
        const parsed = parseReminderForm(values);
        if (!parsed.ok) return;
        createMutation.mutate(parsed.data, { onSuccess: onDone });
      })}
      noValidate
      className="space-y-3.5"
    >
      <FormInput
        label="نام کار / یادآور"
        placeholder="مثلاً پیگیری دندان‌پزشکی"
        error={errors.title?.message}
        {...register("title")}
      />

      <div className="grid grid-cols-2 gap-2">
        <FormInput
          label="تاریخ"
          type="date"
          error={errors.dueDate?.message}
          {...register("dueDate")}
        />
        <FormInput
          label="ساعت"
          type="time"
          error={errors.dueTime?.message}
          {...register("dueTime")}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <label
            htmlFor="quick-reminder-priority"
            className="block text-xs font-bold text-muted-foreground"
          >
            اولویت
          </label>
          <select
            id="quick-reminder-priority"
            {...register("priority")}
            className="h-12 w-full rounded-xl bg-primary/5 px-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="low">کم</option>
            <option value="normal">عادی</option>
            <option value="high">فوری</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="quick-reminder-recurrence"
            className="block text-xs font-bold text-muted-foreground"
          >
            تکرار
          </label>
          <select
            id="quick-reminder-recurrence"
            {...register("recurrence")}
            className="h-12 w-full rounded-xl bg-primary/5 px-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="none">بدون تکرار</option>
            <option value="daily">روزانه</option>
            <option value="weekly">هفتگی</option>
            <option value="monthly">ماهانه</option>
            <option value="yearly">سالانه</option>
          </select>
        </div>
      </div>

      <FormSubmitButton
        label="ساخت یادآور"
        pendingLabel="در حال ساخت…"
        isPending={createMutation.isPending || isSubmitting}
      />
    </form>
  );
}
