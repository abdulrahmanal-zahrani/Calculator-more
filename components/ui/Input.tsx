import { InputHTMLAttributes, forwardRef, useId } from "react";
import clsx from "@/lib/clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  suffix?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, suffix, error, className, id, ...props }, ref) => {
    // Every call site passes `label` without an explicit `id` — generate a
    // stable one so <label htmlFor> always associates with its input
    // (required for screen readers / clicking the label to focus).
    const generatedId = useId();
    const inputId = id ?? generatedId;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-muted">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              "w-full rounded-[var(--radius-md)] border border-border bg-bg-elevated px-3.5 py-2.5 text-text tabular-nums outline-none transition-colors placeholder:text-text-faint focus:border-accent",
              suffix && "pe-14",
              error && "border-danger",
              className
            )}
            {...props}
          />
          {suffix && (
            <span className="absolute end-3.5 text-sm text-text-faint select-none">{suffix}</span>
          )}
        </div>
        {error && <span className="text-sm text-danger">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";

export default Input;
