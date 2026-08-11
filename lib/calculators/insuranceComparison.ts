export interface InsurancePolicyInput {
  name: string;
  annualPremium: number;
  deductible: number;
  coverageAmount: number;
  additionalFees?: number;
}

export interface InsurancePolicyResult {
  name: string;
  effectiveAnnualCost: number;
  coverageAmount: number;
  costPerCoverageUnit: number;
}

export function compareInsurancePolicies(policies: InsurancePolicyInput[]): InsurancePolicyResult[] {
  if (policies.length === 0) {
    throw new Error("At least one policy is required.");
  }
  return policies.map((p) => {
    const { annualPremium, deductible, coverageAmount, additionalFees = 0 } = p;
    if (annualPremium < 0 || deductible < 0 || coverageAmount < 0 || additionalFees < 0) {
      throw new Error("Insurance inputs must be non-negative.");
    }
    // Effective cost treats the deductible as a probable-worst-case add-on,
    // giving a simple apples-to-apples comparison figure (not an actuarial estimate).
    const effectiveAnnualCost = round2(annualPremium + additionalFees + deductible * 0.1);
    const costPerCoverageUnit = coverageAmount > 0 ? round4(effectiveAnnualCost / coverageAmount) : 0;
    return { name: p.name, effectiveAnnualCost, coverageAmount, costPerCoverageUnit };
  });
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}
