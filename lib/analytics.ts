/**
 * Privacy-conscious analytics abstraction.
 *
 * No third-party analytics SDK is wired up — there are no API keys/site IDs
 * available in this environment, and we never fabricate a live integration.
 * `trackEvent` currently no-ops (aside from an optional console debug trace)
 * but every interaction point in the app already calls it, so swapping in a
 * real privacy-respecting provider (Plausible, Umami, GA4, etc.) later is a
 * one-line change inside this file — no call sites need to change.
 *
 * To wire a real provider:
 *   1. Add the provider's script/init call behind an env var, e.g.
 *      NEXT_PUBLIC_ANALYTICS_PROVIDER=plausible (document it in .env.example).
 *   2. Replace the body of `trackEvent` with a call into that provider's SDK.
 */

export type AnalyticsEventName =
  | "calculator_view"
  | "calculator_result_computed"
  | "calculator_share"
  | "calculator_copy_link"
  | "search_query"
  | "search_result_click";

export interface AnalyticsEventProps {
  calculatorSlug?: string;
  locale?: string;
  query?: string;
  [key: string]: string | number | boolean | undefined;
}

const DEBUG = process.env.NODE_ENV === "development";

export function trackEvent(name: AnalyticsEventName, props: AnalyticsEventProps = {}): void {
  // Intentional no-op in production — no analytics provider is configured.
  // See the module doc comment for how to wire a real provider later.
  if (DEBUG && typeof window !== "undefined") {
    console.debug("[analytics]", name, props);
  }
}
