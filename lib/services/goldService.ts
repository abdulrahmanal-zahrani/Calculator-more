/**
 * Gold price service.
 *
 * DEVELOPMENT MODE: no live provider is configured. Users must enter the
 * current price per gram manually in the Gold Calculator. This file is the
 * seam where a real provider (e.g. goldapi.io, metals-api.com) plugs in.
 *
 * To wire a real provider later:
 *   1. Set GOLD_PRICE_API_KEY in your environment (see .env.example).
 *   2. Implement fetchLiveGoldPrice() below to call the provider and return
 *      SAR-per-gram price for 24K gold.
 *   3. getGoldPrice24k() will prefer the live fetch and fall back to `null`
 *      (forcing manual entry) on any failure.
 */

export interface GoldPriceSnapshot {
  pricePerGram24kSar: number;
  lastUpdated: string;
  isLive: boolean;
}

async function fetchLiveGoldPrice(): Promise<GoldPriceSnapshot | null> {
  const apiKey = process.env.GOLD_PRICE_API_KEY;
  if (!apiKey) return null;
  // NOTE: no live provider is wired up yet. Implement the real fetch here.
  return null;
}

/** Returns null when no live price is available — caller must prompt manual entry. */
export async function getGoldPrice24k(): Promise<GoldPriceSnapshot | null> {
  return fetchLiveGoldPrice();
}

export const KARAT_PURITY: Record<18 | 21 | 22 | 24, number> = {
  18: 18 / 24,
  21: 21 / 24,
  22: 22 / 24,
  24: 1,
};
