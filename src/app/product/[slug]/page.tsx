import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Sparkles } from "lucide-react";

import { ProductGallery } from "@/components/product/product-gallery";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import { Rating } from "@/components/ui/rating";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { getProductBySlug, products } from "@/data/products";
import { cn, familyLabels, formatPrice, occasionLabels, seasonLabels } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return { title: "Fragrance not found" };
  }
  return {
    title: `${product.brand} ${product.name}`,
    description: product.description.slice(0, 155),
    openGraph: {
      title: `${product.brand} ${product.name}`,
      description: product.tagline,
      images: [product.image],
    },
  };
}

/** A five-step indicator for the illustrative longevity score. */
function LongevityBar({ value }: { value: number }) {
  const steps = 5;
  return (
    <span className="flex items-center gap-1" aria-hidden="true">
      {Array.from({ length: steps }).map((_, index) => (
        <span
          key={index}
          className={cn(
            "h-[3px] w-6",
            index < Math.round((value / 12) * steps)
              ? "bg-[var(--sc-gold)]"
              : "bg-[var(--sc-line)]",
          )}
        />
      ))}
    </span>
  );
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const related = products
    .filter(
      (item) =>
        item.id !== product.id &&
        (item.brand === product.brand ||
          item.family === product.family ||
          item.gender === product.gender),
    )
    .slice(0, 4);

  const fallbackRelated =
    related.length > 0
      ? related
      : products.filter((item) => item.id !== product.id).slice(0, 4);

  return (
    <>
      <div className="page-shell pt-6">
        <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.14em]">
          <ol className="flex flex-wrap items-center gap-2 text-[var(--sc-muted)]">
            <li>
              <Link href="/" className="hover:text-[var(--sc-charcoal)]">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/shop" className="hover:text-[var(--sc-charcoal)]">
                Shop
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={`/shop?brand=${encodeURIComponent(product.brand)}`}
                className="hover:text-[var(--sc-charcoal)]"
              >
                {product.brand}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--sc-charcoal)]">{product.name}</li>
          </ol>
        </nav>
      </div>

      <article className="page-shell grid gap-10 py-10 lg:grid-cols-2 lg:gap-16 lg:py-14">
        <div>
          <ProductGallery
            images={[product.image, ...product.gallery]}
            alt={`${product.brand} ${product.name}`}
            badge={product.badge}
          />
        </div>

        <div>
          <p className="eyebrow">{product.brand}</p>
          <h1 className="mt-2 text-[length:var(--text-section)] leading-[1.08] text-[var(--sc-charcoal)] text-balance">
            {product.name}
          </h1>
          <p className="mt-2 text-[15px] italic text-[var(--sc-muted)]">{product.tagline}</p>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
            <Rating value={product.rating} count={product.reviewCount} showCaption size="md" />
            <span className="text-[12px] text-[var(--sc-muted)]">
              {product.concentration} · {product.concentrationPercent}%
            </span>
          </div>

          <p className="mt-6 text-[14.5px] leading-relaxed text-[var(--sc-charcoal)]/85 text-pretty">
            {product.description}
          </p>

          <ProductPurchasePanel product={product} />

          {/* Details grid ------------------------------------------------ */}
          <dl className="mt-9 grid gap-px border border-[var(--sc-line)] bg-[var(--sc-line)] sm:grid-cols-2">
            <div className="bg-[var(--sc-ivory)] p-5">
              <dt className="text-[10px] uppercase tracking-[0.18em] text-[var(--sc-muted)]">
                Fragrance family
              </dt>
              <dd className="mt-1.5 font-serif text-[17px] text-[var(--sc-charcoal)]">
                {product.familyLabel}
              </dd>
              <dd className="mt-0.5 text-[12px] text-[var(--sc-muted)]">
                {familyLabels[product.family]}
              </dd>
            </div>

            <div className="bg-[var(--sc-ivory)] p-5">
              <dt className="text-[10px] uppercase tracking-[0.18em] text-[var(--sc-muted)]">
                Best for
              </dt>
              <dd className="mt-1.5 font-serif text-[17px] text-[var(--sc-charcoal)] capitalize">
                {product.gender === "unisex" ? "Unisex" : product.gender}
              </dd>
              <dd className="mt-0.5 text-[12px] text-[var(--sc-muted)]">
                {product.occasions.map((occasion) => occasionLabels[occasion]).join(" · ")}
              </dd>
            </div>

            <div className="bg-[var(--sc-ivory)] p-5">
              <dt className="text-[10px] uppercase tracking-[0.18em] text-[var(--sc-muted)]">
                Seasons
              </dt>
              <dd className="mt-1.5 font-serif text-[17px] text-[var(--sc-charcoal)]">
                {product.seasons.map((season) => seasonLabels[season]).join(", ")}
              </dd>
            </div>

            <div className="bg-[var(--sc-ivory)] p-5">
              <dt className="text-[10px] uppercase tracking-[0.18em] text-[var(--sc-muted)]">
                Sizes available
              </dt>
              <dd className="mt-1.5 font-serif text-[17px] text-[var(--sc-charcoal)]">
                {product.variants.map((variant) => `${variant.size} ml`).join(" · ")}
              </dd>
              <dd className="price mt-0.5 text-[12px] text-[var(--sc-muted)]">
                From {formatPrice(Math.min(...product.variants.map((v) => v.price)))}
              </dd>
            </div>
          </dl>

          {/* Notes -------------------------------------------------------- */}
          <div className="mt-9">
            <h2 className="font-serif text-[21px] text-[var(--sc-charcoal)]">The note pyramid</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {(
                [
                  { label: "Top", notes: product.notes.top, note: "First impression" },
                  { label: "Heart", notes: product.notes.heart, note: "The character" },
                  { label: "Base", notes: product.notes.base, note: "The foundation" },
                ] as const
              ).map((group) => (
                <div key={group.label} className="border-t-2 border-[var(--sc-gold)] pt-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--sc-charcoal)]">
                    {group.label} notes
                  </p>
                  <p className="mt-0.5 text-[11px] italic text-[var(--sc-muted)]">{group.note}</p>
                  <ul className="mt-2.5 space-y-1">
                    {group.notes.map((note) => (
                      <li key={note} className="text-[13px] text-[var(--sc-charcoal)]/85">
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Performance -------------------------------------------------- */}
          <div className="mt-9 border border-[var(--sc-line)] bg-[var(--sc-paper)] p-5">
            <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[var(--sc-muted)]">
              <Sparkles className="size-3 text-[var(--sc-gold)]" aria-hidden="true" />
              Illustrative performance data
            </p>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[12px] text-[var(--sc-muted)]">Longevity</span>
                  <span className="text-[12px] text-[var(--sc-charcoal)]">
                    ~{product.longevity} hours
                  </span>
                </div>
                <div className="mt-2">
                  <LongevityBar value={product.longevity} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[12px] text-[var(--sc-muted)]">Projection</span>
                  <span className="text-[12px] text-[var(--sc-charcoal)]">
                    {["Very subtle", "Subtle", "Moderate", "Noticeable", "Strong"][
                      product.projection - 1
                    ]}
                  </span>
                </div>
                <div className="mt-2">
                  <LongevityBar value={product.projection * 2.4} />
                </div>
              </div>
            </div>
            <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-[var(--sc-muted)]">
              <CalendarDays className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
              These figures are sample values for layout purposes. Real wear time changes with
              concentration, skin and weather.
            </p>
          </div>

          {/* Shipping ----------------------------------------------------- */}
          <div className="mt-9">
            <h2 className="font-serif text-[21px] text-[var(--sc-charcoal)]">Delivery &amp; returns</h2>
            <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-[var(--sc-muted)]">
              <li>· Nationwide delivery in 2–4 working days, next working day inside Dhaka and Chattogram.</li>
              <li>· Flat ৳120 delivery, free above ৳3,000. Cash on delivery available nationwide.</li>
              <li>· Unopened decants can be exchanged within 7 days of delivery.</li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link href="/shipping" className="btn-ghost">
                Shipping policy
              </Link>
              <Link href="/returns" className="btn-ghost">
                Returns &amp; exchange
              </Link>
            </div>
          </div>
        </div>
      </article>

      <section className="border-t border-[var(--sc-line)] bg-[var(--sc-paper)] py-20">
        <div className="page-shell">
          <Reveal>
            <SectionHeading
              eyebrow="You may also like"
              title="Related fragrances"
              description="Similar profiles from the same house and the same olfactive family."
              action={
                <Link href="/shop" className="btn-outline">
                  Browse all
                </Link>
              }
            />
          </Reveal>
          <div className="mt-10">
            <ProductGrid products={fallbackRelated} columns={4} />
          </div>
        </div>
      </section>

      <div className="page-shell py-8">
        <Link
          href="/shop"
          className="btn-ghost"
          aria-label="Back to the collection"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to the collection
        </Link>
      </div>
    </>
  );
}
