/**
 * Annual bonus calculator engine.
 *
 * Core model: Performance Rating -> company-specific Bonus Multiplier
 * (via a matrix the employee defines, since every company's bonus system
 * differs) -> applied to a Target Bonus (percentage of salary, number of
 * monthly salaries, or a fixed amount) -> optionally prorated for
 * partial-year eligibility. This deliberately does NOT assume a universal
 * "salary x bonus %" formula.
 */

export type SalaryPeriod = "monthly" | "annual";

export type TargetBonusMethod = "percentageOfSalary" | "numberOfSalaries" | "fixedAmount";

export type ProrationMethod = "fullYear" | "months" | "customPercentage";

export interface BonusMatrixRow {
  /** Rating threshold this row applies from (bracket floor, or interpolation anchor). */
  rating: number;
  /** Optional human label, e.g. "ضعيف" / "استثنائي". */
  label?: string;
  /** Bonus multiplier as a percentage, e.g. 100 = 100% (no change), 150 = 150%. */
  multiplierPercent: number;
}

export interface BonusCalculatorInput {
  /** Salary amount as entered — interpreted per `salaryPeriod`. */
  salaryAmount: number;
  salaryPeriod: SalaryPeriod;

  /** Rating scale bounds (e.g. 1-5, 1-10, 0-100, or a custom range). */
  ratingScaleMin: number;
  ratingScaleMax: number;
  /** The employee's actual rating, within [ratingScaleMin, ratingScaleMax]. */
  rating: number;

  targetBonusMethod: TargetBonusMethod;
  /** Used when targetBonusMethod === "percentageOfSalary" (0-100 points, e.g. 15 = 15%). */
  targetBonusPercent?: number;
  /** Used when targetBonusMethod === "numberOfSalaries" (e.g. 1.5 salaries). */
  targetBonusSalaryCount?: number;
  /** Used when targetBonusMethod === "fixedAmount". */
  targetBonusFixedAmount?: number;

  /** Bonus matrix, sorted or not — engine sorts internally. Must have >=1 row. */
  matrix: BonusMatrixRow[];
  /** Linear-interpolate between bracketing matrix rows. Default false (bracket/floor). */
  interpolate?: boolean;

  /** Optional secondary multiplicative factors, each a percentage (100 = no-op). */
  companyFactorPercent?: number;
  departmentFactorPercent?: number;
  extraFactorPercent?: number;

  prorationMethod?: ProrationMethod;
  /** Used when prorationMethod === "months" (0-12). */
  eligibleMonths?: number;
  /** Used when prorationMethod === "customPercentage" (0-100 points). */
  customProrationPercent?: number;
}

export interface BonusCalculatorResult {
  annualBaseSalary: number;
  targetBonusAmount: number;
  performanceRating: number;
  performanceMultiplier: number;
  prorationFactor: number;
  estimatedBonus: number;
  totalAnnualCompensation: number;
  monthlyEquivalent: number;
}

