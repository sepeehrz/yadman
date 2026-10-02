"use client";

import { useState } from "react";
import { useLifeHub } from "@/store/LifeHubContext";
import { faNum } from "@/lib/format";

export function OdometerModal() {
  const { isOdometerOpen, setOdometerOpen, odometerKm, updateOdometer } = useLifeHub();
  const [val, setVal] = useState(odometerKm.toString());

  if (!isOdometerOpen) return null;
  const onClose = () => setOdometerOpen(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(val.replace(/,/g, ""), 10);
    if (!isNaN(num) && num > 0) {
      updateOdometer(num);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#0b1c30]/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 border border-[#e2e8f0]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4f46e5] text-[20px]">speed</span>
            <h3 className="text-base font-bold text-[#0b1c30]">به‌روزرسانی کیلومتر</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#eff4ff] text-[#545f73] flex items-center justify-center hover:bg-[#e5eeff]"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#545f73]">
              کارکرد فعلی (کیلومتر) — مقدار قبلی: {faNum(odometerKm)}
            </label>
            <div className="relative">
              <input
                type="number"
                value={val}
                onChange={(e) => setVal(e.target.value)}
                className="w-full h-12 px-3 pl-12 rounded-xl bg-[#eff4ff] text-[#0b1c30] font-bold text-lg focus:ring-2 focus:ring-[#4f46e5]/40 outline-none"
                autoFocus
              />
              <span className="absolute left-3 top-3.5 text-xs font-bold text-[#545f73]">KM</span>
            </div>
            <p className="text-[11px] text-[#545f73] pt-1">
              با به‌روزرسانی کارکرد، همه آستانه‌های نگهداری فوراً بازتنظیم می‌شوند.
            </p>
          </div>

          <div className="flex gap-2">
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
              اعمال و همگام‌سازی
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
