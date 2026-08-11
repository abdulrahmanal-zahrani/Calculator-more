import { describe, it, expect } from "vitest";
import { calculateCarLoan } from "../carLoan";

describe("calculateCarLoan", () => {
  it("computes financed amount after down payment", () => {
    const result = calculateCarLoan({ vehiclePrice: 80000, downPayment: 10000, annualRatePercent: 4, termMonths: 48 });
    expect(result.financedAmount).toBe(70000);
    expect(result.monthlyPayment).toBeGreaterThan(0);
    expect(result.amortization).toHaveLength(48);
  });

  it("handles zero interest", () => {
    const result = calculateCarLoan({ vehiclePrice: 12000, downPayment: 0, annualRatePercent: 0, termMonths: 12 });
    expect(result.monthlyPayment).toBe(1000);
  });
});
