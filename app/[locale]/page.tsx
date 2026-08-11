import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { Locale } from "@/i18n";
import { locales } from "@/i18n";
import { CATEGORIES, FLAGSHIP_CALCULATORS } from "@/lib/calculatorRegistry";
import { getPopularCalculators } from "@/lib/trending";
import { buildMetadata, webApplicationJsonLd } from "@/lib/seo";
import SearchBox from "@/components/SearchBox";
import AdSlot from "@/components/ui/AdSlot";
import type { Metadata } from "next";

// Shortcut chips under the hero search — the seven calculators people land
// on most; a fixed editorial pick, not a data-driven ranking.
const SHORTCUT_SLUGS = [
  "gold-calculator",
  "salary-calculator",
  "fuel-cost-calculator",
  "v60-calculator",
  "loan-calculator",
  "zakat-calculator",
  "trip-budget-calculator",
];

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
  const title = l === "ar" ? "المِحساب — حاسبات يومية بسيطة وموثوقة" : "MIHSAB — Simple, trustworthy everyday calculators";
  const description =
    l === "ar"
      ? "منصة المِحساب تجمع أهم الحاسبات اليومية: الذهب، الراتب، العملات، الوقود، والمزيد — بالعربية والإنجليزية."
      : "MIHSAB brings together the everyday calculators you need: gold, salary, currency, fuel, and more — in Arabic and English.";
  return buildMetadata({ locale: l, path: "", title, description });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const t = await getTranslations({ locale: l, namespace: "home" });
  const brand = await getTranslations({ locale: l, namespace: "brand" });

  const jsonLd = webApplicationJsonLd({
    locale: l,
    name: brand("name"),
    description: brand("tagline"),
    path: "",
  });

  const popular = getPopularCalculators();
  const bySlug = new Map(FLAGSHIP_CALCULATORS.map((c) => [c.slug, c]));
  const shortcuts = SHORTCUT_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (c): c is (typeof FLAGSHIP_CALCULATORS)[number] => Boolean(c)
  );
  const whyItems = [1, 2, 3, 4, 5] as const;

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero: brand -> value proposition -> "what do you want to calculate?"
          -> search -> shortcut chips. Kept tight — the calculators are the
          product, not the hero. */}
      <section className="mx-auto max-w-4xl px-4 pb-10 pt-16 text-center sm:px-6 sm:pt-24">
        <h1 className="text-4xl font-bold tracking-tight text-text sm:text-5xl">{brand("name")}</h1>
        <p className="mt-2 text-lg text-text-muted">{brand("tagline")}</p>
        <p className="mt-1 text-base text-text-faint">{t("valueProposition")}</p>

        <h2 className="mt-8 text-lg font-semibold text-text">{t("searchHeading")}</h2>
        <div className="mt-4">
          <SearchBox locale={l} placeholder={t("searchPlaceholder")} variant="hero" />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {shortcuts.map((calc) => (
            <Link
              key={calc.slug}
              href={`/${l}/${calc.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-elevated px-3.5 py-1.5 text-sm text-text transition-colors hover:border-accent hover:text-accent"
            >
              <span>{calc.icon}</span>
              <span>{calc.name[l]}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h2 className="text-xl font-semibold text-text">{t("popularTitle")}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((calc) => (
            <Link
              key={calc.slug}
              href={`/${l}/${calc.slug}`}
              className="group flex flex-col gap-2 rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-5 transition-colors hover:border-accent hover:shadow-[var(--shadow-md)]"
            >
              <span className="text-3xl">{calc.icon}</span>
              <span className="font-semibold text-text group-hover:text-accent">{calc.name[l]}</span>
              <span className="text-sm text-text-muted">{calc.description[l]}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Ad slot: after hero/search/popular, before the rest of the page —
          never above the fold. */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <AdSlot variant="inline" label="Advertisement" />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h2 className="text-xl font-semibold text-text">{t("categoriesTitle")}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${l}/${cat.slug}`}
              className="rounded-[var(--radius-lg)] bg-bg-subtle p-5 transition-colors hover:bg-accent-soft"
            >
              <span className="font-semibold text-text">{cat.name[l]}</span>
              <p className="mt-1 text-sm text-text-muted">{cat.description[l]}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="text-xl font-semibold text-text">{t("whyLead")}</h2>
        <div className="mt-5 grid gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {whyItems.map((n) => (
            <div key={n}>
              <p className="font-semibold text-text">{t(`why${n}Title` as "why1Title")}</p>
              <p className="mt-1 text-sm text-text-muted">{t(`why${n}Body` as "why1Body")}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
