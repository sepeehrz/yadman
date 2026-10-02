"use client";

import { useState } from "react";
import { useLifeHub } from "@/store/LifeHubContext";

export function ScheduleServiceModal() {
  const { scheduleServiceTitle, setScheduleServiceTitle, confirmSchedule } = useLifeHub();
  const [date, setDate] = useState("2024-10-28");
  const [provider, setProvider] = useState("نمایندگی تسلا");
  const [time, setTime] = useState("۱۰:۳۰ صبح");
  const [transportNeeded, setTransportNeeded] = useState(false);

  if (scheduleServiceTitle === null) return null;
  const onClose = () => setScheduleServiceTitle(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confirmSchedule(scheduleServiceTitle, `${date} ساعت ${time}`, provider);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#0b1c30]/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm bg-white rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 border border-[#e2e8f0]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4f46e5] text-[22px]">calendar_month</span>
            <h3 className="text-base font-bold text-[#0b1c30]">رزرو سرویس</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#eff4ff] text-[#545f73] flex items-center justify-center hover:bg-[#e5eeff]"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff]">
          <span className="text-[11px] font-bold text-[#4f46e5] block">خودرو و خدمت</span>
          <span className="text-sm font-bold text-[#0b1c30]">{scheduleServiceTitle}</span>
          <span className="text-xs text-[#545f73] block mt-0.5">تسلا مدل ۳ لانگ‌رنج</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#545f73]">ارائه‌دهنده سرویس</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-[#eff4ff] text-xs font-semibold text-[#0b1c30] outline-none"
            >
              <option value="نمایندگی تسلا">نمایندگی تسلا</option>
              <option value="امداد سیار (در محل)">امداد سیار (در محل)</option>
              <option value="اتواسپا اسپارکل">اتواسپا اسپارکل</option>
              <option value="تایر کو">تایر کو</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#545f73]">تاریخ</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-11 px-2.5 rounded-xl bg-[#eff4ff] text-xs font-semibold text-[#0b1c30] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#545f73]">ساعت</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-11 px-2.5 rounded-xl bg-[#eff4ff] text-xs font-semibold text-[#0b1c30] outline-none"
              >
                <option value="۹:۰۰ صبح">۹:۰۰ صبح</option>
                <option value="۱۰:۳۰ صبح">۱۰:۳۰ صبح</option>
                <option value="۱۳:۰۰">۱۳:۰۰</option>
                <option value="۱۵:۳۰">۱۵:۳۰</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 p-2 rounded-xl bg-[#eff4ff] cursor-pointer">
            <input
              type="checkbox"
              checked={transportNeeded}
              onChange={(e) => setTransportNeeded(e.target.checked)}
              className="w-4 h-4 rounded accent-[#4f46e5]"
            />
            <span className="text-xs text-[#0b1c30]">درخواست خودرو جایگزین / اعتبار سفر</span>
          </label>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl bg-[#eff4ff] text-[#545f73] font-semibold text-xs hover:bg-[#e5eeff]"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="flex-1 h-11 rounded-xl bg-[#4f46e5] text-white font-bold text-xs hover:bg-[#3525cd] active:scale-95 transition-transform"
            >
              تأیید رزرو
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
