"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

const MENU_WIDTH = 176;
const MENU_ITEM_HEIGHT = 40;
const VIEWPORT_MARGIN = 8;
const MENU_GAP = 8;

interface MenuPosition {
  top: number;
  left: number;
}

export function SnoozeMenu({ disabled = false, onSelect }: IProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  /**
   * منو داخل کارت یادآور رندر می‌شود و کارت `overflow-hidden` دارد، پس منو
   * بریده می‌شد. آن را در پورتال با موقعیت fixed نسبت به جای واقعی دکمه
   * در viewport می‌گذاریم تا همیشه کامل دیده شود.
   */
  useEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }
    const trigger = triggerRef.current;
    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();
    const menuHeight = SNOOZE_OPTIONS.length * MENU_ITEM_HEIGHT + 8;
    const hasRoomAbove = rect.top >= menuHeight + MENU_GAP + VIEWPORT_MARGIN;

    setPosition({
      top: hasRoomAbove
        ? rect.top - menuHeight - MENU_GAP
        : rect.bottom + MENU_GAP,
      left: Math.min(
        Math.max(VIEWPORT_MARGIN, rect.left),
        window.innerWidth - MENU_WIDTH - VIEWPORT_MARGIN,
      ),
    });
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent): void {
      const target = event.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    function handleViewportChange(): void {
      setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [open]);

  const menu =
    open && position && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-label="مدت تعویق"
            style={{ top: position.top, left: position.left }}
            className="fixed z-[70] w-44 rounded-xl bg-card shadow-[0_12px_28px_-6px_var(--shadow-color)]/30 border border-border py-1"
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
                className="w-full h-10 text-right px-3 text-xs font-semibold text-foreground hover:bg-primary/5 transition-colors"
              >
                {option.label}
              </button>
            ))}
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="به تعویق انداختن یادآور"
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary/5 text-primary text-[11px] font-bold hover:bg-primary/10 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
      >
        <AppIcon name="notifications_active" className="size-[14px]" />
        <span>تعویق</span>
      </button>
      {menu}
    </>
  );
}