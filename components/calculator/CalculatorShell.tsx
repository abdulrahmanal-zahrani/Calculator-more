"use client";

import { ReactNode, useEffect } from "react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Alert from "@/components/ui/Alert";
import FAQAccordion, { FAQItem } from "@/components/ui/FAQAccordion";
import ShareBar from "@/components/ui/ShareBar";
import AdSlot from "@/components/ui/AdSlot";
import Card from "@/components/ui/Card";
import { CalculatorMeta, getCalculatorsByCategory } from "@/lib/calculatorRegistry";
import { recordRecentlyUsed } from "@/lib/trending";
import { trackEvent } from "@/lib/analytics";
import type { Locale } from "@/i18n";
import Link from "next/link";

interface CalculatorShellProps {
  locale: Locale;
  meta: CalculatorMeta;
  intro: string;
  breadcrumbLabels: { home: string; category: string };
  calculatorForm: ReactNode;
  result: ReactNode;
  howItWorks: ReactNode;
  faq: FAQItem[];
  disclaimer: string;
  shareUrl: string;
  t: { calculate: string; howItWorks: string; faq: string; related: string; disclaimer: string; share: string; copyLink: string; copied: string };
}

export default function CalculatorShell({
  locale,
  meta,
  intro,
  breadcrumbLabels,
  calculatorForm,
  result,
  howItWorks,
  faq,
  disclaimer,
  shareUrl,
  t,
}: CalculatorShellProps) {
  const related = getCalculatorsByCategory(meta.category).filter((c) => c.slug !== meta.slug);

  useEffect(() => {
    recordRecentlyUsed(meta.slug);
    trackEvent("calculator_view", { calculatorSlug: meta.slug, locale });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.slug]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Breadcrumbs
        items={[
          { label: breadcrumbLabels.home, href: `/${locale}` },
          { label: breadcrumbLabels.category, href: `/${locale}/${meta.category}` },
          { label: meta.name[locale] },
        ]}
      />

      <h1 className="mt-4 text-3xl font-bold text-text sm:text-4xl">
        <span className="me-2">{meta.icon}</span>
        {meta.name[locale]}
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-muted">{intro}</p>

      <Card className="mt-8 p-5 sm:p-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-4">{calculatorForm}</div>
          <div className="flex flex-col gap-4">{result}</div>
        </div>
      </Card>

      <div className="mt-6">
        <ShareBar
          url={shareUrl}
          title={meta.name[locale]}
          shareLabel={t.share}
          copyLabel={t.copyLink}
          copiedLabel={t.copied}
        />
      </div>

      <div className="mt-10">
        <AdSlot variant="inline" label="Advertisement" />
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-text">{t.howItWorks}</h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-text-muted">{howItWorks}</div>
      </section>

      {faq.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-text">{t.faq}</h2>
          <div className="mt-3">
            <FAQAccordion items={faq} />
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-text">{t.related}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/${locale}/${r.slug}`}
                className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-bg-elevated p-4 hover:border-accent"
              >
                <span className="text-2xl">{r.icon}</span>
                <span className="font-medium text-text">{r.name[locale]}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <Alert title={t.disclaimer}>{disclaimer}</Alert>
      </section>
    </div>
  );
}
