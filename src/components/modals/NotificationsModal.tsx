"use client";

import { useRouter } from "next/navigation";
import { BaseDialog } from "@/components/ui/dialog";
import { useLifeHub } from "@/store/LifeHubContext";
import { AppIcon } from "@/components/ui/app-icon";

export function NotificationsModal() {
  const { isNotificationsOpen, setNotificationsOpen, showToast } = useLifeHub();
  const router = useRouter();

  const onClose = () => setNotificationsOpen(false);
  const go = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <BaseDialog
      open={isNotificationsOpen}
      onClose={onClose}
      title="اعلان‌ها و هشدارها"
      align="top"
    >
      <div className="bg-white rounded-t-[28px] sm:rounded-2xl border border-[#e2e8f0] overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-4 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8f9ff]">
          <div className="flex items-center gap-2">
            <AppIcon name="notifications" className="text-[#4f46e5] size-[22px]" />
            <h3 className="font-bold text-base text-[#0b1c30]">
              اعلان‌ها و هشدارها
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#e5eeff] text-[#545f73] flex items-center justify-center hover:bg-[#dce9ff]"
          >
            <AppIcon name="close" className="size-[16px]" />
          </button>
        </div>

        <div className="p-3 overflow-y-auto space-y-2.5">
          <div
            onClick={() => go("/vehicles")}
            className="p-3 rounded-xl bg-[#ffdad6]/40 hover:bg-[#ffdad6]/70 border-r-4 border-[#ba1a1a] cursor-pointer transition-all"
          >
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold text-[#ba1a1a]">
                سرویس فوری خودرو
              </span>
              <span className="text-[10px] text-[#545f73]">۱۰ دقیقه پیش</span>
            </div>
            <h4 className="text-xs font-bold text-[#0b1c30] mt-0.5">
              تسلا مدل ۳: بررسی ترمز
            </h4>
            <p className="text-[11px] text-[#464555] mt-0.5">
              بررسی سیستم ترمز تا ۲۸۰ کیلومتر آینده لازم است.
            </p>
          </div>

          <div
            onClick={() => go("/loans")}
            className="p-3 rounded-xl bg-amber-50 hover:bg-amber-100/70 border-r-4 border-amber-500 cursor-pointer transition-all"
          >
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold text-amber-800">
                سررسید قسط
              </span>
              <span className="text-[10px] text-[#545f73]">۲ ساعت پیش</span>
            </div>
            <h4 className="text-xs font-bold text-[#0b1c30] mt-0.5">
              وام مسکن: <span dir="ltr">$1,420.00</span>
            </h4>
            <p className="text-[11px] text-[#464555] mt-0.5">
              پرداخت خودکار تا ۳ روز دیگر (۵ آبان).
            </p>
          </div>

          <div
            onClick={() => go("/tasks")}
            className="p-3 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] border-r-4 border-[#4f46e5] cursor-pointer transition-all"
          >
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold text-[#3525cd]">
                یادآور کار
              </span>
              <span className="text-[10px] text-[#545f73]">امروز ۱۴:۰۰</span>
            </div>
            <h4 className="text-xs font-bold text-[#0b1c30] mt-0.5">
              ثبت ادعای بیمه درمانی
            </h4>
            <p className="text-[11px] text-[#464555] mt-0.5">
              مدارک بازپرداخت امروز موعد دارد.
            </p>
          </div>

          <div
            onClick={() => go("/tasks")}
            className="p-3 rounded-xl bg-[#6ffbbe]/15 hover:bg-[#6ffbbe]/25 border-r-4 border-[#006e4b] cursor-pointer transition-all"
          >
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold text-[#006e4b]">
                تقویم همگام شد
              </span>
              <span className="text-[10px] text-[#545f73]">دیروز</span>
            </div>
            <h4 className="text-xs font-bold text-[#0b1c30] mt-0.5">
              معاینه سالانه دندان تأیید شد
            </h4>
            <p className="text-[11px] text-[#464555] mt-0.5">
              نوبت ۱۴ آبان قطعی شد.
            </p>
          </div>
        </div>

        <div className="p-3 border-t border-[#e2e8f0] bg-[#f8f9ff] flex items-center justify-between">
          <span className="text-[11px] text-[#545f73]">
            همه سیستم‌ها پایدارند
          </span>
          <button
            onClick={() => {
              showToast("همه اعلان‌ها خوانده شد");
              onClose();
            }}
            className="text-xs font-bold text-[#4f46e5] hover:underline"
          >
            علامت‌گذاری همه به‌عنوان خوانده‌شده
          </button>
        </div>
      </div>
    </BaseDialog>
  );
}
