export interface SalaryCalculatorInput {
  basic: number;
  housingAllowance?: number;
  transportAllowance?: number;
  otherAllowances?: number;
  deductions?: number;
}

export interface SalaryCalculatorResult {
  grossMonthly: number;
  totalDeductions: number;
  netMonthly: number;
  netAnnual: number;
  monthlyDisposable: number;
}

export function calculateSalary(input: SalaryCalculatorInput): SalaryCalculatorResult {
  const {
    basic,
    housingAllowance = 0,
    transportAllowance = 0,
    otherAllowances = 0,
    deductions = 0,
  } = input;

  if ([basic, housingAllowance, transportAllowance, otherAllowances, deductions].some((v) => v < 0)) {
    throw new Error("Salary calculator inputs must be non-negative.");
  }

  const grossMonthly = round2(basic + housingAllowance + transportAllowance + otherAllowances);
  const totalDeductions = round2(deductions);
  const netMonthly = round2(grossMonthly - totalDeductions);
  const netAnnual = round2(netMonthly * 12);

  return {
    grossMonthly,
    totalDeductions,
    netMonthly,
    netAnnual,
    monthlyDisposable: netMonthly,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
