"use client";
import { normalizeNumericInput } from "@/lib/numeric";

import { useState } from "react";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import ResultCard from "@/components/ui/ResultCard";
import { calculateProtein, type ActivityLevel, type ProteinGoal } from "@/lib/calculators/protein";
import { formatNumber } from "@/lib/format";
import { FLAGSHIP_CALCULATORS } from "@/lib/calculatorRegistry";
import type { Locale } from "@/i18n";

const meta = FLAGSHIP_CALCULATORS.find((c) => c.slug === "protein-calculator")!;

const ACTIVITY_LABELS: Record<ActivityLevel, { ar: string; en: string }> = {
  sedentary: { ar: "قليل الحركة", en: "Sedentary" },
  light: { ar: "نشاط خفيف", en: "Light activity" },
  moderate: { ar: "نشاط متوسط", en: "Moderate activity" },
  active: { ar: "نشيط", en: "Active" },
  veryActive: { ar: "نشيط جدًا", en: "Very active" },
};

const GOAL_LABELS: Record<ProteinGoal, { ar: string; en: string }> = {
  maintain: { ar: "الحفاظ على الوزن", en: "Maintain weight" },
  loseFat: { ar: "خسارة دهون", en: "Fat loss" },
  buildMuscle: { ar: "بناء عضلات", en: "Build muscle" },
};

const COPY = {
  ar: {
    intro: "احسب احتياجك اليومي التقديري من البروتين بالجرام حسب وزنك وهدفك.",
    weight: "الوزن (كجم)",
    activity: "مستوى النشاط",
    goal: "الهدف",
    meals: "عدد الوجبات يوميًا",
    perDay: "البروتين يوميًا",
    perMeal: "البروتين لكل وجبة",
    home: "الرئيسية",
    category: "نمط الحياة",
    howItWorks: [
      "نستخدم مدى جرامات بروتين لكل كيلوجرام من وزن الجسم يعتمد على هدفك (حفاظ، خسارة دهون، أو بناء عضلات).",
      "نقسم إجمالي البروتين اليومي على عدد الوجبات لتوزيع متوازن.",
    ],
    disclaimer: "تقدير عام وليس استشارة طبية أو غذائية — استشر أخصائي تغذية لحالتك الخاصة، خصوصًا إن كانت لديك حالة كلوية.",
    faq: [{ question: "هل ينطبق هذا على الجميع؟", answer: "هذه أرقام عامة مبنية على أبحاث تغذية شائعة — احتياجك الفعلي قد يختلف." }],
  },
  en: {
    intro: "Estimate your daily protein needs in grams based on your weight and goal.",
    weight: "Weight (kg)",
    activity: "Activity level",
    goal: "Goal",
    meals: "Meals per day",
    perDay: "Protein per day",
    perMeal: "Protein per meal",
    home: "Home",
    category: "Lifestyle",
    howItWorks: [
      "We use a grams-per-kg-of-bodyweight range that depends on your goal (maintain, fat loss, or muscle building).",
      "We divide the total daily protein by your number of meals for balanced distribution.",
    ],
    disclaimer: "This is a general estimate, not medical or dietary advice — consult a registered dietitian for your specific situation, especially with kidney conditions.",
    faq: [{ question: "Does this apply to everyone?", answer: "These are general figures based on common nutrition research — your actual needs may vary." }],
  },
};

export default function ProteinCalculatorClient({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const [weight, setWeight] = useState("75");
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [goal, setGoal] = useState<ProteinGoal>("maintain");
  const [meals, setMeals] = useState("3");

  const result = calculateProtein({
    weightKg: Math.max(1, (normalizeNumericInput(weight) ?? 1)),
    activityLevel: activity,
    goal,
    mealsPerDay: Math.max(1, parseInt(meals) || 1),
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
          <Input label={c.weight} type="number" min={1} inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} />
          <Select label={c.activity} value={activity} onChange={(e) => setActivity(e.target.value as ActivityLevel)}>
            {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((a) => (
              <option key={a} value={a}>
                {ACTIVITY_LABELS[a][locale]}
              </option>
            ))}
          </Select>
          <Select label={c.goal} value={goal} onChange={(e) => setGoal(e.target.value as ProteinGoal)}>
            {(Object.keys(GOAL_LABELS) as ProteinGoal[]).map((g) => (
              <option key={g} value={g}>
                {GOAL_LABELS[g][locale]}
              </option>
            ))}
          </Select>
          <Input label={c.meals} type="number" min={1} inputMode="numeric" value={meals} onChange={(e) => setMeals(e.target.value)} />
        </>
      }
      result={
        <>
          <ResultCard label={c.perDay} value={`${formatNumber(result.gramsPerDayLow, locale)}–${formatNumber(result.gramsPerDayHigh, locale)} g`} />
          <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-faint">{c.perMeal}</span>
              <span className="tabular-nums text-text">
                {formatNumber(result.gramsPerMealLow, locale)}–{formatNumber(result.gramsPerMealHigh, locale)} g
              </span>
            </div>
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
