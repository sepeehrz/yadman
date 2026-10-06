import * as React from "react";
import { cn } from "@/lib";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * ورودی پایه طراحی سیستم — برای فرم‌ها و کامپوننت‌هایی مثل date-picker.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, type = "text", ...props }, ref) {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "h-12 w-full rounded-xl bg-primary/5 px-3.5 text-sm font-medium text-foreground transition-all placeholder:font-normal placeholder:text-muted-foreground/70 focus:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/40",
          className,
        )}
        {...props}
      />
    );
  },
);
