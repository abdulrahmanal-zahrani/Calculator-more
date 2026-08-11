import clsx from "@/lib/clsx";

interface BadgeProps {
  children: React.ReactNode;
  tone?: "accent" | "neutral" | "warning";
}

const toneClasses = {
  accent: "bg-accent-soft text-accent",
  neutral: "bg-bg-subtle text-text-muted",
  warning: "bg-bg-subtle text-warning",
};

export default function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        toneClasses[tone]
      )}
    >
      {children}
    </span>
  );
}
