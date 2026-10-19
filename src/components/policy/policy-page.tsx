import Link from "next/link";

interface PolicySection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

interface PolicyPageProps {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  sections: PolicySection[];
  /** Related links shown at the bottom. */
  related?: { label: string; href: string }[];
}

/**
 * A shared layout for the policy pages so every document reads the same way.
 */
export function PolicyPage({
  eyebrow,
  title,
  intro,
  updated,
  sections,
  related = [],
}: PolicyPageProps) {
  return (
    <>
      <header className="border-b border-[var(--sc-line)] bg-[var(--sc-paper)]">
        <div className="page-shell py-14 sm:py-18">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-[length:var(--text-section)] leading-[1.1] text-[var(--sc-charcoal)] text-balance">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--sc-muted)] text-pretty">
            {intro}
          </p>
          <p className="mt-5 text-[11px] uppercase tracking-[0.16em] text-[var(--sc-muted)]">
            Last updated {updated}
          </p>
        </div>
      </header>

      <article className="page-shell grid gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16">
        <div className="max-w-3xl">
          {sections.map((section) => (
            <section
              key={section.heading}
              id={slugify(section.heading)}
              className="mb-10 scroll-mt-28 last:mb-0"
            >
              <h2 className="font-serif text-[23px] leading-snug text-[var(--sc-charcoal)]">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="mt-3 text-[14px] leading-relaxed text-[var(--sc-muted)] text-pretty"
                >
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="mt-4 space-y-2">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-3 text-[14px] leading-relaxed text-[var(--sc-muted)]"
                    >
                      <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-[var(--sc-gold)]" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          <div className="mt-12 border border-[var(--sc-gold)]/40 bg-[var(--sc-paper)] p-5">
            <p className="text-[12.5px] leading-relaxed text-[var(--sc-muted)]">
              <strong className="font-medium text-[var(--sc-charcoal)]">Demonstration notice:</strong>{" "}
              this policy page is sample copy written for a template presentation. It is not legal
              advice and does not describe a real trading business. Replace it with a reviewed
              policy before publishing.
            </p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">On this page</p>
          <ul className="mt-4 space-y-2 border-l border-[var(--sc-line)] pl-4">
            {sections.map((section) => (
              <li key={section.heading}>
                <a
                  href={`#${slugify(section.heading)}`}
                  className="text-[13px] text-[var(--sc-muted)] transition-colors hover:text-[var(--sc-charcoal)]"
                >
                  {section.heading}
                </a>
              </li>
            ))}
          </ul>

          {related.length > 0 ? (
            <div className="mt-8 border-t border-[var(--sc-line)] pt-6">
              <p className="eyebrow">Related</p>
              <ul className="mt-3 space-y-2">
                {related.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-[var(--sc-muted)] transition-colors hover:text-[var(--sc-charcoal)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </article>
    </>
  );
}

/** Local slug helper for the in-page anchors. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
