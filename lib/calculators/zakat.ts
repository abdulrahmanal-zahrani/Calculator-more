/**
 * Zakat calculator — cash, bank balances, gold, silver, investments,
 * business inventory, receivables, minus short-term liabilities.
 *
 * Methodology (general, widely-cited rules — NOT a religious ruling/fatwa):
 * - Nisab: the minimum wealth threshold, traditionally pegged to 85g of gold
 *   OR 595g of silver. Many scholars recommend using the silver nisab (lower
 *   threshold) to be more inclusive/cautious; we default to gold nisab as
 *   the more common convention but expose both.
 * - Hawl: wealth must be held for one full lunar year above the nisab.
 * - Rate: 2.5% (1/40) of zakatable wealth once nisab is met.
 * Users should consult a qualified scholar or their local zakat authority
 * for an authoritative ruling on their specific situation.
 */

export const ZAKAT_RATE = 0.025;
export const GOLD_NISAB_GRAMS = 85;
export const SILVER_NISAB_GRAMS = 595;

export interface ZakatCalculatorInput {
  cash: number;
  bankBalances: number;
  goldGrams: number;
  goldPricePerGram: number;
  silverGrams: number;
  silverPricePerGram: number;
  investments: number;
  businessInventory: number;
  receivables: number;
  liabilities: number;
  nisabBasis: "gold" | "silver";
}

export interface ZakatCalculatorResult {
  totalAssets: number;
  netZakatableWealth: number;
  nisabValue: number;
  meetsNisab: boolean;
  zakatDue: number;
}

export function calculateZakat(input: ZakatCalculatorInput): ZakatCalculatorResult {
  const {
    cash,
    bankBalances,
    goldGrams,
    goldPricePerGram,
    silverGrams,
    silverPricePerGram,
    investments,
    businessInventory,
    receivables,
    liabilities,
    nisabBasis,
  } = input;

  const values = [
    cash,
    bankBalances,
    goldGrams,
    goldPricePerGram,
    silverGrams,
    silverPricePerGram,
    investments,
    businessInventory,
    receivables,
    liabilities,
  ];
  if (values.some((v) => v < 0 || !Number.isFinite(v))) {
    throw new Error("Zakat calculator inputs must be non-negative finite numbers.");
  }

  const goldValue = goldGrams * goldPricePerGram;
  const silverValue = silverGrams * silverPricePerGram;

  const totalAssets = round2(
    cash + bankBalances + goldValue + silverValue + investments + businessInventory + receivables
  );
  const netZakatableWealth = round2(Math.max(0, totalAssets - liabilities));

  const nisabValue =
    nisabBasis === "gold" ? round2(GOLD_NISAB_GRAMS * goldPricePerGram) : round2(SILVER_NISAB_GRAMS * silverPricePerGram);

  const meetsNisab = netZakatableWealth >= nisabValue && nisabValue > 0;
  const zakatDue = meetsNisab ? round2(netZakatableWealth * ZAKAT_RATE) : 0;

  return { totalAssets, netZakatableWealth, nisabValue, meetsNisab, zakatDue };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
