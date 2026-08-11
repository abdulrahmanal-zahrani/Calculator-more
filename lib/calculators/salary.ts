import { GOSI_SYSTEMS, type GosiSystem } from "@/lib/config/gosiRules";

export type GosiSystemId = "new" | "legacy";

export interface SalaryCalculatorInput {
  basic: number;
  housingAllowance?: number;
  transportAllowance?: number;
  otherAllowances?: number;
  deductions?: number;
  /** GOSI contribution system. Defaults to "new" (current). */
  system?: GosiSystemId;
  /** Whether the employee is covered by GOSI at all (e.g. Saudi national, private sector). Defaults to true. */
  includeGosi?: boolean;
}

export interface SalaryCalculatorResult {
  grossMonthly: number;
  employeeGosiContribution: number;
  employerGosiContribution: number;
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
    system = "new",
    includeGosi = true,
  } = input;

  if ([basic, housingAllowance, transportAllowance, otherAllowances, deductions].some((v) => v < 0)) {
    throw new Error("Salary calculator inputs must be non-negative.");
  }

  const grossMonthly = round2(basic + housingAllowance + transportAllowance + otherAllowances);

  const rules: GosiSystem = GOSI_SYSTEMS[system];
  const contributionBasis = includeGosi ? Math.min(basic + housingAllowance, rules.wageCeiling) : 0;
  const employeeGosiContribution = includeGosi
    ? round2(contributionBasis * (rules.employeeAnnuitiesRate + rules.employeeSanedRate))
    : 0;
  const employerGosiContribution = includeGosi
    ? round2(contributionBasis * (rules.employerAnnuitiesRate + rules.employerSanedRate))
    : 0;

  const totalDeductions = round2(deductions + employeeGosiContribution);
  const netMonthly = round2(grossMonthly - totalDeductions);
  const netAnnual = round2(netMonthly * 12);

  return {
    grossMonthly,
    employeeGosiContribution,
    employerGosiContribution,
    totalDeductions,
    netMonthly,
    netAnnual,
    monthlyDisposable: netMonthly,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
