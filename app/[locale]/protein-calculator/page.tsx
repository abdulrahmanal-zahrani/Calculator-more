import type { Metadata } from "next";
import { Suspense } from "react";
import type { Locale } from "@/i18n";
import { locales } from "@/i18n";
import { buildMetadata, webApplicationJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import ProteinCalculatorClient from "./ProteinCalculatorClient";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const TITLE = { ar: "حاسبة البروتين", en: "Protein Calculator" };
const DESCRIPTION = {
  ar: "احسب احتياجك اليومي من البروتين حسب وزنك ونشاطك وهدفك.",
  en: "Estimate your daily protein needs based on weight, activity, and goal.",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  return buildMetadata({ locale: l, path: "/protein-calculator", title: TITLE[l], description: DESCRIPTION[l] });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const jsonLd = [
    webApplicationJsonLd({ locale: l, name: TITLE[l], description: DESCRIPTION[l], path: "/protein-calculator" }),
    breadcrumbJsonLd(l, [
      { name: l === "ar" ? "الرئيسية" : "Home", path: "" },
      { name: l === "ar" ? "القهوة والأكل" : "Coffee & Food", path: "/lifestyle" },
      { name: TITLE[l], path: "/protein-calculator" },
    ]),
  ];
  return (
    <>
      {jsonLd.map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}
      <Suspense>
        <ProteinCalculatorClient locale={l} />
      </Suspense>
    </>
  );
}
