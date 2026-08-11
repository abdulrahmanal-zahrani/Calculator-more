import { describe, it, expect } from "vitest";
import { calculateInstallment } from "../installment";

describe("calculateInstallment", () => {
  it("computes a fixed monthly installment", () => {
    const result = calculateInstallment({ price: 1200, downPayment: 0, annualRatePercent: 0, termMonths: 12 });
    expect(result.monthlyInstallment).toBe(100);
    expect(result.totalInterest).toBe(0);
  });

  it("applies down payment to reduce financed amount", () => {
    const result = calculateInstallment({ price: 1000, downPayment: 200, annualRatePercent: 0, termMonths: 8 });
    expect(result.financedAmount).toBe(800);
  });

  it("throws when down payment exceeds price", () => {
    expect(() =>
      calculateInstallment({ price: 100, downPayment: 200, annualRatePercent: 0, termMonths: 6 })
    ).toThrow();
  });

  it("throws on non-positive term", () => {
    expect(() => calculateInstallment({ price: 100, downPayment: 0, annualRatePercent: 0, termMonths: 0 })).toThrow();
  });
});
