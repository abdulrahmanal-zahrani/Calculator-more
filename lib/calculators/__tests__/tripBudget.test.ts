import { describe, it, expect } from "vitest";
import { calculateTripBudget } from "../tripBudget";

describe("calculateTripBudget", () => {
  it("computes a full budget with buffer", () => {
    const result = calculateTripBudget({
      travelers: 2,
      days: 5,
      flights: 1000,
      accommodationPerNight: 300,
      foodPerDayPerPerson: 100,
      transport: 200,
      activities: 150,
      shopping: 100,
      bufferPercent: 10,
    });
    // flights: 2000, accommodation: 1500, food: 1000, transport: 200, activities: 150, shopping: 100
    expect(result.subtotal).toBe(4950);
    expect(result.bufferAmount).toBe(495);
    expect(result.total).toBe(5445);
    expect(result.perDay).toBe(1089);
    expect(result.perPerson).toBe(2722.5);
  });

  it("defaults optional costs to zero", () => {
    const result = calculateTripBudget({ travelers: 1, days: 1 });
    expect(result.subtotal).toBe(0);
    expect(result.total).toBe(0);
  });

  it("throws on zero travelers", () => {
    expect(() => calculateTripBudget({ travelers: 0, days: 5 })).toThrow();
  });

  it("throws on negative cost fields", () => {
    expect(() => calculateTripBudget({ travelers: 1, days: 1, flights: -1 })).toThrow();
  });
});
