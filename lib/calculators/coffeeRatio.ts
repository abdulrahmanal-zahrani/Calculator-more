export type BrewMethod = "v60" | "frenchPress" | "aeropress" | "chemex" | "coldBrew" | "custom";

export const BREW_RATIOS: Record<BrewMethod, number> = {
  v60: 16,
  frenchPress: 15,
  aeropress: 15,
  chemex: 16.5,
  coldBrew: 8,
  custom: 16,
};

export type SolveFor = "water" | "coffee" | "ratio";

export interface CoffeeRatioInput {
  method: BrewMethod;
  solveFor: SolveFor;
  coffeeGrams?: number;
  waterMl?: number;
  ratio?: number;
}

export interface CoffeeRatioResult {
  coffeeGrams: number;
  waterMl: number;
  ratio: number;
}

export function calculateCoffeeRatio(input: CoffeeRatioInput): CoffeeRatioResult {
  const { solveFor, method } = input;
  const ratio = input.ratio ?? BREW_RATIOS[method];

  if (ratio <= 0 || !Number.isFinite(ratio)) {
    throw new Error("Ratio must be a positive number.");
  }

  if (solveFor === "water") {
    const coffeeGrams = input.coffeeGrams ?? 0;
    if (coffeeGrams < 0) throw new Error("Coffee grams must be non-negative.");
    return { coffeeGrams: round1(coffeeGrams), waterMl: round1(coffeeGrams * ratio), ratio: round2(ratio) };
  }

  if (solveFor === "coffee") {
    const waterMl = input.waterMl ?? 0;
    if (waterMl < 0) throw new Error("Water must be non-negative.");
    return { coffeeGrams: round1(waterMl / ratio), waterMl: round1(waterMl), ratio: round2(ratio) };
  }

  // solveFor === "ratio"
  const coffeeGrams = input.coffeeGrams ?? 0;
  const waterMl = input.waterMl ?? 0;
  if (coffeeGrams <= 0 || waterMl < 0) {
    throw new Error("Coffee grams must be positive and water non-negative to derive a ratio.");
  }
  return { coffeeGrams: round1(coffeeGrams), waterMl: round1(waterMl), ratio: round2(waterMl / coffeeGrams) };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
