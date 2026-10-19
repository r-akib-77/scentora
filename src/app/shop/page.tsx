import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";

import { CollectionView } from "@/components/shop/collection-view";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop All Fragrances",
  description:
    "Browse the full Scentora catalogue — designer, niche and everyday fragrances available in decanted sizes from 3 ml to 15 ml.",
};

/** Curated entry points shown above the catalogue. */
const collections = [
  {
    label: "Bestsellers",
    query: "sort=popularity",
    description: "The decants our customers reorder most",
  },
  {
    label: "Under ৳1,000",
    query: "max=1000",
    description: "Affordable sizes to start with",
  },
  {
    label: "Mid-range",
    query: "tier=mid-range",
    description: "The everyday signature bracket",
  },
  {
    label: "Premium",
    query: "tier=premium",
    description: "Creed, MFK, Tom Ford and more",
  },
  {
    label: "Oud & Oriental",
    query: "family=oud,amber",
    description: "Dense, resinous and long-lasting",
  },
  {
    label: "Fresh & Aquatic",
    query: "family=fresh,aquatic,citrus",
    description: "For hot, humid days",
  },
];

export default function ShopPage() {
  return (
    <>
      <header className="border-b border-[var(--sc-line)] bg-[var(--sc-paper)]">
        <div className="page-shell py-12 sm:py-16">
          <p className="eyebrow">The collection</p>
          <h1 className="mt-3 max-w-3xl text-[length:var(--text-section)] leading-[1.1] text-[var(--sc-charcoal)] text-balance">
            {products.length} fragrances, decanted your way
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--sc-muted)] text-pretty">
            Designer houses, niche labels and everyday signatures — every one available in decanted
            sizes so you can find the right bottle before you commit to the full size.
          </p>
        </div>
      </header>

      <section id="collections" className="border-b border-[var(--sc-line)]">
        <div className="page-shell flex gap-3 overflow-x-auto py-5 no-scrollbar">
          <span className="flex shrink-0 items-center text-[11px] uppercase tracking-[0.18em] text-[var(--sc-muted)]">
            Collections
          </span>
          {collections.map((collection) => (
            <Link
              key={collection.label}
              href={`/shop?${collection.query}`}
              className="shrink-0 border border-[var(--sc-line)] px-3.5 py-1.5 text-[12px] text-[var(--sc-charcoal)] transition-colors hover:border-[var(--sc-gold)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sc-gold)]"
            >
              {collection.label}
            </Link>
          ))}
        </div>
      </section>

      <Suspense fallback={<CollectionFallback />}>
        <CollectionView />
      </Suspense>
    </>
  );
}

function CollectionFallback() {
  return (
    <div className="page-shell py-16">
      <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-5 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-[4/5] w-full bg-[var(--sc-paper)]" />
            <div className="mt-4 h-3 w-1/3 bg-[var(--sc-paper)]" />
            <div className="mt-2 h-4 w-2/3 bg-[var(--sc-paper)]" />
            <div className="mt-3 h-8 w-full bg-[var(--sc-paper)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
