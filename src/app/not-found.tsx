import Link from "next/link";
import { AppIcon } from "@/components/ui/app-icon";

/** صفحه ۴۰۴ سراسری — سازگار با ساختار route-group فعلی */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-4 text-center">
      <AppIcon name="wrong_location" className="size-10 text-muted-foreground" />
      <h1 className="text-xl font-bold text-foreground">صفحه پیدا نشد</h1>
      <p className="text-xs text-muted-foreground">
        آدرس موردنظر در یادمان وجود ندارد.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        بازگشت به داشبورد
      </Link>
    </div>
  );
}
