import Card from "@/components/ui/Card";
import { getAffiliateLinks, type AffiliateCategory } from "@/lib/affiliate";
import type { Locale } from "@/i18n";

interface AffiliatePanelProps {
  category: AffiliateCategory;
  locale: Locale;
  title: string;
}

/**
 * Renders a "related products" panel for a given affiliate category. Since
 * no real partnerships exist yet (see lib/affiliate.ts), `getAffiliateLinks`
 * always returns an empty array today and this renders null — the panel is
 * wired up and ready, but shows nothing until real links are added.
 */
export default function AffiliatePanel({ category, locale, title }: AffiliatePanelProps) {
  const links = getAffiliateLinks(category);
  if (links.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-text">{title}</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <Card key={link.id} className="p-4">
            <a href={link.url} target="_blank" rel="noopener noreferrer sponsored" className="block">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-text">{link.title[locale]}</span>
                {link.sponsoredLabel && (
                  <span className="rounded-[var(--radius-sm)] bg-bg-subtle px-2 py-0.5 text-xs text-text-faint">
                    {link.sponsoredLabel[locale]}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-text-muted">{link.description[locale]}</p>
            </a>
          </Card>
        ))}
      </div>
    </section>
  );
}
