/**
 * Centralized design tokens for MIHSAB.
 * The actual CSS custom properties live in app/globals.css (light + dark).
 * This file exposes the same scale to TypeScript/JS consumers (e.g. charts,
 * inline style calculations) so values never drift out of sync conceptually.
 */

export const colors = {
  bg: "var(--color-bg)",
  bgElevated: "var(--color-bg-elevated)",
  bgSubtle: "var(--color-bg-subtle)",
  border: "var(--color-border)",
  borderStrong: "var(--color-border-strong)",
  text: "var(--color-text)",
  textMuted: "var(--color-text-muted)",
  textFaint: "var(--color-text-faint)",
  accent: "var(--color-accent)",
  accentHover: "var(--color-accent-hover)",
  accentSoft: "var(--color-accent-soft)",
  accentContrast: "var(--color-accent-contrast)",
  success: "var(--color-success)",
  warning: "var(--color-warning)",
  danger: "var(--color-danger)",
} as const;

export const radius = {
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
  xl: "var(--radius-xl)",
} as const;

export const spacing = {
  xs: "0.5rem",
  sm: "0.75rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4.5rem",
} as const;

export const brand = {
  name: {
    ar: "المِحساب",
    en: "MIHSAB",
  },
  tagline: {
    ar: "احسبها... صح.",
    en: "Calculate it right.",
  },
} as const;
