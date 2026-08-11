export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "veryActive";
export type ProteinGoal = "maintain" | "loseFat" | "buildMuscle";

// Grams of protein per kg of bodyweight, by goal (general population estimates).
const GOAL_RANGE: Record<ProteinGoal, [number, number]> = {
  maintain: [0.8, 1.2],
  loseFat: [1.6, 2.2],
  buildMuscle: [1.6, 2.2],
};

export interface ProteinCalculatorInput {
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: ProteinGoal;
  mealsPerDay?: number;
}

export interface ProteinCalculatorResult {
  gramsPerDayLow: number;
  gramsPerDayHigh: number;
  gramsPerMealLow: number;
  gramsPerMealHigh: number;
}

export function calculateProtein(input: ProteinCalculatorInput): ProteinCalculatorResult {
  const { weightKg, goal, mealsPerDay = 3 } = input;

  if (weightKg <= 0 || !Number.isFinite(weightKg)) {
    throw new Error("Weight must be a positive number.");
  }
  if (mealsPerDay <= 0 || !Number.isFinite(mealsPerDay)) {
    throw new Error("Meals per day must be a positive number.");
  }

  const [low, high] = GOAL_RANGE[goal];
  const gramsPerDayLow = round1(weightKg * low);
  const gramsPerDayHigh = round1(weightKg * high);

  return {
    gramsPerDayLow,
    gramsPerDayHigh,
    gramsPerMealLow: round1(gramsPerDayLow / mealsPerDay),
    gramsPerMealHigh: round1(gramsPerDayHigh / mealsPerDay),
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
