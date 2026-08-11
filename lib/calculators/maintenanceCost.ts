export interface MaintenanceItemInput {
  name: string;
  costPerService: number;
  intervalKm: number;
}

export interface MaintenanceCostCalculatorInput {
  items: MaintenanceItemInput[];
  annualMileageKm: number;
}

export interface MaintenanceItemResult extends MaintenanceItemInput {
  servicesPerYear: number;
  annualCost: number;
}

export interface MaintenanceCostCalculatorResult {
  items: MaintenanceItemResult[];
  totalAnnualCost: number;
  totalMonthlyCost: number;
}

export function calculateMaintenanceCost(input: MaintenanceCostCalculatorInput): MaintenanceCostCalculatorResult {
  const { items, annualMileageKm } = input;
  if (annualMileageKm < 0 || !Number.isFinite(annualMileageKm)) {
    throw new Error("Annual mileage must be a non-negative finite number.");
  }

  const resultItems: MaintenanceItemResult[] = items.map((item) => {
    if (item.costPerService < 0 || item.intervalKm <= 0) {
      throw new Error("Cost per service must be non-negative and interval must be positive.");
    }
    const servicesPerYear = annualMileageKm / item.intervalKm;
    const annualCost = round2(servicesPerYear * item.costPerService);
    return { ...item, servicesPerYear: round2(servicesPerYear), annualCost };
  });

  const totalAnnualCost = round2(resultItems.reduce((sum, i) => sum + i.annualCost, 0));
  const totalMonthlyCost = round2(totalAnnualCost / 12);

  return { items: resultItems, totalAnnualCost, totalMonthlyCost };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
