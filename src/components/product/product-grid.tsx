import { ProductCard } from "@/components/product/product-card";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  /** Number of columns on wide screens. */
  columns?: 3 | 4;
  hideSizes?: boolean;
  className?: string;
  emptyMessage?: string;
}

/**
 * Responsive product grid.
 * 4 columns on wide desktop, 3 on medium screens, 2 on mobile.
 */
export function ProductGrid({
  products,
  columns = 4,
  hideSizes = false,
  className,
  emptyMessage = "No fragrances match your selection.",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border border-dashed border-[var(--sc-line)] bg-[var(--sc-paper)] px-6 py-20 text-center">
        <p className="font-serif text-[22px] text-[var(--sc-charcoal)]">Nothing found</p>
        <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-[var(--sc-muted)]">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-5 lg:grid-cols-3 xl:gap-x-6",
        columns === 4 && "xl:grid-cols-4",
        className,
      )}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          hideSizes={hideSizes}
          index={index}
        />
      ))}
    </div>
  );
}
