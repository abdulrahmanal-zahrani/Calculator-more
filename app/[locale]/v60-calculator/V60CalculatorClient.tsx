"use client";
import { normalizeNumericInput } from "@/lib/numeric";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Tabs from "@/components/ui/Tabs";
import ResultCard from "@/components/ui/ResultCard";
import {
  calculateCoffeeRecipe,
  BREW_METHOD_RATIOS,
  PRESET_RATIOS,
  type BrewMethod,
  type CoffeePreset,
  type SolveFor,
} from "@/lib/calculators/coffeeRecipe";
import { formatNumber } from "@/lib/format";
import { FLAGSHIP_CALCULATORS } from "@/lib/calculatorRegistry";
import type { Locale } from "@/i18n";

const meta = FLAGSHIP_CALCULATORS.find((c) => c.slug === "v60-calculator")!;

const METHOD_LABELS: Record<BrewMethod, { ar: string; en: string }> = {
  v60: { ar: "V60", en: "V60" },
  frenchPress: { ar: "فرنش برس", en: "French Press" },
  aeropress: { ar: "إيروبرس", en: "AeroPress" },
  chemex: { ar: "كيمكس", en: "Chemex" },
  coldBrew: { ar: "كولد برو", en: "Cold Brew" },
  custom: { ar: "مخصص", en: "Custom" },
};

const PRESET_LABELS: Record<CoffeePreset, { ar: string; en: string }> = {
  light: { ar: "خفيف", en: "Light" },
  balanced: { ar: "متوازن", en: "Balanced" },
  strong: { ar: "قوي", en: "Strong" },
  custom: { ar: "مخصص", en: "Custom" },
};

const COPY = {
  ar: {
    intro: "احسب نسبة القهوة والماء المثالية لأي طريقة تحضير — V60، فرنش برس، إيروبرس، كيمكس، وكولد برو — وعدّل أي قيمة مباشرة.",
    method: "طريقة التحضير",
    preset: "الجاهزية",
    solveFor: "عدّل",
    coffee: "القهوة (جرام)",
    water: "الماء (جرام)",
    ratio: "النسبة (ماء:قهوة)",
    resultRatio: "النسبة",
    advanced: "خيارات متقدمة",
    grindGuidance: "طحن القهوة",
    grindText: "طحن متوسط إلى ناعم حسب طريقة التحضير — كلما كانت طريقة التقطير أسرع، كان الطحن أدق.",
    waterTemp: "حرارة الماء الموصى بها",
    waterTempText: "92–96°م لمعظم طرق التقطير، و20–25°م (ماء بارد) لطريقة الكولد برو.",
    bloomWater: "ماء التبليل",
    bloomTime: "وقت التبليل",
    totalTime: "زمن التحضير المستهدف",
    pourSchedule: "جدول الصب",
    seconds: "ث",
    home: "الرئيسية",
    category: "القهوة والأكل",
    howItWorks: [
      "اختر طريقة التحضير، وستُقترح نسبة ماء إلى قهوة مبدئية يمكنك تعديلها في أي وقت.",
      "عدّل القهوة أو الماء أو النسبة مباشرة — نعيد حساب القيمتين الأخريين تلقائياً.",
      "افتح «خيارات متقدمة» لجدول الصب، ماء التبليل، وحرارة الماء الموصى بها.",
    ],
    disclaimer: "هذه إرشادات عامة لتحضير القهوة وقد تحتاج لتعديل حسب نوع التحميص وطحن القهوة.",
    faq: [
      { question: "هل النسبة ثابتة لكل طريقة؟", answer: "لا، النسبة المقترحة نقطة بداية فقط — يمكنك تعديلها دائماً لتناسب ذوقك." },
      { question: "ما الفرق بين الجاهزيات؟", answer: "كل جاهزية تقترح نسبة ماء إلى قهوة مختلفة كنقطة بداية — كلما قلّت النسبة زادت قوة القهوة." },
    ],
  },
  en: {
    intro: "Calculate the ideal coffee-to-water ratio for any brew method — V60, French Press, AeroPress, Chemex, or Cold Brew — and edit any value directly.",
    method: "Brew method",
    preset: "Preset",
    solveFor: "Edit",
    coffee: "Coffee (grams)",
    water: "Water (grams)",
    ratio: "Ratio (water:coffee)",
    resultRatio: "Ratio",
    advanced: "Advanced options",
    grindGuidance: "Grind size",
    grindText: "Medium to fine grind depending on method — faster brew methods need a finer grind.",
    waterTemp: "Recommended water temperature",
    waterTempText: "92–96°C for most pour-over/immersion methods, 20–25°C (cold water) for cold brew.",
    bloomWater: "Bloom water",
    bloomTime: "Bloom time",
    totalTime: "Target brew time",
    pourSchedule: "Pour schedule",
    seconds: "s",
    home: "Home",
    category: "Coffee & Food",
    howItWorks: [
      "Pick a brew method — we suggest a starting water-to-coffee ratio you can edit any time.",
      "Edit coffee, water, or ratio directly — we recalculate the other two live.",
      "Open \"Advanced options\" for the pour schedule, bloom water, and recommended water temperature.",
    ],
    disclaimer: "These are general brewing guidelines and may need adjustment for roast level and grind size.",
    faq: [
      { question: "Is the ratio locked per method?", answer: "No — the suggested ratio is just a starting point. You can always edit it to taste." },
      { question: "What's the difference between presets?", answer: "Each preset suggests a different starting water-to-coffee ratio — a lower ratio means stronger coffee." },
    ],
  },
};

