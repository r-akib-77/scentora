"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { SmartImage } from "@/components/ui/smart-image";
import { products } from "@/data/products";
import { cn, formatPrice } from "@/lib/utils";
import { productFromPrice } from "@/lib/filters";
import { useUI } from "@/providers/ui-provider";

const popularSearches = [
  "Sauvage",
  "Oud",
  "Vanilla",
  "Aquatic",
  "Chanel",
  "Lattafa",
  "Fresh",
  "Musk",
];

/**
 * Full search overlay with live, local results.
 */
export function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useUI();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (isSearchOpen) {
      const timer = window.setTimeout(() => inputRef.current?.focus(), 120);
      return () => window.clearTimeout(timer);
    }
    setQuery("");
    return undefined;
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSearch();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isSearchOpen, closeSearch]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    const tokens = needle.split(/\s+/).filter(Boolean);

    return products
      .map((product) => {
        const haystack = [
          product.name,
          product.brand,
          product.familyLabel,
          product.tagline,
          product.concentration,
          ...product.tags,
          ...product.notes.top,
          ...product.notes.heart,
          ...product.notes.base,
        ]
          .join(" ")
          .toLowerCase();
        const score = tokens.reduce((total, token) => {
          if (product.name.toLowerCase().startsWith(token)) return total + 5;
          if (product.brand.toLowerCase().includes(token)) return total + 4;
          if (haystack.includes(token)) return total + 1;
          return total - 10;
        }, 0);
        return { product, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || b.product.popularity - a.product.popularity)
      .slice(0, 6)
      .map((entry) => entry.product);
  }, [query]);

  return (
    <AnimatePresence>
      {isSearchOpen ? (
        <div className="fixed inset-0 z-[110]">
          <motion.button
            type="button"
            aria-label="Close search"
            onClick={closeSearch}
            className="absolute inset-0 h-full w-full cursor-default bg-[rgba(24,20,16,0.45)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search fragrances"
            className="relative max-h-[86vh] overflow-y-auto bg-[var(--sc-ivory)]"
            initial={reduceMotion ? { opacity: 0 } : { y: -24, opacity: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { y: -16, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="page-shell py-8 sm:py-10">
              <div className="flex items-center justify-between gap-4">
                <p className="eyebrow">Search the catalogue</p>
                <button
                  type="button"
                  onClick={closeSearch}
                  className="flex size-9 items-center justify-center text-[var(--sc-muted)] transition-colors hover:text-[var(--sc-charcoal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sc-gold)]"
                  aria-label="Close search"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-5 flex items-center gap-3 border-b border-[var(--sc-charcoal)] pb-3">
                <Search className="size-5 shrink-0 text-[var(--sc-muted)]" aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Try “oud”, “vanilla”, “Chanel” or a fragrance name"
                  className="w-full bg-transparent font-serif text-[22px] text-[var(--sc-charcoal)] outline-none placeholder:font-sans placeholder:text-[15px] placeholder:text-[var(--sc-muted)] sm:text-[28px]"
                  aria-label="Search fragrances by name, brand or note"
                />
              </div>

              {query.trim().length === 0 ? (
                <div className="mt-7">
                  <p className="eyebrow">Popular searches</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {popularSearches.map((term) => (
                      <li key={term}>
                        <button
                          type="button"
                          onClick={() => setQuery(term)}
                          className="border border-[var(--sc-line)] px-3.5 py-1.5 text-[12px] text-[var(--sc-muted)] transition-colors hover:border-[var(--sc-gold)] hover:text-[var(--sc-charcoal)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sc-gold)]"
                        >
                          {term}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-8 text-[13px] leading-relaxed text-[var(--sc-muted)]">
                    Every fragrance in the catalogue can be decanted from 3 ml upward. Search by
                    house, by name, or by the notes you actually like.
                  </p>
                </div>
              ) : results.length === 0 ? (
                <div className="mt-8 border border-dashed border-[var(--sc-line)] px-6 py-10 text-center">
                  <p className="font-serif text-[20px] text-[var(--sc-charcoal)]">
                    No matches for “{query}”
                  </p>
                  <p className="mt-2 text-[13px] text-[var(--sc-muted)]">
                    Try a brand name, a note, or browse the full collection.
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeSearch}
                    className="btn-primary mt-5"
                  >
                    Browse all fragrances
                  </Link>
                </div>
              ) : (
                <div className="mt-7">
                  <p className="eyebrow">
                    {results.length} result{results.length === 1 ? "" : "s"}
                  </p>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {results.map((product) => (
                      <li key={product.id}>
                        <Link
                          href={`/product/${product.slug}`}
                          onClick={closeSearch}
                          className={cn(
                            "flex items-center gap-4 border border-[var(--sc-line)] p-2.5 transition-colors hover:border-[var(--sc-gold)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sc-gold)]",
                          )}
                        >
                          <span className="relative block size-16 shrink-0 overflow-hidden bg-[var(--sc-paper)]">
                            <SmartImage
                              src={product.image}
                              alt=""
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[10px] uppercase tracking-[0.16em] text-[var(--sc-muted)]">
                              {product.brand}
                            </span>
                            <span className="mt-0.5 block truncate font-serif text-[16px] text-[var(--sc-charcoal)]">
                              {product.name}
                            </span>
                            <span className="mt-0.5 block text-[11px] text-[var(--sc-muted)]">
                              From {formatPrice(productFromPrice(product))}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/shop?q=${encodeURIComponent(query.trim())}`}
                    onClick={closeSearch}
                    className="btn-outline mt-6"
                  >
                    See all results for “{query.trim()}”
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
