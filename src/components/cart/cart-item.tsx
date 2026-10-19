"use client";

import Link from "next/link";
import { Minus, Plus, Trash } from "lucide-react";

import { SmartImage } from "@/components/ui/smart-image";
import { formatPrice, sizeLabel } from "@/lib/utils";
import { useCart } from "@/providers/cart-provider";
import type { CartLine } from "@/types";

/** A single line inside the shopping bag. */
export function CartItem({ line }: { line: CartLine }) {
  const { setQuantity, removeItem } = useCart();
  const lineTotal = line.price * line.quantity;

  return (
    <li className="flex gap-4 border-b border-[var(--sc-line)] py-4 last:border-b-0">
      <Link
        href={`/product/${line.slug}`}
        className="relative block size-24 shrink-0 overflow-hidden bg-[var(--sc-paper)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sc-gold)]"
      >
        <SmartImage
          src={line.image}
          alt={`${line.brand} ${line.name}`}
          fill
          sizes="96px"
          className="object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--sc-muted)]">
              {line.brand}
            </p>
            <h3 className="mt-0.5 truncate font-serif text-[17px] leading-tight text-[var(--sc-charcoal)]">
              <Link
                href={`/product/${line.slug}`}
                className="transition-colors hover:text-[var(--sc-gold)]"
              >
                {line.name}
              </Link>
            </h3>
            <p className="mt-1 text-[11px] text-[var(--sc-muted)]">
              Decant · {sizeLabel(line.size)} · {formatPrice(line.price)} each
            </p>
          </div>
          <p className="price shrink-0 font-serif text-[16px] text-[var(--sc-charcoal)]">
            {formatPrice(lineTotal)}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center border border-[var(--sc-line)]">
            <button
              type="button"
              onClick={() => setQuantity(line.key, line.quantity - 1)}
              className="flex size-8 items-center justify-center text-[var(--sc-muted)] transition-colors hover:text-[var(--sc-charcoal)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--sc-gold)]"
              aria-label={`Decrease quantity of ${line.brand} ${line.name}`}
            >
              <Minus className="size-3" aria-hidden="true" />
            </button>
            <span
              className="w-8 text-center text-[13px] tabular-nums text-[var(--sc-charcoal)]"
              aria-live="polite"
            >
              {line.quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(line.key, line.quantity + 1)}
              className="flex size-8 items-center justify-center text-[var(--sc-muted)] transition-colors hover:text-[var(--sc-charcoal)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--sc-gold)]"
              aria-label={`Increase quantity of ${line.brand} ${line.name}`}
            >
              <Plus className="size-3" aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeItem(line.key)}
            className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-[var(--sc-muted)] transition-colors hover:text-[var(--sc-charcoal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sc-gold)]"
          >
            <Trash className="size-3.5" aria-hidden="true" />
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
