"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import { SmartImage } from "@/components/ui/smart-image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  alt: string;
  badge?: string;
  className?: string;
}

/** The product image gallery with selectable thumbnails. */
export function ProductGallery({ images, alt, badge, className }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const list = images.length > 0 ? images : ["/images/hero/hero.jpg"];

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--sc-paper)]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={list[active]}
            className="absolute inset-0"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <SmartImage
              src={list[active]}
              alt={alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {badge ? (
          <span className="absolute left-4 top-4 bg-[var(--sc-ivory)] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--sc-charcoal)]">
            {badge}
          </span>
        ) : null}
      </div>

      {list.length > 1 ? (
        <div className="grid grid-cols-4 gap-2">
          {list.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show image ${index + 1} of ${list.length}`}
              aria-current={active === index}
              className={cn(
                "relative aspect-square w-full overflow-hidden border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sc-gold)]",
                active === index
                  ? "border-[var(--sc-charcoal)]"
                  : "border-[var(--sc-line)] hover:border-[var(--sc-gold)]",
              )}
            >
              <SmartImage
                src={image}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
