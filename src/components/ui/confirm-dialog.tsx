"use client";

import { AppIcon } from "@/components/ui/app-icon";

interface IProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  closeDialog: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "تأیید",
  cancelLabel = "انصراف",
  danger = true,
  closeDialog,
  onConfirm,
}: IProps) {
  return (
    <div className="p-5 sm:p-6 text-center">
      <div
        aria-hidden="true"
        className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
          danger
            ? "bg-[#ffdad6]/60 text-[#ba1a1a]"
            : "bg-[#e2dfff] text-[#3525cd]"
        }`}
      >
        <AppIcon name="warning" className="size-6" />
      </div>

      <h3 className="mt-3 text-base font-bold text-[#0b1c30]">{title}</h3>
      <p className="mt-1.5 text-xs leading-6 font-medium text-[#545f73]">
        {message}
      </p>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={closeDialog}
          className="flex-1 h-11 rounded-xl bg-[#eff4ff] text-[#545f73] font-semibold text-xs hover:bg-[#e5eeff] active:scale-95 transition-all"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          autoFocus
          className={`flex-1 h-11 rounded-xl font-bold text-xs active:scale-95 transition-all ${
            danger
              ? "bg-[#ba1a1a] text-white hover:bg-[#930e0e]"
              : "bg-[#4f46e5] text-white hover:bg-[#3525cd]"
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}
