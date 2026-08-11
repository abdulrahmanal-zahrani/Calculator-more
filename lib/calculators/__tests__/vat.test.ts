import { describe, it, expect } from "vitest";
import { calculateVat } from "../vat";

describe("calculateVat", () => {
  it("adds VAT for exclusive mode using default 15% rate", () => {
    const result = calculateVat({ amount: 100, mode: "exclusive" });
    expect(result.vatAmount).toBe(15);
    expect(result.grossAmount).toBe(115);
  });

  it("extracts VAT for inclusive mode", () => {
    const result = calculateVat({ amount: 115, mode: "inclusive" });
    expect(result.netAmount).toBe(100);
    expect(result.vatAmount).toBe(15);
  });

  it("supports custom rate", () => {
    const result = calculateVat({ amount: 100, mode: "exclusive", ratePercent: 5 });
    expect(result.vatAmount).toBe(5);
  });

  it("throws on negative amount", () => {
    expect(() => calculateVat({ amount: -1, mode: "exclusive" })).toThrow();
  });
});
