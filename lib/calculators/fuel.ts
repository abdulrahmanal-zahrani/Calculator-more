export interface FuelCalculatorInput {
  distanceKm: number;
  efficiencyLPer100Km: number;
  pricePerLiter: number;
  tripsPerMonth?: number;
}

export interface FuelCalculatorResult {
  litersConsumed: number;
  tripCost: number;
  costPerKm: number;
  monthlyCost: number;
  annualCost: number;
}

export function calculateFuelCost(input: FuelCalculatorInput): FuelCalculatorResult {
  const { distanceKm, efficiencyLPer100Km, pricePerLiter, tripsPerMonth = 1 } = input;

  if (distanceKm < 0 || efficiencyLPer100Km < 0 || pricePerLiter < 0 || tripsPerMonth < 0) {
    throw new Error("Fuel calculator inputs must be non-negative.");
  }

  const litersConsumed = round2((distanceKm * efficiencyLPer100Km) / 100);
  const tripCost = round2(litersConsumed * pricePerLiter);
  const costPerKm = distanceKm > 0 ? round4(tripCost / distanceKm) : 0;
  const monthlyCost = round2(tripCost * tripsPerMonth);
  const annualCost = round2(monthlyCost * 12);

  return { litersConsumed, tripCost, costPerKm, monthlyCost, annualCost };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}
