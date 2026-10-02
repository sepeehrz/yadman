"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLifeHub } from "@/store/LifeHubContext";

export function SearchModal() {
  const { isSearchOpen, setSearchOpen, trackers, loans, tasks, timeline } = useLifeHub();
  const [query, setQuery] = useState("");
  const router = useRouter();

  if (!isSearchOpen) return null;
  const onClose = () => setSearchOpen(false);
  const go = (href: string) => {
    router.push(href);
    onClose();
  };

  const q = query.toLowerCase().trim();

  const filteredTrackers = q
    ? trackers.filter((t) => t.title.toLowerCase().includes(q) || t.subtitle.toLowerCase().includes(q))
    : [];
  const filteredLoans = q
    ? loans.filter((l) => l.title.toLowerCase().includes(q) || l.bank.toLowerCase().includes(q))
    : [];
  const filteredTasks = q
    ? tasks.filter(
        (t) => t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q),
      )
    : [];
  const filteredTimeline = q
    ? timeline.filter(
        (tl) => tl.title.toLowerCase().includes(q) || tl.subtitle.toLowerCase().includes(q),
      )
    : [];

  const totalResults =
    filteredTrackers.length + filteredLoans.length + filteredTasks.length + filteredTimeline.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-20">
      <div className="fixed inset-0 bg-[#0b1c30]/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#e2e8f0] overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-3 sm:p-4 border-b border-[#e2e8f0] flex items-center gap-3 bg-[#f8f9ff]">
          <span className="material-symbols-outlined text-[#545f73] text-[22px]">search</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جست‌وجوی کارها، سرویس‌ها، وام‌ها..."
            className="flex-1 bg-transparent text-sm sm:text-base font-medium text-[#0b1c30] placeholder:text-[#545f73] focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="w-6 h-6 rounded-full bg-[#dce9ff] text-[#545f73] flex items-center justify-center text-xs"
            >
              ✕
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2 py-1 rounded-md bg-[#e5eeff] text-[#3525cd] hover:bg-[#dce9ff]"
          >
            بستن
          </button>
        </div>

        <div className="p-3 sm:p-4 overflow-y-auto space-y-3 no-scrollbar">
          {!query && (
            <div className="py-6 text-center text-[#545f73]">
              <span className="material-symbols-outlined text-[32px] text-[#777587] mb-1">
                manage_search
              </span>
              <p className="text-xs sm:text-sm font-medium">کلیدواژه‌ای بنویسید تا در همه هاب‌ها جست‌وجو شود</p>
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
                {["تسلا", "مسکن", "نسخه", "ترمز", "سفر"].map((hint) => (
                  <button
                    key={hint}
                    onClick={() => setQuery(hint)}
                    className="px-2.5 py-1 rounded-full bg-[#eff4ff] text-[11px] font-semibold text-[#4f46e5] hover:bg-[#e5eeff]"
                  >
                    {hint}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && totalResults === 0 && (
            <div className="py-8 text-center text-[#545f73]">
              <p className="text-sm font-semibold text-[#0b1c30]">موردی پیدا نشد</p>
              <p className="text-xs text-[#545f73] mt-1">«تسلا»، «وام» یا «پزشک» را امتحان کنید.</p>
            </div>
          )}

          {filteredTrackers.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-[#545f73]">خودرو ({filteredTrackers.length})</span>
              {filteredTrackers.map((t) => (
                <div
                  key={t.id}
                  onClick={() => go("/vehicles")}
                  className="p-2.5 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#3525cd] text-[20px]">{t.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-[#0b1c30]">{t.title}</div>
                      <div className="text-[11px] text-[#545f73]">{t.subtitle}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#3525cd]">
                    {t.badgeText}
                  </span>
                </div>
              ))}
            </div>
          )}

          {filteredLoans.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-[#545f73]">وام‌ها ({filteredLoans.length})</span>
              {filteredLoans.map((l) => (
                <div
                  key={l.id}
                  onClick={() => go("/loans")}
                  className="p-2.5 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#3525cd] text-[20px]">{l.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-[#0b1c30]">{l.title}</div>
                      <div className="text-[11px] text-[#545f73]">
                        <span dir="ltr">{l.bank}</span> • ${l.monthlyAmount}/ماه
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#0b1c30]">
                    <span dir="ltr">${l.remainingAmount.toLocaleString()}</span> مانده
                  </span>
                </div>
              ))}
            </div>
          )}

          {filteredTasks.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-[#545f73]">کارها ({filteredTasks.length})</span>
              {filteredTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => go("/tasks")}
                  className="p-2.5 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#3525cd] text-[18px]">
                      {t.done ? "check_circle" : "radio_button_unchecked"}
                    </span>
                    <div>
                      <div
                        className={`text-xs font-bold ${t.done ? "line-through text-[#545f73]" : "text-[#0b1c30]"}`}
                      >
                        {t.title}
                      </div>
                      <div className="text-[11px] text-[#545f73]">{t.dueTime}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-[#545f73]">
                    {t.category}
                  </span>
                </div>
              ))}
            </div>
          )}

          {filteredTimeline.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-[#545f73]">تایم‌لاین ({filteredTimeline.length})</span>
              {filteredTimeline.map((tl) => (
                <div
                  key={tl.id}
                  onClick={() => go("/")}
                  className="p-2.5 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#3525cd] text-[20px]">{tl.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-[#0b1c30]">{tl.title}</div>
                      <div className="text-[11px] text-[#545f73]">{tl.subtitle}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#d5e0f8] text-[#111c2d]">
                    {tl.timeLabel}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
