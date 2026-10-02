export type ScreenType = "dashboard" | "vehicles" | "loans" | "tasks";

export interface VehicleTracker {
  id: string;
  title: string;
  subtitle: string;
  category: "urgent" | "due-soon" | "healthy" | "policy";
  badgeText: string;
  badgeType: "error" | "warning" | "tertiary" | "primary";
  icon: string;
  currentKm?: number;
  targetKm?: number;
  intervalKm?: number;
  percentage?: number;
  timeElapsedMonths?: number;
  timeTotalMonths?: number;
  targetDate?: string;
  scheduledAtKm?: number;
  extraDetail?: string;
  autoPay?: boolean;
}

export interface ServiceLogRecord {
  id: string;
  title: string;
  date: string;
  provider: string;
  odometerKm: number;
  cost: number;
  receiptVerified: boolean;
  notes?: string;
  category: string;
}

export interface LoanItem {
  id: string;
  title: string;
  bank: string;
  icon: string;
  dueNotice: string;
  dueDate: string;
  monthlyAmount: number;
  remainingAmount: number;
  totalAmount: number;
  paidInstallments: number;
  totalInstallments: number;
  progressPercent: number;
  linkedAccount?: string;
  autoPay: boolean;
  category: "mortgage" | "auto" | "hardware" | "personal";
  paidThisCycle?: boolean;
  badgeText?: string;
  badgeType?: "primary" | "tertiary" | "amber";
}

export interface TaskReminder {
  id: string;
  title: string;
  dueTime: string;
  dueDateCategory: "today" | "tomorrow" | "upcoming";
  priority?: "high" | "normal";
  category: "work" | "health" | "home" | "auto" | "finance";
  source?: string;
  location?: string;
  recurring?: string;
  done: boolean;
}

export interface ChecklistPack {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  active: boolean;
  items: {
    id: string;
    text: string;
    completed: boolean;
  }[];
}

export interface TimelineEvent {
  id: string;
  title: string;
  timeLabel: string;
  dateBadge: string;
  category: "health" | "auto" | "finance" | "travel";
  categoryLabel: string;
  subtitle: string;
  icon: string;
}
