"use client";
import { normalizeNumericInput } from "@/lib/numeric";

import { useState } from "react";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import Input from "@/components/ui/Input";
import ResultCard from "@/components/ui/ResultCard";
import Tabs from "@/components/ui/Tabs";
import Alert from "@/components/ui/Alert";
import { calculateZakat } from "@/lib/calculators/zakat";
import { formatCurrency } from "@/lib/format";
import { FLAGSHIP_CALCULATORS } from "@/lib/calculatorRegistry";
import type { Locale } from "@/i18n";

const meta = FLAGSHIP_CALCULATORS.find((c) => c.slug === "zakat-calculator")!;

const COPY = {
  ar: {
    intro: "احسب زكاة مالك المتراكم: نقد، بنك، ذهب، فضة، استثمارات، وبضائع تجارية — بعد خصم الالتزامات.",
    categoryChoice: "اختر نوع الفلوس",
    catGold: "ذهب",
    catSilver: "فضة",
    catCash: "نقد",
    catOther: "أصول أخرى",
    cash: "النقد لديك",
    bank: "أرصدة البنوك",
    goldGrams: "الذهب (جرام)",
    goldPrice: "سعر جرام الذهب",
    silverGrams: "الفضة (جرام)",
    silverPrice: "سعر جرام الفضة",
    investments: "الاستثمارات",
    inventory: "بضائع تجارية",
    receivables: "ديون مستحقة لك",
    liabilities: "التزامات وديون عليك",
    nisabBasis: "أساس النصاب",
    gold: "الذهب",
    silver: "الفضة",
    zakatDue: "الزكاة المستحقة",
    total: "إجمالي الفلوس الزكوي",
    nisab: "قيمة النصاب",
    meets: "بلغ النصاب",
    notMeet: "لم يبلغ النصاب",
    home: "الرئيسية",
    category: "الفلوس",
    howItWorks: [
      "نجمع كل أموالك الزكوية (نقد، ذهب، فضة، استثمارات، بضائع تجارية، وديون مستحقة لك) ثم نطرح الالتزامات القصيرة الأجل.",
      "نقارن الناتج بقيمة النصاب (85 جرام ذهب أو 595 جرام فضة، حسب اختيارك).",
      "إذا بلغ الفلوس النصاب وحال عليه الحول (سنة هجرية كاملة)، تكون الزكاة 2.5% من صافي الفلوس الزكوي.",
    ],
    disclaimer: "هذه الحاسبة تقدّم تقديراً عاماً وفق قواعد شائعة وليست فتوى شرعية. للحصول على حكم دقيق لحالتك الخاصة، يُرجى استشارة عالم شرعي موثوق أو الجهة الرسمية المختصة بالزكاة في بلدك.",
    faq: [
      { question: "هل هذه الحاسبة فتوى شرعية؟", answer: "لا، هي أداة تقديرية عامة فقط. استشر جهة شرعية موثوقة لحالتك." },
      { question: "لماذا يوجد أساس نصاب بالذهب وآخر بالفضة؟", answer: "نصاب الفضة أقل قيمة عادة، فيراه بعض العلماء أكثر احتياطاً وشمولاً لوجوب الزكاة." },
    ],
  },
  en: {
    intro: "Calculate zakat on your accumulated wealth: cash, bank, gold, silver, investments, and business inventory — after liabilities.",
    categoryChoice: "Choose asset type",
    catGold: "Gold",
    catSilver: "Silver",
    catCash: "Cash",
    catOther: "Other assets",
    cash: "Cash on hand",
    bank: "Bank balances",
    goldGrams: "Gold (grams)",
    goldPrice: "Gold price per gram",
    silverGrams: "Silver (grams)",
    silverPrice: "Silver price per gram",
    investments: "Investments",
    inventory: "Business inventory",
    receivables: "Money owed to you",
    liabilities: "Liabilities / debts you owe",
    nisabBasis: "Nisab basis",
    gold: "Gold",
    silver: "Silver",
    zakatDue: "Zakat due",
    total: "Total zakatable wealth",
    nisab: "Nisab value",
    meets: "Meets nisab",
    notMeet: "Below nisab",
    home: "Home",
    category: "Money",
    howItWorks: [
      "We sum your zakatable assets (cash, gold, silver, investments, business inventory, and receivables) and subtract short-term liabilities.",
      "We compare the result against the nisab threshold (85g gold or 595g silver, your choice).",
      "If wealth meets nisab and has been held for a full lunar year (hawl), zakat is 2.5% of net zakatable wealth.",
    ],
    disclaimer: "This calculator provides a general estimate based on commonly-cited rules and is not a religious ruling (fatwa). For guidance specific to your situation, consult a trusted scholar or your country's official zakat authority.",
    faq: [
      { question: "Is this a religious ruling?", answer: "No — it's a general estimation tool only. Consult a trusted religious authority for your specific situation." },
      { question: "Why offer both gold and silver nisab?", answer: "The silver nisab is usually lower in value, so some scholars consider it more inclusive/cautious for determining zakat obligation." },
    ],
  },
};

