import Link from "next/link";

interface BreadcrumbsProps {
  items: { label: string; href?: string }[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-text-faint">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {item.href ? (
              <Link href={item.href} className="hover:text-accent">
                {item.label}
              </Link>
            ) : (
              <span className="text-text-muted">{item.label}</span>
            )}
            {i < items.length - 1 && <span className="rtl:rotate-180">›</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
