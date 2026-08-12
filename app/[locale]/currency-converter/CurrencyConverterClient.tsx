"use client";
import { normalizeNumericInput } from "@/lib/numeric";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import ResultCard from "@/components/ui/ResultCard";
import { calculateCurrencyConversion } from "@/lib/calculators/currency";
import { CURRENCIES, FALLBACK_RATES_TO_SAR, RATES_LAST_UPDATED, type CurrencyCode } from "@/lib/services/currencyService";
import { formatNumber } from "@/lib/format";
import { FLAGSHIP_CALCULATORS } from "@/lib/calculatorRegistry";
import type { Locale } from "@/i18n";

const meta = FLAGSHIP_CALCULATORS.find((c) => c.slug === "currency-converter")!;

const COPY = {
  ar: {
    intro: "حوّل بين 16 عملة رئيسية باستخدام أسعار إرشادية — غير مباشرة، مخصصة للتطوير والعرض.",
    amount: "المبلغ",
    from: "من",
    to: "إلى",
    swap: "تبديل",
    result: "النتيجة",
    rate: "سعر الصرف",
    note: `الأسعار إرشادية وغير حية — آخر تحديث ${RATES_LAST_UPDATED}.`,
    home: "الرئيسية",
    category: "الفلوس",
    howItWorks: [
      "نحوّل المبلغ إلى الريال السعودي كعملة وسيطة باستخدام السعر الإرشادي.",
      "ثم نحوّل من الريال السعودي إلى العملة المستهدفة.",
      "هذا يضمن دقة التحويل بين أي زوج من 16 عملة مدعومة.",
    ],
    disclaimer: "الأسعار المستخدمة إرشادية وليست حية، ولا تصلح لأغراض تداول أو تسعير رسمي.",
    faq: [
      { question: "هل الأسعار محدثة لحظياً؟", answer: "لا، هذه أسعار إرشادية ثابتة يتم تحديثها يدوياً حالياً." },
    ],
  },
  en: {
    intro: "Convert between 16 major currencies using indicative rates — non-live, for development and demo use.",
    amount: "Amount",
    from: "From",
    to: "To",
    swap: "Swap",
    result: "Result",
    rate: "Exchange rate",
    note: `Rates are indicative, not live — last updated ${RATES_LAST_UPDATED}.`,
    home: "Home",
    category: "Money",
    howItWorks: [
      "We convert the amount to SAR as an intermediary currency using the indicative rate.",
      "Then we convert from SAR to the target currency.",
      "This ensures accurate conversion between any pair of the 16 supported currencies.",
    ],
    disclaimer: "Rates used are indicative and not live — not suitable for trading or official pricing purposes.",
    faq: [
      { question: "Are rates updated live?", answer: "No, these are fixed indicative rates currently updated manually." },
    ],
  },
};

export default function CurrencyConverterClient({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const router = useRouter();
  const searchParams = useSearchParams();

  const [amount, setAmount] = useState(searchParams.get("amount") ?? "100");
  const [from, setFrom] = useState<CurrencyCode>((searchParams.get("from") as CurrencyCode) || "USD");
  const [to, setTo] = useState<CurrencyCode>((searchParams.get("to") as CurrencyCode) || "SAR");

  function syncUrl(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([k, v]) => params.set(k, v));
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  const result = calculateCurrencyConversion({
    amount: Math.max(0, (normalizeNumericInput(amount) ?? 0)),
    from,
    to,
    ratesToSar: FALLBACK_RATES_TO_SAR,
  });

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${locale}/currency-converter?amount=${amount}&from=${from}&to=${to}`
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
          <Select
            label={c.from}
            value={from}
            onChange={(e) => {
              const v = e.target.value as CurrencyCode;
              setFrom(v);
              syncUrl({ from: v });
            }}
          >
            {CURRENCIES.map((cur) => (
              <option key={cur.code} value={cur.code}>
                {cur.code} — {cur[locale]}
              </option>
            ))}
          </Select>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Select
                label={c.to}
                value={to}
                onChange={(e) => {
                  const v = e.target.value as CurrencyCode;
                  setTo(v);
                  syncUrl({ to: v });
                }}
              >
                {CURRENCIES.map((cur) => (
                  <option key={cur.code} value={cur.code}>
                    {cur.code} — {cur[locale]}
                  </option>
                ))}
              </Select>
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                setFrom(to);
                setTo(from);
                syncUrl({ from: to, to: from });
              }}
              aria-label={c.swap}
            >
              ⇄
            </Button>
          </div>
          <p className="text-xs text-text-faint">{c.note}</p>
        </>
      }
      result={
        <>
          <ResultCard label={c.result} value={`${formatNumber(result.converted, locale)} ${to}`} />
          <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3 text-sm">
            <span className="text-text-faint">{c.rate}: </span>
            <span className="font-semibold tabular-nums text-text">
              1 {from} = {formatNumber(result.rate, locale, 4)} {to}
            </span>
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
