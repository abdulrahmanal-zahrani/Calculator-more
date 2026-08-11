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
    name: { ar: "حاسبة القهوة / V60", en: "Coffee / V60 Calculator" },
    description: {
      ar: "نسبة القهوة والماء المثالية لأي طريقة تحضير، مع جدول الصب خطوة بخطوة.",
      en: "The perfect coffee-to-water ratio for any brew method, with a step-by-step pour schedule.",
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
  {
    slug: "zakat-calculator",
    category: "money",
    icon: "🕌",
    name: { ar: "حاسبة الزكاة", en: "Zakat Calculator" },
    description: {
      ar: "احسب زكاة الفلوس والذهب والفضة والاستثمارات وفق قواعد عامة.",
      en: "Calculate zakat on cash, gold, silver, and investments using general rules.",
    },
  },
  {
    slug: "vat-calculator",
    category: "money",
    icon: "🧾",
    name: { ar: "حاسبة ضريبة القيمة المضافة", en: "VAT Calculator" },
    description: {
      ar: "أضف أو استخرج ضريبة القيمة المضافة بأي نسبة، بما في ذلك نسبة زاتكا 15%.",
      en: "Add or reverse-calculate VAT at any rate, including the 15% ZATCA rate.",
    },
  },
  {
    slug: "installment-calculator",
    category: "money",
    icon: "📆",
    name: { ar: "حاسبة الأقساط", en: "Installment Calculator" },
    description: {
      ar: "قسّط أي سعر شراء على دفعات شهرية مع الدفعة المقدمة والرسوم.",
      en: "Split any purchase price into monthly installments with down payment and fees.",
    },
  },
  {
    slug: "car-loan-calculator",
    category: "cars",
    icon: "🚗",
    name: { ar: "حاسبة تمويل السيارة", en: "Car Loan Calculator" },
    description: {
      ar: "احسب القسط الشهري وإجمالي تكلفة تمويل سيارتك الجديدة.",
      en: "Calculate the monthly payment and total cost of financing your car.",
    },
  },
  {
    slug: "insurance-comparison-calculator",
    category: "cars",
    icon: "🛡️",
    name: { ar: "مقارنة التأمين", en: "Insurance Comparison Calculator" },
    description: {
      ar: "قارن بين عروض تأمين السيارات من حيث التكلفة الفعلية السنوية.",
      en: "Compare car insurance quotes by effective annual cost.",
    },
  },
  {
    slug: "maintenance-cost-calculator",
    category: "cars",
    icon: "🔧",
    name: { ar: "حاسبة تكلفة الصيانة", en: "Maintenance Cost Calculator" },
    description: {
      ar: "قدّر تكلفة صيانة سيارتك السنوية حسب المسافة المقطوعة.",
      en: "Estimate your car's annual maintenance cost based on mileage.",
    },
  },
  {
    slug: "recipe-scaling-calculator",
    category: "lifestyle",
    icon: "🍳",
    name: { ar: "حاسبة تحجيم الوصفات", en: "Recipe Scaling Calculator" },
    description: {
      ar: "كبّر أو صغّر أي وصفة حسب عدد الحصص المطلوبة.",
      en: "Scale any recipe up or down to the number of servings you need.",
    },
  },
  {
    slug: "calorie-calculator",
    category: "lifestyle",
    icon: "🔥",
    name: { ar: "حاسبة السعرات الحرارية", en: "Calorie Calculator" },
    description: {
      ar: "احسب احتياجك اليومي من السعرات الحرارية حسب هدفك.",
      en: "Estimate your daily calorie needs based on your goal.",
    },
  },
  {
    slug: "protein-calculator",
    category: "lifestyle",
    icon: "🥩",
    name: { ar: "حاسبة البروتين", en: "Protein Calculator" },
    description: {
      ar: "احسب احتياجك اليومي من البروتين حسب وزنك ونشاطك وهدفك.",
      en: "Estimate your daily protein needs based on weight, activity, and goal.",
    },
  },
  {
    slug: "travel-fuel-calculator",
    category: "travel",
    icon: "🛣️",
    name: { ar: "حاسبة وقود الرحلة", en: "Travel Fuel Calculator" },
    description: {
      ar: "قدّر تكلفة الوقود لرحلة برية طويلة والتكلفة لكل شخص.",
      en: "Estimate fuel cost for a long road trip and cost per traveler.",
    },
  },
  {
    slug: "luggage-calculator",
    category: "travel",
    icon: "🧳",
    name: { ar: "حاسبة وزن الأمتعة", en: "Luggage Calculator" },
    description: {
      ar: "تأكد من وزن حقائبك مقابل الوزن المسموح به قبل السفر.",
      en: "Check your bags' weight against your allowance before you fly.",
    },
  },
  {
    slug: "time-zone-calculator",
    category: "travel",
    icon: "🕒",
    name: { ar: "حاسبة فروق التوقيت", en: "Time Zone Calculator" },
    description: {
      ar: "قارن التوقيت بين الرياض ومدن العالم الرئيسية بدقة تراعي التوقيت الصيفي.",
      en: "Compare the time between Riyadh and major world cities, DST-aware.",
    },
  },
];

export const CATEGORIES: { slug: Category; name: { ar: string; en: string }; description: { ar: string; en: string } }[] = [
  {
    slug: "money",
    name: { ar: "الفلوس", en: "Money" },
    description: { ar: "ذهب، رواتب، عملات، خصومات، وتمويل.", en: "Gold, salary, currency, discounts, and loans." },
  },
  {
    slug: "cars",
    name: { ar: "السيارات", en: "Cars" },
    description: { ar: "وقود، تمويل سيارات، وصيانة.", en: "Fuel, car finance, and maintenance." },
  },
  {
    slug: "lifestyle",
    name: { ar: "القهوة والأكل", en: "Coffee & Food" },
    description: { ar: "قهوة، وصفات، وسعرات حرارية.", en: "Coffee, recipes, and calories." },
  },
  {
    slug: "travel",
    name: { ar: "السفر", en: "Travel" },
    description: { ar: "ميزانية السفر والتوقيت والأمتعة.", en: "Trip budgeting, time zones, and luggage." },
  },
];

// All previously "coming soon" calculators have shipped (Phase 2) — kept as
// an empty, typed list so category pages / future additions keep working.
export const COMING_SOON: { category: Category; name: { ar: string; en: string }; description: { ar: string; en: string } }[] = [];

export function getCalculatorsByCategory(category: Category): CalculatorMeta[] {
  return FLAGSHIP_CALCULATORS.filter((c) => c.category === category);
}
