"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ASSETS } from "@/lib/mock-data";
import { useLifeHub } from "@/store/LifeHubContext";
import { faKm, faNum } from "@/lib/format";
import { AppIcon } from "@/components/ui/app-icon";

const FILTERS = [
  { id: "all", label: "همه رویدادها" },
  { id: "vehicles", label: "خودرو" },
  { id: "finance", label: "مالی" },
  { id: "reminders", label: "یادآورها" },
] as const;

export function DashboardScreen() {
  const router = useRouter();
  const {
    timeline,
    pendingTasksCount,
    upcomingLoansCount,
    setScheduleServiceTitle,
    payLoanDirect,
    odometerKm,
  } = useLifeHub();

  const [timelineFilter, setTimelineFilter] =
    useState<(typeof FILTERS)[number]["id"]>("all");
  const [evStatsOpen, setEvStatsOpen] = useState(false);

  const filteredTimeline = timeline.filter((item) => {
    if (timelineFilter === "all") return true;
    if (timelineFilter === "vehicles") return item.category === "auto";
    if (timelineFilter === "finance") return item.category === "finance";
    if (timelineFilter === "reminders") return item.category === "health" || item.category === "travel";
    return true;
  });

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 sm:px-6 pt-2 pb-28 space-y-5">
      {/* خوش‌آمد شخصی‌سازی‌شده */}
      <div className="flex flex-col pt-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-2xl sm:text-[26px] font-bold text-foreground tracking-tight">
                صبح بخیر، سارا
              </h1>
              <span className="text-2xl animate-bounce" style={{ animationDuration: "2.5s" }}>
                👋
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">پنجشنبه، ۳ آبان</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-xs">
            <AppIcon name="bolt" className="size-[20px]" />
          </div>
        </div>

        <div
          onClick={() => router.push("/tasks")}
          className="mt-3 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-primary/5 shadow-xs cursor-pointer hover:bg-primary/10 transition-all border border-primary/60"
        >
          <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          <span className="text-xs text-foreground truncate">
            <span className="font-bold text-foreground">{faNum(pendingTasksCount)} کار</span> امروز موعد{" "}
            <span className="text-muted-foreground font-normal">•</span>{" "}
            <span className="font-bold text-foreground">{faNum(upcomingLoansCount)} وام</span> تا ۳ روز آینده
          </span>
          <AppIcon name="arrow_forward_ios" className="size-[16px] text-muted-foreground mr-auto" />
        </div>
      </div>

      {/* نیازمند اقدام */}
      <section className="flex flex-col space-y-2.5 -mx-4 sm:-mx-6">
        <div className="px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <AppIcon name="notification_important" className="size-[18px] text-destructive" />
            <h2 className="text-base font-bold text-foreground">نیازمند اقدام</h2>
          </div>
          <span className="text-xs text-primary font-bold">۳ مورد</span>
        </div>

        <div className="flex gap-3 overflow-x-auto px-4 sm:px-6 no-scrollbar py-1">
          <div className="min-w-[270px] max-w-[270px] flex-shrink-0 bg-card p-4 rounded-2xl shadow-sm border border-border/60 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-destructive" />
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-destructive/15 text-destructive flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                  سرویس فوری
                </span>
                <AppIcon name="warning" className="size-[20px] text-destructive" />
              </div>
              <h3 className="font-bold text-base text-foreground line-clamp-1">تسلا مدل ۳</h3>
              <p className="text-xs text-muted-foreground mt-1">
                بررسی روغن ترمز و سیستم‌ها تا <span className="font-bold text-destructive">۲۸۰ کیلومتر</span> دیگر
              </p>
            </div>
            <div className="mt-4 pt-1 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">موعد این هفته</span>
              <button
                onClick={() => setScheduleServiceTitle("بررسی سیستم ترمز تسلا مدل ۳")}
                className="h-8 px-3.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow-xs active:scale-95 transition-transform flex items-center gap-1 hover:bg-primary/90"
              >
                <span>رزرو</span>
                <AppIcon name="calendar_today" className="size-[14px]" />
              </button>
            </div>
          </div>

          <div className="min-w-[270px] max-w-[270px] flex-shrink-0 bg-card p-4 rounded-2xl shadow-sm border border-border/60 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-warning" />
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-warning text-warning-foreground flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-warning" />۳ روز مانده
                </span>
                <AppIcon name="account_balance" className="size-[20px] text-warning" />
              </div>
              <h3 className="font-bold text-base text-foreground line-clamp-1">وام مسکن آپارتمان</h3>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="font-bold text-foreground" dir="ltr">$1,420.00</span> موعد ۵ آبان
              </p>
            </div>
            <div className="mt-4 pt-1 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">پرداخت خودکار خاموش</span>
              <button
                onClick={() => payLoanDirect("loan-1", "وام مسکن آپارتمان")}
                className="h-8 px-3.5 rounded-lg bg-foreground text-background text-xs font-semibold shadow-xs active:scale-95 transition-transform flex items-center gap-1 hover:bg-foreground/90"
              >
                <span>پرداخت</span>
                <AppIcon name="arrow_forward" className="size-[14px]" />
              </button>
            </div>
          </div>

          <div className="min-w-[270px] max-w-[270px] flex-shrink-0 bg-card p-4 rounded-2xl shadow-sm border border-border/60 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-success" />
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-success/30 text-success flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  تأیید شد
                </span>
                <AppIcon name="verified" className="size-[20px] text-success" />
              </div>
              <h3 className="font-bold text-base text-foreground line-clamp-1">معاینه سالانه دندان</h3>
              <p className="text-xs text-muted-foreground mt-1">
                تأیید شده برای <span className="font-semibold text-foreground">۱۴ آبان، ساعت ۱۰:۰۰</span>
              </p>
            </div>
            <div className="mt-4 pt-1 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">دکتر ونس</span>
              <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold">
                همگام با تقویم
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* هاب‌های مدیریتی */}
      <section className="flex flex-col space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">هاب‌های مدیریتی</h2>
          <span className="text-xs font-semibold text-muted-foreground">همه فعال</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => router.push("/vehicles")}
            className="bg-card p-4 rounded-2xl shadow-xs hover:shadow-md border border-border/70 transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-info/10 text-info flex items-center justify-center group-hover:scale-105 transition-transform">
                <AppIcon name="directions_car" className="size-[22px]" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-success/15 text-success text-[10px] font-bold">
                {faNum(92)}٪
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground truncate">خودروها</h3>
              <p className="text-xs text-muted-foreground truncate mt-0.5">تسلا مدل ۳</p>
            </div>
            <div className="space-y-1 pt-1">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-muted-foreground">جابه‌جایی تایر تا</span>
                <span className="font-bold text-foreground">{faNum(1200)} کیلومتر</span>
              </div>
              <div className="w-full h-1.5 bg-primary/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "78%" }} />
              </div>
            </div>
          </div>

          <div
            onClick={() => router.push("/loans")}
            className="bg-card p-4 rounded-2xl shadow-xs hover:shadow-md border border-border/70 transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <AppIcon name="account_balance_wallet" className="size-[22px]" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                ۳ فعال
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground truncate">مالی</h3>
              <p className="text-base font-extrabold text-foreground mt-0.5" dir="ltr">$18,450</p>
            </div>
            <div className="space-y-1 pt-1">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-muted-foreground">سررسید بعدی</span>
                <span className="font-bold text-warning" dir="ltr">$340 • 5d</span>
              </div>
              <div className="w-full h-1.5 bg-primary/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "45%" }} />
              </div>
            </div>
          </div>

          <div
            onClick={() => router.push("/tasks")}
            className="bg-card p-4 rounded-2xl shadow-xs hover:shadow-md border border-border/70 transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-warning/10 text-warning flex items-center justify-center group-hover:scale-105 transition-transform">
                <AppIcon name="notifications_active" className="size-[22px]" />
              </div>
              <span className="w-2 h-2 rounded-full bg-destructive animate-ping" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground truncate">یادآورها</h3>
              <p className="text-xs text-destructive font-bold mt-0.5">۲ مورد امروز</p>
            </div>
            <div className="flex items-center gap-1.5 pt-1 text-muted-foreground">
              <AppIcon name="receipt_long" className="size-[14px]" />
              <span className="text-xs text-muted-foreground truncate">فاکتور مالیاتی و نسخه</span>
            </div>
          </div>

          <div
            onClick={() => router.push("/tasks")}
            className="bg-card p-4 rounded-2xl shadow-xs hover:shadow-md border border-border/70 transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-chart-4/15 text-chart-4 flex items-center justify-center group-hover:scale-105 transition-transform">
                <AppIcon name="fact_check" className="size-[22px]" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-muted-foreground text-[10px] font-bold">
                ۴ لیست
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground truncate">چک‌لیست‌ها</h3>
              <p className="text-xs text-muted-foreground truncate mt-0.5">سفر جاده‌ای (۸ از ۱۲)</p>
            </div>
            <div className="w-full h-1.5 bg-primary/10 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-chart-4 rounded-full" style={{ width: "66%" }} />
            </div>
          </div>
        </div>
      </section>

      {/* کارت خودرو برقی */}
      <div
        onClick={() => setEvStatsOpen(!evStatsOpen)}
        className="relative w-full h-36 rounded-2xl overflow-hidden shadow-sm flex items-center p-4 cursor-pointer group"
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url('${ASSETS.evGarage}')` }}
        />
        {/* لایه‌ی تیره روی عکس: توکن scrim در هر دو تم تیره می‌ماند، پس متن
            روی آن همیشه باید روشن باشد. */}
        <div className="absolute inset-0 bg-gradient-to-l from-scrim/90 via-scrim/65 to-transparent" />
        <div className="relative z-10 max-w-[240px] space-y-1 text-white">
          <span className="px-2.5 py-0.5 rounded-full bg-primary/90 text-primary-foreground text-[10px] font-bold backdrop-blur-sm inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            خودرو برقی متصل
          </span>
          <h4 className="font-bold text-base text-white">باتری تا ۸۵٪ شارژ شد</h4>
          <p className="text-xs text-primary-foreground">برد تخمینی: ۳۸۴ کیلومتر</p>
          {evStatsOpen && (
            <p className="text-[11px] text-success">سلامت باتری: عالی • آخرین همگام‌سازی امروز</p>
          )}
        </div>
        <div className="absolute left-3.5 bottom-3.5 z-10 flex items-center gap-1 text-[11px] font-semibold text-white/80 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-lg">
          <span>کارکرد: {faKm(odometerKm)}</span>
        </div>
      </div>

      {/* تایم‌لاین آینده */}
      <section className="flex flex-col space-y-3 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">تایم‌لاین آینده</h2>
          <button
            onClick={() => router.push("/tasks")}
            className="text-xs text-primary font-bold flex items-center gap-0.5 hover:underline"
          >
            مشاهده همه
            <AppIcon name="chevron_right" className="size-[16px]" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {FILTERS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTimelineFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 transition-all ${
                timelineFilter === tab.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-primary/10 text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border/70 space-y-4">
          {filteredTimeline.map((item, idx) => (
            <div key={item.id} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    item.category === "health"
                      ? "bg-warning text-warning-foreground"
                      : item.category === "auto"
                        ? "bg-primary/10 text-primary"
                        : item.category === "finance"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-chart-4/15 text-chart-4"
                  }`}
                >
                  <AppIcon name={item.icon} className="size-[20px]" />
                </div>
                {idx < filteredTimeline.length - 1 && <div className="w-0.5 h-10 bg-primary/10 my-1" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] font-bold ${
                      item.category === "health"
                        ? "text-warning-foreground"
                        : item.category === "auto"
                          ? "text-primary"
                          : item.category === "finance"
                            ? "text-destructive"
                            : "text-chart-4"
                    }`}
                  >
                    {item.timeLabel}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-background text-muted-foreground text-[10px] font-bold border border-border">
                    {item.categoryLabel}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-foreground truncate mt-0.5">{item.title}</h4>
                <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
