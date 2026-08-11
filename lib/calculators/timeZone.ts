export interface TimeZoneCity {
  id: string;
  timeZone: string;
  name: { ar: string; en: string };
}

// Saudi + a broad set of major world cities. IANA tz data is built into the
// JS runtime (Intl), so no external timezone database is required.
export const TIME_ZONE_CITIES: TimeZoneCity[] = [
  { id: "riyadh", timeZone: "Asia/Riyadh", name: { ar: "الرياض", en: "Riyadh" } },
  { id: "jeddah", timeZone: "Asia/Riyadh", name: { ar: "جدة", en: "Jeddah" } },
  { id: "dammam", timeZone: "Asia/Riyadh", name: { ar: "الدمام", en: "Dammam" } },
  { id: "dubai", timeZone: "Asia/Dubai", name: { ar: "دبي", en: "Dubai" } },
  { id: "doha", timeZone: "Asia/Qatar", name: { ar: "الدوحة", en: "Doha" } },
  { id: "kuwait", timeZone: "Asia/Kuwait", name: { ar: "الكويت", en: "Kuwait City" } },
  { id: "cairo", timeZone: "Africa/Cairo", name: { ar: "القاهرة", en: "Cairo" } },
  { id: "amman", timeZone: "Asia/Amman", name: { ar: "عمّان", en: "Amman" } },
  { id: "istanbul", timeZone: "Europe/Istanbul", name: { ar: "إسطنبول", en: "Istanbul" } },
  { id: "london", timeZone: "Europe/London", name: { ar: "لندن", en: "London" } },
  { id: "paris", timeZone: "Europe/Paris", name: { ar: "باريس", en: "Paris" } },
  { id: "newyork", timeZone: "America/New_York", name: { ar: "نيويورك", en: "New York" } },
  { id: "losangeles", timeZone: "America/Los_Angeles", name: { ar: "لوس أنجلوس", en: "Los Angeles" } },
  { id: "toronto", timeZone: "America/Toronto", name: { ar: "تورونتو", en: "Toronto" } },
  { id: "tokyo", timeZone: "Asia/Tokyo", name: { ar: "طوكيو", en: "Tokyo" } },
  { id: "singapore", timeZone: "Asia/Singapore", name: { ar: "سنغافورة", en: "Singapore" } },
  { id: "kualalumpur", timeZone: "Asia/Kuala_Lumpur", name: { ar: "كوالالمبور", en: "Kuala Lumpur" } },
  { id: "jakarta", timeZone: "Asia/Jakarta", name: { ar: "جاكرتا", en: "Jakarta" } },
  { id: "karachi", timeZone: "Asia/Karachi", name: { ar: "كراتشي", en: "Karachi" } },
  { id: "mumbai", timeZone: "Asia/Kolkata", name: { ar: "مومباي", en: "Mumbai" } },
  { id: "sydney", timeZone: "Australia/Sydney", name: { ar: "سيدني", en: "Sydney" } },
];

export interface TimeZoneConversionResult {
  fromFormatted: string;
  toFormatted: string;
  offsetHours: number;
}

/**
 * Converts a given date/time from one IANA time zone to another and reports
 * the current UTC-offset difference. DST-aware because it relies on the
 * runtime's Intl/IANA tz database rather than a fixed offset table.
 */
export function convertTimeZone(dateTimeIso: string, fromTz: string, toTz: string): TimeZoneConversionResult {
  const date = new Date(dateTimeIso);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date/time value.");
  }

  const fromFormatted = formatInTimeZone(date, fromTz);
  const toFormatted = formatInTimeZone(date, toTz);
  const offsetHours = round2(getUtcOffsetHours(date, toTz) - getUtcOffsetHours(date, fromTz));

  return { fromFormatted, toFormatted, offsetHours };
}

function formatInTimeZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function getUtcOffsetHours(date: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(date).reduce<Record<string, string>>((acc, p) => {
    acc[p.type] = p.value;
    return acc;
  }, {});
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );
  return (asUtc - date.getTime()) / 3600000;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
