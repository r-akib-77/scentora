import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { SmartImage } from "@/components/ui/smart-image";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface CategoryCardProps {
  category: Category;
  className?: string;
}

/** Builds a link that opens the collection page pre-filtered for a category. */
export function categoryHref(category: Category): string {
  const params = new URLSearchParams();
  if (category.filter.genders?.length) {
    params.set("gender", category.filter.genders.join(","));
  }
  if (category.filter.families?.length) {
    params.set("family", category.filter.families.join(","));
  }
  if (category.filter.tiers?.length) {
    params.set("tier", category.filter.tiers.join(","));
  }
  const query = params.toString();
  return query ? `/shop?${query}` : "/shop";
}

/** An image-led category tile. */
export function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <Link
      href={categoryHref(category)}
      className={cn(
        "group relative block overflow-hidden bg-[var(--sc-beige)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sc-gold)]",
        className,
      )}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden sm:aspect-[4/5]">
        <SmartImage
          src={category.image}
          alt={category.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[rgba(24,20,16,0.82)] via-[rgba(24,20,16,0.28)] to-transparent"
          aria-hidden="true"
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <h3 className="font-serif text-[22px] leading-tight text-white sm:text-[25px]">
          {category.title}
        </h3>
        <p className="mt-1.5 max-w-[26ch] text-[12.5px] leading-relaxed text-white/75">
          {category.description}
        </p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-[var(--sc-gold-soft)]">
          Shop now
          <ArrowUpRight
            className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
