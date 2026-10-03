"use client";

import { useState } from "react";
import { AppIcon } from "@/components/ui/app-icon";
import {
  parseCreateChecklistItemPayload,
} from "../validations/checklist-schema";

interface IProps {
  disabled?: boolean;
  onAdd: (text: string) => void;
}

export function ChecklistAddItemForm({ disabled = false, onAdd }: IProps) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent): void {
    event.preventDefault();
    const parsed = parseCreateChecklistItemPayload({ text });
    if (!parsed.ok) {
      setError(parsed.errors.text ?? "متن قلم معتبر نیست");
      return;
    }
    setError(null);
    onAdd(parsed.data.text);
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} className="pt-2 mt-1 border-t border-[#f1f5f9]">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            if (error) {
              setError(null);
            }
          }}
          placeholder="قلم جدید به چک‌لیست..."
          aria-label="افزودن قلم جدید"
          className="flex-1 h-11 bg-[#eff4ff] text-[#0b1c30] rounded-xl px-3.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/40"
        />
        <button
          type="submit"
          disabled={disabled}
          className="h-11 px-4 rounded-xl bg-[#4f46e5] text-white text-xs font-bold hover:bg-[#3525cd] active:scale-95 transition-all disabled:opacity-60 flex items-center gap-1"
        >
          <AppIcon name="add" className="size-[15px]" />
          <span>افزودن</span>
        </button>
      </div>
      {error ? (
        <p className="text-[11px] text-[#ba1a1a] font-semibold mt-1">{error}</p>
      ) : null}
    </form>
  );
}
