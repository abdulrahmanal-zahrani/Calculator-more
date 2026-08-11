"use client";
import { normalizeNumericInput } from "@/lib/numeric";

import { useState } from "react";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import ResultCard from "@/components/ui/ResultCard";
import Tabs from "@/components/ui/Tabs";
import { calculateCoffeeRatio, BREW_RATIOS, type BrewMethod, type SolveFor } from "@/lib/calculators/coffeeRatio";
import { formatNumber } from "@/lib/format";
import { FLAGSHIP_CALCULATORS } from "@/lib/calculatorRegistry";
import type { Locale } from "@/i18n";

const meta = FLAGSHIP_CALCULATORS.find((c) => c.slug === "coffee-ratio-calculator")!;

const METHOD_LABELS: Record<BrewMethod, { ar: string; en: string }> = {
  v60: { ar: "V60", en: "V60" },
  frenchPress: { ar: "فرنش برس", en: "French Press" },
  aeropress: { ar: "إيروبرس", en: "AeroPress" },
  chemex: { ar: "كيمكس", en: "Chemex" },
  coldBrew: { ar: "كولد برو", en: "Cold Brew" },
  custom: { ar: "مخصص", en: "Custom" },
};

const COPY = {
  ar: {
    intro: "احسب نسبة القهوة إلى الماء المثالية لطريقة التحضير المفضلة لديك، أو استخرج أي قيمة من الأخرى.",
    method: "طريقة التحضير",
    solveFor: "احسب",
    water: "الماء",
    coffee: "القهوة",
    ratio: "النسبة",
    coffeeGrams: "القهوة (جرام)",
    waterMl: "الماء (مل)",
    customRatio: "النسبة المخصصة (1:x)",
    resultRatio: "النسبة",
    home: "الرئيسية",
    category: "نمط الحياة",
    howItWorks: [
      "لكل طريقة تحضير نسبة قهوة إلى ماء إرشادية شائعة (مثل 1:16 لطريقة V60).",
      "أدخل القيمة المعروفة (قهوة أو ماء) واختر ما تريد حسابه — سنحسب القيمة الأخرى تلقائيًا.",
    ],
    disclaimer: "النسب إرشادية وتُعدّل حسب الذوق الشخصي ودرجة تحميص القهوة.",
    faq: [{ question: "هل يمكن استخدام نسبة مخصصة؟", answer: "نعم، اختر «مخصص» وأدخل النسبة التي تفضلها." }],
  },
  en: {
    intro: "Find the ideal coffee-to-water ratio for your favorite brew method, or solve for any value from the others.",
    method: "Brew method",
    solveFor: "Solve for",
    water: "Water",
    coffee: "Coffee",
    ratio: "Ratio",
    coffeeGrams: "Coffee (g)",
    waterMl: "Water (ml)",
    customRatio: "Custom ratio (1:x)",
    resultRatio: "Ratio",
    home: "Home",
    category: "Lifestyle",
    howItWorks: [
      "Each brew method has a common suggested coffee-to-water ratio (e.g. 1:16 for V60).",
      "Enter the value you know (coffee or water) and pick what to solve for — we compute the rest.",
    ],
    disclaimer: "Ratios are guidelines — adjust to taste and roast level.",
    faq: [{ question: "Can I use a custom ratio?", answer: "Yes — pick \"Custom\" and enter the ratio you prefer." }],
  },
};

export default function CoffeeRatioClient({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const [method, setMethod] = useState<BrewMethod>("v60");
  const [solveFor, setSolveFor] = useState<SolveFor>("water");
  const [coffeeGrams, setCoffeeGrams] = useState("20");
  const [waterMl, setWaterMl] = useState("320");
  const [customRatio, setCustomRatio] = useState(String(BREW_RATIOS.v60));

  const ratio = method === "custom" ? Math.max(0.1, (normalizeNumericInput(customRatio) ?? BREW_RATIOS.custom)) : undefined;

  const result = calculateCoffeeRatio({
    method,
    solveFor,
    coffeeGrams: Math.max(0, (normalizeNumericInput(coffeeGrams) ?? 0)),
    waterMl: Math.max(0, (normalizeNumericInput(waterMl) ?? 0)),
    ratio,
  });

  return (
    <CalculatorShell
      locale={locale}
      meta={meta}
      intro={c.intro}
      breadcrumbLabels={{ home: c.home, category: c.category }}
      shareUrl={typeof window !== "undefined" ? window.location.href : ""}
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
          <Select label={c.method} value={method} onChange={(e) => setMethod(e.target.value as BrewMethod)}>
            {(Object.keys(METHOD_LABELS) as BrewMethod[]).map((m) => (
              <option key={m} value={m}>
                {METHOD_LABELS[m][locale]}
              </option>
            ))}
          </Select>
          {method === "custom" && (
            <Input label={c.customRatio} type="number" min={1} inputMode="decimal" value={customRatio} onChange={(e) => setCustomRatio(e.target.value)} />
          )}
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-text-muted">{c.solveFor}</span>
            <Tabs
              options={[
                { value: "water", label: c.water },
                { value: "coffee", label: c.coffee },
                { value: "ratio", label: c.ratio },
              ]}
              value={solveFor}
              onChange={setSolveFor}
            />
          </div>
          {solveFor !== "coffee" && (
            <Input label={c.coffeeGrams} type="number" min={0} inputMode="decimal" value={coffeeGrams} onChange={(e) => setCoffeeGrams(e.target.value)} />
          )}
          {solveFor !== "water" && (
            <Input label={c.waterMl} type="number" min={0} inputMode="decimal" value={waterMl} onChange={(e) => setWaterMl(e.target.value)} />
          )}
        </>
      }
      result={
        <>
          <ResultCard
            label={solveFor === "water" ? c.waterMl : solveFor === "coffee" ? c.coffeeGrams : c.resultRatio}
            value={
              solveFor === "water"
                ? `${formatNumber(result.waterMl, locale)} ml`
                : solveFor === "coffee"
                  ? `${formatNumber(result.coffeeGrams, locale)} g`
                  : `1:${formatNumber(result.ratio, locale)}`
            }
          />
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.coffeeGrams}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">{formatNumber(result.coffeeGrams, locale)} g</dd>
            </div>
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.waterMl}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">{formatNumber(result.waterMl, locale)} ml</dd>
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
