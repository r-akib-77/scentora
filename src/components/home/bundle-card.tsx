"use client";

import Link from "next/link";
import { Check, ShoppingBag } from "lucide-react";
import { useState } from "react";

import { SmartImage } from "@/components/ui/smart-image";
import { resolveBundleItems } from "@/data/bundles";
import { formatPrice, sizeLabel } from "@/lib/utils";
import { useCart } from "@/providers/cart-provider";
import { useToast } from "@/providers/toast-provider";
import type { Bundle } from "@/types";

interface BundleCardProps {
  bundle: Bundle;
  className?: string;
}

/**
 * A curated bundle. Adding a bundle adds each of its decants to the bag as
 * its own line, so the per-line pricing stays consistent with the rest of
 * the storefront.
 */
export function BundleCard({ bundle, className }: BundleCardProps) {
  const { addItem, openCart } = useCart();
  const { pushToast } = useToast();
  const [adding, setAdding] = useState(false);

  const items = resolveBundleItems(bundle);
  const originalTotal = items.reduce((sum, item) => sum + item.price, 0);
  const saving = Math.max(0, originalTotal - bundle.bundlePrice);

  const handleAdd = () => {
    setAdding(true);
    items.forEach((item) => {
      addItem(item.product, item.size, 1);
    });
    pushToast({
      title: "Bundle added to your bag",
      description: `${bundle.name} · ${items.length} decants`,
      variant: "success",
    });
    window.setTimeout(() => {
      setAdding(false);
      openCart();
    }, 260);
  };

  return (
    <article
      className={`group flex h-full flex-col border border-[var(--sc-line)] bg-[var(--sc-ivory)] transition-colors duration-300 hover:border-[var(--sc-gold)]/60 ${className ?? ""}`}
    >
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-[var(--sc-paper)]">
        <SmartImage
          src={bundle.image}
          alt={bundle.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        {bundle.badge ? (
          <span className="absolute left-3 top-3 bg-[var(--sc-ivory)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--sc-charcoal)]">
            {bundle.badge}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-[21px] leading-tight text-[var(--sc-charcoal)]">
          {bundle.name}
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-[var(--sc-muted)]">
          {bundle.description}
        </p>

        <ul className="mt-4 space-y-1.5">
          {items.map((item) => (
            <li
              key={`${item.product.id}-${item.size}`}
              className="flex items-start gap-2 text-[12px] text-[var(--sc-muted)]"
            >
              <Check className="mt-0.5 size-3 shrink-0 text-[var(--sc-gold)]" aria-hidden="true" />
              <span>
                {item.product.brand} {item.product.name}
                <span className="text-[var(--sc-muted)]/70"> · {sizeLabel(item.size)}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-[var(--sc-line)] pt-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--sc-muted)]">
              Bundle price
            </p>
            <p className="price font-serif text-[22px] leading-tight text-[var(--sc-charcoal)]">
              {formatPrice(bundle.bundlePrice)}
            </p>
            {saving > 0 ? (
              <p className="mt-0.5 text-[11px] text-[var(--sc-muted)] line-through">
                {formatPrice(originalTotal)}
              </p>
            ) : null}
          </div>
          {saving > 0 ? (
            <span className="border border-[var(--sc-gold)] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--sc-gold)]">
              Save {formatPrice(saving)}
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={adding}
          className="btn-primary mt-4 w-full disabled:opacity-60"
        >
          <ShoppingBag className="size-3.5" aria-hidden="true" />
          {adding ? "Adding…" : "Add Bundle"}
        </button>

        <Link
          href="/combos"
          className="btn-ghost mt-2 w-full py-1"
          aria-label={`View all bundles in ${bundle.name}`}
        >
          View bundle details
        </Link>
      </div>
    </article>
  );
}
