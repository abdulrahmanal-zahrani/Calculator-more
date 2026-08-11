export interface DiscountCalculatorInput {
  originalPrice: number;
  discountPercents: number[];
}

export interface DiscountStepBreakdown {
  percent: number;
  priceBefore: number;
  amountOff: number;
  priceAfter: number;
}

export interface DiscountCalculatorResult {
  originalPrice: number;
  finalPrice: number;
  totalSavings: number;
  effectiveDiscountPercent: number;
  breakdown: DiscountStepBreakdown[];
}

export function calculateDiscount(input: DiscountCalculatorInput): DiscountCalculatorResult {
  const { originalPrice } = input;
  const discountPercents = input.discountPercents ?? [];

  if (originalPrice < 0) {
    throw new Error("Original price must be non-negative.");
  }
  if (discountPercents.some((p) => p < 0 || p > 100)) {
    throw new Error("Discount percentages must be between 0 and 100.");
  }

  const breakdown: DiscountStepBreakdown[] = [];
  let current = originalPrice;

  for (const percent of discountPercents) {
    const priceBefore = current;
    const amountOff = round2(priceBefore * (percent / 100));
    const priceAfter = round2(priceBefore - amountOff);
    breakdown.push({ percent, priceBefore, amountOff, priceAfter });
    current = priceAfter;
  }

  const finalPrice = round2(current);
  const totalSavings = round2(originalPrice - finalPrice);
  const effectiveDiscountPercent =
    originalPrice > 0 ? round2((totalSavings / originalPrice) * 100) : 0;

  return { originalPrice, finalPrice, totalSavings, effectiveDiscountPercent, breakdown };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
