import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n";
import { CATEGORIES } from "@/lib/calculatorRegistry";
import { LEGAL_PAGES } from "@/lib/legalContent";
import Logo from "@/components/ui/Logo";

export default async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const year = new Date().getFullYear();

  const legalLabelKey: Record<string, string> = {
    "privacy-policy": "privacyPolicy",
    "terms-of-use": "termsOfUse",
    disclaimer: "disclaimer",
    "financial-disclaimer": "financialDisclaimer",
    "health-disclaimer": "healthDisclaimer",
    "data-sources": "dataSources",
  };

  return (
    <footer className="mt-16 border-t border-border bg-bg-subtle">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm font-semibold text-text">{t("aboutTitle")}</p>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">{t("aboutBody")}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-text">{t("contactTitle")}</p>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              {t("contactBody")} <span className="text-accent">hello@mihsab.example</span>
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-text">{t("categoriesTitle")}</p>
            <ul className="mt-2 space-y-1.5">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/${locale}/${cat.slug}`} className="text-sm text-text-muted hover:text-accent">
                    {cat.name[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-text">{t("legalTitle")}</p>
            <ul className="mt-2 space-y-1.5">
              {LEGAL_PAGES.map((page) => (
                <li key={page.slug}>
                  <Link href={`/${locale}/${page.slug}`} className="text-sm text-text-muted hover:text-accent">
                    {t(legalLabelKey[page.slug])}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-8 flex items-center gap-2 text-xs text-text-faint">
          <Logo size={16} />© {year} {locale === "ar" ? "المِحساب" : "MIHSAB"} — {t("rights")}
        </p>
      </div>
    </footer>
  );
}
