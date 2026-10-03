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
      <div className="bg-white rounded-t-[28px] sm:rounded-3xl border border-[#e2e8f0] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-l from-[#213145] to-[#4f46e5] p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30"
          >
            <AppIcon name="close" className="size-[16px]" />
          </button>
          <div className="flex items-center gap-3 mt-1">
            <img
              src={ASSETS.avatar}
              alt="کاربر"
              className="w-14 h-14 rounded-full border-2 border-white object-cover shadow-md"
            />
            <div>
              <h3 className="font-bold text-lg text-white">سارا</h3>
              <p className="text-xs text-[#dad7ff]" dir="ltr">
                sepeehrz@gmail.com
              </p>
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#6ffbbe] text-[#002113]">
                اشتراک ویژه لایف‌هاب فعال
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3.5 text-xs">
          <div>
            <span className="text-[10px] font-bold text-[#545f73] block mb-1.5">
              اتصال‌های فعال
            </span>
            <div className="space-y-1.5">
              <div className="p-2.5 rounded-xl bg-[#eff4ff] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AppIcon name="electric_car" className="text-[#3525cd] size-[18px]" />
                  <span className="font-semibold text-[#0b1c30]">
                    تله‌متری تسلا
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#006e4b] flex items-center gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006e4b]" />{" "}
                  همگام
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#eff4ff] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AppIcon name="account_balance" className="text-[#3525cd] size-[18px]" />
                  <span className="font-semibold text-[#0b1c30]">
                    درگاه بانکی
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#006e4b] flex items-center gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006e4b]" />{" "}
                  زنده
                </span>
              </div>
            </div>
          </div>

          <div className="pt-1 space-y-2">
            <span className="text-[10px] font-bold text-[#545f73] block">
              ترجیحات و حریم خصوصی
            </span>
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-[#eff4ff] transition-colors">
              <div>
                <span className="font-semibold text-[#0b1c30] block">
                  حالت اعتماد بالا
                </span>
                <span className="text-[11px] text-[#545f73]">
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
                className="w-4 h-4 rounded accent-[#4f46e5] cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-[#eff4ff] transition-colors">
              <div>
                <span className="font-semibold text-[#0b1c30] block">
                  همگام‌سازی خودکار کیلومتر
                </span>
                <span className="text-[11px] text-[#545f73]">
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
                className="w-4 h-4 rounded accent-[#4f46e5] cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-[#e2e8f0] flex flex-col gap-1.5">
            <button
              onClick={() => {
                showToast("پشتیبان داده‌ها خروجی گرفته شد");
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-[#eff4ff] text-[#3525cd] font-bold text-xs hover:bg-[#e5eeff] transition-colors flex items-center justify-center gap-1.5"
            >
              <AppIcon name="download" className="size-[16px]" />
              <span>خروجی همه داده‌ها (.json)</span>
            </button>
            <button
              onClick={() => {
                showToast("حافظه محلی تازه‌سازی شد");
                onClose();
              }}
              className="w-full py-2 rounded-xl text-[#545f73] font-semibold text-xs hover:bg-[#eff4ff]"
            >
              تازه‌سازی حافظه محلی
            </button>
          </div>
        </div>
      </div>
    </BaseDialog>
  );
}
