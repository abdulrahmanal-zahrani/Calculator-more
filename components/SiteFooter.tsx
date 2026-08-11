import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n";

export default async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border bg-bg-subtle">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="text-sm text-text-muted">{t("about")}</p>
        <p className="mt-4 text-xs text-text-faint">
          © {year} {locale === "ar" ? "حسابي" : "Hesabi"} — {t("rights")}
        </p>
      </div>
    </footer>
  );
}
