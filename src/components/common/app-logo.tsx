import { LifeBuoy } from "lucide-react";
import { cn } from "@/lib";

interface IProps {
  className?: string;
}

/**
 * نشان برند یادمان — آیکون lucide روی پس‌زمینه‌ی رنگ برند.
 *
 * قبلاً از یک تصویر راه دور (googleusercontent) استفاده می‌شد که بدون
 * دسترسی به اینترنت بارگذاری نمی‌شد و آیکون خالی می‌ماند؛ آیکون lucide همیشه
 * همراه بسته است و بدون درخواست شبکه رندر می‌شود.
 */
export function AppLogo({ className }: IProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm",
        className,
      )}
    >
      <LifeBuoy className="size-[60%]" strokeWidth={2.2} />
    </span>
  );
}