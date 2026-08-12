# V2 Production-Refinement Audit — المِحساب (MIHSAB)

Date: 2026-08-11. Scope: architecture, routes, RTL/Arabic quality, mobile
UX, SEO/metadata, performance, ads, accessibility, error/empty states,
placeholder content. Evidence-based; numbers below are from actually
running `npm run build`, `npm run lint`, `npm test`, and repo greps —
nothing invented.

## What's already good

- **Architecture**: clean separation of pure calculation engines
  (`lib/calculators/*`) from UI (`CalculatorShell` + per-calculator
  client components). 21 calculators, 99 Vitest tests, all passing.
  Registry-driven (`lib/calculatorRegistry.ts`) category/homepage
  listings mean adding or relabeling a category doesn't require touching
  every page.
- **i18n**: `next-intl` routing with `/ar` and `/en`, `dir` set correctly
  per locale in `app/[locale]/layout.tsx`. No hardcoded `dir="ltr"`
  leaks found in a scan of calculator client components.
- **Accessibility**: per PROJECT-STATE.md, prior passes fixed
  `<label htmlFor>` wiring, contrast on `--color-text-faint`,
  `prefers-reduced-motion`, and focus-on-navigate. Spot-checked
  `FAQAccordion`/`ShareBar`/`Tabs` — native elements, `aria-expanded`
  present, no custom-role keyboard traps.
- **Ad placeholder component**: `components/ui/AdSlot.tsx` already
  reserves fixed `min-height` (`min-h-24` inline / `min-h-64` sidebar) —
  no CLS risk once real ad markup is swapped in.
- **Placeholder domain hygiene**: `mihsab.example` is used consistently
  in `lib/seo.ts`, footer contact email, and `.env.example` references —
  no inconsistent fake domains found across the repo.
- **No stray dev placeholders**: grep for `lorem`, `test company`,
  `dummy`, `test user` turned up nothing user-facing.

## Issues found and fixed this pass

1. **Top-of-layout ad above the fold on every page, including the
   homepage** (`app/[locale]/layout.tsx`, pre-fix: `<AdSlot>` rendered
   directly under `<SiteHeader>`, above `<main>`). This violated the
   intended priority order (hero → search → popular → ad) on the
   homepage specifically. **Fixed**: removed the site-wide top slot;
   homepage now places its one ad after the popular-calculators section
   (`app/[locale]/page.tsx`); calculator pages keep their two existing
   slots in `CalculatorShell` (in-content after the result, lower-page
   after related calculators) — both already correctly positioned and
   unaffected by this change.
2. **"Most used" label overclaimed real usage data.**
   `messages/ar.json` said "الحاسبات الأكثر استخداماً" ("most used") for
   a list that `lib/trending.ts` itself documents as a hardcoded
   editorial guess (with a TODO to replace it once real analytics
   exist). **Fixed**: relabeled to "الأكثر طلباً" / "Most requested" —
   honest about being curated, not measured.
3. **Homepage hero lacked a value proposition and lacked
   direct-to-calculator shortcuts.** Previously: brand name → tagline →
   search box, then straight into a full "popular calculators" grid.
   No one-line explanation of what the product does, and no compact way
   to jump straight to a specific calculator from the fold. **Fixed**:
   added a one-line value proposition, a "وش تبي تحسب؟" heading above
   the search box, and seven shortcut chips (gold, salary, fuel, coffee,
   loan, zakat, trip) linking straight to their calculators — kept to a
   single row, no new components.
4. **"Why MIHSAB" section read as a generic 3-bullet feature list**
   ("دقيق وموثوق" / "عربي أصلي" / "خصوصية أولاً") rather than the
   requested "everything's calculated" framing with concrete,
   short benefit labels. **Fixed**: replaced with a "كل شيء محسوب."
   lead-in and five short labeled bullets (fast / clear / no signup /
   Arabic-first / clear sources), matching the spec's suggested set.
