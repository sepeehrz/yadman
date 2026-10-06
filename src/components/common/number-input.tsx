"use client";

import React from "react";
import { cn } from "@/lib";

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/** ارقام فارسی/عربی را به لاتین تبدیل می‌کند. */
export function toEnglishDigits(input: string): string {
  return input.replace(/[۰-۹٠-٩]/g, (char) => {
    const persianIndex = PERSIAN_DIGITS.indexOf(char);
    if (persianIndex > -1) {
      return String(persianIndex);
    }
    return String(ARABIC_DIGITS.indexOf(char));
  });
}

/** رشته‌ی ارقام را با جداکننده هزارگان نمایش می‌دهد: 230,000 */
export function formatThousands(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

interface IProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "type"
  > {
  /** مقدار به شکل رشته‌ی عددی بدون جداکننده، مثل «230000» */
  value: string;
  /** مقدار جدید به شکل رشته‌ی عددی بدون جداکننده برمی‌گرداند */
  onChange: (value: string) => void;
}

/**
 * ورودی عددی مبتنی بر string با جداکننده هزارگان.
 * مقدار همیشه رشته‌ای از ارقام لاتین است تا در اعتبارسنجی (z.coerce) بدون مشکل به عدد تبدیل شود.
 */
export const NumberInput = React.forwardRef<HTMLInputElement, IProps>(
  function NumberInput({ value, onChange, className, disabled, ...props }, ref) {
    function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
      const digits = toEnglishDigits(event.target.value).replace(/\D/g, "");
      onChange(digits);
    }

    return (
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        dir="ltr"
        disabled={disabled}
        value={formatThousands(value)}
        onChange={handleChange}
        className={cn(
          "h-12 w-full rounded-xl bg-primary/5 px-3.5 text-left text-sm font-medium text-foreground transition-all placeholder:font-normal placeholder:text-muted-foreground/70 focus:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60",
          className,
        )}
        {...props}
      />
    );
  },
);
