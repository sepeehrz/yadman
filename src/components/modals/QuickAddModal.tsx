"use client";

import { useState } from "react";
import { BaseDialog } from "@/components/ui/dialog";
import { useLifeHub } from "@/store/LifeHubContext";
import { AppIcon } from "@/components/ui/app-icon";
import { TrackerQuickForm } from "./quick-add/tracker-quick-form";
import { LoanQuickForm } from "./quick-add/loan-quick-form";
import { ReminderQuickForm } from "./quick-add/reminder-quick-form";
import { ChecklistQuickForm } from "./quick-add/checklist-quick-form";

type QuickCategory = "vehicle" | "loan" | "task" | "checklist";

const CATEGORY_BUTTONS: { id: QuickCategory; icon: string; label: string }[] = [
  { id: "vehicle", icon: "directions_car", label: "خودرو" },
  { id: "loan", icon: "credit_card", label: "وام/قبض" },
  { id: "task", icon: "alarm", label: "کار" },
  { id: "checklist", icon: "checklist", label: "چک‌لیست" },
];

export function QuickAddModal() {
  const { isQuickAddOpen, setQuickAddOpen } = useLifeHub();
  const [category, setCategory] = useState<QuickCategory>("vehicle");

  const onClose = () => setQuickAddOpen(false);

  return (
    <BaseDialog
      open={isQuickAddOpen}
      onClose={onClose}
      title="ایجاد سریع"
      size="lg"
    >
      <div className="bg-card rounded-t-[32px] sm:rounded-[28px] flex flex-col max-h-[88vh] overflow-hidden">
        <div className="px-5 sm:px-6 pt-1 pb-3 flex items-center justify-between border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary">
              <AppIcon name="add_task" className="size-[19px]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              ایجاد سریع
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="بستن"
            className="w-9 h-9 rounded-full bg-primary/10 text-muted-foreground flex items-center justify-center hover:bg-primary/10 active:scale-95 transition-all"
          >
            <AppIcon name="close" className="size-[20px]" />
          </button>
        </div>

        <div className="px-5 sm:px-6 py-4 overflow-y-auto space-y-4 no-scrollbar">
          <div>
            <span className="block text-[11px] font-bold text-muted-foreground mb-2">
              انتخاب دسته
            </span>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORY_BUTTONS.map((button) => (
                <button
                  key={button.id}
                  type="button"
                  onClick={() => setCategory(button.id)}
                  className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl transition-all ${
                    category === button.id
                      ? "bg-primary text-primary-foreground shadow-[0_8px_20px_var(--primary)]/30 ring-2 ring-primary/20 scale-[1.02]"
                      : "bg-primary/5 text-muted-foreground hover:bg-primary/10"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                      category === button.id ? "bg-card/20" : "bg-primary/10"
                    }`}
                  >
                    <AppIcon name={button.icon} className="size-[19px]" />
                  </div>
                  <span className="text-xs font-bold text-center leading-tight">
                    {button.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {category === "vehicle" && <TrackerQuickForm onDone={onClose} />}
          {category === "loan" && <LoanQuickForm onDone={onClose} />}
          {category === "task" && <ReminderQuickForm onDone={onClose} />}
          {category === "checklist" && <ChecklistQuickForm onDone={onClose} />}
        </div>
      </div>
    </BaseDialog>
  );
}
