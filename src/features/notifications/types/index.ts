export type NotificationSource = "reminder" | "vehicle";

export type NotificationSeverity = "overdue" | "urgent" | "soon";

export interface AppNotification {
  /** کلید یکتا و پایدار برای تشخیص تکراری‌نبودن اعلان در هر بار mount */
  id: string;
  source: NotificationSource;
  severity: NotificationSeverity;
  /** برچسب دسته مثل «یادآور کار» یا «بیمه خودرو» */
  category: string;
  title: string;
  body: string;
  /** زمانی که موعد این اعلان رسیده (ISO) */
  dueAt: string;
  /** مسیری که با کلیک روی اعلان باز می‌شود */
  href: string;
}

export interface StoredNotification extends AppNotification {
  /** اعلان فقط یک‌بار ثبت می‌شود؛ این پرچم برای خوانده‌شدن است */
  read: boolean;
  /** زمان ثبت شدن اعلان در اعلان‌سنتر */
  firedAt: string;
}
