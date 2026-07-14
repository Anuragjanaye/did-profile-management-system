import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS class names, resolving conflicts intelligently.
 * Uses clsx for conditional logic and tailwind-merge for deduplication.
 *
 * @example cn("px-4 py-2", condition && "bg-blue-500", "px-6") → "py-2 bg-blue-500 px-6"
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
