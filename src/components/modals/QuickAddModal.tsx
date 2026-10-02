"use client";

import { useState } from "react";
import { useLifeHub } from "@/store/LifeHubContext";
import { faNum } from "@/lib/format";
import type { LoanItem, TaskReminder, VehicleTracker } from "@/lib/types";

type QuickCategory = "vehicle" | "loan" | "task" | "checklist";

export function QuickAddModal() {
  const {
    isQuickAddOpen,
    setQuickAddOpen,
    addVehicleTracker,
    addLoan,
    addTask,
    addChecklistItem,
    checklists,
    odometerKm,
  } = useLifeHub();

  const [category, setCategory] = useState<QuickCategory>("vehicle");

  const [vehicleName, setVehicleName] = useState("تسلا مدل ۳");
  const [serviceName, setServiceName] = useState("تعویض لنت ترمز");
  const [intervalKm, setIntervalKm] = useState("5,000");
  const [intervalMo, setIntervalMo] = useState("6");
  const [nextDueDate, setNextDueDate] = useState("2024-11-18");
  const [nextDueKm, setNextDueKm] = useState((odometerKm + 5000).toLocaleString("en-US"));
  const [estCost, setEstCost] = useState("240.00");
  const [receiptAttached, setReceiptAttached] = useState(false);

  const [loanTitle, setLoanTitle] = useState("");
  const [loanBank, setLoanBank] = useState("");
  const [loanMonthly, setLoanMonthly] = useState("");
  const [loanTotal, setLoanTotal] = useState("");
  const [loanDueDay, setLoanDueDay] = useState("15");
  const [loanCategory, setLoanCategory] = useState<LoanItem["category"]>("personal");
  const [loanAutoPay, setLoanAutoPay] = useState(true);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskCategory, setTaskCategory] = useState<TaskReminder["category"]>("work");
  const [taskPriority, setTaskPriority] = useState<"high" | "normal">("normal");
  const [taskDateCategory, setTaskDateCategory] =
    useState<TaskReminder["dueDateCategory"]>("today");
  const [taskTime, setTaskTime] = useState("۱۵:۰۰");
  const [taskLocation, setTaskLocation] = useState("");

  const [selectedPackId, setSelectedPackId] = useState(checklists[0]?.id || "camping-pack");
  const [checklistItemText, setChecklistItemText] = useState("");

  if (!isQuickAddOpen) return null;
  const onClose = () => setQuickAddOpen(false);

  const handleVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim()) return;

    const parsedInterval = parseInt(intervalKm.replace(/,/g, ""), 10) || 5000;
    const parsedTargetKm =
      parseInt(nextDueKm.replace(/,/g, ""), 10) || odometerKm + parsedInterval;

    const newTracker: VehicleTracker = {
      id: `vt-${Date.now()}`,
      title: serviceName,
      subtitle: `${vehicleName} • سرویس هر ${intervalKm} کیلومتر`,
      category: "due-soon",
      badgeText: `${faNum(parsedTargetKm - odometerKm)} کیلومتر تا موعد`,
      badgeType: "primary",
      icon: serviceName.includes("روغن")
        ? "oil_barrel"
        : serviceName.includes("تایر")
          ? "tire_repair"
          : serviceName.includes("بیمه")
            ? "security"
            : "disc_full",
      currentKm: odometerKm,
      targetKm: parsedTargetKm,
      intervalKm: parsedInterval,
      percentage: Math.min(
        100,
        Math.round(((odometerKm % parsedInterval) / parsedInterval) * 100),
      ),
      timeElapsedMonths: 1,
      timeTotalMonths: parseInt(intervalMo, 10) || 6,
      targetDate: nextDueDate,
      extraDetail: `آستانه: ${faNum(parsedTargetKm)} کیلومتر`,
    };

    addVehicleTracker(newTracker);
    onClose();
  };

  const handleLoanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loanTitle.trim() || !loanMonthly) return;

    const monthly = parseFloat(loanMonthly) || 100;
    const total = parseFloat(loanTotal) || monthly * 12;

    const newLoan: LoanItem = {
      id: `loan-${Date.now()}`,
      title: loanTitle,
      bank: loanBank || "بانک",
      icon:
        loanCategory === "mortgage"
          ? "home"
          : loanCategory === "auto"
            ? "directions_car"
            : "credit_card",
      dueNotice: `موعد روز ${faNum(parseInt(loanDueDay, 10) || 15)}`,
      dueDate: `روز ${faNum(parseInt(loanDueDay, 10) || 15)}`,
      monthlyAmount: monthly,
      remainingAmount: total,
      totalAmount: total * 1.5,
      paidInstallments: 0,
      totalInstallments: Math.round(total / monthly),
      progressPercent: 0,
      linkedAccount: "حساب اصلی •••• 4821",
      autoPay: loanAutoPay,
      category: loanCategory,
      paidThisCycle: false,
    };

    addLoan(newLoan);
    onClose();
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const dateLabel =
      taskDateCategory === "today" ? "امروز" : taskDateCategory === "tomorrow" ? "فردا" : "";
    const newTask: TaskReminder = {
      id: `task-${Date.now()}`,
      title: taskTitle,
      dueTime: `${taskTime} ${dateLabel}`.trim(),
      dueDateCategory: taskDateCategory,
      priority: taskPriority,
      category: taskCategory,
      location: taskLocation || undefined,
      done: false,
    };

    addTask(newTask);
    onClose();
  };

  const handleChecklistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checklistItemText.trim()) return;
    addChecklistItem(selectedPackId, checklistItemText.trim());
    setChecklistItemText("");
    onClose();
  };

  const catBtn = (id: QuickCategory, icon: string, label: string) => (
    <button
      key={id}
      type="button"
      onClick={() => setCategory(id)}
      className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl transition-all ${
        category === id
          ? "bg-[#4f46e5] text-white shadow-[0_8px_20px_rgba(79,70,229,0.30)] ring-2 ring-[#4f46e5]/20 scale-[1.02]"
          : "bg-[#eff4ff] text-[#464555] hover:bg-[#e5eeff]"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
          category === id ? "bg-white/20" : "bg-[#e5eeff]"
        }`}
      >
        <span className="material-symbols-outlined text-[19px]">{icon}</span>
      </div>
      <span className="text-xs font-bold text-center leading-tight">{label}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="fixed inset-0 bg-[#0b1c30]/50 backdrop-blur-[3px]" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-[28px] shadow-[0_-12px_40px_rgba(11,28,48,0.2)] flex flex-col max-h-[90vh] overflow-hidden">
        <div className="w-full flex justify-center py-2 cursor-grab">
          <div className="w-12 h-1.5 rounded-full bg-[#c7c4d8]/70" />
        </div>

        <div className="px-5 sm:px-6 pt-1 pb-3 flex items-center justify-between border-b border-[#e2e8f0]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#e2dfff] flex items-center justify-center text-[#3525cd]">
              <span className="material-symbols-outlined text-[19px]">add_task</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0b1c30] tracking-tight">
              ایجاد سریع
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="بستن"
            className="w-9 h-9 rounded-full bg-[#e5eeff] text-[#545f73] flex items-center justify-center hover:bg-[#dce9ff] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="px-5 sm:px-6 py-4 overflow-y-auto space-y-4 no-scrollbar">
          <div>
            <label className="block text-[11px] font-bold text-[#545f73] mb-2">
              انتخاب دسته یادآور
            </label>
            <div className="grid grid-cols-4 gap-2">
              {catBtn("vehicle", "directions_car", "خودرو")}
              {catBtn("loan", "credit_card", "وام/قبض")}
              {catBtn("task", "alarm", "کار")}
              {catBtn("checklist", "checklist", "چک‌لیست")}
            </div>
          </div>

          {category === "vehicle" && (
            <form onSubmit={handleVehicleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#545f73]">خودرو</label>
                <div className="h-12 bg-[#eff4ff] rounded-xl px-3 flex items-center justify-between text-[#0b1c30]">
                  <div className="flex items-center gap-2 truncate">
                    <span className="material-symbols-outlined text-[#3525cd] text-[20px]">
                      electric_car
                    </span>
                    <span className="text-sm font-bold truncate">
                      {vehicleName}{" "}
                      <span className="font-normal text-[#545f73] text-xs">
                        ({faNum(odometerKm)} کیلومتر)
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#545f73]">نام سرویس / قطعه</label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="مثلاً لنت ترمز، روغن، جابه‌جایی تایر"
                  className="w-full h-12 bg-[#eff4ff] text-[#0b1c30] rounded-xl px-3.5 text-sm focus:outline-none focus:bg-[#e5eeff] focus:ring-2 focus:ring-[#4f46e5]/40 transition-all font-medium"
                  required
                />
                <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
                  <span className="text-[11px] font-semibold text-[#545f73] whitespace-nowrap">
                    سریع:
                  </span>
                  {["روغن موتور", "لنت ترمز", "جابه‌جایی تایر", "تمدید بیمه"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setServiceName(tag)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                        serviceName === tag
                          ? "bg-[#e2dfff] text-[#0f0069] font-bold"
                          : "bg-[#e5eeff] text-[#464555] hover:bg-[#dce9ff]"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#545f73]">دوره تناوب</label>
                  <span className="text-[11px] font-bold text-[#4f46e5]">هرکدام زودتر برسد</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-12 bg-[#eff4ff] rounded-xl px-3 flex items-center gap-1.5">
                    <span className="text-xs text-[#545f73] font-medium">هر</span>
                    <input
                      type="text"
                      value={intervalKm}
                      onChange={(e) => setIntervalKm(e.target.value)}
                      className="w-full bg-transparent text-[#0b1c30] font-bold text-sm text-left focus:outline-none"
                    />
                    <span className="text-xs font-bold text-[#545f73]">کیلومتر</span>
                  </div>
                  <div className="h-12 bg-[#eff4ff] rounded-xl px-3 flex items-center gap-1.5">
                    <span className="text-xs text-[#545f73] font-medium">هر</span>
                    <input
                      type="text"
                      value={intervalMo}
                      onChange={(e) => setIntervalMo(e.target.value)}
                      className="w-full bg-transparent text-[#0b1c30] font-bold text-sm text-left focus:outline-none"
                    />
                    <span className="text-xs font-bold text-[#545f73]">ماه</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#545f73]">آستانه موعد بعدی</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-12 bg-[#eff4ff] rounded-xl px-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#545f73]">
                        calendar_today
                      </span>
                      <input
                        type="date"
                        value={nextDueDate}
                        onChange={(e) => setNextDueDate(e.target.value)}
                        className="bg-transparent text-xs font-bold text-[#0b1c30] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="h-12 bg-[#eff4ff] rounded-xl px-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-[#545f73]">speed</span>
                      <input
                        type="text"
                        value={nextDueKm}
                        onChange={(e) => setNextDueKm(e.target.value)}
                        className="w-20 bg-transparent text-xs font-bold text-[#0b1c30] focus:outline-none"
                      />
                    </div>
                    <span className="text-xs font-bold text-[#545f73]">کیلومتر</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#545f73]">هزینه تقریبی ($)</label>
                  <div className="h-12 bg-[#eff4ff] rounded-xl px-3 flex items-center gap-1">
                    <span className="text-sm font-bold text-[#545f73]">$</span>
                    <input
                      type="text"
                      value={estCost}
                      onChange={(e) => setEstCost(e.target.value)}
                      placeholder="240.00"
                      className="w-full bg-transparent text-sm font-semibold text-[#0b1c30] focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#545f73]">فاکتور / مدرک</label>
                  <button
                    type="button"
                    onClick={() => setReceiptAttached(!receiptAttached)}
                    className={`w-full h-12 rounded-xl px-2.5 flex items-center justify-center gap-1.5 transition-all text-xs font-semibold ${
                      receiptAttached
                        ? "bg-[#4edea3]/20 text-[#005338] border border-[#4edea3]/50"
                        : "bg-[#eff4ff] hover:bg-[#e5eeff] text-[#464555]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[19px] text-[#4f46e5]">
                      {receiptAttached ? "task_alt" : "add_a_photo"}
                    </span>
                    <span className="truncate">
                      {receiptAttached ? "فاکتور پیوست شد" : "افزودن فاکتور"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#eff4ff] flex items-start gap-2.5 border border-[#dce9ff]">
                <div className="w-6 h-6 rounded-full bg-[#6ffbbe] text-[#002113] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-[#0b1c30] block">همگام‌سازی هوشمند چرخه</span>
                  <p className="text-[11px] text-[#545f73] leading-snug">
                    لایف‌هاب ۵۰۰ کیلومتر قبل از آستانه هشدار می‌دهد و سوابق را با لاگ خودرو همگام می‌کند.
                  </p>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-[#4f46e5] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#3525cd] active:scale-[0.98] transition-all"
                >
                  <span>ساخت یادآور سرویس</span>
                  <span className="material-symbols-outlined text-[18px] ltr-flip">arrow_forward</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full h-10 rounded-xl text-[#545f73] font-semibold text-xs hover:bg-[#eff4ff]"
                >
                  انصراف
                </button>
              </div>
            </form>
          )}

          {category === "loan" && (
            <form onSubmit={handleLoanSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#545f73]">عنوان وام / بدهی</label>
                <input
                  type="text"
                  value={loanTitle}
                  onChange={(e) => setLoanTitle(e.target.value)}
                  placeholder="مثلاً وام بازسازی خانه، وام دانشجویی"
                  className="w-full h-12 bg-[#eff4ff] text-[#0b1c30] rounded-xl px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/40 font-medium"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#545f73]">بانک / مؤسسه</label>
                  <input
                    type="text"
                    value={loanBank}
                    onChange={(e) => setLoanBank(e.target.value)}
                    placeholder="مثلاً Chase"
                    className="w-full h-12 bg-[#eff4ff] text-[#0b1c30] rounded-xl px-3 text-sm focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#545f73]">دسته</label>
                  <select
                    value={loanCategory}
                    onChange={(e) => setLoanCategory(e.target.value as LoanItem["category"])}
                    className="w-full h-12 bg-[#eff4ff] text-[#0b1c30] rounded-xl px-3 text-sm focus:outline-none"
                  >
                    <option value="mortgage">مسکن</option>
                    <option value="auto">خودرو</option>
                    <option value="hardware">کالا / دستگاه</option>
                    <option value="personal">شخصی / سایر</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#545f73]">پرداخت ماهانه ($)</label>
                  <input
                    type="number"
                    value={loanMonthly}
                    onChange={(e) => setLoanMonthly(e.target.value)}
                    placeholder="450.00"
                    className="w-full h-12 bg-[#eff4ff] text-[#0b1c30] rounded-xl px-3 text-sm font-bold focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#545f73]">مانده کل ($)</label>
                  <input
                    type="number"
                    value={loanTotal}
                    onChange={(e) => setLoanTotal(e.target.value)}
                    placeholder="12,000.00"
                    className="w-full h-12 bg-[#eff4ff] text-[#0b1c30] rounded-xl px-3 text-sm font-bold focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-[#4f46e5]">autorenew</span>
                  <div>
                    <span className="text-xs font-bold text-[#0b1c30] block">پرداخت خودکار فعال</span>
                    <span className="text-[11px] text-[#545f73]">
                      برداشت روز {faNum(parseInt(loanDueDay, 10) || 15)} هر ماه
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={loanAutoPay}
                  onChange={(e) => setLoanAutoPay(e.target.checked)}
                  className="w-5 h-5 rounded accent-[#4f46e5] cursor-pointer"
                />
              </div>
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-[#4f46e5] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#3525cd] active:scale-[0.98] transition-all"
                >
                  <span>افزودن وام و زمان‌بندی پرداخت</span>
                  <span className="material-symbols-outlined text-[18px] ltr-flip">arrow_forward</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full h-10 rounded-xl text-[#545f73] font-semibold text-xs hover:bg-[#eff4ff]"
                >
                  انصراف
                </button>
              </div>
            </form>
          )}

          {category === "task" && (
            <form onSubmit={handleTaskSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#545f73]">نام کار / یادآور</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="مثلاً پیگیری دندان‌پزشکی، اظهارنامه مالیاتی"
                  className="w-full h-12 bg-[#eff4ff] text-[#0b1c30] rounded-xl px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/40 font-medium"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#545f73]">دسته</label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value as TaskReminder["category"])}
                    className="w-full h-12 bg-[#eff4ff] text-[#0b1c30] rounded-xl px-3 text-sm focus:outline-none font-medium"
                  >
                    <option value="work">💼 کاری</option>
                    <option value="health">🩺 سلامت</option>
                    <option value="home">🏡 خانه</option>
                    <option value="auto">🚗 خودرو</option>
                    <option value="finance">💳 مالی</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#545f73]">اولویت</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as "high" | "normal")}
                    className="w-full h-12 bg-[#eff4ff] text-[#0b1c30] rounded-xl px-3 text-sm focus:outline-none font-medium"
                  >
                    <option value="normal">عادی</option>
                    <option value="high">🚨 فوری (هشدار)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#545f73]">موعد</label>
                  <select
                    value={taskDateCategory}
                    onChange={(e) =>
                      setTaskDateCategory(e.target.value as TaskReminder["dueDateCategory"])
                    }
                    className="w-full h-12 bg-[#eff4ff] text-[#0b1c30] rounded-xl px-3 text-sm focus:outline-none font-medium"
                  >
                    <option value="today">امروز</option>
                    <option value="tomorrow">فردا</option>
                    <option value="upcoming">آینده</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#545f73]">ساعت</label>
                  <input
                    type="text"
                    value={taskTime}
                    onChange={(e) => setTaskTime(e.target.value)}
                    placeholder="۱۴:۰۰"
                    className="w-full h-12 bg-[#eff4ff] text-[#0b1c30] rounded-xl px-3 text-sm focus:outline-none font-medium"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#545f73]">مکان (اختیاری)</label>
                <input
                  type="text"
                  value={taskLocation}
                  onChange={(e) => setTaskLocation(e.target.value)}
                  placeholder="مثلاً داروخانه، پرتال بیمه"
                  className="w-full h-12 bg-[#eff4ff] text-[#0b1c30] rounded-xl px-3 text-sm focus:outline-none"
                />
              </div>
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-[#4f46e5] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#3525cd] active:scale-[0.98] transition-all"
                >
                  <span>زمان‌بندی یادآور</span>
                  <span className="material-symbols-outlined text-[18px] ltr-flip">arrow_forward</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full h-10 rounded-xl text-[#545f73] font-semibold text-xs hover:bg-[#eff4ff]"
                >
                  انصراف
                </button>
              </div>
            </form>
          )}

          {category === "checklist" && (
            <form onSubmit={handleChecklistSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#545f73]">بسته چک‌لیست مقصد</label>
                <select
                  value={selectedPackId}
                  onChange={(e) => setSelectedPackId(e.target.value)}
                  className="w-full h-12 bg-[#eff4ff] text-[#0b1c30] rounded-xl px-3 text-sm focus:outline-none font-medium"
                >
                  {checklists.map((pack) => (
                    <option key={pack.id} value={pack.id}>
                      {pack.title} ({faNum(pack.items.length)} قلم)
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#545f73]">قلم موردنظر</label>
                <input
                  type="text"
                  value={checklistItemText}
                  onChange={(e) => setChecklistItemText(e.target.value)}
                  placeholder="مثلاً شارژر خورشیدی، کفش کوه"
                  className="w-full h-12 bg-[#eff4ff] text-[#0b1c30] rounded-xl px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/40 font-medium"
                  required
                />
              </div>
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-[#4f46e5] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#3525cd] active:scale-[0.98] transition-all"
                >
                  <span>افزودن به چک‌لیست</span>
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full h-10 rounded-xl text-[#545f73] font-semibold text-xs hover:bg-[#eff4ff]"
                >
                  انصراف
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
