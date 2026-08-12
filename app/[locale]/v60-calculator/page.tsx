import type { Metadata } from "next";
import { Suspense } from "react";
import type { Locale } from "@/i18n";
import { locales } from "@/i18n";
import { buildMetadata, webApplicationJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import V60CalculatorClient from "./V60CalculatorClient";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const TITLE = { ar: "حاسبة القهوة / V60", en: "Coffee / V60 Calculator" };
const DESCRIPTION = {
  ar: "احسب النسبة المثالية بين القهوة والماء لأي طريقة تحضير — V60، فرنش برس، إيروبرس، كيمكس، وكولد برو — مع جدول صب خطوة بخطوة.",
  en: "Calculate the perfect coffee-to-water ratio for any brew method — V60, French Press, AeroPress, Chemex, or Cold Brew — with a step-by-step pour schedule.",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  return buildMetadata({
    locale: l,
    path: "/v60-calculator",
    title: TITLE[l],
    description: DESCRIPTION[l],
    ogImageQuery: "method=v60&coffee=20&water=320&ratio=16&solveFor=water",
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const jsonLd = [
    webApplicationJsonLd({ locale: l, name: TITLE[l], description: DESCRIPTION[l], path: "/v60-calculator" }),
    breadcrumbJsonLd(l, [
      { name: l === "ar" ? "الرئيسية" : "Home", path: "" },
      { name: l === "ar" ? "القهوة والأكل" : "Coffee & Food", path: "/lifestyle" },
      { name: TITLE[l], path: "/v60-calculator" },
    ]),
  ];
  return (
    <>
      {jsonLd.map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}
      <Suspense>
        <V60CalculatorClient locale={l} />
      </Suspense>
    </>
  );
}
