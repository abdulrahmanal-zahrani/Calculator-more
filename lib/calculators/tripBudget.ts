export interface TripBudgetCalculatorInput {
  travelers: number;
  days: number;
  flights?: number;
  accommodationPerNight?: number;
  foodPerDayPerPerson?: number;
  transport?: number;
  activities?: number;
  shopping?: number;
  bufferPercent?: number;
}

export interface TripBudgetCalculatorResult {
  flightsTotal: number;
  accommodationTotal: number;
  foodTotal: number;
  transportTotal: number;
  activitiesTotal: number;
  shoppingTotal: number;
  subtotal: number;
  bufferAmount: number;
  total: number;
  perDay: number;
  perPerson: number;
}

export function calculateTripBudget(input: TripBudgetCalculatorInput): TripBudgetCalculatorResult {
  const {
    travelers,
    days,
    flights = 0,
    accommodationPerNight = 0,
    foodPerDayPerPerson = 0,
    transport = 0,
    activities = 0,
    shopping = 0,
    bufferPercent = 10,
  } = input;

  if (travelers <= 0 || days <= 0) {
    throw new Error("Travelers and days must be positive.");
  }
  if ([flights, accommodationPerNight, foodPerDayPerPerson, transport, activities, shopping, bufferPercent].some((v) => v < 0)) {
    throw new Error("Trip budget inputs must be non-negative.");
  }

  const flightsTotal = round2(flights * travelers);
  const accommodationTotal = round2(accommodationPerNight * days);
  const foodTotal = round2(foodPerDayPerPerson * days * travelers);
  const transportTotal = round2(transport);
  const activitiesTotal = round2(activities);
  const shoppingTotal = round2(shopping);

  const subtotal = round2(
    flightsTotal + accommodationTotal + foodTotal + transportTotal + activitiesTotal + shoppingTotal
  );
  const bufferAmount = round2(subtotal * (bufferPercent / 100));
  const total = round2(subtotal + bufferAmount);
  const perDay = round2(total / days);
  const perPerson = round2(total / travelers);

  return {
    flightsTotal,
    accommodationTotal,
    foodTotal,
    transportTotal,
    activitiesTotal,
    shoppingTotal,
    subtotal,
    bufferAmount,
    total,
    perDay,
    perPerson,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
