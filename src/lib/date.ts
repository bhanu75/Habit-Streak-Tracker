import { ISODate, ISODateTime } from "@/types/habit";

/**
 * Get current date in ISO format (YYYY-MM-DD)
 * Uses local timezone to avoid UTC conversion issues
 */
export function getTodayISO(): ISODate {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Get current datetime in ISO format
 */
export function getNowISO(): ISODateTime {
  return new Date().toISOString();
}

/**
 * Convert ISODate to Date object (local timezone)
 */
export function isoDateToDate(isoDate: ISODate): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Get difference in days between two ISO dates
 */
export function daysBetween(date1: ISODate, date2: ISODate): number {
  const d1 = isoDateToDate(date1);
  const d2 = isoDateToDate(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if two ISO dates are the same
 */
export function isSameDay(date1: ISODate, date2: ISODate): boolean {
  return date1 === date2;
}

/**
 * Check if date is today
 */
export function isToday(date: ISODate): boolean {
  return isSameDay(date, getTodayISO());
}

/**
 * Check if date is yesterday
 */
export function isYesterday(date: ISODate): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, "0");
  const day = String(yesterday.getDate()).padStart(2, "0");
  return date === `${year}-${month}-${day}`;
}

/**
 * Get date N days ago from today
 */
export function getDaysAgo(days: number): ISODate {
  const date = new Date();
  date.setDate(date.getDate() - days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Format ISODate to readable string
 * Example: "2026-01-24" → "Jan 24, 2026"
 */
export function formatDate(isoDate: ISODate): string {
  const date = isoDateToDate(isoDate);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format ISODate to short format
 * Example: "2026-01-24" → "Jan 24"
 */
export function formatDateShort(isoDate: ISODate): string {
  const date = isoDateToDate(isoDate);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Get array of dates for last N days (including today)
 */
export function getLastNDays(n: number): ISODate[] {
  const dates: ISODate[] = [];
  for (let i = n - 1; i >= 0; i--) {
    dates.push(getDaysAgo(i));
  }
  return dates;
}

/**
 * Check if a date is in the future
 */
export function isFuture(date: ISODate): boolean {
  const today = getTodayISO();
  return date > today;
}

/**
 * Sort dates in descending order (newest first)
 */
export function sortDatesDesc(dates: ISODate[]): ISODate[] {
  return [...dates].sort((a, b) => b.localeCompare(a));
}

/**
 * Sort dates in ascending order (oldest first)
 */
export function sortDatesAsc(dates: ISODate[]): ISODate[] {
  return [...dates].sort((a, b) => a.localeCompare(b));
}
