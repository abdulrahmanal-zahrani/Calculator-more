"use client";
import { normalizeNumericInput } from "@/lib/numeric";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import ResultCard from "@/components/ui/ResultCard";
import { calculateFuelCost } from "@/lib/calculators/fuel";
import { FUEL_PRICES_SAR, FUEL_LABELS, FUEL_PRICE_NOTE, type FuelType } from "@/lib/config/fuelPrices";
import { formatCurrency, formatNumber } from "@/lib/format";
import { FLAGSHIP_CALCULATORS } from "@/lib/calculatorRegistry";
import type { Locale } from "@/i18n";

const meta = FLAGSHIP_CALCULATORS.find((c) => c.slug === "fuel-cost-calculator")!;

const COPY = {
  ar: {
    intro: "احسب تكلفة الوقود لأي رحلة، شهرياً أو سنوياً، حسب كفاءة استهلاك سيارتك.",
    distance: "المسافة (كم)",
    efficiency: "الاستهلاك (لتر/100كم)",
    fuelType: "نوع الوقود",
    price: "السعر (ريال/لتر)",
    trips: "عدد الرحلات شهرياً",
    tripCost: "تكلفة الرحلة",
    liters: "اللترات المستهلكة",
    perKm: "التكلفة لكل كم",
    monthly: "شهرياً",
    annual: "سنوياً",
    home: "الرئيسية",
    category: "السيارات",
    howItWorks: [
      "نحسب اللترات المستهلكة بضرب المسافة في معدل الاستهلاك وقسمتها على 100.",
      "نضرب اللترات في سعر اللتر للحصول على تكلفة الرحلة.",
      "نضرب تكلفة الرحلة في عدد الرحلات الشهرية للحصول على التكلفة الشهرية، ثم في 12 للسنوية.",
    ],
    disclaimer: "أسعار الوقود تقريبية لأغراض العرض وقد تختلف عن السعر الفعلي عند المحطة.",
    faq: [
      { question: "من أين تأتي أسعار الوقود؟", answer: "هذه أسعار إرشادية يمكنك تعديلها يدوياً لتطابق السعر الحالي في منطقتك." },
    ],
  },
  en: {
    intro: "Calculate fuel cost for any trip, monthly, or annually, based on your car's efficiency.",
    distance: "Distance (km)",
    efficiency: "Efficiency (L/100km)",
    fuelType: "Fuel type",
    price: "Price (SAR/liter)",
    trips: "Trips per month",
    tripCost: "Trip cost",
    liters: "Liters consumed",
    perKm: "Cost per km",
    monthly: "Monthly",
    annual: "Annual",
    home: "Home",
    category: "Cars",
    howItWorks: [
      "We compute liters consumed by multiplying distance by efficiency and dividing by 100.",
      "We multiply liters by the price per liter to get the trip cost.",
      "We multiply trip cost by trips per month for monthly cost, then by 12 for annual.",
    ],
    disclaimer: "Fuel prices are indicative examples and may differ from the actual pump price.",
    faq: [
      { question: "Where do the fuel prices come from?", answer: "These are indicative example values you can edit manually to match your local price." },
    ],
  },
};

export default function FuelCalculatorClient({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const router = useRouter();
  const searchParams = useSearchParams();

  const [distance, setDistance] = useState(searchParams.get("distance") ?? "200");
  const [efficiency, setEfficiency] = useState(searchParams.get("efficiency") ?? "8");
  const [fuelType, setFuelType] = useState<FuelType>((searchParams.get("fuel") as FuelType) || "gasoline91");
  const [price, setPrice] = useState(searchParams.get("price") ?? String(FUEL_PRICES_SAR.gasoline91));
  const [trips, setTrips] = useState(searchParams.get("trips") ?? "20");

  function syncUrl(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([k, v]) => params.set(k, v));
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  const result = calculateFuelCost({
    distanceKm: Math.max(0, (normalizeNumericInput(distance) ?? 0)),
    efficiencyLPer100Km: Math.max(0, (normalizeNumericInput(efficiency) ?? 0)),
    pricePerLiter: Math.max(0, (normalizeNumericInput(price) ?? 0)),
    tripsPerMonth: Math.max(0, (normalizeNumericInput(trips) ?? 0)),
  });

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${locale}/fuel-cost-calculator?distance=${distance}&efficiency=${efficiency}&fuel=${fuelType}&price=${price}&trips=${trips}`
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
            label={c.distance}
            type="number"
            min={0}
            inputMode="decimal"
            value={distance}
            onChange={(e) => {
              setDistance(e.target.value);
              syncUrl({ distance: e.target.value });
            }}
          />
          <Input
            label={c.efficiency}
            type="number"
            min={0}
            inputMode="decimal"
            value={efficiency}
            onChange={(e) => {
              setEfficiency(e.target.value);
              syncUrl({ efficiency: e.target.value });
            }}
          />
          <Select
            label={c.fuelType}
            value={fuelType}
            onChange={(e) => {
              const ft = e.target.value as FuelType;
              setFuelType(ft);
              setPrice(String(FUEL_PRICES_SAR[ft]));
              syncUrl({ fuel: ft, price: String(FUEL_PRICES_SAR[ft]) });
            }}
          >
            {(Object.keys(FUEL_LABELS) as FuelType[]).map((ft) => (
              <option key={ft} value={ft}>
                {FUEL_LABELS[ft][locale]}
              </option>
            ))}
          </Select>
          <Input
            label={c.price}
            type="number"
            min={0}
            inputMode="decimal"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              syncUrl({ price: e.target.value });
            }}
          />
          <Input
            label={c.trips}
            type="number"
            min={0}
            inputMode="decimal"
            value={trips}
            onChange={(e) => {
              setTrips(e.target.value);
              syncUrl({ trips: e.target.value });
            }}
          />
          <p className="text-xs text-text-faint">{FUEL_PRICE_NOTE[locale]}</p>
        </>
      }
      result={
        <>
          <ResultCard label={c.tripCost} value={formatCurrency(result.tripCost, locale)} />
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.liters}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">{formatNumber(result.litersConsumed, locale)} L</dd>
            </div>
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.perKm}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">{formatCurrency(result.costPerKm, locale)}</dd>
            </div>
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.monthly}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">{formatCurrency(result.monthlyCost, locale)}</dd>
            </div>
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.annual}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">{formatCurrency(result.annualCost, locale)}</dd>
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
