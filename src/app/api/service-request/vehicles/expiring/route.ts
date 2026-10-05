import { eq, inArray } from "drizzle-orm";
import { getDb } from "@/database/db";
import { insurances, tolls, vehicles } from "@/database/schema/garage";
import { serviceLogs } from "@/database/schema/vehicles";
import type { ExpiringReminder, ReminderSeverity } from "@/features/vehicles/types";
import {
  getAuthorizedUser,
  handleRouteError,
  ok,
  unauthorized,
} from "@/app/api/service-request/route-helpers";

function daysFromToday(dateISO: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateISO.trim());
  if (!match) {
    return null;
  }
  const target = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  if (Number.isNaN(target.getTime())) {
    return null;
  }
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

function toSeverity(daysRemaining: number | null): ReminderSeverity {
  if (daysRemaining === null) {
    return "soon";
  }
  if (daysRemaining < 0) {
    return "overdue";
  }
  if (daysRemaining <= 7) {
    return "urgent";
  }
  if (daysRemaining <= 30) {
    return "soon";
  }
  return "ok";
}

export async function GET(request: Request) {
  try {
    const user = getAuthorizedUser(request);
    if (!user) return unauthorized();
    const url = new URL(request.url);
    const days = Number(url.searchParams.get("days") ?? "30");
    const windowDays = Number.isFinite(days) && days > 0 ? Math.min(days, 365) : 30;
    const vehicleFilter = url.searchParams.get("vehicleId");

    const db = getDb();
    const vehicleRows = await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.userId, user.userId));
    const inScope = vehicleFilter
      ? vehicleRows.filter((vehicle) => vehicle.id === vehicleFilter)
      : vehicleRows;
    const names = new Map(inScope.map((vehicle) => [vehicle.id, vehicle.name]));
    const scopeIds = [...names.keys()];

    // فقط رکوردهای متعلق به خودروهای همان کاربر خوانده می‌شود
    const insuranceRows =
      scopeIds.length > 0
        ? await db
            .select()
            .from(insurances)
            .where(inArray(insurances.vehicleId, scopeIds))
        : [];
    const tollRows =
      scopeIds.length > 0
        ? await db.select().from(tolls).where(inArray(tolls.vehicleId, scopeIds))
        : [];
    const serviceRows =
      scopeIds.length > 0
        ? await db
            .select()
            .from(serviceLogs)
            .where(inArray(serviceLogs.vehicleId, scopeIds))
        : [];

    const reminders: ExpiringReminder[] = [];

    for (const row of insuranceRows) {
      if (!names.has(row.vehicleId)) {
        continue;
      }
      const daysRemaining = daysFromToday(row.endDate);
      if (daysRemaining !== null && daysRemaining > windowDays) {
        continue;
      }
      reminders.push({
        kind: "insurance",
        refId: row.id,
        vehicleId: row.vehicleId,
        vehicleName: names.get(row.vehicleId) ?? "",
        title: `بیمه ${row.type === "body" ? "بدنه" : "شخص ثالث"} ${row.company}`,
        detail: row.policyNumber ? `بیمه‌نامه ${row.policyNumber}` : "اتمام اعتبار بیمه‌نامه",
        dueDate: row.endDate,
        dueKm: null,
        daysRemaining,
        severity: toSeverity(daysRemaining),
      });
    }

    for (const row of tollRows) {
      if (!names.has(row.vehicleId) || row.paid || !row.dueDate) {
        continue;
      }
      const daysRemaining = daysFromToday(row.dueDate);
      if (daysRemaining !== null && daysRemaining > windowDays) {
        continue;
      }
      reminders.push({
        kind: "toll",
        refId: row.id,
        vehicleId: row.vehicleId,
        vehicleName: names.get(row.vehicleId) ?? "",
        title: `عوارض سال ${row.year}`,
        detail: "مهلت پرداخت عوارض سالیانه",
        dueDate: row.dueDate,
        dueKm: null,
        daysRemaining,
        severity: toSeverity(daysRemaining),
      });
    }

    for (const row of serviceRows) {
      if (!row.vehicleId || !names.has(row.vehicleId) || !row.nextDueDate) {
        continue;
      }
      const daysRemaining = daysFromToday(row.nextDueDate);
      if (daysRemaining !== null && daysRemaining > windowDays) {
        continue;
      }
      reminders.push({
        kind: "service",
        refId: row.id,
        vehicleId: row.vehicleId,
        vehicleName: names.get(row.vehicleId) ?? "",
        title: `مراجعه بعدی: ${row.title}`,
        detail: row.nextDueKm ? `یا در کیلومتر ${row.nextDueKm.toLocaleString("fa-IR")}` : "سرویس دوره‌ای",
        dueDate: row.nextDueDate,
        dueKm: row.nextDueKm,
        daysRemaining,
        severity: toSeverity(daysRemaining),
      });
    }

    const severityRank: Record<ReminderSeverity, number> = {
      overdue: 0,
      urgent: 1,
      soon: 2,
      ok: 3,
    };
    reminders.sort((a, b) => {
      const rank = severityRank[a.severity] - severityRank[b.severity];
      if (rank !== 0) {
        return rank;
      }
      return (a.daysRemaining ?? Number.MAX_SAFE_INTEGER) - (b.daysRemaining ?? Number.MAX_SAFE_INTEGER);
    });

    return ok(reminders.slice(0, 50));
  } catch (error) {
    return handleRouteError(error);
  }
}
