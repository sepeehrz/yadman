"use client";

import { useEffect, useRef, useState } from "react";
import { AppIcon } from "@/components/ui/app-icon";

interface IProps {
  disabled?: boolean;
  onSelect: (minutes: number) => void;
}

const SNOOZE_OPTIONS = [
  { minutes: 10, label: "۱۰ دقیقه دیگر" },
  { minutes: 60, label: "۱ ساعت دیگر" },
  { minutes: 1440, label: "فردا" },
];

export function SnoozeMenu({ disabled = false, onSelect }: IProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    function handlePointerDown(event: MouseEvent): void {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="به تعویق انداختن یادآور"
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#eff4ff] text-[#3525cd] text-[11px] font-bold hover:bg-[#e5eeff] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
      >
        <AppIcon name="notifications_active" className="size-[14px]" />
        <span>تعویق</span>
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="مدت تعویق"
          className="absolute bottom-full mb-1.5 left-0 z-20 w-40 rounded-xl bg-white shadow-lg border border-[#e2e8f0] py-1"
        >
          {SNOOZE_OPTIONS.map((option) => (
            <button
              key={option.minutes}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onSelect(option.minutes);
              }}
              className="w-full text-right px-3 py-2 text-xs font-semibold text-[#0b1c30] hover:bg-[#eff4ff] transition-colors"
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
