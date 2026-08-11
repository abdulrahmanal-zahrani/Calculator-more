"use client";
import { normalizeNumericInput } from "@/lib/numeric";

import { useState } from "react";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import ResultCard from "@/components/ui/ResultCard";
import Tabs from "@/components/ui/Tabs";
import { calculateCalories, type Sex, type ActivityLevel, type Goal } from "@/lib/calculators/calories";
import { formatNumber } from "@/lib/format";
import { FLAGSHIP_CALCULATORS } from "@/lib/calculatorRegistry";
import type { Locale } from "@/i18n";

const meta = FLAGSHIP_CALCULATORS.find((c) => c.slug === "calorie-calculator")!;

const ACTIVITY_LABELS: Record<ActivityLevel, { ar: string; en: string }> = {
  sedentary: { ar: "قليل الحركة", en: "Sedentary" },
  light: { ar: "نشاط خفيف", en: "Light activity" },
  moderate: { ar: "نشاط متوسط", en: "Moderate activity" },
  active: { ar: "نشيط", en: "Active" },
  veryActive: { ar: "نشيط جداً", en: "Very active" },
};

const COPY = {
  ar: {
    intro: "احسب معدل الأيض الأساسي (BMR) واحتياجك اليومي من السعرات (TDEE) بناءً على معادلة Mifflin-St Jeor.",
    sex: "الجنس",
    male: "ذكر",
    female: "أنثى",
    age: "العمر (سنة)",
    height: "الطول (سم)",
    weight: "الوزن (كجم)",
    activity: "مستوى النشاط",
    goal: "الهدف",
    lose: "خسارة وزن",
    maintain: "الحفاظ على الوزن",
    gain: "زيادة وزن",
    target: "السعرات المستهدفة يومياً",
    bmr: "معدل الأيض الأساسي (BMR)",
    tdee: "إجمالي الطاقة اليومية (TDEE)",
    range: "المدى المقترح",
    home: "الرئيسية",
    category: "نمط الحياة",
    howItWorks: [
      "نحسب BMR بمعادلة Mifflin-St Jeor باستخدام الوزن والطول والعمر والجنس.",
      "نضرب BMR في معامل النشاط للحصول على TDEE (إجمالي الطاقة اليومية).",
      "حسب هدفك، نطرح أو نضيف 500 سعرة تقريباً لخسارة أو زيادة الوزن بمعدل صحي.",
    ],
    disclaimer: "هذه الحاسبة تقدّم تقديراً عاماً فقط وليست استشارة طبية أو غذائية. استشر أخصائي تغذية أو طبيب قبل اتخاذ قرارات غذائية مهمة.",
    faq: [{ question: "هل هذه الأرقام دقيقة لكل شخص؟", answer: "لا، هي تقديرات عامة — الاحتياج الفعلي يختلف حسب عوامل صحية فردية." }],
  },
  en: {
    intro: "Estimate your Basal Metabolic Rate (BMR) and daily calorie needs (TDEE) using the Mifflin-St Jeor equation.",
    sex: "Sex",
    male: "Male",
    female: "Female",
    age: "Age (years)",
    height: "Height (cm)",
    weight: "Weight (kg)",
    activity: "Activity level",
    goal: "Goal",
    lose: "Lose weight",
    maintain: "Maintain weight",
    gain: "Gain weight",
    target: "Target daily calories",
    bmr: "Basal Metabolic Rate (BMR)",
    tdee: "Total Daily Energy (TDEE)",
    range: "Suggested range",
    home: "Home",
    category: "Lifestyle",
    howItWorks: [
      "We compute BMR using the Mifflin-St Jeor equation from weight, height, age, and sex.",
      "We multiply BMR by an activity factor to get TDEE (Total Daily Energy Expenditure).",
      "Based on your goal, we subtract or add roughly 500 calories for a healthy rate of weight change.",
    ],
    disclaimer: "This calculator provides a general estimate only and is not medical or dietary advice. Consult a registered dietitian or physician before making significant dietary changes.",
    faq: [{ question: "Are these numbers accurate for everyone?", answer: "No — they're general estimates. Actual needs vary by individual health factors." }],
  },
};

export default function CalorieCalculatorClient({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState("30");
  const [height, setHeight] = useState("175");
  const [weight, setWeight] = useState("75");
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [goal, setGoal] = useState<Goal>("maintain");

  const result = calculateCalories({
    sex,
    age: Math.max(1, (normalizeNumericInput(age) ?? 1)),
    heightCm: Math.max(1, (normalizeNumericInput(height) ?? 1)),
    weightKg: Math.max(1, (normalizeNumericInput(weight) ?? 1)),
    activityLevel: activity,
    goal,
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
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-text-muted">{c.sex}</span>
            <Tabs options={[{ value: "male", label: c.male }, { value: "female", label: c.female }]} value={sex} onChange={setSex} />
          </div>
          <Input label={c.age} type="number" min={1} inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} />
          <Input label={c.height} type="number" min={1} inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} />
          <Input label={c.weight} type="number" min={1} inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} />
          <Select label={c.activity} value={activity} onChange={(e) => setActivity(e.target.value as ActivityLevel)}>
            {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((a) => (
              <option key={a} value={a}>
                {ACTIVITY_LABELS[a][locale]}
              </option>
            ))}
          </Select>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-text-muted">{c.goal}</span>
            <Tabs options={[{ value: "lose", label: c.lose }, { value: "maintain", label: c.maintain }, { value: "gain", label: c.gain }]} value={goal} onChange={setGoal} />
          </div>
        </>
      }
      result={
        <>
          <ResultCard label={c.target} value={`${formatNumber(result.targetCalories, locale)} kcal`} />
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.bmr}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">{formatNumber(result.bmr, locale)} kcal</dd>
            </div>
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.tdee}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">{formatNumber(result.tdee, locale)} kcal</dd>
            </div>
          </dl>
          <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-faint">{c.range}</span>
              <span className="tabular-nums text-text">
                {formatNumber(result.rangeLow, locale)}–{formatNumber(result.rangeHigh, locale)} kcal
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
