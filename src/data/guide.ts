/**
 * Fragrance guide content — the editorial section of the `/fragrance-guide`
 * page plus the quiz definition used by the fragrance finder.
 */
import type { Occasion, PriceTier, Season, ScentFamily } from "@/types";
import { familyLabels, occasionLabels, seasonLabels, tierLabels } from "@/lib/utils";

/** A single question in the fragrance finder. */
export interface QuizQuestion {
  id: keyof QuizAnswerMap;
  title: string;
  helper: string;
  options: { value: string; label: string; hint: string }[];
}

/** Maps a quiz question to its answer value type. */
export interface QuizAnswerMap {
  occasion: Occasion;
  season: Season;
  scent: ScentFamily;
  budget: PriceTier;
  style: "subtle" | "balanced" | "bold";
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "occasion",
    title: "Where will you wear it most?",
    helper: "Different occasions call for very different intensities.",
    options: [
      { value: "daily", label: "Daily Wear", hint: "Sweatpants, groceries, the school run" },
      { value: "office", label: "Office", hint: "Meetings, interviews, client calls" },
      { value: "date-night", label: "Date Night", hint: "Dinner, drinks, an evening out" },
      { value: "party", label: "Party", hint: "Late nights and crowded rooms" },
      { value: "formal", label: "Formal", hint: "Weddings, galas, ceremonies" },
    ],
  },
  {
    id: "season",
    title: "What is the weather like?",
    helper: "Heat lifts lighter notes; cold makes deep ones bloom.",
    options: [
      { value: "summer", label: "Summer", hint: "Hot and humid" },
      { value: "winter", label: "Winter", hint: "Cold and dry" },
      { value: "rainy", label: "Rainy", hint: "Monsoon and grey skies" },
      { value: "spring", label: "Spring", hint: "Mild and fresh" },
      { value: "autumn", label: "Autumn", hint: "Cool and crisp" },
    ],
  },
  {
    id: "scent",
    title: "Which family calls to you?",
    helper: "Think of it as a texture rather than a specific bottle.",
    options: [
      { value: "fresh", label: "Fresh", hint: "Clean, bright, zesty" },
      { value: "woody", label: "Woody", hint: "Cedar, sandalwood, dry timber" },
      { value: "sweet", label: "Sweet", hint: "Vanilla, caramel, gourmand" },
      { value: "spicy", label: "Spicy", hint: "Pepper, cinnamon, incense" },
      { value: "aquatic", label: "Aquatic", hint: "Sea breeze and marine notes" },
      { value: "floral", label: "Floral", hint: "Rose, jasmine, peony" },
      { value: "oud", label: "Oud", hint: "Dense, resinous, oriental" },
    ],
  },
  {
    id: "budget",
    title: "What is your budget per decant?",
    helper: "We will keep the suggestions inside your range.",
    options: [
      { value: "affordable", label: "Affordable", hint: "Up to ৳1,000" },
      { value: "mid-range", label: "Mid-range", hint: "৳1,000 – ৳2,000" },
      { value: "premium", label: "Premium", hint: "Above ৳2,000" },
    ],
  },
  {
    id: "style",
    title: "How should it read?",
    helper: "How close do you want it to sit to your skin?",
    options: [
      { value: "subtle", label: "Subtle", hint: "A private signature" },
      { value: "balanced", label: "Balanced", hint: "Noticed, but never loud" },
      { value: "bold", label: "Bold", hint: "Make an entrance" },
    ],
  },
];

