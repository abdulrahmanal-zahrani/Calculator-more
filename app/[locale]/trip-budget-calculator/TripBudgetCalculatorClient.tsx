"use client";
import { normalizeNumericInput } from "@/lib/numeric";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import Input from "@/components/ui/Input";
import ResultCard from "@/components/ui/ResultCard";
import { calculateTripBudget } from "@/lib/calculators/tripBudget";
import { formatCurrency } from "@/lib/format";
import { FLAGSHIP_CALCULATORS } from "@/lib/calculatorRegistry";
import type { Locale } from "@/i18n";

const meta = FLAGSHIP_CALCULATORS.find((c) => c.slug === "trip-budget-calculator")!;

const COPY = {
  ar: {
    intro: "خطط لميزانية رحلتك القادمة بدقة: طيران، إقامة، طعام، تنقل، أنشطة، وتسوق.",
    destination: "الوجهة",
    travelers: "عدد المسافرين",
    days: "عدد الأيام",
    flights: "الطيران (للشخص)",
    accommodation: "الإقامة (لليلة)",
    food: "الطعام (للشخص يوميًا)",
    transport: "التنقل (إجمالي)",
    activities: "الأنشطة (إجمالي)",
    shopping: "التسوق (إجمالي)",
    buffer: "احتياطي الطوارئ %",
    total: "الإجمالي",
    perDay: "لكل يوم",
    perPerson: "لكل شخص",
    bufferAmount: "مبلغ الاحتياطي",
    home: "الرئيسية",
    category: "السفر",
    howItWorks: [
      "نجمع تكلفة الطيران، الإقامة، الطعام، التنقل، الأنشطة، والتسوق للحصول على المجموع الفرعي.",
      "نضيف نسبة احتياطي الطوارئ فوق المجموع الفرعي.",
      "نقسم الإجمالي على عدد الأيام وعدد المسافرين لعرض التكلفة اليومية والفردية.",
    ],
    disclaimer: "هذه تقديرات عامة لأغراض التخطيط وقد تختلف حسب الوجهة والموسم.",
    faq: [
      { question: "لماذا أضيف نسبة احتياطي؟", answer: "لتغطية المصاريف غير المتوقعة أثناء السفر — يُنصح عادة بـ 10-15%." },
    ],
  },
  en: {
    intro: "Plan your next trip's budget precisely: flights, accommodation, food, transport, activities, and shopping.",
    destination: "Destination",
    travelers: "Travelers",
    days: "Days",
    flights: "Flights (per person)",
    accommodation: "Accommodation (per night)",
    food: "Food (per person/day)",
    transport: "Transport (total)",
    activities: "Activities (total)",
    shopping: "Shopping (total)",
    buffer: "Emergency buffer %",
    total: "Total",
    perDay: "Per day",
    perPerson: "Per person",
    bufferAmount: "Buffer amount",
    home: "Home",
    category: "Travel",
    howItWorks: [
      "We add flights, accommodation, food, transport, activities, and shopping to get the subtotal.",
      "We add the emergency buffer percentage on top of the subtotal.",
      "We divide the total by days and travelers to show daily and per-person cost.",
    ],
    disclaimer: "These are general planning estimates and may vary by destination and season.",
    faq: [
      { question: "Why add a buffer percentage?", answer: "To cover unexpected expenses while traveling — 10-15% is typically recommended." },
    ],
  },
};

export default function TripBudgetCalculatorClient({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const router = useRouter();
  const searchParams = useSearchParams();

  const [destination, setDestination] = useState(searchParams.get("destination") ?? "");
  const [travelers, setTravelers] = useState(searchParams.get("travelers") ?? "2");
  const [days, setDays] = useState(searchParams.get("days") ?? "5");
  const [flights, setFlights] = useState(searchParams.get("flights") ?? "1000");
  const [accommodation, setAccommodation] = useState(searchParams.get("accommodation") ?? "300");
  const [food, setFood] = useState(searchParams.get("food") ?? "100");
  const [transport, setTransport] = useState(searchParams.get("transport") ?? "200");
  const [activities, setActivities] = useState(searchParams.get("activities") ?? "150");
  const [shopping, setShopping] = useState(searchParams.get("shopping") ?? "100");
  const [buffer, setBuffer] = useState(searchParams.get("buffer") ?? "10");

  function syncUrl(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([k, v]) => params.set(k, v));
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  const num = (v: string) => Math.max(0, (normalizeNumericInput(v) ?? 0));

  const result = calculateTripBudget({
    travelers: Math.max(1, parseInt(travelers) || 1),
    days: Math.max(1, parseInt(days) || 1),
    flights: num(flights),
    accommodationPerNight: num(accommodation),
    foodPerDayPerPerson: num(food),
    transport: num(transport),
    activities: num(activities),
    shopping: num(shopping),
    bufferPercent: num(buffer),
  });

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${locale}/trip-budget-calculator?destination=${encodeURIComponent(
          destination
        )}&travelers=${travelers}&days=${days}&flights=${flights}&accommodation=${accommodation}&food=${food}&transport=${transport}&activities=${activities}&shopping=${shopping}&buffer=${buffer}`
      : "";

  const fields: [string, string, (v: string) => void, string][] = [
    [c.travelers, travelers, setTravelers, "travelers"],
    [c.days, days, setDays, "days"],
    [c.flights, flights, setFlights, "flights"],
    [c.accommodation, accommodation, setAccommodation, "accommodation"],
    [c.food, food, setFood, "food"],
    [c.transport, transport, setTransport, "transport"],
    [c.activities, activities, setActivities, "activities"],
    [c.shopping, shopping, setShopping, "shopping"],
    [c.buffer, buffer, setBuffer, "buffer"],
  ];

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
            label={c.destination}
            type="text"
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              syncUrl({ destination: e.target.value });
            }}
          />
          {fields.map(([label, value, setter, key]) => (
            <Input
              key={key}
              label={label}
              type="number"
              min={0}
              inputMode="decimal"
              value={value}
              onChange={(e) => {
                setter(e.target.value);
                syncUrl({ [key]: e.target.value });
              }}
            />
          ))}
        </>
      }
      result={
        <>
          <ResultCard label={c.total} value={formatCurrency(result.total, locale)} />
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.perDay}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">{formatCurrency(result.perDay, locale)}</dd>
            </div>
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.perPerson}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">{formatCurrency(result.perPerson, locale)}</dd>
            </div>
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.bufferAmount}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">{formatCurrency(result.bufferAmount, locale)}</dd>
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
