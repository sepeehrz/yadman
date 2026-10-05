"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components/ui/form-input";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { useCreateLoan } from "@/features/loans/hooks/use-loans";
import {
  loanFormSchema,
  type LoanFormInput,
  type LoanFormValues,
} from "@/features/loans/validations/loan-schema";

const CATEGORY_OPTIONS: { value: LoanFormValues["category"]; label: string }[] = [
  { value: "mortgage", label: "مسکن" },
  { value: "auto", label: "خودرو" },
  { value: "hardware", label: "کالا / دستگاه" },
  { value: "personal", label: "شخصی / سایر" },
];

export function LoanQuickForm({ onDone }: { onDone: () => void }) {
  const createMutation = useCreateLoan();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoanFormInput, unknown, LoanFormValues>({
    resolver: zodResolver(loanFormSchema),
    defaultValues: {
      title: "",
      bank: "",
      category: "personal",
      monthlyAmount: undefined,
      remainingAmount: undefined,
      dueDay: 15,
      autoPay: true,
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
      <FormInput
        label="عنوان وام / بدهی"
        placeholder="مثلاً وام بازسازی خانه"
        error={errors.title?.message}
        {...register("title")}
      />

      <div className="grid grid-cols-2 gap-2">
        <FormInput
          label="بانک / مؤسسه"
          placeholder="مثلاً Chase"
          error={errors.bank?.message}
          {...register("bank")}
        />
        <div className="space-y-1.5">
          <label
            htmlFor="quick-loan-category"
            className="block text-xs font-bold text-muted-foreground"
          >
            دسته
          </label>
          <select
            id="quick-loan-category"
            {...register("category")}
            className="h-12 w-full rounded-xl bg-primary/5 px-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <FormInput
          label="قسط ماهانه ($)"
          type="number"
          step="0.01"
          placeholder="450.00"
          error={errors.monthlyAmount?.message}
          {...register("monthlyAmount")}
        />
        <FormInput
          label="مانده کل ($)"
          type="number"
          step="0.01"
          placeholder="12000.00"
          error={errors.remainingAmount?.message}
          {...register("remainingAmount")}
        />
      </div>

      <FormInput
        label="روز سررسید ماه"
        type="number"
        placeholder="15"
        error={errors.dueDay?.message}
        {...register("dueDay")}
      />

      <label className="flex cursor-pointer items-center justify-between rounded-xl bg-primary/5 px-3 py-3">
        <span className="text-xs font-bold text-foreground">
          پرداخت خودکار فعال باشد
        </span>
        <input
          type="checkbox"
          {...register("autoPay")}
          className="size-5 cursor-pointer rounded accent-primary"
        />
      </label>

      <FormSubmitButton
        label="افزودن وام"
        pendingLabel="در حال افزودن…"
        isPending={createMutation.isPending || isSubmitting}
      />
    </form>
  );
}
