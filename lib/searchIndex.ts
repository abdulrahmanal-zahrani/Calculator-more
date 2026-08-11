/**
 * Search keyword index — maps each calculator slug to extra bilingual
 * search synonyms beyond its own name/description, so users can find a
 * calculator via a related everyday term (e.g. "ذهب" also surfaces Zakat
 * and Currency, "سيارة" surfaces Fuel/Car Loan/Maintenance/Trip Cost).
 */
export const SEARCH_KEYWORDS: Record<string, string[]> = {
  "gold-calculator": ["ذهب", "gold", "عيار", "karat", "مجوهرات", "jewelry"],
  "zakat-calculator": ["زكاة", "zakat", "ذهب", "gold", "نصاب", "nisab"],
  "salary-calculator": ["راتب", "salary", "دخل", "income", "صافي", "net pay"],
  "currency-converter": ["عملة", "currency", "صرف", "exchange", "دولار", "dollar", "ريال"],
  "discount-calculator": ["خصم", "discount", "تخفيض", "sale", "عرض", "offer"],
  "loan-calculator": ["قرض", "loan", "تمويل", "financing", "قسط", "installment"],
  "vat-calculator": ["ضريبة", "vat", "قيمة مضافة", "tax", "زاتكا", "zatca"],
  "installment-calculator": ["قسط", "installment", "تقسيط", "دفعة"],
  "fuel-cost-calculator": ["وقود", "fuel", "بنزين", "gas", "petrol", "سيارة", "car"],
  "car-loan-calculator": ["سيارة", "car", "تمويل سيارة", "auto loan", "قرض سيارة"],
  "insurance-comparison-calculator": ["تأمين", "insurance", "سيارة", "car", "بوليصة", "policy"],
  "maintenance-cost-calculator": ["صيانة", "maintenance", "سيارة", "car", "زيت", "oil", "إطارات", "tires"],
  "v60-calculator": ["قهوة", "coffee", "v60", "تقطير", "pour over", "فرنش برس", "french press", "إيروبرس", "aeropress", "كيمكس", "chemex", "كولد برو", "cold brew"],
  "recipe-scaling-calculator": ["وصفة", "recipe", "طبخ", "cooking", "مقادير", "ingredients"],
  "calorie-calculator": ["سعرات", "calories", "دايت", "diet", "وزن", "weight", "bmr"],
  "protein-calculator": ["بروتين", "protein", "عضلات", "muscle", "لياقة", "fitness"],
  "trip-budget-calculator": ["رحلة", "trip", "سفر", "travel", "ميزانية", "budget"],
  "travel-fuel-calculator": ["سفر", "travel", "وقود", "fuel", "رحلة برية", "road trip"],
  "luggage-calculator": ["أمتعة", "luggage", "حقيبة", "bag", "طيران", "airline", "وزن", "weight"],
  "time-zone-calculator": ["توقيت", "time zone", "فرق التوقيت", "ساعة", "clock", "world time"],
};
