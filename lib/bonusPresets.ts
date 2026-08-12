/**
 * Local persistence for the bonus calculator's "نظام شركتي" (my company's
 * system) presets — reuses the guarded typeof window + try/catch
 * localStorage pattern from lib/trending.ts. Only the company's
 * calculation STRUCTURE is saved (rating scale, bonus matrix, target-bonus
 * method, optional factors) — never the employee's personal salary or
 * rating values, since those don't need to survive between sessions.
 */
import type { BonusMatrixRow, TargetBonusMethod, ProrationMethod } from "@/lib/calculators/bonus";

const PRESETS_KEY = "mihsab:bonusPresets";
const MAX_PRESETS = 10;

export interface BonusPreset {
  name: string;
  ratingScaleMin: number;
  ratingScaleMax: number;
  matrix: BonusMatrixRow[];
  interpolate: boolean;
  targetBonusMethod: TargetBonusMethod;
  targetBonusPercent: number;
  targetBonusSalaryCount: number;
  targetBonusFixedAmount: number;
  companyFactorPercent: number;
  departmentFactorPercent: number;
  extraFactorPercent: number;
  prorationMethod: ProrationMethod;
}

export function getBonusPresets(): BonusPreset[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(PRESETS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveBonusPreset(preset: BonusPreset): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getBonusPresets().filter((p) => p.name !== preset.name);
    const next = [preset, ...existing].slice(0, MAX_PRESETS);
    window.localStorage.setItem(PRESETS_KEY, JSON.stringify(next));
  } catch {
    // localStorage unavailable (private mode, disabled) — silently skip.
  }
}

export function deleteBonusPreset(name: string): void {
  if (typeof window === "undefined") return;
  try {
    const next = getBonusPresets().filter((p) => p.name !== name);
    window.localStorage.setItem(PRESETS_KEY, JSON.stringify(next));
  } catch {
    // silently skip
  }
}
