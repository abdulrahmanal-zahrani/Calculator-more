import { FLAGSHIP_CALCULATORS, type CalculatorMeta } from "@/lib/calculatorRegistry";
import { SEARCH_KEYWORDS } from "@/lib/searchIndex";
import type { Locale } from "@/i18n";

/**
 * Simple client-side fuzzy search over the static calculator registry.
 * Matches against name, description, and bilingual keyword synonyms in
 * both locales at once (so an Arabic query can surface an English-named
 * result and vice versa), using substring + light token-overlap scoring.
 */
export function searchCalculators(query: string, locale: Locale, limit = 8): CalculatorMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const scored = FLAGSHIP_CALCULATORS.map((calc) => {
    const haystack = [
      calc.name.ar,
      calc.name.en,
      calc.description.ar,
      calc.description.en,
      ...(SEARCH_KEYWORDS[calc.slug] ?? []),
    ]
      .join(" ")
      .toLowerCase();

    let score = 0;
    if (calc.name[locale].toLowerCase().startsWith(q)) score += 10;
    if (calc.name[locale].toLowerCase().includes(q)) score += 5;
    if (haystack.includes(q)) score += 3;
    // token overlap: any query word found anywhere in the haystack
    const tokens = q.split(/\s+/).filter(Boolean);
    score += tokens.filter((tok) => haystack.includes(tok)).length;

    return { calc, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.calc);
}
