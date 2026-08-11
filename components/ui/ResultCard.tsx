interface ResultCardProps {
  label: string;
  value: string;
  hint?: string;
}

export default function ResultCard({ label, value, hint }: ResultCardProps) {
  return (
    <div className="rounded-[var(--radius-xl)] bg-accent-soft px-6 py-8 text-center">
      <p className="text-sm font-medium text-text-muted">{label}</p>
      <p className="mt-2 text-4xl font-bold tabular-nums text-accent sm:text-5xl">{value}</p>
      {hint && <p className="mt-2 text-sm text-text-faint">{hint}</p>}
    </div>
  );
}
