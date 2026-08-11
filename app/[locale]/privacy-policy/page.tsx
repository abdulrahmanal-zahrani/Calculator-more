import type { Metadata } from "next";
import type { Locale } from "@/i18n";
import { locales } from "@/i18n";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { LEGAL_PAGES, LEGAL_UPDATED } from "@/lib/legalContent";
import LegalPageContent from "@/components/legal/LegalPageContent";

const DATA = LEGAL_PAGES.find((p) => p.slug === "privacy-policy")!;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  return buildMetadata({ locale: l, path: "/privacy-policy", title: DATA.title[l], description: DATA.description[l] });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const nav = await getTranslations({ locale: l, namespace: "nav" });
  return (
    <LegalPageContent
      locale={l}
      title={DATA.title[l]}
      updated={l === "ar" ? `آخر تحديث: ${LEGAL_UPDATED}` : `Last updated: ${LEGAL_UPDATED}`}
      homeLabel={nav("home")}
      sections={DATA.sections[l]}
    />
  );
}
