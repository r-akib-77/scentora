"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

import { ProductSizeSelector } from "@/components/product/product-size-selector";
import { Modal } from "@/components/ui/modal";
import { Rating } from "@/components/ui/rating";
import { SmartImage } from "@/components/ui/smart-image";
import { cn, familyLabels, formatPrice } from "@/lib/utils";
import { useCart } from "@/providers/cart-provider";
import { useToast } from "@/providers/toast-provider";
import { useUI } from "@/providers/ui-provider";
import type { BottleSize } from "@/types";

/**
 * A quick-look modal for any product in the catalogue.
 */
export function ProductQuickView() {
  const { quickViewProduct, closeQuickView } = useUI();
  const { addItem, openCart } = useCart();
  const { pushToast } = useToast();
  const [size, setSize] = useState<BottleSize | null>(null);

  const product = quickViewProduct;
  const activeSize: BottleSize =
    size ?? product?.variants[0]?.size ?? 5;
  const variant = product?.variants.find((item) => item.size === activeSize);
  const price = variant?.price ?? 0;

  const handleAdd = () => {
    if (!product) return;
    addItem(product, activeSize, 1);
    pushToast({
      title: "Added to your bag",
      description: `${product.brand} ${product.name} · ${activeSize} ml`,
      variant: "success",
    });
    closeQuickView();
    openCart();
  };

  return (
    <Modal
      open={Boolean(product)}
      onClose={closeQuickView}
      title={product ? `${product.brand} ${product.name}` : ""}
      description={product?.tagline}
    >
      {product ? (
        <div className="grid gap-0 sm:grid-cols-2">
          <div className="relative aspect-[4/5] w-full bg-[var(--sc-paper)] sm:aspect-auto sm:min-h-[22rem]">
            <SmartImage
              src={product.image}
              alt={`${product.brand} ${product.name} fragrance bottle`}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col p-5 sm:p-7">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--sc-muted)]">
              {product.brand} · {product.concentration}
            </p>
            <h3 className="mt-2 font-serif text-[26px] leading-tight text-[var(--sc-charcoal)]">
              {product.name}
            </h3>
            <p className="mt-1 text-[12px] text-[var(--sc-muted)]">
              {familyLabels[product.family]} · {product.gender === "unisex" ? "Unisex" : product.gender}
            </p>

            <div className="mt-3">
              <Rating value={product.rating} count={product.reviewCount} showCaption />
            </div>

            <p className="mt-4 line-clamp-4 text-[13px] leading-relaxed text-[var(--sc-muted)]">
              {product.description}
            </p>

            <div className="mt-5">
              <p className="field-label">Choose a decant size</p>
              <ProductSizeSelector
                product={product}
                value={activeSize}
                onChange={setSize}
              />
            </div>

            <div className="mt-5 flex items-end justify-between gap-4 border-t border-[var(--sc-line)] pt-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--sc-muted)]">
                  {activeSize} ml decant
                </p>
                <p className="price font-serif text-[24px] leading-tight text-[var(--sc-charcoal)]">
                  {formatPrice(price)}
                </p>
              </div>
              <p className="text-[11px] text-[var(--sc-muted)]">
                {product.notes.top.slice(0, 3).join(" · ")}
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button type="button" onClick={handleAdd} className="btn-primary flex-1">
                Add to Bag
              </button>
              <Link
                href={`/product/${product.slug}`}
                onClick={closeQuickView}
                className={cn("btn-outline flex-1")}
              >
                Full details
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
