# Hesabi — Project State

_Last updated: 2026-08-11_

## What this is

Hesabi (حسابي) is a bilingual (Arabic RTL / English) consumer calculator
platform built with Next.js 14+ App Router, TypeScript, and Tailwind CSS v4.
Phases 1–5 (foundation, all 21 calculators, PWA/sharing basics, search/
legal/analytics scaffolding, and an audit pass) are complete.

## Stack

- Next.js (App Router, TypeScript, Turbopack)
- Tailwind CSS v4 (CSS-first theme config in `app/globals.css`)
- `next-intl` for i18n routing (`/ar`, `/en`), RTL via `dir` attribute
- `next/font` — Inter (Latin) + IBM Plex Sans Arabic (Arabic), tabular figures
- Vitest for pure-function calculator engine tests

## What's complete

- **i18n routing, design system, calculator shell, homepage, SEO** — see
  git history / Phase 1 for detail; unchanged in shape, just reused.
- **21 calculators**, each with a pure calculation engine + Vitest tests +
  a bilingual page using the shared shell + URL-state where relevant:
  - Money: Gold, Salary, Currency, Discount, Loan, **Zakat, VAT,
    Installment**.
  - Cars: Fuel Cost, **Car Loan, Insurance Comparison, Maintenance Cost**.
  - Lifestyle: V60 Coffee, **Coffee Ratio, Recipe Scaling, Calorie,
    Protein**.
  - Travel: Trip Budget, **Travel Fuel, Luggage, Time Zone**.
  - (Bold = added in Phase 2.) Zakat is explicit that it's a general
    estimate, not a fatwa; Calorie/Protein carry a "not medical advice"
    note; VAT cites ZATCA's 15% rate from the existing `lib/config/vat.ts`.
  - Category pages (`/money`, `/cars`, `/lifestyle`, `/travel`) now link to
    all 21 live calculators — `COMING_SOON` in `lib/calculatorRegistry.ts`
    is empty (kept, typed, for future additions).
  - Related-calculator links (via `CalculatorShell`) are automatic within
    each category, giving the topical clusters called for in the brief
    (Gold/Zakat live in Money together; Fuel/Car Loan/Maintenance in Cars;
    Travel Fuel/Luggage/Time Zone/Trip Budget in Travel; Coffee Ratio/V60/
    Recipe Scaling in Lifestyle).
- **Tests**: 78 Vitest tests across 21 calculator engines, covering normal,
  zero, negative, and invalid-input cases. All passing.
- **Search**: `lib/calculatorRegistry.ts` + `lib/searchIndex.ts` (bilingual
  keyword synonyms, e.g. "ذهب" → Gold/Zakat, "سيارة" → Fuel/Car
  Loan/Maintenance) feed `lib/search.ts`, a client-side substring/token
  fuzzy matcher. `components/SearchBox.tsx` is wired into both the header
  (compact) and the homepage hero (full), with a live dropdown.
- **Trending/Popular**: `lib/trending.ts` — a hardcoded, clearly-commented
  initial "popular" ordering (`POPULAR_SLUGS`, with a `TODO` to replace it
  with a real usage-ranked list once analytics exist) plus a
  localStorage-backed "recently used" list recorded from
  `CalculatorShell` on every calculator view. No fake backend.
- **Analytics scaffolding**: `lib/analytics.ts` exports `trackEvent`, a
  no-op-by-default abstraction (console.debug only in dev) called from
  calculator view, share, and copy-link interaction points. Documented as
  a one-line change to wire a real provider (Plausible/Umami/GA4) later —
  no keys are available, so nothing live is faked.
- **PWA**: `app/manifest.ts` (Next's typed manifest route), two brand-mark
  SVG icons (`public/icon-192.svg`, `public/icon-512.svg`, teal "H"
  mark), `viewport.themeColor`, and a hand-rolled minimal service worker
  (`public/sw.js`, cache-first for static assets only — JS/CSS/SVG/PNG/
  fonts — not HTML navigations, to avoid serving stale pages after a
  deploy). Registered from `app/[locale]/layout.tsx`. Since every
  calculator already uses manual-entry/static fallback data (no live
  fetches), this is sufficient for offline calculator use once visited.
- **Legal pages**: Privacy Policy, Terms of Use, General Disclaimer,
  Financial Disclaimer, Health Disclaimer, and Data Sources — real,
  non-fabricated boilerplate in both locales (`lib/legalContent.ts` +
  `components/legal/LegalPageContent.tsx`), linked from a rebuilt
  `SiteFooter` (About, Contact, Categories, Legal columns).
- **Service abstraction seams** (no live API keys used anywhere):
  `lib/services/goldService.ts` and `lib/services/currencyService.ts`
  document the env var they'd need, unchanged from Phase 1.
- **Quality bar**: `npm run build` succeeds with no warnings, `npm run
  lint` is clean (0 errors/warnings), `npm test` (Vitest) passes 78/78.
  Smoke-tested via `next start` + curl across `/ar` and `/en` calculator,
  legal, manifest, and service-worker routes — all 200.

## Known issues / gaps (deferred, real future phases)

- **Shareable OG images**: not implemented. The brief allowed a simpler
  printable/exportable summary as a fallback, but even that was deferred
  in favor of finishing search/legal/PWA within this session — a genuine
  gap versus the brief's Phase 3 ask. A `next/og` `ImageResponse` route at
  `/api/og/[calculator]` reading result values from query params remains
  the recommended approach; no new dependency needed.
- **Live data integration**: `fetchLiveRates()` / `fetchLiveGoldPrice()`
  remain documented no-op stubs — needs a real provider + API key.
- **Real analytics/ads provider wiring**: `lib/analytics.ts` and `AdSlot`
  are both structured for a one-line swap-in but nothing live is
  connected (no keys available).
- **Accounts / saved calculations**: no auth or DB — needs a backend
  decision.
- **AI layer**: none implemented; out of scope for this phase.
- **GCC-market currency/locale expansion**: only `ar`/`en` locales and
  SAR-centric defaults exist; expanding to other Gulf markets/currencies
  as first-class locales is future work.
- **Theme toggle**: still no explicit light/dark switch in the header;
  dark mode responds to `prefers-color-scheme` only.
- **List-based calculator forms** (Insurance Comparison, Maintenance
  Cost, Recipe Scaling, Luggage) use in-memory add/remove state without
  URL-based share state, unlike the scalar-input calculators — a
  reasonable but real deviation from the flagship calculators' full
  URL-state pattern, made to keep Phase 2 scope tractable.
- No visual regression / screenshot testing (no headless browser
  available in this environment) — verified via HTTP status codes,
  `lang`/`dir` attributes, and manual code review of RTL/LTR usage only.
- Accessibility: form inputs use the shared `Input`/`Select` components
  which render proper `<label htmlFor>` associations, and Tailwind's
  default focus rings are relied on for focus visibility — no dedicated
  contrast audit tool was run in this environment.
