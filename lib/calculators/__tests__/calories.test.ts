import { describe, it, expect } from "vitest";
import { calculateCalories } from "../calories";

describe("calculateCalories", () => {
  it("computes BMR and TDEE for maintain goal", () => {
    const result = calculateCalories({
      sex: "male",
      age: 30,
      heightCm: 180,
      weightKg: 80,
      activityLevel: "moderate",
      goal: "maintain",
    });
    expect(result.bmr).toBeGreaterThan(1500);
    expect(result.targetCalories).toBe(result.tdee);
  });

  it("subtracts a deficit for lose goal", () => {
    const result = calculateCalories({
      sex: "female",
      age: 25,
      heightCm: 165,
      weightKg: 60,
      activityLevel: "sedentary",
      goal: "lose",
    });
    expect(result.targetCalories).toBe(result.tdee - 500);
  });

  it("throws on non-positive inputs", () => {
    expect(() =>
      calculateCalories({ sex: "male", age: 0, heightCm: 180, weightKg: 80, activityLevel: "active", goal: "gain" })
    ).toThrow();
  });
});
