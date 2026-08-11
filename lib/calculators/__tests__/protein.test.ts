import { describe, it, expect } from "vitest";
import { calculateProtein } from "../protein";

describe("calculateProtein", () => {
  it("computes a range for building muscle", () => {
    const result = calculateProtein({ weightKg: 70, activityLevel: "active", goal: "buildMuscle" });
    expect(result.gramsPerDayLow).toBe(112);
    expect(result.gramsPerDayHigh).toBe(154);
  });

  it("divides by meals per day", () => {
    const result = calculateProtein({ weightKg: 60, activityLevel: "moderate", goal: "maintain", mealsPerDay: 4 });
    expect(result.gramsPerMealLow).toBeCloseTo(result.gramsPerDayLow / 4, 5);
  });

  it("throws on non-positive weight", () => {
    expect(() => calculateProtein({ weightKg: 0, activityLevel: "moderate", goal: "maintain" })).toThrow();
  });
});
