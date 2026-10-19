import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone, Truck } from "lucide-react";

import { ContactForm } from "@/components/contact/contact-form";
import { FAQAccordion } from "@/components/home/faq-accordion";
import { Reveal } from "@/components/ui/reveal";
import { siteConfig } from "@/config/site";
import { faqs } from "@/data/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the Scentora boutique — order enquiries, product questions, wholesale and feedback.",
};

const contactCards = [
  {
    icon: Phone,
    title: "Call us",
    value: siteConfig.contact.phoneDisplay,
    href: `tel:${siteConfig.contact.phone}`,
    note: siteConfig.contact.hours,
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: siteConfig.contact.phoneDisplay,
    href: `https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, "")}`,
    note: "Fastest reply during opening hours",
  },
  {
    icon: Mail,
    title: "Email",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
    note: "Replies within one working day",
  },
  {
    icon: MapPin,
    title: "Visit",
    value: siteConfig.contact.address,
    href: undefined,
    note: "By appointment",
  },
];

export default function ContactPage() {
  return (
    <>
      <header className="border-b border-[var(--sc-line)] bg-[var(--sc-paper)]">
        <div className="page-shell py-14 sm:py-20">
          <p className="eyebrow">Contact</p>
          <h1 className="mt-3 max-w-3xl text-[length:var(--text-section)] leading-[1.1] text-[var(--sc-charcoal)] text-balance">
            Let&rsquo;s talk fragrances
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--sc-muted)] text-pretty">
            Order questions, sizing advice, wholesale enquiries or just a second opinion — we are
            happy to help. The form below demonstrates a fully validated client-side experience.
          </p>
        </div>
      </header>

      <section className="page-shell grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <Reveal>
          <ul className="grid gap-px border border-[var(--sc-line)] bg-[var(--sc-line)] sm:grid-cols-2 lg:grid-cols-1">
            {contactCards.map((card) => {
              const Icon = card.icon;
              const content = (
                <>
                  <span className="flex size-9 items-center justify-center border border-[var(--sc-gold)]/50 text-[var(--sc-gold)]">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="mt-4 block font-serif text-[18px] text-[var(--sc-charcoal)]">
                    {card.title}
                  </span>
                  <span className="mt-1 block text-[13.5px] text-[var(--sc-charcoal)]/85">
                    {card.value}
                  </span>
                  <span className="mt-1 block text-[11.5px] text-[var(--sc-muted)]">
                    {card.note}
                  </span>
                </>
              );

              return (
                <li key={card.title} className="bg-[var(--sc-ivory)] p-5">
                  {card.href ? (
                    <a
                      href={card.href}
                      target={card.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer noopener"
                      className="block transition-colors hover:text-[var(--sc-gold)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sc-gold)]"
                    >
                      {content}
                    </a>
                  ) : (
                    <div>{content}</div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-5 flex items-start gap-3 border border-[var(--sc-line)] bg-[var(--sc-paper)] p-5">
            <Truck className="mt-0.5 size-4 shrink-0 text-[var(--sc-gold)]" aria-hidden="true" />
            <p className="text-[12.5px] leading-relaxed text-[var(--sc-muted)]">
              {siteConfig.delivery.headline}. {siteConfig.delivery.body}
            </p>
          </div>

          <div className="mt-5 flex items-start gap-3 border border-[var(--sc-line)] bg-[var(--sc-paper)] p-5">
            <Clock className="mt-0.5 size-4 shrink-0 text-[var(--sc-gold)]" aria-hidden="true" />
            <p className="text-[12.5px] leading-relaxed text-[var(--sc-muted)]">
              {siteConfig.contact.hours}. Outside these hours, leave a message and it will be
              answered on the next working day.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="border border-[var(--sc-line)] bg-[var(--sc-ivory)] p-6 sm:p-8">
            <h2 className="font-serif text-[24px] leading-tight text-[var(--sc-charcoal)]">
              Send us a message
            </h2>
            <p className="mt-1.5 text-[13px] text-[var(--sc-muted)]">
              Frontend-only demo form — nothing is transmitted.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </Reveal>
      </section>

      <section className="border-t border-[var(--sc-line)] bg-[var(--sc-paper)] py-16 sm:py-20">
        <div className="page-shell">
          <Reveal>
            <h2 className="font-serif text-[length:var(--text-subhead)] text-[var(--sc-charcoal)]">
              Quick answers
            </h2>
            <p className="mt-2 max-w-xl text-[14px] text-[var(--sc-muted)]">
              The most common questions about decants, delivery and exchanges.
            </p>
          </Reveal>
          <Reveal delay={0.06} className="mt-8">
            <FAQAccordion items={faqs.slice(0, 6)} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
