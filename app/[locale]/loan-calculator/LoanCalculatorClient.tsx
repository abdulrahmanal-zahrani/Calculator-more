"use client";
import { normalizeNumericInput } from "@/lib/numeric";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import Input from "@/components/ui/Input";
import ResultCard from "@/components/ui/ResultCard";
import Alert from "@/components/ui/Alert";
import { calculateLoanPayment } from "@/lib/calculators/loan";
import { formatCurrency } from "@/lib/format";
import { FLAGSHIP_CALCULATORS } from "@/lib/calculatorRegistry";
import type { Locale } from "@/i18n";

const meta = FLAGSHIP_CALCULATORS.find((c) => c.slug === "loan-calculator")!;

const COPY = {
  ar: {
    intro: "احسب القسط الشهري وإجمالي الفوائد وجدول السداد الكامل لأي تمويل.",
    amount: "مبلغ التمويل",
    rate: "نسبة الفائدة السنوية %",
    term: "المدة (أشهر)",
    fees: "رسوم إضافية",
    down: "الدفعة المقدمة",
    monthly: "القسط الشهري",
    total: "إجمالي السداد",
    interest: "إجمالي الفوائد",
    schedule: "جدول السداد",
    month: "الشهر",
    payment: "القسط",
    principal: "أصل الدين",
    interestCol: "الفائدة",
    balance: "الرصيد المتبقي",
    islamicNote: "ملاحظة تمييز: هذه الحاسبة تستخدم نموذج الفائدة التقليدي (Amortization). في التمويل الإسلامي (مثل المرابحة والإجارة) يختلف الهيكل عن الفائدة المركبة، ولا تمثل هذه الحاسبة صيغة شرعية معينة — استشر جهة التمويل للتفاصيل الدقيقة.",
    home: "الرئيسية",
    category: "المال",
    howItWorks: [
      "نحسب مبلغ التمويل الفعلي بعد خصم الدفعة المقدمة وإضافة الرسوم.",
      "نستخدم معادلة القسط الثابت لحساب القسط الشهري بناءً على النسبة والمدة.",
      "نبني جدول سداد شهري يوضح كيف يتوزع كل قسط بين أصل الدين والفائدة.",
    ],
    disclaimer: "هذه الحاسبة لأغراض تقديرية فقط وليست عرض تمويل رسمي من أي جهة.",
    faq: [
      { question: "هل تشمل الحاسبة رسوم التأمين؟", answer: "لا، أضف أي رسوم إضافية يدوياً في حقل الرسوم." },
    ],
  },
  en: {
    intro: "Calculate the monthly payment, total interest, and a full amortization schedule for any loan.",
    amount: "Loan amount",
    rate: "Annual interest rate %",
    term: "Term (months)",
    fees: "Additional fees",
    down: "Down payment",
    monthly: "Monthly payment",
    total: "Total repayment",
    interest: "Total interest",
    schedule: "Amortization schedule",
    month: "Month",
    payment: "Payment",
    principal: "Principal",
    interestCol: "Interest",
    balance: "Balance",
    islamicNote: "Note: this calculator uses a conventional interest amortization model. Islamic financing structures (e.g. Murabaha, Ijara) work differently from compound interest and are not represented here — consult your financier for exact terms.",
    home: "Home",
    category: "Money",
    howItWorks: [
      "We compute the effective principal after subtracting down payment and adding fees.",
      "We use the standard amortization formula to derive a fixed monthly payment.",
      "We build a month-by-month schedule showing how each payment splits between principal and interest.",
    ],
    disclaimer: "This calculator is for estimation purposes only and is not an official financing offer.",
    faq: [
      { question: "Does this include insurance fees?", answer: "No, add any extra fees manually in the fees field." },
    ],
  },
};

export default function LoanCalculatorClient({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const router = useRouter();
  const searchParams = useSearchParams();

  const [amount, setAmount] = useState(searchParams.get("amount") ?? "50000");
  const [rate, setRate] = useState(searchParams.get("rate") ?? "5");
  const [term, setTerm] = useState(searchParams.get("term") ?? "36");
  const [fees, setFees] = useState(searchParams.get("fees") ?? "0");
  const [down, setDown] = useState(searchParams.get("down") ?? "0");

  function syncUrl(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([k, v]) => params.set(k, v));
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  const amountNum = Math.max(0, (normalizeNumericInput(amount) ?? 0));
  const downNum = Math.min(amountNum, Math.max(0, (normalizeNumericInput(down) ?? 0)));
  const termNum = Math.max(1, parseInt(term) || 1);

  const result = calculateLoanPayment({
    amount: amountNum,
    annualRatePercent: Math.max(0, (normalizeNumericInput(rate) ?? 0)),
    termMonths: termNum,
    fees: Math.max(0, (normalizeNumericInput(fees) ?? 0)),
    downPayment: downNum,
  });

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${locale}/loan-calculator?amount=${amount}&rate=${rate}&term=${term}&fees=${fees}&down=${down}`
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
            label={c.amount}
            type="number"
            min={0}
            inputMode="decimal"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              syncUrl({ amount: e.target.value });
            }}
          />
          <Input
            label={c.rate}
            type="number"
            min={0}
            inputMode="decimal"
            value={rate}
            onChange={(e) => {
              setRate(e.target.value);
              syncUrl({ rate: e.target.value });
            }}
          />
          <Input
            label={c.term}
            type="number"
            min={1}
            inputMode="numeric"
            value={term}
            onChange={(e) => {
              setTerm(e.target.value);
              syncUrl({ term: e.target.value });
            }}
          />
          <Input
            label={c.down}
            type="number"
            min={0}
            inputMode="decimal"
            value={down}
            onChange={(e) => {
              setDown(e.target.value);
              syncUrl({ down: e.target.value });
            }}
          />
          <Input
            label={c.fees}
            type="number"
            min={0}
            inputMode="decimal"
            value={fees}
            onChange={(e) => {
              setFees(e.target.value);
              syncUrl({ fees: e.target.value });
            }}
          />
        </>
      }
      result={
        <>
          <ResultCard label={c.monthly} value={formatCurrency(result.monthlyPayment, locale)} />
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.total}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">{formatCurrency(result.totalRepayment, locale)}</dd>
            </div>
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.interest}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">{formatCurrency(result.totalInterest, locale)}</dd>
            </div>
          </dl>
          <Alert title={locale === "ar" ? "ملاحظة" : "Note"} tone="info">
            {c.islamicNote}
          </Alert>
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
            {result.amortization.length > 12 && (
              <p className="border-t border-border px-3 py-2 text-xs text-text-faint">
                {locale === "ar"
                  ? `عرض أول 12 شهراً من أصل ${result.amortization.length}.`
                  : `Showing first 12 of ${result.amortization.length} months.`}
              </p>
            )}
          </div>
        </>
      }
      faq={c.faq}
      disclaimer={c.disclaimer}
    />
  );
}
