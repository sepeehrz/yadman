"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ASSETS } from "@/lib/mock-data";
import { useLifeHub } from "@/store/LifeHubContext";
import { faKm, faNum } from "@/lib/format";

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
              <h1 className="text-2xl sm:text-[26px] font-bold text-[#0b1c30] tracking-tight">
                صبح بخیر، سارا
              </h1>
              <span className="text-2xl animate-bounce" style={{ animationDuration: "2.5s" }}>
                👋
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#545f73] mt-0.5">پنجشنبه، ۳ آبان</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#dce9ff] flex items-center justify-center text-[#3525cd] shadow-xs">
            <span className="material-symbols-outlined text-[20px]">bolt</span>
          </div>
        </div>

        <div
          onClick={() => router.push("/tasks")}
          className="mt-3 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#eff4ff] shadow-xs cursor-pointer hover:bg-[#e5eeff] transition-all border border-[#dce9ff]/60"
        >
          <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-pulse" />
          <span className="text-xs text-[#0b1c30] truncate">
            <span className="font-bold text-[#0b1c30]">{faNum(pendingTasksCount)} کار</span> امروز موعد{" "}
            <span className="text-[#545f73] font-normal">•</span>{" "}
            <span className="font-bold text-[#0b1c30]">{faNum(upcomingLoansCount)} وام</span> تا ۳ روز آینده
          </span>
          <span className="material-symbols-outlined text-[16px] text-[#545f73] mr-auto ltr-flip">
            arrow_forward_ios
          </span>
        </div>
      </div>

      {/* نیازمند اقدام */}
      <section className="flex flex-col space-y-2.5 -mx-4 sm:-mx-6">
        <div className="px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#ba1a1a]">
              notification_important
            </span>
            <h2 className="text-base font-bold text-[#0b1c30]">نیازمند اقدام</h2>
          </div>
          <span className="text-xs text-[#3525cd] font-bold">۳ مورد</span>
        </div>

        <div className="flex gap-3 overflow-x-auto px-4 sm:px-6 no-scrollbar py-1">
          <div className="min-w-[270px] max-w-[270px] flex-shrink-0 bg-white p-4 rounded-2xl shadow-sm border border-[#e2e8f0]/60 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#ba1a1a]" />
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-[#ffdad6] text-[#93000a] flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]" />
                  سرویس فوری
                </span>
                <span className="material-symbols-outlined text-[20px] text-[#ba1a1a]">warning</span>
              </div>
              <h3 className="font-bold text-base text-[#0b1c30] line-clamp-1">تسلا مدل ۳</h3>
              <p className="text-xs text-[#464555] mt-1">
                بررسی روغن ترمز و سیستم‌ها تا <span className="font-bold text-[#ba1a1a]">۲۸۰ کیلومتر</span> دیگر
              </p>
            </div>
            <div className="mt-4 pt-1 flex items-center justify-between">
              <span className="text-[11px] text-[#545f73]">موعد این هفته</span>
              <button
                onClick={() => setScheduleServiceTitle("بررسی سیستم ترمز تسلا مدل ۳")}
                className="h-8 px-3.5 rounded-lg bg-[#4f46e5] text-white text-xs font-semibold shadow-xs active:scale-95 transition-transform flex items-center gap-1 hover:bg-[#3525cd]"
              >
                <span>رزرو</span>
                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
              </button>
            </div>
          </div>

          <div className="min-w-[270px] max-w-[270px] flex-shrink-0 bg-white p-4 rounded-2xl shadow-sm border border-[#e2e8f0]/60 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-900 flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />۳ روز مانده
                </span>
                <span className="material-symbols-outlined text-[20px] text-amber-600">account_balance</span>
              </div>
              <h3 className="font-bold text-base text-[#0b1c30] line-clamp-1">وام مسکن آپارتمان</h3>
              <p className="text-xs text-[#464555] mt-1">
                <span className="font-bold text-[#0b1c30]" dir="ltr">$1,420.00</span> موعد ۵ آبان
              </p>
            </div>
            <div className="mt-4 pt-1 flex items-center justify-between">
              <span className="text-[11px] text-[#545f73]">پرداخت خودکار خاموش</span>
              <button
                onClick={() => payLoanDirect("loan-1", "وام مسکن آپارتمان")}
                className="h-8 px-3.5 rounded-lg bg-[#0b1c30] text-white text-xs font-semibold shadow-xs active:scale-95 transition-transform flex items-center gap-1 hover:bg-[#213145]"
              >
                <span>پرداخت</span>
                <span className="material-symbols-outlined text-[14px] ltr-flip">arrow_forward</span>
              </button>
            </div>
          </div>

          <div className="min-w-[270px] max-w-[270px] flex-shrink-0 bg-white p-4 rounded-2xl shadow-sm border border-[#e2e8f0]/60 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#4edea3]" />
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-[#67f4b7]/30 text-[#005338] flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006e4b]" />
                  تأیید شد
                </span>
                <span className="material-symbols-outlined text-[20px] text-[#006e4b]">verified</span>
              </div>
              <h3 className="font-bold text-base text-[#0b1c30] line-clamp-1">معاینه سالانه دندان</h3>
              <p className="text-xs text-[#464555] mt-1">
                تأیید شده برای <span className="font-semibold text-[#0b1c30]">۱۴ آبان، ساعت ۱۰:۰۰</span>
              </p>
            </div>
            <div className="mt-4 pt-1 flex items-center justify-between">
              <span className="text-[11px] text-[#545f73]">دکتر ونس</span>
              <span className="px-2 py-0.5 rounded-md bg-[#dce9ff] text-[#3525cd] text-[10px] font-bold">
                همگام با تقویم
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* هاب‌های مدیریتی */}
      <section className="flex flex-col space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#0b1c30]">هاب‌های مدیریتی</h2>
          <span className="text-xs font-semibold text-[#545f73]">همه فعال</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => router.push("/vehicles")}
            className="bg-white p-4 rounded-2xl shadow-xs hover:shadow-md border border-[#e2e8f0]/70 transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">directions_car</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                {faNum(92)}٪
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0b1c30] truncate">خودروها</h3>
              <p className="text-xs text-[#545f73] truncate mt-0.5">تسلا مدل ۳</p>
            </div>
            <div className="space-y-1 pt-1">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-[#545f73]">جابه‌جایی تایر تا</span>
                <span className="font-bold text-[#0b1c30]">{faNum(1200)} کیلومتر</span>
              </div>
              <div className="w-full h-1.5 bg-[#e5eeff] rounded-full overflow-hidden">
                <div className="h-full bg-[#4f46e5] rounded-full" style={{ width: "78%" }} />
              </div>
            </div>
          </div>

          <div
            onClick={() => router.push("/loans")}
            className="bg-white p-4 rounded-2xl shadow-xs hover:shadow-md border border-[#e2e8f0]/70 transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#3525cd] flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#e5eeff] text-[#3525cd] text-[10px] font-bold">
                ۳ فعال
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0b1c30] truncate">مالی</h3>
              <p className="text-base font-extrabold text-[#0b1c30] mt-0.5" dir="ltr">$18,450</p>
            </div>
            <div className="space-y-1 pt-1">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-[#545f73]">سررسید بعدی</span>
                <span className="font-bold text-amber-600" dir="ltr">$340 • 5d</span>
              </div>
              <div className="w-full h-1.5 bg-[#e5eeff] rounded-full overflow-hidden">
                <div className="h-full bg-[#4f46e5] rounded-full" style={{ width: "45%" }} />
              </div>
            </div>
          </div>

          <div
            onClick={() => router.push("/tasks")}
            className="bg-white p-4 rounded-2xl shadow-xs hover:shadow-md border border-[#e2e8f0]/70 transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">notifications_active</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-ping" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0b1c30] truncate">یادآورها</h3>
              <p className="text-xs text-[#ba1a1a] font-bold mt-0.5">۲ مورد امروز</p>
            </div>
            <div className="flex items-center gap-1.5 pt-1 text-[#545f73]">
              <span className="material-symbols-outlined text-[14px]">receipt_long</span>
              <span className="text-xs text-[#464555] truncate">فاکتور مالیاتی و نسخه</span>
            </div>
          </div>

          <div
            onClick={() => router.push("/tasks")}
            className="bg-white p-4 rounded-2xl shadow-xs hover:shadow-md border border-[#e2e8f0]/70 transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">fact_check</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#e5eeff] text-[#545f73] text-[10px] font-bold">
                ۴ لیست
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0b1c30] truncate">چک‌لیست‌ها</h3>
              <p className="text-xs text-[#545f73] truncate mt-0.5">سفر جاده‌ای (۸ از ۱۲)</p>
            </div>
            <div className="w-full h-1.5 bg-[#e5eeff] rounded-full overflow-hidden mt-2">
              <div className="h-full bg-purple-600 rounded-full" style={{ width: "66%" }} />
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
        <div className="absolute inset-0 bg-gradient-to-l from-[#0b1c30]/90 via-[#0b1c30]/65 to-transparent" />
        <div className="relative z-10 max-w-[240px] space-y-1 text-white">
          <span className="px-2.5 py-0.5 rounded-full bg-[#4f46e5]/90 text-white text-[10px] font-bold backdrop-blur-sm inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6ffbbe] animate-pulse" />
            خودرو برقی متصل
          </span>
          <h4 className="font-bold text-base text-white">باتری تا ۸۵٪ شارژ شد</h4>
          <p className="text-xs text-[#dad7ff]">برد تخمینی: ۳۸۴ کیلومتر</p>
          {evStatsOpen && (
            <p className="text-[11px] text-[#6ffbbe]">سلامت باتری: عالی • آخرین همگام‌سازی امروز</p>
          )}
        </div>
        <div className="absolute left-3.5 bottom-3.5 z-10 flex items-center gap-1 text-[11px] font-semibold text-white/80 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-lg">
          <span>کارکرد: {faKm(odometerKm)}</span>
        </div>
      </div>

      {/* تایم‌لاین آینده */}
      <section className="flex flex-col space-y-3 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#0b1c30]">تایم‌لاین آینده</h2>
          <button
            onClick={() => router.push("/tasks")}
            className="text-xs text-[#3525cd] font-bold flex items-center gap-0.5 hover:underline"
          >
            مشاهده همه
            <span className="material-symbols-outlined text-[16px] ltr-flip">chevron_right</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {FILTERS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTimelineFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 transition-all ${
                timelineFilter === tab.id
                  ? "bg-[#3525cd] text-white shadow-xs"
                  : "bg-[#e5eeff] text-[#545f73] hover:text-[#0b1c30]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e8f0]/70 space-y-4">
          {filteredTimeline.map((item, idx) => (
            <div key={item.id} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    item.category === "health"
                      ? "bg-amber-100 text-amber-700"
                      : item.category === "auto"
                        ? "bg-indigo-100 text-[#4f46e5]"
                        : item.category === "finance"
                          ? "bg-red-100 text-[#ba1a1a]"
                          : "bg-purple-100 text-purple-700"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                </div>
                {idx < filteredTimeline.length - 1 && <div className="w-0.5 h-10 bg-[#e5eeff] my-1" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] font-bold ${
                      item.category === "health"
                        ? "text-amber-800"
                        : item.category === "auto"
                          ? "text-[#3525cd]"
                          : item.category === "finance"
                            ? "text-[#ba1a1a]"
                            : "text-purple-800"
                    }`}
                  >
                    {item.timeLabel}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#f8f9ff] text-[#545f73] text-[10px] font-bold border border-[#e2e8f0]">
                    {item.categoryLabel}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#0b1c30] truncate mt-0.5">{item.title}</h4>
                <p className="text-xs text-[#545f73] truncate">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
