"use client";

import { Minus, Plus, ShoppingBag, Truck } from "lucide-react";
import { useState } from "react";

import { ProductSizeSelector } from "@/components/product/product-size-selector";
import { formatPrice, sizeLabel } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { useCart } from "@/providers/cart-provider";
import { useToast } from "@/providers/toast-provider";
import type { BottleSize, Product } from "@/types";

interface ProductPurchasePanelProps {
  product: Product;
}

/** Size, quantity and add-to-bag controls on the product page. */
export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const [size, setSize] = useState<BottleSize>(product.variants[0]?.size ?? 5);
  const [quantity, setQuantity] = useState(1);
  const { addItem, openCart } = useCart();
  const { pushToast } = useToast();

  const variant = product.variants.find((item) => item.size === size) ?? product.variants[0];
  const price = variant?.price ?? 0;
  const lineTotal = price * quantity;

  const handleAdd = () => {
    addItem(product, size, quantity);
    pushToast({
      title: "Added to your bag",
      description: `${product.brand} ${product.name} · ${sizeLabel(size)} × ${quantity}`,
      variant: "success",
    });
    openCart();
  };

  return (
    <div className="mt-7">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--sc-line)] pb-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--sc-muted)]">
            {sizeLabel(size)} decant
          </p>
          <p className="price mt-1 font-serif text-[32px] leading-tight text-[var(--sc-charcoal)]">
            {formatPrice(price)}
          </p>
        </div>
        {quantity > 1 ? (
          <p className="text-[12px] text-[var(--sc-muted)]">
            {quantity} × {formatPrice(price)} ={" "}
            <span className="text-[var(--sc-charcoal)]">{formatPrice(lineTotal)}</span>
          </p>
        ) : null}
      </div>

      <div className="mt-5">
        <p className="field-label">Choose your size</p>
        <ProductSizeSelector product={product} value={size} onChange={setSize} />
        <p className="mt-2 text-[11px] text-[var(--sc-muted)]">
          Each size is decanted from the original bottle. 3 ml gives roughly 30–40 sprays.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-end gap-4">
        <div>
          <p className="field-label">Quantity</p>
          <div className="flex items-center border border-[var(--sc-line)]">
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              className="flex size-10 items-center justify-center text-[var(--sc-muted)] transition-colors hover:text-[var(--sc-charcoal)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--sc-gold)]"
              aria-label="Decrease quantity"
            >
              <Minus className="size-3.5" aria-hidden="true" />
            </button>
            <span
              className="w-10 text-center text-[14px] tabular-nums text-[var(--sc-charcoal)]"
              aria-live="polite"
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.min(20, value + 1))}
              className="flex size-10 items-center justify-center text-[var(--sc-muted)] transition-colors hover:text-[var(--sc-charcoal)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--sc-gold)]"
              aria-label="Increase quantity"
            >
              <Plus className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <button type="button" onClick={handleAdd} className="btn-primary h-[42px] flex-1">
          <ShoppingBag className="size-3.5" aria-hidden="true" />
          Add to Bag
        </button>
      </div>

      <div className="mt-6 flex items-start gap-2.5 border border-[var(--sc-line)] bg-[var(--sc-paper)] p-4">
        <Truck className="mt-0.5 size-4 shrink-0 text-[var(--sc-gold)]" aria-hidden="true" />
        <p className="text-[12px] leading-relaxed text-[var(--sc-muted)]">
          {siteConfig.delivery.headline}. {siteConfig.delivery.body}
        </p>
      </div>
    </div>
  );
}
