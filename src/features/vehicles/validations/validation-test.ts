import { describe, expect, it } from "vitest";
import { parseInsuranceForm } from "./insurance-schema";
import { parseServiceForm } from "./service-schema";
import { parseTollForm } from "./toll-schema";
import { parseVehicleForm } from "./vehicle-schema";

describe("parseVehicleForm", () => {
  it("accepts a complete vehicle", () => {
    const result = parseVehicleForm({
      name: "تسلا مدل ۳",
      year: 2022,
      odometerKm: 85420,
    });
    expect(result.ok).toBe(true);
  });

  it("rejects missing name", () => {
    const result = parseVehicleForm({ name: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.name).toBeDefined();
    }
  });

  it("rejects negative odometer", () => {
    const result = parseVehicleForm({
      name: "پراید",
      odometerKm: -5,
    });
    expect(result.ok).toBe(false);
  });
});

describe("parseServiceForm", () => {
  it("accepts a service with next-due info", () => {
    const result = parseServiceForm({
      title: "تعویض روغن",
      serviceDate: "2024-10-25",
      provider: "نمایندگی",
      odometerKm: 85000,
      cost: 240,
      nextDueDate: "2025-04-25",
      nextDueKm: 90000,
    });
    expect(result.ok).toBe(true);
  });

  it("rejects missing title and bad date", () => {
    const result = parseServiceForm({ title: "", serviceDate: "not-a-date", odometerKm: 10 });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.title).toBeDefined();
      expect(result.errors.serviceDate).toBeDefined();
    }
  });
});

describe("parseInsuranceForm", () => {
  it("rejects end date before start date", () => {
    const result = parseInsuranceForm({
      type: "third-party",
      company: "ایران",
      startDate: "2025-01-01",
      endDate: "2024-01-01",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.endDate).toBeDefined();
    }
  });

  it("accepts a valid policy", () => {
    const result = parseInsuranceForm({
      type: "body",
      company: "البرز",
      startDate: "2024-01-01",
      endDate: "2025-01-01",
    });
    expect(result.ok).toBe(true);
  });
});

describe("parseTollForm", () => {
  it("rejects negative amount", () => {
    const result = parseTollForm({ year: "۱۴۰۳", amount: -100 });
    expect(result.ok).toBe(false);
  });

  it("accepts a valid toll", () => {
    const result = parseTollForm({ year: "۱۴۰۳", amount: 450000, dueDate: "2025-03-01" });
    expect(result.ok).toBe(true);
  });
});