/** Editorial guide sections. */
export const guideSections: {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  points: { title: string; body: string }[];
}[] = [
  {
    id: "notes",
    eyebrow: "The Basics",
    title: "How a fragrance is built",
    body:
      "Every perfume is arranged in layers that unfold over hours. Once you understand the three layers, describing a scent becomes much easier — and much more useful when you are choosing between two similar bottles.",
    points: [
      {
        title: "Top notes",
        body: "The first impression. Citrus, pepper and light florals live here and usually fade within 15–30 minutes.",
      },
      {
        title: "Heart notes",
        body: "The character of the fragrance. Rose, jasmine, spice and marine notes emerge once the opening settles.",
      },
      {
        title: "Base notes",
        body: "The foundation and the reason a scent lasts. Woods, amber, oud, vanilla and musks hold the composition together for hours.",
      },
    ],
  },
  {
    id: "concentration",
    eyebrow: "Strength",
    title: "Concentration, longevity and projection",
    body:
      "Concentration describes how much aromatic oil is in the formula. It affects how long a scent lasts and how far it projects, but skin chemistry matters just as much as the label.",
    points: [
      {
        title: "Eau de Toilette (EDT)",
        body: "Around 5–15% oil. Light and fresh — perfect for daytime, office and hot weather. Reapply through the day.",
      },
      {
        title: "Eau de Parfum (EDP)",
        body: "Around 15–20% oil. The everyday sweet spot: more depth and longevity than an EDT without the weight of a parfum.",
      },
      {
        title: "Parfum / Extrait",
        body: "20–30% oil. Rich, dense and long-lasting. Best suited to cooler weather and smaller, confident applications.",
      },
      {
        title: "Projection",
        body: "How far a scent travels from you. Citrus and marine notes project far; heavy resins and oud tend to sit closer to the skin.",
      },
    ],
  },
  {
    id: "decants",
    eyebrow: "The Decant Method",
    title: "Why decants change how you shop",
    body:
      "Buying a full bottle of an untested fragrance is a gamble. Decants let you wear a fragrance across several situations — a hot afternoon, a long dinner, a cold commute — before committing to a size you actually want.",
    points: [
      {
        title: "3 ml",
        body: "The trial size. Roughly 30–40 sprays, enough to judge a scent on your own skin.",
      },
      {
        title: "5 ml",
        body: "The most popular size. A full working week of wear, and the sweet spot in our bundles.",
      },
      {
        title: "10 ml",
        body: "For scents you have already decided on. Noticeably better value per millilitre.",
      },
      {
        title: "15 ml",
        body: "The largest decant we offer — close to a half bottle for a fraction of the price.",
      },
    ],
  },
  {
    id: "application",
    eyebrow: "Practice",
    title: "How to wear fragrance properly",
    body:
      "The same bottle behaves differently depending on where and when you spray it. A few small adjustments make a noticeable difference.",
    points: [
      {
        title: "Pulse points, not your shirt",
        body: "Spray onto skin — behind the ears, at the base of the throat, on the inner wrists. Fabric holds scent longer but misses your body heat.",
      },
      {
        title: "Two sprays is usually enough",
        body: "Start light. You become tolerant of your own scent long before anyone else notices it, and re-application is always possible.",
      },
      {
        title: "Give it time",
        body: "Judge a fragrance after 20 minutes and again after two hours. The opening you fall for may not be the note that stays.",
      },
      {
        title: "One scent at a time",
        body: "Layering two unrelated scents usually muddies both. If you like a combination, build it deliberately and lightly.",
      },
    ],
  },
];

/** Quick-reference glossary used on the guide page. */
export const glossary: { term: string; definition: string }[] = [
  {
    term: "Accord",
    definition: "A blend of several materials that reads as one new scent — 'bergamot accord' behaves like bergamot but is composed from many ingredients.",
  },
  {
    term: "Dry-down",
    definition: "How a fragrance settles on skin over the first few hours once the volatile top notes have evaporated.",
  },
  {
    term: "Eau de Parfum (EDP)",
    definition: "A concentration containing roughly 15–20% aromatic oil. The most widely worn everyday strength.",
  },
  {
    term: "Extrait de Parfum",
    definition: "The richest commercial concentration, usually 20–30% oil. Heavier, longer-lasting and often worn sparingly.",
  },
  {
    term: "Fougère",
    definition: "A classic aromatic structure built around lavender, coumarin and a citrus opening — the shape most modern designer scents follow.",
  },
  {
    term: "Gourmand",
    definition: "A family built on edible notes: vanilla, caramel, chocolate, praline and the like.",
  },
  {
    term: "Incense / resinous",
    definition: "Smoky, church-like notes from frankincense, myrrh and resin. They add depth and a slightly sacred quality.",
  },
  {
    term: "Musk",
    definition: "A soft, skin-like base note that blurs the line between the fragrance and the wearer. The backbone of 'clean' scents.",
  },
  {
    term: "Niche fragrance",
    definition: "A prestige scent produced in smaller volumes by an independent or smaller house, usually less widely distributed than designer labels.",
  },
  {
    term: "Projection",
    definition: "The distance a fragrance travels from the skin. Sometimes called sillage when measured as a trail behind you.",
  },
];

/** Small helpers so the guide page can reuse the shared label maps. */
export const guideLabelMaps = { familyLabels, occasionLabels, seasonLabels, tierLabels };
