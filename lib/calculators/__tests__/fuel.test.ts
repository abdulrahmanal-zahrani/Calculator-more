import { describe, it, expect } from "vitest";
import { calculateFuelCost } from "../fuel";

describe("calculateFuelCost", () => {
  it("computes trip cost correctly", () => {
    const result = calculateFuelCost({
      distanceKm: 200,
      efficiencyLPer100Km: 8,
      pricePerLiter: 2.18,
    });
    expect(result.litersConsumed).toBe(16);
    expect(result.tripCost).toBeCloseTo(34.88, 2);
  });

  it("handles zero distance", () => {
    const result = calculateFuelCost({ distanceKm: 0, efficiencyLPer100Km: 8, pricePerLiter: 2.18 });
    expect(result.tripCost).toBe(0);
    expect(result.costPerKm).toBe(0);
  });

  it("scales monthly/annual by trips per month", () => {
    const result = calculateFuelCost({
      distanceKm: 100,
      efficiencyLPer100Km: 5,
      pricePerLiter: 2,
      tripsPerMonth: 20,
    });
    expect(result.tripCost).toBe(10);
    expect(result.monthlyCost).toBe(200);
    expect(result.annualCost).toBe(2400);
  });

  it("throws on negative distance", () => {
    expect(() => calculateFuelCost({ distanceKm: -1, efficiencyLPer100Km: 8, pricePerLiter: 2 })).toThrow();
  });
});
