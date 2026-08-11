/**
 * Indicative Saudi fuel prices (SAR/liter). These are EXAMPLE seed values for
 * development only — not a live feed. Real pricing should come from an
 * official source (e.g. Aramco / General Authority pricing announcements)
 * wired through an env-configured service later.
 */
export type FuelType = "gasoline91" | "gasoline95" | "gasoline98" | "diesel";

export const FUEL_PRICES_SAR: Record<FuelType, number> = {
  gasoline91: 2.18,
  gasoline95: 2.33,
  gasoline98: 2.6,
  diesel: 1.63,
};

export const FUEL_LABELS: Record<FuelType, { ar: string; en: string }> = {
  gasoline91: { ar: "بنزين 91", en: "Gasoline 91" },
  gasoline95: { ar: "بنزين 95", en: "Gasoline 95" },
  gasoline98: { ar: "بنزين 98", en: "Gasoline 98" },
  diesel: { ar: "ديزل", en: "Diesel" },
};

export const FUEL_PRICE_NOTE = {
  ar: "الأسعار تقريبية لأغراض العرض فقط وقد تختلف عن السعر الفعلي.",
  en: "Prices are indicative examples for demo purposes and may differ from actual pump prices.",
};
