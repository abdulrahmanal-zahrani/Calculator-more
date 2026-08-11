import { describe, it, expect } from "vitest";
import { calculateCoffeeRecipe } from "../coffeeRecipe";

describe("calculateCoffeeRecipe", () => {
  it("solves for water given coffee and V60 ratio", () => {
    const result = calculateCoffeeRecipe({ method: "v60", solveFor: "water", coffeeGrams: 20, ratio: 16 });
    expect(result.waterGrams).toBe(320);
  });

  it("solves for coffee given water and French Press ratio", () => {
    const result = calculateCoffeeRecipe({ method: "frenchPress", solveFor: "coffee", waterGrams: 600, ratio: 15 });
    expect(result.coffeeGrams).toBe(40);
  });

  it("solves for ratio given both coffee and water", () => {
    const result = calculateCoffeeRecipe({ method: "custom", solveFor: "ratio", coffeeGrams: 25, waterGrams: 400 });
    expect(result.ratio).toBe(16);
  });

  it("throws on non-positive coffee when solving ratio", () => {
    expect(() =>
      calculateCoffeeRecipe({ method: "custom", solveFor: "ratio", coffeeGrams: 0, waterGrams: 100 })
    ).toThrow();
  });

  it("falls back to the brew method's default ratio when none is given", () => {
    const result = calculateCoffeeRecipe({ method: "coldBrew", solveFor: "water", coffeeGrams: 100 });
    expect(result.waterGrams).toBe(800);
  });

  it("derives water from coffee grams using ratio", () => {
    const result = calculateCoffeeRecipe({ method: "v60", solveFor: "water", coffeeGrams: 20, ratio: 16 });
    expect(result.coffeeGrams).toBe(20);
    expect(result.waterGrams).toBe(320);
  });

  it("derives coffee from water grams using ratio", () => {
    const result = calculateCoffeeRecipe({ method: "v60", solveFor: "coffee", waterGrams: 300, ratio: 15 });
    expect(result.coffeeGrams).toBe(20);
  });

  it("produces a pour schedule that ends at the total water amount", () => {
    const result = calculateCoffeeRecipe({ method: "v60", solveFor: "water", coffeeGrams: 15, ratio: 15 });
    const lastPour = result.pourSchedule[result.pourSchedule.length - 1];
    expect(lastPour.targetWaterGrams).toBe(result.waterGrams);
  });

  it("throws on negative coffee", () => {
    expect(() => calculateCoffeeRecipe({ method: "v60", solveFor: "water", coffeeGrams: -5 })).toThrow();
  });

  it("throws on negative water", () => {
    expect(() => calculateCoffeeRecipe({ method: "v60", solveFor: "coffee", waterGrams: -5 })).toThrow();
  });
});
