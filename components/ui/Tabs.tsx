"use client";

import clsx from "@/lib/clsx";

interface TabsProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

export default function Tabs<T extends string>({ options, value, onChange }: TabsProps<T>) {
  return (
    <div className="inline-flex rounded-[var(--radius-md)] border border-border bg-bg-subtle p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={clsx(
            "rounded-[calc(var(--radius-md)-4px)] px-3.5 py-1.5 text-sm font-medium transition-colors",
            value === option.value
              ? "bg-bg-elevated text-accent shadow-[var(--shadow-sm)]"
              : "text-text-muted hover:text-text"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
