import { SAUDI_VAT_RATE } from "../config/vat";
import { KARAT_PURITY } from "../services/goldService";

export type Karat = 18 | 21 | 22 | 24;

export interface GoldCalculatorInput {
  weightGrams: number;
  karat: Karat;
  pricePerGram24k: number;
  makingChargePerGram?: number;
  vatRate?: number;
  mode?: "buy" | "sell";
}

export interface GoldCalculatorResult {
  purityFactor: number;
  effectivePricePerGram: number;
  rawValue: number;
  makingCharge: number;
  vatAmount: number;
  total: number;
}

export function calculateGoldValue(input: GoldCalculatorInput): GoldCalculatorResult {
  const { weightGrams, karat, pricePerGram24k, makingChargePerGram = 0 } = input;
  const vatRate = input.vatRate ?? SAUDI_VAT_RATE;
  const mode = input.mode ?? "buy";

  if (weightGrams < 0 || pricePerGram24k < 0 || makingChargePerGram < 0) {
    throw new Error("Gold calculator inputs must be non-negative.");
  }
  if (!KARAT_PURITY[karat]) {
    throw new Error(`Unsupported karat: ${karat}`);
  }

  const purityFactor = KARAT_PURITY[karat];
  const effectivePricePerGram = pricePerGram24k * purityFactor;
  const rawValue = round2(effectivePricePerGram * weightGrams);
  // Selling back typically excludes making charges (workshops rarely buy back labor).
  const makingCharge = mode === "sell" ? 0 : round2(makingChargePerGram * weightGrams);
  const vatAmount = mode === "sell" ? 0 : round2((rawValue + makingCharge) * vatRate);
  const total = round2(rawValue + makingCharge + vatAmount);

  return {
    purityFactor,
    effectivePricePerGram: round2(effectivePricePerGram),
    rawValue,
    makingCharge,
    vatAmount,
    total,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
