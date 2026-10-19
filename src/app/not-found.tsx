import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

import { ProductGrid } from "@/components/product/product-grid";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { products } from "@/data/products";

export default function NotFound() {
  const suggestions = products.filter((product) => product.featured).slice(0, 4);

  return (
    <div className="page-shell py-20 sm:py-28">
      <Reveal>
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-3 max-w-2xl text-[length:var(--text-hero)] leading-[1.08] text-[var(--sc-charcoal)] text-balance">
          This page has evaporated
        </h1>
        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-[var(--sc-muted)] text-pretty">
          The page you were looking for does not exist — it may have been moved, or the link may
          have been mistyped. Let&rsquo;s get you back to something that smells good.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/shop" className="btn-primary">
            Browse the collection
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
          <Link href="/fragrance-guide" className="btn-outline">
            <Compass className="size-3.5" aria-hidden="true" />
            Find your fragrance
          </Link>
        </div>
      </Reveal>

      <div className="mt-20">
        <SectionHeading eyebrow="Suggestions" title="Try one of these instead" />
        <div className="mt-8">
          <ProductGrid products={suggestions} columns={4} />
        </div>
      </div>
    </div>
  );
}
