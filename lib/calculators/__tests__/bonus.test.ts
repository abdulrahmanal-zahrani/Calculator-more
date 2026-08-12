import { describe, it, expect } from "vitest";
import { calculateBonus, dedupeAndSortMatrix, type BonusMatrixRow } from "../bonus";
import { normalizeNumericInput } from "../../numeric";

describe("calculateBonus", () => {
  it("1. simple 5-point system: 120,000 salary, 15% target, rating 4/5 -> 100% multiplier -> 18,000", () => {
    const matrix: BonusMatrixRow[] = [
      { rating: 1, multiplierPercent: 0 },
      { rating: 2, multiplierPercent: 50 },
      { rating: 3, multiplierPercent: 75 },
      { rating: 4, multiplierPercent: 100 },
      { rating: 5, multiplierPercent: 150 },
    ];
    const result = calculateBonus({
      salaryAmount: 120000,
      salaryPeriod: "annual",
      ratingScaleMin: 1,
      ratingScaleMax: 5,
      rating: 4,
      targetBonusMethod: "percentageOfSalary",
      targetBonusPercent: 15,
      matrix,
    });
    expect(result.targetBonusAmount).toBe(18000);
    expect(result.estimatedBonus).toBe(18000);
  });

  it("2. rating 4.2/5 with interpolation ON -> ~110% multiplier -> 19,800", () => {
    const matrix: BonusMatrixRow[] = [
      { rating: 4, multiplierPercent: 100 },
      { rating: 5, multiplierPercent: 150 },
    ];
    const result = calculateBonus({
      salaryAmount: 120000,
      salaryPeriod: "annual",
      ratingScaleMin: 1,
      ratingScaleMax: 5,
      rating: 4.2,
      targetBonusMethod: "percentageOfSalary",
      targetBonusPercent: 15,
      matrix,
      interpolate: true,
    });
    // 100 + 0.2 * (150-100) = 110% multiplier
    expect(result.performanceMultiplier).toBeCloseTo(1.1, 4);
    expect(result.targetBonusAmount).toBe(18000);
    expect(result.estimatedBonus).toBe(19800);
  });

  it("3. 10-point system, rating 8/10, custom matrix resolves correct multiplier", () => {
    const matrix: BonusMatrixRow[] = [
      { rating: 1, multiplierPercent: 0 },
      { rating: 5, multiplierPercent: 50 },
      { rating: 8, multiplierPercent: 100 },
      { rating: 10, multiplierPercent: 200 },
    ];
    const result = calculateBonus({
      salaryAmount: 100000,
      salaryPeriod: "annual",
      ratingScaleMin: 1,
      ratingScaleMax: 10,
      rating: 8,
      targetBonusMethod: "percentageOfSalary",
      targetBonusPercent: 10,
      matrix,
    });
    expect(result.performanceMultiplier).toBeCloseTo(1.0, 4);
    expect(result.estimatedBonus).toBe(10000);
  });

  it("4. 100-point system, rating 85/100, custom matrix resolves correct multiplier", () => {
    const matrix: BonusMatrixRow[] = [
      { rating: 0, multiplierPercent: 0 },
      { rating: 60, multiplierPercent: 50 },
      { rating: 80, multiplierPercent: 100 },
      { rating: 90, multiplierPercent: 150 },
      { rating: 100, multiplierPercent: 200 },
    ];
    const result = calculateBonus({
      salaryAmount: 100000,
      salaryPeriod: "annual",
      ratingScaleMin: 0,
      ratingScaleMax: 100,
      rating: 85,
      targetBonusMethod: "percentageOfSalary",
      targetBonusPercent: 10,
      matrix,
    });
    // Floor bracket: 85 falls in [80,90) -> uses 80's multiplier (100%), no interpolation.
    expect(result.performanceMultiplier).toBeCloseTo(1.0, 4);
    expect(result.estimatedBonus).toBe(10000);
  });

  it("5. number-of-salaries target: 10,000 monthly, 1.5 salaries, 100% multiplier -> 15,000", () => {
    const matrix: BonusMatrixRow[] = [{ rating: 1, multiplierPercent: 100 }];
    const result = calculateBonus({
      salaryAmount: 10000,
      salaryPeriod: "monthly",
      ratingScaleMin: 1,
      ratingScaleMax: 5,
      rating: 3,
      targetBonusMethod: "numberOfSalaries",
      targetBonusSalaryCount: 1.5,
      matrix,
    });
    expect(result.targetBonusAmount).toBe(15000);
    expect(result.estimatedBonus).toBe(15000);
  });

  it("6. partial year: 24,000 annual bonus base (100% multiplier), 6 eligible months -> 12,000", () => {
    const matrix: BonusMatrixRow[] = [{ rating: 1, multiplierPercent: 100 }];
    const result = calculateBonus({
      salaryAmount: 160000,
      salaryPeriod: "annual",
      ratingScaleMin: 1,
      ratingScaleMax: 5,
      rating: 3,
      targetBonusMethod: "fixedAmount",
      targetBonusFixedAmount: 24000,
      matrix,
      prorationMethod: "months",
      eligibleMonths: 6,
    });
    expect(result.estimatedBonus).toBe(12000);
  });

  it("7. Arabic numerals parse via normalizeNumericInput and calculate correctly", () => {
    const salary = normalizeNumericInput("١٢٠٠٠٠");
    const rating = normalizeNumericInput("٤٫٢");
    expect(salary).toBe(120000);
    expect(rating).toBe(4.2);

    const matrix: BonusMatrixRow[] = [
      { rating: 4, multiplierPercent: 100 },
      { rating: 5, multiplierPercent: 150 },
    ];
    const result = calculateBonus({
      salaryAmount: salary!,
      salaryPeriod: "annual",
      ratingScaleMin: 1,
      ratingScaleMax: 5,
      rating: rating!,
      targetBonusMethod: "percentageOfSalary",
      targetBonusPercent: 15,
      matrix,
      interpolate: true,
    });
    expect(result.estimatedBonus).toBe(19800);
  });

  describe("validation edge cases", () => {
    const baseInput = {
      salaryPeriod: "annual" as const,
      ratingScaleMin: 1,
      ratingScaleMax: 5,
      targetBonusMethod: "percentageOfSalary" as const,
      targetBonusPercent: 15,
    };

    it("rejects missing/negative salary", () => {
      expect(() =>
        calculateBonus({ ...baseInput, salaryAmount: -1, rating: 3, matrix: [{ rating: 1, multiplierPercent: 100 }] })
      ).toThrow();
    });

    it("rejects rating outside selected scale range", () => {
      expect(() =>
        calculateBonus({ ...baseInput, salaryAmount: 100000, rating: 6, matrix: [{ rating: 1, multiplierPercent: 100 }] })
      ).toThrow();
      expect(() =>
        calculateBonus({ ...baseInput, salaryAmount: 100000, rating: 0, matrix: [{ rating: 1, multiplierPercent: 100 }] })
      ).toThrow();
    });

    it("rejects duplicate matrix thresholds", () => {
      expect(() =>
        calculateBonus({
          ...baseInput,
          salaryAmount: 100000,
          rating: 3,
          matrix: [
            { rating: 3, multiplierPercent: 75 },
            { rating: 3, multiplierPercent: 100 },
          ],
        })
      ).toThrow();
    });

    it("dedupeAndSortMatrix removes duplicates (last wins) and sorts ascending", () => {
      const deduped = dedupeAndSortMatrix([
        { rating: 3, multiplierPercent: 75 },
        { rating: 1, multiplierPercent: 0 },
        { rating: 3, multiplierPercent: 80 },
      ]);
      expect(deduped).toEqual([
        { rating: 1, multiplierPercent: 0 },
        { rating: 3, multiplierPercent: 80 },
      ]);
    });

    it("rejects negative multiplier", () => {
      expect(() =>
        calculateBonus({
          ...baseInput,
          salaryAmount: 100000,
          rating: 3,
          matrix: [{ rating: 1, multiplierPercent: -10 }],
        })
      ).toThrow();
    });
  });
});
