/**
 * GOSI (General Organization for Social Insurance) contribution rates —
 * Saudi Arabia, Saudi-national employees, private sector.
 *
 * IMPORTANT: These are reference/example figures compiled from public
 * commentary on GOSI's reform, not a live feed from GOSI. Rates, the wage
 * ceiling, and phase-in schedule can change — always verify the current
 * rate on GOSI's website (https://www.gosi.gov.sa) before relying on this
 * for payroll or compliance purposes.
 *
 * Background: GOSI's legacy system charged a flat ~9% employee / ~9%
 * employer annuities (pensions) contribution on (basic + housing), capped
 * at a wage ceiling. Starting July 2022, a restructured system began
 * phasing in higher combined annuities contributions for Saudi nationals,
 * moving gradually over several years toward a 2024/2025 target split.
 * SANED (unemployment insurance), introduced earlier, applies at 0.75%
 * employee / 0.75% employer under both systems for Saudi nationals.
 *
 * Contribution basis in both systems: basic salary + housing allowance,
 * capped at the wage ceiling below.
 */

export interface GosiSystem {
  id: "legacy" | "new";
  label: { ar: string; en: string };
  effectiveNote: { ar: string; en: string };
  /** Annuities (pensions) branch — applies to (basic + housing), capped at wageCeiling. */
  employeeAnnuitiesRate: number;
  employerAnnuitiesRate: number;
  /** SANED unemployment insurance — same basis as annuities. */
  employeeSanedRate: number;
  employerSanedRate: number;
  /** Monthly wage ceiling the contribution basis is capped at (SAR). */
  wageCeiling: number;
}

export const GOSI_LEGACY_SYSTEM: GosiSystem = {
  id: "legacy",
  label: { ar: "النظام السابق", en: "Legacy system" },
  effectiveNote: {
    ar: "النظام المطبق قبل التحديث الذي بدأ في يوليو 2022 (نسب مرجعية تقريبية).",
    en: "The system in effect before the reform that began phasing in from July 2022 (approximate reference rates).",
  },
  employeeAnnuitiesRate: 0.09,
  employerAnnuitiesRate: 0.09,
  employeeSanedRate: 0.0075,
  employerSanedRate: 0.0075,
  wageCeiling: 45000,
};

export const GOSI_NEW_SYSTEM: GosiSystem = {
  id: "new",
  label: { ar: "النظام الجديد", en: "New system" },
  effectiveNote: {
    ar: "النظام المُحدَّث الذي بدأ تطبيقه تدريجياً من يوليو 2022 وحتى اكتماله في 2024/2025 (نسب مرجعية تقريبية لمرحلة الاكتمال).",
    en: "The restructured system phased in gradually from July 2022 through completion in 2024/2025 (approximate reference rates at full phase-in).",
  },
  // Combined annuities rate rose from the legacy 9%/9% toward roughly
  // 11%/11.75% at full phase-in — treated here as a single reference point,
  // not a year-by-year schedule.
  employeeAnnuitiesRate: 0.11,
  employerAnnuitiesRate: 0.1175,
  employeeSanedRate: 0.0075,
  employerSanedRate: 0.0075,
  wageCeiling: 45000,
};

export const GOSI_SYSTEMS: Record<"legacy" | "new", GosiSystem> = {
  legacy: GOSI_LEGACY_SYSTEM,
  new: GOSI_NEW_SYSTEM,
};

export const GOSI_SOURCE_NOTE = {
  ar: "تحقق من النسبة الحالية من موقع التأمينات الاجتماعية (GOSI). المصدر: GOSI — النسب أعلاه أرقام مرجعية تقريبية وقد تتغير.",
  en: "Verify the current rate on GOSI's website. Source: GOSI — the rates above are approximate reference figures and may change.",
};
