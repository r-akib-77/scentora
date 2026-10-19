import Link from "next/link";
import { Quote } from "lucide-react";

import { Rating } from "@/components/ui/rating";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types";

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

/**
 * A sample testimonial. The copy is illustrative — the card labels it as a
 * sample so it is never mistaken for a verified customer review.
 */
export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  return (
    <figure
      className={cn(
        "flex h-full flex-col border border-[var(--sc-line)] bg-[var(--sc-ivory)] p-6",
        className,
      )}
    >
      <Quote className="size-5 text-[var(--sc-gold)]" aria-hidden="true" />
      <blockquote className="mt-4 flex-1 text-[14px] leading-relaxed text-[var(--sc-charcoal)] text-pretty">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--sc-line)] pt-4">
        <span>
          <span className="block text-[13px] text-[var(--sc-charcoal)]">
            {testimonial.name}
          </span>
          <span className="block text-[11px] text-[var(--sc-muted)]">
            {testimonial.location}
          </span>
        </span>
        <Rating value={testimonial.rating} size="sm" />
      </figcaption>
      {testimonial.productSlug ? (
        <Link
          href={`/product/${testimonial.productSlug}`}
          className="btn-ghost mt-3 justify-start px-0 py-0 text-[10px]"
        >
          View the fragrance →
        </Link>
      ) : null}
    </figure>
  );
}
