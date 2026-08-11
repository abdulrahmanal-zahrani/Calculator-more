import type { Metadata } from "next";
import { Suspense } from "react";
import type { Locale } from "@/i18n";
import { locales } from "@/i18n";
import { buildMetadata, webApplicationJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import CoffeeRatioClient from "./CoffeeRatioClient";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const TITLE = { ar: "حاسبة نسبة القهوة", en: "Coffee Ratio Calculator" };
const DESCRIPTION = {
  ar: "نسبة القهوة والماء لطرق تحضير مختلفة: فرنش برس، إيروبرس، كيمكس، وكولد برو.",
  en: "Coffee-to-water ratios for French Press, AeroPress, Chemex, and Cold Brew.",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  return buildMetadata({ locale: l, path: "/coffee-ratio-calculator", title: TITLE[l], description: DESCRIPTION[l] });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const jsonLd = [
    webApplicationJsonLd({ locale: l, name: TITLE[l], description: DESCRIPTION[l], path: "/coffee-ratio-calculator" }),
    breadcrumbJsonLd(l, [
      { name: l === "ar" ? "الرئيسية" : "Home", path: "" },
      { name: l === "ar" ? "نمط الحياة" : "Lifestyle", path: "/lifestyle" },
      { name: TITLE[l], path: "/coffee-ratio-calculator" },
    ]),
  ];
  return (
    <>
      {jsonLd.map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}
      <Suspense>
        <CoffeeRatioClient locale={l} />
      </Suspense>
    </>
  );
}
