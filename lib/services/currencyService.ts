/**
 * Currency exchange rate service.
 *
 * DEVELOPMENT MODE: uses static, manually-curated fallback rates below.
 * These are NOT live and are clearly labeled as indicative.
 *
 * To wire a real provider later:
 *   1. Set EXCHANGE_RATE_API_KEY in your environment (see .env.example).
 *   2. Implement fetchLiveRates() to call your provider (e.g.
 *      exchangerate.host, Open Exchange Rates, currencylayer...).
 *   3. getExchangeRates() will prefer the live fetch and gracefully fall
 *      back to FALLBACK_RATES on any failure — never throw to the caller.
 */

export type CurrencyCode =
  | "SAR"
  | "USD"
  | "EUR"
  | "GBP"
  | "AED"
  | "KWD"
  | "QAR"
  | "BHD"
  | "OMR"
  | "JPY"
  | "CNY"
  | "CHF"
  | "CAD"
  | "AUD"
  | "INR"
  | "TRY";

export const CURRENCIES: { code: CurrencyCode; ar: string; en: string; symbol: string }[] = [
  { code: "SAR", ar: "ريال سعودي", en: "Saudi Riyal", symbol: "ر.س" },
  { code: "USD", ar: "دولار أمريكي", en: "US Dollar", symbol: "$" },
  { code: "EUR", ar: "يورو", en: "Euro", symbol: "€" },
  { code: "GBP", ar: "جنيه إسترليني", en: "British Pound", symbol: "£" },
  { code: "AED", ar: "درهم إماراتي", en: "UAE Dirham", symbol: "د.إ" },
  { code: "KWD", ar: "دينار كويتي", en: "Kuwaiti Dinar", symbol: "د.ك" },
  { code: "QAR", ar: "ريال قطري", en: "Qatari Riyal", symbol: "ر.ق" },
  { code: "BHD", ar: "دينار بحريني", en: "Bahraini Dinar", symbol: "د.ب" },
  { code: "OMR", ar: "ريال عماني", en: "Omani Rial", symbol: "ر.ع" },
  { code: "JPY", ar: "ين ياباني", en: "Japanese Yen", symbol: "¥" },
  { code: "CNY", ar: "يوان صيني", en: "Chinese Yuan", symbol: "¥" },
  { code: "CHF", ar: "فرنك سويسري", en: "Swiss Franc", symbol: "Fr" },
  { code: "CAD", ar: "دولار كندي", en: "Canadian Dollar", symbol: "$" },
  { code: "AUD", ar: "دولار أسترالي", en: "Australian Dollar", symbol: "$" },
  { code: "INR", ar: "روبية هندية", en: "Indian Rupee", symbol: "₹" },
  { code: "TRY", ar: "ليرة تركية", en: "Turkish Lira", symbol: "₺" },
];

/** Indicative rates, value of 1 unit of currency expressed in SAR. Example data. */
export const FALLBACK_RATES_TO_SAR: Record<CurrencyCode, number> = {
  SAR: 1,
  USD: 3.75,
  EUR: 4.07,
  GBP: 4.75,
  AED: 1.02,
  KWD: 12.22,
  QAR: 1.03,
  BHD: 9.95,
  OMR: 9.75,
  JPY: 0.025,
  CNY: 0.52,
  CHF: 4.25,
  CAD: 2.74,
  AUD: 2.48,
  INR: 0.045,
  TRY: 0.11,
};

export const RATES_LAST_UPDATED = "2026-08-01";

export interface ExchangeRateSnapshot {
  ratesToSar: Record<CurrencyCode, number>;
  lastUpdated: string;
  isLive: boolean;
}

async function fetchLiveRates(): Promise<ExchangeRateSnapshot | null> {
  const apiKey = process.env.EXCHANGE_RATE_API_KEY;
  if (!apiKey) return null;
  // NOTE: no live provider is wired up yet. Once one is chosen, fetch here
  // and map its response into { ratesToSar, lastUpdated, isLive: true }.
  // Intentionally returns null so callers fall back to static rates.
  return null;
}

export async function getExchangeRates(): Promise<ExchangeRateSnapshot> {
  const live = await fetchLiveRates();
  if (live) return live;
  return {
    ratesToSar: FALLBACK_RATES_TO_SAR,
    lastUpdated: RATES_LAST_UPDATED,
    isLive: false,
  };
}

export function convertCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  ratesToSar: Record<CurrencyCode, number> = FALLBACK_RATES_TO_SAR
): number {
  const inSar = amount * ratesToSar[from];
  return inSar / ratesToSar[to];
}
