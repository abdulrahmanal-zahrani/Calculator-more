import { describe, it, expect } from "vitest";
import { calculateZakat } from "../zakat";

const base = {
  cash: 0,
  bankBalances: 0,
  goldGrams: 0,
  goldPricePerGram: 300,
  silverGrams: 0,
  silverPricePerGram: 3,
  investments: 0,
  businessInventory: 0,
  receivables: 0,
  liabilities: 0,
  nisabBasis: "gold" as const,
};

describe("calculateZakat", () => {
  it("computes zakat due when above nisab", () => {
    const result = calculateZakat({ ...base, cash: 100000 });
    expect(result.meetsNisab).toBe(true);
    expect(result.zakatDue).toBe(2500);
  });

  it("returns zero zakat below nisab", () => {
    const result = calculateZakat({ ...base, cash: 1000 });
    expect(result.meetsNisab).toBe(false);
    expect(result.zakatDue).toBe(0);
  });

  it("subtracts liabilities from zakatable wealth", () => {
    const result = calculateZakat({ ...base, cash: 100000, liabilities: 20000 });
    expect(result.netZakatableWealth).toBe(80000);
  });

  it("throws on negative input", () => {
    expect(() => calculateZakat({ ...base, cash: -1 })).toThrow();
  });

  it("supports silver nisab basis", () => {
    const result = calculateZakat({ ...base, cash: 5000, nisabBasis: "silver" });
    expect(result.nisabValue).toBe(595 * 3);
  });
});
