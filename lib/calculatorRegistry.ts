export type Category = "money" | "cars" | "lifestyle" | "travel";

export interface CalculatorMeta {
  slug: string;
  category: Category;
  icon: string; // emoji, theme-neutral, mirrors fine in RTL
  name: { ar: string; en: string };
  description: { ar: string; en: string };
}

export const FLAGSHIP_CALCULATORS: CalculatorMeta[] = [
  {
    slug: "gold-calculator",
    category: "money",
    icon: "🪙",
    name: { ar: "حاسبة الذهب", en: "Gold Calculator" },
    description: {
      ar: "احسب قيمة الذهب حسب الوزن والعيار والسعر مع أجور الصنعة والضريبة.",
      en: "Calculate gold value by weight, karat, and price — with making charge and VAT.",
    },
  },
  {
    slug: "salary-calculator",
    category: "money",
    icon: "💰",
    name: { ar: "حاسبة الراتب", en: "Salary Calculator" },
    description: {
      ar: "احسب صافي راتبك الشهري والسنوي من البدلات والاستقطاعات.",
      en: "Work out your net monthly and annual salary from allowances and deductions.",
    },
  },
  {
    slug: "currency-converter",
    category: "money",
    icon: "💱",
    name: { ar: "محول العملات", en: "Currency Converter" },
    description: {
      ar: "حوّل بين 16 عملة بأسعار إرشادية قابلة للتحديث.",
      en: "Convert between 16 currencies using indicative, updatable rates.",
    },
  },
  {
    slug: "discount-calculator",
    category: "money",
    icon: "🏷️",
    name: { ar: "حاسبة الخصم", en: "Discount Calculator" },
    description: {
      ar: "احسب السعر النهائي والتوفير مع دعم الخصومات المتراكمة.",
      en: "Work out the final price and savings, including stacked discounts.",
    },
  },
  {
    slug: "loan-calculator",
    category: "money",
    icon: "🏦",
    name: { ar: "حاسبة التمويل", en: "Loan Calculator" },
    description: {
      ar: "احسب القسط الشهري وجدول السداد الكامل لأي تمويل.",
      en: "Calculate monthly payments and a full amortization schedule.",
    },
  },
  {
    slug: "fuel-cost-calculator",
    category: "cars",
    icon: "⛽",
    name: { ar: "حاسبة تكلفة الوقود", en: "Fuel Cost Calculator" },
    description: {
      ar: "احسب تكلفة الوقود لأي رحلة أو شهر أو سنة حسب كفاءة الاستهلاك.",
      en: "Estimate fuel cost per trip, month, or year based on efficiency.",
    },
  },
  {
    slug: "v60-calculator",
    category: "lifestyle",
    icon: "☕",
    name: { ar: "حاسبة V60", en: "V60 Coffee Calculator" },
    description: {
      ar: "نسبة القهوة والماء المثالية مع جدول الصب خطوة بخطوة.",
      en: "The perfect coffee-to-water ratio, with a step-by-step pour schedule.",
    },
  },
  {
    slug: "trip-budget-calculator",
    category: "travel",
    icon: "✈️",
    name: { ar: "حاسبة ميزانية الرحلة", en: "Trip Budget Calculator" },
    description: {
      ar: "خطط لميزانية رحلتك القادمة: طيران، إقامة، طعام، وأنشطة.",
      en: "Plan your next trip's budget: flights, stay, food, and activities.",
    },
  },
];

export const CATEGORIES: { slug: Category; name: { ar: string; en: string }; description: { ar: string; en: string } }[] = [
  {
    slug: "money",
    name: { ar: "المال", en: "Money" },
    description: { ar: "ذهب، رواتب، عملات، خصومات، وتمويل.", en: "Gold, salary, currency, discounts, and loans." },
  },
  {
    slug: "cars",
    name: { ar: "السيارات", en: "Cars" },
    description: { ar: "وقود، تمويل سيارات، وصيانة.", en: "Fuel, car finance, and maintenance." },
  },
  {
    slug: "lifestyle",
    name: { ar: "نمط الحياة", en: "Lifestyle" },
    description: { ar: "قهوة، وصفات، وسعرات حرارية.", en: "Coffee, recipes, and calories." },
  },
  {
    slug: "travel",
    name: { ar: "السفر", en: "Travel" },
    description: { ar: "ميزانية السفر والتوقيت والأمتعة.", en: "Trip budgeting, time zones, and luggage." },
  },
];

export const COMING_SOON: { category: Category; name: { ar: string; en: string }; description: { ar: string; en: string } }[] = [
  { category: "money", name: { ar: "حاسبة الزكاة", en: "Zakat Calculator" }, description: { ar: "احسب زكاة المال والذهب.", en: "Calculate zakat on wealth and gold." } },
  { category: "money", name: { ar: "حاسبة ضريبة القيمة المضافة", en: "VAT Calculator" }, description: { ar: "أضف أو استخرج ضريبة القيمة المضافة.", en: "Add or extract VAT from a price." } },
  { category: "money", name: { ar: "حاسبة الأقساط", en: "Installment Calculator" }, description: { ar: "قسّط أي مبلغ على دفعات.", en: "Split any amount into installments." } },
  { category: "cars", name: { ar: "تمويل السيارة", en: "Car Loan Calculator" }, description: { ar: "احسب قسط تمويل سيارتك.", en: "Estimate your car finance payment." } },
  { category: "cars", name: { ar: "مقارنة التأمين", en: "Insurance Comparison" }, description: { ar: "قارن بين عروض تأمين السيارات.", en: "Compare car insurance quotes." } },
  { category: "cars", name: { ar: "تكلفة الصيانة", en: "Maintenance Cost" }, description: { ar: "قدّر تكلفة صيانة سيارتك السنوية.", en: "Estimate your car's annual maintenance cost." } },
  { category: "lifestyle", name: { ar: "نسبة القهوة", en: "Coffee Ratio" }, description: { ar: "نسب قهوة لطرق تحضير أخرى.", en: "Coffee ratios for other brew methods." } },
  { category: "lifestyle", name: { ar: "تحجيم الوصفات", en: "Recipe Scaling" }, description: { ar: "كبّر أو صغّر أي وصفة.", en: "Scale any recipe up or down." } },
  { category: "lifestyle", name: { ar: "حاسبة السعرات", en: "Calorie Calculator" }, description: { ar: "احسب احتياجك اليومي من السعرات.", en: "Estimate your daily calorie needs." } },
  { category: "lifestyle", name: { ar: "حاسبة البروتين", en: "Protein Calculator" }, description: { ar: "احسب احتياجك اليومي من البروتين.", en: "Estimate your daily protein needs." } },
  { category: "travel", name: { ar: "وقود الرحلة", en: "Travel Fuel Calculator" }, description: { ar: "قدّر تكلفة الوقود لرحلة برية طويلة.", en: "Estimate fuel cost for a long road trip." } },
  { category: "travel", name: { ar: "وزن الأمتعة", en: "Luggage Calculator" }, description: { ar: "تأكد من وزن حقيبتك قبل السفر.", en: "Check your luggage weight before you fly." } },
  { category: "travel", name: { ar: "فروق التوقيت", en: "Time Zone Calculator" }, description: { ar: "قارن التوقيت بين مدينتين.", en: "Compare the time between two cities." } },
];

export function getCalculatorsByCategory(category: Category): CalculatorMeta[] {
  return FLAGSHIP_CALCULATORS.filter((c) => c.category === category);
}
