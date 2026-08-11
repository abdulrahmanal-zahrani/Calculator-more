import { calculateLoanPayment, type AmortizationRow } from "@/lib/calculators/loan";

export interface CarLoanCalculatorInput {
  vehiclePrice: number;
  downPayment: number;
  annualRatePercent: number;
  termMonths: number;
  fees?: number;
}

export interface CarLoanCalculatorResult {
  financedAmount: number;
  monthlyPayment: number;
  totalCost: number;
  totalInterest: number;
  amortization: AmortizationRow[];
}

export function calculateCarLoan(input: CarLoanCalculatorInput): CarLoanCalculatorResult {
  const { vehiclePrice, downPayment, annualRatePercent, termMonths, fees = 0 } = input;

  const result = calculateLoanPayment({
    amount: vehiclePrice,
    downPayment,
    annualRatePercent,
    termMonths,
    fees,
  });

  return {
    financedAmount: result.principal,
    monthlyPayment: result.monthlyPayment,
    totalCost: round2(result.totalRepayment + downPayment),
    totalInterest: result.totalInterest,
    amortization: result.amortization,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