export function calculateBonus(input: BonusCalculatorInput): BonusCalculatorResult {
  const {
    salaryAmount,
    salaryPeriod,
    ratingScaleMin,
    ratingScaleMax,
    rating,
    targetBonusMethod,
    targetBonusPercent = 0,
    targetBonusSalaryCount = 0,
    targetBonusFixedAmount = 0,
    matrix,
    interpolate = false,
    companyFactorPercent = 100,
    departmentFactorPercent = 100,
    extraFactorPercent = 100,
    prorationMethod = "fullYear",
    eligibleMonths = 12,
    customProrationPercent = 100,
  } = input;

  if (salaryAmount < 0) throw new Error("Salary amount must be non-negative.");
  if (ratingScaleMax <= ratingScaleMin) throw new Error("Rating scale max must be greater than min.");
  if (rating < ratingScaleMin || rating > ratingScaleMax) {
    throw new Error("Rating is outside the selected scale range.");
  }
  if (!matrix || matrix.length === 0) throw new Error("Bonus matrix must have at least one row.");
  if (matrix.some((row) => row.multiplierPercent < 0)) {
    throw new Error("Bonus multiplier cannot be negative.");
  }
  const ratingsSeen = new Set<number>();
  for (const row of matrix) {
    if (ratingsSeen.has(row.rating)) {
      throw new Error("Bonus matrix cannot contain duplicate rating thresholds.");
    }
    ratingsSeen.add(row.rating);
  }
  if ([companyFactorPercent, departmentFactorPercent, extraFactorPercent].some((v) => v < 0)) {
    throw new Error("Performance factors cannot be negative.");
  }

  // Resolve annual base salary.
  const annualBaseSalary = round2(salaryPeriod === "monthly" ? salaryAmount * 12 : salaryAmount);
  const monthlySalary = round2(annualBaseSalary / 12);

  // Resolve target bonus amount.
  let targetBonusAmount: number;
  if (targetBonusMethod === "percentageOfSalary") {
    targetBonusAmount = round2(annualBaseSalary * (targetBonusPercent / 100));
  } else if (targetBonusMethod === "numberOfSalaries") {
    targetBonusAmount = round2(monthlySalary * targetBonusSalaryCount);
  } else {
    targetBonusAmount = round2(targetBonusFixedAmount);
  }

  // Resolve base performance multiplier from the matrix.
  const employeeMultiplierPercent = resolveMultiplierPercent(matrix, rating, interpolate);

  // Secondary optional factors (each defaults to 100%, i.e. no-op).
  const performanceMultiplier =
    (employeeMultiplierPercent / 100) *
    (companyFactorPercent / 100) *
    (departmentFactorPercent / 100) *
    (extraFactorPercent / 100);

  // Proration factor.
  let prorationFactor: number;
  if (prorationMethod === "months") {
    prorationFactor = Math.max(0, Math.min(12, eligibleMonths)) / 12;
  } else if (prorationMethod === "customPercentage") {
    prorationFactor = customProrationPercent / 100;
  } else {
    prorationFactor = 1;
  }

  const estimatedBonus = round2(targetBonusAmount * performanceMultiplier * prorationFactor);
  const totalAnnualCompensation = round2(annualBaseSalary + estimatedBonus);
  const monthlyEquivalent = round2(estimatedBonus / 12);

  return {
    annualBaseSalary,
    targetBonusAmount,
    performanceRating: rating,
    performanceMultiplier: round4(performanceMultiplier),
    prorationFactor: round4(prorationFactor),
    estimatedBonus,
    totalAnnualCompensation,
    monthlyEquivalent,
  };
}

/**
 * Resolves the bonus multiplier (as a percentage, e.g. 100 = 100%) for a
 * given rating against the matrix.
 *
 * When `interpolate` is false: uses the bracket the rating falls into,
 * defined as floor-to-nearest-defined-threshold-at-or-below (i.e. the
 * highest matrix row whose `rating` is <= the employee's rating). If the
 * rating is below every row, the lowest row's multiplier is used.
 *
 * When `interpolate` is true: linearly interpolates the multiplier
 * between the two bracketing rows (e.g. rating 4.2 between 4->100% and
 * 5->150% resolves to ~110%). Below the lowest row or above the highest
 * row, the nearest row's multiplier is used (no extrapolation).
 */
function resolveMultiplierPercent(matrix: BonusMatrixRow[], rating: number, interpolate: boolean): number {
  const sorted = [...matrix].sort((a, b) => a.rating - b.rating);

  if (rating <= sorted[0].rating) return sorted[0].multiplierPercent;
  if (rating >= sorted[sorted.length - 1].rating) return sorted[sorted.length - 1].multiplierPercent;

  const exact = sorted.find((row) => row.rating === rating);
  if (exact) return exact.multiplierPercent;

  // Find the bracketing pair: lower.rating < rating < upper.rating.
  let lower = sorted[0];
  let upper = sorted[sorted.length - 1];
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i].rating < rating && sorted[i + 1].rating > rating) {
      lower = sorted[i];
      upper = sorted[i + 1];
      break;
    }
  }

  if (!interpolate) return lower.multiplierPercent;
  if (upper.rating === lower.rating) return lower.multiplierPercent;

  const t = (rating - lower.rating) / (upper.rating - lower.rating);
  return lower.multiplierPercent + t * (upper.multiplierPercent - lower.multiplierPercent);
}

/**
 * Deduplicates matrix rows by rating (last one wins) and sorts ascending.
 * Exposed for UI validation when the user edits the matrix table.
 */
export function dedupeAndSortMatrix(matrix: BonusMatrixRow[]): BonusMatrixRow[] {
  const byRating = new Map<number, BonusMatrixRow>();
  for (const row of matrix) byRating.set(row.rating, row);
  return Array.from(byRating.values()).sort((a, b) => a.rating - b.rating);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}
