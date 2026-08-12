"use client";
import { normalizeNumericInput } from "@/lib/numeric";

import { useState } from "react";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import ResultCard from "@/components/ui/ResultCard";
import { scaleRecipe, type RecipeIngredientInput, type IngredientUnit } from "@/lib/calculators/recipeScaling";
import { formatNumber } from "@/lib/format";
import { FLAGSHIP_CALCULATORS } from "@/lib/calculatorRegistry";
import type { Locale } from "@/i18n";

const meta = FLAGSHIP_CALCULATORS.find((c) => c.slug === "recipe-scaling-calculator")!;

const UNITS: IngredientUnit[] = ["g", "ml", "cups", "tbsp", "tsp", "pieces"];
const UNIT_LABELS: Record<IngredientUnit, { ar: string; en: string }> = {
  g: { ar: "جرام", en: "g" },
  ml: { ar: "مل", en: "ml" },
  cups: { ar: "كوب", en: "cups" },
  tbsp: { ar: "ملعقة كبيرة", en: "tbsp" },
  tsp: { ar: "ملعقة صغيرة", en: "tsp" },
  pieces: { ar: "قطعة", en: "pieces" },
};

const COPY = {
  ar: {
    intro: "كبّر أو صغّر أي وصفة عبر إدخال المكونات وعدد الحصص الأصلي والمطلوب.",
    original: "عدد الحصص الأصلي",
    desired: "عدد الحصص المطلوب",
    ingredient: "المكوّن",
    quantity: "الكمية",
    unit: "الوحدة",
    addIngredient: "إضافة مكوّن",
    remove: "إزالة",
    scaleFactor: "معامل التحجيم",
    scaledQuantity: "الكمية الجديدة",
    home: "الرئيسية",
    category: "القهوة والأكل",
    howItWorks: [
      "نحسب معامل التحجيم بقسمة عدد الحصص المطلوب على عدد الحصص الأصلي.",
      "نضرب كمية كل مكوّن في هذا المعامل للحصول على الكمية الجديدة.",
    ],
    disclaimer: "قد تختلف نتائج الخَبز الدقيقة عند تكبير الوصفات كثيراً — اضبط أوقات الطهي حسب الحاجة.",
    faq: [{ question: "هل تعمل مع أي وحدة قياس؟", answer: "نعم، اختر الوحدة المناسبة لكل مكوّن." }],
  },
  en: {
    intro: "Scale any recipe by entering ingredients and your original and desired serving counts.",
    original: "Original servings",
    desired: "Desired servings",
    ingredient: "Ingredient",
    quantity: "Quantity",
    unit: "Unit",
    addIngredient: "Add ingredient",
    remove: "Remove",
    scaleFactor: "Scale factor",
    scaledQuantity: "Scaled quantity",
    home: "Home",
    category: "Coffee & Food",
    howItWorks: [
      "We compute the scale factor as desired servings divided by original servings.",
      "We multiply each ingredient's quantity by that factor to get the scaled quantity.",
    ],
    disclaimer: "Baking precision can shift with large scale factors — adjust cooking times as needed.",
    faq: [{ question: "Does it work with any unit?", answer: "Yes — pick the right unit for each ingredient." }],
  },
};

export default function RecipeScalingClient({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const [original, setOriginal] = useState("4");
  const [desired, setDesired] = useState("8");
  const [ingredients, setIngredients] = useState<RecipeIngredientInput[]>([
    { name: locale === "ar" ? "دقيق" : "Flour", quantity: 200, unit: "g" },
    { name: locale === "ar" ? "سكر" : "Sugar", quantity: 100, unit: "g" },
  ]);

  function update(i: number, patch: Partial<RecipeIngredientInput>) {
    setIngredients((prev) => prev.map((ing, idx) => (idx === i ? { ...ing, ...patch } : ing)));
  }

  const result = scaleRecipe({
    originalServings: Math.max(1, (normalizeNumericInput(original) ?? 1)),
    desiredServings: Math.max(1, (normalizeNumericInput(desired) ?? 1)),
    ingredients: ingredients.map((i) => ({ ...i, quantity: Math.max(0, i.quantity || 0) })),
  });

  return (
    <CalculatorShell
      locale={locale}
      meta={meta}
      intro={c.intro}
      breadcrumbLabels={{ home: c.home, category: c.category }}
      shareUrl={typeof window !== "undefined" ? window.location.href : ""}
      t={{
        calculate: "",
        howItWorks: locale === "ar" ? "كيف تعمل الحاسبة" : "How it works",
        faq: locale === "ar" ? "الأسئلة الشائعة" : "FAQ",
        related: locale === "ar" ? "حاسبات ذات صلة" : "Related calculators",
        disclaimer: locale === "ar" ? "إخلاء مسؤولية" : "Disclaimer",
        share: locale === "ar" ? "مشاركة" : "Share",
        copyLink: locale === "ar" ? "نسخ الرابط" : "Copy link",
        copied: locale === "ar" ? "تم النسخ" : "Copied",
      }}
      calculatorForm={
        <>
          <div className="grid grid-cols-2 gap-2">
            <Input label={c.original} type="number" min={1} inputMode="numeric" value={original} onChange={(e) => setOriginal(e.target.value)} />
            <Input label={c.desired} type="number" min={1} inputMode="numeric" value={desired} onChange={(e) => setDesired(e.target.value)} />
          </div>
          {ingredients.map((ing, i) => (
            <div key={i} className="grid grid-cols-4 gap-2 rounded-[var(--radius-md)] border border-border p-3">
              <div className="col-span-4">
                <Input label={c.ingredient} value={ing.name} onChange={(e) => update(i, { name: e.target.value })} />
              </div>
              <div className="col-span-2">
                <Input label={c.quantity} type="number" min={0} inputMode="decimal" value={ing.quantity} onChange={(e) => update(i, { quantity: (normalizeNumericInput(e.target.value) ?? 0) })} />
              </div>
              <div className="col-span-2">
                <Select label={c.unit} value={ing.unit} onChange={(e) => update(i, { unit: e.target.value as IngredientUnit })}>
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {UNIT_LABELS[u][locale]}
                    </option>
                  ))}
                </Select>
              </div>
              {ingredients.length > 1 && (
                <div className="col-span-4">
                  <Button variant="ghost" size="sm" onClick={() => setIngredients((prev) => prev.filter((_, idx) => idx !== i))}>
                    {c.remove}
                  </Button>
                </div>
              )}
            </div>
          ))}
          <Button variant="secondary" size="sm" onClick={() => setIngredients((prev) => [...prev, { name: "", quantity: 0, unit: "g" }])}>
            + {c.addIngredient}
          </Button>
        </>
      }
      result={
        <>
          <ResultCard label={c.scaleFactor} value={`×${formatNumber(result.scaleFactor, locale)}`} />
          <div className="space-y-1 text-sm">
            {result.ingredients.map((ing, i) => (
              <div key={i} className="flex justify-between rounded-[var(--radius-sm)] bg-bg-subtle px-3 py-2">
                <span className="text-text-muted">{ing.name || "—"}</span>
                <span className="tabular-nums text-text">
                  {formatNumber(ing.scaledQuantity, locale)} {UNIT_LABELS[ing.unit][locale]}
                </span>
              </div>
            ))}
          </div>
        </>
      }
      howItWorks={
        <ol className="list-decimal space-y-2 ps-5">
          {c.howItWorks.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      }
      faq={c.faq}
      disclaimer={c.disclaimer}
    />
  );
}
