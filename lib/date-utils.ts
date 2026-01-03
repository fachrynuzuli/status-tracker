/**
 * Date utility functions for timezone-aware calculations
 * Specifically designed for Asia/Jakarta (WIB) timezone
 */

/**
 * Check if a year is a leap year
 * A leap year is divisible by 4, except for years divisible by 100 unless also divisible by 400
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Get the total number of days in a year
 */
export function daysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

/**
 * Convert a Date to a specific timezone and return date components
 */
function getDateInTimezone(date: Date, timezone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value;

  return {
    year: parseInt(get("year") || "0"),
    month: parseInt(get("month") || "0"),
    day: parseInt(get("day") || "0"),
    hour: parseInt(get("hour") || "0"),
    minute: parseInt(get("minute") || "0"),
    second: parseInt(get("second") || "0"),
  };
}

/**
 * Get the day of year (1-366) for a given date in a specific timezone
 */
export function getDayOfYear(date: Date, timezone: string): number {
  const tzDate = getDateInTimezone(date, timezone);
  
  // Create a date object for the start of the year in the target timezone
  const startOfYear = new Date(Date.UTC(tzDate.year, 0, 1));
  const currentDate = new Date(Date.UTC(tzDate.year, tzDate.month - 1, tzDate.day));
  
  // Calculate the difference in days
  const diffTime = currentDate.getTime() - startOfYear.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays + 1; // +1 because Jan 1 is day 1, not day 0
}

/**
 * Get the number of days remaining in the year for a given date in a specific timezone
 */
export function getDaysRemainingInYear(date: Date, timezone: string): number {
  const tzDate = getDateInTimezone(date, timezone);
  const totalDays = daysInYear(tzDate.year);
  const currentDay = getDayOfYear(date, timezone);
  
  return totalDays - currentDay;
}

/**
 * Get comprehensive date information for a specific timezone
 */
export function getDateInfo(date: Date, timezone: string, targetYear?: number) {
  const tzDate = getDateInTimezone(date, timezone);
  const year = targetYear || tzDate.year;
  const dayOfYear = getDayOfYear(date, timezone);
  const daysRemaining = getDaysRemainingInYear(date, timezone);
  const totalDays = daysInYear(year);
  const progress = (dayOfYear / totalDays) * 100;

  return {
    date: tzDate,
    year,
    dayOfYear,
    daysRemaining,
    totalDays,
    progress,
    isLeap: isLeapYear(year),
  };
}
