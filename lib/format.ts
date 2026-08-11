import type { Locale } from "@/i18n";

export function formatNumber(value: number, locale: Locale, maximumFractionDigits = 2): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatCurrency(value: number, locale: Locale, currency = "SAR", maximumFractionDigits = 2): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits,
  }).format(value);
}

/**
 * Formats a plain percentage number (e.g. 15 -> "15%" / "١٥٪") via Intl's
 * "percent" style, which expects a 0-1 fraction — so `value` here is a
 * percentage points value (0-100) and gets divided by 100 first. Keeps
 * locale-correct digit shapes and the percent sign position (RTL-aware).
 */
export function formatPercent(value: number, locale: Locale, maximumFractionDigits = 2): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", {
    style: "percent",
    maximumFractionDigits,
  }).format(value / 100);
}
