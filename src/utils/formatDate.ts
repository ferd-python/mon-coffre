import { DEFAULT_LOCALE } from "@/constants/app";

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * A bare "YYYY-MM-DD" string has no timezone: `new Date(string)` parses it as UTC
 * midnight, which formats as the previous day on negative UTC-offset devices. Build the
 * date from local components instead so the displayed day always matches the stored one.
 */
function parseDate(date: string): Date {
  const match = DATE_ONLY_PATTERN.exec(date);
  if (match) {
    const [, year, month, day] = match;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }
  return new Date(date);
}

export function formatDate(date: string | Date): string {
  const value = typeof date === "string" ? parseDate(date) : date;
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(value);
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
