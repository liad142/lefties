import { format, formatDistanceToNow, isToday, isTomorrow } from "date-fns";
import { he } from "date-fns/locale";

/**
 * Format date relative to now (e.g., "2 hours ago", "in 3 days")
 * @param date - Date to format
 * @returns Relative time string in Hebrew
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: he });
}

/**
 * Format date for display (e.g., "Today", "Tomorrow", "15/12/2024")
 * @param date - Date to format
 * @returns Formatted date string in Hebrew
 */
export function formatDisplayDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isToday(dateObj)) {
    return "היום";
  }

  if (isTomorrow(dateObj)) {
    return "מחר";
  }

  return format(dateObj, "dd/MM/yyyy", { locale: he });
}

/**
 * Format time for display (e.g., "14:30")
 * @param date - Date to format
 * @returns Time string in 24-hour format
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "HH:mm");
}

/**
 * Check if a date is in the past
 * @param date - Date to check
 * @returns True if date is in the past
 */
export function isPast(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.getTime() < Date.now();
}
