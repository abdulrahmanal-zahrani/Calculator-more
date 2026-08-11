import { HTMLAttributes } from "react";
import clsx from "@/lib/clsx";

export default function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-[var(--radius-lg)] border border-border bg-bg-elevated shadow-[var(--shadow-sm)]",
        className
      )}
      {...props}
    />
  );
}
