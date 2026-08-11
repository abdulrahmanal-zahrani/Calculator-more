export interface LuggageBagInput {
  name: string;
  weightKg: number;
}

export interface LuggageCalculatorInput {
  allowanceKg: number;
  bags: LuggageBagInput[];
}

export interface LuggageBagResult extends LuggageBagInput {
  overBy: number;
}

export interface LuggageCalculatorResult {
  totalWeightKg: number;
  remainingAllowanceKg: number;
  isOverAllowance: boolean;
  overageKg: number;
  bags: LuggageBagResult[];
}

export function calculateLuggage(input: LuggageCalculatorInput): LuggageCalculatorResult {
  const { allowanceKg, bags } = input;
  if (allowanceKg < 0 || !Number.isFinite(allowanceKg)) {
    throw new Error("Allowance must be a non-negative finite number.");
  }

  let totalWeightKg = 0;
  const bagResults: LuggageBagResult[] = bags.map((bag) => {
    if (bag.weightKg < 0) throw new Error("Bag weight must be non-negative.");
    totalWeightKg += bag.weightKg;
    return { ...bag, overBy: 0 };
  });
  totalWeightKg = round2(totalWeightKg);

  const isOverAllowance = totalWeightKg > allowanceKg;
  const overageKg = isOverAllowance ? round2(totalWeightKg - allowanceKg) : 0;
  const remainingAllowanceKg = isOverAllowance ? 0 : round2(allowanceKg - totalWeightKg);

  return { totalWeightKg, remainingAllowanceKg, isOverAllowance, overageKg, bags: bagResults };
}

export function kgToLb(kg: number): number {
  return Math.round(kg * 2.20462 * 100) / 100;
}

export function lbToKg(lb: number): number {
  return Math.round((lb / 2.20462) * 100) / 100;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
