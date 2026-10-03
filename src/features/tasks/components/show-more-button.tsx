"use client";

import { AppIcon } from "@/components/ui/app-icon";
import { faNum } from "@/lib/format";

interface IProps {
  remaining: number;
  onClick: () => void;
}

export function ShowMoreButton({ remaining, onClick }: IProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full h-11 rounded-xl bg-white border border-[#e2e8f0]/80 text-xs font-bold text-[#3525cd] hover:bg-[#eff4ff] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
    >
      <AppIcon name="expand_more" className="size-[18px]" />
      <span>نمایش بیشتر ({faNum(remaining)} مورد دیگر)</span>
    </button>
  );
}
