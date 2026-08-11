/**
 * MIHSAB wordmark icon.
 *
 * Concept: a single abstracted stroke inspired by the bowl-and-tail shape of
 * the Arabic letter ح ("h" — the platform's core letter, from "al-miḥsāb")
 * that resolves into a checkmark tick at its end. The open curve reads as
 * both "precision/calculation" (a balanced, deliberate arc) and "correct
 * result" (the tick), tying the mark to the tagline "احسبها... صح." /
 * "Calculate it right." Drawn as clean geometric strokes only — one arc,
 * one short tick — so it stays legible from favicon size (16px) up through
 * header size (~40px).
 */
export default function Logo({
  size = 32,
  monochrome = false,
  className,
}: {
  size?: number;
  monochrome?: boolean;
  className?: string;
}) {
  const stroke = monochrome ? "currentColor" : "var(--color-accent, #0f6f66)";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="MIHSAB"
    >
      <circle cx="20" cy="20" r="18.5" stroke={stroke} strokeWidth="2" opacity="0.35" />
      <path
        d="M12 15.5C12 12.5 14.5 10.5 18 11.5C21.5 12.5 22.5 16 20.5 19.5C18.7 22.6 13.5 24.2 13.5 28.5C13.5 24.7 18 24 21 24.5"
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.5 26.5L24.5 29.5L29.5 22.5"
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
