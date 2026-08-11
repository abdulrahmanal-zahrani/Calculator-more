"use client";
import { normalizeNumericInput } from "@/lib/numeric";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import Input from "@/components/ui/Input";
import Tabs from "@/components/ui/Tabs";
import ResultCard from "@/components/ui/ResultCard";
import { calculateV60Recipe, V60_PRESET_RATIOS, type V60Preset } from "@/lib/calculators/v60";
import { formatNumber } from "@/lib/format";
import { FLAGSHIP_CALCULATORS } from "@/lib/calculatorRegistry";
import type { Locale } from "@/i18n";

const meta = FLAGSHIP_CALCULATORS.find((c) => c.slug === "v60-calculator")!;

const PRESET_LABELS: Record<V60Preset, { ar: string; en: string }> = {
  beginner: { ar: "مبتدئ", en: "Beginner" },
  balanced: { ar: "متوازن", en: "Balanced" },
  strong: { ar: "قوي", en: "Strong" },
  light: { ar: "خفيف", en: "Light" },
  custom: { ar: "مخصص", en: "Custom" },
};

const COPY = {
  ar: {
    intro: "احصل على النسبة المثالية بين القهوة والماء لطريقة V60، مع جدول صب دقيق خطوة بخطوة.",
    cups: "عدد الأكواب",
    coffee: "القهوة (جرام)",
    water: "الماء (جرام)",
    ratio: "النسبة (ماء:قهوة)",
    bloomWater: "ماء التبليل",
    bloomTime: "وقت التبليل",
    totalTime: "زمن التحضير المستهدف",
    pourSchedule: "جدول الصب",
    seconds: "ث",
    home: "الرئيسية",
    category: "نمط الحياة",
    howItWorks: [
      "نبدأ بنسبة الماء إلى القهوة حسب الجاهزية المختارة (مثلاً 15:1 للنسخة المتوازنة).",
      "نحسب كمية التبليل (ضعف وزن القهوة تقريبًا) والوقت المخصص له.",
      "نقسم باقي الماء على 3 صبات متتالية لضمان استخلاص متوازن.",
    ],
    disclaimer: "هذه إرشادات عامة لتحضير القهوة وقد تحتاج لتعديل حسب نوع التحميص وطحن القهوة.",
    faq: [
      { question: "ما الفرق بين الجاهزيات؟", answer: "كل جاهزية تستخدم نسبة ماء إلى قهوة مختلفة — كلما قلّت النسبة زادت قوة القهوة." },
    ],
  },
  en: {
    intro: "Get the ideal coffee-to-water ratio for V60 pour-over, with a precise step-by-step pour schedule.",
    cups: "Cups",
    coffee: "Coffee (grams)",
    water: "Water (grams)",
    ratio: "Ratio (water:coffee)",
    bloomWater: "Bloom water",
    bloomTime: "Bloom time",
    totalTime: "Target brew time",
    pourSchedule: "Pour schedule",
    seconds: "s",
    home: "Home",
    category: "Lifestyle",
    howItWorks: [
      "We start from the water-to-coffee ratio for the chosen preset (e.g. 15:1 for balanced).",
      "We compute the bloom amount (roughly 2x the coffee weight) and its duration.",
      "We split the remaining water across 3 pours for even extraction.",
    ],
    disclaimer: "These are general brewing guidelines and may need adjustment for roast level and grind size.",
    faq: [
      { question: "What's the difference between presets?", answer: "Each preset uses a different water-to-coffee ratio — a lower ratio means stronger coffee." },
    ],
  },
};

export default function V60CalculatorClient({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const router = useRouter();
  const searchParams = useSearchParams();

  const [preset, setPreset] = useState<V60Preset>((searchParams.get("preset") as V60Preset) || "balanced");
  const [coffee, setCoffee] = useState(searchParams.get("coffee") ?? "20");

  function syncUrl(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([k, v]) => params.set(k, v));
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  const coffeeNum = Math.max(0, (normalizeNumericInput(coffee) ?? 0));
  const ratio = preset !== "custom" ? V60_PRESET_RATIOS[preset] : 15;

  const result = calculateV60Recipe({ coffeeGrams: coffeeNum, preset, ratio });

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${locale}/v60-calculator?coffee=${coffee}&preset=${preset}`
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
          <Tabs
            value={preset}
            onChange={(v) => {
              setPreset(v);
              syncUrl({ preset: v });
            }}
            options={(["beginner", "balanced", "strong", "light"] as V60Preset[]).map((p) => ({
              value: p,
              label: PRESET_LABELS[p][locale],
            }))}
          />
          <Input
            label={c.coffee}
            type="number"
            min={0}
            inputMode="decimal"
            value={coffee}
            onChange={(e) => {
              setCoffee(e.target.value);
              syncUrl({ coffee: e.target.value });
            }}
          />
          <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3 text-sm">
            <span className="text-text-faint">{c.ratio}: </span>
            <span className="font-semibold tabular-nums text-text">1:{ratio}</span>
          </div>
        </>
      }
      result={
        <>
          <ResultCard label={c.water} value={`${formatNumber(result.waterGrams, locale)} g`} hint={`${c.coffee}: ${formatNumber(result.coffeeGrams, locale)} g`} />
          <div className="rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-4">
            <p className="text-sm font-semibold text-text">{c.pourSchedule}</p>
            <ol className="mt-3 space-y-3">
              {result.pourSchedule.map((step, i) => (
                <li key={i} className="flex items-center justify-between rounded-[var(--radius-md)] bg-bg-subtle px-3 py-2 text-sm">
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
            <p className="mt-3 text-xs text-text-faint">
              {c.totalTime}: {Math.floor(result.targetBrewTimeSeconds / 60)}:{String(result.targetBrewTimeSeconds % 60).padStart(2, "0")}
            </p>
          </div>
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
