# المِحساب (MIHSAB) — Project State

_Last updated: 2026-08-11_

## What this is

المِحساب / MIHSAB is a bilingual (Arabic RTL / English) consumer calculator
platform built with Next.js 14+ App Router, TypeScript, and Tailwind CSS v4.
Phases 1–6 are complete: foundation, all 21 calculators, PWA/sharing,
search/legal/analytics scaffolding, shareable OG images, ads/affiliate
architecture, and a full production-readiness audit.

## Stack

- Next.js 16 (App Router, TypeScript, Turbopack)
- Tailwind CSS v4 (CSS-first theme config in `app/globals.css`)
- `next-intl` for i18n routing (`/ar`, `/en`), RTL via `dir` attribute
- `next/font` — Inter (Latin) + IBM Plex Sans Arabic (Arabic), `display: swap`
- Vitest for pure-function calculator engine tests

## What's complete

- **21 calculators**, each a pure calculation engine (`lib/calculators/*`) +
  Vitest tests + a bilingual page on the shared `CalculatorShell`, with
  URL-state on the scalar-input calculators. Categories: Money (Gold,
  Salary, Currency, Discount, Loan, Zakat, VAT, Installment), Cars (Fuel
  Cost, Car Loan, Insurance Comparison, Maintenance Cost), Lifestyle (V60,
  Coffee Ratio, Recipe Scaling, Calorie, Protein), Travel (Trip Budget,
  Travel Fuel, Luggage, Time Zone). Related-calculator links are automatic
  within each category via `CalculatorShell`.
- **Tests**: 78 Vitest tests across 21 calculator engines. All passing.
- **Search**: `lib/calculatorRegistry.ts` + `lib/searchIndex.ts` feed
  `lib/search.ts` (client-side fuzzy matcher), wired into `SearchBox`.
- **Trending/Popular**: `lib/trending.ts` — hardcoded initial ordering plus
  localStorage-backed "recently used", recorded from `CalculatorShell`.
- **Analytics scaffolding**: `lib/analytics.ts` exports a no-op-by-default
  `trackEvent`, called from view/share/copy-link points. One-line swap for
  a real provider later — no keys available, nothing live is faked.
- **PWA**: `app/manifest.ts`, brand-mark SVG icons, `viewport.themeColor`,
  a minimal cache-first service worker (`public/sw.js`, static assets only).
- **Legal pages**: Privacy Policy, Terms of Use, General/Financial/Health
  Disclaimers, Data Sources — real boilerplate in both locales.
- **Shareable OG images** (`app/api/og/[slug]/route.tsx`, Node.js runtime,
  `next/og` `ImageResponse`): reads the calculator's existing query-param
  state, re-runs its pure `lib/calculators/*` engine, and renders a
  1200×630 branded card (teal gradient, "H" wordmark, primary result, 3
  breakdown values). Wired into `generateMetadata`'s `openGraph.images` /
  `twitter.images` for the 6 highest-share calculators: Gold, V60, Trip
  Budget, Fuel Cost, Discount, Salary — each page passes its default input
  values as `ogImageQuery` in `buildMetadata` (`lib/seo.ts`). Numbers in
  the image render with plain ASCII digits/currency codes (not
  locale-shaped) since satori has no bundled Arabic-shaping font at
  request time — a deliberate, documented compromise, not a bug. Extending
  to more calculators is a `switch` case in `buildData()` plus a
  `generateMetadata` one-liner; no new dependency needed.
