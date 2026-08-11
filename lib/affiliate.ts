/**
 * Affiliate-link seam.
 *
 * No real affiliate partnerships exist yet — no merchant accounts, no
 * tracking IDs, nothing live. This module exists purely as the integration
 * point for later: once a real partnership (e.g. a jeweler, a coffee-gear
 * retailer, a travel booking site, a car marketplace) is signed, populate
 * the relevant category array below with real `AffiliateLink` entries and
 * `getAffiliateLinks` will start returning them — no caller changes needed.
 *
 * Do NOT put placeholder/fake merchant URLs here. An empty array is the
 * honest state until a partnership exists, and `AffiliatePanel` renders
 * nothing when the array is empty.
 */

export type AffiliateCategory = "gold" | "coffee" | "travel" | "cars";

export interface AffiliateLink {
  /** Stable id for React keys / analytics, e.g. "jeweler-x-2026". */
  id: string;
  category: AffiliateCategory;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  /** Outbound URL, expected to carry the partner's own tracking params. */
  url: string;
  /** Optional small badge, e.g. "Sponsored" / "راعي". */
  sponsoredLabel?: { ar: string; en: string };
}

// Intentionally empty for every category — see module doc above.
const AFFILIATE_LINKS: Record<AffiliateCategory, AffiliateLink[]> = {
  gold: [],
  coffee: [],
  travel: [],
  cars: [],
};

export function getAffiliateLinks(category: AffiliateCategory): AffiliateLink[] {
  return AFFILIATE_LINKS[category];
}
