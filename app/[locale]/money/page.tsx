import type { Metadata } from "next";
import type { Locale } from "@/i18n";
import { locales } from "@/i18n";
import { buildMetadata } from "@/lib/seo";
import { CATEGORIES } from "@/lib/calculatorRegistry";
import CategoryPageContent from "@/components/category/CategoryPageContent";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  const meta = CATEGORIES.find((c) => c.slug === "money")!;
  return buildMetadata({
    locale: l,
    path: "/money",
    title: meta.name[l],
    description: meta.description[l],
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <CategoryPageContent locale={locale as Locale} category="money" />;
}
