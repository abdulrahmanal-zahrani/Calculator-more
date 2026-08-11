import { describe, it, expect } from "vitest";
import { calculateLuggage, kgToLb, lbToKg } from "../luggage";

describe("calculateLuggage", () => {
  it("computes remaining allowance when under limit", () => {
    const result = calculateLuggage({ allowanceKg: 30, bags: [{ name: "Suitcase", weightKg: 20 }] });
    expect(result.isOverAllowance).toBe(false);
    expect(result.remainingAllowanceKg).toBe(10);
  });

  it("flags overage", () => {
    const result = calculateLuggage({ allowanceKg: 20, bags: [{ name: "Suitcase", weightKg: 25 }] });
    expect(result.isOverAllowance).toBe(true);
    expect(result.overageKg).toBe(5);
  });

  it("converts kg to lb and back", () => {
    expect(kgToLb(10)).toBeCloseTo(22.05, 1);
    expect(lbToKg(22.05)).toBeCloseTo(10, 1);
  });
});
