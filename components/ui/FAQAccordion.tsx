"use client";

import { useState } from "react";
import clsx from "@/lib/clsx";

export interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border rounded-[var(--radius-lg)] border border-border bg-bg-elevated">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={i}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
            >
              <span className="font-medium text-text">{item.question}</span>
              <span
                className={clsx(
                  "shrink-0 text-text-faint transition-transform",
                  open && "rotate-45"
                )}
              >
                +
              </span>
            </button>
            {open && (
              <div className="px-5 pb-4 text-sm leading-relaxed text-text-muted">{item.answer}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
