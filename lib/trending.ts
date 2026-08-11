import { FLAGSHIP_CALCULATORS, type CalculatorMeta } from "@/lib/calculatorRegistry";

const RECENT_KEY = "hesabi:recentCalculators";
const MAX_RECENT = 6;

// Static initial "popular" ordering — a reasonable editorial guess for
// launch, since there's no analytics backend yet to rank by real usage.
// TODO: once real usage analytics exist (see lib/analytics.ts), replace
// this hardcoded order with a ranking derived from actual event counts.
const POPULAR_SLUGS = [
  "gold-calculator",
  "salary-calculator",
  "currency-converter",
  "loan-calculator",
  "vat-calculator",
  "fuel-cost-calculator",
  "v60-calculator",
  "trip-budget-calculator",
];

export function getPopularCalculators(limit = 8): CalculatorMeta[] {
  const bySlug = new Map(FLAGSHIP_CALCULATORS.map((c) => [c.slug, c]));
  const popular = POPULAR_SLUGS.map((slug) => bySlug.get(slug)).filter((c): c is CalculatorMeta => Boolean(c));
  return popular.slice(0, limit);
}

export function recordRecentlyUsed(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    const existing: string[] = JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]");
    const next = [slug, ...existing.filter((s) => s !== slug)].slice(0, MAX_RECENT);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // localStorage unavailable (private mode, disabled) — silently skip.
  }
}

export function getRecentlyUsedCalculators(): CalculatorMeta[] {
  if (typeof window === "undefined") return [];
  try {
    const slugs: string[] = JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]");
    const bySlug = new Map(FLAGSHIP_CALCULATORS.map((c) => [c.slug, c]));
    return slugs.map((s) => bySlug.get(s)).filter((c): c is CalculatorMeta => Boolean(c));
  } catch {
    return [];
  }
}
