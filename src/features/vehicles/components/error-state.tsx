"use client";
import { AppIcon } from "@/components/ui/app-icon";

interface IProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: IProps) {
  return (
    <div className="rounded-2xl bg-[#ffdad6]/30 p-6 border border-[#ba1a1a]/20 text-center">
      <AppIcon name="error" className="size-[28px] text-[#ba1a1a]" />
      <p className="text-sm font-bold text-[#0b1c30] mt-1">{message}</p>
      <button
        onClick={onRetry}
        className="mt-3 px-4 py-2 rounded-xl bg-white text-xs font-bold text-[#3525cd] border border-[#e2e8f0] hover:bg-[#eff4ff] transition-colors"
      >
        تلاش مجدد
      </button>
    </div>
  );
}
