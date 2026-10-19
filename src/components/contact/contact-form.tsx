"use client";

import { Check, Send } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { useToast } from "@/providers/toast-provider";

const topics = ["Order enquiry", "Product question", "Wholesale", "Feedback", "Other"];

interface FormState {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
}

const empty: FormState = { name: "", email: "", phone: "", topic: topics[0], message: "" };

/**
 * The contact form.
 *
 * Validation and the success state are entirely client-side. Nothing is
 * transmitted — there is no backend in this build.
 */
export function ContactForm() {
  const [values, setValues] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [sent, setSent] = useState(false);
  const { pushToast } = useToast();

  const update = (key: keyof FormState, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (values.name.trim().length < 2) next.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
      next.email = "Enter a valid email address";
    }
    if (values.message.trim().length < 12) {
      next.message = "Please write at least a short message";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setSent(true);
    pushToast({
      title: "Demo message captured",
      description: "No message was sent — this form runs in your browser only.",
      variant: "info",
    });
  };

  if (sent) {
    return (
      <div className="border border-[var(--sc-gold)]/40 bg-[var(--sc-paper)] p-8" role="status">
        <span className="flex size-11 items-center justify-center rounded-full bg-[var(--sc-charcoal)] text-[var(--sc-ivory)]">
          <Check className="size-5" aria-hidden="true" />
        </span>
        <h3 className="mt-5 font-serif text-[24px] text-[var(--sc-charcoal)]">
          Thanks, {values.name.split(" ")[0]} — demo message received
        </h3>
        <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-[var(--sc-muted)]">
          In a live store this message would be routed to the support inbox. In this demo nothing
          was transmitted, stored or emailed.
        </p>
        <dl className="mt-6 space-y-1.5 border-t border-[var(--sc-line)] pt-5 text-[12.5px] text-[var(--sc-muted)]">
          <div className="flex gap-3">
            <dt className="w-24 shrink-0">Topic</dt>
            <dd className="text-[var(--sc-charcoal)]">{values.topic}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-24 shrink-0">Reply to</dt>
            <dd className="text-[var(--sc-charcoal)]">{values.email}</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={() => {
            setValues(empty);
            setSent(false);
          }}
          className="btn-outline mt-6"
        >
          Write another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="contact-name">
            Full name
          </label>
          <input
            id="contact-name"
            className={cn("field", errors.name && "border-red-400")}
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            placeholder="Your name"
            autoComplete="name"
          />
          {errors.name ? <p className="mt-1 text-[11px] text-red-500">{errors.name}</p> : null}
        </div>

        <div>
          <label className="field-label" htmlFor="contact-email">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            className={cn("field", errors.email && "border-red-400")}
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
          {errors.email ? <p className="mt-1 text-[11px] text-red-500">{errors.email}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="contact-phone">
            Phone (optional)
          </label>
          <input
            id="contact-phone"
            className="field"
            value={values.phone}
            onChange={(event) => update("phone", event.target.value)}
            placeholder="+880 1XXX-XXXXXX"
            inputMode="tel"
            autoComplete="tel"
          />
        </div>

        <div>
          <label className="field-label" htmlFor="contact-topic">
            Topic
          </label>
          <select
            id="contact-topic"
            className="field"
            value={values.topic}
            onChange={(event) => update("topic", event.target.value)}
          >
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="contact-message">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={5}
          className={cn("field resize-none", errors.message && "border-red-400")}
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          placeholder="How can we help?"
        />
        {errors.message ? (
          <p className="mt-1 text-[11px] text-red-500">{errors.message}</p>
        ) : null}
      </div>

      <button type="submit" className="btn-primary">
        <Send className="size-3.5" aria-hidden="true" />
        Send demo message
      </button>

      <p className="text-[11.5px] leading-relaxed text-[var(--sc-muted)]">
        Demo form — it validates in your browser and shows a success state. No message is sent, no
        address is stored, and nothing leaves your device. For a live store, connect this form to
        your own inbox or helpdesk.
      </p>
    </form>
  );
}
