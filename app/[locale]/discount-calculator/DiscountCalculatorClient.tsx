"use client";
import { normalizeNumericInput } from "@/lib/numeric";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ResultCard from "@/components/ui/ResultCard";
import { calculateDiscount } from "@/lib/calculators/discount";
import { formatCurrency, formatPercent } from "@/lib/format";
import { FLAGSHIP_CALCULATORS } from "@/lib/calculatorRegistry";
import type { Locale } from "@/i18n";

const meta = FLAGSHIP_CALCULATORS.find((c) => c.slug === "discount-calculator")!;

const COPY = {
  ar: {
    intro: "احسب السعر النهائي والتوفير — مع دعم تطبيق أكثر من خصم فوق بعض.",
    original: "السعر الأصلي",
    discount: "نسبة الخصم %",
    addDiscount: "إضافة خصم آخر",
    remove: "إزالة",
    final: "السعر النهائي",
    savings: "إجمالي التوفير",
    effective: "نسبة الخصم الفعلية",
    step: "خصم",
    before: "قبل",
    after: "بعد",
    home: "الرئيسية",
    category: "المال",
    howItWorks: [
      "نطبق كل نسبة خصم على السعر الناتج من الخطوة السابقة، وليس على السعر الأصلي.",
      "هذا يعني أن خصمين متتاليين 10% لا يساويان خصم 20% دفعة واحدة.",
      "التوفير الإجمالي هو الفرق بين السعر الأصلي والسعر النهائي بعد كل الخصومات.",
    ],
    disclaimer: "النتائج تقريبية وتُقرّب لأقرب هللتين — تحقق من السعر الفعلي عند الدفع.",
    faq: [
      { question: "هل الخصومات المتراكمة تُحسب على نفس السعر الأصلي؟", answer: "لا، كل خصم يُطبّق على السعر بعد الخصم السابق." },
    ],
  },
  en: {
    intro: "Work out the final price and savings — with support for stacked discounts.",
    original: "Original price",
    discount: "Discount %",
    addDiscount: "Add another discount",
    remove: "Remove",
    final: "Final price",
    savings: "Total savings",
    effective: "Effective discount",
    step: "Discount",
    before: "Before",
    after: "After",
    home: "Home",
    category: "Money",
    howItWorks: [
      "Each discount percentage is applied to the price resulting from the previous step, not the original price.",
      "This means two consecutive 10% discounts are not the same as one 20% discount.",
      "Total savings is the difference between the original price and the final price after all discounts.",
    ],
    disclaimer: "Results are approximate and rounded to the nearest cent — verify the actual price at checkout.",
    faq: [
      { question: "Are stacked discounts calculated on the same original price?", answer: "No — each discount applies to the price after the previous discount." },
    ],
  },
};

export default function DiscountCalculatorClient({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const router = useRouter();
  const searchParams = useSearchParams();

  const [original, setOriginal] = useState(searchParams.get("original") ?? "500");
  const initialDiscounts = searchParams.get("discounts");
  const [discounts, setDiscounts] = useState<string[]>(
    initialDiscounts ? initialDiscounts.split(",") : ["20"]
  );

  function syncUrl(nextOriginal: string, nextDiscounts: string[]) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("original", nextOriginal);
    params.set("discounts", nextDiscounts.join(","));
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  const originalNum = Math.max(0, (normalizeNumericInput(original) ?? 0));
  const discountNums = discounts.map((d) => Math.min(100, Math.max(0, (normalizeNumericInput(d) ?? 0))));

  const result = calculateDiscount({ originalPrice: originalNum, discountPercents: discountNums });

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${locale}/discount-calculator?original=${originalNum}&discounts=${discounts.join(",")}`
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
          <Input
            label={c.original}
            type="number"
            min={0}
            inputMode="decimal"
            value={original}
            onChange={(e) => {
              setOriginal(e.target.value);
              syncUrl(e.target.value, discounts);
            }}
          />
          {discounts.map((d, i) => (
            <div key={i} className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  label={`${c.discount} ${discounts.length > 1 ? i + 1 : ""}`}
                  type="number"
                  min={0}
                  max={100}
                  inputMode="decimal"
                  value={d}
                  onChange={(e) => {
                    const next = [...discounts];
                    next[i] = e.target.value;
                    setDiscounts(next);
                    syncUrl(original, next);
                  }}
                />
              </div>
              {discounts.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const next = discounts.filter((_, idx) => idx !== i);
                    setDiscounts(next);
                    syncUrl(original, next);
                  }}
                >
                  {c.remove}
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const next = [...discounts, "10"];
              setDiscounts(next);
              syncUrl(original, next);
            }}
          >
            + {c.addDiscount}
          </Button>
        </>
      }
      result={
        <>
          <ResultCard label={c.final} value={formatCurrency(result.finalPrice, locale)} />
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.savings}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">{formatCurrency(result.totalSavings, locale)}</dd>
            </div>
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.effective}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">{formatPercent(result.effectiveDiscountPercent, locale)}</dd>
            </div>
          </dl>
          {result.breakdown.length > 1 && (
            <div className="space-y-1 text-sm">
              {result.breakdown.map((step, i) => (
                <div key={i} className="flex justify-between rounded-[var(--radius-sm)] bg-bg-subtle px-3 py-2">
                  <span className="text-text-muted">
                    {c.step} {i + 1} ({step.percent}%)
                  </span>
                  <span className="tabular-nums text-text">
                    {formatCurrency(step.priceBefore, locale)} → {formatCurrency(step.priceAfter, locale)}
                  </span>
                </div>
              ))}
            </div>
          )}
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
