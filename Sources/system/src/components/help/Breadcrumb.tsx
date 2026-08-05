'use client';

import Link from 'next/link';

interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="help-breadcrumb" aria-label="Breadcrumb">
      <ol className="bc-list">
        {items.map((item, idx) => (
          <li key={idx} className="bc-item">
            {item.href ? (
              <>
                <Link href={item.href} className="bc-link">
                  {item.label}
                </Link>
                {idx < items.length - 1 && (
                  <span className="bc-sep"> / </span>
                )}
              </>
            ) : (
              <>
                <span className="bc-current">{item.label}</span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
