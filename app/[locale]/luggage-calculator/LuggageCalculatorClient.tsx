"use client";
import { normalizeNumericInput } from "@/lib/numeric";

import { useState } from "react";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ResultCard from "@/components/ui/ResultCard";
import Alert from "@/components/ui/Alert";
import { calculateLuggage, kgToLb, type LuggageBagInput } from "@/lib/calculators/luggage";
import { formatNumber } from "@/lib/format";
import { FLAGSHIP_CALCULATORS } from "@/lib/calculatorRegistry";
import type { Locale } from "@/i18n";

const meta = FLAGSHIP_CALCULATORS.find((c) => c.slug === "luggage-calculator")!;

const COPY = {
  ar: {
    intro: "تحقق من إجمالي وزن حقائبك مقابل الوزن المسموح به قبل التوجه للمطار.",
    allowance: "الوزن المسموح به (كجم)",
    bag: "الحقيبة",
    weight: "الوزن (كجم)",
    addBag: "إضافة حقيبة",
    remove: "إزالة",
    total: "إجمالي الوزن",
    remaining: "المتبقي من الوزن المسموح",
    over: "زيادة عن الوزن المسموح",
    overNote: "وزن حقائبك يتجاوز الحد المسموح — قد تُحمّل رسوم زيادة وزن.",
    okNote: "وزن حقائبك ضمن الحد المسموح.",
    airlineNote: "أوزان الأمتعة المسموح بها تختلف بين شركات الطيران والدرجات — تأكد دائماً من سياسة شركتك قبل السفر.",
    home: "الرئيسية",
    category: "السفر",
    howItWorks: [
      "نجمع وزن كل الحقائب المدخلة.",
      "نقارن الإجمالي بالوزن المسموح به لنوضح المتبقي أو الزيادة.",
    ],
    disclaimer: "هذه الحاسبة عامة ولا تمثل سياسة أي شركة طيران محددة — راجع دائماً حدود الوزن الرسمية لشركتك.",
    faq: [{ question: "هل الأرقام هنا رسمية؟", answer: "لا، هذه أداة عامة — تحقق من الحدود الرسمية لشركة طيرانك." }],
  },
  en: {
    intro: "Check your total luggage weight against your allowance before heading to the airport.",
    allowance: "Weight allowance (kg)",
    bag: "Bag",
    weight: "Weight (kg)",
    addBag: "Add bag",
    remove: "Remove",
    total: "Total weight",
    remaining: "Remaining allowance",
    over: "Over allowance",
    overNote: "Your bags exceed the allowance — you may be charged excess baggage fees.",
    okNote: "Your bags are within the allowance.",
    airlineNote: "Baggage allowances vary between airlines and fare classes — always verify your airline's specific policy before you fly.",
    home: "Home",
    category: "Travel",
    howItWorks: [
      "We sum the weight of every bag you enter.",
      "We compare the total to your allowance to show what's remaining or over.",
    ],
    disclaimer: "This calculator is generic and does not represent any specific airline's policy — always check your airline's official weight limits.",
    faq: [{ question: "Are these official limits?", answer: "No — this is a general tool. Verify the official limits with your airline." }],
  },
};

export default function LuggageCalculatorClient({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const [allowance, setAllowance] = useState("30");
  const [bags, setBags] = useState<LuggageBagInput[]>([
    { name: locale === "ar" ? "حقيبة 1" : "Bag 1", weightKg: 20 },
  ]);

  function update(i: number, patch: Partial<LuggageBagInput>) {
    setBags((prev) => prev.map((b, idx) => (idx === i ? { ...b, ...patch } : b)));
  }

  const result = calculateLuggage({
    allowanceKg: Math.max(0, (normalizeNumericInput(allowance) ?? 0)),
    bags: bags.map((b) => ({ ...b, weightKg: Math.max(0, b.weightKg || 0) })),
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
          <Input label={c.allowance} type="number" min={0} inputMode="decimal" value={allowance} onChange={(e) => setAllowance(e.target.value)} />
          {bags.map((b, i) => (
            <div key={i} className="flex items-end gap-2">
              <div className="flex-1">
                <Input label={c.bag} value={b.name} onChange={(e) => update(i, { name: e.target.value })} />
              </div>
              <div className="flex-1">
                <Input label={c.weight} type="number" min={0} inputMode="decimal" value={b.weightKg} onChange={(e) => update(i, { weightKg: (normalizeNumericInput(e.target.value) ?? 0) })} />
              </div>
              {bags.length > 1 && (
                <Button variant="ghost" size="sm" onClick={() => setBags((prev) => prev.filter((_, idx) => idx !== i))}>
                  {c.remove}
                </Button>
              )}
            </div>
          ))}
          <Button variant="secondary" size="sm" onClick={() => setBags((prev) => [...prev, { name: `${locale === "ar" ? "حقيبة" : "Bag"} ${prev.length + 1}`, weightKg: 0 }])}>
            + {c.addBag}
          </Button>
        </>
      }
      result={
        <>
          <ResultCard label={c.total} value={`${formatNumber(result.totalWeightKg, locale)} kg (${formatNumber(kgToLb(result.totalWeightKg), locale)} lb)`} />
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.remaining}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">{formatNumber(result.remainingAllowanceKg, locale)} kg</dd>
            </div>
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.over}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">{formatNumber(result.overageKg, locale)} kg</dd>
            </div>
          </dl>
          <Alert title={result.isOverAllowance ? c.over : c.total} tone={result.isOverAllowance ? "warning" : "info"}>
            {result.isOverAllowance ? c.overNote : c.okNote} {c.airlineNote}
          </Alert>
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
