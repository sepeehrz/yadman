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
