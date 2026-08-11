import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n";
import SearchBox from "@/components/SearchBox";
import Logo from "@/components/ui/Logo";

export default async function SiteHeader({
  locale,
  pathSuffix = "",
}: {
  locale: Locale;
  pathSuffix?: string;
}) {
  const t = await getTranslations({ locale, namespace: "nav" });
  const home = await getTranslations({ locale, namespace: "home" });
  const other = locale === "ar" ? "en" : "ar";

  const links: { href: string; label: string }[] = [
    { href: `/${locale}/money`, label: t("money") },
    { href: `/${locale}/cars`, label: t("cars") },
    { href: `/${locale}/lifestyle`, label: t("lifestyle") },
    { href: `/${locale}/travel`, label: t("travel") },
  ];

  return (
    <header className="border-b border-border bg-bg-elevated/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <Link href={`/${locale}`} className="flex items-center gap-2 text-lg font-bold text-text">
          <Logo size={32} />
          {locale === "ar" ? "المِحساب" : "MIHSAB"}
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-text-muted lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-accent">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden flex-1 sm:block sm:max-w-[220px] md:max-w-xs">
          <SearchBox locale={locale} placeholder={home("searchPlaceholder")} variant="header" />
        </div>
        <Link
          href={`/${other}${pathSuffix}`}
          className="rounded-[var(--radius-md)] border border-border px-3 py-1.5 text-sm font-medium text-text-muted hover:border-accent hover:text-accent"
        >
          {t("switchLocale")}
        </Link>
      </div>
    </header>
  );
}
