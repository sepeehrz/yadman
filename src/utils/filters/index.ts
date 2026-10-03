export function parseISODateOnly(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) {
    return null;
  }
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function toISODateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function daysUntil(dateISO: string): number | null {
  const target = parseISODateOnly(dateISO);
  if (!target) {
    return null;
  }
  const diffMs = target.getTime() - startOfToday().getTime();
  return Math.round(diffMs / 86_400_000);
}

export function formatFaDate(dateISO: string): string {
  const parsed = parseISODateOnly(dateISO);
  if (!parsed) {
    return dateISO;
  }
  return parsed.toLocaleDateString("fa-IR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatFaDateTime(value: Date | string): string {
  const parsed = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  return parsed.toLocaleDateString("fa-IR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** تاریخ و ساعت فارسی — مثل «۱۵ آبان، ساعت ۱۷:۰۰» */
export function formatFaDateWithTime(value: Date | string): string {
  const parsed = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  const date = parsed.toLocaleDateString("fa-IR", {
    day: "numeric",
    month: "long",
  });
  const time = parsed.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date}، ساعت ${time}`;
}
