import { CurrencyCode, FALLBACK_RATES_TO_SAR } from "../services/currencyService";

export interface CurrencyConvertInput {
  amount: number;
  from: CurrencyCode;
  to: CurrencyCode;
  ratesToSar?: Record<CurrencyCode, number>;
}

export interface CurrencyConvertResult {
  amount: number;
  from: CurrencyCode;
  to: CurrencyCode;
  converted: number;
  rate: number;
}

export function calculateCurrencyConversion(input: CurrencyConvertInput): CurrencyConvertResult {
  const { amount, from, to } = input;
  const ratesToSar = input.ratesToSar ?? FALLBACK_RATES_TO_SAR;

  if (amount < 0) {
    throw new Error("Amount must be non-negative.");
  }
  if (!ratesToSar[from] || !ratesToSar[to]) {
    throw new Error("Unsupported currency code.");
  }

  const rate = ratesToSar[from] / ratesToSar[to];
  const converted = round4(amount * rate);

  return { amount, from, to, converted, rate: round6(rate) };
}

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}
function round6(n: number): number {
  return Math.round(n * 1e6) / 1e6;
}
