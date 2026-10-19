import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

import { BrandGrid } from "@/components/home/brand-grid";
import { BundleCard } from "@/components/home/bundle-card";
import { CategoryCard } from "@/components/home/category-card";
import { FAQAccordion } from "@/components/home/faq-accordion";
import { HeroSection } from "@/components/home/hero-section";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { TestimonialCard } from "@/components/home/testimonial-card";
import { TrustPoints } from "@/components/home/trust-points";
import { FragranceFinder } from "@/components/finder/fragrance-finder";
import { ProductGrid } from "@/components/product/product-grid";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { bundles, categories } from "@/data/bundles";
import { faqs, testimonials } from "@/data/content";
import { products } from "@/data/products";

/** Resolve a list of slugs to products, falling back to an automatic pick. */
function pickProducts(slugs: string[], fallback: (product: (typeof products)[number]) => boolean) {
  const chosen = slugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is (typeof products)[number] => Boolean(product));
  if (chosen.length > 0) return chosen;
  return products.filter(fallback).slice(0, 6);
}

export default function HomePage() {
  const { sections } = siteConfig;

  const featured = pickProducts(
    siteConfig.featuredProductSlugs,
    (product) => product.featured,
  );
  const bestsellers = pickProducts(
    siteConfig.bestsellerProductSlugs,
    (product) => product.bestseller,
  );

  return (
    <>
      <HeroSection />

      {/* Categories ------------------------------------------------------- */}
      <section className="page-shell py-20 sm:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Browse"
            title={sections.categoriesTitle}
            description={sections.categoriesSubtitle}
            action={
              <Link href="/shop" className="btn-outline">
                All fragrances
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            }
          />
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Reveal key={category.slug} delay={index * 0.06}>
              <CategoryCard
                category={category}
                className="h-full [&>div]:h-full"
              />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured --------------------------------------------------------- */}
      <section className="bg-[var(--sc-paper)] py-20 sm:py-24">
        <div className="page-shell">
          <Reveal>
            <SectionHeading
              eyebrow="The edit"
              title={sections.featuredTitle}
              description={sections.featuredSubtitle}
              action={
                <Link href="/shop" className="btn-outline">
                  Shop all
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              }
            />
          </Reveal>

          <div className="mt-10">
            <ProductGrid products={featured} columns={4} />
          </div>
        </div>
      </section>

      {/* Bestsellers ------------------------------------------------------ */}
      <section className="page-shell py-20 sm:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Reordered"
            title={sections.bestsellersTitle}
            description={sections.bestsellersSubtitle}
            action={
              <Link href="/shop?sort=popularity" className="btn-outline">
                See all bestsellers
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            }
          />
        </Reveal>

        <div className="mt-10">
          <ProductGrid products={bestsellers} columns={4} />
        </div>
      </section>

      {/* Bundles ---------------------------------------------------------- */}
      <section className="border-y border-[var(--sc-line)] bg-[var(--sc-paper)] py-20 sm:py-24">
        <div className="page-shell">
          <Reveal>
            <SectionHeading
              eyebrow="Curated sets"
              title={sections.bundlesTitle}
              description={sections.bundlesSubtitle}
              action={
                <Link href="/combos" className="btn-outline">
                  All bundles
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              }
            />
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {bundles.slice(0, 3).map((bundle, index) => (
              <Reveal key={bundle.id} delay={index * 0.07}>
                <BundleCard bundle={bundle} className="h-full" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Finder ----------------------------------------------------------- */}
      <section className="page-shell py-20 sm:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Discovery"
            title={sections.finderTitle}
            description={sections.finderSubtitle}
            align="center"
          />
        </Reveal>

        <Reveal delay={0.08} className="mx-auto mt-10 max-w-4xl">
          <FragranceFinder />
        </Reveal>

        <div className="mt-6 flex justify-center">
          <Link href="/fragrance-guide" className="btn-ghost">
            <Compass className="size-3.5" aria-hidden="true" />
            Read the full fragrance guide
          </Link>
        </div>
      </section>

      {/* Brands ----------------------------------------------------------- */}
      <section className="bg-[var(--sc-paper)] py-20 sm:py-24">
        <div className="page-shell">
          <Reveal>
            <SectionHeading
              eyebrow="The directory"
              title={sections.brandsTitle}
              description={sections.brandsSubtitle}
              action={
                <Link href="/brands" className="btn-outline">
                  All houses
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              }
            />
          </Reveal>

          <Reveal delay={0.06} className="mt-10">
            <BrandGrid columns={5} />
          </Reveal>
        </div>
      </section>

      {/* Trust ------------------------------------------------------------ */}
      <section id="why-us" className="page-shell py-20 sm:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Why shop with us"
            title="Decanting, done properly"
            description="Everything about the Scentora experience — written for this demo and easy to rewrite for a real business."
            align="center"
          />
        </Reveal>

        <Reveal delay={0.06} className="mt-10">
          <TrustPoints columns={3} />
        </Reveal>
      </section>

      {/* Testimonials ----------------------------------------------------- */}
      <section className="bg-[var(--sc-paper)] py-20 sm:py-24">
        <div className="page-shell">
          <Reveal>
            <SectionHeading
              eyebrow="In their words"
              title={sections.testimonialsTitle}
              description={sections.testimonialsSubtitle}
              align="center"
            />
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <Reveal key={testimonial.id} delay={index * 0.07}>
                <TestimonialCard testimonial={testimonial} className="h-full" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ -------------------------------------------------------------- */}
      <section className="page-shell py-20 sm:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Need to know"
            title={sections.faqTitle}
            description={sections.faqSubtitle}
          />
        </Reveal>

        <Reveal delay={0.06} className="mt-8">
          <FAQAccordion items={faqs.slice(0, 5)} />
        </Reveal>

        <div className="mt-6">
          <Link href="/fragrance-guide" className="btn-ghost">
            More questions answered in the guide
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Newsletter ------------------------------------------------------- */}
      <section className="border-t border-[var(--sc-line)] bg-[var(--sc-charcoal)] py-16 sm:py-20">
        <div className="page-shell grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <h2 className="text-[length:var(--text-section)] leading-[1.12] text-[var(--sc-ivory)] text-balance">
              {sections.newsletterTitle}
            </h2>
            <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-white/60">
              {sections.newsletterSubtitle}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <NewsletterForm tone="dark" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
