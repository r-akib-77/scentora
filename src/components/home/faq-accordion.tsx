"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import type { FaqItem } from "@/types";

interface FAQAccordionProps {
  items: FaqItem[];
  className?: string;
  /** Allow several panels to be open at once. */
  multiple?: boolean;
}

/** An accessible accordion for frequently asked questions. */
export function FAQAccordion({ items, className, multiple = false }: FAQAccordionProps) {
  const [open, setOpen] = useState<string[]>([]);
  const reduceMotion = useReducedMotion();

  const toggle = (id: string) => {
    setOpen((current) => {
      if (current.includes(id)) return current.filter((value) => value !== id);
      return multiple ? [...current, id] : [id];
    });
  };

  return (
    <div className={cn("border-t border-[var(--sc-line)]", className)}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        return (
          <div key={item.id} className="border-b border-[var(--sc-line)]">
            <h3>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${item.id}`}
                id={`faq-trigger-${item.id}`}
                className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-[var(--sc-gold)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sc-gold)]"
              >
                <span className="font-serif text-[17px] leading-snug text-[var(--sc-charcoal)] sm:text-[19px]">
                  {item.question}
                </span>
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center border border-[var(--sc-line)] transition-transform duration-300",
                    isOpen
                      ? "rotate-45 border-[var(--sc-gold)] text-[var(--sc-gold)]"
                      : "text-[var(--sc-muted)]",
                  )}
                  aria-hidden="true"
                >
                  <Plus className="size-3.5" />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={`faq-panel-${item.id}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${item.id}`}
                  initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  animate={reduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                  exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-3xl pb-5 pr-10 text-[13.5px] leading-relaxed text-[var(--sc-muted)] text-pretty">
                    {item.answer}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
