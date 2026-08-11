"use client";
import { normalizeNumericInput } from "@/lib/numeric";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Tabs from "@/components/ui/Tabs";
import Button from "@/components/ui/Button";
import ResultCard from "@/components/ui/ResultCard";
import Alert from "@/components/ui/Alert";
import {
  calculateBonus,
  dedupeAndSortMatrix,
  type BonusMatrixRow,
  type SalaryPeriod,
  type TargetBonusMethod,
  type ProrationMethod,
} from "@/lib/calculators/bonus";
import { getBonusPresets, saveBonusPreset, deleteBonusPreset, type BonusPreset } from "@/lib/bonusPresets";
import { formatCurrency, formatNumber } from "@/lib/format";
import { FLAGSHIP_CALCULATORS } from "@/lib/calculatorRegistry";
import type { Locale } from "@/i18n";

const meta = FLAGSHIP_CALCULATORS.find((c) => c.slug === "bonus-calculator")!;

type ScalePreset = "5" | "10" | "100" | "percentage" | "custom";

const SCALE_BOUNDS: Record<Exclude<ScalePreset, "custom">, { min: number; max: number }> = {
  "5": { min: 1, max: 5 },
  "10": { min: 1, max: 10 },
  "100": { min: 0, max: 100 },
  percentage: { min: 0, max: 100 },
};

function defaultMatrixForScale(min: number, max: number): BonusMatrixRow[] {
  const span = max - min;
  const round = (n: number) => Math.round(n * 100) / 100;
  return [
    { rating: round(min), multiplierPercent: 0 },
    { rating: round(min + span * 0.25), multiplierPercent: 50 },
    { rating: round(min + span * 0.5), multiplierPercent: 75 },
    { rating: round(min + span * 0.75), multiplierPercent: 100 },
    { rating: round(max), multiplierPercent: 150 },
  ];
}

