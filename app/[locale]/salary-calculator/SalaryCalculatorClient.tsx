"use client";
import { normalizeNumericInput } from "@/lib/numeric";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import ResultCard from "@/components/ui/ResultCard";
import { calculateSalary, type GosiSystemId } from "@/lib/calculators/salary";
import { GOSI_SOURCE_NOTE } from "@/lib/config/gosiRules";
import { formatCurrency } from "@/lib/format";
import { FLAGSHIP_CALCULATORS } from "@/lib/calculatorRegistry";
import type { Locale } from "@/i18n";

const meta = FLAGSHIP_CALCULATORS.find((c) => c.slug === "salary-calculator")!;

const COPY = {
  ar: {
    intro: "احسب راتبك الصافي الشهري والسنوي من الأساسي والبدلات والاستقطاعات، بما في ذلك التأمينات الاجتماعية (GOSI).",
    basic: "الراتب الأساسي",
    housing: "بدل السكن",
    transport: "بدل النقل",
    other: "بدلات أخرى",
    deductions: "استقطاعات أخرى (قروض وغيرها)",
    net: "صافي الراتب الشهري",
    gross: "إجمالي الراتب",
    annual: "الصافي السنوي",
    home: "الرئيسية",
    category: "المال",
    advanced: "إعدادات متقدمة",
    gosiSystem: "نظام التأمينات",
    gosiNew: "الجديد",
    gosiLegacy: "السابق",
    includeGosi: "احتساب التأمينات الاجتماعية",
    employeeGosi: "استقطاع التأمينات (الموظف)",
    employerGosi: "مساهمة صاحب العمل (معلومة فقط)",
    gosiNote: GOSI_SOURCE_NOTE.ar,
    howItWorks: [
      "نجمع الراتب الأساسي مع جميع البدلات للحصول على إجمالي الراتب.",
      "نحتسب استقطاع التأمينات الاجتماعية (GOSI) على الأساسي وبدل السكن وفق النظام المختار، ونطرحه مع الاستقطاعات الأخرى من الإجمالي.",
      "نضرب الصافي الشهري في 12 للحصول على الصافي السنوي.",
    ],
    disclaimer: "هذه الحاسبة لأغراض التقدير العام فقط وليست استشارة رسمية للرواتب أو استحقاقات نظام العمل. نِسب التأمينات الاجتماعية أرقام مرجعية تقريبية — تحقق من النسبة الحالية من موقع التأمينات الاجتماعية (GOSI) قبل الاعتماد عليها.",
    faq: [
      {
        question: "هل تحتسب الحاسبة التأمينات الاجتماعية (GOSI) تلقائياً؟",
        answer: "نعم، يمكنك اختيار النظام الجديد أو السابق من «إعدادات متقدمة». النسب المستخدمة مرجعية تقريبية، فتحقق من النسبة الحالية من موقع التأمينات الاجتماعية (GOSI).",
      },
      {
        question: "ما الفرق بين النظام الجديد والسابق؟",
        answer: "النظام السابق كان بنسبة تأمينات أقل تقريباً (9% تقريباً من الموظف). النظام الجديد الذي بدأ تطبيقه تدريجياً من 2022 حتى اكتماله في 2024/2025 رفع نسبة فرع المعاشات.",
      },
    ],
  },
  en: {
    intro: "Calculate your net monthly and annual salary from basic pay, allowances, and deductions, including GOSI social insurance.",
    basic: "Basic salary",
    housing: "Housing allowance",
    transport: "Transport allowance",
    other: "Other allowances",
    deductions: "Other deductions (loans, etc.)",
    net: "Net monthly salary",
    gross: "Gross salary",
    annual: "Net annual",
    home: "Home",
    category: "Money",
    advanced: "Advanced settings",
    gosiSystem: "GOSI system",
    gosiNew: "New",
    gosiLegacy: "Previous",
    includeGosi: "Include GOSI contribution",
    employeeGosi: "GOSI contribution (employee)",
    employerGosi: "Employer contribution (informational)",
    gosiNote: GOSI_SOURCE_NOTE.en,
    howItWorks: [
      "We add basic salary plus all allowances to get the gross salary.",
      "We calculate the GOSI contribution on basic + housing under the selected system, and subtract it plus other deductions from gross.",
      "We multiply net monthly by 12 to get the net annual salary.",
    ],
    disclaimer: "This calculator is for general estimation only and is not official payroll or labor-law advice. GOSI rates are approximate reference figures — verify the current rate on GOSI's website before relying on them.",
    faq: [
      {
        question: "Does this calculator auto-calculate GOSI social insurance?",
        answer: "Yes, choose the new or previous system under \"Advanced settings\". The rates used are approximate reference figures, so verify the current rate on GOSI's website.",
      },
      {
        question: "What's the difference between the new and previous system?",
        answer: "The previous system had a lower annuities rate (roughly 9% employee). The new system, phased in gradually from 2022 through completion in 2024/2025, raised the annuities-branch rate.",
      },
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
  const [system, setSystem] = useState<GosiSystemId>(
    (searchParams.get("system") as GosiSystemId) ?? "new"
  );
  const [includeGosi, setIncludeGosi] = useState(searchParams.get("gosi") !== "0");

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
    system,
    includeGosi,
  });

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${locale}/salary-calculator?basic=${basic}&housing=${housing}&transport=${transport}&other=${other}&deductions=${deductions}&system=${system}&gosi=${includeGosi ? "1" : "0"}`
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
      calculatorForm={
        <>
          {fields.map(([label, value, setter], i) => (
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

          <details className="rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-4">
            <summary className="cursor-pointer text-sm font-semibold text-text">{c.advanced}</summary>
            <div className="mt-3 space-y-3">
              <label className="flex items-center gap-2 text-sm text-text-muted">
                <input
                  type="checkbox"
                  checked={includeGosi}
                  onChange={(e) => {
                    setIncludeGosi(e.target.checked);
                    syncUrl({ gosi: e.target.checked ? "1" : "0" });
                  }}
                />
                {c.includeGosi}
              </label>
              {includeGosi && (
                <>
                  <Select
                    label={c.gosiSystem}
                    value={system}
                    onChange={(e) => {
                      const s = e.target.value as GosiSystemId;
                      setSystem(s);
                      syncUrl({ system: s });
                    }}
                  >
                    <option value="new">{c.gosiNew}</option>
                    <option value="legacy">{c.gosiLegacy}</option>
                  </Select>
                  <p className="text-xs text-text-faint">{c.gosiNote}</p>
                </>
              )}
            </div>
          </details>
        </>
      }
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
            {includeGosi && (
              <>
                <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
                  <dt className="text-text-faint">{c.employeeGosi}</dt>
                  <dd className="mt-1 font-semibold tabular-nums text-text">{formatCurrency(result.employeeGosiContribution, locale)}</dd>
                </div>
                <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
                  <dt className="text-text-faint">{c.employerGosi}</dt>
                  <dd className="mt-1 font-semibold tabular-nums text-text">{formatCurrency(result.employerGosiContribution, locale)}</dd>
                </div>
              </>
            )}
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
