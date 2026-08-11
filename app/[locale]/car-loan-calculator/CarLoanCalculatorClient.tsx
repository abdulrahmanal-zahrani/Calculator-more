"use client";
import { normalizeNumericInput } from "@/lib/numeric";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import Input from "@/components/ui/Input";
import ResultCard from "@/components/ui/ResultCard";
import { calculateCarLoan } from "@/lib/calculators/carLoan";
import { formatCurrency } from "@/lib/format";
import { FLAGSHIP_CALCULATORS } from "@/lib/calculatorRegistry";
import type { Locale } from "@/i18n";

const meta = FLAGSHIP_CALCULATORS.find((c) => c.slug === "car-loan-calculator")!;

const COPY = {
  ar: {
    intro: "احسب القسط الشهري وإجمالي التكلفة لتمويل سيارة جديدة أو مستعملة.",
    price: "سعر السيارة",
    down: "الدفعة المقدمة",
    rate: "نسبة الفائدة السنوية %",
    term: "المدة (أشهر)",
    fees: "رسوم إدارية",
    monthly: "القسط الشهري",
    total: "إجمالي التكلفة",
    interest: "إجمالي الفوائد",
    schedule: "جدول السداد",
    month: "الشهر",
    payment: "القسط",
    principal: "أصل الدين",
    interestCol: "الفائدة",
    balance: "الرصيد المتبقي",
    home: "الرئيسية",
    category: "السيارات",
    howItWorks: [
      "نطرح الدفعة المقدمة من سعر السيارة ونضيف الرسوم الإدارية للحصول على مبلغ التمويل.",
      "نستخدم معادلة القسط الثابت لحساب القسط الشهري على مدار مدة التمويل.",
    ],
    disclaimer: "تقدير عام فقط — القسط الفعلي يعتمد على تقييم جهة التمويل وشروطها.",
    faq: [{ question: "هل يشمل التأمين؟", answer: "لا، يمكنك حساب تكلفة التأمين بشكل منفصل عبر حاسبة مقارنة التأمين." }],
  },
  en: {
    intro: "Calculate the monthly payment and total cost of financing a new or used car.",
    price: "Vehicle price",
    down: "Down payment",
    rate: "Annual interest rate %",
    term: "Term (months)",
    fees: "Admin fees",
    monthly: "Monthly payment",
    total: "Total cost",
    interest: "Total interest",
    schedule: "Amortization schedule",
    month: "Month",
    payment: "Payment",
    principal: "Principal",
    interestCol: "Interest",
    balance: "Balance",
    home: "Home",
    category: "Cars",
    howItWorks: [
      "We subtract the down payment from the vehicle price and add admin fees to get the financed amount.",
      "We use the standard amortization formula for a fixed monthly payment over the term.",
    ],
    disclaimer: "General estimate only — the actual payment depends on the financier's evaluation and terms.",
    faq: [{ question: "Does this include insurance?", answer: "No — use the Insurance Comparison calculator separately for that cost." }],
  },
};

export default function CarLoanCalculatorClient({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const router = useRouter();
  const searchParams = useSearchParams();

  const [price, setPrice] = useState(searchParams.get("price") ?? "90000");
  const [down, setDown] = useState(searchParams.get("down") ?? "10000");
  const [rate, setRate] = useState(searchParams.get("rate") ?? "3.5");
  const [term, setTerm] = useState(searchParams.get("term") ?? "60");
  const [fees, setFees] = useState(searchParams.get("fees") ?? "500");

  function syncUrl(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([k, v]) => params.set(k, v));
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  const priceNum = Math.max(0, (normalizeNumericInput(price) ?? 0));
  const downNum = Math.min(priceNum, Math.max(0, (normalizeNumericInput(down) ?? 0)));

  const result = calculateCarLoan({
    vehiclePrice: priceNum,
    downPayment: downNum,
    annualRatePercent: Math.max(0, (normalizeNumericInput(rate) ?? 0)),
    termMonths: Math.max(1, parseInt(term) || 1),
    fees: Math.max(0, (normalizeNumericInput(fees) ?? 0)),
  });

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${locale}/car-loan-calculator?price=${price}&down=${down}&rate=${rate}&term=${term}&fees=${fees}`
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
          <ResultCard label={c.monthly} value={formatCurrency(result.monthlyPayment, locale)} />
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
        <>
          <ol className="list-decimal space-y-2 ps-5">
            {c.howItWorks.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
          <div className="mt-6 overflow-x-auto rounded-[var(--radius-md)] border border-border">
            <table className="w-full min-w-[480px] text-start text-sm">
              <thead className="bg-bg-subtle text-text-muted">
                <tr>
                  <th className="px-3 py-2 text-start">{c.month}</th>
                  <th className="px-3 py-2 text-start">{c.payment}</th>
                  <th className="px-3 py-2 text-start">{c.principal}</th>
                  <th className="px-3 py-2 text-start">{c.interestCol}</th>
                  <th className="px-3 py-2 text-start">{c.balance}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border tabular-nums">
                {result.amortization.slice(0, 12).map((row) => (
                  <tr key={row.month}>
                    <td className="px-3 py-2">{row.month}</td>
                    <td className="px-3 py-2">{formatCurrency(row.payment, locale)}</td>
                    <td className="px-3 py-2">{formatCurrency(row.principal, locale)}</td>
                    <td className="px-3 py-2">{formatCurrency(row.interest, locale)}</td>
                    <td className="px-3 py-2">{formatCurrency(row.balance, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      }
      faq={c.faq}
      disclaimer={c.disclaimer}
    />
  );
}
