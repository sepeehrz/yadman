"use client";

import { useEffect, useState } from "react";
import { BaseDialog } from "@/components/ui/dialog";
import { AppIcon } from "@/components/ui/app-icon";
import type { CreateChecklistInput } from "../types";
import {
  parseChecklistForm,
  parseCreateChecklistItemPayload,
} from "../validations/checklist-schema";
import type { FieldErrors } from "../validations/shared-schema";

interface IProps {
  open: boolean;
  pending: boolean;
  onClose: () => void;
  onSubmit: (input: CreateChecklistInput) => void;
}

const inputClass =
  "w-full h-12 bg-primary/5 text-foreground rounded-xl px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }
  return <p className="text-[11px] text-destructive font-semibold">{message}</p>;
}

export function ChecklistFormDialog({
  open,
  pending,
  onClose,
  onSubmit,
}: IProps) {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const [itemDraft, setItemDraft] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (open) {
      setTitle("");
      setItems([]);
      setItemDraft("");
      setErrors({});
    }
  }, [open]);

  function addItem(): void {
    const parsed = parseCreateChecklistItemPayload({ text: itemDraft });
    if (!parsed.ok) {
      setErrors(parsed.errors);
      return;
    }
    setItems((prev) => [...prev, parsed.data.text]);
    setItemDraft("");
    setErrors({});
  }

  function removeItem(index: number): void {
    setItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  }

  function handleSubmit(event: React.FormEvent): void {
    event.preventDefault();
    // پیش‌نویس تایپ‌شده اما اضافه‌نشده هم بخشی از چک‌لیست در نظر گرفته می‌شود
    const draftItems = itemDraft.trim() ? [...items, itemDraft.trim()] : items;
    const parsed = parseChecklistForm({ title, items: draftItems });
    if (!parsed.ok) {
      setErrors(parsed.errors);
      return;
    }
    setErrors({});
    onSubmit({ title: parsed.data.title, items: parsed.data.items });
  }

  return (
    <BaseDialog open={open} onClose={onClose} title="چک‌لیست جدید" size="lg">
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h3 className="text-base font-bold text-foreground">چک‌لیست جدید</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="w-8 h-8 rounded-full bg-primary/5 text-muted-foreground flex items-center justify-center hover:bg-primary/10"
          >
            <AppIcon name="close" className="size-[18px]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 pt-4">
          <div className="space-y-1">
            <label
              className="text-xs font-bold text-muted-foreground"
              htmlFor="checklist-title"
            >
              نام چک‌لیست
            </label>
            <input
              id="checklist-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="مثلاً وسایل سفر، خرید هفتگی"
              className={inputClass}
            />
            <FieldError message={errors.title} />
          </div>

          <div className="space-y-1">
            <label
              className="text-xs font-bold text-muted-foreground"
              htmlFor="checklist-item-draft"
            >
              آیتم‌های قابل بررسی
            </label>
            <div className="flex items-center gap-2">
              <input
                id="checklist-item-draft"
                value={itemDraft}
                onChange={(event) => setItemDraft(event.target.value)}
                placeholder="مثلاً شارژر، پاسپورت"
                className="flex-1 h-12 bg-primary/5 text-foreground rounded-xl px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
              />
              <button
                type="button"
                onClick={addItem}
                aria-label="افزودن آیتم به فهرست"
                className="h-12 px-4 rounded-xl bg-primary/5 text-primary text-xs font-bold hover:bg-primary/10 active:scale-95 transition-all flex items-center gap-1"
              >
                <AppIcon name="add" className="size-[16px]" />
                <span>افزودن</span>
              </button>
            </div>
            <FieldError message={errors.items ?? errors._form} />
          </div>

          {items.length > 0 ? (
            <ul className="space-y-1.5">
              {items.map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-card border border-border/70"
                >
                  <AppIcon
                    name="radio_button_unchecked"
                    className="size-[16px] text-muted-foreground/60"
                  />
                  <span className="flex-1 text-xs font-medium text-foreground">
                    {item}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    aria-label={`حذف آیتم ${item}`}
                    className="w-7 h-7 rounded-lg bg-destructive/50 text-destructive flex items-center justify-center hover:bg-destructive/15 transition-colors"
                  >
                    <AppIcon name="close" className="size-[14px]" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl bg-primary/5 text-muted-foreground font-semibold text-xs hover:bg-primary/10"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary active:scale-95 transition-all disabled:opacity-60"
            >
              {pending ? "در حال ذخیره..." : "ساخت چک‌لیست"}
            </button>
          </div>
        </form>
      </div>
    </BaseDialog>
  );
}
