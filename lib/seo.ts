import type { Metadata } from "next";
import type { Locale } from "@/i18n";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hesabi.example";
const SITE_NAME = { ar: "حسابي", en: "Hesabi" };

export function buildMetadata({
  locale,
  path,
  title,
  description,
  ogImageQuery,
}: {
  locale: Locale;
  path: string; // e.g. "/gold-calculator", "" for home
  title: string;
  description: string;
  /**
   * Query string (without leading "?") of extra params to forward to the
   * `/api/og/[slug]` route, e.g. "weight=10&karat=21". Pass the calculator's
   * slug-derived route segment (path without the leading "/") as the OG
   * route's [slug]; omit to fall back to the default OG/Twitter card (no
   * generated image).
   */
  ogImageQuery?: string;
}): Metadata {
  const canonical = `${SITE_URL}/${locale}${path}`;
  const arUrl = `${SITE_URL}/ar${path}`;
  const enUrl = `${SITE_URL}/en${path}`;

  const ogImage = ogImageQuery
    ? [{ url: `${SITE_URL}/api/og${path}?locale=${locale}&${ogImageQuery}`, width: 1200, height: 630, alt: title }]
    : undefined;

  return {
    title: `${title} | ${SITE_NAME[locale]}`,
    description,
    alternates: {
      canonical,
      languages: { ar: arUrl, en: enUrl },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME[locale],
      locale: locale === "ar" ? "ar_SA" : "en_US",
      type: "website",
      ...(ogImage ? { images: ogImage } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: ogImage.map((i) => i.url) } : {}),
    },
  };
}

export function webApplicationJsonLd({
  locale,
  name,
  description,
  path,
}: {
  locale: Locale;
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: `${SITE_URL}/${locale}${path}`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web",
    inLanguage: locale === "ar" ? "ar" : "en",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function breadcrumbJsonLd(
  locale: Locale,
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}/${locale}${item.path}`,
    })),
  };
}
