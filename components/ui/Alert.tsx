import clsx from "@/lib/clsx";

interface AlertProps {
  title: string;
  children: React.ReactNode;
  tone?: "info" | "warning";
}

export default function Alert({ title, children, tone = "info" }: AlertProps) {
  return (
    <div
      className={clsx(
        "rounded-[var(--radius-md)] border px-4 py-3 text-sm",
        tone === "info"
          ? "border-border bg-bg-subtle text-text-muted"
          : "border-warning/30 bg-bg-subtle text-warning"
      )}
    >
      <p className="font-semibold text-text">{title}</p>
      <div className="mt-1 leading-relaxed">{children}</div>
    </div>
  );
}
