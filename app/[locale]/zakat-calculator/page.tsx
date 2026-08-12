import type { Metadata } from "next";
import { Suspense } from "react";
import type { Locale } from "@/i18n";
import { locales } from "@/i18n";
import { buildMetadata, webApplicationJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import ZakatCalculatorClient from "./ZakatCalculatorClient";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const TITLE = { ar: "حاسبة الزكاة", en: "Zakat Calculator" };
const DESCRIPTION = {
  ar: "احسب زكاة الفلوس والذهب والفضة والاستثمارات وفق قواعد عامة.",
  en: "Calculate zakat on cash, gold, silver, and investments using general rules.",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  return buildMetadata({ locale: l, path: "/zakat-calculator", title: TITLE[l], description: DESCRIPTION[l] });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const jsonLd = [
    webApplicationJsonLd({ locale: l, name: TITLE[l], description: DESCRIPTION[l], path: "/zakat-calculator" }),
    breadcrumbJsonLd(l, [
      { name: l === "ar" ? "الرئيسية" : "Home", path: "" },
      { name: l === "ar" ? "الفلوس" : "Money", path: "/money" },
      { name: TITLE[l], path: "/zakat-calculator" },
    ]),
  ];
  return (
    <>
      {jsonLd.map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}
      <Suspense>
        <ZakatCalculatorClient locale={l} />
      </Suspense>
    </>
  );
}
