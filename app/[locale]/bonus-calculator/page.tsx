import type { Metadata } from "next";
import { Suspense } from "react";
import type { Locale } from "@/i18n";
import { locales } from "@/i18n";
import { buildMetadata, webApplicationJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import BonusCalculatorClient from "./BonusCalculatorClient";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const TITLE = { ar: "حاسبة البونص السنوي", en: "Annual Bonus Calculator" };
const DESCRIPTION = {
  ar: "احسب مكافأة نهاية السنة (البونص) حسب تقييم الأداء ونظام شركتك — بدون افتراض معادلة موحدة.",
  en: "Calculate your annual (end-of-year) bonus based on your performance rating and your company's own system.",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  return buildMetadata({
    locale: l,
    path: "/bonus-calculator",
    title: TITLE[l],
    description: DESCRIPTION[l],
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const jsonLd = [
    webApplicationJsonLd({ locale: l, name: TITLE[l], description: DESCRIPTION[l], path: "/bonus-calculator" }),
    breadcrumbJsonLd(l, [
      { name: l === "ar" ? "الرئيسية" : "Home", path: "" },
      { name: l === "ar" ? "الفلوس" : "Money", path: "/money" },
      { name: TITLE[l], path: "/bonus-calculator" },
    ]),
  ];
  return (
    <>
      {jsonLd.map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}
      <Suspense>
        <BonusCalculatorClient locale={l} />
      </Suspense>
    </>
  );
}
