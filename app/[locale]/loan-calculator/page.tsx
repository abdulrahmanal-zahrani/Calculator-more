import type { Metadata } from "next";
import { Suspense } from "react";
import type { Locale } from "@/i18n";
import { locales } from "@/i18n";
import { buildMetadata, webApplicationJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import LoanCalculatorClient from "./LoanCalculatorClient";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const TITLE = { ar: "حاسبة التمويل", en: "Loan Calculator" };
const DESCRIPTION = {
  ar: "احسب القسط الشهري وجدول السداد الكامل لأي تمويل.",
  en: "Calculate monthly payments and a full amortization schedule for any loan.",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  return buildMetadata({ locale: l, path: "/loan-calculator", title: TITLE[l], description: DESCRIPTION[l] });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const jsonLd = [
    webApplicationJsonLd({ locale: l, name: TITLE[l], description: DESCRIPTION[l], path: "/loan-calculator" }),
    breadcrumbJsonLd(l, [
      { name: l === "ar" ? "الرئيسية" : "Home", path: "" },
      { name: l === "ar" ? "الفلوس" : "Money", path: "/money" },
      { name: TITLE[l], path: "/loan-calculator" },
    ]),
  ];
  return (
    <>
      {jsonLd.map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}
      <Suspense>
        <LoanCalculatorClient locale={l} />
      </Suspense>
    </>
  );
}
