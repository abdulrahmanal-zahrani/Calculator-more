import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { calculateGoldValue, type Karat } from "@/lib/calculators/gold";
import { calculateCoffeeRecipe } from "@/lib/calculators/coffeeRecipe";
import { calculateTripBudget } from "@/lib/calculators/tripBudget";
import { calculateFuelCost } from "@/lib/calculators/fuel";
import { calculateDiscount } from "@/lib/calculators/discount";
import { calculateSalary } from "@/lib/calculators/salary";
import { SAUDI_VAT_RATE } from "@/lib/config/vat";
import { FLAGSHIP_CALCULATORS } from "@/lib/calculatorRegistry";

export const runtime = "nodejs";

const WIDTH = 1200;
const HEIGHT = 630;

// Brand tokens mirrored from app/globals.css (light mode) — kept in sync
// manually since ImageResponse can't read CSS custom properties.
const BRAND = {
  bg: "#0f6f66",
  bgSoft: "#0c5b54",
  card: "#ffffff",
  text: "#191713",
  textMuted: "#63594b",
  accent: "#e3f1ee",
};

type Locale = "ar" | "en";

interface Breakdown {
  label: string;
  value: string;
}

interface OgData {
  title: string;
  primary: string;
  breakdown: Breakdown[];
}

function num(sp: URLSearchParams, key: string, fallback: number): number {
  const raw = sp.get(key);
  const n = raw != null ? parseFloat(raw) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

// Numbers are rendered with plain en-US formatting (ASCII digits) regardless
// of locale — satori has no reliable Arabic-Indic digit shaping without a
// bundled font, and ASCII digits stay legible in both directions for a
// share-preview image. Labels use the calculator's bilingual copy.
function money(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value) + " SAR";
}
function plain(value: number, suffix = ""): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value) + suffix;
}

