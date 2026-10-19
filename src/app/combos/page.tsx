import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Gift } from "lucide-react";

import { BundleCard } from "@/components/home/bundle-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { bundles } from "@/data/bundles";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Combo Offers & Gift Sets",
  description:
    "Curated perfume bundles at a lower combined price — the Everyday Collection, Office Essentials, Luxury Discovery, Date Night and Fresh sets.",
};

export default function CombosPage() {
  return (
    <>
      <header className="border-b border-[var(--sc-line)] bg-[var(--sc-paper)]">
        <div className="page-shell py-14 sm:py-20">
          <p className="eyebrow">Better together</p>
          <h1 className="mt-3 max-w-3xl text-[length:var(--text-section)] leading-[1.1] text-[var(--sc-charcoal)] text-balance">
            Curated bundles, priced to make sense
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--sc-muted)] text-pretty">
            Each set groups fragrances that work together — for a season, an occasion or a
            gifting moment — and every bundle is priced below the sum of its parts.
          </p>
        </div>
      </header>

      <section className="page-shell py-16 sm:py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {bundles.map((bundle, index) => (
            <Reveal key={bundle.id} delay={(index % 3) * 0.06}>
              <BundleCard bundle={bundle} className="h-full" />
            </Reveal>
          ))}

          <Reveal delay={0.12}>
            <div className="flex h-full flex-col justify-between border border-dashed border-[var(--sc-line)] bg-[var(--sc-paper)] p-7">
              <span className="flex size-11 items-center justify-center border border-[var(--sc-gold)]/50 text-[var(--sc-gold)]">
                <Gift className="size-5" aria-hidden="true" />
              </span>
              <div className="mt-6">
                <h2 className="font-serif text-[21px] leading-tight text-[var(--sc-charcoal)]">
                  Need a custom gift set?
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-[var(--sc-muted)]">
                  In a live store this is where bespoke bundles, gift wrapping and personalised
                  notes would be configured.
                </p>
              </div>
              <Link href="/contact" className="btn-outline mt-6 w-full">
                Start a conversation
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-[var(--sc-line)] bg-[var(--sc-paper)] py-16">
        <div className="page-shell grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="How bundles work"
              title="Added to your bag, item by item"
              description="Choosing a bundle adds each decant to the bag as its own line, with the correct size and price for every fragrance. Nothing is hidden and nothing is bundled at a different rate."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <ul className="space-y-3 border border-[var(--sc-line)] bg-[var(--sc-ivory)] p-6">
              {[
                "Each decant is listed at the same price as a standalone purchase.",
                "Sizes are fixed per bundle so the set stays consistent.",
                "Bundles can be mixed with individual fragrances in one delivery.",
                `Free nationwide delivery above ${formatPrice(siteConfig.delivery.freeDeliveryThreshold)}.`,
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 text-[13.5px] text-[var(--sc-muted)]">
                  <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-[var(--sc-gold)]" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  );
}
