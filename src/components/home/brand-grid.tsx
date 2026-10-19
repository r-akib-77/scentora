import Link from "next/link";

import { brands } from "@/data/brands";
import { cn } from "@/lib/utils";

interface BrandGridProps {
  /** Restrict the grid to a subset of brand slugs. */
  slugs?: string[];
  columns?: 3 | 4 | 5;
  className?: string;
}

/**
 * A typographic brand directory. No third-party logo files are used — the
 * wordmark is rendered in the house's own serif face.
 */
export function BrandGrid({ slugs, columns = 5, className }: BrandGridProps) {
  const list = slugs
    ? brands.filter((brand) => slugs.includes(brand.slug))
    : brands;

  return (
    <ul
      className={cn(
        "grid gap-px border border-[var(--sc-line)] bg-[var(--sc-line)]",
        columns === 3 && "grid-cols-2 sm:grid-cols-3",
        columns === 4 && "grid-cols-2 sm:grid-cols-4",
        columns === 5 && "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
        className,
      )}
    >
      {list.map((brand) => (
        <li key={brand.slug} className="bg-[var(--sc-ivory)]">
          <Link
            href={`/shop?brand=${encodeURIComponent(brand.name)}`}
            className="group flex h-full flex-col items-center justify-center gap-1.5 px-3 py-7 text-center transition-colors duration-200 hover:bg-[var(--sc-paper)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--sc-gold)]"
          >
            <span className="font-serif text-[19px] leading-tight tracking-[0.06em] text-[var(--sc-charcoal)] transition-colors group-hover:text-[var(--sc-gold)] sm:text-[21px]">
              {brand.monogram}
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--sc-muted)]">
              {brand.origin}
            </span>
            {brand.niche ? (
              <span className="mt-1 border border-[var(--sc-gold)]/50 px-2 py-0.5 text-[9px] uppercase tracking-[0.16em] text-[var(--sc-gold)]">
                Niche
              </span>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
