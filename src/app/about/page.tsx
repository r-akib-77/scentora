import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { BrandGrid } from "@/components/home/brand-grid";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { TestimonialCard } from "@/components/home/testimonial-card";
import { TrustPoints } from "@/components/home/trust-points";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { SmartImage } from "@/components/ui/smart-image";
import { siteConfig } from "@/config/site";
import { testimonials } from "@/data/content";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About the Boutique",
  description:
    "How Scentora works — decant sizes, sourcing, delivery and the small-print demo notice for this demonstration storefront.",
};

export default function AboutPage() {
  return (
    <>
      <header className="border-b border-[var(--sc-line)] bg-[var(--sc-paper)]">
        <div className="page-shell grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow">About {siteConfig.brand.name}</p>
            <h1 className="mt-3 text-[length:var(--text-section)] leading-[1.1] text-[var(--sc-charcoal)] text-balance">
              A boutique built around the trial
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--sc-muted)] text-pretty">
              {siteConfig.brand.description} The idea is simple: a fragrance should be worn before
              it is bought, and the first bottle should be small enough to take a chance on.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-primary">
                Browse the collection
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
              <Link href="/contact" className="btn-outline">
                Contact us
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--sc-beige)]">
            <SmartImage
              src="/images/categories/woody.jpg"
              alt="Perfume bottles arranged in a boutique display"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </header>

      {/* Demo notice ----------------------------------------------------- */}
      <section className="border-b border-[var(--sc-line)]">
        <div className="page-shell py-8">
          <div className="flex flex-col gap-3 border border-[var(--sc-gold)]/40 bg-[var(--sc-paper)] p-5 sm:flex-row sm:items-start sm:gap-4 sm:p-6">
            <span className="flex size-9 shrink-0 items-center justify-center border border-[var(--sc-gold)]/50 text-[var(--sc-gold)]">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-serif text-[19px] leading-tight text-[var(--sc-charcoal)]">
                This is a demonstration storefront
              </h2>
              <p className="mt-1.5 max-w-3xl text-[13.5px] leading-relaxed text-[var(--sc-muted)]">
                Every product, price, rating, testimonial and delivery promise on this site is
                sample content written to demonstrate the design and the interactions. There is no
                backend, no payment gateway and no order processing behind it. Replace the copy in{" "}
                <code className="bg-[var(--sc-ivory)] px-1.5 py-0.5 text-[12px]">src/config/site.ts</code>{" "}
                and{" "}
                <code className="bg-[var(--sc-ivory)] px-1.5 py-0.5 text-[12px]">src/data/products.ts</code>{" "}
                with your own before going live.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why us ----------------------------------------------------------- */}
      <section id="why-us" className="page-shell scroll-mt-28 py-16 sm:py-20">
        <Reveal>
          <SectionHeading
            eyebrow="Why shop with us"
            title="Six reasons the way we work makes sense"
            description="Sample copy — edit these claims in the site configuration to match what your business can genuinely promise."
            align="center"
          />
        </Reveal>
        <Reveal delay={0.06} className="mt-10">
          <TrustPoints columns={3} />
        </Reveal>
      </section>

      {/* Authenticity ----------------------------------------------------- */}
      <section id="authenticity" className="scroll-mt-28 border-y border-[var(--sc-line)] bg-[var(--sc-paper)] py-16 sm:py-20">
        <div className="page-shell grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="eyebrow">Authenticity &amp; quality</p>
            <h2 className="mt-3 text-[length:var(--text-subhead)] leading-snug text-[var(--sc-charcoal)] text-balance">
              Where the decant comes from
            </h2>
            <div className="mt-4 space-y-4 text-[14px] leading-relaxed text-[var(--sc-muted)] text-pretty">
              <p>
                In a live store this section explains exactly where the original bottle was
                purchased, how it is stored, and how each decant is filled and sealed. The copy
                below is placeholder text written for this template.
              </p>
              <p>
                Replace it with your own sourcing policy — who you buy from, how you verify
                batches, and what a customer can expect to find on the label. Being specific and
                honest here is far more persuasive than any claim of &ldquo;100% original&rdquo;.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <ul className="space-y-3">
              {[
                {
                  title: "Sourced from authorised distributors",
                  body: "Original bottles are bought through the brand's regional distributor, never from unverified resale channels.",
                },
                {
                  title: "Decanted and sealed in-house",
                  body: "Each bottle is filled, capped and labelled by hand, then photographed for the catalogue listing.",
                },
                {
                  title: "Batch-tracked",
                  body: "Every decant carries the batch and decant date so a customer can always see the provenance of their bottle.",
                },
                {
                  title: "Storage conditions",
                  body: "Stock is kept away from direct sunlight and heat so the juice in your decant is as fresh as the day it was filled.",
                },
              ].map((item) => (
                <li
                  key={item.title}
                  className="border border-[var(--sc-line)] bg-[var(--sc-ivory)] p-5"
                >
                  <h3 className="font-serif text-[17px] text-[var(--sc-charcoal)]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--sc-muted)]">
                    {item.body}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Small sizes ------------------------------------------------------ */}
      <section className="page-shell py-16 sm:py-20">
        <Reveal>
          <SectionHeading
            eyebrow="Why decants"
            title="The case for starting small"
            description="Small sizes are not a compromise. They are the part of the fragrance industry that most people actually need."
            align="center"
          />
        </Reveal>

        <Reveal delay={0.06} className="mt-10">
          <dl className="grid gap-px border border-[var(--sc-line)] bg-[var(--sc-line)] sm:grid-cols-2 lg:grid-cols-4">
            {products[0].variants.map((variant) => (
              <div key={variant.size} className="bg-[var(--sc-ivory)] p-6">
                <dt className="font-serif text-[24px] text-[var(--sc-charcoal)]">
                  {variant.size} ml
                </dt>
                <dd className="price mt-1 font-serif text-[17px] text-[var(--sc-gold)]">
                  {formatPrice(variant.price)}
                </dd>
                <dd className="mt-2 text-[12.5px] leading-relaxed text-[var(--sc-muted)]">
                  {variant.size === 3
                    ? "The trial. Around 30–40 sprays — enough to judge a scent on your own skin."
                    : variant.size === 5
                      ? "The everyday size. A full working week of wear and the sweet spot in every bundle."
                      : variant.size === 10
                        ? "For scents you have already decided on. Noticeably better value per millilitre."
                        : "The largest decant we offer — close to a half bottle for a fraction of the price."}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* Brands ----------------------------------------------------------- */}
      <section className="border-y border-[var(--sc-line)] bg-[var(--sc-paper)] py-16 sm:py-20">
        <div className="page-shell">
          <Reveal>
            <SectionHeading
              eyebrow="The directory"
              title="Houses we carry"
              description="Heritage maisons and modern niche labels, all available in decanted sizes."
              action={
                <Link href="/brands" className="btn-outline">
                  All brands
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              }
            />
          </Reveal>
          <Reveal delay={0.06} className="mt-8">
            <BrandGrid columns={5} />
          </Reveal>
        </div>
      </section>

      {/* Testimonials ----------------------------------------------------- */}
      <section className="page-shell py-16 sm:py-20">
        <Reveal>
          <SectionHeading
            eyebrow="Sample testimonials"
            title="Written to demonstrate the layout"
            description="These are illustrative examples, not real customer reviews."
            align="center"
          />
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <Reveal key={testimonial.id} delay={index * 0.06}>
              <TestimonialCard testimonial={testimonial} className="h-full" />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Newsletter ------------------------------------------------------- */}
      <section className="border-t border-[var(--sc-line)] bg-[var(--sc-charcoal)] py-16">
        <div className="page-shell grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <h2 className="text-[length:var(--text-subhead)] leading-tight text-[var(--sc-ivory)]">
              {siteConfig.sections.newsletterTitle}
            </h2>
            <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-white/60">
              {siteConfig.sections.newsletterSubtitle}
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <NewsletterForm tone="dark" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
