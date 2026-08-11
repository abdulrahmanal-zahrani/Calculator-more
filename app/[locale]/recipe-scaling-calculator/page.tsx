import type { Metadata } from "next";
import { Suspense } from "react";
import type { Locale } from "@/i18n";
import { locales } from "@/i18n";
import { buildMetadata, webApplicationJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import RecipeScalingClient from "./RecipeScalingClient";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const TITLE = { ar: "حاسبة تحجيم الوصفات", en: "Recipe Scaling Calculator" };
const DESCRIPTION = {
  ar: "كبّر أو صغّر أي وصفة حسب عدد الحصص المطلوبة.",
  en: "Scale any recipe up or down to the number of servings you need.",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  return buildMetadata({ locale: l, path: "/recipe-scaling-calculator", title: TITLE[l], description: DESCRIPTION[l] });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const jsonLd = [
    webApplicationJsonLd({ locale: l, name: TITLE[l], description: DESCRIPTION[l], path: "/recipe-scaling-calculator" }),
    breadcrumbJsonLd(l, [
      { name: l === "ar" ? "الرئيسية" : "Home", path: "" },
      { name: l === "ar" ? "نمط الحياة" : "Lifestyle", path: "/lifestyle" },
      { name: TITLE[l], path: "/recipe-scaling-calculator" },
    ]),
  ];
  return (
    <>
      {jsonLd.map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}
      <Suspense>
        <RecipeScalingClient locale={l} />
      </Suspense>
    </>
  );
}
