import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Brand } from "@/types";

interface BrandCardProps {
  brand: Brand;
  /** Number of catalogue fragrances from this house. */
  count: number;
  className?: string;
}

/**
 * An editorial brand card. The wordmark is typographic — no third-party
 * logo files are used anywhere in this project.
 */
export function BrandCard({ brand, count, className }: BrandCardProps) {
  return (
    <Link
      href={`/shop?brand=${encodeURIComponent(brand.name)}`}
      className={cn(
        "group flex h-full flex-col justify-between border border-[var(--sc-line)] bg-[var(--sc-ivory)] p-6 transition-colors duration-300 hover:border-[var(--sc-gold)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sc-gold)] sm:p-7",
        className,
      )}
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <span className="font-serif text-[26px] leading-none tracking-[0.06em] text-[var(--sc-charcoal)] transition-colors group-hover:text-[var(--sc-gold)] sm:text-[30px]">
            {brand.monogram}
          </span>
          <ArrowUpRight
            className="size-4 shrink-0 text-[var(--sc-muted)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--sc-gold)]"
            aria-hidden="true"
          />
        </div>

        <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-[var(--sc-muted)]">
          {brand.origin}
        </p>

        <p className="mt-4 text-[13px] leading-relaxed text-[var(--sc-muted)] text-pretty">
          {brand.description}
        </p>
      </div>

      <div className="mt-6 flex items-center gap-2 border-t border-[var(--sc-line)] pt-4">
        <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--sc-charcoal)]">
          {count} fragrance{count === 1 ? "" : "s"}
        </span>
        {brand.niche ? (
          <span className="border border-[var(--sc-gold)]/50 px-2 py-0.5 text-[9px] uppercase tracking-[0.16em] text-[var(--sc-gold)]">
            Niche
          </span>
        ) : null}
      </div>
    </Link>
  );
}
