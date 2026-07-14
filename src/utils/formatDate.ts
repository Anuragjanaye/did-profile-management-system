/**
 * Formats a date value into a human-readable string.
 *
 * @example formatDate(new Date()) → "July 14, 2026"
 * @example formatDate("2024-01-15") → "January 15, 2024"
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
}

/**
 * Formats a date as a relative time string.
 * @example formatRelativeTime(new Date(Date.now() - 60_000)) → "1 minute ago"
 */
export function formatRelativeTime(date: Date | string | number): string {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const diff = new Date(date).getTime() - Date.now();
  const seconds = Math.round(diff / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (Math.abs(seconds) < 60) return rtf.format(seconds, "second");
  if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
  return rtf.format(days, "day");
}
