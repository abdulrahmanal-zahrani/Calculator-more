export interface InstallmentCalculatorInput {
  price: number;
  downPayment: number;
  annualRatePercent: number;
  termMonths: number;
  fees?: number;
}

export interface InstallmentCalculatorResult {
  financedAmount: number;
  monthlyInstallment: number;
  totalCost: number;
  totalInterest: number;
}

export function calculateInstallment(input: InstallmentCalculatorInput): InstallmentCalculatorResult {
  const { price, downPayment, annualRatePercent, termMonths, fees = 0 } = input;

  if (price < 0 || downPayment < 0 || annualRatePercent < 0 || fees < 0) {
    throw new Error("Installment calculator inputs must be non-negative.");
  }
  if (downPayment > price) {
    throw new Error("Down payment cannot exceed the price.");
  }
  if (termMonths <= 0 || !Number.isFinite(termMonths)) {
    throw new Error("Term months must be a positive number.");
  }

  const financedAmount = round2(price - downPayment + fees);
  const monthlyRate = annualRatePercent / 100 / 12;

  let monthlyInstallment: number;
  if (monthlyRate === 0) {
    monthlyInstallment = round2(financedAmount / termMonths);
  } else {
    const factor = Math.pow(1 + monthlyRate, termMonths);
    monthlyInstallment = round2((financedAmount * monthlyRate * factor) / (factor - 1));
  }

  const totalCost = round2(monthlyInstallment * termMonths + downPayment);
  const totalInterest = round2(monthlyInstallment * termMonths - financedAmount);

  return { financedAmount, monthlyInstallment, totalCost, totalInterest };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
