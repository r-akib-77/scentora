import type { Metadata } from "next";

import { PolicyPage } from "@/components/policy/policy-page";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "How Scentora dispatches and delivers decanted fragrances across Bangladesh — timelines, fees, cash on delivery and packaging.",
};

export default function ShippingPage() {
  return (
    <PolicyPage
      eyebrow="Policies"
      title="Shipping & delivery"
      intro={`We dispatch to all 64 districts. Delivery is flat ${formatPrice(siteConfig.delivery.deliveryFee)} nationwide and free above ${formatPrice(siteConfig.delivery.freeDeliveryThreshold)}.`}
      updated="19 October 2026"
      sections={[
        {
          heading: "Dispatch times",
          paragraphs: [
            "Orders placed before 2:00 PM on a working day are dispatched the same day. Orders placed later, or over the weekend, are dispatched on the next working day.",
            "During a major festival or public holiday, dispatch may take one additional working day. Any change is announced on the announcement bar and in the order confirmation.",
          ],
        },
        {
          heading: "Delivery timelines",
          paragraphs: [
            "Inside Dhaka and Chattogram, orders are usually delivered on the next working day. For the rest of the country, allow two to four working days.",
          ],
          bullets: [
            "Dhaka and Chattogram — next working day",
            "Major districts (Sylhet, Rajshahi, Khulna, Barishal, Rangpur, Mymensingh) — 2 to 3 working days",
            "Remote upazilas — 3 to 4 working days",
          ],
        },
        {
          heading: "Delivery charges",
          paragraphs: [
            `A flat ${formatPrice(siteConfig.delivery.deliveryFee)} applies to every order. Delivery is free on orders above ${formatPrice(siteConfig.delivery.freeDeliveryThreshold)}.`,
            "The delivery fee is shown at checkout and on your order confirmation, so there is nothing to work out after the fact.",
          ],
        },
        {
          heading: "Cash on delivery",
          paragraphs: [
            "Cash on delivery is available nationwide. Please keep the exact amount ready — our couriers are not always able to provide change.",
            "Mobile wallet payment (bKash, Nagad) can also be selected at checkout. In this demonstration build, neither option actually processes a payment.",
          ],
        },
        {
          heading: "Packaging",
          paragraphs: [
            "Every decant is wrapped, sealed and packed in a rigid box with a leak-resistant liner. Decants are separated so that pressure during transit cannot push a cap off.",
            "If a bottle arrives damaged or leaking, contact us within 48 hours of delivery with a photograph and we will replace it.",
          ],
        },
        {
          heading: "Tracking",
          paragraphs: [
            "A tracking link is sent by message and email as soon as the parcel is handed to the courier. The same link is available from your order history.",
          ],
        },
      ]}
      related={[
        { label: "Returns & exchange", href: "/returns" },
        { label: "Privacy policy", href: "/privacy" },
        { label: "Contact us", href: "/contact" },
      ]}
    />
  );
}
