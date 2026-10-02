"use client";

import { useLifeHub } from "@/store/LifeHubContext";

export function Toast() {
  const {
    toast: { message, icon, type },
  } = useLifeHub();

  if (!message) return null;

  const iconColor =
    type === "success" ? "text-[#4edea3]" : type === "warning" ? "text-amber-400" : "text-[#dad7ff]";

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300">
      <div className="px-4 py-2.5 rounded-full bg-[#213145]/95 text-white text-xs sm:text-sm font-semibold shadow-xl backdrop-blur-md flex items-center gap-2 border border-white/10 max-w-sm">
        <span className={`material-symbols-outlined text-[18px] ${iconColor}`}>{icon}</span>
        <span className="truncate">{message}</span>
      </div>
    </div>
  );
}
