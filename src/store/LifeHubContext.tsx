"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  INITIAL_CHECKLISTS,
  INITIAL_LOANS,
  INITIAL_REMINDERS,
  INITIAL_SERVICE_LOGS,
  INITIAL_TIMELINE_EVENTS,
  INITIAL_VEHICLE_TRACKERS,
} from "@/lib/mock-data";
import type {
  ChecklistPack,
  LoanItem,
  ServiceLogRecord,
  TaskReminder,
  TimelineEvent,
  VehicleTracker,
} from "@/lib/types";
import { faNum } from "@/lib/format";

type ToastType = "success" | "info" | "warning";

interface ToastState {
  message: string | null;
  icon: string;
  type: ToastType;
}

interface LifeHubContextValue {
  // domain state
  odometerKm: number;
  trackers: VehicleTracker[];
  serviceLogs: ServiceLogRecord[];
  loans: LoanItem[];
  tasks: TaskReminder[];
  checklists: ChecklistPack[];
  timeline: TimelineEvent[];

  // derived
  pendingTasksCount: number;
  upcomingLoansCount: number;

  // domain actions
  updateOdometer: (km: number) => void;
  addVehicleTracker: (t: VehicleTracker) => void;
  addServiceLog: (log: ServiceLogRecord) => void;
  addLoan: (loan: LoanItem) => void;
  toggleMarkPaid: (loanId: string) => void;
  addTask: (task: TaskReminder) => void;
  toggleTask: (taskId: string) => void;
  toggleChecklistItem: (packId: string, itemId: string) => void;
  addChecklistItem: (packId: string, text: string) => void;
  resetChecklist: (packId: string) => void;
  confirmSchedule: (
    serviceName: string,
    dateStr: string,
    provider: string,
  ) => void;
  payLoanDirect: (loanId: string, loanName: string) => void;

  // toast
  toast: ToastState;
  showToast: (msg: string, icon?: string, type?: ToastType) => void;

  // global modals
  isQuickAddOpen: boolean;
  setQuickAddOpen: (v: boolean) => void;
  isSearchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  isNotificationsOpen: boolean;
  setNotificationsOpen: (v: boolean) => void;
  isProfileOpen: boolean;
  setProfileOpen: (v: boolean) => void;
  isOdometerOpen: boolean;
  setOdometerOpen: (v: boolean) => void;
  scheduleServiceTitle: string | null;
  setScheduleServiceTitle: (v: string | null) => void;
}

const LifeHubContext = createContext<LifeHubContextValue | null>(null);

function readLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function readLSNumber(key: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(key);
  const n = raw ? parseInt(raw, 10) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

export function LifeHubProvider({ children }: { children: ReactNode }) {
  const [odometerKm, setOdometerKm] = useState<number>(() =>
    readLSNumber("lifehub_odometer", 85420),
  );
  const [trackers, setTrackers] = useState<VehicleTracker[]>(() =>
    readLS("lifehub_trackers", INITIAL_VEHICLE_TRACKERS),
  );
  const [serviceLogs, setServiceLogs] = useState<ServiceLogRecord[]>(() =>
    readLS("lifehub_logs", INITIAL_SERVICE_LOGS),
  );
  const [loans, setLoans] = useState<LoanItem[]>(() =>
    readLS("lifehub_loans", INITIAL_LOANS),
  );
  const [tasks, setTasks] = useState<TaskReminder[]>(() =>
    readLS("lifehub_tasks", INITIAL_REMINDERS),
  );
  const [checklists, setChecklists] = useState<ChecklistPack[]>(() =>
    readLS("lifehub_checklists", INITIAL_CHECKLISTS),
  );
  const [timeline, setTimeline] = useState<TimelineEvent[]>(
    INITIAL_TIMELINE_EVENTS,
  );

  const [toast, setToast] = useState<ToastState>({
    message: null,
    icon: "check_circle",
    type: "success",
  });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isQuickAddOpen, setQuickAddOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isOdometerOpen, setOdometerOpen] = useState(false);
  const [scheduleServiceTitle, setScheduleServiceTitle] = useState<
    string | null
  >(null);

  const showToast = useCallback(
    (msg: string, icon = "check_circle", type: ToastType = "success") => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      setToast({ message: msg, icon, type });
      toastTimer.current = setTimeout(() => {
        setToast((t) => ({ ...t, message: null }));
      }, 3200);
    },
    [],
  );

  useEffect(() => {
    window.localStorage.setItem("lifehub_odometer", odometerKm.toString());
  }, [odometerKm]);
  useEffect(() => {
    window.localStorage.setItem("lifehub_trackers", JSON.stringify(trackers));
  }, [trackers]);
  useEffect(() => {
    window.localStorage.setItem("lifehub_logs", JSON.stringify(serviceLogs));
  }, [serviceLogs]);
  useEffect(() => {
    window.localStorage.setItem("lifehub_loans", JSON.stringify(loans));
  }, [loans]);
  useEffect(() => {
    window.localStorage.setItem("lifehub_tasks", JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    window.localStorage.setItem(
      "lifehub_checklists",
      JSON.stringify(checklists),
    );
  }, [checklists]);
  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const updateOdometer = useCallback(
    (newKm: number) => {
      setOdometerKm(newKm);
      setTrackers((prev) =>
        prev.map((t) => {
          if (!t.targetKm) return t;
          const diff = t.targetKm - newKm;
          const isPast = diff <= 0;
          return {
            ...t,
            currentKm: newKm,
            category: isPast ? "urgent" : diff <= 1000 ? "due-soon" : "healthy",
            badgeText: isPast
              ? `${faNum(Math.abs(diff))} کیلومتر عقب‌افتادگی`
              : diff <= 1000
                ? `${faNum(diff)} کیلومتر تا موعد`
                : `سالم (${faNum(diff)} کیلومتر مانده)`,
            badgeType: isPast ? "error" : diff <= 1000 ? "primary" : "tertiary",
          };
        }),
      );
      showToast(
        `کیلومتر به ${faNum(newKm)} به‌روزرسانی و آستانه‌ها بازتنظیم شد!`,
      );
    },
    [showToast],
  );

  const addVehicleTracker = useCallback(
    (t: VehicleTracker) => {
      setTrackers((prev) => [t, ...prev]);
      showToast(`یادآور ساخته شد: ${t.title}!`);
    },
    [showToast],
  );

  const addServiceLog = useCallback((log: ServiceLogRecord) => {
    setServiceLogs((prev) => [log, ...prev]);
    setOdometerKm((prev) => (log.odometerKm > prev ? log.odometerKm : prev));
    setTrackers((prev) =>
      prev.map((t) => {
        if (
          log.title.toLowerCase().includes(t.title.toLowerCase().split(" ")[0])
        ) {
          return {
            ...t,
            category: "healthy",
            badgeText: "تکمیل و ریست شد",
            badgeType: "tertiary",
            percentage: 10,
          };
        }
        return t;
      }),
    );
  }, []);

  const addLoan = useCallback(
    (loan: LoanItem) => {
      setLoans((prev) => [loan, ...prev]);
      showToast(`وام اضافه شد: ${loan.title}!`);
    },
    [showToast],
  );

  const toggleMarkPaid = useCallback((loanId: string) => {
    setLoans((prev) =>
      prev.map((l) => {
        if (l.id === loanId) {
          const wasPaid = l.paidThisCycle;
          return {
            ...l,
            paidThisCycle: !wasPaid,
            paidInstallments: wasPaid
              ? l.paidInstallments - 1
              : l.paidInstallments + 1,
            remainingAmount: wasPaid
              ? l.remainingAmount + l.monthlyAmount
              : Math.max(0, l.remainingAmount - l.monthlyAmount),
          };
        }
        return l;
      }),
    );
  }, []);

  const addTask = useCallback(
    (task: TaskReminder) => {
      setTasks((prev) => [task, ...prev]);
      showToast(`یادآور اضافه شد: «${task.title}»`);
    },
    [showToast],
  );

  const toggleTask = useCallback(
    (taskId: string) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === taskId) {
            const next = !t.done;
            showToast(
              next ? `تمام شد: «${t.title}» 🎉` : `بازگردانده شد: «${t.title}»`,
            );
            return { ...t, done: next };
          }
          return t;
        }),
      );
    },
    [showToast],
  );

  const toggleChecklistItem = useCallback((packId: string, itemId: string) => {
    setChecklists((prev) =>
      prev.map((pack) =>
        pack.id === packId
          ? {
              ...pack,
              items: pack.items.map((item) =>
                item.id === itemId
                  ? { ...item, completed: !item.completed }
                  : item,
              ),
            }
          : pack,
      ),
    );
  }, []);

  const addChecklistItem = useCallback(
    (packId: string, text: string) => {
      setChecklists((prev) =>
        prev.map((pack) =>
          pack.id === packId
            ? {
                ...pack,
                items: [
                  ...pack.items,
                  { id: `item-${Date.now()}`, text, completed: false },
                ],
              }
            : pack,
        ),
      );
      showToast(`«${text}» به چک‌لیست اضافه شد!`);
    },
    [showToast],
  );

  const resetChecklist = useCallback((packId: string) => {
    setChecklists((prev) =>
      prev.map((pack) =>
        pack.id === packId
          ? {
              ...pack,
              items: pack.items.map((i) => ({ ...i, completed: false })),
            }
          : pack,
      ),
    );
  }, []);

  const confirmSchedule = useCallback(
    (serviceName: string, dateStr: string, provider: string) => {
      showToast(`«${serviceName}» در ${dateStr} با ${provider} رزرو شد!`);
      const ev: TimelineEvent = {
        id: `tl-${Date.now()}`,
        title: serviceName,
        timeLabel: dateStr,
        dateBadge: "رزرو شد",
        category: "auto",
        categoryLabel: "خودرو",
        subtitle: `${provider} • زمان‌بندی‌شده`,
        icon: "build_circle",
      };
      setTimeline((prev) => [ev, ...prev]);
    },
    [showToast],
  );

  const payLoanDirect = useCallback(
    (loanId: string, loanName: string) => {
      toggleMarkPaid(loanId);
      showToast(`پرداخت ${loanName} تأیید شد! 🎉`);
    },
    [toggleMarkPaid, showToast],
  );

  const pendingTasksCount = useMemo(
    () => tasks.filter((t) => !t.done).length,
    [tasks],
  );
  const upcomingLoansCount = useMemo(
    () => loans.filter((l) => !l.paidThisCycle).length,
    [loans],
  );

  const value = useMemo<LifeHubContextValue>(
    () => ({
      odometerKm,
      trackers,
      serviceLogs,
      loans,
      tasks,
      checklists,
      timeline,
      pendingTasksCount,
      upcomingLoansCount,
      updateOdometer,
      addVehicleTracker,
      addServiceLog,
      addLoan,
      toggleMarkPaid,
      addTask,
      toggleTask,
      toggleChecklistItem,
      addChecklistItem,
      resetChecklist,
      confirmSchedule,
      payLoanDirect,
      toast,
      showToast,
      isQuickAddOpen,
      setQuickAddOpen,
      isSearchOpen,
      setSearchOpen,
      isNotificationsOpen,
      setNotificationsOpen,
      isProfileOpen,
      setProfileOpen,
      isOdometerOpen,
      setOdometerOpen,
      scheduleServiceTitle,
      setScheduleServiceTitle,
    }),
    [
      odometerKm,
      trackers,
      serviceLogs,
      loans,
      tasks,
      checklists,
      timeline,
      pendingTasksCount,
      upcomingLoansCount,
      updateOdometer,
      addVehicleTracker,
      addServiceLog,
      addLoan,
      toggleMarkPaid,
      addTask,
      toggleTask,
      toggleChecklistItem,
      addChecklistItem,
      resetChecklist,
      confirmSchedule,
      payLoanDirect,
      toast,
      showToast,
      isQuickAddOpen,
      isSearchOpen,
      isNotificationsOpen,
      isProfileOpen,
      isOdometerOpen,
      scheduleServiceTitle,
    ],
  );

  return (
    <LifeHubContext.Provider value={value}>{children}</LifeHubContext.Provider>
  );
}

export function useLifeHub(): LifeHubContextValue {
  const ctx = useContext(LifeHubContext);
  if (!ctx) throw new Error("useLifeHub باید داخل LifeHubProvider استفاده شود");
  return ctx;
}
