import type { Metadata } from "next";
import { Suspense } from "react";
import type { Locale } from "@/i18n";
import { locales } from "@/i18n";
import { buildMetadata, webApplicationJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import TripBudgetCalculatorClient from "./TripBudgetCalculatorClient";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const TITLE = { ar: "حاسبة ميزانية الرحلة", en: "Trip Budget Calculator" };
const DESCRIPTION = {
  ar: "خطط لميزانية رحلتك القادمة: طيران، إقامة، طعام، تنقل، وأنشطة.",
  en: "Plan your next trip's budget: flights, accommodation, food, transport, and activities.",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  return buildMetadata({
    locale: l,
    path: "/trip-budget-calculator",
    title: TITLE[l],
    description: DESCRIPTION[l],
    ogImageQuery: "travelers=2&days=5&flights=1000&accommodation=300&food=100&transport=200&activities=150&shopping=100&buffer=10",
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const jsonLd = [
    webApplicationJsonLd({ locale: l, name: TITLE[l], description: DESCRIPTION[l], path: "/trip-budget-calculator" }),
    breadcrumbJsonLd(l, [
      { name: l === "ar" ? "الرئيسية" : "Home", path: "" },
      { name: l === "ar" ? "السفر" : "Travel", path: "/travel" },
      { name: TITLE[l], path: "/trip-budget-calculator" },
    ]),
  ];
  return (
    <>
      {jsonLd.map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}
      <Suspense>
        <TripBudgetCalculatorClient locale={l} />
      </Suspense>
    </>
  );
}
