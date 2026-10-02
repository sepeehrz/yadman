"use client";

import { ASSETS } from "@/lib/mock-data";
import { useLifeHub } from "@/store/LifeHubContext";

export function Header({ title }: { title: string }) {
  const { setSearchOpen, setNotificationsOpen, setProfileOpen } = useLifeHub();

  return (
    <header className="fixed top-0 w-full z-40 pt-safe bg-[#f8f9ff]/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e2e8f0]/40 transition-all">
      <div className="max-w-2xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <img
            alt="آیکون لایف‌هاب"
            className="h-8 w-8 object-contain rounded-lg shadow-xs"
            src={ASSETS.logo}
          />
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-xl sm:text-[22px] text-[#0b1c30] tracking-tight">
              لایف‌هاب
            </span>
            <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-[#e5eeff] text-[#3525cd]">
              {title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="جست‌وجو"
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#545f73] hover:text-[#0b1c30] hover:bg-[#dce9ff]/50 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          <button
            onClick={() => setNotificationsOpen(true)}
            aria-label="مشاهده اعلان‌ها"
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#545f73] hover:text-[#0b1c30] hover:bg-[#dce9ff]/50 active:scale-95 transition-all relative"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#4f46e5] ring-2 ring-[#f8f9ff] animate-pulse" />
          </button>

          <button
            onClick={() => setProfileOpen(true)}
            aria-label="باز کردن پروفایل"
            className="ml-1 p-0.5 rounded-full ring-2 ring-transparent hover:ring-[#4f46e5]/40 focus:ring-[#3525cd] transition-all active:scale-95"
          >
            <img
              alt="پروفایل کاربر"
              className="w-8 h-8 rounded-full object-cover shadow-xs border border-white/60"
              src={ASSETS.avatar}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