const COPY = {
  ar: {
    intro: "أدخل طريقة حساب البونص في شركتك، والمِحساب يحسبها لك — بدون افتراض معادلة موحدة.",
    home: "الرئيسية",
    category: "الفلوس",
    salarySection: "الراتب",
    salaryAmount: "الراتب الأساسي",
    salaryPeriodLabel: "الفترة",
    monthly: "شهري",
    annual: "سنوي",
    ratingSection: "نظام التقييم",
    scaleLabel: "مقياس التقييم",
    scale5: "من 5",
    scale10: "من 10",
    scale100: "من 100",
    scalePercentage: "نسبة مئوية",
    scaleCustom: "مخصص",
    scaleMin: "الحد الأدنى",
    scaleMax: "الحد الأعلى",
    ratingValue: "تقييمك",
    targetSection: "البونص المستهدف",
    targetMethod: "طريقة الاحتساب",
    targetPercentage: "نسبة من الراتب السنوي",
    targetSalaries: "عدد الرواتب",
    targetFixed: "مبلغ ثابت",
    targetPercentValue: "النسبة (%)",
    targetSalaryValue: "عدد الرواتب",
    targetFixedValue: "المبلغ",
    advanced: "تفاصيل نظام شركتك",
    customMatrix: "استخدام مصفوفة بونص مخصصة",
    customMatrixHint: "بدل الاحتساب الخطي التلقائي، حدد معامل مختلف لكل مستوى تقييم كما هو معمول به في شركتك.",
    matrixRating: "التقييم",
    matrixLabel: "الوصف (اختياري)",
    matrixMultiplier: "المعامل (%)",
    addRow: "إضافة مستوى",
    removeRow: "إزالة",
    interpolate: "حساب تدريجي بين التقييمات",
    interpolateHint: "عند التفعيل، يُحسب المعامل تدريجياً بين مستويين متجاورين بدل استخدام أقرب مستوى أدنى.",
    factorsTitle: "معاملات إضافية (اختياري)",
    companyFactor: "أداء الشركة (%)",
    departmentFactor: "أداء القسم (%)",
    extraFactor: "معامل إضافي (%)",
    prorationTitle: "مدة الاستحقاق",
    prorationFull: "سنة كاملة",
    prorationMonths: "عدد الأشهر",
    prorationCustom: "نسبة مخصصة",
    eligibleMonths: "عدد الأشهر المستحقة",
    customProration: "النسبة (%)",
    result: "البونص المتوقع",
    breakdownTitle: "التفاصيل",
    annualSalaryLabel: "الراتب الأساسي السنوي",
    targetAmountLabel: "البونص المستهدف",
    ratingLabel: "التقييم",
    multiplierLabel: "معامل الأداء",
    prorationLabel: "الاستحقاق",
    totalCompLabel: "إجمالي التعويض السنوي",
    monthlyEquivalentLabel: "المتوسط الشهري المكافئ (غير مدفوع فعلياً)",
    howItWorksTitle: "كيف حسبناها؟",
    presetsTitle: "نظام شركتي",
    presetsHint: "احفظ إعدادات مصفوفة البونص وطريقة الاحتساب (بدون راتبك أو تقييمك) لإعادة استخدامها لاحقاً.",
    presetNamePlaceholder: "مثال: شركتي الحالية",
    savePreset: "حفظ",
    loadPreset: "تحميل",
    deletePreset: "حذف",
    noPresets: "لا توجد أنظمة محفوظة بعد.",
    goToSalary: "احسب راتبك",
    howItWorks: [
      "نحدد راتبك السنوي الأساسي من الراتب الشهري أو السنوي المدخل.",
      "نحسب البونص المستهدف حسب الطريقة المختارة: نسبة من الراتب، عدد رواتب، أو مبلغ ثابت.",
      "نحول تقييمك إلى معامل أداء عبر مصفوفة البونص (تلقائية أو مخصصة من نظام شركتك)، ونضربه في أي معاملات إضافية.",
      "نطبق نسبة الاستحقاق (سنة كاملة أو جزء منها) على الناتج للحصول على البونص المتوقع النهائي.",
    ],
    disclaimer: "البونص الفعلي يعتمد على سياسة الشركة وشروط الاستحقاق. النتيجة تقديرية بناءً على البيانات التي تدخلها.",
    faq: [
      {
        question: "هل الحاسبة تفترض معادلة موحدة للبونص؟",
        answer: "لا، كل شركة تحسب البونص بطريقة مختلفة. أدخل مقياس التقييم، ومصفوفة المعاملات إن رغبت، وطريقة احتساب البونص المستهدف — والحاسبة تطبق نظامك أنت.",
      },
      {
        question: "ما الفرق بين الاحتساب المتدرج والتدريجي؟",
        answer: "بدون التدرج، نستخدم أقرب مستوى تقييم أدنى من تقييمك في المصفوفة. مع تفعيل «حساب تدريجي»، نحسب المعامل تناسبياً بين مستويين متجاورين.",
      },
      {
        question: "هل تُحفظ بياناتي؟",
        answer: "فقط إذا اخترت حفظ «نظام شركتي» — ويُحفظ محلياً في متصفحك فقط، بدون راتبك أو تقييمك الشخصي، وبدون أي اتصال بخادم.",
      },
    ],
  },
  en: {
    intro: "Tell us how your company calculates bonuses, and MIHSAB computes it for you — no universal formula assumed.",
    home: "Home",
    category: "Money",
    salarySection: "Salary",
    salaryAmount: "Basic salary",
    salaryPeriodLabel: "Period",
    monthly: "Monthly",
    annual: "Annual",
    ratingSection: "Rating system",
    scaleLabel: "Rating scale",
    scale5: "Out of 5",
    scale10: "Out of 10",
    scale100: "Out of 100",
    scalePercentage: "Percentage",
    scaleCustom: "Custom",
    scaleMin: "Minimum",
    scaleMax: "Maximum",
    ratingValue: "Your rating",
    targetSection: "Target bonus",
    targetMethod: "Calculation method",
    targetPercentage: "% of annual salary",
    targetSalaries: "Number of salaries",
    targetFixed: "Fixed amount",
    targetPercentValue: "Percentage (%)",
    targetSalaryValue: "Number of salaries",
    targetFixedValue: "Amount",
    advanced: "Your company's bonus details",
    customMatrix: "Use a custom bonus matrix",
    customMatrixHint: "Instead of the automatic linear calculation, set a different multiplier per rating level as used at your company.",
    matrixRating: "Rating",
    matrixLabel: "Label (optional)",
    matrixMultiplier: "Multiplier (%)",
    addRow: "Add level",
    removeRow: "Remove",
    interpolate: "Interpolate between ratings",
    interpolateHint: "When on, the multiplier is linearly interpolated between two neighboring levels instead of using the nearest level at or below.",
    factorsTitle: "Additional factors (optional)",
    companyFactor: "Company performance (%)",
    departmentFactor: "Department performance (%)",
    extraFactor: "Extra factor (%)",
    prorationTitle: "Eligibility period",
    prorationFull: "Full year",
    prorationMonths: "Number of months",
    prorationCustom: "Custom percentage",
    eligibleMonths: "Eligible months",
    customProration: "Percentage (%)",
    result: "Estimated bonus",
    breakdownTitle: "Breakdown",
    annualSalaryLabel: "Annual base salary",
    targetAmountLabel: "Target bonus",
    ratingLabel: "Rating",
    multiplierLabel: "Performance multiplier",
    prorationLabel: "Eligibility",
    totalCompLabel: "Total annual compensation",
    monthlyEquivalentLabel: "Monthly equivalent (not an actual payment)",
    howItWorksTitle: "How we calculated it",
    presetsTitle: "My company's system",
    presetsHint: "Save your bonus matrix and calculation method (without your salary or rating) to reuse later.",
    presetNamePlaceholder: "e.g. My current company",
    savePreset: "Save",
    loadPreset: "Load",
    deletePreset: "Delete",
    noPresets: "No saved systems yet.",
    goToSalary: "Calculate your salary",
    howItWorks: [
      "We resolve your annual base salary from the monthly or annual amount you entered.",
      "We calculate the target bonus using the selected method: percentage of salary, number of salaries, or a fixed amount.",
      "We turn your rating into a performance multiplier via the bonus matrix (automatic, or your company's custom one), then multiply by any additional factors.",
      "We apply the eligibility proration (full year or a partial period) to get the final estimated bonus.",
    ],
    disclaimer: "The actual bonus depends on company policy and eligibility terms. This result is an estimate based on the data you enter.",
    faq: [
      {
        question: "Does the calculator assume a universal bonus formula?",
        answer: "No — every company calculates bonuses differently. Set the rating scale, an optional custom multiplier matrix, and the target-bonus method, and the calculator applies your own system.",
      },
      {
        question: "What's the difference between bracket and interpolated calculation?",
        answer: "Without interpolation, we use the nearest matrix level at or below your rating. With \"Interpolate\" on, the multiplier is calculated proportionally between two neighboring levels.",
      },
      {
        question: "Is my data saved?",
        answer: "Only if you choose to save \"My company's system\" — stored locally in your browser only, without your salary or personal rating, and with no server involved.",
      },
    ],
  },
};