export default function V60CalculatorClient({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const router = useRouter();
  const searchParams = useSearchParams();

  const [method, setMethod] = useState<BrewMethod>((searchParams.get("method") as BrewMethod) || "v60");
  const [preset, setPreset] = useState<CoffeePreset>((searchParams.get("preset") as CoffeePreset) || "balanced");
  const [solveFor, setSolveFor] = useState<SolveFor>((searchParams.get("solveFor") as SolveFor) || "water");
  const [coffee, setCoffee] = useState(searchParams.get("coffee") ?? "20");
  const [water, setWater] = useState(searchParams.get("water") ?? "320");
  const [ratio, setRatio] = useState(searchParams.get("ratio") ?? String(BREW_METHOD_RATIOS.v60));

  function syncUrl(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([k, v]) => params.set(k, v));
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  function applyRatio(nextRatio: number) {
    setRatio(String(nextRatio));
    syncUrl({ ratio: String(nextRatio) });
  }

  const coffeeNum = Math.max(0, normalizeNumericInput(coffee) ?? 0);
  const waterNum = Math.max(0, normalizeNumericInput(water) ?? 0);
  const ratioNum = Math.max(0.1, normalizeNumericInput(ratio) ?? BREW_METHOD_RATIOS[method]);

  const result = calculateCoffeeRecipe({
    method,
    solveFor,
    coffeeGrams: coffeeNum,
    waterGrams: waterNum,
    ratio: solveFor === "ratio" ? undefined : ratioNum,
  });

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${locale}/v60-calculator?method=${method}&preset=${preset}&solveFor=${solveFor}&coffee=${coffee}&water=${water}&ratio=${ratio}`
      : "";

  return (
    <CalculatorShell
      locale={locale}
      meta={meta}
      intro={c.intro}
      breadcrumbLabels={{ home: c.home, category: c.category }}
      shareUrl={shareUrl}
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
          <Select
            label={c.method}
            value={method}
            onChange={(e) => {
              const m = e.target.value as BrewMethod;
              setMethod(m);
              applyRatio(BREW_METHOD_RATIOS[m]);
              syncUrl({ method: m });
            }}
          >
            {(Object.keys(METHOD_LABELS) as BrewMethod[]).map((m) => (
              <option key={m} value={m}>
                {METHOD_LABELS[m][locale]}
              </option>
            ))}
          </Select>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-text-muted">{c.preset}</span>
            <Tabs
              value={preset}
              onChange={(p) => {
                setPreset(p);
                syncUrl({ preset: p });
                if (p !== "custom") applyRatio(PRESET_RATIOS[p]);
              }}
              options={(["light", "balanced", "strong", "custom"] as CoffeePreset[]).map((p) => ({
                value: p,
                label: PRESET_LABELS[p][locale],
              }))}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-text-muted">{c.solveFor}</span>
            <Tabs
              options={[
                { value: "water", label: c.water },
                { value: "coffee", label: c.coffee },
                { value: "ratio", label: c.ratio },
              ]}
              value={solveFor}
              onChange={(next) => {
                // Seed the field that's about to become editable with the last
                // computed value so switching modes never loses/jumps state.
                if (next !== "water" && solveFor === "water") {
                  setWater(String(result.waterGrams));
                  syncUrl({ water: String(result.waterGrams) });
                }
                if (next !== "coffee" && solveFor === "coffee") {
                  setCoffee(String(result.coffeeGrams));
                  syncUrl({ coffee: String(result.coffeeGrams) });
                }
                if (next !== "ratio" && solveFor === "ratio") {
                  setRatio(String(result.ratio));
                  syncUrl({ ratio: String(result.ratio) });
                }
                setSolveFor(next);
                syncUrl({ solveFor: next });
              }}
            />
          </div>

          <Input
            label={c.coffee}
            type="number"
            min={0}
            inputMode="decimal"
            value={solveFor === "coffee" ? formatNumber(result.coffeeGrams, locale) : coffee}
            disabled={solveFor === "coffee"}
            onChange={(e) => {
              setCoffee(e.target.value);
              syncUrl({ coffee: e.target.value });
            }}
          />
          <Input
            label={c.water}
            type="number"
            min={0}
            inputMode="decimal"
            value={solveFor === "water" ? formatNumber(result.waterGrams, locale) : water}
            disabled={solveFor === "water"}
            onChange={(e) => {
              setWater(e.target.value);
              syncUrl({ water: e.target.value });
            }}
          />
          <Input
            label={c.ratio}
            type="number"
            min={0.1}
            step={0.1}
            inputMode="decimal"
            value={solveFor === "ratio" ? formatNumber(result.ratio, locale) : ratio}
            disabled={solveFor === "ratio"}
            onChange={(e) => {
              setRatio(e.target.value);
              syncUrl({ ratio: e.target.value });
            }}
          />

          <details className="rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-4">
            <summary className="cursor-pointer text-sm font-semibold text-text">{c.advanced}</summary>
            <div className="mt-3 space-y-3 text-sm">
              <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
                <p className="font-medium text-text">{c.grindGuidance}</p>
                <p className="mt-1 text-text-muted">{c.grindText}</p>
              </div>
              <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
                <p className="font-medium text-text">{c.waterTemp}</p>
                <p className="mt-1 text-text-muted">{c.waterTempText}</p>
              </div>
              <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
                <dt className="text-text-faint">{c.bloomWater}</dt>
                <dd className="mt-1 font-semibold tabular-nums text-text">{formatNumber(result.bloomWaterGrams, locale)} g</dd>
              </div>
              <ol className="space-y-2">
                {result.pourSchedule.map((step, i) => (
                  <li key={i} className="flex items-center justify-between rounded-[var(--radius-md)] bg-bg-subtle px-3 py-2">
                    <span className="flex items-center gap-2 text-text-muted">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
                        {i + 1}
                      </span>
                      {step.label[locale]}
                      <span className="text-text-faint">· {step.atSeconds}{c.seconds}</span>
                    </span>
                    <span className="font-semibold tabular-nums text-text">{formatNumber(step.targetWaterGrams, locale)} g</span>
                  </li>
                ))}
              </ol>
              <p className="text-xs text-text-faint">
                {c.totalTime}: {Math.floor(result.targetBrewTimeSeconds / 60)}:{String(result.targetBrewTimeSeconds % 60).padStart(2, "0")}
              </p>
            </div>
          </details>
        </>
      }
      result={
        <>
          <ResultCard
            label={solveFor === "water" ? c.water : solveFor === "coffee" ? c.coffee : c.resultRatio}
            value={
              solveFor === "water"
                ? `${formatNumber(result.waterGrams, locale)} g`
                : solveFor === "coffee"
                  ? `${formatNumber(result.coffeeGrams, locale)} g`
                  : `1:${formatNumber(result.ratio, locale)}`
            }
          />
          <dl className="grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.coffee}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">{formatNumber(result.coffeeGrams, locale)} g</dd>
            </div>
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.water}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">{formatNumber(result.waterGrams, locale)} g</dd>
            </div>
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.resultRatio}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">1:{formatNumber(result.ratio, locale)}</dd>
            </div>
          </dl>
        </>
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
