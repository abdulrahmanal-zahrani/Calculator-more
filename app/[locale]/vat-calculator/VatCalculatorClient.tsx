"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import Input from "@/components/ui/Input";
import ResultCard from "@/components/ui/ResultCard";
import Tabs from "@/components/ui/Tabs";
import { calculateVat } from "@/lib/calculators/vat";
import { SAUDI_VAT_RATE, VAT_SOURCE_NOTE } from "@/lib/config/vat";
import { formatCurrency } from "@/lib/format";
import { FLAGSHIP_CALCULATORS } from "@/lib/calculatorRegistry";
import type { Locale } from "@/i18n";

const meta = FLAGSHIP_CALCULATORS.find((c) => c.slug === "vat-calculator")!;

const COPY = {
  ar: {
    intro: "أضف ضريبة القيمة المضافة على سعر، أو استخرجها من سعر شامل الضريبة.",
    amount: "المبلغ",
    rate: "نسبة الضريبة %",
    exclusive: "المبلغ بدون ضريبة",
    inclusive: "المبلغ شامل الضريبة",
    net: "المبلغ قبل الضريبة",
    vat: "قيمة الضريبة",
    gross: "المبلغ شامل الضريبة",
    home: "الرئيسية",
    category: "المال",
    howItWorks: [
      "في وضع «بدون ضريبة»، نضيف نسبة الضريبة إلى المبلغ المُدخل.",
      "في وضع «شامل الضريبة»، نستخرج قيمة الضريبة من المبلغ المُدخل بافتراض أنه يتضمنها.",
      VAT_SOURCE_NOTE.ar,
    ],
    disclaimer: "هذه الحاسبة لأغراض تقديرية عامة وليست استشارة ضريبية رسمية.",
    faq: [
      { question: "ما هي نسبة الضريبة الافتراضية؟", answer: "15% وفق هيئة الزكاة والضريبة والجمارك (زاتكا) في المملكة العربية السعودية، ويمكنك تغييرها." },
    ],
  },
  en: {
    intro: "Add VAT on top of a price, or reverse-calculate it out of a VAT-inclusive price.",
    amount: "Amount",
    rate: "VAT rate %",
    exclusive: "Amount excludes VAT",
    inclusive: "Amount includes VAT",
    net: "Amount before VAT",
    vat: "VAT amount",
    gross: "Amount including VAT",
    home: "Home",
    category: "Money",
    howItWorks: [
      "In \"excludes VAT\" mode, we add the VAT rate on top of the entered amount.",
      "In \"includes VAT\" mode, we back out the VAT portion assuming it's already in the amount.",
      VAT_SOURCE_NOTE.en,
    ],
    disclaimer: "This calculator is for general estimation purposes and is not official tax advice.",
    faq: [
      { question: "What's the default VAT rate?", answer: "15%, per ZATCA in Saudi Arabia — you can change it to any rate." },
    ],
  },
};

export default function VatCalculatorClient({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const router = useRouter();
  const searchParams = useSearchParams();

  const [amount, setAmount] = useState(searchParams.get("amount") ?? "1000");
  const [rate, setRate] = useState(searchParams.get("rate") ?? String(SAUDI_VAT_RATE * 100));
  const [mode, setMode] = useState<"exclusive" | "inclusive">((searchParams.get("mode") as "exclusive" | "inclusive") ?? "exclusive");

  function syncUrl(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([k, v]) => params.set(k, v));
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  const result = calculateVat({
    amount: Math.max(0, parseFloat(amount) || 0),
    ratePercent: Math.max(0, parseFloat(rate) || 0),
    mode,
  });

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${locale}/vat-calculator?amount=${amount}&rate=${rate}&mode=${mode}`
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
          <Tabs
            options={[
              { value: "exclusive", label: c.exclusive },
              { value: "inclusive", label: c.inclusive },
            ]}
            value={mode}
            onChange={(v) => {
              setMode(v);
              syncUrl({ mode: v });
            }}
          />
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
        </>
      }
      result={
        <>
          <ResultCard label={c.gross} value={formatCurrency(result.grossAmount, locale)} />
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.net}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">{formatCurrency(result.netAmount, locale)}</dd>
            </div>
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.vat}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">{formatCurrency(result.vatAmount, locale)}</dd>
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
