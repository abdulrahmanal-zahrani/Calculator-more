/**
 * Central numeric input normalizer.
 *
 * Accepts ASCII digits, Arabic-Indic digits (٠-٩), and Extended
 * Arabic-Indic/Persian digits (۰-۹), plus Arabic decimal separator
 * (٫ U+066B) and Arabic thousands separator (٬ U+066C), alongside the
 * usual `.`/`,`. Returns `null` (never NaN, never throws) for invalid
 * input so callers can show a validation message.
 */

const ARABIC_INDIC_DIGITS = "٠١٢٣٤٥٦٧٨٩"; // U+0660-U+0669
const EXTENDED_ARABIC_INDIC_DIGITS = "۰۱۲۳۴۵۶۷۸۹"; // U+06F0-U+06F9

const DIGIT_MAP: Record<string, string> = {};
for (let i = 0; i < 10; i++) {
  DIGIT_MAP[ARABIC_INDIC_DIGITS[i]] = String(i);
  DIGIT_MAP[EXTENDED_ARABIC_INDIC_DIGITS[i]] = String(i);
}

const ARABIC_DECIMAL_SEPARATOR = "٫"; // ٫
const ARABIC_THOUSANDS_SEPARATOR = "٬"; // ٬

export function normalizeNumericInput(raw: string): number | null {
  if (raw == null) return null;

  // Strip all whitespace, including Arabic/Unicode whitespace.
  let s = raw.replace(/\s+/gu, "");
  if (s.length === 0) return null;

  // Convert Arabic-Indic / Extended Arabic-Indic digits to ASCII.
  s = s.replace(/[٠-٩۰-۹]/g, (d) => DIGIT_MAP[d] ?? d);

  // Remove thousands separators (Arabic ٬ and ASCII ,) — but ASCII ','
  // is ambiguous with decimal comma, so only strip ',' when it's not the
  // sole/last separator acting as a decimal point. Simplify: strip Arabic
  // thousands separator outright, then normalize remaining separators.
  s = s.split(ARABIC_THOUSANDS_SEPARATOR).join("");

  // Normalize Arabic decimal separator to '.'.
  s = s.split(ARABIC_DECIMAL_SEPARATOR).join(".");

  // Handle ASCII ',' used as thousands grouping (e.g. "1,250") vs decimal
  // comma (e.g. "12,5"). Heuristic: if there's a '.' already, treat ','
  // as a thousands separator and strip it. Otherwise, if ',' appears
  // exactly once and is followed by 1-2 digits at the end, treat it as a
  // decimal separator; if it appears multiple times, treat all as
  // thousands separators and strip.
  const commaCount = (s.match(/,/g) ?? []).length;
  if (commaCount > 0) {
    if (s.includes(".")) {
      s = s.split(",").join("");
    } else if (commaCount === 1 && /,\d{1,2}$/.test(s)) {
      s = s.replace(",", ".");
    } else {
      s = s.split(",").join("");
    }
  }

  // Allow a single leading '-' for negative numbers.
  if (!/^-?\d*\.?\d*$/.test(s)) return null;

  // Reject empty, lone separator, lone sign, or multiple decimal points
  // (already excluded by the regex above, since a second '.' fails it).
  if (s === "" || s === "-" || s === "." || s === "-.") return null;

  // Must contain at least one digit.
  if (!/\d/.test(s)) return null;

  const value = Number(s);
  if (!Number.isFinite(value)) return null;

  return value;
}
