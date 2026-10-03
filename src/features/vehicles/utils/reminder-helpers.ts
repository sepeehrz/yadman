import { faNum } from "@/lib/format";
import { formatFaDate } from "@/utils";
import type { InsuranceType, ReminderSeverity } from "../types";

export const INSURANCE_TYPE_LABEL: Record<InsuranceType, string> = {
  "third-party": "شخص ثالث",
  body: "بدنه",
};

const SEVERITY_STYLE: Record<ReminderSeverity, { badge: string; dot: string }> = {
  overdue: { badge: "bg-[#ffdad6] text-[#93000a]", dot: "bg-[#ba1a1a]" },
  urgent: { badge: "bg-amber-100 text-amber-900", dot: "bg-amber-500" },
  soon: { badge: "bg-[#e5eeff] text-[#3525cd]", dot: "bg-[#4f46e5]" },
  ok: { badge: "bg-[#6ffbbe]/30 text-[#005338]", dot: "bg-[#006e4b]" },
};

export function severityStyle(severity: ReminderSeverity): { badge: string; dot: string } {
  return SEVERITY_STYLE[severity];
}

export function severityLabel(severity: ReminderSeverity): string {
  if (severity === "overdue") return "گذشته از موعد";
  if (severity === "urgent") return "فوری";
  if (severity === "soon") return "نزدیک";
  return "سالم";
}

export function dueLabel(daysRemaining: number | null, dueDate: string | null): string {
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
