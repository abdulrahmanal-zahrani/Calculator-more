export interface LoanCalculatorInput {
  amount: number;
  annualRatePercent: number;
  termMonths: number;
  fees?: number;
  downPayment?: number;
}

export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface LoanCalculatorResult {
  principal: number;
  monthlyPayment: number;
  totalRepayment: number;
  totalInterest: number;
  amortization: AmortizationRow[];
}

export function calculateLoanPayment(input: LoanCalculatorInput): LoanCalculatorResult {
  const { amount, annualRatePercent, termMonths, fees = 0, downPayment = 0 } = input;

  if (amount < 0 || annualRatePercent < 0 || fees < 0 || downPayment < 0) {
    throw new Error("Loan calculator inputs must be non-negative.");
  }
  if (termMonths <= 0 || !Number.isFinite(termMonths)) {
    throw new Error("Term months must be a positive number.");
  }
  if (downPayment > amount) {
    throw new Error("Down payment cannot exceed the loan amount.");
  }

  const principal = round2(amount - downPayment + fees);
  const monthlyRate = annualRatePercent / 100 / 12;

  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = round2(principal / termMonths);
  } else {
    const factor = Math.pow(1 + monthlyRate, termMonths);
    monthlyPayment = round2((principal * monthlyRate * factor) / (factor - 1));
  }

  const amortization: AmortizationRow[] = [];
  let balance = principal;
  for (let month = 1; month <= termMonths; month++) {
    const interest = round2(balance * monthlyRate);
    let payment = monthlyPayment;
    let principalPaid = round2(payment - interest);
    if (month === termMonths) {
      // absorb rounding drift on the final row
      principalPaid = round2(balance);
      payment = round2(principalPaid + interest);
    }
    balance = round2(balance - principalPaid);
    amortization.push({ month, payment, principal: principalPaid, interest, balance: Math.max(balance, 0) });
  }

  const totalRepayment = round2(amortization.reduce((sum, row) => sum + row.payment, 0));
  const totalInterest = round2(totalRepayment - principal);

  return { principal, monthlyPayment, totalRepayment, totalInterest, amortization };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
