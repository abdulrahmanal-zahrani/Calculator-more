# المِحساب (MIHSAB) — Project State

_Last updated: 2026-08-11_

## Latest pass (this session) — Annual Bonus Calculator

Added a new calculator, **حاسبة البونص السنوي / Annual Bonus Calculator**,
at `/bonus-calculator` (category الفلوس/Money — 22nd calculator). Deliberately
does NOT assume "salary × bonus %": the model is Performance Rating →
company-specific Bonus Multiplier (via a matrix the employee defines) →
applied to a Target Bonus (% of salary / number-of-salaries / fixed amount)
→ optionally prorated for partial-year eligibility.

- **Engine** (`lib/calculators/bonus.ts`, `calculateBonus()`): resolves
  annual base salary (monthly-or-annual auto-convert), target bonus amount
  (3 methods), a performance multiplier from a rating→multiplier matrix
  (bracket/floor-to-nearest-defined-threshold-at-or-below by default, or
  linear interpolation between neighboring rows when enabled — the choice
  is documented in a code comment and surfaced in the UI's "كيف حسبناها؟"
  section), times optional secondary factors (company/department/extra,
  each defaulting to 100% i.e. no-op), times a proration factor
  (full year / months / custom %). Returns a structured breakdown
  (`annualBaseSalary`, `targetBonusAmount`, `performanceMultiplier`,
  `prorationFactor`, `estimatedBonus`, `totalAnnualCompensation`,
  `monthlyEquivalent`). Validates and throws on: negative salary, rating
  outside the selected scale, duplicate matrix rating thresholds, negative
  multipliers. `dedupeAndSortMatrix()` exported for UI-side dedup. All
  parsing goes through `lib/numeric.ts`; all rounding via the same
  round-to-2-decimals convention as `salary.ts`/`gold.ts`.
- **Tests** (`lib/calculators/__tests__/bonus.test.ts`, 12 tests, all
  passing): the 7 spec cases plus 4 validation edge cases plus a
  matrix-dedup unit test. Computed results: (1) 120,000 salary/15%
  target/rating 4-of-5 → 18,000 SAR exactly. (2) rating 4.2-of-5
  interpolated between 4→100%/5→150% → multiplier 1.10 exactly, bonus
  19,800 SAR exactly. (3) 10-point scale, rating 8/10 on a custom matrix
  → multiplier 1.0, bonus 10,000 SAR. (4) 100-point scale, rating 85/100
  → floor-bracket resolves to the 80-threshold row's 100% multiplier,
  bonus 10,000 SAR. (5) number-of-salaries: 10,000 monthly × 1.5 salaries
  × 100% → 15,000 SAR exactly. (6) partial year: 24,000 fixed target ×
  100% × 6/12 months → 12,000 SAR exactly. (7) Arabic numerals
  "١٢٠٠٠٠"/"٤٫٢" parse via `normalizeNumericInput` to 120000/4.2 and
  reproduce case 2's 19,800 SAR result.
