"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormInput } from "@/components/ui/form-input";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { useChecklists, useCreateChecklistItem } from "@/features/tasks/hooks/use-checklists";
import { createChecklistItemSchema } from "@/features/tasks/validations/checklist-schema";
import { faNum } from "@/lib/format";

const checklistQuickFormSchema = z.object({
  packId: z.string().min(1, "انتخاب چک‌لیست الزامی است"),
  text: createChecklistItemSchema.shape.text,
});

type ChecklistQuickFormValues = z.infer<typeof checklistQuickFormSchema>;

export function ChecklistQuickForm({ onDone }: { onDone: () => void }) {
  const { data: checklists = [], isLoading } = useChecklists();
  const createItemMutation = useCreateChecklistItem();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChecklistQuickFormValues>({
    resolver: zodResolver(checklistQuickFormSchema),
    defaultValues: { packId: checklists[0]?.id ?? "", text: "" },
    mode: "onTouched",
  });

  if (isLoading) {
    return (
      <p className="py-6 text-center text-xs text-muted-foreground">
        در حال دریافت چک‌لیست‌ها…
      </p>
    );
  }

  if (checklists.length === 0) {
    return (
      <p className="rounded-xl bg-primary/5 px-3.5 py-4 text-center text-xs text-muted-foreground">
        هنوز چک‌لیستی نساخته‌اید؛ از صفحه «کارها و لیست‌ها» یک چک‌لیست بسازید.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((values) =>
        createItemMutation.mutate(
          { checklistId: values.packId, input: { text: values.text } },
          { onSuccess: onDone },
        ),
      )}
      noValidate
      className="space-y-3.5"
    >
      <div className="space-y-1.5">
        <label
          htmlFor="quick-checklist-pack"
          className="block text-xs font-bold text-muted-foreground"
        >
          بسته چک‌لیست مقصد
        </label>
        <select
          id="quick-checklist-pack"
          {...register("packId")}
          className="h-12 w-full rounded-xl bg-primary/5 px-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          {checklists.map((pack) => (
            <option key={pack.id} value={pack.id}>
              {pack.title} ({faNum(pack.items.length)} قلم)
            </option>
          ))}
        </select>
        {errors.packId && (
          <p className="text-[11px] font-semibold text-destructive">
            {errors.packId.message}
          </p>
        )}
      </div>

      <FormInput
        label="قلم موردنظر"
        placeholder="مثلاً شارژر خورشیدی"
        error={errors.text?.message}
        {...register("text")}
      />

      <FormSubmitButton
        label="افزودن به چک‌لیست"
        pendingLabel="در حال افزودن…"
        isPending={createItemMutation.isPending || isSubmitting}
      />
    </form>
  );
}
