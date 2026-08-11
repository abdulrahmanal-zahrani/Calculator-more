"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { searchCalculators } from "@/lib/search";
import { trackEvent } from "@/lib/analytics";
import type { Locale } from "@/i18n";

export default function SearchBox({
  locale,
  placeholder,
  variant = "hero",
}: {
  locale: Locale;
  placeholder: string;
  variant?: "hero" | "header";
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const results = searchCalculators(query, locale, variant === "header" ? 6 : 8);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function go(slug: string) {
    trackEvent("search_result_click", { calculatorSlug: slug, locale, query });
    setOpen(false);
    setQuery("");
    router.push(`/${locale}/${slug}`);
  }

  return (
    <div ref={containerRef} className={`relative ${variant === "hero" ? "mx-auto w-full max-w-xl" : "w-full max-w-xs"}`}>
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          if (e.target.value.trim()) trackEvent("search_query", { locale, query: e.target.value });
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className={
          variant === "hero"
            ? "w-full rounded-[var(--radius-lg)] border border-border bg-bg-elevated px-5 py-3.5 text-base text-text shadow-[var(--shadow-sm)] outline-none focus:border-accent"
            : "w-full rounded-[var(--radius-md)] border border-border bg-bg-elevated px-3.5 py-2 text-sm text-text outline-none focus:border-accent"
        }
      />
      {open && query.trim() && (
        <div className="absolute start-0 end-0 top-full z-20 mt-2 max-h-80 overflow-y-auto rounded-[var(--radius-md)] border border-border bg-bg-elevated shadow-[var(--shadow-md)]">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-text-faint">
              {locale === "ar" ? "لا توجد نتائج" : "No results found"}
            </p>
          ) : (
            results.map((r) => (
              <button
                key={r.slug}
                type="button"
                onClick={() => go(r.slug)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-start hover:bg-bg-subtle"
              >
                <span className="text-xl">{r.icon}</span>
                <span className="flex flex-col">
                  <span className="text-sm font-medium text-text">{r.name[locale]}</span>
                  <span className="text-xs text-text-faint">{r.description[locale]}</span>
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
