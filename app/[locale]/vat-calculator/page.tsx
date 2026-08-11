import type { Metadata } from "next";
import { Suspense } from "react";
import type { Locale } from "@/i18n";
import { locales } from "@/i18n";
import { buildMetadata, webApplicationJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import VatCalculatorClient from "./VatCalculatorClient";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const TITLE = { ar: "حاسبة ضريبة القيمة المضافة", en: "VAT Calculator" };
const DESCRIPTION = {
  ar: "أضف أو استخرج ضريبة القيمة المضافة بأي نسبة، بما في ذلك نسبة زاتكا 15%.",
  en: "Add or reverse-calculate VAT at any rate, including the 15% ZATCA rate.",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  return buildMetadata({ locale: l, path: "/vat-calculator", title: TITLE[l], description: DESCRIPTION[l] });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const jsonLd = [
    webApplicationJsonLd({ locale: l, name: TITLE[l], description: DESCRIPTION[l], path: "/vat-calculator" }),
    breadcrumbJsonLd(l, [
      { name: l === "ar" ? "الرئيسية" : "Home", path: "" },
      { name: l === "ar" ? "المال" : "Money", path: "/money" },
      { name: TITLE[l], path: "/vat-calculator" },
    ]),
  ];
  return (
    <>
      {jsonLd.map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}
      <Suspense>
        <VatCalculatorClient locale={l} />
      </Suspense>
    </>
  );
}
