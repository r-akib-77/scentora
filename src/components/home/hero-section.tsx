"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import { SmartImage } from "@/components/ui/smart-image";
import { siteConfig } from "@/config/site";

/**
 * The home page hero.
 *
 * A split layout on desktop with a floating promo card, and a carefully
 * stacked single column on mobile.
 */
export function HeroSection() {
  const { hero } = siteConfig;
  const reduceMotion = useReducedMotion();

  const fade = (delay: number) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section className="relative overflow-hidden bg-[var(--sc-paper)]">
      <div className="page-shell grid items-center gap-10 py-12 lg:grid-cols-[1.02fr_1.1fr] lg:gap-16 lg:py-20 xl:py-24">
        <div className="order-2 lg:order-1">
          <motion.p {...fade(0.05)} className="eyebrow">
            {hero.eyebrow}
          </motion.p>

          <motion.h1
            {...fade(0.12)}
            className="mt-4 text-[length:var(--text-hero)] font-serif leading-[1.06] text-[var(--sc-charcoal)] text-balance"
          >
            {hero.headline}{" "}
            <span className="italic text-[var(--sc-gold)]">{hero.headlineHighlight}</span>
          </motion.h1>

          <motion.p
            {...fade(0.2)}
            className="mt-5 max-w-lg text-[15px] leading-relaxed text-[var(--sc-muted)] text-pretty"
          >
            {hero.body}
          </motion.p>

          <motion.div {...fade(0.28)} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={hero.primaryCta.href} className="btn-primary">
              {hero.primaryCta.label}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
            <Link href={hero.secondaryCta.href} className="btn-outline">
              {hero.secondaryCta.label}
            </Link>
          </motion.div>

          <motion.ul
            {...fade(0.36)}
            className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[var(--sc-line)] pt-5"
          >
            {hero.highlights.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-[var(--sc-muted)]"
              >
                <Sparkles className="size-3 text-[var(--sc-gold)]" aria-hidden="true" />
                {item.label}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="order-1 relative lg:order-2"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--sc-beige)] sm:aspect-[16/11] lg:aspect-[4/5]">
            <SmartImage
              src="/images/hero/hero.jpg"
              alt="A premium perfume bottle photographed in soft studio light"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          </div>

          <Link
            href={hero.promo.href}
            className="absolute -bottom-5 left-4 right-4 flex items-center justify-between gap-4 border border-[var(--sc-line)] bg-[var(--sc-ivory)]/95 p-4 backdrop-blur-sm transition-colors hover:border-[var(--sc-gold)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sc-gold)] sm:-bottom-6 sm:left-auto sm:right-6 sm:w-[19rem]"
          >
            <span className="min-w-0">
              <span className="block text-[10px] uppercase tracking-[0.18em] text-[var(--sc-gold)]">
                {hero.promo.label}
              </span>
              <span className="mt-1 block truncate font-serif text-[19px] text-[var(--sc-charcoal)]">
                {hero.promo.title}
              </span>
              <span className="mt-0.5 block text-[11px] text-[var(--sc-muted)]">{hero.promo.meta}</span>
            </span>
            <span className="shrink-0 font-serif text-[16px] text-[var(--sc-charcoal)]">
              {hero.promo.price}
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