- **Ads architecture**: `components/ui/AdSlot.tsx` (placeholder box,
  reserved layout height, "Advertisement" label — swap for a real network
  snippet later). Placement, enforced and commented at each call site:
  one top banner in `app/[locale]/layout.tsx` (site-wide, above `<main>`,
  never inside a calculator's form), one in-content slot in
  `CalculatorShell` right after the result/share bar (never above the
  result, never inside inputs), one lower-page slot after related
  calculators and before the disclaimer. That's 2 slots on non-calculator
  pages and 3 on calculator pages total — no stacking, mobile-reasonable.
- **Affiliate seam**: `lib/affiliate.ts` exports a typed `AffiliateLink`
  shape and `getAffiliateLinks(category)`, currently returning an empty
  array for every category (`gold`/`coffee`/`travel`/`cars`) — no real
  merchant URLs exist, so nothing is faked. `components/ui/AffiliatePanel.tsx`
  is the render seam: it calls `getAffiliateLinks` and renders `null` when
  empty. Demonstrated on the Gold calculator page (renders nothing today).
  To activate: add real `AffiliateLink` entries to the relevant category
  array in `lib/affiliate.ts` once a partnership exists — no other code
  changes needed.
- **Seasonal pages (architecture, not built)**: no seasonal landing pages
  exist and none were added speculatively. When a real one is needed (e.g.
  a Ramadan/Eid Zakat reminder or a Hajj/Umrah travel-budget page), the
  pattern is: (1) add a route under `app/[locale]/<seasonal-slug>/` with a
  `page.tsx` following the existing calculator `page.tsx` shape
  (`generateStaticParams`, `generateMetadata` via `lib/seo.ts`, JSON-LD);
  (2) reuse `CalculatorShell` + an existing or lightly-adapted calculator
  engine (Zakat/Trip Budget already fit) rather than inventing new UI; (3)
  add a `CalculatorMeta`-shaped entry to `lib/calculatorRegistry.ts` if it
  should appear in search/category listings, or leave it registry-less as
  a pure landing page if it shouldn't. No new architecture required.
- **Formatting**: `lib/format.ts` — `formatCurrency`, `formatNumber`, and
  `formatPercent` (added this pass), all via `Intl.NumberFormat` with
  `ar-SA`/`en-US` locales. Audited every calculator page for raw
  `toFixed`/manual `%` concatenation; found and fixed one instance
  (Discount calculator's effective-discount display) — everything else
  already went through `lib/format.ts`.
- **Accessibility fixes this pass**:
  - `components/ui/Input.tsx` and `components/ui/Select.tsx` had a real
    `<label htmlFor>` bug: every call site passes `label` but no `id`, so
    `htmlFor` was always `undefined` — labels rendered but weren't
    programmatically associated with their control. Fixed by generating a
    stable id via `useId()` when none is passed; every input field across
    all 21 calculators now has a correctly wired label.
  - `--color-text-faint` failed WCAG AA (≈3.16:1 light, ≈4.15:1 dark
    against common backgrounds). Adjusted to `#726b5a` (light) /
    `#93897a` (dark) — now ≥4.5:1 against `bg`/`bg-elevated` in both
    modes; every other text token already passed.
  - Added a global `@media (prefers-reduced-motion: reduce)` guard in
    `app/globals.css` neutralizing all animation/transition durations
    site-wide, rather than relying on each component to opt in.
  - Interactive elements audited: `Tabs`, `FAQAccordion` (proper
    `aria-expanded`), `ShareBar` (`aria-label`s on icon links) all use
    native `<button>`/`<a>` — keyboard-operable by default, no custom
    roles needed.
- **Quality bar**: `npm run build`, `npm run lint`, and `npm test` (78/78)
  all pass cleanly. Smoke-tested the OG route and a calculator page via
  `next start` + curl (200s, correct `image/png`).

## Architectural seams ready for later (not fake, not built further)

- **Ads**: `AdSlot` + placement rules are final; only a real ad network
  script needs to be dropped into the component.
- **Affiliate**: `lib/affiliate.ts` + `AffiliatePanel` are final; only real
  `AffiliateLink` entries need to be added per category.
- **Seasonal pages**: pattern documented above; no page exists yet.
- **Live data**: `lib/services/goldService.ts` /
  `lib/services/currencyService.ts` document the env var each needs
  (`GOLD_PRICE_API_KEY`, `EXCHANGE_RATE_API_KEY`) and remain no-op stubs.
- **Analytics**: `lib/analytics.ts` is a one-line swap for a real provider
  (Plausible/Umami/GA4) once an account exists.
- **`.env.example`**: verified against every `process.env.*` reference in
  the codebase (`NEXT_PUBLIC_SITE_URL`, `EXCHANGE_RATE_API_KEY`,
  `GOLD_PRICE_API_KEY`) — nothing undocumented.

## Known gaps (genuinely deferred future work)

- **Live data integration**: no real API keys available in this
  environment — `fetchLiveRates()` / `fetchLiveGoldPrice()` stay stubs
  until a provider is chosen and a key is supplied.
- **Real ad network / affiliate accounts**: none available; seams only.
- **Real analytics provider account**: none connected; scaffold only.
- **Accounts / saved calculations**: no auth or DB — needs a backend
  decision (out of scope for a static-first calculator platform so far).
- **AI layer**: none implemented; out of scope for this phase.
- **GCC-market currency/locale expansion**: only `ar`/`en` locales and
  SAR-centric defaults exist; other Gulf markets/currencies as
  first-class locales is future work.
- **Native mobile app**: PWA only; no React Native/native wrapper.
- **Theme toggle**: still no explicit light/dark switch in the header;
  dark mode responds to `prefers-color-scheme` only.
- **List-based calculator forms** (Insurance Comparison, Maintenance
  Cost, Recipe Scaling, Luggage) use in-memory add/remove state without
  URL-based share state, unlike the scalar-input calculators — kept from
  Phase 2, a reasonable but real deviation from the flagship pattern.
- **OG images beyond the 6 flagship calculators**: the other 15
  calculators fall back to the default (image-less) OG/Twitter card.
  Extending is mechanical (see "Shareable OG images" above) but wasn't
  done for all 21 to keep this pass scoped to the brief's named list.
- **OG image text shaping**: Arabic labels in the OG image render via
  satori's default font rather than a bundled Arabic-shaping font (see
  above) — numbers/currency are ASCII, which stays legible either way,
  but this is a known simplification, not a full RTL-typeset image.
- No visual regression / screenshot testing (no headless browser in this
  environment) — verified via HTTP status codes, curl'd OG images,
  `lang`/`dir` attributes, computed WCAG contrast ratios, and manual code
  review.

## Rebrand: Hesabi → المِحساب (MIHSAB)

Full brand rename is complete: all copy (messages/*.json, `lib/seo.ts`,
`lib/design-tokens.ts`, `lib/legalContent.ts`, footer/header, manifest, OG
route, homepage metadata/JSON-LD), the `package.json` name, the
`.env.example` placeholder domain (`mihsab.example`), and the contact email
placeholder now read المِحساب / MIHSAB, with the tagline "احسبها... صح." /
"Calculate it right." The old plain "H"-in-a-box placeholder logo was
replaced with an original mark in `components/ui/Logo.tsx`: a single
geometric stroke abstracting the bowl-and-tail shape of the Arabic letter ح
that resolves into a checkmark tick, read as both "a deliberate, precise
calculation" and "a correct result." It's used in the header, a small
16px mark in the footer, and regenerated into `public/icon-192.svg` /
`icon-512.svg` at matching proportions; the OG image route keeps a simple
"M" letter-mark (satori-safe) rather than the full SVG path.
