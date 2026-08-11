export type Sex = "male" | "female";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "veryActive";
export type Goal = "lose" | "maintain" | "gain";

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

export interface CaloriesCalculatorInput {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
}

export interface CaloriesCalculatorResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  rangeLow: number;
  rangeHigh: number;
}

export function calculateCalories(input: CaloriesCalculatorInput): CaloriesCalculatorResult {
  const { sex, age, heightCm, weightKg, activityLevel, goal } = input;

  if (age <= 0 || heightCm <= 0 || weightKg <= 0) {
    throw new Error("Age, height, and weight must be positive numbers.");
  }

  // Mifflin-St Jeor equation
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const bmr = round0(sex === "male" ? base + 5 : base - 161);
  const tdee = round0(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);

  let targetCalories = tdee;
  if (goal === "lose") targetCalories = round0(tdee - 500);
  if (goal === "gain") targetCalories = round0(tdee + 500);

  const rangeLow = round0(targetCalories * 0.95);
  const rangeHigh = round0(targetCalories * 1.05);

  return { bmr, tdee, targetCalories: Math.max(0, targetCalories), rangeLow: Math.max(0, rangeLow), rangeHigh: Math.max(0, rangeHigh) };
}

function round0(n: number): number {
  return Math.round(n);
}