export default function ZakatCalculatorClient({ locale }: { locale: Locale }) {
  const c = COPY[locale];

  const [cash, setCash] = useState("0");
  const [bank, setBank] = useState("0");
  const [goldGrams, setGoldGrams] = useState("0");
  const [goldPrice, setGoldPrice] = useState("300");
  const [silverGrams, setSilverGrams] = useState("0");
  const [silverPrice, setSilverPrice] = useState("3");
  const [investments, setInvestments] = useState("0");
  const [inventory, setInventory] = useState("0");
  const [receivables, setReceivables] = useState("0");
  const [liabilities, setLiabilities] = useState("0");
  const [nisabBasis, setNisabBasis] = useState<"gold" | "silver">("gold");
  const [category, setCategory] = useState<"gold" | "silver" | "cash" | "other">("gold");

  const n = (v: string) => Math.max(0, (normalizeNumericInput(v) ?? 0));

  const result = calculateZakat({
    cash: n(cash),
    bankBalances: n(bank),
    goldGrams: n(goldGrams),
    goldPricePerGram: n(goldPrice),
    silverGrams: n(silverGrams),
    silverPricePerGram: n(silverPrice),
    investments: n(investments),
    businessInventory: n(inventory),
    receivables: n(receivables),
    liabilities: n(liabilities),
    nisabBasis,
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
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-text-muted">{c.categoryChoice}</span>
            <Tabs
              options={[
                { value: "gold", label: c.catGold },
                { value: "silver", label: c.catSilver },
                { value: "cash", label: c.catCash },
                { value: "other", label: c.catOther },
              ]}
              value={category}
              onChange={setCategory}
            />
          </div>

          {category === "gold" && (
            <>
              <Input label={c.goldGrams} type="number" min={0} inputMode="decimal" value={goldGrams} onChange={(e) => setGoldGrams(e.target.value)} />
              <Input label={c.goldPrice} type="number" min={0} inputMode="decimal" value={goldPrice} onChange={(e) => setGoldPrice(e.target.value)} />
            </>
          )}

          {category === "silver" && (
            <>
              <Input label={c.silverGrams} type="number" min={0} inputMode="decimal" value={silverGrams} onChange={(e) => setSilverGrams(e.target.value)} />
              <Input label={c.silverPrice} type="number" min={0} inputMode="decimal" value={silverPrice} onChange={(e) => setSilverPrice(e.target.value)} />
            </>
          )}

          {category === "cash" && (
            <>
              <Input label={c.cash} type="number" min={0} inputMode="decimal" value={cash} onChange={(e) => setCash(e.target.value)} />
              <Input label={c.bank} type="number" min={0} inputMode="decimal" value={bank} onChange={(e) => setBank(e.target.value)} />
            </>
          )}

          {category === "other" && (
            <>
              <Input label={c.investments} type="number" min={0} inputMode="decimal" value={investments} onChange={(e) => setInvestments(e.target.value)} />
              <Input label={c.inventory} type="number" min={0} inputMode="decimal" value={inventory} onChange={(e) => setInventory(e.target.value)} />
              <Input label={c.receivables} type="number" min={0} inputMode="decimal" value={receivables} onChange={(e) => setReceivables(e.target.value)} />
            </>
          )}

          <Input label={c.liabilities} type="number" min={0} inputMode="decimal" value={liabilities} onChange={(e) => setLiabilities(e.target.value)} />
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-text-muted">{c.nisabBasis}</span>
            <Tabs
              options={[
                { value: "gold", label: c.gold },
                { value: "silver", label: c.silver },
              ]}
              value={nisabBasis}
              onChange={setNisabBasis}
            />
          </div>
        </>
      }
      result={
        <>
          <ResultCard label={c.zakatDue} value={formatCurrency(result.zakatDue, locale)} />
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.total}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">{formatCurrency(result.netZakatableWealth, locale)}</dd>
            </div>
            <div className="rounded-[var(--radius-md)] bg-bg-subtle p-3">
              <dt className="text-text-faint">{c.nisab}</dt>
              <dd className="mt-1 font-semibold tabular-nums text-text">{formatCurrency(result.nisabValue, locale)}</dd>
            </div>
          </dl>
          <Alert title={result.meetsNisab ? c.meets : c.notMeet} tone={result.meetsNisab ? "info" : "warning"}>
            {c.disclaimer}
          </Alert>
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
