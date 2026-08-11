"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import Input from "@/components/ui/Input";
import ResultCard from "@/components/ui/ResultCard";
import { calculateInstallment } from "@/lib/calculators/installment";
import { formatCurrency } from "@/lib/format";
import { FLAGSHIP_CALCULATORS } from "@/lib/calculatorRegistry";
import type { Locale } from "@/i18n";

const meta = FLAGSHIP_CALCULATORS.find((c) => c.slug === "installment-calculator")!;

const COPY = {
  ar: {
    intro: "قسّط سعر أي منتج أو خدمة على دفعات شهرية ثابتة.",
    price: "سعر المنتج",
    down: "الدفعة المقدمة",
    rate: "نسبة الفائدة السنوية %",
    term: "المدة (أشهر)",
    fees: "رسوم إضافية",
    monthly: "القسط الشهري",
    total: "إجمالي التكلفة",
    interest: "إجمالي الفوائد",
    home: "الرئيسية",
    category: "المال",
    howItWorks: [
      "نطرح الدفعة المقدمة من السعر ونضيف أي رسوم لنحصل على مبلغ التمويل.",
      "نوزع مبلغ التمويل على عدد الأشهر المحدد بمعدل فائدة ثابت لكل قسط.",
    ],
    disclaimer: "هذه الحاسبة تقديرية وليست عرض تمويل رسمي — تحقق من الشروط الفعلية لدى الجهة الممولة.",
    faq: [{ question: "هل تشمل رسوم التأخير؟", answer: "لا، تُحسب فقط الرسوم التي تدخلها يدويًا." }],
  },
  en: {
    intro: "Split any product or service price into fixed monthly installments.",
    price: "Product price",
    down: "Down payment",
    rate: "Annual interest rate %",
    term: "Term (months)",
    fees: "Additional fees",
    monthly: "Monthly installment",
    total: "Total cost",
    interest: "Total interest",
    home: "Home",
    category: "Money",
    howItWorks: [
      "We subtract the down payment from the price and add fees to get the financed amount.",
      "We spread the financed amount over the chosen term at a fixed rate per installment.",
    ],
    disclaimer: "This calculator is an estimate, not an official financing offer — verify actual terms with the financier.",
    faq: [{ question: "Does this include late fees?", answer: "No, only the fees you manually enter are included." }],
  },
};

export default function InstallmentCalculatorClient({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const router = useRouter();
  const searchParams = useSearchParams();

  const [price, setPrice] = useState(searchParams.get("price") ?? "3000");
  const [down, setDown] = useState(searchParams.get("down") ?? "500");
  const [rate, setRate] = useState(searchParams.get("rate") ?? "0");
  const [term, setTerm] = useState(searchParams.get("term") ?? "12");
  const [fees, setFees] = useState(searchParams.get("fees") ?? "0");

  function syncUrl(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([k, v]) => params.set(k, v));
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  const priceNum = Math.max(0, parseFloat(price) || 0);
  const downNum = Math.min(priceNum, Math.max(0, parseFloat(down) || 0));

  const result = calculateInstallment({
    price: priceNum,
    downPayment: downNum,
    annualRatePercent: Math.max(0, parseFloat(rate) || 0),
    termMonths: Math.max(1, parseInt(term) || 1),
    fees: Math.max(0, parseFloat(fees) || 0),
  });

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${locale}/installment-calculator?price=${price}&down=${down}&rate=${rate}&term=${term}&fees=${fees}`
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
          <Input label={c.price} type="number" min={0} inputMode="decimal" value={price} onChange={(e) => { setPrice(e.target.value); syncUrl({ price: e.target.value }); }} />
          <Input label={c.down} type="number" min={0} inputMode="decimal" value={down} onChange={(e) => { setDown(e.target.value); syncUrl({ down: e.target.value }); }} />
          <Input label={c.rate} type="number" min={0} inputMode="decimal" value={rate} onChange={(e) => { setRate(e.target.value); syncUrl({ rate: e.target.value }); }} />
          <Input label={c.term} type="number" min={1} inputMode="numeric" value={term} onChange={(e) => { setTerm(e.target.value); syncUrl({ term: e.target.value }); }} />
          <Input label={c.fees} type="number" min={0} inputMode="decimal" value={fees} onChange={(e) => { setFees(e.target.value); syncUrl({ fees: e.target.value }); }} />
        </>
      }
      result={
        <>
          <ResultCard label={c.monthly} value={formatCurrency(result.monthlyInstallment, locale)} />
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.total}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">{formatCurrency(result.totalCost, locale)}</dd>
            </div>
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.interest}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">{formatCurrency(result.totalInterest, locale)}</dd>
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
