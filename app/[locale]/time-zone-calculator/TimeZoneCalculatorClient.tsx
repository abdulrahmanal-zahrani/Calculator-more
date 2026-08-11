"use client";

import { useState } from "react";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import ResultCard from "@/components/ui/ResultCard";
import { convertTimeZone, TIME_ZONE_CITIES } from "@/lib/calculators/timeZone";
import { formatNumber } from "@/lib/format";
import { FLAGSHIP_CALCULATORS } from "@/lib/calculatorRegistry";
import type { Locale } from "@/i18n";

const meta = FLAGSHIP_CALCULATORS.find((c) => c.slug === "time-zone-calculator")!;

const COPY = {
  ar: {
    intro: "قارن التوقيت بين مدينتين حول العالم — يراعي الحساب التوقيت الصيفي تلقائياً.",
    from: "من مدينة",
    to: "إلى مدينة",
    dateTime: "التاريخ والوقت",
    fromTime: "الوقت في المدينة الأولى",
    toTime: "الوقت في المدينة الثانية",
    offset: "فرق التوقيت (ساعة)",
    home: "الرئيسية",
    category: "السفر",
    howItWorks: [
      "نستخدم بيانات المناطق الزمنية المدمجة في المتصفح (IANA) لحساب الوقت الفعلي في كل مدينة.",
      "هذا يعني أن التوقيت الصيفي (DST) يُحتسب تلقائياً لكل مدينة حسب تاريخها المحلي.",
    ],
    disclaimer: "الأوقات تُحسب حسب بيانات المناطق الزمنية القياسية — تحقق من مصدر رسمي لأحداث حساسة للوقت.",
    faq: [{ question: "هل يراعي التوقيت الصيفي؟", answer: "نعم، يعتمد على قاعدة بيانات IANA المدمجة في المتصفح والتي تحدّث تلقائياً." }],
  },
  en: {
    intro: "Compare the time between two cities worldwide — DST is handled automatically.",
    from: "From city",
    to: "To city",
    dateTime: "Date & time",
    fromTime: "Time in the first city",
    toTime: "Time in the second city",
    offset: "Time difference (hours)",
    home: "Home",
    category: "Travel",
    howItWorks: [
      "We use the browser's built-in IANA time zone database to compute the actual local time in each city.",
      "This means daylight saving time (DST) is applied automatically for each city based on its local date.",
    ],
    disclaimer: "Times are computed from standard time zone data — verify with an official source for time-sensitive events.",
    faq: [{ question: "Does it account for DST?", answer: "Yes — it relies on the browser's built-in IANA database, which updates automatically." }],
  },
};

function toLocalInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function TimeZoneCalculatorClient({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const [fromCity, setFromCity] = useState("riyadh");
  const [toCity, setToCity] = useState("london");
  const [dateTime, setDateTime] = useState(() => toLocalInputValue(new Date()));

  const fromTz = TIME_ZONE_CITIES.find((city) => city.id === fromCity)!.timeZone;
  const toTz = TIME_ZONE_CITIES.find((city) => city.id === toCity)!.timeZone;

  let result;
  try {
    result = convertTimeZone(new Date(dateTime).toISOString(), fromTz, toTz);
  } catch {
    result = { fromFormatted: "—", toFormatted: "—", offsetHours: 0 };
  }

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
          <Select label={c.from} value={fromCity} onChange={(e) => setFromCity(e.target.value)}>
            {TIME_ZONE_CITIES.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name[locale]}
              </option>
            ))}
          </Select>
          <Select label={c.to} value={toCity} onChange={(e) => setToCity(e.target.value)}>
            {TIME_ZONE_CITIES.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name[locale]}
              </option>
            ))}
          </Select>
          <Input label={c.dateTime} type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
        </>
      }
      result={
        <>
          <ResultCard label={c.toTime} value={result.toFormatted} />
          <dl className="grid grid-cols-1 gap-3 text-sm">
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.fromTime}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">{result.fromFormatted}</dd>
            </div>
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.offset}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">
                {result.offsetHours > 0 ? "+" : ""}
                {formatNumber(result.offsetHours, locale)}
              </dd>
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
