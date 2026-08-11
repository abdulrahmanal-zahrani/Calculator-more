import type { Metadata } from "next";
import { Suspense } from "react";
import type { Locale } from "@/i18n";
import { locales } from "@/i18n";
import { buildMetadata, faqJsonLd, webApplicationJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import GoldCalculatorClient from "./GoldCalculatorClient";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const TITLE = { ar: "حاسبة الذهب", en: "Gold Calculator" };
const DESCRIPTION = {
  ar: "احسب قيمة الذهب حسب الوزن والعيار وسعر الجرام، مع أجور الصنعة وضريبة القيمة المضافة (15%).",
  en: "Calculate gold value by weight, karat, and price per gram — including making charge and 15% VAT.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  return buildMetadata({
    locale: l,
    path: "/gold-calculator",
    title: TITLE[l],
    description: DESCRIPTION[l],
    ogImageQuery: "weight=10&karat=21&price=300&making=10&mode=buy",
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;

  const jsonLd = [
    webApplicationJsonLd({ locale: l, name: TITLE[l], description: DESCRIPTION[l], path: "/gold-calculator" }),
    breadcrumbJsonLd(l, [
      { name: l === "ar" ? "الرئيسية" : "Home", path: "" },
      { name: l === "ar" ? "الفلوس" : "Money", path: "/money" },
      { name: TITLE[l], path: "/gold-calculator" },
    ]),
    faqJsonLd(
      l === "ar"
        ? [
            { question: "هل السعر محدث تلقائياً؟", answer: "لا، هذه الحاسبة تعتمد على إدخال يدوي للسعر حالياً." },
            { question: "لماذا يختلف السعر بين الشراء والبيع؟", answer: "عند البيع غالباً لا تُسترد أجور الصنعة." },
          ]
        : [
            { question: "Is the price updated automatically?", answer: "No — this calculator relies on manual entry." },
            { question: "Why does price differ between buy and sell?", answer: "Selling usually doesn't refund making charges." },
          ]
    ),
  ];

  return (
    <>
      {jsonLd.map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}
      <Suspense>
        <GoldCalculatorClient locale={l} />
      </Suspense>
    </>
  );
}
