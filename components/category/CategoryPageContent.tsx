import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Badge from "@/components/ui/Badge";
import { CATEGORIES, COMING_SOON, getCalculatorsByCategory, type Category } from "@/lib/calculatorRegistry";

export default async function CategoryPageContent({ locale, category }: { locale: Locale; category: Category }) {
  const t = await getTranslations({ locale, namespace: "calculator" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const meta = CATEGORIES.find((c) => c.slug === category)!;
  const calculators = getCalculatorsByCategory(category);
  const comingSoon = COMING_SOON.filter((c) => c.category === category);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Breadcrumbs items={[{ label: nav("home"), href: `/${locale}` }, { label: meta.name[locale] }]} />
      <h1 className="mt-4 text-3xl font-bold text-text sm:text-4xl">{meta.name[locale]}</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-muted">{meta.description[locale]}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {calculators.map((calc) => (
          <Link
            key={calc.slug}
            href={`/${locale}/${calc.slug}`}
            className="flex flex-col gap-2 rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-5 hover:border-accent hover:shadow-[var(--shadow-md)]"
          >
            <span className="text-3xl">{calc.icon}</span>
            <span className="font-semibold text-text">{calc.name[locale]}</span>
            <span className="text-sm text-text-muted">{calc.description[locale]}</span>
          </Link>
        ))}

        {comingSoon.map((calc, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-[var(--radius-lg)] border border-dashed border-border bg-bg-subtle p-5 opacity-80"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-text">{calc.name[locale]}</span>
              <Badge tone="neutral">{t("comingSoon")}</Badge>
            </div>
            <span className="text-sm text-text-muted">{calc.description[locale]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
