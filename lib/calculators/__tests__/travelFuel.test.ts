import { describe, it, expect } from "vitest";
import { calculateTravelFuel } from "../travelFuel";

describe("calculateTravelFuel", () => {
  it("computes fuel required and cost", () => {
    const result = calculateTravelFuel({ distanceKm: 500, efficiencyLPer100Km: 8, fuelPricePerLiter: 2.18 });
    expect(result.fuelRequiredLiters).toBe(40);
    expect(result.totalCost).toBeCloseTo(87.2, 2);
  });

  it("splits cost per traveler", () => {
    const result = calculateTravelFuel({ distanceKm: 100, efficiencyLPer100Km: 10, fuelPricePerLiter: 2, travelers: 4 });
    expect(result.costPerPerson).toBe(5);
  });

  it("throws on non-positive efficiency", () => {
    expect(() => calculateTravelFuel({ distanceKm: 100, efficiencyLPer100Km: 0, fuelPricePerLiter: 2 })).toThrow();
  });
});
