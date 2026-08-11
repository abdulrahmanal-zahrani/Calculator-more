import { describe, it, expect } from "vitest";
import { calculateLoanPayment } from "../loan";

describe("calculateLoanPayment", () => {
  it("computes a standard amortizing loan", () => {
    const result = calculateLoanPayment({ amount: 12000, annualRatePercent: 6, termMonths: 12 });
    expect(result.amortization).toHaveLength(12);
    expect(result.monthlyPayment).toBeGreaterThan(0);
    expect(result.amortization[11].balance).toBe(0);
    expect(result.totalRepayment).toBeCloseTo(result.monthlyPayment * 12, 0);
  });

  it("handles zero interest rate as straight-line", () => {
    const result = calculateLoanPayment({ amount: 1200, annualRatePercent: 0, termMonths: 12 });
    expect(result.monthlyPayment).toBe(100);
    expect(result.totalInterest).toBe(0);
  });

  it("applies down payment and fees to principal", () => {
    const result = calculateLoanPayment({
      amount: 10000,
      annualRatePercent: 5,
      termMonths: 12,
      downPayment: 2000,
      fees: 100,
    });
    expect(result.principal).toBe(8100);
  });

  it("throws when down payment exceeds amount", () => {
    expect(() =>
      calculateLoanPayment({ amount: 1000, annualRatePercent: 5, termMonths: 12, downPayment: 2000 })
    ).toThrow();
  });

  it("throws on non-positive term", () => {
    expect(() => calculateLoanPayment({ amount: 1000, annualRatePercent: 5, termMonths: 0 })).toThrow();
  });
});
