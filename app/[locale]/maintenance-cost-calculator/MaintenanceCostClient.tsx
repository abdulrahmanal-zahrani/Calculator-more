"use client";
import { normalizeNumericInput } from "@/lib/numeric";

import { useState } from "react";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import Input from "@/components/ui/Input";
import ResultCard from "@/components/ui/ResultCard";
import { calculateMaintenanceCost, type MaintenanceItemInput } from "@/lib/calculators/maintenanceCost";
import { formatCurrency } from "@/lib/format";
import { FLAGSHIP_CALCULATORS } from "@/lib/calculatorRegistry";
import type { Locale } from "@/i18n";

const meta = FLAGSHIP_CALCULATORS.find((c) => c.slug === "maintenance-cost-calculator")!;

const COPY = {
  ar: {
    intro: "قدّر تكلفة صيانة سيارتك السنوية بناءً على عناصر الصيانة الدورية ومسافة القيادة.",
    mileage: "المسافة السنوية (كم)",
    item: "عنصر الصيانة",
    cost: "تكلفة الخدمة الواحدة",
    interval: "الفاصل الزمني (كم)",
    annual: "التكلفة السنوية الإجمالية",
    monthly: "التكلفة الشهرية",
    home: "الرئيسية",
    category: "السيارات",
    howItWorks: [
      "لكل عنصر صيانة، نحسب عدد مرات الخدمة سنويًا بقسمة المسافة السنوية على الفاصل الزمني.",
      "نضرب عدد المرات في تكلفة الخدمة الواحدة، ثم نجمع كل العناصر.",
    ],
    disclaimer: "الأرقام الافتراضية تقديرية — عدّلها حسب أسعار الصيانة الفعلية في منطقتك ونوع سيارتك.",
    faq: [{ question: "هل يمكن إضافة عناصر مخصصة؟", answer: "نعم، عدّل الأسماء والقيم لتناسب سيارتك." }],
    items: [
      { name: "زيت المحرك", cost: 150, interval: 10000 },
      { name: "الإطارات", cost: 1200, interval: 40000 },
      { name: "الفرامل", cost: 400, interval: 25000 },
      { name: "البطارية", cost: 350, interval: 60000 },
    ],
  },
  en: {
    intro: "Estimate your car's annual maintenance cost based on recurring service items and mileage.",
    mileage: "Annual mileage (km)",
    item: "Maintenance item",
    cost: "Cost per service",
    interval: "Interval (km)",
    annual: "Total annual cost",
    monthly: "Monthly cost",
    home: "Home",
    category: "Cars",
    howItWorks: [
      "For each item, we compute services per year by dividing annual mileage by the interval.",
      "We multiply that by the cost per service, then sum across all items.",
    ],
    disclaimer: "Default figures are indicative — adjust them to your region's actual prices and your vehicle type.",
    faq: [{ question: "Can I add custom items?", answer: "Yes, edit the names and values to match your vehicle." }],
    items: [
      { name: "Engine oil", cost: 150, interval: 10000 },
      { name: "Tires", cost: 1200, interval: 40000 },
      { name: "Brakes", cost: 400, interval: 25000 },
      { name: "Battery", cost: 350, interval: 60000 },
    ],
  },
};

export default function MaintenanceCostClient({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const [mileage, setMileage] = useState("20000");
  const [items, setItems] = useState<MaintenanceItemInput[]>(
    c.items.map((i) => ({ name: i.name, costPerService: i.cost, intervalKm: i.interval }))
  );

  function update(i: number, patch: Partial<MaintenanceItemInput>) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }

  const result = calculateMaintenanceCost({
    annualMileageKm: Math.max(0, (normalizeNumericInput(mileage) ?? 0)),
    items: items.map((i) => ({ ...i, costPerService: Math.max(0, i.costPerService || 0), intervalKm: Math.max(1, i.intervalKm || 1) })),
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
          <Input label={c.mileage} type="number" min={0} inputMode="numeric" value={mileage} onChange={(e) => setMileage(e.target.value)} />
          {items.map((it, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 rounded-[var(--radius-md)] border border-border p-3">
              <div className="col-span-3">
                <Input label={c.item} value={it.name} onChange={(e) => update(i, { name: e.target.value })} />
              </div>
              <Input label={c.cost} type="number" min={0} inputMode="decimal" value={it.costPerService} onChange={(e) => update(i, { costPerService: (normalizeNumericInput(e.target.value) ?? 0) })} />
              <div className="col-span-2">
                <Input label={c.interval} type="number" min={1} inputMode="numeric" value={it.intervalKm} onChange={(e) => update(i, { intervalKm: (normalizeNumericInput(e.target.value) ?? 1) })} />
              </div>
            </div>
          ))}
        </>
      }
      result={
        <>
          <ResultCard label={c.annual} value={formatCurrency(result.totalAnnualCost, locale)} />
          <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-faint">{c.monthly}</span>
              <span className="tabular-nums text-text">{formatCurrency(result.totalMonthlyCost, locale)}</span>
            </div>
          </div>
          <div className="space-y-1 text-sm">
            {result.items.map((it, i) => (
              <div key={i} className="flex justify-between rounded-[var(--radius-sm)] bg-bg-subtle px-3 py-2">
                <span className="text-text-muted">{it.name}</span>
                <span className="tabular-nums text-text">{formatCurrency(it.annualCost, locale)}</span>
              </div>
            ))}
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
