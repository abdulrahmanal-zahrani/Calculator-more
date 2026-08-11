"use client";

import { useState } from "react";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { compareInsurancePolicies, type InsurancePolicyInput } from "@/lib/calculators/insuranceComparison";
import { formatCurrency } from "@/lib/format";
import { FLAGSHIP_CALCULATORS } from "@/lib/calculatorRegistry";
import type { Locale } from "@/i18n";

const meta = FLAGSHIP_CALCULATORS.find((c) => c.slug === "insurance-comparison-calculator")!;

const COPY = {
  ar: {
    intro: "أدخل تفاصيل عرضين أو أكثر من عروض تأمين السيارات لمقارنة التكلفة الفعلية السنوية.",
    policyName: "اسم شركة/عرض التأمين",
    premium: "القسط السنوي",
    deductible: "مبلغ التحمل",
    coverage: "مبلغ التغطية",
    fees: "رسوم إضافية",
    addPolicy: "إضافة عرض آخر",
    remove: "إزالة",
    effective: "التكلفة الفعلية السنوية",
    perCoverage: "التكلفة لكل ريال تغطية",
    home: "الرئيسية",
    category: "السيارات",
    howItWorks: [
      "نجمع القسط السنوي والرسوم الإضافية مع جزء من مبلغ التحمل (10%) كتقدير مبسط لكلفة الاحتمال.",
      "هذا يعطيك رقمًا واحدًا للمقارنة السريعة بين العروض، وليس تسعيرًا اكتواريًا دقيقًا.",
    ],
    disclaimer: "هذه مقارنة تقديرية مبسطة لأغراض التوجيه فقط — راجع وثيقة التأمين الفعلية والشروط الكاملة قبل الاتخاذ القرار.",
    faq: [{ question: "هل تشمل الاستثناءات؟", answer: "لا، أدخل فقط الأرقام الأساسية — راجع الاستثناءات في وثيقة كل عرض." }],
  },
  en: {
    intro: "Enter details for two or more car insurance quotes to compare their effective annual cost.",
    policyName: "Insurer / policy name",
    premium: "Annual premium",
    deductible: "Deductible",
    coverage: "Coverage amount",
    fees: "Additional fees",
    addPolicy: "Add another policy",
    remove: "Remove",
    effective: "Effective annual cost",
    perCoverage: "Cost per unit of coverage",
    home: "Home",
    category: "Cars",
    howItWorks: [
      "We sum the annual premium and fees plus a fraction of the deductible (10%) as a simplified likelihood-weighted estimate.",
      "This gives a single number for quick comparison — it is not a precise actuarial calculation.",
    ],
    disclaimer: "This is a simplified, directional comparison only — review the actual policy documents and full terms before deciding.",
    faq: [{ question: "Does this account for exclusions?", answer: "No — only the core numbers are used. Review each policy's exclusions separately." }],
  },
};

const defaultPolicy = (name: string): InsurancePolicyInput => ({
  name,
  annualPremium: 2000,
  deductible: 1000,
  coverageAmount: 100000,
  additionalFees: 0,
});

export default function InsuranceComparisonClient({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const [policies, setPolicies] = useState<InsurancePolicyInput[]>([
    defaultPolicy(locale === "ar" ? "العرض 1" : "Policy 1"),
    defaultPolicy(locale === "ar" ? "العرض 2" : "Policy 2"),
  ]);

  function update(i: number, patch: Partial<InsurancePolicyInput>) {
    setPolicies((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  }

  const results = compareInsurancePolicies(policies.map((p) => ({ ...p, annualPremium: Math.max(0, p.annualPremium || 0), deductible: Math.max(0, p.deductible || 0), coverageAmount: Math.max(0, p.coverageAmount || 0), additionalFees: Math.max(0, p.additionalFees || 0) })));

  const best = results.reduce((min, r) => (r.effectiveAnnualCost < min.effectiveAnnualCost ? r : min), results[0]);

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
          {policies.map((p, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-border p-4">
              <div className="flex items-center justify-between gap-2">
                <Input label={c.policyName} value={p.name} onChange={(e) => update(i, { name: e.target.value })} />
                {policies.length > 2 && (
                  <Button variant="ghost" size="sm" onClick={() => setPolicies((prev) => prev.filter((_, idx) => idx !== i))}>
                    {c.remove}
                  </Button>
                )}
              </div>
              <Input label={c.premium} type="number" min={0} inputMode="decimal" value={p.annualPremium} onChange={(e) => update(i, { annualPremium: parseFloat(e.target.value) || 0 })} />
              <Input label={c.deductible} type="number" min={0} inputMode="decimal" value={p.deductible} onChange={(e) => update(i, { deductible: parseFloat(e.target.value) || 0 })} />
              <Input label={c.coverage} type="number" min={0} inputMode="decimal" value={p.coverageAmount} onChange={(e) => update(i, { coverageAmount: parseFloat(e.target.value) || 0 })} />
              <Input label={c.fees} type="number" min={0} inputMode="decimal" value={p.additionalFees} onChange={(e) => update(i, { additionalFees: parseFloat(e.target.value) || 0 })} />
            </div>
          ))}
          <Button variant="secondary" size="sm" onClick={() => setPolicies((prev) => [...prev, defaultPolicy(`${locale === "ar" ? "العرض" : "Policy"} ${prev.length + 1}`)])}>
            + {c.addPolicy}
          </Button>
        </>
      }
      result={
        <div className="space-y-2">
          {results.map((r, i) => (
            <div key={i} className={`rounded-[var(--radius-md)] border p-3 ${r === best ? "border-accent bg-bg-subtle" : "border-border"}`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-text">{r.name}</span>
                {r === best && <span className="text-xs font-medium text-accent">{locale === "ar" ? "الأفضل" : "Best value"}</span>}
              </div>
              <div className="mt-1 flex justify-between text-sm">
                <span className="text-text-faint">{c.effective}</span>
                <span className="tabular-nums text-text">{formatCurrency(r.effectiveAnnualCost, locale)}</span>
              </div>
            </div>
          ))}
        </div>
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