5. **Category labels didn't match the requested homepage taxonomy.**
   `lib/calculatorRegistry.ts`'s `CATEGORIES` had `"المال"` (Money,
   formal) and `"نمط الحياة"` (Lifestyle) where the spec asked for
   `"الفلوس"` (colloquial money) and `"القهوة والأكل"` (Coffee/Food).
   **Fixed**: updated the registry's category names and every hardcoded
   breadcrumb/JSON-LD `category` string across calculator pages that
   had copy-pasted the same Arabic strings (rather than reading them
   from the registry) — 26 files. During this find-and-replace, `"مالي"`
   /`"مالية"` (financial) inside `financialDisclaimer` copy in
   `messages/ar.json` and `lib/legalContent.ts` was transiently
   corrupted to `"فلوسي(ة)"` by a substring match on `"المال"` and had
   to be corrected back to `"المالية"` — verified with a follow-up grep
   that no `"فلوسي"` string remains anywhere in the repo.

## No changes needed (verified, not found)

- **AI-marketing-speak grep** (`في عالم اليوم`, `مصمم لتبسيط`, `حلول
  ذكية`, `منصة متكاملة`, `تجربة سلسة`, `تمكين المستخدم`, `استكشف`,
  `استفد من`, and English equivalents `empowering`, `seamless
  experience`, `unlock`, `leverage`, `fast-paced world`, plus a broader
  pass for `اكتشف`/`استمتع`/`رحلتك`/`discover`/`journey`/`revolution`)
  found **zero matches** across `messages/ar.json`, `messages/en.json`,
  `app/`, `components/`, `lib/`. The prior tanween-audit pass's note
  that copy already reads naturally checks out.
- **Placeholder content grep** (`example.com`, `.example`, `lorem`,
  `test company`, `dummy`, fake emails, `TODO`/`FIXME`): only hit was
  the intentional `mihsab.example` placeholder domain (consistent
  everywhere it's used) and one honest, already-documented TODO in
  `lib/trending.ts` about swapping in real analytics later — not a
  leftover, a deliberate forward-reference.

## Not fixed / deferred (with reasoning)

- **Route size / bundle metrics**: this Next.js 16 + Turbopack build
  output does not print First Load JS sizes per route the way older
  Next versions did (`npm run build` output only lists routes and
  static/dynamic status — verified by running the build twice). No
  route-size numbers are reported here because none were actually
  measurable with the tooling available; claiming a number would be
  fabrication. All 21 calculator routes plus the homepage build and
  render correctly (verified via build success + `npm test`).
- **Render-blocking patterns**: no `<script>` tags outside the two
  intentional ones (JSON-LD, service-worker registration, both
  `dangerouslySetInnerHTML`/inline, non-blocking); fonts use
  `next/font` with `display: swap`. No further action needed.
- **List-based calculator forms without URL state** (Insurance
  Comparison, Maintenance Cost, Recipe Scaling, Luggage): already
  documented as a known, reasonable gap in PROJECT-STATE.md; out of
  scope for this pass's six named areas.

## Follow-up verification pass (2026-08-11, same date)

Ran the six-area verification brief (calculator correctness, SEO metadata,
internal linking, performance, error/empty states, accessibility) against
the fixes above. Every item verified as already meeting spec — see
`PROJECT-STATE.md`'s "Latest pass" section for the itemized checklist.
Nothing required a code fix. One pre-existing, non-blocking limitation
reconfirmed: `CalculatorShell`'s related-calculators list is same-category
only, so the specific cross-category pairing "Fuel → Trip Budget" isn't
automatic (Fuel is `cars`, Trip Budget is `travel`) — flagged for a future
pass, not fixed here since it's a deliberate existing architecture, not a
regression or crash.

## Prioritized fix list (status)

1. Move ad slot off the homepage above-the-fold — **done**.
2. Fix "most used" overclaim label — **done**.
3. Strengthen hero hierarchy + shortcut chips — **done**.
4. Redesign "Why MIHSAB" section — **done**.
5. Align category labels to spec taxonomy (الفلوس/القهوة والأكل) —
   **done**, including fixing the transient corruption it caused.
6. Placeholder/AI-copy cleanup — **verified clean, no changes needed**.
