/**
 * AdSlot — placeholder for future ad inventory.
 *
 * Placement rules (do not violate):
 *  - Never place inside a form/input area.
 *  - Never place above the primary calculator CTA / result.
 *  - Always visually distinct ("Advertisement" label) and reserve layout
 *    space (fixed min-height) to avoid content layout shift once real ads
 *    are wired in.
 *
 * This renders nothing but a labeled placeholder box in development. Swap
 * the inner content for a real ad network snippet later (e.g. via a client
 * component that loads the ad script only for this slot).
 */
interface AdSlotProps {
  variant?: "inline" | "sidebar";
  label: string;
}

export default function AdSlot({ variant = "inline", label }: AdSlotProps) {
  return (
    <div
      className={
        variant === "inline"
          ? "flex min-h-24 w-full items-center justify-center rounded-[var(--radius-md)] border border-dashed border-border bg-bg-subtle text-xs text-text-faint"
          : "flex min-h-64 w-full items-center justify-center rounded-[var(--radius-md)] border border-dashed border-border bg-bg-subtle text-xs text-text-faint"
      }
    >
      {label}
    </div>
  );
}
