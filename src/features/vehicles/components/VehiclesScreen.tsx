"use client";

import { useState } from "react";
import { ASSETS } from "@/lib/mock-data";
import { useLifeHub } from "@/store/LifeHubContext";
import { faKm, faNum, usd } from "@/lib/format";
import type { ServiceLogRecord } from "@/lib/types";

export function VehiclesScreen() {
  const {
    trackers,
    serviceLogs,
    odometerKm,
    setOdometerOpen,
    setScheduleServiceTitle,
    addServiceLog,
    showToast,
  } = useLifeHub();

  const [activeTab, setActiveTab] = useState<"maintenance" | "logbook">("maintenance");
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const [logTask, setLogTask] = useState("جابه‌جایی و بالانس تایر");
  const [logKm, setLogKm] = useState(odometerKm.toString());
  const [logDate, setLogDate] = useState("2024-10-25");
  const [logCost, setLogCost] = useState("85.00");
  const [logProvider, setLogProvider] = useState("نمایندگی تسلا");
  const [logNotes, setLogNotes] = useState("جابه‌جایی ضربدری جلو به عقب انجام شد.");

  const totalSpent = serviceLogs.reduce((acc, curr) => acc + curr.cost, 0);

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: ServiceLogRecord = {
      id: `log-${Date.now()}`,
      title: logTask,
      date: new Date(logDate).toLocaleDateString("fa-IR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      provider: logProvider || "سرویس شخصی",
      odometerKm: parseInt(logKm, 10) || odometerKm,
      cost: parseFloat(logCost) || 0,
      receiptVerified: true,
      notes: logNotes,
      category: "سرویس",
    };

    addServiceLog(newRecord);
    setIsLogModalOpen(false);
    showToast("سرویس ثبت و وضعیت نگهداری به‌روزرسانی شد!");
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 sm:px-6 pt-2 pb-28 space-y-4">
      {/* کارت هیرو خودرو */}
      <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#e2e8f0]/70 relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-44 h-44 rounded-full bg-[#4f46e5]/10 blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between relative z-10 mb-2">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#d5e0f8] text-[#111c2d]">
              <span className="material-symbols-outlined text-[14px]">electric_car</span>
              <span className="text-[10px] font-bold">برقی دو موتوره</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0b1c30]">تسلا مدل ۳ لانگ‌رنج</h2>
            <div className="flex items-center gap-2 text-[#545f73] text-xs font-semibold">
              <span>{faNum(2022)}</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-[#e5eeff] text-[#0b1c30] text-[10px] tracking-widest font-mono font-bold" dir="ltr">
                7XYZ892
              </span>
            </div>
          </div>
          <button
            onClick={() => showToast("تله‌متری خودرو: همه سنسورها متصل‌اند")}
            aria-label="تنظیمات خودرو"
            className="w-9 h-9 rounded-full bg-[#eff4ff] text-[#0b1c30] flex items-center justify-center hover:bg-[#e5eeff] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">more_vert</span>
          </button>
        </div>

        <div className="relative w-full h-40 sm:h-48 rounded-xl overflow-hidden my-3 border border-[#e2e8f0]/40">
          <img className="w-full h-full object-cover" alt="تسلا مدل ۳" src={ASSETS.teslaModel3} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c30]/80 via-transparent to-transparent flex items-end p-3">
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-white flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-[16px] text-[#6ffbbe]">verified</span>{" "}
                همگام با تله‌متری تسلا
              </span>
              <span className="text-[11px] text-[#cbdbf5] font-mono" dir="ltr">VIN: ...8392</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 relative z-10">
          <div className="rounded-xl bg-[#eff4ff] p-3 flex flex-col justify-between border border-[#dce9ff]/60">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#545f73]">کیلومتر</span>
              <button
                onClick={() => setOdometerOpen(true)}
                className="flex items-center gap-0.5 text-xs text-[#3525cd] font-bold hover:underline"
              >
                <span>ویرایش</span>
                <span className="material-symbols-outlined text-[14px]">edit</span>
              </button>
            </div>
            <div className="my-1">
              <div className="text-xl sm:text-2xl font-extrabold text-[#0b1c30]">
                {faNum(odometerKm)} <span className="text-xs font-semibold text-[#545f73]">کیلومتر</span>
              </div>
            </div>
            <span className="text-[10px] text-[#545f73] flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[13px] text-[#545f73]">update</span>{" "}
              به‌روزرسانی دیروز
            </span>
          </div>

          <div className="rounded-xl bg-[#eff4ff] p-3 flex items-center gap-2.5 border border-[#dce9ff]/60">
            <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                <circle className="text-[#d3e4fe]" cx="24" cy="24" fill="none" r="18" stroke="currentColor" strokeWidth="4.5" />
                <circle
                  className="text-[#006e4b]"
                  cx="24"
                  cy="24"
                  fill="none"
                  r="18"
                  stroke="currentColor"
                  strokeDasharray="113.1"
                  strokeDashoffset="6.78"
                  strokeLinecap="round"
                  strokeWidth="4.5"
                />
              </svg>
              <span className="absolute font-extrabold text-sm text-[#0b1c30]">{faNum(94)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#545f73]">سلامت خودرو</span>
              <span className="text-xs font-bold text-[#006e4b]">عالی</span>
              <span className="text-[10px] text-[#545f73]">۱ اقدام در انتظار</span>
            </div>
          </div>
        </div>
      </div>

      {/* تب‌ها */}
      <div className="p-1 rounded-xl bg-[#e5eeff] flex items-center text-[#545f73]">
        <button
          onClick={() => setActiveTab("maintenance")}
          className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "maintenance" ? "bg-white text-[#3525cd] shadow-xs" : "hover:text-[#0b1c30]"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">build_circle</span>
          <span>اقلام نگهداری</span>
          <span className="w-2 h-2 rounded-full bg-[#ba1a1a] ml-0.5" />
        </button>
        <button
          onClick={() => setActiveTab("logbook")}
          className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "logbook" ? "bg-white text-[#3525cd] shadow-xs" : "hover:text-[#0b1c30]"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">menu_book</span>
          <span>دفترچه سرویس</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#d5e0f8] text-[#111c2d]">
            {faNum(serviceLogs.length)}
          </span>
        </button>
      </div>

      {activeTab === "maintenance" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="font-bold text-sm text-[#0b1c30]">
              ردیاب‌های فعال ({faNum(trackers.length)})
            </span>
            <span className="text-xs text-[#545f73] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#006e4b]">swap_vert</span>{" "}
              بر اساس فوریت
            </span>
          </div>

          {trackers.map((tracker) => {
            const isUrgent = tracker.category === "urgent";
            return (
              <div
                key={tracker.id}
                className={`rounded-2xl bg-white p-4 shadow-xs border transition-all ${
                  isUrgent ? "border-r-4 border-r-[#ba1a1a] border-[#e2e8f0]" : "border-[#e2e8f0]/80"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isUrgent
                          ? "bg-[#ffdad6] text-[#ba1a1a]"
                          : tracker.badgeType === "tertiary"
                            ? "bg-emerald-50 text-[#006e4b]"
                            : "bg-[#d5e0f8] text-[#111c2d]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[22px]">{tracker.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#0b1c30]">{tracker.title}</h3>
                      <p className="text-xs text-[#545f73]">{tracker.subtitle}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      isUrgent
                        ? "bg-[#ffdad6] text-[#93000a]"
                        : tracker.badgeType === "tertiary"
                          ? "bg-[#6ffbbe]/30 text-[#005338]"
                          : "bg-[#e5eeff] text-[#3525cd]"
                    }`}
                  >
                    {isUrgent && <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]" />}
                    {tracker.badgeText}
                  </span>
                </div>

                {tracker.intervalKm && (
                  <div className="space-y-1.5 mb-3">
                    <div className="flex justify-between text-xs text-[#545f73]">
                      <span>دوره ({faNum(tracker.intervalKm)} کیلومتر)</span>
                      <span className={`font-bold ${isUrgent ? "text-[#ba1a1a]" : "text-[#0b1c30]"}`}>
                        {tracker.currentKm ? faNum(tracker.currentKm) : "—"} /{" "}
                        {tracker.targetKm ? faNum(tracker.targetKm) : "—"} کیلومتر (
                        {tracker.percentage ? faNum(tracker.percentage) : "—"}٪)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#e5eeff] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isUrgent ? "bg-[#ba1a1a]" : "bg-[#4f46e5]"
                        }`}
                        style={{ width: `${Math.min(100, tracker.percentage || 0)}%` }}
                      />
                    </div>
                  </div>
                )}

                {tracker.timeElapsedMonths && (
                  <div className="space-y-1 mb-2.5">
                    <div className="flex justify-between text-xs text-[#545f73]">
                      <span>چرخه زمانی</span>
                      <span className="font-bold text-[#0b1c30]">
                        {faNum(tracker.timeElapsedMonths)} از {faNum(tracker.timeTotalMonths || 1)} ماه سپری شده
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#e5eeff] overflow-hidden">
                      <div
                        className="h-full bg-[#545f73] rounded-full"
                        style={{
                          width: `${((tracker.timeElapsedMonths || 0) / (tracker.timeTotalMonths || 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-[#f1f5f9]">
                  <span className="text-[11px] text-[#545f73] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">info</span>{" "}
                    {tracker.extraDetail || `هدف: ${tracker.targetDate || "در انتظار"}`}
                  </span>
                  {isUrgent ? (
                    <button
                      onClick={() => setScheduleServiceTitle(tracker.title)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#4f46e5] text-white text-xs font-bold shadow-xs active:scale-95 transition-transform flex items-center gap-1 hover:bg-[#3525cd]"
                    >
                      <span className="material-symbols-outlined text-[15px]">calendar_month</span>{" "}
                      رزرو سرویس
                    </button>
                  ) : (
                    <button
                      onClick={() => showToast(`جزئیات بازدید ${tracker.title}`)}
                      className="text-xs text-[#3525cd] font-bold hover:underline flex items-center gap-0.5"
                    >
                      جزئیات{" "}
                      <span className="material-symbols-outlined text-[14px] ltr-flip">chevron_right</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <button
              onClick={() => setIsLogModalOpen(true)}
              className="w-full h-12 rounded-xl bg-[#4f46e5] text-white font-bold text-sm shadow-md hover:bg-[#3525cd] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[22px]">add_circle</span>
              <span>ثبت سرویس انجام‌شده</span>
            </button>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-xs border border-[#e2e8f0]/80">
            <div className="flex items-center justify-between mb-3">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-[#545f73]">هزینه نگهداری</span>
                <div className="text-xl sm:text-2xl font-extrabold text-[#0b1c30]">
                  <span dir="ltr">{usd(totalSpent)}</span>{" "}
                  <span className="text-xs font-normal text-[#545f73]">در ۱۴۰۳</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#6ffbbe] text-[#002113] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">receipt_long</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="p-2.5 rounded-lg bg-[#eff4ff] text-center">
                <span className="text-[10px] font-semibold text-[#545f73] block">کل سوابق</span>
                <span className="font-extrabold text-sm text-[#0b1c30]">
                  {faNum(serviceLogs.length)} مراجعه
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#eff4ff] text-center">
                <span className="text-[10px] font-semibold text-[#545f73] block">هزینه هر ۱٬۰۰۰ کیلومتر</span>
                <span className="font-extrabold text-sm text-[#0b1c30]" dir="ltr">$28.40</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-[#545f73] block">سوابق اخیر سرویس</span>
              {serviceLogs.slice(0, 2).map((item) => (
                <div key={item.id} className="p-3 rounded-xl bg-[#eff4ff] flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#dce9ff] text-[#0b1c30] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">verified_user</span>
                    </div>
                    <div>
                      <span className="font-bold text-xs text-[#0b1c30] block">{item.title}</span>
                      <span className="text-[11px] text-[#545f73]">
                        {item.date} • {item.provider}
                      </span>
                      <div className="flex items-center gap-1.5 mt-1 text-[10px] text-[#545f73]">
                        <span className="material-symbols-outlined text-[13px]">speed</span>{" "}
                        {faKm(item.odometerKm)}
                        {item.receiptVerified && (
                          <>
                            <span>•</span>
                            <span className="material-symbols-outlined text-[13px]">attach_file</span>{" "}
                            فاکتور تأیید شد
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="font-extrabold text-xs text-[#0b1c30] whitespace-nowrap" dir="ltr">
                    {usd(item.cost)}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab("logbook")}
              className="w-full mt-3 py-2 rounded-lg bg-[#eff4ff] text-[#3525cd] font-bold text-xs flex items-center justify-center gap-1 hover:bg-[#e5eeff] transition-colors"
            >
              <span>مشاهده دفترچه کامل ({faNum(serviceLogs.length)} رکورد)</span>
              <span className="material-symbols-outlined text-[16px] ltr-flip">arrow_forward</span>
            </button>
          </div>

          <div className="rounded-2xl bg-[#d5e0f8]/50 p-4 flex items-center gap-3 border border-[#c7c4d8]/40">
            <div className="w-10 h-10 rounded-full bg-[#d5e0f8] text-[#111c2d] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[20px]">lightbulb</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-[#111c2d] block">نکته نگهداری</span>
              <p className="text-xs text-[#3c475a] leading-tight">
                هر ۱۰ هزار کیلومتر تایرها را جابه‌جا کنید تا برد باتری و عمر آج بیشتر شود.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "logbook" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="font-bold text-sm text-[#0b1c30]">سوابق کامل سرویس</h3>
              <p className="text-xs text-[#545f73]">دفتر تأییدشده تسلا مدل ۳</p>
            </div>
            <button
              onClick={() => setIsLogModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-[#4f46e5] text-white text-xs font-bold flex items-center gap-1 shadow-xs"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              <span>رکورد جدید</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {serviceLogs.map((log) => (
              <div key={log.id} className="bg-white p-4 rounded-2xl shadow-xs border border-[#e2e8f0]/80 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-[#3525cd] block">{log.date}</span>
                    <h4 className="font-bold text-sm text-[#0b1c30]">{log.title}</h4>
                    <p className="text-xs text-[#545f73]">{log.provider}</p>
                  </div>
                  <div className="text-left">
                    <span className="text-base font-extrabold text-[#0b1c30]" dir="ltr">
                      {usd(log.cost)}
                    </span>
                    <span className="text-[10px] font-semibold text-[#545f73] block">
                      {faKm(log.odometerKm)}
                    </span>
                  </div>
                </div>

                {log.notes && (
                  <p className="text-xs text-[#464555] bg-[#eff4ff] p-2.5 rounded-xl border border-[#dce9ff]/60">
                    {log.notes}
                  </p>
                )}

                <div className="flex items-center justify-between pt-1 text-[11px] text-[#545f73]">
                  <span className="flex items-center gap-1 text-[#006e4b] font-semibold">
                    <span className="material-symbols-outlined text-[14px]">verified</span>{" "}
                    {log.receiptVerified ? "فاکتور تأیید شد" : "ثبت شخصی"}
                  </span>
                  <button
                    onClick={() => showToast(`فاکتور receipt_${log.id}.pdf دانلود شد`)}
                    className="text-[#3525cd] font-bold hover:underline flex items-center gap-0.5"
                  >
                    <span>مشاهده PDF</span>
                    <span className="material-symbols-outlined text-[14px]">download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="fixed inset-0 bg-[#0b1c30]/50 backdrop-blur-sm"
            onClick={() => setIsLogModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-t-[28px] sm:rounded-2xl p-5 sm:p-6 shadow-2xl max-h-[85vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#e2dfff] text-[#0f0069] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0b1c30]">ثبت سرویس</h3>
                  <span className="text-xs text-[#545f73]" dir="ltr">Tesla Model 3 • 7XYZ892</span>
                </div>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#eff4ff] text-[#545f73] flex items-center justify-center hover:bg-[#e5eeff]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveLog} className="space-y-3.5 pt-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#545f73]">خدمت / دسته</label>
                <select
                  value={logTask}
                  onChange={(e) => setLogTask(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#eff4ff] text-xs font-semibold text-[#0b1c30] outline-none"
                >
                  <option>جابه‌جایی و بالانس تایر</option>
                  <option>فیلتر کابین و تهویه</option>
                  <option>تعویض روغن ترمز</option>
                  <option>تنظیم فرمان</option>
                  <option>بررسی باتری کمکی ۱۲ ولت</option>
                  <option>بازدید سالانه چندنقطه‌ای</option>
                  <option>تعویض تیغه برف‌پاک‌کن</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#545f73]">کیلومتر</label>
                  <input
                    type="number"
                    value={logKm}
                    onChange={(e) => setLogKm(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-[#eff4ff] text-xs font-bold text-[#0b1c30] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#545f73]">تاریخ سرویس</label>
                  <input
                    type="date"
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-[#eff4ff] text-xs font-semibold text-[#0b1c30] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#545f73]">هزینه ($)</label>
                  <input
                    type="number"
                    value={logCost}
                    onChange={(e) => setLogCost(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-[#eff4ff] text-xs font-bold text-[#0b1c30] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#545f73]">تعمیرگاه</label>
                  <input
                    type="text"
                    value={logProvider}
                    onChange={(e) => setLogProvider(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-[#eff4ff] text-xs font-semibold text-[#0b1c30] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#545f73]">یادداشت تعمیرکار</label>
                <textarea
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  rows={2}
                  className="w-full p-3 rounded-xl bg-[#eff4ff] text-xs font-medium text-[#0b1c30] outline-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="flex-1 h-11 rounded-xl bg-[#eff4ff] text-[#545f73] font-semibold text-xs hover:bg-[#e5eeff]"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-[#4f46e5] text-white font-bold text-xs shadow-md hover:bg-[#3525cd] active:scale-95 transition-all"
                >
                  ذخیره رکورد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
