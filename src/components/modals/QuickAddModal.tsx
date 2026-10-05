"use client";

import { useState } from "react";
import { BaseDialog } from "@/components/ui/dialog";
import { useLifeHub } from "@/store/LifeHubContext";
import { faNum } from "@/lib/format";
import type { LoanItem, TaskReminder, VehicleTracker } from "@/lib/types";
import { AppIcon } from "@/components/ui/app-icon";

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
  const [nextDueKm, setNextDueKm] = useState(
    (odometerKm + 5000).toLocaleString("en-US"),
  );
  const [estCost, setEstCost] = useState("240.00");
  const [receiptAttached, setReceiptAttached] = useState(false);

  const [loanTitle, setLoanTitle] = useState("");
  const [loanBank, setLoanBank] = useState("");
  const [loanMonthly, setLoanMonthly] = useState("");
  const [loanTotal, setLoanTotal] = useState("");
  const [loanDueDay, setLoanDueDay] = useState("15");
  const [loanCategory, setLoanCategory] =
    useState<LoanItem["category"]>("personal");
  const [loanAutoPay, setLoanAutoPay] = useState(true);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskCategory, setTaskCategory] =
    useState<TaskReminder["category"]>("work");
  const [taskPriority, setTaskPriority] = useState<"high" | "normal">("normal");
  const [taskDateCategory, setTaskDateCategory] =
    useState<TaskReminder["dueDateCategory"]>("today");
  const [taskTime, setTaskTime] = useState("۱۵:۰۰");
  const [taskLocation, setTaskLocation] = useState("");

  const [selectedPackId, setSelectedPackId] = useState(
    checklists[0]?.id || "camping-pack",
  );
  const [checklistItemText, setChecklistItemText] = useState("");

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
      taskDateCategory === "today"
        ? "امروز"
        : taskDateCategory === "tomorrow"
          ? "فردا"
          : "";
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
          ? "bg-primary text-primary-foreground shadow-[0_8px_20px_var(--primary)]/30 ring-2 ring-primary/20 scale-[1.02]"
          : "bg-primary/5 text-muted-foreground hover:bg-primary/10"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
          category === id ? "bg-card/20" : "bg-primary/10"
        }`}
      >
        <AppIcon name={icon} className="size-[19px]" />
      </div>
      <span className="text-xs font-bold text-center leading-tight">
        {label}
      </span>
    </button>
  );

  return (
    <BaseDialog
      open={isQuickAddOpen}
      onClose={onClose}
      title="ایجاد سریع"
      size="lg"
    >
      <div className="bg-card rounded-t-[32px] sm:rounded-[28px] flex flex-col max-h-[88vh] overflow-hidden">
        <div className="w-full flex justify-center py-2 cursor-grab">
          <div className="w-12 h-1.5 rounded-full bg-muted-foreground/70" />
        </div>

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
            <label className="block text-[11px] font-bold text-muted-foreground mb-2">
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
                <label className="block text-xs font-bold text-muted-foreground">
                  خودرو
                </label>
                <div className="h-12 bg-primary/5 rounded-xl px-3 flex items-center justify-between text-foreground">
                  <div className="flex items-center gap-2 truncate">
                    <AppIcon name="electric_car" className="text-primary size-[20px]" />
                    <span className="text-sm font-bold truncate">
                      {vehicleName}{" "}
                      <span className="font-normal text-muted-foreground text-xs">
                        ({faNum(odometerKm)} کیلومتر)
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-muted-foreground">
                  نام سرویس / قطعه
                </label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="مثلاً لنت ترمز، روغن، جابه‌جایی تایر"
                  className="w-full h-12 bg-primary/5 text-foreground rounded-xl px-3.5 text-sm focus:outline-none focus:bg-primary/10 focus:ring-2 focus:ring-primary/40 transition-all font-medium"
                  required
                />
                <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
                  <span className="text-[11px] font-semibold text-muted-foreground whitespace-nowrap">
                    سریع:
                  </span>
                  {[
                    "روغن موتور",
                    "لنت ترمز",
                    "جابه‌جایی تایر",
                    "تمدید بیمه",
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setServiceName(tag)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                        serviceName === tag
                          ? "bg-primary/15 text-primary font-bold"
                          : "bg-primary/10 text-muted-foreground hover:bg-primary/10"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-muted-foreground">
                    دوره تناوب
                  </label>
                  <span className="text-[11px] font-bold text-primary">
                    هرکدام زودتر برسد
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-12 bg-primary/5 rounded-xl px-3 flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground font-medium">
                      هر
                    </span>
                    <input
                      type="text"
                      value={intervalKm}
                      onChange={(e) => setIntervalKm(e.target.value)}
                      className="w-full bg-transparent text-foreground font-bold text-sm text-left focus:outline-none"
                    />
                    <span className="text-xs font-bold text-muted-foreground">
                      کیلومتر
                    </span>
                  </div>
                  <div className="h-12 bg-primary/5 rounded-xl px-3 flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground font-medium">
                      هر
                    </span>
                    <input
                      type="text"
                      value={intervalMo}
                      onChange={(e) => setIntervalMo(e.target.value)}
                      className="w-full bg-transparent text-foreground font-bold text-sm text-left focus:outline-none"
                    />
                    <span className="text-xs font-bold text-muted-foreground">
                      ماه
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-muted-foreground">
                  آستانه موعد بعدی
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-12 bg-primary/5 rounded-xl px-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AppIcon name="calendar_today" className="size-[18px] text-muted-foreground" />
                      <input
                        type="date"
                        value={nextDueDate}
                        onChange={(e) => setNextDueDate(e.target.value)}
                        className="bg-transparent text-xs font-bold text-foreground focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="h-12 bg-primary/5 rounded-xl px-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <AppIcon name="speed" className="size-[18px] text-muted-foreground" />
                      <input
                        type="text"
                        value={nextDueKm}
                        onChange={(e) => setNextDueKm(e.target.value)}
                        className="w-20 bg-transparent text-xs font-bold text-foreground focus:outline-none"
                      />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">
                      کیلومتر
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-muted-foreground">
                    هزینه تقریبی ($)
                  </label>
                  <div className="h-12 bg-primary/5 rounded-xl px-3 flex items-center gap-1">
                    <span className="text-sm font-bold text-muted-foreground">$</span>
                    <input
                      type="text"
                      value={estCost}
                      onChange={(e) => setEstCost(e.target.value)}
                      placeholder="240.00"
                      className="w-full bg-transparent text-sm font-semibold text-foreground focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-muted-foreground">
                    فاکتور / مدرک
                  </label>
                  <button
                    type="button"
                    onClick={() => setReceiptAttached(!receiptAttached)}
                    className={`w-full h-12 rounded-xl px-2.5 flex items-center justify-center gap-1.5 transition-all text-xs font-semibold ${
                      receiptAttached
                        ? "bg-success/20 text-success border border-success/50"
                        : "bg-primary/5 hover:bg-primary/10 text-muted-foreground"
                    }`}
                  >
                    <AppIcon name={receiptAttached ? "task_alt" : "add_a_photo"} className="size-[19px] text-primary" />
                    <span className="truncate">
                      {receiptAttached ? "فاکتور پیوست شد" : "افزودن فاکتور"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-primary/5 flex items-start gap-2.5 border border-primary/15">
                <div className="w-6 h-6 rounded-full bg-success text-success-foreground flex items-center justify-center shrink-0 mt-0.5">
                  <AppIcon name="auto_awesome" className="size-[14px]" />
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-foreground block">
                    همگام‌سازی هوشمند چرخه
                  </span>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    لایف‌هاب ۵۰۰ کیلومتر قبل از آستانه هشدار می‌دهد و سوابق را
                    با لاگ خودرو همگام می‌کند.
                  </p>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary active:scale-[0.98] transition-all"
                >
                  <span>ساخت یادآور سرویس</span>
                  <AppIcon name="arrow_forward" className="size-[18px]" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full h-10 rounded-xl text-muted-foreground font-semibold text-xs hover:bg-primary/5"
                >
                  انصراف
                </button>
              </div>
            </form>
          )}

          {category === "loan" && (
            <form onSubmit={handleLoanSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">
                  عنوان وام / بدهی
                </label>
                <input
                  type="text"
                  value={loanTitle}
                  onChange={(e) => setLoanTitle(e.target.value)}
                  placeholder="مثلاً وام بازسازی خانه، وام دانشجویی"
                  className="w-full h-12 bg-primary/5 text-foreground rounded-xl px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-muted-foreground">
                    بانک / مؤسسه
                  </label>
                  <input
                    type="text"
                    value={loanBank}
                    onChange={(e) => setLoanBank(e.target.value)}
                    placeholder="مثلاً Chase"
                    className="w-full h-12 bg-primary/5 text-foreground rounded-xl px-3 text-sm focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-muted-foreground">
                    دسته
                  </label>
                  <select
                    value={loanCategory}
                    onChange={(e) =>
                      setLoanCategory(e.target.value as LoanItem["category"])
                    }
                    className="w-full h-12 bg-primary/5 text-foreground rounded-xl px-3 text-sm focus:outline-none"
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
                  <label className="block text-xs font-bold text-muted-foreground">
                    پرداخت ماهانه ($)
                  </label>
                  <input
                    type="number"
                    value={loanMonthly}
                    onChange={(e) => setLoanMonthly(e.target.value)}
                    placeholder="450.00"
                    className="w-full h-12 bg-primary/5 text-foreground rounded-xl px-3 text-sm font-bold focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-muted-foreground">
                    مانده کل ($)
                  </label>
                  <input
                    type="number"
                    value={loanTotal}
                    onChange={(e) => setLoanTotal(e.target.value)}
                    placeholder="12,000.00"
                    className="w-full h-12 bg-primary/5 text-foreground rounded-xl px-3 text-sm font-bold focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5">
                <div className="flex items-center gap-2">
                  <AppIcon name="autorenew" className="size-[20px] text-primary" />
                  <div>
                    <span className="text-xs font-bold text-foreground block">
                      پرداخت خودکار فعال
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      برداشت روز {faNum(parseInt(loanDueDay, 10) || 15)} هر ماه
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={loanAutoPay}
                  onChange={(e) => setLoanAutoPay(e.target.checked)}
                  className="w-5 h-5 rounded accent-primary cursor-pointer"
                />
              </div>
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary active:scale-[0.98] transition-all"
                >
                  <span>افزودن وام و زمان‌بندی پرداخت</span>
                  <AppIcon name="arrow_forward" className="size-[18px]" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full h-10 rounded-xl text-muted-foreground font-semibold text-xs hover:bg-primary/5"
                >
                  انصراف
                </button>
              </div>
            </form>
          )}

          {category === "task" && (
            <form onSubmit={handleTaskSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">
                  نام کار / یادآور
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="مثلاً پیگیری دندان‌پزشکی، اظهارنامه مالیاتی"
                  className="w-full h-12 bg-primary/5 text-foreground rounded-xl px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-muted-foreground">
                    دسته
                  </label>
                  <select
                    value={taskCategory}
                    onChange={(e) =>
                      setTaskCategory(
                        e.target.value as TaskReminder["category"],
                      )
                    }
                    className="w-full h-12 bg-primary/5 text-foreground rounded-xl px-3 text-sm focus:outline-none font-medium"
                  >
                    <option value="work">💼 کاری</option>
                    <option value="health">🩺 سلامت</option>
                    <option value="home">🏡 خانه</option>
                    <option value="auto">🚗 خودرو</option>
                    <option value="finance">💳 مالی</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-muted-foreground">
                    اولویت
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) =>
                      setTaskPriority(e.target.value as "high" | "normal")
                    }
                    className="w-full h-12 bg-primary/5 text-foreground rounded-xl px-3 text-sm focus:outline-none font-medium"
                  >
                    <option value="normal">عادی</option>
                    <option value="high">🚨 فوری (هشدار)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-muted-foreground">
                    موعد
                  </label>
                  <select
                    value={taskDateCategory}
                    onChange={(e) =>
                      setTaskDateCategory(
                        e.target.value as TaskReminder["dueDateCategory"],
                      )
                    }
                    className="w-full h-12 bg-primary/5 text-foreground rounded-xl px-3 text-sm focus:outline-none font-medium"
                  >
                    <option value="today">امروز</option>
                    <option value="tomorrow">فردا</option>
                    <option value="upcoming">آینده</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-muted-foreground">
                    ساعت
                  </label>
                  <input
                    type="text"
                    value={taskTime}
                    onChange={(e) => setTaskTime(e.target.value)}
                    placeholder="۱۴:۰۰"
                    className="w-full h-12 bg-primary/5 text-foreground rounded-xl px-3 text-sm focus:outline-none font-medium"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">
                  مکان (اختیاری)
                </label>
                <input
                  type="text"
                  value={taskLocation}
                  onChange={(e) => setTaskLocation(e.target.value)}
                  placeholder="مثلاً داروخانه، پرتال بیمه"
                  className="w-full h-12 bg-primary/5 text-foreground rounded-xl px-3 text-sm focus:outline-none"
                />
              </div>
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary active:scale-[0.98] transition-all"
                >
                  <span>زمان‌بندی یادآور</span>
                  <AppIcon name="arrow_forward" className="size-[18px]" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full h-10 rounded-xl text-muted-foreground font-semibold text-xs hover:bg-primary/5"
                >
                  انصراف
                </button>
              </div>
            </form>
          )}

          {category === "checklist" && (
            <form onSubmit={handleChecklistSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">
                  بسته چک‌لیست مقصد
                </label>
                <select
                  value={selectedPackId}
                  onChange={(e) => setSelectedPackId(e.target.value)}
                  className="w-full h-12 bg-primary/5 text-foreground rounded-xl px-3 text-sm focus:outline-none font-medium"
                >
                  {checklists.map((pack) => (
                    <option key={pack.id} value={pack.id}>
                      {pack.title} ({faNum(pack.items.length)} قلم)
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">
                  قلم موردنظر
                </label>
                <input
                  type="text"
                  value={checklistItemText}
                  onChange={(e) => setChecklistItemText(e.target.value)}
                  placeholder="مثلاً شارژر خورشیدی، کفش کوه"
                  className="w-full h-12 bg-primary/5 text-foreground rounded-xl px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
                  required
                />
              </div>
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary active:scale-[0.98] transition-all"
                >
                  <span>افزودن به چک‌لیست</span>
                  <AppIcon name="add" className="size-[18px]" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full h-10 rounded-xl text-muted-foreground font-semibold text-xs hover:bg-primary/5"
                >
                  انصراف
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </BaseDialog>
  );
}
