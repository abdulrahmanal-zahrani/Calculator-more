import { describe, it, expect } from "vitest";
import { calculateSalary } from "../salary";

describe("calculateSalary", () => {
  it("computes gross/net correctly", () => {
    const result = calculateSalary({
      basic: 5000,
      housingAllowance: 1000,
      transportAllowance: 500,
      otherAllowances: 200,
      deductions: 300,
    });
    expect(result.grossMonthly).toBe(6700);
    expect(result.netMonthly).toBe(6400);
    expect(result.netAnnual).toBe(76800);
  });

  it("defaults optional fields to zero", () => {
    const result = calculateSalary({ basic: 4000 });
    expect(result.grossMonthly).toBe(4000);
    expect(result.netMonthly).toBe(4000);
  });

  it("throws on negative basic salary", () => {
    expect(() => calculateSalary({ basic: -1 })).toThrow();
  });

  it("handles deductions exceeding allowances (net can be negative)", () => {
    const result = calculateSalary({ basic: 1000, deductions: 5000 });
    expect(result.netMonthly).toBe(-4000);
  });
});
