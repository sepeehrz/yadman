import { parseISODateOnly, toISODateOnly } from "@/utils";
import type { ServiceCategory } from "../types";

export interface NextServiceSuggestion {
  nextDueDate?: string;
  nextDueKm?: number;
}

export function suggestNextService(
  category: ServiceCategory | null,
  serviceDateISO: string,
  odometerKm: number,
): NextServiceSuggestion {
  if (!category) {
    return {};
  }
  const suggestion: NextServiceSuggestion = {};
  if (category.defaultIntervalMonths) {
    const base = parseISODateOnly(serviceDateISO);
    if (base) {
      const next = new Date(
        base.getFullYear(),
        base.getMonth() + category.defaultIntervalMonths,
        base.getDate(),
      );
      suggestion.nextDueDate = toISODateOnly(next);
    }
  }
  if (category.defaultIntervalKm) {
    suggestion.nextDueKm = odometerKm + category.defaultIntervalKm;
  }
  return suggestion;
}
