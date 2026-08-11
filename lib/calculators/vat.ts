import { SAUDI_VAT_RATE } from "@/lib/config/vat";

export interface VatCalculatorInput {
  amount: number;
  ratePercent?: number;
  mode: "exclusive" | "inclusive";
}

export interface VatCalculatorResult {
  netAmount: number;
  vatAmount: number;
  grossAmount: number;
}

export function calculateVat(input: VatCalculatorInput): VatCalculatorResult {
  const { amount, mode } = input;
  const ratePercent = input.ratePercent ?? SAUDI_VAT_RATE * 100;

  if (amount < 0 || !Number.isFinite(amount)) {
    throw new Error("Amount must be a non-negative finite number.");
  }
  if (ratePercent < 0 || !Number.isFinite(ratePercent)) {
    throw new Error("VAT rate must be a non-negative finite number.");
  }

  const rate = ratePercent / 100;

  if (mode === "exclusive") {
    const netAmount = round2(amount);
    const vatAmount = round2(amount * rate);
    return { netAmount, vatAmount, grossAmount: round2(netAmount + vatAmount) };
  }

  // inclusive: amount already contains VAT — reverse it out
  const netAmount = round2(amount / (1 + rate));
  const grossAmount = round2(amount);
  const vatAmount = round2(grossAmount - netAmount);
  return { netAmount, vatAmount, grossAmount };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
