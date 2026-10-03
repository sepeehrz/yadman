import { describe, expect, it } from "vitest";
import { formatFaDate, parseISODateOnly, toISODateOnly } from "@/utils";
import { dueLabel, severityLabel } from "./reminder-helpers";
import { suggestNextService } from "./service-helpers";
import type { ServiceCategory } from "../types";

describe("date filters", () => {
  it("parses ISO dates and rejects garbage", () => {
    expect(parseISODateOnly("2024-10-25")?.getFullYear()).toBe(2024);
    expect(parseISODateOnly("not-a-date")).toBeNull();
  });

  it("round-trips through toISODateOnly", () => {
    expect(toISODateOnly(new Date(2024, 9, 25))).toBe("2024-10-25");
  });

  it("formats Persian dates and passes through unknown input", () => {
    expect(formatFaDate("2024-10-25")).toContain("۱۴۰۳");
    expect(formatFaDate("raw-text")).toBe("raw-text");
  });
});

describe("reminder labels", () => {
  it("describes overdue, today and upcoming", () => {
    expect(dueLabel(-3, null)).toContain("گذشته از موعد");
    expect(dueLabel(0, null)).toBe("موعد امروز");
    expect(dueLabel(5, null)).toContain("روز مانده");
    expect(dueLabel(null, null)).toBe("بدون موعد");
  });

  it("maps severities to Persian labels", () => {
    expect(severityLabel("overdue")).toBe("گذشته از موعد");
    expect(severityLabel("urgent")).toBe("فوری");
    expect(severityLabel("soon")).toBe("نزدیک");
    expect(severityLabel("ok")).toBe("سالم");
  });
});

describe("suggestNextService", () => {
  const category: ServiceCategory = {
    id: "engine-oil",
    title: "روغن موتور",
    description: null,
    icon: "oil_barrel",
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
  };

  it("suggests next date and km from category intervals", () => {
    const suggestion = suggestNextService(category, "2024-10-25", 85000);
    expect(suggestion.nextDueKm).toBe(90000);
    expect(suggestion.nextDueDate).toBe("2025-04-25");
  });

  it("returns empty suggestion without a category", () => {
    expect(suggestNextService(null, "2024-10-25", 85000)).toEqual({});
  });
});
