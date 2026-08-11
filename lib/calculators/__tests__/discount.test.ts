import { describe, it, expect } from "vitest";
import { calculateDiscount } from "../discount";

describe("calculateDiscount", () => {
  it("applies a single discount", () => {
    const result = calculateDiscount({ originalPrice: 100, discountPercents: [20] });
    expect(result.finalPrice).toBe(80);
    expect(result.totalSavings).toBe(20);
  });

  it("applies stacked discounts sequentially", () => {
    const result = calculateDiscount({ originalPrice: 200, discountPercents: [10, 10] });
    // 200 -> 180 -> 162
    expect(result.finalPrice).toBe(162);
    expect(result.breakdown).toHaveLength(2);
  });

  it("handles zero discount", () => {
    const result = calculateDiscount({ originalPrice: 100, discountPercents: [0] });
    expect(result.finalPrice).toBe(100);
  });

  it("handles 100% discount", () => {
    const result = calculateDiscount({ originalPrice: 100, discountPercents: [100] });
    expect(result.finalPrice).toBe(0);
  });

  it("throws on negative price", () => {
    expect(() => calculateDiscount({ originalPrice: -1, discountPercents: [10] })).toThrow();
  });

  it("throws on out-of-range discount percent", () => {
    expect(() => calculateDiscount({ originalPrice: 100, discountPercents: [150] })).toThrow();
  });
});