function buildData(slug: string, locale: Locale, sp: URLSearchParams): OgData | null {
  const meta = FLAGSHIP_CALCULATORS.find((c) => c.slug === slug);
  const title = meta ? meta.name[locale] : slug;

  switch (slug) {
    case "gold-calculator": {
      const r = calculateGoldValue({
        weightGrams: num(sp, "weight", 10),
        karat: (num(sp, "karat", 21) as Karat) || 21,
        pricePerGram24k: num(sp, "price", 300),
        makingChargePerGram: num(sp, "making", 10),
        vatRate: SAUDI_VAT_RATE,
        mode: (sp.get("mode") as "buy" | "sell") ?? "buy",
      });
      return {
        title,
        primary: money(r.total),
        breakdown: [
          { label: locale === "ar" ? "القيمة الخام" : "Raw value", value: money(r.rawValue) },
          { label: locale === "ar" ? "أجور الصنعة" : "Making charge", value: money(r.makingCharge) },
          { label: locale === "ar" ? "الضريبة" : "VAT", value: money(r.vatAmount) },
        ],
      };
    }
    case "v60-calculator": {
      const coffee = num(sp, "coffee", 20);
      const ratio = num(sp, "ratio", 16);
      const r = calculateCoffeeRecipe({ method: "v60", solveFor: "water", coffeeGrams: coffee, ratio });
      return {
        title,
        primary: `${plain(r.waterGrams, "g")} ${locale === "ar" ? "ماء" : "water"}`,
        breakdown: [
          { label: locale === "ar" ? "القهوة" : "Coffee", value: plain(r.coffeeGrams, "g") },
          { label: locale === "ar" ? "النسبة" : "Ratio", value: `1:${plain(r.ratio)}` },
          { label: locale === "ar" ? "ماء التبليل" : "Bloom water", value: plain(r.bloomWaterGrams, "g") },
        ],
      };
    }
    case "trip-budget-calculator": {
      const r = calculateTripBudget({
        travelers: Math.max(1, num(sp, "travelers", 2)),
        days: Math.max(1, num(sp, "days", 5)),
        flights: num(sp, "flights", 1000),
        accommodationPerNight: num(sp, "accommodation", 300),
        foodPerDayPerPerson: num(sp, "food", 100),
        transport: num(sp, "transport", 200),
        activities: num(sp, "activities", 150),
        shopping: num(sp, "shopping", 100),
        bufferPercent: num(sp, "buffer", 10),
      });
      return {
        title,
        primary: money(r.total),
        breakdown: [
          { label: locale === "ar" ? "لكل يوم" : "Per day", value: money(r.perDay) },
          { label: locale === "ar" ? "لكل شخص" : "Per person", value: money(r.perPerson) },
          { label: locale === "ar" ? "الاحتياطي" : "Buffer", value: money(r.bufferAmount) },
        ],
      };
    }
    case "fuel-cost-calculator": {
      const r = calculateFuelCost({
        distanceKm: num(sp, "distance", 100),
        efficiencyLPer100Km: num(sp, "efficiency", 8),
        pricePerLiter: num(sp, "price", 2.18),
        tripsPerMonth: num(sp, "trips", 1),
      });
      return {
        title,
        primary: money(r.monthlyCost),
        breakdown: [
          { label: locale === "ar" ? "لكل رحلة" : "Per trip", value: money(r.tripCost) },
          { label: locale === "ar" ? "سنويًا" : "Annual", value: money(r.annualCost) },
          { label: locale === "ar" ? "لترات" : "Liters", value: plain(r.litersConsumed, "L") },
        ],
      };
    }
    case "discount-calculator": {
      const original = num(sp, "original", 500);
      const discounts = (sp.get("discounts") ?? "20")
        .split(",")
        .map((d) => Math.min(100, Math.max(0, parseFloat(d) || 0)));
      const r = calculateDiscount({ originalPrice: original, discountPercents: discounts });
      return {
        title,
        primary: money(r.finalPrice),
        breakdown: [
          { label: locale === "ar" ? "التوفير" : "Savings", value: money(r.totalSavings) },
          { label: locale === "ar" ? "نسبة فعلية" : "Effective", value: plain(r.effectiveDiscountPercent, "%") },
          { label: locale === "ar" ? "السعر الأصلي" : "Original", value: money(r.originalPrice) },
        ],
      };
    }
    case "salary-calculator": {
      const r = calculateSalary({
        basic: num(sp, "basic", 5000),
        housingAllowance: num(sp, "housing", 1000),
        transportAllowance: num(sp, "transport", 500),
        otherAllowances: num(sp, "other", 0),
        deductions: num(sp, "deductions", 0),
      });
      return {
        title,
        primary: money(r.netMonthly),
        breakdown: [
          { label: locale === "ar" ? "إجمالي الراتب" : "Gross", value: money(r.grossMonthly) },
          { label: locale === "ar" ? "الصافي السنوي" : "Net annual", value: money(r.netAnnual) },
          { label: locale === "ar" ? "الاستقطاعات" : "Deductions", value: money(r.totalDeductions) },
        ],
      };
    }
    default:
      return null;
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const locale: Locale = searchParams.get("locale") === "ar" ? "ar" : "en";

  const data = buildData(slug, locale, searchParams);

  if (!data) {
    return new Response("Unknown calculator slug", { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: `linear-gradient(135deg, ${BRAND.bg} 0%, ${BRAND.bgSoft} 100%)`,
          padding: "56px 64px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: BRAND.card,
              color: BRAND.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            M
          </div>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: BRAND.card }}>MIHSAB</div>
        </div>

        {/* Title */}
        <div style={{ display: "flex", marginTop: 40, fontSize: 34, fontWeight: 600, color: BRAND.accent }}>
          {data.title}
        </div>

        {/* Result card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 24,
            background: BRAND.card,
            borderRadius: 24,
            padding: "40px 48px",
            flex: 1,
          }}
        >
          <div style={{ display: "flex", fontSize: 22, color: BRAND.textMuted }}>
            {locale === "ar" ? "النتيجة" : "Result"}
          </div>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, color: BRAND.text, marginTop: 4 }}>
            {data.primary}
          </div>

          <div style={{ display: "flex", gap: 24, marginTop: "auto" }}>
            {data.breakdown.map((b) => (
              <div
                key={b.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "#f2f0ec",
                  borderRadius: 14,
                  padding: "14px 20px",
                  flex: 1,
                }}
              >
                <div style={{ display: "flex", fontSize: 16, color: BRAND.textMuted }}>{b.label}</div>
                <div style={{ display: "flex", fontSize: 26, fontWeight: 700, color: BRAND.text, marginTop: 4 }}>
                  {b.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", marginTop: 24, fontSize: 18, color: BRAND.accent }}>
          mihsab.app
        </div>
      </div>
    ),
    { width: WIDTH, height: HEIGHT }
  );
}
