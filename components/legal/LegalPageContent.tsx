import Breadcrumbs from "@/components/ui/Breadcrumbs";
import type { Locale } from "@/i18n";

export interface LegalSection {
  heading: string;
  body: string[];
}

export default function LegalPageContent({
  locale,
  title,
  updated,
  homeLabel,
  sections,
}: {
  locale: Locale;
  title: string;
  updated: string;
  homeLabel: string;
  sections: LegalSection[];
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <Breadcrumbs items={[{ label: homeLabel, href: `/${locale}` }, { label: title }]} />
      <h1 className="mt-4 text-3xl font-bold text-text sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-text-faint">{updated}</p>
      <div className="mt-8 space-y-8">
        {sections.map((section, i) => (
          <section key={i}>
            <h2 className="text-lg font-semibold text-text">{section.heading}</h2>
            <div className="mt-2 space-y-3 text-sm leading-relaxed text-text-muted">
              {section.body.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
