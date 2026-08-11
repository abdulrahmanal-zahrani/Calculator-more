export type V60Preset = "beginner" | "balanced" | "strong" | "light" | "custom";

export const V60_PRESET_RATIOS: Record<Exclude<V60Preset, "custom">, number> = {
  beginner: 16,
  balanced: 15,
  strong: 13,
  light: 17,
};

export interface V60CalculatorInput {
  /** Basis for the calculation — provide exactly one of coffeeGrams / waterGrams. */
  coffeeGrams?: number;
  waterGrams?: number;
  cups?: number;
  waterPerCupMl?: number;
  ratio?: number; // water:coffee, e.g. 16 means 16g water per 1g coffee
  preset?: V60Preset;
}

export interface PourStep {
  label: { ar: string; en: string };
  atSeconds: number;
  targetWaterGrams: number;
}

export interface V60CalculatorResult {
  coffeeGrams: number;
  waterGrams: number;
  ratio: number;
  bloomWaterGrams: number;
  bloomTimeSeconds: number;
  pourSchedule: PourStep[];
  targetBrewTimeSeconds: number;
}

export function calculateV60Recipe(input: V60CalculatorInput): V60CalculatorResult {
  const cups = input.cups ?? 1;
  const waterPerCupMl = input.waterPerCupMl ?? 240;
  const preset = input.preset ?? "balanced";
  const ratio = input.ratio ?? (preset !== "custom" ? V60_PRESET_RATIOS[preset] : 15);

  if (cups <= 0 || waterPerCupMl <= 0 || ratio <= 0) {
    throw new Error("V60 calculator inputs must be positive.");
  }
  if (input.coffeeGrams != null && input.coffeeGrams < 0) {
    throw new Error("Coffee amount must be non-negative.");
  }
  if (input.waterGrams != null && input.waterGrams < 0) {
    throw new Error("Water amount must be non-negative.");
  }

  let waterGrams: number;
  let coffeeGrams: number;

  if (input.coffeeGrams != null) {
    coffeeGrams = input.coffeeGrams;
    waterGrams = round1(coffeeGrams * ratio);
  } else if (input.waterGrams != null) {
    waterGrams = input.waterGrams;
    coffeeGrams = round1(waterGrams / ratio);
  } else {
    waterGrams = round1(cups * waterPerCupMl);
    coffeeGrams = round1(waterGrams / ratio);
  }

  const bloomWaterGrams = round1(coffeeGrams * 2);
  const bloomTimeSeconds = 30;

  const remainingWater = waterGrams - bloomWaterGrams;
  const pourCount = 3;
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
    cumulative =
      i === pourCount ? waterGrams : round1(cumulative + pourChunk);
    pourSchedule.push({
      label: { ar: `الصب ${i}`, en: `Pour ${i}` },
      atSeconds: bloomTimeSeconds + i * 45,
      targetWaterGrams: cumulative,
    });
  }

  const targetBrewTimeSeconds = bloomTimeSeconds + pourCount * 45 + 30;

  return {
    coffeeGrams: round1(coffeeGrams),
    waterGrams: round1(waterGrams),
    ratio: round1(waterGrams / (coffeeGrams || 1)),
    bloomWaterGrams,
    bloomTimeSeconds,
    pourSchedule,
    targetBrewTimeSeconds,
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
