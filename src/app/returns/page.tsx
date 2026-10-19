import type { Metadata } from "next";

import { PolicyPage } from "@/components/policy/policy-page";

export const metadata: Metadata = {
  title: "Returns & Exchange Policy",
  description:
    "How exchanges and refunds work for Scentora decant purchases — including the rules for opened and unopened bottles.",
};

export default function ReturnsPage() {
  return (
    <PolicyPage
      eyebrow="Policies"
      title="Returns & exchange"
      intro="Decants are a personal product, so a small number of rules apply. We keep them simple and fair."
      updated="19 October 2026"
      sections={[
        {
          heading: "Exchange window",
          paragraphs: [
            "Unopened, sealed decants can be exchanged within 7 days of delivery. Contact us before sending anything back so we can arrange the swap.",
            "If a decant arrives damaged, leaking, or with a broken seal, contact us within 48 hours of delivery with a photograph and we will replace it immediately.",
          ],
        },
        {
          heading: "Opened bottles",
          paragraphs: [
            "For hygiene reasons, opened decants cannot be returned or exchanged unless the product was faulty, damaged in transit, or different from what was ordered.",
            "If you are unsure about a scent, order the 3 ml size first. That is exactly what it is for.",
          ],
        },
        {
          heading: "How to start a return",
          paragraphs: [
            "Get in touch with your order number and the reason for the return. We will confirm whether the item is eligible and send you the collection instructions.",
          ],
          bullets: [
            "Message us on WhatsApp or email with your order number",
            "We confirm eligibility and arrange a pickup or drop-off",
            "Replacement is dispatched once the original is checked in",
          ],
        },
        {
          heading: "Refunds",
          paragraphs: [
            "Refunds are issued to the original payment method for the value of the returned item. Any delivery fee paid is not refunded unless the return was caused by our error.",
            "Cash-on-delivery refunds are transferred to a mobile wallet or bank account you nominate.",
          ],
        },
        {
          heading: "Incorrect items",
          paragraphs: [
            "If you receive a fragrance or a size you did not order, photograph the label and the box and contact us within 48 hours. We will send the correct item at no extra cost.",
          ],
        },
        {
          heading: "Non-returnable items",
          paragraphs: [
            "Gift cards, personalised items and any decant whose seal has been broken cannot be returned, except where the item is faulty.",
          ],
        },
      ]}
      related={[
        { label: "Shipping policy", href: "/shipping" },
        { label: "Privacy policy", href: "/privacy" },
        { label: "Contact us", href: "/contact" },
      ]}
    />
  );
}
