"use client";

import { useState } from "react";
import { BaseDialog } from "@/components/ui/dialog";
import { ASSETS } from "@/lib/mock-data";
import { useLifeHub } from "@/store/LifeHubContext";
import { AppIcon } from "@/components/ui/app-icon";

export function ProfileModal() {
  const { isProfileOpen, setProfileOpen, showToast } = useLifeHub();
  const [highTrustMode, setHighTrustMode] = useState(true);
  const [autoSyncTelematics, setAutoSyncTelematics] = useState(true);

  const onClose = () => setProfileOpen(false);

  return (
    <BaseDialog
      open={isProfileOpen}
      onClose={onClose}
      title="حساب کاربری"
      size="sm"
    >
      <div className="bg-card rounded-t-[28px] sm:rounded-3xl border border-border overflow-hidden flex flex-col">
        <div className="bg-gradient-to-l from-primary to-chart-4 p-5 text-primary-foreground relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-7 h-7 rounded-full bg-primary-foreground/20 text-primary-foreground flex items-center justify-center hover:bg-primary-foreground/30"
          >
            <AppIcon name="close" className="size-[16px]" />
          </button>
          <div className="flex items-center gap-3 mt-1">
            <img
              src={ASSETS.avatar}
              alt="کاربر"
              className="w-14 h-14 rounded-full border-2 border-primary-foreground/50 object-cover shadow-md"
            />
            <div>
              <h3 className="font-bold text-lg text-primary-foreground">سارا</h3>
              <p className="text-xs text-primary-foreground/80" dir="ltr">
                sepeehrz@gmail.com
              </p>
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-success text-success-foreground">
                اشتراک ویژه لایف‌هاب فعال
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3.5 text-xs">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground block mb-1.5">
              اتصال‌های فعال
            </span>
            <div className="space-y-1.5">
              <div className="p-2.5 rounded-xl bg-primary/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AppIcon name="electric_car" className="text-primary size-[18px]" />
                  <span className="font-semibold text-foreground">
                    تله‌متری تسلا
                  </span>
                </div>
                <span className="text-[11px] font-bold text-success flex items-center gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />{" "}
                  همگام
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-primary/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AppIcon name="account_balance" className="text-primary size-[18px]" />
                  <span className="font-semibold text-foreground">
                    درگاه بانکی
                  </span>
                </div>
                <span className="text-[11px] font-bold text-success flex items-center gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />{" "}
                  زنده
                </span>
              </div>
            </div>
          </div>

          <div className="pt-1 space-y-2">
            <span className="text-[10px] font-bold text-muted-foreground block">
              ترجیحات و حریم خصوصی
            </span>
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-primary/5 transition-colors">
              <div>
                <span className="font-semibold text-foreground block">
                  حالت اعتماد بالا
                </span>
                <span className="text-[11px] text-muted-foreground">
                  راستی‌آزمایی سخت‌گیرانه و بدون حدس
                </span>
              </div>
              <input
                type="checkbox"
                checked={highTrustMode}
                onChange={(e) => {
                  setHighTrustMode(e.target.checked);
                  showToast(
                    e.target.checked
                      ? "حالت اعتماد بالا فعال شد"
                      : "حالت استاندارد تنظیم شد",
                  );
                }}
                className="w-4 h-4 rounded accent-primary cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-primary/5 transition-colors">
              <div>
                <span className="font-semibold text-foreground block">
                  همگام‌سازی خودکار کیلومتر
                </span>
                <span className="text-[11px] text-muted-foreground">
                  بازتنظیم روزانه ردیاب‌ها
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoSyncTelematics}
                onChange={(e) => {
                  setAutoSyncTelematics(e.target.checked);
                  showToast(
                    e.target.checked
                      ? "همگام‌سازی روزانه فعال شد"
                      : "حالت دستی",
                  );
                }}
                className="w-4 h-4 rounded accent-primary cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-border flex flex-col gap-1.5">
            <button
              onClick={() => {
                showToast("پشتیبان داده‌ها خروجی گرفته شد");
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-primary/5 text-primary font-bold text-xs hover:bg-primary/10 transition-colors flex items-center justify-center gap-1.5"
            >
              <AppIcon name="download" className="size-[16px]" />
              <span>خروجی همه داده‌ها (.json)</span>
            </button>
            <button
              onClick={() => {
                showToast("حافظه محلی تازه‌سازی شد");
                onClose();
              }}
              className="w-full py-2 rounded-xl text-muted-foreground font-semibold text-xs hover:bg-primary/5"
            >
              تازه‌سازی حافظه محلی
            </button>
          </div>
        </div>
      </div>
    </BaseDialog>
  );
}
