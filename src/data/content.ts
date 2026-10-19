import type { FaqItem, Testimonial } from "@/types";

/**
 * Sample testimonials — illustrative copy written to demonstrate the layout.
 * These are not real customer reviews and must not be presented as such.
 */
export const testimonials: Testimonial[] = [
  {
    id: "t-001",
    name: "Sample Customer A",
    location: "Dhaka",
    quote:
      "I started with the 3 ml of Sauvage and it lasted a full working day. Moved straight to 10 ml the next week. The decant idea genuinely makes trying things less risky.",
    rating: 5,
    productSlug: "dior-sauvage",
  },
  {
    id: "t-002",
    name: "Sample Customer B",
    location: "Chattogram",
    quote:
      "Ordered the Office Essentials set for a colleague. Presentation was tidy, the notes were accurate, and the delivery landed two days early.",
    rating: 5,
    productSlug: "bleu-de-chanel",
  },
  {
    id: "t-003",
    name: "Sample Customer C",
    location: "Sylhet",
    quote:
      "The fragrance finder actually helped. I have no idea what an oud is supposed to smell like, and it sent me to something I ended up ordering two sizes of.",
    rating: 4,
    productSlug: "al-haramain-ambre-oud",
  },
  {
    id: "t-004",
    name: "Sample Customer D",
    location: "Khulna",
    quote:
      "Khamrah in 5 ml is absurd value for the performance. It has replaced three bottles on my shelf.",
    rating: 5,
    productSlug: "lattafa-khamrah",
  },
  {
    id: "t-005",
    name: "Sample Customer E",
    location: "Rajshahi",
    quote:
      "Cash on delivery made the first order painless. I checked the decant, smelt it, and paid. That is exactly the kind of low-risk start I wanted.",
    rating: 5,
    productSlug: "rasasi-hawas",
  },
  {
    id: "t-006",
    name: "Sample Customer F",
    location: "Dhaka",
    quote:
      "The Luxury Discovery set was the gift that worked. Five 5 ml decants, a card, and nobody had to guess a size.",
    rating: 5,
    productSlug: "baccarat-rouge-540",
  },
];

/** Frequently asked questions. */
export const faqs: FaqItem[] = [
  {
    id: "f-001",
    question: "What exactly is a decant?",
    answer:
      "A decant is the fragrance poured from a full bottle into a smaller travel-size bottle. It lets you try a scent, or own a small amount of something you would only wear occasionally, without committing to the full-bottle price.",
  },
  {
    id: "f-002",
    question: "Which sizes do you offer?",
    answer:
      "3 ml, 5 ml, 10 ml and 15 ml. Not every fragrance is decanted in every size — for the most expensive references we tend to keep the range shorter. The available sizes are listed on each product card.",
  },
  {
    id: "f-003",
    question: "How long does a decant last?",
    answer:
      "A 3 ml decant typically gives you 30–40 sprays and 5 ml around 60–80. Wear time per spray depends on the fragrance's concentration and on your skin chemistry — richer woods and ambers outlast fresh citruses considerably.",
  },
  {
    id: "f-004",
    question: "How do I choose between two fragrances?",
    answer:
      "Use the fragrance finder in the Fragrance Guide. Answer five questions about occasion, weather, preferred family, budget and intensity, and the tool scores the catalogue against your answers and explains each match.",
  },
  {
    id: "f-005",
    question: "Is cash on delivery available?",
    answer:
      "Yes — cash on delivery is offered nationwide, alongside bKash and Nagad at checkout. For Dhaka and Chattogram, same-day dispatch is usually possible for orders placed before 2 PM.",
  },
  {
    id: "f-006",
    question: "What does delivery cost?",
    answer:
      "A flat ৳120 nationwide, free on orders above ৳3,000. Estimated delivery is 2–4 working days depending on district; next working day inside Dhaka and Chattogram.",
  },
  {
    id: "f-007",
    question: "Can I exchange an unopened decant?",
    answer:
      "Unopened decants can be exchanged within 7 days of delivery, provided the bottle is sealed. If a decant arrives damaged or leaks in transit, contact us within 48 hours and we will replace it.",
  },
  {
    id: "f-008",
    question: "Are the prices per bottle or per millilitre?",
    answer:
      "The price shown is for the size you select, not per millilitre. Larger sizes work out cheaper per millilitre, which is why the 10 ml and 15 ml options are usually the better value over time.",
  },
  {
    id: "f-009",
    question: "Can I return a fragrance I have opened?",
    answer:
      "For hygiene reasons we cannot accept opened decants back, unless the bottle is faulty or damaged on arrival. Please check the seal and the liquid on arrival, and report any issue within 48 hours.",
  },
  {
    id: "f-010",
    question: "Do you ship outside Bangladesh?",
    answer:
      "Not at present. The demo storefront is configured for nationwide Bangladesh delivery only, but the shipping policy page explains how international shipping would be structured.",
  },
];
