import type { Metadata } from "next";
import { Suspense } from "react";
import type { Locale } from "@/i18n";
import { locales } from "@/i18n";
import { buildMetadata, webApplicationJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import SalaryCalculatorClient from "./SalaryCalculatorClient";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const TITLE = { ar: "حاسبة الراتب", en: "Salary Calculator" };
const DESCRIPTION = {
  ar: "احسب صافي راتبك الشهري والسنوي من الأساسي والبدلات والاستقطاعات.",
  en: "Calculate your net monthly and annual salary from basic pay, allowances, and deductions.",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  return buildMetadata({
    locale: l,
    path: "/salary-calculator",
    title: TITLE[l],
    description: DESCRIPTION[l],
    ogImageQuery: "basic=5000&housing=1000&transport=500&other=0&deductions=0",
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const jsonLd = [
    webApplicationJsonLd({ locale: l, name: TITLE[l], description: DESCRIPTION[l], path: "/salary-calculator" }),
    breadcrumbJsonLd(l, [
      { name: l === "ar" ? "الرئيسية" : "Home", path: "" },
      { name: l === "ar" ? "المال" : "Money", path: "/money" },
      { name: TITLE[l], path: "/salary-calculator" },
    ]),
  ];
  return (
    <>
      {jsonLd.map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}
      <Suspense>
        <SalaryCalculatorClient locale={l} />
      </Suspense>
    </>
  );
}
