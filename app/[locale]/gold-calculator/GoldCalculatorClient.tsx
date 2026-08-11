"use client";
import { normalizeNumericInput } from "@/lib/numeric";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Tabs from "@/components/ui/Tabs";
import ResultCard from "@/components/ui/ResultCard";
import AffiliatePanel from "@/components/ui/AffiliatePanel";
import { calculateGoldValue, type Karat } from "@/lib/calculators/gold";
import { SAUDI_VAT_RATE, VAT_SOURCE_NOTE } from "@/lib/config/vat";
import { formatCurrency } from "@/lib/format";
import { FLAGSHIP_CALCULATORS } from "@/lib/calculatorRegistry";
import type { Locale } from "@/i18n";

const meta = FLAGSHIP_CALCULATORS.find((c) => c.slug === "gold-calculator")!;

const COPY = {
  ar: {
    intro: "احسب قيمة الذهب بدقة حسب الوزن والعيار وسعر الجرام، مع أجور الصنعة وضريبة القيمة المضافة.",
    weight: "الوزن (جرام)",
    karat: "العيار",
    price: "سعر جرام عيار 24 (ريال)",
    making: "أجرة الصنعة لكل جرام (ريال)",
    mode: "الوضع",
    modeBuy: "شراء",
    modeSell: "بيع",
    total: "الإجمالي",
    rawValue: "قيمة الذهب الخام",
    makingCharge: "أجور الصنعة",
    vat: "ضريبة القيمة المضافة",
    pricePerGram: "سعر الجرام الفعلي",
    home: "الرئيسية",
    category: "المال",
    howItWorks: [
      "نأخذ سعر جرام الذهب عيار 24 وندخل معامل النقاء حسب العيار المختار (مثلاً 21/24 لعيار 21).",
      "نضرب السعر الفعلي في الوزن للحصول على القيمة الخام.",
      "نضيف أجور الصنعة (في وضع الشراء فقط)، ثم نحسب ضريبة القيمة المضافة على المجموع.",
    ],
    disclaimer: "الأسعار المدخلة يدوية وليست حية. تحقق دائماً من السعر الفعلي لدى المحل قبل الشراء أو البيع.",
    faq: [
      {
        question: "هل السعر محدث تلقائياً؟",
        answer: "لا، هذه الحاسبة تعتمد على إدخال يدوي للسعر حالياً. لا يوجد اتصال بمزود أسعار حي بعد.",
      },
      {
        question: "لماذا يختلف السعر بين الشراء والبيع؟",
        answer: "عند البيع غالباً لا تُسترد أجور الصنعة ولا تُحتسب ضريبة القيمة المضافة على نفس الأساس.",
      },
    ],
  },
  en: {
    intro: "Calculate gold value precisely by weight, karat, and price per gram — including making charge and VAT.",
    weight: "Weight (grams)",
    karat: "Karat",
    price: "24K price per gram (SAR)",
    making: "Making charge per gram (SAR)",
    mode: "Mode",
    modeBuy: "Buy",
    modeSell: "Sell",
    total: "Total",
    rawValue: "Raw gold value",
    makingCharge: "Making charge",
    vat: "VAT",
    pricePerGram: "Effective price/gram",
    home: "Home",
    category: "Money",
    howItWorks: [
      "We take the 24K price per gram and apply a purity factor for the selected karat (e.g. 21/24 for 21K).",
      "We multiply the effective price by weight to get the raw value.",
      "We add the making charge (buy mode only), then apply VAT on the subtotal.",
    ],
    disclaimer: "Entered prices are manual, not live. Always confirm the actual price with your jeweler before buying or selling.",
    faq: [
      {
        question: "Is the price updated automatically?",
        answer: "No — this calculator currently relies on manual price entry. No live price provider is connected yet.",
      },
      {
        question: "Why does the price differ between buy and sell?",
        answer: "When selling, making charges are usually not refunded and VAT is not applied the same way.",
      },
    ],
  },
};

export default function GoldCalculatorClient({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const router = useRouter();
  const searchParams = useSearchParams();

  const [weight, setWeight] = useState(searchParams.get("weight") ?? "10");
  const [karat, setKarat] = useState<Karat>((Number(searchParams.get("karat")) as Karat) || 21);
  const [price, setPrice] = useState(searchParams.get("price") ?? "300");
  const [making, setMaking] = useState(searchParams.get("making") ?? "10");
  const [mode, setMode] = useState<"buy" | "sell">((searchParams.get("mode") as "buy" | "sell") ?? "buy");

  function syncUrl(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([k, v]) => params.set(k, v));
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  const weightNum = Math.max(0, (normalizeNumericInput(weight) ?? 0));
  const priceNum = Math.max(0, (normalizeNumericInput(price) ?? 0));
  const makingNum = Math.max(0, (normalizeNumericInput(making) ?? 0));

  const result = calculateGoldValue({
    weightGrams: weightNum,
    karat,
    pricePerGram24k: priceNum,
    makingChargePerGram: makingNum,
    vatRate: SAUDI_VAT_RATE,
    mode,
  });

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${locale}/gold-calculator?weight=${weightNum}&karat=${karat}&price=${priceNum}&making=${makingNum}&mode=${mode}`
      : "";

  return (
    <>
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
            value={mode}
            onChange={(v) => {
              setMode(v);
              syncUrl({ mode: v });
            }}
            options={[
              { value: "buy", label: c.modeBuy },
              { value: "sell", label: c.modeSell },
            ]}
          />
          <Input
            label={c.weight}
            type="number"
            min={0}
            inputMode="decimal"
            value={weight}
            onChange={(e) => {
              setWeight(e.target.value);
              syncUrl({ weight: e.target.value });
            }}
          />
          <Select
            label={c.karat}
            value={karat}
            onChange={(e) => {
              const k = Number(e.target.value) as Karat;
              setKarat(k);
              syncUrl({ karat: String(k) });
            }}
          >
            {[18, 21, 22, 24].map((k) => (
              <option key={k} value={k}>
                {k}K
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
          {mode === "buy" && (
            <Input
              label={c.making}
              type="number"
              min={0}
              inputMode="decimal"
              value={making}
              onChange={(e) => {
                setMaking(e.target.value);
                syncUrl({ making: e.target.value });
              }}
            />
          )}
        </>
      }
      result={
        <>
          <ResultCard label={c.total} value={formatCurrency(result.total, locale)} />
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.pricePerGram}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">
                {formatCurrency(result.effectivePricePerGram, locale)}
              </dd>
            </div>
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.rawValue}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">{formatCurrency(result.rawValue, locale)}</dd>
            </div>
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.makingCharge}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">
                {formatCurrency(result.makingCharge, locale)}
              </dd>
            </div>
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.vat}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">{formatCurrency(result.vatAmount, locale)}</dd>
            </div>
          </dl>
          <p className="text-xs text-text-faint">{VAT_SOURCE_NOTE[locale]}</p>
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
    {/* Demonstrates the affiliate seam (lib/affiliate.ts) — renders null
        today since no real jewelers/partners are wired up yet. */}
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      <AffiliatePanel category="gold" locale={locale} title={locale === "ar" ? "منتجات ذات صلة" : "Related products"} />
    </div>
    </>
  );
}
