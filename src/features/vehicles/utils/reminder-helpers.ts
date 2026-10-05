import { faNum } from "@/lib/format";
import { formatFaDate } from "@/utils";
import type { InsuranceType, ReminderSeverity } from "../types";

export const INSURANCE_TYPE_LABEL: Record<InsuranceType, string> = {
  "third-party": "شخص ثالث",
  body: "بدنه",
};

const SEVERITY_STYLE: Record<ReminderSeverity, { badge: string; dot: string }> =
  {
    overdue: { badge: "bg-destructive/15 text-destructive", dot: "bg-destructive" },
    urgent: { badge: "bg-warning text-warning-foreground", dot: "bg-warning" },
    soon: { badge: "bg-primary/10 text-primary", dot: "bg-primary" },
    ok: { badge: "bg-success/30 text-success", dot: "bg-success" },
  };

export function severityStyle(severity: ReminderSeverity): {
  badge: string;
  dot: string;
} {
  return SEVERITY_STYLE[severity];
}

export function severityLabel(severity: ReminderSeverity): string {
  if (severity === "overdue") return "گذشته از موعد";
  if (severity === "urgent") return "فوری";
  if (severity === "soon") return "نزدیک";
  return "سالم";
}

export function dueLabel(
  daysRemaining: number | null,
  dueDate: string | null,
): string {
  if (daysRemaining === null) {
    return dueDate ? formatFaDate(dueDate) : "بدون موعد";
  }
  if (daysRemaining < 0) {
    return `${faNum(Math.abs(daysRemaining))} روز گذشته از موعد`;
  }
  if (daysRemaining === 0) {
    return "موعد امروز";
  }
  return `${faNum(daysRemaining)} روز مانده`;
}
