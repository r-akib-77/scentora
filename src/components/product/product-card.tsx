"use client";

import Link from "next/link";
import { Eye, Plus } from "lucide-react";
import { useState } from "react";

import { ProductSizeSelector } from "@/components/product/product-size-selector";
import { Rating } from "@/components/ui/rating";
import { SmartImage } from "@/components/ui/smart-image";
import { cn, familyLabels, formatPrice } from "@/lib/utils";
import { useCart } from "@/providers/cart-provider";
import { useToast } from "@/providers/toast-provider";
import { useUI } from "@/providers/ui-provider";
import type { BottleSize, Product } from "@/types";

interface ProductCardProps {
  product: Product;
  /** Hides the size selector for dense layouts. */
  hideSizes?: boolean;
  className?: string;
  /** Animation index used for staggered reveals. */
  index?: number;
}

export function ProductCard({ product, hideSizes = false, className, index = 0 }: ProductCardProps) {
  const [size, setSize] = useState<BottleSize>(product.variants[0]?.size ?? 5);
  const { addItem, openCart } = useCart();
  const { pushToast } = useToast();
  const { openQuickView } = useUI();

  const variant = product.variants.find((item) => item.size === size) ?? product.variants[0];
  const price = variant?.price ?? 0;
  const hasDiscount = Boolean(variant?.compareAtPrice && variant.compareAtPrice > price);

  const handleAdd = () => {
    addItem(product, size, 1);
    pushToast({
      title: "Added to your bag",
      description: `${product.brand} ${product.name} · ${size} ml`,
      variant: "success",
    });
    openCart();
  };

  return (
    <article
      className={cn("group relative flex flex-col", className)}
      style={{ ["--card-index" as string]: index }}
    >
      <div className="relative overflow-hidden bg-[var(--sc-paper)]">
        <Link
          href={`/product/${product.slug}`}
          className="block aspect-[4/5] w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sc-gold)]"
          aria-label={`View ${product.brand} ${product.name}`}
        >
          <SmartImage
            src={product.image}
            alt={`${product.brand} ${product.name} fragrance bottle`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </Link>

        {product.badge ? (
          <span className="absolute left-3 top-3 bg-[var(--sc-ivory)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--sc-charcoal)]">
            {product.badge}
          </span>
        ) : null}

        {hasDiscount ? (
          <span className="absolute right-3 top-3 bg-[var(--sc-gold)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white">
            Save {formatPrice((variant?.compareAtPrice ?? 0) - price)}
          </span>
        ) : null}

        <button
          type="button"
          onClick={() => openQuickView(product)}
          className="absolute bottom-3 right-3 flex size-9 items-center justify-center bg-[var(--sc-ivory)]/95 text-[var(--sc-charcoal)] opacity-0 shadow-[0_6px_18px_-8px_rgba(24,20,16,0.5)] transition-all duration-300 hover:bg-[var(--sc-charcoal)] hover:text-[var(--sc-ivory)] focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sc-gold)] group-hover:opacity-100"
          aria-label={`Quick view ${product.brand} ${product.name}`}
        >
          <Eye className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--sc-muted)]">
              {product.brand}
            </p>
            <h3 className="mt-1 font-serif text-[19px] leading-snug text-[var(--sc-charcoal)]">
              <Link
                href={`/product/${product.slug}`}
                className="transition-colors hover:text-[var(--sc-gold)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sc-gold)]"
              >
                {product.name}
              </Link>
            </h3>
          </div>
          <div className="shrink-0 text-right">
            <p className="price font-serif text-[17px] leading-tight text-[var(--sc-charcoal)]">
              {formatPrice(price)}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[var(--sc-muted)]">
              {size} ml
            </p>
          </div>
        </div>

        <p className="mt-1.5 text-[12px] text-[var(--sc-muted)]">{product.tagline}</p>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <Rating value={product.rating} count={product.reviewCount} />
          <span className="text-[11px] uppercase tracking-[0.12em] text-[var(--sc-muted)]">
            {familyLabels[product.family]}
          </span>
        </div>

        {!hideSizes ? (
          <div className="mt-3.5">
            <ProductSizeSelector
              product={product}
              value={size}
              onChange={setSize}
              compact
            />
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleAdd}
          className="mt-4 flex w-full items-center justify-center gap-2 border border-[var(--sc-charcoal)] bg-[var(--sc-charcoal)] px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--sc-ivory)] transition-colors duration-200 hover:border-[var(--sc-gold)] hover:bg-[var(--sc-gold)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sc-gold)]"
        >
          <Plus className="size-3.5" aria-hidden="true" />
          Add to Bag
        </button>
      </div>
    </article>
  );
}
