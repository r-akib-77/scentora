"use client";

import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useToast } from "@/providers/toast-provider";

interface NewsletterFormProps {
  className?: string;
  tone?: "light" | "dark";
}

/**
 * Newsletter sign-up.
 *
 * The form validates locally and shows a demo success state. Nothing is
 * transmitted anywhere — there is no backend in this build.
 */
export function NewsletterForm({ className, tone = "light" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { pushToast } = useToast();

  const dark = tone === "dark";

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
    if (!valid) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    setSubscribed(true);
    pushToast({
      title: "Demo signup complete",
      description: "No email was sent — this form runs in your browser only.",
      variant: "info",
    });
  };

  if (subscribed) {
    return (
      <div
        className={cn(
          "flex items-start gap-3 border px-4 py-4",
          dark
            ? "border-white/20 bg-white/5 text-[var(--sc-ivory)]"
            : "border-[var(--sc-gold)]/40 bg-[var(--sc-paper)] text-[var(--sc-charcoal)]",
          className,
        )}
        role="status"
      >
        <span
          className={cn(
            "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full",
            dark ? "bg-[var(--sc-gold)] text-white" : "bg-[var(--sc-charcoal)] text-[var(--sc-ivory)]",
          )}
        >
          <Check className="size-3.5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-[13px] font-medium">You are on the demo list</p>
          <p className="mt-1 text-[12px] leading-relaxed opacity-80">
            {siteConfig.newsletter.disclaimer}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className={className}>
      <div
        className={cn(
          "flex flex-col gap-2 border-b pb-2 sm:flex-row sm:items-center sm:gap-3",
          dark ? "border-white/25" : "border-[var(--sc-charcoal)]",
          error && "border-red-400",
        )}
      >
        <label className="sr-only" htmlFor="newsletter-email">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) setError("");
          }}
          placeholder="Your email address"
          className={cn(
            "w-full bg-transparent py-1.5 text-[14px] outline-none",
            dark
              ? "text-[var(--sc-ivory)] placeholder:text-white/50"
              : "text-[var(--sc-charcoal)] placeholder:text-[var(--sc-muted)]",
          )}
          autoComplete="email"
        />
        <button
          type="submit"
          className={cn(
            "group inline-flex shrink-0 items-center gap-2 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--sc-gold)]",
            dark
              ? "text-[var(--sc-gold-soft)] hover:text-white"
              : "text-[var(--sc-charcoal)] hover:text-[var(--sc-gold)]",
          )}
        >
          Subscribe
          <ArrowRight
            className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </button>
      </div>
      {error ? <p className="mt-2 text-[12px] text-red-500">{error}</p> : null}
      <p
        className={cn(
          "mt-3 text-[11px] leading-relaxed",
          dark ? "text-white/55" : "text-[var(--sc-muted)]",
        )}
      >
        {siteConfig.newsletter.perk} · {siteConfig.newsletter.disclaimer}
      </p>
    </form>
  );
}