export default function BonusCalculatorClient({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const router = useRouter();
  const searchParams = useSearchParams();

  const [salaryAmount, setSalaryAmount] = useState(searchParams.get("salary") ?? "10000");
  const [salaryPeriod, setSalaryPeriod] = useState<SalaryPeriod>(
    (searchParams.get("period") as SalaryPeriod) || "monthly"
  );
  const [scalePreset, setScalePreset] = useState<ScalePreset>((searchParams.get("scale") as ScalePreset) || "5");
  const [customMin, setCustomMin] = useState(searchParams.get("min") ?? "1");
  const [customMax, setCustomMax] = useState(searchParams.get("max") ?? "5");
  const [rating, setRating] = useState(searchParams.get("rating") ?? "4");

  const [targetMethod, setTargetMethod] = useState<TargetBonusMethod>(
    (searchParams.get("method") as TargetBonusMethod) || "percentageOfSalary"
  );
  const [targetPercent, setTargetPercent] = useState(searchParams.get("targetPercent") ?? "15");
  const [targetSalaryCount, setTargetSalaryCount] = useState(searchParams.get("targetSalaries") ?? "1");
  const [targetFixed, setTargetFixed] = useState(searchParams.get("targetFixed") ?? "10000");

  const [useCustomMatrix, setUseCustomMatrix] = useState(false);
  const [matrix, setMatrix] = useState<BonusMatrixRow[]>(defaultMatrixForScale(1, 5));
  const [interpolate, setInterpolate] = useState(false);

  const [companyFactor, setCompanyFactor] = useState("100");
  const [departmentFactor, setDepartmentFactor] = useState("100");
  const [extraFactor, setExtraFactor] = useState("100");

  const [prorationMethod, setProrationMethod] = useState<ProrationMethod>("fullYear");
  const [eligibleMonths, setEligibleMonths] = useState("12");
  const [customProration, setCustomProration] = useState("100");

  const [presets, setPresets] = useState<BonusPreset[]>([]);
  const [presetName, setPresetName] = useState("");

  useEffect(() => {
    // Presets live in localStorage only, unavailable during SSR — load them
    // once on mount (same guarded-access pattern as lib/trending.ts).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPresets(getBonusPresets());
    // Prefill from the salary calculator's "احسب البونص" link.
    const fromSalary = searchParams.get("annualSalary");
    if (fromSalary && !searchParams.get("salary")) {
      const n = normalizeNumericInput(fromSalary);
      if (n && n > 0) {
        setSalaryAmount(String(n));
        setSalaryPeriod("annual");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function syncUrl(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([k, v]) => params.set(k, v));
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  const { scaleMin, scaleMax } = useMemo(() => {
    if (scalePreset === "custom") {
      return {
        scaleMin: normalizeNumericInput(customMin) ?? 1,
        scaleMax: normalizeNumericInput(customMax) ?? 5,
      };
    }
    const bounds = SCALE_BOUNDS[scalePreset];
    return { scaleMin: bounds.min, scaleMax: bounds.max };
  }, [scalePreset, customMin, customMax]);

  function handleScaleChange(next: ScalePreset) {
    setScalePreset(next);
    syncUrl({ scale: next });
    const bounds = next === "custom" ? { min: normalizeNumericInput(customMin) ?? 1, max: normalizeNumericInput(customMax) ?? 5 } : SCALE_BOUNDS[next];
    if (!useCustomMatrix) setMatrix(defaultMatrixForScale(bounds.min, bounds.max));
  }

  const num = (v: string) => normalizeNumericInput(v) ?? 0;
  const salaryNum = Math.max(0, num(salaryAmount));
  const ratingNum = Math.min(scaleMax, Math.max(scaleMin, num(rating)));

  const activeMatrix: BonusMatrixRow[] = useCustomMatrix
    ? dedupeAndSortMatrix(matrix.filter((r) => r.rating >= scaleMin && r.rating <= scaleMax && r.multiplierPercent >= 0))
    : [
        { rating: scaleMin, multiplierPercent: 0 },
        { rating: scaleMax, multiplierPercent: 100 },
      ];
  const activeInterpolate = useCustomMatrix ? interpolate : true;

  let result;
  let calcError: string | null = null;
  try {
    result = calculateBonus({
      salaryAmount: salaryNum,
      salaryPeriod,
      ratingScaleMin: scaleMin,
      ratingScaleMax: scaleMax,
      rating: ratingNum,
      targetBonusMethod: targetMethod,
      targetBonusPercent: num(targetPercent),
      targetBonusSalaryCount: num(targetSalaryCount),
      targetBonusFixedAmount: num(targetFixed),
      matrix: activeMatrix.length > 0 ? activeMatrix : [{ rating: scaleMin, multiplierPercent: 0 }],
      interpolate: activeInterpolate,
      companyFactorPercent: num(companyFactor) || 100,
      departmentFactorPercent: num(departmentFactor) || 100,
      extraFactorPercent: num(extraFactor) || 100,
      prorationMethod,
      eligibleMonths: num(eligibleMonths),
      customProrationPercent: num(customProration),
    });
  } catch (err) {
    calcError = err instanceof Error ? err.message : String(err);
    result = null;
  }

  function updateMatrixRow(i: number, patch: Partial<BonusMatrixRow>) {
    setMatrix((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  function loadPreset(p: BonusPreset) {
    setUseCustomMatrix(true);
    setMatrix(p.matrix);
    setInterpolate(p.interpolate);
    setTargetMethod(p.targetBonusMethod);
    setTargetPercent(String(p.targetBonusPercent));
    setTargetSalaryCount(String(p.targetBonusSalaryCount));
    setTargetFixed(String(p.targetBonusFixedAmount));
    setCompanyFactor(String(p.companyFactorPercent));
    setDepartmentFactor(String(p.departmentFactorPercent));
    setExtraFactor(String(p.extraFactorPercent));
    setProrationMethod(p.prorationMethod);
    setCustomMin(String(p.ratingScaleMin));
    setCustomMax(String(p.ratingScaleMax));
    setScalePreset("custom");
  }

  function handleSavePreset() {
    if (!presetName.trim()) return;
    const preset: BonusPreset = {
      name: presetName.trim(),
      ratingScaleMin: scaleMin,
      ratingScaleMax: scaleMax,
      matrix: activeMatrix,
      interpolate: activeInterpolate,
      targetBonusMethod: targetMethod,
      targetBonusPercent: num(targetPercent),
      targetBonusSalaryCount: num(targetSalaryCount),
      targetBonusFixedAmount: num(targetFixed),
      companyFactorPercent: num(companyFactor) || 100,
      departmentFactorPercent: num(departmentFactor) || 100,
      extraFactorPercent: num(extraFactor) || 100,
      prorationMethod,
    };
    saveBonusPreset(preset);
    setPresets(getBonusPresets());
    setPresetName("");
  }

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${locale}/bonus-calculator?salary=${salaryAmount}&period=${salaryPeriod}&scale=${scalePreset}&rating=${rating}&method=${targetMethod}&targetPercent=${targetPercent}&targetSalaries=${targetSalaryCount}&targetFixed=${targetFixed}`
      : "";

  const shareTitle = result
    ? `${c.result}: ${formatCurrency(result.estimatedBonus, locale)}\n${c.annualSalaryLabel}: ${formatCurrency(result.annualBaseSalary, locale)}\n${c.ratingLabel}: ${formatNumber(ratingNum, locale)} / ${formatNumber(scaleMax, locale)}\n${locale === "ar" ? "حسب نظام البونص المدخل في المِحساب." : "Based on the bonus system entered in MIHSAB."}`
    : meta.name[locale];

  const salaryLinkHref = `/${locale}/salary-calculator`;

  return (
    <CalculatorShell
      locale={locale}
      meta={meta}
      intro={c.intro}
      breadcrumbLabels={{ home: c.home, category: c.category }}
      shareUrl={shareUrl}
      shareTitle={shareTitle}
      t={{
        calculate: "",
        howItWorks: locale === "ar" ? "كيف تعمل الحاسبة" : "How it works",
        faq: locale === "ar" ? "الأسئلة الشائعة" : "FAQ",
        related: locale === "ar" ? "حاسبات ذات صلة" : "Related calculators",
        disclaimer: locale === "ar" ? "إخلاء مسؤولية" : "Disclaimer",
        share: locale === "ar" ? "مشاركة" : "Share",
        copyLink: locale === "ar" ? "نسخ الرابط" : "Copy link",
        copied: locale === "ar" ? "تم النسخ" : "Copied",
      }}
      calculatorForm={
        <>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label={c.salaryAmount}
              type="number"
              min={0}
              inputMode="decimal"
              value={salaryAmount}
              onChange={(e) => {
                setSalaryAmount(e.target.value);
                syncUrl({ salary: e.target.value });
              }}
            />
            <Select
              label={c.salaryPeriodLabel}
              value={salaryPeriod}
              onChange={(e) => {
                const p = e.target.value as SalaryPeriod;
                setSalaryPeriod(p);
                syncUrl({ period: p });
              }}
            >
              <option value="monthly">{c.monthly}</option>
              <option value="annual">{c.annual}</option>
            </Select>
          </div>

          <Select
            label={c.scaleLabel}
            value={scalePreset}
            onChange={(e) => handleScaleChange(e.target.value as ScalePreset)}
          >
            <option value="5">{c.scale5}</option>
            <option value="10">{c.scale10}</option>
            <option value="100">{c.scale100}</option>
            <option value="percentage">{c.scalePercentage}</option>
            <option value="custom">{c.scaleCustom}</option>
          </Select>

          {scalePreset === "custom" && (
            <div className="grid grid-cols-2 gap-3">
              <Input
                label={c.scaleMin}
                type="number"
                inputMode="decimal"
                value={customMin}
                onChange={(e) => {
                  setCustomMin(e.target.value);
                  syncUrl({ min: e.target.value });
                }}
              />
              <Input
                label={c.scaleMax}
                type="number"
                inputMode="decimal"
                value={customMax}
                onChange={(e) => {
                  setCustomMax(e.target.value);
                  syncUrl({ max: e.target.value });
                }}
              />
            </div>
          )}

          <Input
            label={`${c.ratingValue} (${formatNumber(scaleMin, locale)}–${formatNumber(scaleMax, locale)})`}
            type="number"
            min={scaleMin}
            max={scaleMax}
            step={0.1}
            inputMode="decimal"
            value={rating}
            onChange={(e) => {
              setRating(e.target.value);
              syncUrl({ rating: e.target.value });
            }}
          />

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-text-muted">{c.targetMethod}</span>
            <Tabs
              value={targetMethod}
              onChange={(v) => {
                setTargetMethod(v as TargetBonusMethod);
                syncUrl({ method: v });
              }}
              options={[
                { value: "percentageOfSalary", label: c.targetPercentage },
                { value: "numberOfSalaries", label: c.targetSalaries },
                { value: "fixedAmount", label: c.targetFixed },
              ]}
            />
          </div>

          {targetMethod === "percentageOfSalary" && (
            <Input
              label={c.targetPercentValue}
              type="number"
              min={0}
              inputMode="decimal"
              value={targetPercent}
              onChange={(e) => {
                setTargetPercent(e.target.value);
                syncUrl({ targetPercent: e.target.value });
              }}
            />
          )}
          {targetMethod === "numberOfSalaries" && (
            <Input
              label={c.targetSalaryValue}
              type="number"
              min={0}
              step={0.1}
              inputMode="decimal"
              value={targetSalaryCount}
              onChange={(e) => {
                setTargetSalaryCount(e.target.value);
                syncUrl({ targetSalaries: e.target.value });
              }}
            />
          )}
          {targetMethod === "fixedAmount" && (
            <Input
              label={c.targetFixedValue}
              type="number"
              min={0}
              inputMode="decimal"
              value={targetFixed}
              onChange={(e) => {
                setTargetFixed(e.target.value);
                syncUrl({ targetFixed: e.target.value });
              }}
            />
          )}

          <details className="rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-4">
            <summary className="cursor-pointer text-sm font-semibold text-text">{c.advanced}</summary>
            <div className="mt-3 space-y-4">
              <label className="flex items-center gap-2 text-sm text-text-muted">
                <input
                  type="checkbox"
                  checked={useCustomMatrix}
                  onChange={(e) => setUseCustomMatrix(e.target.checked)}
                />
                {c.customMatrix}
              </label>
              <p className="text-xs text-text-faint">{c.customMatrixHint}</p>

              {useCustomMatrix && (
                <div className="space-y-2">
                  {matrix.map((row, i) => (
                    <div key={i} className="grid grid-cols-[1fr_1.4fr_1fr_auto] items-end gap-2">
                      <Input
                        label={c.matrixRating}
                        type="number"
                        inputMode="decimal"
                        value={row.rating}
                        onChange={(e) => updateMatrixRow(i, { rating: normalizeNumericInput(e.target.value) ?? row.rating })}
                      />
                      <Input
                        label={c.matrixLabel}
                        value={row.label ?? ""}
                        onChange={(e) => updateMatrixRow(i, { label: e.target.value })}
                      />
                      <Input
                        label={c.matrixMultiplier}
                        type="number"
                        min={0}
                        inputMode="decimal"
                        value={row.multiplierPercent}
                        onChange={(e) =>
                          updateMatrixRow(i, { multiplierPercent: Math.max(0, normalizeNumericInput(e.target.value) ?? 0) })
                        }
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMatrix((prev) => prev.filter((_, idx) => idx !== i))}
                        disabled={matrix.length <= 1}
                      >
                        {c.removeRow}
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setMatrix((prev) => [...prev, { rating: scaleMax, multiplierPercent: 100 }])}
                  >
                    + {c.addRow}
                  </Button>

                  <label className="flex items-center gap-2 pt-2 text-sm text-text-muted">
                    <input type="checkbox" checked={interpolate} onChange={(e) => setInterpolate(e.target.checked)} />
                    {c.interpolate}
                  </label>
                  <p className="text-xs text-text-faint">{c.interpolateHint}</p>
                </div>
              )}

              <div className="border-t border-border pt-4">
                <p className="text-sm font-semibold text-text">{c.factorsTitle}</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <Input label={c.companyFactor} type="number" min={0} inputMode="decimal" value={companyFactor} onChange={(e) => setCompanyFactor(e.target.value)} />
                  <Input label={c.departmentFactor} type="number" min={0} inputMode="decimal" value={departmentFactor} onChange={(e) => setDepartmentFactor(e.target.value)} />
                  <Input label={c.extraFactor} type="number" min={0} inputMode="decimal" value={extraFactor} onChange={(e) => setExtraFactor(e.target.value)} />
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm font-semibold text-text">{c.prorationTitle}</p>
                <div className="mt-2 flex flex-col gap-1.5">
                  <Tabs
                    value={prorationMethod}
                    onChange={(v) => setProrationMethod(v as ProrationMethod)}
                    options={[
                      { value: "fullYear", label: c.prorationFull },
                      { value: "months", label: c.prorationMonths },
                      { value: "customPercentage", label: c.prorationCustom },
                    ]}
                  />
                </div>
                {prorationMethod === "months" && (
                  <Input
                    className="mt-2"
                    label={c.eligibleMonths}
                    type="number"
                    min={0}
                    max={12}
                    inputMode="decimal"
                    value={eligibleMonths}
                    onChange={(e) => setEligibleMonths(e.target.value)}
                  />
                )}
                {prorationMethod === "customPercentage" && (
                  <Input
                    className="mt-2"
                    label={c.customProration}
                    type="number"
                    min={0}
                    inputMode="decimal"
                    value={customProration}
                    onChange={(e) => setCustomProration(e.target.value)}
                  />
                )}
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm font-semibold text-text">{c.presetsTitle}</p>
                <p className="mt-1 text-xs text-text-faint">{c.presetsHint}</p>
                <div className="mt-2 flex gap-2">
                  <Input
                    placeholder={c.presetNamePlaceholder}
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                  />
                  <Button variant="secondary" size="sm" onClick={handleSavePreset} disabled={!presetName.trim()}>
                    {c.savePreset}
                  </Button>
                </div>
                {presets.length === 0 ? (
                  <p className="mt-2 text-xs text-text-faint">{c.noPresets}</p>
                ) : (
                  <ul className="mt-2 space-y-1">
                    {presets.map((p) => (
                      <li key={p.name} className="flex items-center justify-between gap-2 rounded-[var(--radius-md)] bg-bg-subtle px-3 py-2 text-sm">
                        <span className="text-text">{p.name}</span>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => loadPreset(p)}>
                            {c.loadPreset}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              deleteBonusPreset(p.name);
                              setPresets(getBonusPresets());
                            }}
                          >
                            {c.deletePreset}
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </details>

          <p className="text-sm">
            <Link href={salaryLinkHref} className="text-accent hover:underline">
              {c.goToSalary} ←
            </Link>
          </p>
        </>
      }
      result={
        calcError || !result ? (
          <Alert title={locale === "ar" ? "تحقق من البيانات المدخلة" : "Check your inputs"} tone="warning">
            {locale === "ar" ? "تأكد من أن التقييم ضمن نطاق المقياس المختار وأن جميع القيم صحيحة." : "Make sure the rating is within the selected scale and all values are valid."}
          </Alert>
        ) : (
          <>
            <ResultCard label={c.result} value={formatCurrency(result.estimatedBonus, locale)} />
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
                <dt className="text-text-faint">{c.annualSalaryLabel}</dt>
                <dd className="mt-1 font-semibold tabular-nums text-text">{formatCurrency(result.annualBaseSalary, locale)}</dd>
              </div>
              <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
                <dt className="text-text-faint">{c.targetAmountLabel}</dt>
                <dd className="mt-1 font-semibold tabular-nums text-text">{formatCurrency(result.targetBonusAmount, locale)}</dd>
              </div>
              <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
                <dt className="text-text-faint">{c.ratingLabel}</dt>
                <dd className="mt-1 font-semibold tabular-nums text-text">
                  {formatNumber(result.performanceRating, locale)} / {formatNumber(scaleMax, locale)}
                </dd>
              </div>
              <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
                <dt className="text-text-faint">{c.multiplierLabel}</dt>
                <dd className="mt-1 font-semibold tabular-nums text-text">{formatNumber(result.performanceMultiplier * 100, locale)}%</dd>
              </div>
              {prorationMethod !== "fullYear" && (
                <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
                  <dt className="text-text-faint">{c.prorationLabel}</dt>
                  <dd className="mt-1 font-semibold tabular-nums text-text">{formatNumber(result.prorationFactor * 100, locale)}%</dd>
                </div>
              )}
              <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
                <dt className="text-text-faint">{c.totalCompLabel}</dt>
                <dd className="mt-1 font-semibold tabular-nums text-text">{formatCurrency(result.totalAnnualCompensation, locale)}</dd>
              </div>
              <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3 col-span-2">
                <dt className="text-text-faint">{c.monthlyEquivalentLabel}</dt>
                <dd className="mt-1 font-semibold tabular-nums text-text">{formatCurrency(result.monthlyEquivalent, locale)}</dd>
              </div>
            </dl>

            <details className="rounded-[var(--radius-md)] bg-bg-subtle p-3 text-sm">
              <summary className="cursor-pointer font-medium text-text">{c.howItWorksTitle}</summary>
              <p className="mt-2 leading-relaxed text-text-muted" dir="ltr">
                {formatCurrency(result.targetBonusAmount, locale)} × {formatNumber(result.performanceMultiplier * 100, locale)}%
                {prorationMethod !== "fullYear" ? ` × ${formatNumber(result.prorationFactor * 100, locale)}%` : ""} ={" "}
                {formatCurrency(result.estimatedBonus, locale)}
              </p>
            </details>
          </>
        )
      }
      howItWorks={
        <ol className="list-decimal space-y-2 ps-5">
          {c.howItWorks.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      }
      faq={c.faq}
      disclaimer={c.disclaimer}
    />
  );
}
