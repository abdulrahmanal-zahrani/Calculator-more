import { describe, it, expect } from "vitest";
import { calculateGoldValue } from "../gold";

describe("calculateGoldValue", () => {
  it("computes value for 21K gold with making charge and VAT", () => {
    const result = calculateGoldValue({
      weightGrams: 10,
      karat: 21,
      pricePerGram24k: 300,
      makingChargePerGram: 10,
      vatRate: 0.15,
    });
    expect(result.purityFactor).toBeCloseTo(21 / 24);
    expect(result.effectivePricePerGram).toBeCloseTo(262.5, 1);
    expect(result.rawValue).toBeCloseTo(2625, 1);
    expect(result.makingCharge).toBe(100);
    expect(result.vatAmount).toBeCloseTo((2625 + 100) * 0.15, 1);
    expect(result.total).toBeCloseTo(2625 + 100 + (2625 + 100) * 0.15, 1);
  });

  it("handles zero weight", () => {
    const result = calculateGoldValue({ weightGrams: 0, karat: 24, pricePerGram24k: 300 });
    expect(result.total).toBe(0);
  });

  it("excludes making charge and VAT in sell mode", () => {
    const result = calculateGoldValue({
      weightGrams: 5,
      karat: 24,
      pricePerGram24k: 300,
      makingChargePerGram: 20,
      mode: "sell",
    });
    expect(result.makingCharge).toBe(0);
    expect(result.vatAmount).toBe(0);
    expect(result.total).toBe(1500);
  });

  it("throws on negative weight", () => {
    expect(() => calculateGoldValue({ weightGrams: -1, karat: 24, pricePerGram24k: 300 })).toThrow();
  });

  it("throws on unsupported karat", () => {
    // @ts-expect-error testing invalid input
    expect(() => calculateGoldValue({ weightGrams: 1, karat: 10, pricePerGram24k: 300 })).toThrow();
  });
});
