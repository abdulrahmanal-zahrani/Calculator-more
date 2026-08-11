import { describe, it, expect } from "vitest";
import { compareInsurancePolicies } from "../insuranceComparison";

describe("compareInsurancePolicies", () => {
  it("compares two policies", () => {
    const results = compareInsurancePolicies([
      { name: "A", annualPremium: 2000, deductible: 1000, coverageAmount: 100000 },
      { name: "B", annualPremium: 1800, deductible: 2000, coverageAmount: 100000 },
    ]);
    expect(results).toHaveLength(2);
    expect(results[0].effectiveAnnualCost).toBe(2100);
    expect(results[1].effectiveAnnualCost).toBe(2000);
  });

  it("throws on empty list", () => {
    expect(() => compareInsurancePolicies([])).toThrow();
  });

  it("throws on negative values", () => {
    expect(() =>
      compareInsurancePolicies([{ name: "A", annualPremium: -1, deductible: 0, coverageAmount: 100 }])
    ).toThrow();
  });
});
