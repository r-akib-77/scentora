import type { Metadata } from "next";

import { PolicyPage } from "@/components/policy/policy-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Scentora handles the information you share — what is collected, what is not, and the choices available to you.",
};

export default function PrivacyPage() {
  return (
    <PolicyPage
      eyebrow="Policies"
      title="Privacy policy"
      intro="A short, plain-English summary of how the boutique handles customer information."
      updated="19 October 2026"
      sections={[
        {
          heading: "What this demo collects",
          paragraphs: [
            "This storefront runs entirely in your browser. There is no server, no database and no analytics script. The only information stored is the contents of your shopping bag, which is saved in your browser's local storage so that it survives a page refresh.",
            "Clearing your browser storage, or pressing &ldquo;Empty bag&rdquo; in the drawer, removes it immediately.",
          ],
        },
        {
          heading: "Forms",
          paragraphs: [
            "The contact and newsletter forms validate your input in the browser and then show a success state. Nothing is transmitted, no email is sent, and no address is stored or shared with a mailing list.",
          ],
        },
        {
          heading: "What a live store would collect",
          paragraphs: [
            "For a real business, the order and contact forms would send your name, phone number, delivery address and message to the store so an order can be created and a reply sent. Payment details would be handled by a payment provider, never stored on the store's own servers.",
          ],
          bullets: [
            "Order details — name, phone, address and the items you ordered",
            "Contact details — only what you type into the contact form",
            "Newsletter address — only if you opt in, and only while you stay subscribed",
          ],
        },
        {
          heading: "How data is used",
          paragraphs: [
            "Order details are used to fulfil and deliver the order and to handle any support request. Contact details are used to reply to your message. Newsletter addresses are used only to send the newsletter you asked for.",
          ],
        },
        {
          heading: "Cookies",
          paragraphs: [
            "This demo sets no cookies. In a live store, essential cookies would keep your bag and session alive, and optional analytics cookies would be used only with your consent.",
          ],
        },
        {
          heading: "Your rights",
          paragraphs: [
            "You can ask what information is held about you, request a correction, or ask for it to be deleted. Contact the boutique using the details below and the request will be actioned within a reasonable period.",
          ],
        },
        {
          heading: "Third parties",
          paragraphs: [
            "A live store would share only what is necessary with its courier and its payment provider, so that a parcel can be delivered and a payment can be taken. We would never sell customer data.",
          ],
        },
        {
          heading: "Contact",
          paragraphs: [
            `Questions about privacy can be sent to ${siteConfig.contact.email} or by post to ${siteConfig.contact.address}.`,
          ],
        },
      ]}
      related={[
        { label: "Shipping policy", href: "/shipping" },
        { label: "Returns & exchange", href: "/returns" },
        { label: "Contact us", href: "/contact" },
      ]}
    />
  );
}
