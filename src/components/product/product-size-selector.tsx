"use client";

import { cn, formatPrice, sizeLabel } from "@/lib/utils";
import type { BottleSize, Product } from "@/types";

interface ProductSizeSelectorProps {
  product: Product;
  /** Currently selected size. */
  value: BottleSize;
  onChange: (size: BottleSize) => void;
  /** Compact layout for product cards. */
  compact?: boolean;
  className?: string;
}

/**
 * The decant size selector.
 *
 * Selecting a size updates the price everywhere it is displayed, and the
 * chosen size is carried through to the shopping bag as its own line.
 */
export function ProductSizeSelector({
  product,
  value,
  onChange,
  compact = false,
  className,
}: ProductSizeSelectorProps) {
  if (product.variants.length === 0) return null;

  return (
    <div
      role="radiogroup"
      aria-label={`Bottle size for ${product.brand} ${product.name}`}
      className={cn("flex flex-wrap gap-1.5", className)}
    >
      {product.variants.map((variant) => {
        const selected = variant.size === value;
        return (
          <button
            key={variant.size}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(variant.size)}
            className={cn(
              "group flex min-w-0 flex-col items-center justify-center border transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sc-gold)]",
              compact ? "px-2 py-1.5" : "px-3.5 py-2",
              selected
                ? "border-[var(--sc-charcoal)] bg-[var(--sc-charcoal)] text-[var(--sc-ivory)]"
                : "border-[var(--sc-line)] bg-white/70 text-[var(--sc-charcoal)] hover:border-[var(--sc-gold)]",
            )}
          >
            <span
              className={cn(
                "font-medium leading-none",
                compact ? "text-[11px]" : "text-[12px]",
              )}
            >
              {sizeLabel(variant.size)}
            </span>
            <span
              className={cn(
                "mt-0.5 leading-none",
                compact ? "text-[9px]" : "text-[10px]",
                selected ? "text-[var(--sc-gold-soft)]" : "text-[var(--sc-muted)]",
              )}
            >
              {formatPrice(variant.price)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
