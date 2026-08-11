"use client";
import { normalizeNumericInput } from "@/lib/numeric";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import Input from "@/components/ui/Input";
import ResultCard from "@/components/ui/ResultCard";
import { calculateTravelFuel } from "@/lib/calculators/travelFuel";
import { formatCurrency } from "@/lib/format";
import { FLAGSHIP_CALCULATORS } from "@/lib/calculatorRegistry";
import type { Locale } from "@/i18n";

const meta = FLAGSHIP_CALCULATORS.find((c) => c.slug === "travel-fuel-calculator")!;

const COPY = {
  ar: {
    intro: "قدّر كمية الوقود وتكلفته لرحلة برية طويلة، مع التكلفة لكل مسافر.",
    distance: "المسافة (كم)",
    efficiency: "كفاءة الاستهلاك (لتر/100كم)",
    price: "سعر اللتر",
    travelers: "عدد المسافرين",
    required: "الوقود المطلوب",
    total: "التكلفة الإجمالية",
    perPerson: "التكلفة لكل شخص",
    home: "الرئيسية",
    category: "السفر",
    howItWorks: [
      "نحسب كمية الوقود المطلوبة بضرب المسافة في كفاءة الاستهلاك مقسومة على 100.",
      "نضرب الكمية في سعر اللتر للحصول على التكلفة الإجمالية، ثم نقسمها على عدد المسافرين.",
    ],
    disclaimer: "تقدير عام — يتأثر الاستهلاك الفعلي بأسلوب القيادة وحالة الطريق والطقس.",
    faq: [{ question: "من أين أعرف كفاءة استهلاك سيارتي؟", answer: "تجدها عادة في دليل السيارة أو موقع الشركة المصنّعة." }],
  },
  en: {
    intro: "Estimate the fuel quantity and cost for a long road trip, including cost per traveler.",
    distance: "Distance (km)",
    efficiency: "Efficiency (L/100km)",
    price: "Price per liter",
    travelers: "Number of travelers",
    required: "Fuel required",
    total: "Total cost",
    perPerson: "Cost per person",
    home: "Home",
    category: "Travel",
    howItWorks: [
      "We compute fuel required as distance multiplied by efficiency divided by 100.",
      "We multiply that by the price per liter for total cost, then divide by number of travelers.",
    ],
    disclaimer: "General estimate — actual consumption is affected by driving style, road conditions, and weather.",
    faq: [{ question: "Where do I find my car's fuel efficiency?", answer: "Usually in the vehicle manual or the manufacturer's website." }],
  },
};

export default function TravelFuelClient({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const router = useRouter();
  const searchParams = useSearchParams();

  const [distance, setDistance] = useState(searchParams.get("distance") ?? "500");
  const [efficiency, setEfficiency] = useState(searchParams.get("efficiency") ?? "8");
  const [price, setPrice] = useState(searchParams.get("price") ?? "2.18");
  const [travelers, setTravelers] = useState(searchParams.get("travelers") ?? "1");

  function syncUrl(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([k, v]) => params.set(k, v));
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  const result = calculateTravelFuel({
    distanceKm: Math.max(0, (normalizeNumericInput(distance) ?? 0)),
    efficiencyLPer100Km: Math.max(0.1, (normalizeNumericInput(efficiency) ?? 0.1)),
    fuelPricePerLiter: Math.max(0, (normalizeNumericInput(price) ?? 0)),
    travelers: Math.max(1, parseInt(travelers) || 1),
  });

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${locale}/travel-fuel-calculator?distance=${distance}&efficiency=${efficiency}&price=${price}&travelers=${travelers}`
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
          <Input label={c.distance} type="number" min={0} inputMode="decimal" value={distance} onChange={(e) => { setDistance(e.target.value); syncUrl({ distance: e.target.value }); }} />
          <Input label={c.efficiency} type="number" min={0.1} inputMode="decimal" value={efficiency} onChange={(e) => { setEfficiency(e.target.value); syncUrl({ efficiency: e.target.value }); }} />
          <Input label={c.price} type="number" min={0} inputMode="decimal" value={price} onChange={(e) => { setPrice(e.target.value); syncUrl({ price: e.target.value }); }} />
          <Input label={c.travelers} type="number" min={1} inputMode="numeric" value={travelers} onChange={(e) => { setTravelers(e.target.value); syncUrl({ travelers: e.target.value }); }} />
        </>
      }
      result={
        <>
          <ResultCard label={c.total} value={formatCurrency(result.totalCost, locale)} />
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.required}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">{result.fuelRequiredLiters} L</dd>
            </div>
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.perPerson}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">{formatCurrency(result.costPerPerson, locale)}</dd>
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
