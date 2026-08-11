export interface TravelFuelCalculatorInput {
  distanceKm: number;
  efficiencyLPer100Km: number;
  fuelPricePerLiter: number;
  travelers?: number;
}

export interface TravelFuelCalculatorResult {
  fuelRequiredLiters: number;
  totalCost: number;
  costPerPerson: number;
}

export function calculateTravelFuel(input: TravelFuelCalculatorInput): TravelFuelCalculatorResult {
  const { distanceKm, efficiencyLPer100Km, fuelPricePerLiter, travelers = 1 } = input;

  if (distanceKm < 0 || efficiencyLPer100Km <= 0 || fuelPricePerLiter < 0) {
    throw new Error("Distance and price must be non-negative and efficiency must be positive.");
  }
  if (travelers <= 0 || !Number.isFinite(travelers)) {
    throw new Error("Travelers must be a positive number.");
  }

  const fuelRequiredLiters = round2((distanceKm / 100) * efficiencyLPer100Km);
  const totalCost = round2(fuelRequiredLiters * fuelPricePerLiter);
  const costPerPerson = round2(totalCost / travelers);

  return { fuelRequiredLiters, totalCost, costPerPerson };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
