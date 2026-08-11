import { describe, it, expect } from "vitest";
import { calculateMaintenanceCost } from "../maintenanceCost";

describe("calculateMaintenanceCost", () => {
  it("computes annual cost across items", () => {
    const result = calculateMaintenanceCost({
      annualMileageKm: 20000,
      items: [
        { name: "Oil", costPerService: 150, intervalKm: 10000 },
        { name: "Tires", costPerService: 1200, intervalKm: 40000 },
      ],
    });
    expect(result.items[0].servicesPerYear).toBe(2);
    expect(result.items[0].annualCost).toBe(300);
    expect(result.totalAnnualCost).toBeCloseTo(300 + 600, 2);
  });

  it("throws on non-positive interval", () => {
    expect(() =>
      calculateMaintenanceCost({ annualMileageKm: 10000, items: [{ name: "X", costPerService: 10, intervalKm: 0 }] })
    ).toThrow();
  });
});
