export type BrewMethod = "v60" | "frenchPress" | "aeropress" | "chemex" | "coldBrew" | "custom";

/** Sensible default water:coffee ratio per brew method — a starting point only, always editable. */
export const BREW_METHOD_RATIOS: Record<BrewMethod, number> = {
  v60: 16,
  frenchPress: 15,
  aeropress: 15,
  chemex: 16,
  coldBrew: 8,
  custom: 16,
};

export type CoffeePreset = "light" | "balanced" | "strong" | "custom";

/** Preset ratios — starting values only, never locked; the user can edit any field afterward. */
export const PRESET_RATIOS: Record<Exclude<CoffeePreset, "custom">, number> = {
  light: 17,
  balanced: 16,
  strong: 13,
};

export type SolveFor = "water" | "coffee" | "ratio";

export interface CoffeeRecipeInput {
  method: BrewMethod;
  /** Which field the user just edited / wants derived from the other two. */
  solveFor: SolveFor;
  coffeeGrams?: number;
  waterGrams?: number;
  ratio?: number;
  bloomMultiplier?: number;
  pourCount?: number;
}

export interface PourStep {
  label: { ar: string; en: string };
  atSeconds: number;
  targetWaterGrams: number;
}

export interface CoffeeRecipeResult {
  coffeeGrams: number;
  waterGrams: number;
  ratio: number;
  bloomWaterGrams: number;
  bloomTimeSeconds: number;
  pourSchedule: PourStep[];
  targetBrewTimeSeconds: number;
}

export function calculateCoffeeRecipe(input: CoffeeRecipeInput): CoffeeRecipeResult {
  const { method, solveFor, bloomMultiplier = 2, pourCount = 3 } = input;

  let coffeeGrams: number;
  let waterGrams: number;
  let ratio: number;

  if (solveFor === "water") {
    coffeeGrams = input.coffeeGrams ?? 0;
    ratio = input.ratio ?? BREW_METHOD_RATIOS[method];
    if (coffeeGrams < 0) throw new Error("Coffee grams must be non-negative.");
    if (ratio <= 0 || !Number.isFinite(ratio)) throw new Error("Ratio must be a positive number.");
    waterGrams = round1(coffeeGrams * ratio);
  } else if (solveFor === "coffee") {
    waterGrams = input.waterGrams ?? 0;
    ratio = input.ratio ?? BREW_METHOD_RATIOS[method];
    if (waterGrams < 0) throw new Error("Water must be non-negative.");
    if (ratio <= 0 || !Number.isFinite(ratio)) throw new Error("Ratio must be a positive number.");
    coffeeGrams = round1(waterGrams / ratio);
  } else {
    // solveFor === "ratio"
    coffeeGrams = input.coffeeGrams ?? 0;
    waterGrams = input.waterGrams ?? 0;
    if (coffeeGrams <= 0 || waterGrams < 0) {
      throw new Error("Coffee grams must be positive and water non-negative to derive a ratio.");
    }
    ratio = waterGrams / coffeeGrams;
  }

  coffeeGrams = round1(coffeeGrams);
  waterGrams = round1(waterGrams);
  ratio = round2(ratio);

  const bloomWaterGrams = round1(coffeeGrams * bloomMultiplier);
  const bloomTimeSeconds = 30;

  const remainingWater = waterGrams - bloomWaterGrams;
  const pourChunk = round1(remainingWater / pourCount);

  const pourSchedule: PourStep[] = [
    {
      label: { ar: "التبليل (Bloom)", en: "Bloom" },
      atSeconds: 0,
      targetWaterGrams: bloomWaterGrams,
    },
  ];

  let cumulative = bloomWaterGrams;
  for (let i = 1; i <= pourCount; i++) {
    cumulative = i === pourCount ? waterGrams : round1(cumulative + pourChunk);
    pourSchedule.push({
      label: { ar: `الصب ${i}`, en: `Pour ${i}` },
      atSeconds: bloomTimeSeconds + i * 45,
      targetWaterGrams: cumulative,
    });
  }

  const targetBrewTimeSeconds = bloomTimeSeconds + pourCount * 45 + 30;

  return {
    coffeeGrams,
    waterGrams,
    ratio,
    bloomWaterGrams,
    bloomTimeSeconds,
    pourSchedule,
    targetBrewTimeSeconds,
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
