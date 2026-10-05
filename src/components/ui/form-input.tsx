"use client";

import { useId, useState } from "react";
import { AppIcon } from "@/components/ui/app-icon";

interface IProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "id" | "className"
> {
  id?: string;
  label: string;
  error?: string;
  hint?: string;
  icon?: string;
  containerClassName?: string;
}

/**
 * ورودی فرم مطابق Design System — لیبل، آیکون، پیام خطا و حالت فوکوس
 * با توکن‌های رنگی. برای همه فرم‌های اپلیکیشن استفاده می‌شود.
 */
export function FormInput({
  label,
  error,
  hint,
  icon,
  containerClassName,
  type = "text",
  ...inputProps
}: IProps) {
  const generatedId = useId();
  const inputId = inputProps.id ?? generatedId;
  const errorId = `${inputId}-error`;
  const [showPassword, setShowPassword] = useState(false);
  const resolvedType = type === "password" && showPassword ? "text" : type;

  return (
    <div className={`space-y-1.5 ${containerClassName ?? ""}`}>
      <label
        htmlFor={inputId}
        className="block text-xs font-bold text-muted-foreground"
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <AppIcon
            name={icon}
            className="absolute right-3.5 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground"
          />
        )}
        <input
          {...inputProps}
          id={inputId}
          type={resolvedType}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`h-12 w-full rounded-xl bg-primary/5 px-3.5 text-sm font-medium text-foreground transition-all placeholder:font-normal placeholder:text-muted-foreground/70 focus:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
            icon ? "pr-10" : ""
          } ${type === "password" ? "pl-11" : ""} ${
            error ? "ring-2 ring-destructive/60" : ""
          }`}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((previous) => !previous)}
            aria-label={showPassword ? "پنهان‌کردن رمز" : "نمایش رمز"}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <AppIcon
              name={showPassword ? "visibility_off" : "visibility"}
              className="size-[19px]"
            />
          </button>
        )}
      </div>
      {error ? (
        <p id={errorId} className="flex items-center gap-1 text-[11px] font-semibold text-destructive">
          <AppIcon name="error" className="size-[13px]" />
          {error}
        </p>
      ) : hint ? (
        <p className="text-[11px] text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
