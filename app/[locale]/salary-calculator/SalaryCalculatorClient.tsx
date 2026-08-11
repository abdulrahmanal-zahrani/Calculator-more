"use client";
import { normalizeNumericInput } from "@/lib/numeric";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import Input from "@/components/ui/Input";
import ResultCard from "@/components/ui/ResultCard";
import { calculateSalary } from "@/lib/calculators/salary";
import { formatCurrency } from "@/lib/format";
import { FLAGSHIP_CALCULATORS } from "@/lib/calculatorRegistry";
import type { Locale } from "@/i18n";

const meta = FLAGSHIP_CALCULATORS.find((c) => c.slug === "salary-calculator")!;

const COPY = {
  ar: {
    intro: "احسب راتبك الصافي الشهري والسنوي من الأساسي والبدلات والاستقطاعات.",
    basic: "الراتب الأساسي",
    housing: "بدل السكن",
    transport: "بدل النقل",
    other: "بدلات أخرى",
    deductions: "الاستقطاعات (قروض وغيرها)",
    net: "صافي الراتب الشهري",
    gross: "إجمالي الراتب",
    annual: "الصافي السنوي",
    home: "الرئيسية",
    category: "المال",
    howItWorks: [
      "نجمع الراتب الأساسي مع جميع البدلات للحصول على إجمالي الراتب.",
      "نطرح الاستقطاعات من الإجمالي للحصول على صافي الراتب الشهري.",
      "نضرب الصافي الشهري في 12 للحصول على الصافي السنوي.",
    ],
    disclaimer: "هذه الحاسبة لأغراض التقدير العام فقط وليست استشارة رسمية للرواتب أو استحقاقات نظام العمل.",
    faq: [
      { question: "هل تشمل الحاسبة التأمينات الاجتماعية (GOSA)؟", answer: "لا، هذه النسخة لا تحتسب استقطاعات التأمينات تلقائيًا — أضفها ضمن حقل الاستقطاعات." },
    ],
  },
  en: {
    intro: "Calculate your net monthly and annual salary from basic pay, allowances, and deductions.",
    basic: "Basic salary",
    housing: "Housing allowance",
    transport: "Transport allowance",
    other: "Other allowances",
    deductions: "Deductions (loans, etc.)",
    net: "Net monthly salary",
    gross: "Gross salary",
    annual: "Net annual",
    home: "Home",
    category: "Money",
    howItWorks: [
      "We add basic salary plus all allowances to get the gross salary.",
      "We subtract deductions from gross to get net monthly salary.",
      "We multiply net monthly by 12 to get the net annual salary.",
    ],
    disclaimer: "This calculator is for general estimation only and is not official payroll or labor-law advice.",
    faq: [
      { question: "Does this include GOSI social insurance?", answer: "No, this version doesn't auto-calculate GOSI — add it manually under deductions." },
    ],
  },
};

export default function SalaryCalculatorClient({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const router = useRouter();
  const searchParams = useSearchParams();

  const [basic, setBasic] = useState(searchParams.get("basic") ?? "5000");
  const [housing, setHousing] = useState(searchParams.get("housing") ?? "1000");
  const [transport, setTransport] = useState(searchParams.get("transport") ?? "500");
  const [other, setOther] = useState(searchParams.get("other") ?? "0");
  const [deductions, setDeductions] = useState(searchParams.get("deductions") ?? "0");

  function syncUrl(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([k, v]) => params.set(k, v));
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  const num = (v: string) => Math.max(0, (normalizeNumericInput(v) ?? 0));
  const result = calculateSalary({
    basic: num(basic),
    housingAllowance: num(housing),
    transportAllowance: num(transport),
    otherAllowances: num(other),
    deductions: num(deductions),
  });

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${locale}/salary-calculator?basic=${basic}&housing=${housing}&transport=${transport}&other=${other}&deductions=${deductions}`
      : "";

  const fields: [string, string, (v: string) => void][] = [
    [c.basic, basic, setBasic],
    [c.housing, housing, setHousing],
    [c.transport, transport, setTransport],
    [c.other, other, setOther],
    [c.deductions, deductions, setDeductions],
  ];
  const keys = ["basic", "housing", "transport", "other", "deductions"];

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
      calculatorForm={fields.map(([label, value, setter], i) => (
        <Input
          key={keys[i]}
          label={label}
          type="number"
          min={0}
          inputMode="decimal"
          value={value}
          onChange={(e) => {
            setter(e.target.value);
            syncUrl({ [keys[i]]: e.target.value });
          }}
        />
      ))}
      result={
        <>
          <ResultCard label={c.net} value={formatCurrency(result.netMonthly, locale)} />
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.gross}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">{formatCurrency(result.grossMonthly, locale)}</dd>
            </div>
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.annual}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">{formatCurrency(result.netAnnual, locale)}</dd>
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
