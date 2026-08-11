import { SelectHTMLAttributes, forwardRef, useId } from "react";
import clsx from "@/lib/clsx";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, className, id, children, ...props }, ref) => {
    // Same htmlFor/id association fix as Input — generate a stable id when
    // none is passed explicitly.
    const generatedId = useId();
    const selectId = id ?? generatedId;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-text-muted">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={clsx(
            "w-full rounded-[var(--radius-md)] border border-border bg-bg-elevated px-3.5 py-2.5 text-text outline-none transition-colors focus:border-accent",
            className
          )}
          {...props}
        >
          {children}
        </select>
      </div>
    );
  }
);
Select.displayName = "Select";

export default Select;
