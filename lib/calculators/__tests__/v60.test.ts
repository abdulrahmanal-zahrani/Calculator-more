import { describe, it, expect } from "vitest";
import { calculateV60Recipe } from "../v60";

describe("calculateV60Recipe", () => {
  it("derives water from coffee grams using ratio", () => {
    const result = calculateV60Recipe({ coffeeGrams: 20, ratio: 16 });
    expect(result.coffeeGrams).toBe(20);
    expect(result.waterGrams).toBe(320);
  });

  it("derives coffee from water grams using ratio", () => {
    const result = calculateV60Recipe({ waterGrams: 300, ratio: 15 });
    expect(result.coffeeGrams).toBe(20);
  });

  it("falls back to cups * water per cup when neither is given", () => {
    const result = calculateV60Recipe({ cups: 2, waterPerCupMl: 240, preset: "balanced" });
    expect(result.waterGrams).toBe(480);
    expect(result.coffeeGrams).toBe(32);
  });

  it("produces a pour schedule that ends at the total water amount", () => {
    const result = calculateV60Recipe({ coffeeGrams: 15, ratio: 15 });
    const lastPour = result.pourSchedule[result.pourSchedule.length - 1];
    expect(lastPour.targetWaterGrams).toBe(result.waterGrams);
  });

  it("throws on negative coffee", () => {
    expect(() => calculateV60Recipe({ coffeeGrams: -5 })).toThrow();
  });
});
