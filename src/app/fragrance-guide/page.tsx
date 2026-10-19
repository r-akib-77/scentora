import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import { FAQAccordion } from "@/components/home/faq-accordion";
import { FragranceFinder } from "@/components/finder/fragrance-finder";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { faqs } from "@/data/content";
import { guideSections, glossary } from "@/data/guide";

export const metadata: Metadata = {
  title: "Fragrance Guide",
  description:
    "Learn how fragrance is built, how to choose a scent, and how to wear it — plus a five-step finder that matches you to the right bottle.",
};

export default function FragranceGuidePage() {
  return (
    <>
      <header className="border-b border-[var(--sc-line)] bg-[var(--sc-paper)]">
        <div className="page-shell py-14 sm:py-20">
          <p className="eyebrow">The guide</p>
          <h1 className="mt-3 max-w-3xl text-[length:var(--text-section)] leading-[1.1] text-[var(--sc-charcoal)] text-balance">
            Everything worth knowing before you choose
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--sc-muted)] text-pretty">
            How perfume is layered, why concentration changes performance, what decant sizes
            actually mean, and how to find the bottle that suits the way you live.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#finder" className="btn-primary">
              Jump to the finder
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </a>
            <Link href="/shop" className="btn-outline">
              Browse the collection
            </Link>
          </div>
        </div>
      </header>

      {/* Finder ----------------------------------------------------------- */}
      <section id="finder" className="page-shell scroll-mt-28 py-16 sm:py-20">
        <Reveal>
          <SectionHeading
            eyebrow="Fragrance finder"
            title="Five questions, six matches"
            description="Answer about occasion, weather, preferred family, budget and intensity. The scoring runs entirely in your browser against the catalogue tags — no account, no data sent, no AI service involved."
            align="center"
          />
        </Reveal>

        <Reveal delay={0.08} className="mx-auto mt-10 max-w-4xl">
          <FragranceFinder />
        </Reveal>
      </section>

      {/* Editorial sections ---------------------------------------------- */}
      <section className="border-y border-[var(--sc-line)] bg-[var(--sc-paper)] py-16 sm:py-20">
        <div className="page-shell space-y-16">
          {guideSections.map((section, index) => (
            <Reveal key={section.id} delay={index * 0.04}>
              <article id={section.id} className="scroll-mt-28">
                <p className="eyebrow">{section.eyebrow}</p>
                <h2 className="mt-3 max-w-2xl text-[length:var(--text-subhead)] leading-snug text-[var(--sc-charcoal)] text-balance">
                  {section.title}
                </h2>
                <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-[var(--sc-muted)] text-pretty">
                  {section.body}
                </p>
                <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {section.points.map((point) => (
                    <div
                      key={point.title}
                      className="border-t-2 border-[var(--sc-gold)] bg-[var(--sc-ivory)] p-5"
                    >
                      <h3 className="font-serif text-[17px] leading-snug text-[var(--sc-charcoal)]">
                        {point.title}
                      </h3>
                      <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--sc-muted)]">
                        {point.body}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Glossary --------------------------------------------------------- */}
      <section className="page-shell py-16 sm:py-20">
        <Reveal>
          <SectionHeading
            eyebrow="Glossary"
            title="The vocabulary of fragrance"
            description="Short, plain-English definitions of the words you will meet on every perfume page."
          />
        </Reveal>

        <Reveal delay={0.06} className="mt-8">
          <dl className="grid gap-px border border-[var(--sc-line)] bg-[var(--sc-line)] sm:grid-cols-2">
            {glossary.map((entry) => (
              <div key={entry.term} className="bg-[var(--sc-ivory)] p-5">
                <dt className="font-serif text-[17px] text-[var(--sc-charcoal)]">
                  {entry.term}
                </dt>
                <dd className="mt-1.5 text-[13px] leading-relaxed text-[var(--sc-muted)]">
                  {entry.definition}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* FAQ -------------------------------------------------------------- */}
      <section className="border-t border-[var(--sc-line)] bg-[var(--sc-paper)] py-16 sm:py-20">
        <div className="page-shell">
          <Reveal>
            <SectionHeading
              eyebrow="Questions"
              title={siteConfig.sections.faqTitle}
              description={siteConfig.sections.faqSubtitle}
            />
          </Reveal>
          <Reveal delay={0.06} className="mt-8">
            <FAQAccordion items={faqs} />
          </Reveal>
        </div>
      </section>

      <section className="page-shell py-14">
        <div className="flex flex-col items-start justify-between gap-5 border border-[var(--sc-line)] p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center border border-[var(--sc-gold)]/50 text-[var(--sc-gold)]">
              <BookOpen className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-serif text-[21px] leading-tight text-[var(--sc-charcoal)]">
                Ready to try something?
              </h2>
              <p className="mt-1 text-[13.5px] text-[var(--sc-muted)]">
                Start with a 3 ml trial size and work up once the scent earns its place.
              </p>
            </div>
          </div>
          <Link href="/shop" className="btn-primary shrink-0">
            Shop all fragrances
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
