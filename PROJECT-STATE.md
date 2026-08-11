# Hesabi — Project State

_Last updated: 2026-08-11_

## What this is

Hesabi (حسابي) is a bilingual (Arabic RTL / English) consumer calculator
platform built with Next.js 14+ App Router, TypeScript, and Tailwind CSS v4.
This is the Phase 1 build: foundation + 8 flagship calculators.

## Stack

- Next.js (App Router, TypeScript, Turbopack)
- Tailwind CSS v4 (CSS-first theme config in `app/globals.css`)
- `next-intl` for i18n routing (`/ar`, `/en`), RTL via `dir` attribute
- `next/font` — Inter (Latin) + IBM Plex Sans Arabic (Arabic), tabular figures
- Vitest for pure-function calculator engine tests

## What's complete

- **i18n routing**: `/[locale]/...` with `ar` (default) and `en`, via
  `middleware.ts`→`proxy.ts` (Next 16 renamed convention) + `i18n.ts`.
  Locale switch preserves the current path.
- **Design system**: tokens in `app/globals.css` (`:root` + dark media
  query) and mirrored in `lib/design-tokens.ts`. Brand accent is a refined
  teal (`--color-accent`). Reusable components in `components/ui/`: Button,
  Input, Select, Card, ResultCard, Tabs, Breadcrumbs, Badge, Alert,
  FAQAccordion, ShareBar, AdSlot.
- **Calculator shell**: `components/calculator/CalculatorShell.tsx` — used
  by all 8 flagship calculators. Provides breadcrumb, H1, intro, form/result
  card, share bar, ad slot, how-it-works, FAQ, related calculators,
  disclaimer.
- **Homepage** (`app/[locale]/page.tsx`): hero + search box (routes to
  Money category for now), popular calculators grid, categories grid, "why
  Hesabi" section.
- **SEO**: `lib/seo.ts` — `generateMetadata` helper (title/description/
  canonical/hreflang/OG/Twitter) + JSON-LD builders (WebApplication,
  FAQPage, BreadcrumbList), wired into every calculator + home page.
- **8 flagship calculators**, each with a pure calculation engine + Vitest
  tests + a bilingual page using the shared shell + URL-state (query params
  reopen the same calculation via `useSearchParams`/`router.replace`):
  1. Gold Calculator (`/gold-calculator`) — karat purity, making charge,
     15% VAT (`lib/config/vat.ts`, ZATCA-cited), buy/sell modes.
  2. Salary Calculator (`/salary-calculator`) — basic + allowances −
     deductions → gross/net/annual, with a non-official-payroll disclaimer.
  3. Currency Converter (`/currency-converter`) — 16 currencies, static
     fallback rates (`lib/services/currencyService.ts`), swap button.
  4. Discount Calculator (`/discount-calculator`) — stacked/sequential
     discounts with per-step breakdown.
  5. Loan Calculator (`/loan-calculator`) — standard amortization, monthly
     payment, full schedule (first 12 rows shown), conventional-vs-Islamic
     financing note (framing only, not fabricated religious content).
  6. Fuel Cost Calculator (`/fuel-cost-calculator`) — indicative Saudi fuel
     prices (`lib/config/fuelPrices.ts`), trip/monthly/annual cost.
  7. V60 Coffee Calculator (`/v60-calculator`) — flagship design: presets,
     bloom water/time, 3-pour schedule, target brew time.
  8. Trip Budget Calculator (`/trip-budget-calculator`) — flights,
     accommodation, food, transport, activities, shopping, buffer %.
- **Category stub pages**: `/money`, `/cars`, `/lifestyle`, `/travel` list
  the flagship tools in that category plus "coming soon" cards (Zakat, VAT,
  Installment, Car Loan, Insurance Comparison, Maintenance Cost, Coffee
  Ratio, Recipe Scaling, Calories, Protein, Travel Fuel, Luggage, Time
  Zone) — see `lib/calculatorRegistry.ts`.
- **Service abstraction seams** (no live API keys used anywhere):
  `lib/services/goldService.ts` and `lib/services/currencyService.ts` both
  document the env var they'd need (`GOLD_PRICE_API_KEY`,
  `EXCHANGE_RATE_API_KEY`, see `.env.example`) and fall back to manual entry
  / static rates when unset. Never fabricates a live call.
- **Tests**: 37 Vitest tests across all 8 calculator engines
  (`lib/calculators/__tests__/`), covering normal, zero, negative, and
  invalid-input cases. All passing.
- **Quality bar**: `npm run build` succeeds, `npm run lint` is clean (0
  warnings/errors), `npm test` (Vitest) passes 37/37. Verified both `/ar`
  and `/en` render with the correct `dir` attribute via a local prod server
  smoke test (`next start` + curl against all routes).

## Known issues / gaps

- Homepage search box is a plain `<form>` that routes to `/money` — it does
  not yet do fuzzy matching across calculator names.
- No visual regression / screenshot testing was performed (no headless
  browser available in this environment) — verified via HTML output
  (`lang`/`dir` attributes) and route status codes only.
- No light/dark theme toggle UI — dark mode responds to
  `prefers-color-scheme` only (no manual override switch yet).
- `next.config.ts` intentionally has no custom `eslint` block; Next 16
  deprecated that config key.
- Middleware file is named `proxy.ts` per Next 16's renamed convention
  (still functions as locale-detection middleware).
- No manual QA on real mobile viewports; layouts use Tailwind responsive
  utilities but weren't visually screenshotted.

## Next-phase roadmap

1. **Remaining calculators** listed as "coming soon": Zakat, VAT,
   Installment, Car Loan, Insurance Comparison, Maintenance Cost, Coffee
   Ratio, Recipe Scaling, Calorie, Protein, Travel Fuel, Luggage, Time Zone.
2. **Live data integration**: wire `fetchLiveRates()` /
   `fetchLiveGoldPrice()` to a real provider once an API key is available;
   currently both are documented stubs that safely no-op.
3. **PWA**: manifest, service worker, offline calculator access.
4. **Ads**: replace `AdSlot` placeholder with a real network (keep the
   placement rules documented in the component).
5. **Accounts / saved calculations**: no auth or DB yet — would need a
   backend decision.
6. **AI layer**: none implemented; out of scope for this phase.
7. **Homepage search**: real fuzzy search/autocomplete across the full
   calculator registry (including "coming soon" items once built).
8. **Theme toggle**: explicit light/dark switch in the header (tokens
   already support it — see `app/globals.css`).
9. Consider visual QA (Playwright/screenshots) once a browser tool is
   available in the build environment.
