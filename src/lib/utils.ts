import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes with clsx conditionals without style conflicts.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats an integer amount stored in paise to Indian Rupees (INR).
 * Example: 4000 -> ₹40, 0 -> "Free Entry"
 */
export function formatPaiseToINR(
  paise: number,
  options?: { showFree?: boolean }
): string {
  if (paise === 0 && options?.showFree !== false) {
    return "Free Entry";
  }
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: rupees % 1 === 0 ? 0 : 2,
  }).format(rupees);
}

/**
 * Formats a Date object to readable Indian Standard Time string.
 * Example: "15 Nov 2026, 06:00 PM"
 */
export function formatDateTimeIST(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

/**
 * Formats a Date object to date only string.
 * Example: "15 Nov 2026"
 */
export function formatDateIST(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

