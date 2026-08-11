import { describe, it, expect } from "vitest";
import { calculateCoffeeRatio } from "../coffeeRatio";

describe("calculateCoffeeRatio", () => {
  it("solves for water given coffee and V60 ratio", () => {
    const result = calculateCoffeeRatio({ method: "v60", solveFor: "water", coffeeGrams: 20 });
    expect(result.waterMl).toBe(320);
  });

  it("solves for coffee given water", () => {
    const result = calculateCoffeeRatio({ method: "frenchPress", solveFor: "coffee", waterMl: 600 });
    expect(result.coffeeGrams).toBe(40);
  });

  it("solves for ratio given both", () => {
    const result = calculateCoffeeRatio({ method: "custom", solveFor: "ratio", coffeeGrams: 25, waterMl: 400 });
    expect(result.ratio).toBe(16);
  });

  it("throws on non-positive coffee when solving ratio", () => {
    expect(() => calculateCoffeeRatio({ method: "custom", solveFor: "ratio", coffeeGrams: 0, waterMl: 100 })).toThrow();
  });
});
