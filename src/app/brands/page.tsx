import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BrandCard } from "@/components/brands/brand-card";
import { BrandGrid } from "@/components/home/brand-grid";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { brands } from "@/data/brands";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Fragrance Houses",
  description:
    "Browse the fragrance houses carried by Scentora — from heritage maisons such as Dior and Chanel to modern niche labels.",
};

export default function BrandsPage() {
  const countFor = (brandName: string) =>
    products.filter((product) => product.brand === brandName).length;

  const niche = brands.filter((brand) => brand.niche);
  const designer = brands.filter((brand) => !brand.niche);

  return (
    <>
      <header className="border-b border-[var(--sc-line)] bg-[var(--sc-paper)]">
        <div className="page-shell py-14 sm:py-20">
          <p className="eyebrow">The directory</p>
          <h1 className="mt-3 max-w-3xl text-[length:var(--text-section)] leading-[1.1] text-[var(--sc-charcoal)] text-balance">
            The houses we carry
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--sc-muted)] text-pretty">
            {brands.length} fragrance houses, from heritage maisons to modern niche labels. Select
            any house to see the fragrances we hold in decanted sizes.
          </p>
        </div>
      </header>

      <section className="page-shell py-16 sm:py-20">
        <Reveal>
          <SectionHeading
            eyebrow="All houses"
            title="Every brand in the catalogue"
            description="Wordmarks are rendered typographically — no third-party logo files are used."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand, index) => (
            <Reveal key={brand.slug} delay={(index % 3) * 0.05}>
              <BrandCard brand={brand} count={countFor(brand.name)} className="h-full" />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--sc-line)] bg-[var(--sc-paper)] py-16 sm:py-20">
        <div className="page-shell">
          <Reveal>
            <SectionHeading
              eyebrow="Niche & prestige"
              title="The connoisseur's shelf"
              description="Houses with smaller production, deeper formulations and less shelf presence."
            />
          </Reveal>
          <Reveal delay={0.06} className="mt-8">
            <BrandGrid slugs={niche.map((brand) => brand.slug)} columns={5} />
          </Reveal>
        </div>
      </section>

      <section className="page-shell py-16 sm:py-20">
        <Reveal>
          <SectionHeading
            eyebrow="Designer houses"
            title="The names you already know"
            description="Everyday signatures and modern classics, decanted so you can try before you buy."
          />
        </Reveal>
        <Reveal delay={0.06} className="mt-8">
          <BrandGrid slugs={designer.map((brand) => brand.slug)} columns={5} />
        </Reveal>

        <div className="mt-12 flex justify-center">
          <Link href="/shop" className="btn-primary">
            Explore the full collection
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
