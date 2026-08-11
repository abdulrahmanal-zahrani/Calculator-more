import { describe, it, expect } from "vitest";
import { calculateCurrencyConversion } from "../currency";

describe("calculateCurrencyConversion", () => {
  it("converts USD to SAR using fallback rates", () => {
    const result = calculateCurrencyConversion({ amount: 100, from: "USD", to: "SAR" });
    expect(result.converted).toBeCloseTo(375, 0);
  });

  it("returns same amount when converting to the same currency", () => {
    const result = calculateCurrencyConversion({ amount: 50, from: "SAR", to: "SAR" });
    expect(result.converted).toBe(50);
  });

  it("throws on negative amount", () => {
    expect(() => calculateCurrencyConversion({ amount: -10, from: "USD", to: "SAR" })).toThrow();
  });

  it("throws on unsupported currency", () => {
    // @ts-expect-error testing invalid input
    expect(() => calculateCurrencyConversion({ amount: 10, from: "XXX", to: "SAR" })).toThrow();
  });
});
