import { describe, it, expect } from "vitest";
import { calculateSalary } from "../salary";

describe("calculateSalary", () => {
  it("computes gross/net correctly with GOSI disabled", () => {
    const result = calculateSalary({
      basic: 5000,
      housingAllowance: 1000,
      transportAllowance: 500,
      otherAllowances: 200,
      deductions: 300,
      includeGosi: false,
    });
    expect(result.grossMonthly).toBe(6700);
    expect(result.netMonthly).toBe(6400);
    expect(result.netAnnual).toBe(76800);
  });

  it("defaults optional fields to zero", () => {
    const result = calculateSalary({ basic: 4000, includeGosi: false });
    expect(result.grossMonthly).toBe(4000);
    expect(result.netMonthly).toBe(4000);
  });

  it("throws on negative basic salary", () => {
    expect(() => calculateSalary({ basic: -1 })).toThrow();
  });

  it("handles deductions exceeding allowances (net can be negative)", () => {
    const result = calculateSalary({ basic: 1000, deductions: 5000, includeGosi: false });
    expect(result.netMonthly).toBe(-4000);
  });

  it("computes legacy GOSI contributions (9.75% employee / 9.75% employer on basic+housing)", () => {
    const result = calculateSalary({
      basic: 5000,
      housingAllowance: 1000,
      system: "legacy",
    });
    // basis = 6000, employee = 9% + 0.75% = 9.75% -> 585, employer same -> 585
    expect(result.employeeGosiContribution).toBe(585);
    expect(result.employerGosiContribution).toBe(585);
    expect(result.totalDeductions).toBe(585);
    expect(result.netMonthly).toBe(result.grossMonthly - 585);
  });

  it("computes new-system GOSI contributions (11.75% employee / 12.5% employer on basic+housing)", () => {
    const result = calculateSalary({
      basic: 5000,
      housingAllowance: 1000,
      system: "new",
    });
    // basis = 6000, employee = 11% + 0.75% = 11.75% -> 705
    // employer = 11.75% + 0.75% = 12.5% -> 750
    expect(result.employeeGosiContribution).toBe(705);
    expect(result.employerGosiContribution).toBe(750);
    expect(result.netMonthly).toBe(result.grossMonthly - 705);
  });

  it("caps the GOSI contribution basis at the wage ceiling", () => {
    const result = calculateSalary({
      basic: 50000,
      housingAllowance: 5000,
      system: "legacy",
    });
    // basis capped at 45000 -> employee = 45000 * 9.75% = 4387.5
    expect(result.employeeGosiContribution).toBe(4387.5);
  });

  it("defaults to the new system when unspecified", () => {
    const result = calculateSalary({ basic: 5000, housingAllowance: 1000 });
    expect(result.employeeGosiContribution).toBe(705);
  });
});
