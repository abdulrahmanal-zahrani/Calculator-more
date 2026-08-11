import type { LegalSection } from "@/components/legal/LegalPageContent";

export interface LegalPageData {
  slug: string;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  sections: { ar: LegalSection[]; en: LegalSection[] };
}

const UPDATED_ISO = "2026-08-11";

export const LEGAL_PAGES: LegalPageData[] = [
  {
    slug: "privacy-policy",
    title: { ar: "سياسة الخصوصية", en: "Privacy Policy" },
    description: {
      ar: "كيف تتعامل حسابي مع بياناتك.",
      en: "How Hesabi handles your data.",
    },
    sections: {
      ar: [
        {
          heading: "نظرة عامة",
          body: [
            "حسابي منصة حاسبات تعمل بالكامل داخل متصفحك. جميع عمليات الحساب تتم محليًا على جهازك — نحن لا نُرسل مدخلاتك (مثل راتبك أو وزن ذهبك أو ميزانية رحلتك) إلى أي خادم لتخزينها.",
          ],
        },
        {
          heading: "البيانات التي نجمعها",
          body: [
            "لا نستخدم حاليًا أي مزوّد تحليلات خارجي. أي تتبع مستقبلي للاستخدام (مثل عدد زيارات حاسبة معينة) سيتم بشكل مجهول الهوية ولن يشمل المدخلات الفعلية التي تكتبها في الحاسبات.",
            "نستخدم التخزين المحلي في متصفحك (localStorage) لحفظ الحاسبات التي استخدمتها مؤخرًا، لتحسين تجربتك — هذه البيانات تبقى على جهازك ولا تُرسل إلينا.",
          ],
        },
        {
          heading: "ملفات تعريف الارتباط",
          body: ["لا نستخدم ملفات تعريف ارتباط للتتبع الإعلاني حاليًا."],
        },
        {
          heading: "التواصل",
          body: ["لأي استفسار متعلق بالخصوصية، يمكنك التواصل معنا عبر البريد الإلكتروني الموضح في صفحة اتصل بنا."],
        },
      ],
      en: [
        {
          heading: "Overview",
          body: [
            "Hesabi is a calculator platform that runs entirely in your browser. All calculations happen locally on your device — we do not send your inputs (like your salary, gold weight, or trip budget) to a server for storage.",
          ],
        },
        {
          heading: "Data we collect",
          body: [
            "We do not currently use any third-party analytics provider. Any future usage tracking (e.g. how many people visit a given calculator) will be anonymized and will never include the actual values you type into a calculator.",
            "We use your browser's local storage to remember which calculators you've used recently, to improve your experience — this data stays on your device and is never sent to us.",
          ],
        },
        {
          heading: "Cookies",
          body: ["We do not currently use advertising tracking cookies."],
        },
        {
          heading: "Contact",
          body: ["For any privacy-related question, please reach out via the email listed on our Contact page."],
        },
      ],
    },
  },
  {
    slug: "terms-of-use",
    title: { ar: "شروط الاستخدام", en: "Terms of Use" },
    description: { ar: "الشروط الخاصة باستخدام منصة حسابي.", en: "The terms governing your use of Hesabi." },
    sections: {
      ar: [
        {
          heading: "قبول الشروط",
          body: ["باستخدامك لموقع حسابي، فإنك توافق على هذه الشروط. إذا كنت لا توافق، يُرجى عدم استخدام الموقع."],
        },
        {
          heading: "طبيعة الخدمة",
          body: [
            "حسابي أداة مجانية توفّر حاسبات تقديرية لأغراض عامة (مالية، سيارات، نمط حياة، وسفر). النتائج المعروضة تقديرية وليست نصيحة مالية أو طبية أو شرعية أو قانونية رسمية.",
          ],
        },
        {
          heading: "حدود المسؤولية",
          body: [
            "نبذل قصارى جهدنا لضمان دقة الحسابات، لكننا لا نضمن خلوّها التام من الأخطاء. لا نتحمل أي مسؤولية عن قرارات تُتخذ بناءً على نتائج الحاسبات دون التحقق المستقل.",
          ],
        },
        {
          heading: "التعديلات",
          body: ["يجوز لنا تحديث هذه الشروط من وقت لآخر. الاستمرار في استخدام الموقع بعد التحديث يعني موافقتك على الشروط الجديدة."],
        },
      ],
      en: [
        {
          heading: "Acceptance of terms",
          body: ["By using Hesabi, you agree to these terms. If you do not agree, please do not use the site."],
        },
        {
          heading: "Nature of the service",
          body: [
            "Hesabi is a free tool providing general-purpose estimation calculators (money, cars, lifestyle, and travel). Results shown are estimates, not official financial, medical, religious, or legal advice.",
          ],
        },
        {
          heading: "Limitation of liability",
          body: [
            "We make reasonable efforts to keep calculations accurate but do not guarantee they are error-free. We are not liable for decisions made based on calculator results without independent verification.",
          ],
        },
        {
          heading: "Changes",
          body: ["We may update these terms from time to time. Continued use of the site after an update means you accept the revised terms."],
        },
      ],
    },
  },
  {
    slug: "disclaimer",
    title: { ar: "إخلاء مسؤولية عام", en: "General Disclaimer" },
    description: { ar: "إخلاء المسؤولية العام لجميع حاسبات المنصة.", en: "The general disclaimer covering every calculator on the platform." },
    sections: {
      ar: [
        {
          heading: "أداة تقديرية",
          body: [
            "جميع الحاسبات على منصة حسابي مصممة لأغراض تقديرية وتعليمية عامة فقط. النتائج مبنية على المعطيات التي تُدخلها والمعادلات المستخدمة في كل حاسبة، وقد لا تعكس بدقة وضعك الفعلي أو الشروط الرسمية لأي جهة.",
          ],
        },
        {
          heading: "ليست استشارة متخصصة",
          body: [
            "لا تُعد نتائج أي حاسبة بديلاً عن استشارة مختص — سواء كان مستشارًا ماليًا، طبيبًا، أخصائي تغذية، عالِم شرعي، أو محاميًا. راجع إخلاءات المسؤولية الإضافية (المالية والصحية) لتفاصيل أكثر تحديدًا.",
          ],
        },
      ],
      en: [
        {
          heading: "An estimation tool",
          body: [
            "Every calculator on Hesabi is designed for general estimation and educational purposes only. Results are based on the inputs you provide and the formulas used in each calculator, and may not precisely reflect your actual situation or any official party's terms.",
          ],
        },
        {
          heading: "Not professional advice",
          body: [
            "No calculator's output is a substitute for consulting a qualified professional — a financial advisor, physician, registered dietitian, religious scholar, or lawyer. See our additional financial and health disclaimers for more specific guidance.",
          ],
        },
      ],
    },
  },
  {
    slug: "financial-disclaimer",
    title: { ar: "إخلاء المسؤولية المالية", en: "Financial Disclaimer" },
    description: { ar: "إخلاء مسؤولية خاص بالحاسبات المالية.", en: "Disclaimer specific to the financial calculators." },
    sections: {
      ar: [
        {
          heading: "ليست نصيحة مالية",
          body: [
            "حاسبات القروض، الأقساط، الرواتب، الزكاة، وضريبة القيمة المضافة على حسابي مخصصة للتقدير العام فقط، وليست نصيحة استثمارية أو مالية أو ضريبية أو شرعية رسمية.",
            "الأسعار والنسب المستخدمة (مثل أسعار الذهب أو أسعار الصرف) قد تكون قيمًا افتراضية أو يدوية الإدخال وليست بيانات سوق حية — تحقق دائمًا من المصدر الرسمي قبل اتخاذ أي قرار مالي.",
          ],
        },
        {
          heading: "الزكاة تحديدًا",
          body: [
            "حاسبة الزكاة تقدّم تقديرًا عامًا وفق قواعد شائعة وليست فتوى شرعية. استشر عالمًا شرعيًا موثوقًا أو الجهة الرسمية المختصة بالزكاة في بلدك لحكم دقيق يناسب حالتك.",
          ],
        },
      ],
      en: [
        {
          heading: "Not financial advice",
          body: [
            "The loan, installment, salary, zakat, and VAT calculators on Hesabi are for general estimation only, and are not official investment, financial, tax, or religious advice.",
            "Rates and prices used (e.g. gold prices or exchange rates) may be indicative defaults or manually entered, not live market data — always verify with an official source before making a financial decision.",
          ],
        },
        {
          heading: "Zakat specifically",
          body: [
            "The Zakat calculator provides a general estimate based on commonly-cited rules and is not a religious ruling (fatwa). Consult a trusted scholar or your country's official zakat authority for guidance specific to your situation.",
          ],
        },
      ],
    },
  },
  {
    slug: "health-disclaimer",
    title: { ar: "إخلاء المسؤولية الصحية", en: "Health Disclaimer" },
    description: { ar: "إخلاء مسؤولية خاص بحاسبات السعرات والبروتين.", en: "Disclaimer specific to the calorie and protein calculators." },
    sections: {
      ar: [
        {
          heading: "ليست استشارة طبية",
          body: [
            "حاسبتا السعرات الحرارية والبروتين تقدّمان تقديرات عامة مبنية على معادلات تغذية شائعة (مثل معادلة Mifflin-St Jeor)، وليست استشارة طبية أو غذائية أو خطة علاجية.",
            "قد تختلف الاحتياجات الفعلية باختلاف الحالة الصحية، الأدوية، الحمل والرضاعة، أو أي ظروف طبية خاصة. استشر طبيبًا أو أخصائي تغذية مرخصًا قبل إجراء تغييرات غذائية كبيرة، خصوصًا إن كانت لديك حالة صحية مزمنة.",
          ],
        },
      ],
      en: [
        {
          heading: "Not medical advice",
          body: [
            "The calorie and protein calculators provide general estimates based on common nutrition formulas (such as the Mifflin-St Jeor equation), and are not medical, dietary, or treatment advice.",
            "Actual needs vary by health status, medications, pregnancy/breastfeeding, or other medical conditions. Consult a physician or a licensed dietitian before making significant dietary changes, especially with a chronic health condition.",
          ],
        },
      ],
    },
  },
  {
    slug: "data-sources",
    title: { ar: "مصادر البيانات", en: "Data Sources" },
    description: { ar: "من أين تأتي الأرقام والنسب المستخدمة في الحاسبات.", en: "Where the figures and rates used across our calculators come from." },
    sections: {
      ar: [
        {
          heading: "أسعار الذهب والعملات",
          body: [
            "أسعار الذهب وأسعار صرف العملات المعروضة كقيم افتراضية هي أسعار إرشادية للتجربة فقط، أو يمكن إدخالها يدويًا. لا نُجري حاليًا أي اتصال ببيانات سوق حية — لا توجد مفاتيح API فعّالة لأي مزوّد بيانات مباشر في هذا الإصدار.",
          ],
        },
        {
          heading: "ضريبة القيمة المضافة",
          body: ["نسبة 15% الافتراضية مستمدة من هيئة الزكاة والضريبة والجمارك (زاتكا) في المملكة العربية السعودية، وهي النسبة القياسية منذ يوليو 2020."],
        },
        {
          heading: "أسعار الوقود",
          body: ["أسعار الوقود المعروضة كقيم افتراضية أمثلة إرشادية لأغراض العرض فقط، وقد تختلف عن السعر الفعلي عند نقطة البيع."],
        },
        {
          heading: "المعادلات الصحية والتغذوية",
          body: ["حاسبة السعرات تستخدم معادلة Mifflin-St Jeor، وحاسبة البروتين تستخدم مدى غرامات لكل كيلوغرام من وزن الجسم مبني على أبحاث تغذية رياضية شائعة."],
        },
      ],
      en: [
        {
          heading: "Gold and currency rates",
          body: [
            "The default gold prices and exchange rates shown are indicative demo values, or can be entered manually. We do not currently connect to any live market data feed — no live API keys are wired up in this release.",
          ],
        },
        {
          heading: "VAT",
          body: ["The default 15% rate is sourced from ZATCA (Zakat, Tax and Customs Authority) in Saudi Arabia, the standard rate since July 2020."],
        },
        {
          heading: "Fuel prices",
          body: ["The default fuel prices shown are indicative example values for demo purposes only and may differ from actual pump prices."],
        },
        {
          heading: "Health & nutrition formulas",
          body: ["The calorie calculator uses the Mifflin-St Jeor equation; the protein calculator uses a grams-per-kg-of-bodyweight range based on common sports nutrition research."],
        },
      ],
    },
  },
];

export const LEGAL_UPDATED = UPDATED_ISO;
