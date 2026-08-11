import type { Metadata } from "next";
import { Suspense } from "react";
import type { Locale } from "@/i18n";
import { locales } from "@/i18n";
import { buildMetadata, webApplicationJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import DiscountCalculatorClient from "./DiscountCalculatorClient";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const TITLE = { ar: "حاسبة الخصم", en: "Discount Calculator" };
const DESCRIPTION = {
  ar: "احسب السعر النهائي والتوفير مع دعم الخصومات المتراكمة.",
  en: "Work out the final price and savings, including stacked discounts.",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  return buildMetadata({
    locale: l,
    path: "/discount-calculator",
    title: TITLE[l],
    description: DESCRIPTION[l],
    ogImageQuery: "original=500&discounts=20",
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const jsonLd = [
    webApplicationJsonLd({ locale: l, name: TITLE[l], description: DESCRIPTION[l], path: "/discount-calculator" }),
    breadcrumbJsonLd(l, [
      { name: l === "ar" ? "الرئيسية" : "Home", path: "" },
      { name: l === "ar" ? "المال" : "Money", path: "/money" },
      { name: TITLE[l], path: "/discount-calculator" },
    ]),
  ];
  return (
    <>
      {jsonLd.map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}
      <Suspense>
        <DiscountCalculatorClient locale={l} />
      </Suspense>
    </>
  );
}