- **UI** (`app/[locale]/bonus-calculator/{page.tsx,BonusCalculatorClient.tsx}`):
  simple mode by default (salary+period, rating-scale preset, rating,
  target-bonus method) using an automatic linear 2-point matrix
  (min→0%, max→100%, interpolated) so simple mode needs no matrix editing.
  Advanced mode is a collapsible `<details>` ("تفاصيل نظام شركتك", same
  pattern as V60's advanced options) containing: a custom-scale min/max
  toggle, an add/remove bonus-matrix row builder (seeded with an editable
  1→0%/2→50%/3→75%/4→100%/5→150%-equivalent example scaled to the chosen
  rating range) with a "use custom matrix" checkbox and interpolation
  toggle, optional company/department/extra factor inputs, and a
  full-year/months/custom-% proration selector. Result-first layout via
  `ResultCard` + breakdown `<dl>` + an expandable "كيف حسبناها؟" showing
  the substituted formula. Local preset save/load ("نظام شركتي") via a
  new `lib/bonusPresets.ts`, mirroring `lib/trending.ts`'s guarded
  `typeof window` + try/catch localStorage pattern — only the company's
  calculation structure (matrix, target method, factors, scale) persists,
  never the employee's salary or rating. Share via the existing
  `ShareBar`/`CalculatorShell` — `CalculatorShell` gained an optional
  `shareTitle` prop (defaults to the calculator name, as before) so this
  calculator can pass a custom top-line-numbers-only share summary
  without a company-identifying matrix. Scalar inputs (salary, period,
  rating scale, rating, target-bonus method/value) sync to the URL query
  string like the scalar-input calculators; the bonus matrix itself is
  kept in-memory-only, consistent with the existing documented gap for
  list-based calculator forms (Insurance/Maintenance/Recipe/Luggage).
- **Salary ↔ Bonus integration**: Salary calculator gained a "احسب
  البونص" link passing its computed annual gross salary as
  `?annualSalary=`; the bonus calculator reads that param on mount to
  prefill salary (annual mode) when no `salary` param is already present.
  Bonus calculator has a reciprocal "احسب راتبك" link back to
  `/salary-calculator`. No other change to the salary calculator's logic.
- **Registry/SEO/search**: added to `lib/calculatorRegistry.ts`
  (`bonus-calculator`, category `money`) and `lib/searchIndex.ts`
  (بونص/bonus/مكافأة/تقييم أداء/performance rating keywords) — related
  calculators and category-page listing are automatic via the existing
  registry-driven mechanisms (`CalculatorShell`'s same-category related
  links, `getCalculatorsByCategory`), no extra wiring needed. SEO via
  `buildMetadata`/`webApplicationJsonLd`/`breadcrumbJsonLd` in
  `lib/seo.ts`, matching every other calculator page exactly. No OG image
  variant added (matches the existing "15 of 21 calculators have no OG
  image" gap, not one of the 6 flagship OG calculators).
- **i18n**: per existing convention (confirmed by inspection —
  `messages/ar.json`/`messages/en.json` hold only site-wide nav/home
  strings; all 21 existing calculators keep their copy in a local `COPY`
  object inside their client component, not in the messages files), the
  bonus calculator's strings live in `BonusCalculatorClient.tsx`'s own
  `COPY` object, matching every other calculator rather than the literal
  (but not actually-followed-anywhere) messages-file convention described
  in the original brief.
- `npm run build`, `npm run lint`, `npm test` (111/111) all pass. Smoke
  tested `/ar/bonus-calculator` and `/en/bonus-calculator` via
  `next start` + curl: both return 200, `dir="rtl"`/`dir="ltr"` correct.

## Previous pass — V2 verification pass

Full verification sweep across the six areas named in the brief (calculator
correctness, SEO metadata, internal linking, performance, error/empty
states, accessibility). Every item checked out as already correct —
**nothing needed fixing this pass**:

1. **Calculator correctness**: Gold (`lib/calculators/gold.ts` +
   `GoldCalculatorClient.tsx`) supports 18/21/22/24K, weight, price/gram,
   making charge, VAT, buy/sell mode; manual price is plain user-controlled
   state, never silently overwritten (no live-data UI exists, correctly,
   since `goldService.ts` is a documented stub). Zakat's category chooser
   order is `gold → silver → cash → other` in both the UI buttons and the
   `useState` default (`ZakatCalculatorClient.tsx`), confirmed by reading
   the file. Salary GOSI legacy/new selector and V60/coffee live-editable
   solve-for (coffee/water/ratio) and fuel 91/95/98/diesel are all covered
   by passing Vitest suites (22 tests across salary/coffee/fuel engines)
   and their client components wire straight into those engines with no
   hardcoded shortcuts found.
2. **SEO metadata**: spot-checked 8 calculator `page.tsx` files (gold,
   salary, fuel, v60, zakat, vat, loan, trip-budget) — every `TITLE`/
   `DESCRIPTION` pair is unique and uses genuine Arabic search-intent
   phrasing (حاسبة الذهب، حاسبة الراتب، etc.), routed through the shared
   `buildMetadata`/`webApplicationJsonLd`/`breadcrumbJsonLd` helpers in
   `lib/seo.ts` for canonical URLs, OG tags, and JSON-LD. No duplicates
   found.
3. **Internal linking**: `CalculatorShell` auto-generates "related
   calculators" from same-category registry membership
   (`getCalculatorsByCategory`, excluding self) — no calculator has zero
   related links or a self-link. This produces sensible pairings for
   money/lifestyle categories (Gold→Zakat/Currency/Salary, Coffee→Recipe
   Scaling/Calorie/Protein) but is category-scoped, so one spec pairing
   (Fuel→Trip Budget) isn't automatic since Fuel is "cars" and Trip Budget
   is "travel" — a pre-existing, documented architectural choice (category-
   automatic linking), not a bug; noted for a future pass if cross-category
   pairings become a priority.
4. **Performance**: `npm run build` (Next 16 + Turbopack) still doesn't
   print per-route First Load JS (same tooling limitation noted in
   `V2-AUDIT.md` from the prior pass, re-verified). All 33 routes build
   successfully. `lib/numeric.ts` reviewed line-by-line: all regexes are
   bounded/simple (no nested quantifiers, no catastrophic-backtracking
   risk), minimal allocations, safe for per-keystroke use across ~20
   calculators. `AdSlot` is a static placeholder `<div>`, no scripts, no
   render-blocking. `next/font` with `display: swap` still correctly
   applied.
5. **Error/loading/empty states**: grepped all calculator client
   components for `Spinner`/`isLoading` — none found, confirming no local
   calculator fakes a loading state for instant client-side math.
   `normalizeNumericInput` returns `null` (never `NaN`) on empty/invalid
   input and calculators clamp with `Math.max(0, ... ?? 0)`, so blank/bad
   input renders a `0` result rather than crashing or showing "NaN"/
   "undefined".
6. **Accessibility**: label-association fix (`useId()` in `Input`/
   `Select`) from the prior pass is intact — verified no regression.

`npm run build`, `npm run lint`, `npm test` (99/99) all pass. No code
changes were made this pass beyond this file and `V2-AUDIT.md`.

## Previous pass — V2 production-refinement

Full audit written to `V2-AUDIT.md` (architecture, RTL/Arabic quality,
mobile UX, SEO, performance, ads, a11y, placeholder-content grep — all
evidence-based, no invented metrics). Six fixes implemented from the
audit's findings:

- **Homepage hero restructured**: brand → one-line value proposition →
  "وش تبي تحسب؟" heading → `SearchBox` (reused, not rebuilt) → seven
  shortcut chips linking straight to gold/salary/fuel/coffee/loan/
  zakat/trip calculators. Kept tight, no new components.
- **AI-marketing-speak grep**: zero matches for the listed phrases (and
  a broader pass beyond the listed set) across all copy — nothing to
  rewrite; the prior tanween-audit pass's copy already holds up.
- **"Why MIHSAB" section redesigned**: "كل شيء محسوب." lead-in + five
  short benefit labels (fast / clear / no signup / Arabic-first / clear
  sources) replacing the old 3-bullet generic-SaaS framing.
- **Ad placement fixed**: removed the site-wide top-of-`<main>` ad slot
  from `app/[locale]/layout.tsx` (it sat above the homepage fold). The
  homepage now places its one ad after hero/search/popular-calculators;
  calculator pages keep their existing two correctly-placed slots
  (in-content after result, lower-page after related calculators) in
  `CalculatorShell`, unchanged. `AdSlot` already reserved `min-height` —
  verified, no fix needed there.
- **Category taxonomy aligned to spec**: `lib/calculatorRegistry.ts`
  `CATEGORIES` renamed "المال" → "الفلوس" and "نمط الحياة" →
  "القهوة والأكل" (English: "Coffee & Food"); updated the same hardcoded
  strings across 26 calculator page/client files that had copy-pasted
  category breadcrumb text instead of reading the registry. Also
  relabeled the homepage "most used" claim ("الأكثر استخداماً") to
  "الأكثر طلباً" ("most requested") since the underlying list
  (`lib/trending.ts`) is an honest hardcoded editorial ordering, not
  measured usage data — the old label overclaimed.
- **Placeholder cleanup**: grepped the whole repo for
  `example.com`/`.example`/`lorem`/`test company`/`dummy`/fake emails —
  only the intentional, consistent `mihsab.example` placeholder domain
  and one already-documented TODO in `lib/trending.ts` remain; nothing
  else to fix.
- Caught and fixed a transient bug introduced by the category
  find-and-replace: `"المالي(ة)"` (financial) matched the `"المال"`
  substring and got corrupted to `"الفلوسي(ة)"` in
  `financialDisclaimer` copy (`messages/ar.json`,
  `lib/legalContent.ts`) — corrected back to `"المالية"`, verified with
  a follow-up grep.
- `npm run build`, `npm run lint`, `npm test` (99/99) all pass.

## Previous pass

- **Salary calculator — GOSI system selector**: added
  `lib/config/gosiRules.ts` with two named, dated config objects for
  Saudi GOSI social-insurance contribution rates — `GOSI_LEGACY_SYSTEM`
  (flat ~9% employee / ~9% employer annuities on basic+housing, capped
  at a wage ceiling) and `GOSI_NEW_SYSTEM` (the restructured system
  phased in gradually from July 2022 through 2024/2025, using ~11%
  employee / ~11.75% employer annuities as a full-phase-in reference
  point), both plus a 0.75%/0.75% SANED unemployment-insurance
  component. **These rates are example/reference figures compiled from
  public commentary, not a live GOSI feed** — the UI shows a prominent
  note ("تحقق من النسبة الحالية من موقع التأمينات الاجتماعية (GOSI)")
  and the config file docstring says the same; treat them as a
  reasonable starting point, not ground truth, and update
  `lib/config/gosiRules.ts` (a one-line change per rate) once real
  current figures are confirmed. `calculateSalary()` now takes
  `system: "new" | "legacy"` and `includeGosi: boolean`, computing
  employee/employer contributions capped at the wage ceiling; extended
  Vitest coverage for both systems plus the wage-ceiling cap. UI: kept
  the default form simple (basic/housing/other allowances/other
  deductions) and put the GOSI system selector + include-toggle inside
  a collapsible "إعدادات متقدمة" `<details>` section, matching the
  pattern already used on the V60 calculator's advanced options.
- **Scroll-reset investigation**: reviewed every `router.push`/
  `router.replace` call across calculator client components and
  `CalculatorShell` — all `{ scroll: false }` usages are query-string
  syncs for in-page input changes (correct, intentional), and no
  cross-page `<Link>` anywhere sets `scroll={false}` or otherwise
  fights Next.js's default scroll-to-top on navigation. No custom
  scroll-restoration logic exists. Conclusion: **there was no real
  scroll-reset bug** — default Next.js App Router behavior was already
  correct. The one real gap found was accessibility, not scroll: focus
  wasn't moved to the new page's heading for keyboard/screen-reader
  users on calculator-to-calculator navigation. Fixed by adding a ref +
  `useEffect` keyed on the calculator slug in `CalculatorShell` that
  focuses the `<h1 tabIndex={-1}>` on mount.
- **Arabic content audit**: normalized 72 instances across
  `messages/ar.json`, `lib/legalContent.ts`, and calculator client
  components where the tanween-fatha diacritic was Unicode-ordered
  before the trailing alef (`consonant + ً + ا`, e.g. "جدًا") instead
  of after it (`consonant + ا + ً`, e.g. "جداً") — the correct
  alef+tanween form. Read through calculator descriptions, "how it
  works" sections, FAQs, and disclaimers for generic AI-translated
  filler; the existing copy already reads naturally and concisely, so
  no substantive rewriting was done beyond the tanween fix — being
  honest that this item ended up smaller in scope than the other two.

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

## This pass: three targeted fixes

- **Coffee Ratio + V60 merged into one calculator** at `/v60-calculator`
  ("حاسبة القهوة / V60" / "Coffee / V60 Calculator") — the old
  `coffee-ratio-calculator` route is deleted and 308-redirected to
  `/v60-calculator` (and `/ar/...`, `/en/...`) via `redirects()` in
  `next.config.ts`. New engine `lib/calculators/coffeeRecipe.ts`
  (`calculateCoffeeRecipe`) replaces both `lib/calculators/v60.ts` and
  `lib/calculators/coffeeRatio.ts` (deleted), covering solve-for-water /
  solve-for-coffee / solve-for-ratio for any brew method (V60, French
  Press, AeroPress, Chemex, Cold Brew, Custom), each with its own default
  starting ratio — never locked, any of the three fields (coffee grams,
  water grams, ratio) is directly editable and live-recalculates the
  other two. Light/Balanced/Strong/Custom presets kept as starting values
  only. V60-specific grind/water-temp guidance, bloom water/time, and pour
  schedule kept in a collapsed `<details>` "خيارات متقدمة" / "Advanced
  options" section. `lib/calculatorRegistry.ts`, `lib/searchIndex.ts`, and
  the OG image route (`app/api/og/[slug]/route.tsx`) updated to the
  merged engine/copy; category/homepage listings are registry-driven so
  no other hardcoded references existed. Tests merged into
  `lib/calculators/__tests__/coffeeRecipe.test.ts` (old v60/coffeeRatio
  test files deleted, no coverage lost).
- **Zakat calculator IA fix**: `app/[locale]/zakat-calculator/ZakatCalculatorClient.tsx`
  now leads with a category chooser (ذهب / فضة / نقد / أصول أخرى — Gold
  and Silver first) that shows only the relevant input fields per
  category; liabilities and the nisab-basis toggle stay visible
  underneath since they apply across categories. The calculation engine
  (`lib/calculators/zakat.ts`) already fully supported gold, silver,
  cash, investments, inventory, and receivables with a proper silver
  nisab (595g) path — no engine changes were needed, this was purely an
  information-architecture reorder.
- **Fuel Cost Calculator**: added a third petrol octane option, 98, to
  `lib/config/fuelPrices.ts` (`gasoline98`, indicative example price,
  same disclaimer pattern as 91/95). The fuel-type `<Select>` in
  `FuelCalculatorClient.tsx` maps over `FUEL_LABELS` so it picked up the
  new option automatically; switching fuel type already reactively
  updates the price field and result (verified, no code change needed
  there).

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
