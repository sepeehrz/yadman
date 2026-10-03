"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { AppIcon } from "@/components/ui/app-icon";

type DialogSize = "sm" | "md" | "lg" | "xl";
type DialogAlign = "center" | "top";

interface IProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: DialogSize;
  align?: DialogAlign;
  children: ReactNode;
}

const SIZE_CLASS: Record<DialogSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

const EXIT_MS = 180;

export function BaseDialog({
  open,
  onClose,
  title,
  description,
  size = "md",
  align = "center",
  children,
}: IProps) {
  const [shouldRender, setShouldRender] = useState(open);
  const [visible, setVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      return () => cancelAnimationFrame(frame);
    }

    setVisible(false);
    const timer = window.setTimeout(() => setShouldRender(false), EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!shouldRender) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [shouldRender, onClose]);

  if (!shouldRender || typeof document === "undefined") {
    return null;
  }

  const alignClass =
    align === "top"
      ? "items-start justify-center p-4 pt-16 sm:pt-20"
      : "items-end justify-center p-0 sm:items-center sm:p-4";

  return createPortal(
    <div className={`fixed inset-0 z-50 flex ${alignClass}`}>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 bg-[#0b1c30]/50 backdrop-blur-sm transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className={`relative z-10 w-full ${SIZE_CLASS[size]} bg-white rounded-t-[28px] sm:rounded-3xl shadow-2xl max-h-[88vh] overflow-y-auto no-scrollbar outline-none transition-all duration-200 ${
          visible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-6 sm:translate-y-3 sm:scale-[0.98]"
        }`}
      >
        {title ? (
          <span id={titleId} className="sr-only">
            {title}
          </span>
        ) : (
          <span className="sr-only">گفتگو</span>
        )}
        {description ? (
          <span id={descriptionId} className="sr-only">
            {description}
          </span>
        ) : null}

        {children}
      </div>
    </div>,
    document.body,
  );
}

interface IHeaderProps {
  title: string;
  onClose: () => void;
}

export function DialogHeader({ title, onClose }: IHeaderProps) {
  return (
    <div>
      <div className="w-full flex justify-center pt-2" aria-hidden="true">
        <div className="w-12 h-1.5 rounded-full bg-[#c7c4d8]/70" />
      </div>
      <div className="flex items-center justify-between px-5 sm:px-6 py-3 border-b border-[#e2e8f0]">
        <h3 className="text-base font-bold text-[#0b1c30]">{title}</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="بستن گفتگو"
          className="w-8 h-8 rounded-full bg-[#eff4ff] text-[#545f73] flex items-center justify-center hover:bg-[#e5eeff] focus-visible:outline-2 focus-visible:outline-[#4f46e5] active:scale-95 transition-all"
        >
          <AppIcon name="close" className="size-[18px]" />
        </button>
      </div>
    </div>
  );
}
