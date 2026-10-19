import type { Brand } from "@/types";

/**
 * Brand directory used by the `/brands` page and the brand grid on the home
 * page. All wordmarks are plain text — no third-party logo files are used.
 */
export const brands: Brand[] = [
  {
    slug: "dior",
    name: "Dior",
    monogram: "DIOR",
    origin: "Paris, France",
    description:
      "House of tailoring and fragrance since 1947. Dior built the modern fougère blueprint and continues to make the most wearable designer scents on the market.",
    niche: false,
  },
  {
    slug: "chanel",
    name: "Chanel",
    monogram: "CHANEL",
    origin: "Paris, France",
    description:
      "A century of Parisian perfumery, from N°5 to Coco Mademoiselle. Precise, composed and built to be worn rather than noticed.",
    niche: false,
  },
  {
    slug: "versace",
    name: "Versace",
    monogram: "VERSACE",
    origin: "Milan, Italy",
    description:
      "Bold Mediterranean brights — Eros, Dylan and Bright Crystal. Loud in the best way and consistently crowd-pleasing.",
    niche: false,
  },
  {
    slug: "yves-saint-laurent",
    name: "Yves Saint Laurent",
    monogram: "YSL",
    origin: "Paris, France",
    description:
      "Modern glamour in a bottle. From the sharp Y to the amber warmth of Black Opium and Libre.",
    niche: false,
  },
  {
    slug: "giorgio-armani",
    name: "Giorgio Armani",
    monogram: "ARMANI",
    origin: "Milan, Italy",
    description:
      "Understated Italian tailoring translated into scent. Acqua di Gio and Code remain archetypes of their categories.",
    niche: false,
  },
  {
    slug: "gucci",
    name: "Gucci",
    monogram: "GUCCI",
    origin: "Florence, Italy",
    description:
      "Contemporary Florentine craft, from the flora-and-vetiver Eau de Parfum to greener, more modern releases.",
    niche: false,
  },
  {
    slug: "prada",
    name: "Prada",
    monogram: "PRADA",
    origin: "Milan, Italy",
    description:
      "Milano minimalism with a sharp edge. Paradoxe and the Luna line show Prada's instinct for modern composition.",
    niche: false,
  },
  {
    slug: "valentino",
    name: "Valentino",
    monogram: "VALENTINO",
    origin: "Rome, Italy",
    description:
      "Roman exuberance. Valentino Rosso and Eros are generous, romantic and unmistakably Italian.",
    niche: false,
  },
  {
    slug: "davidoff",
    name: "Davidoff",
    monogram: "DAVIDOFF",
    origin: "Geneva, Switzerland",
    description:
      "Swiss precision and the original marine archetype — Cool Water has defined the aquatic category since 1988.",
    niche: false,
  },
  {
    slug: "hugo-boss",
    name: "Hugo Boss",
    monogram: "BOSS",
    origin: "Metz, Germany",
    description:
      "Clean, precise German design in scent form. Bottled and The Scent are dependable, modern office signatures.",
    niche: false,
  },
  {
    slug: "montblanc",
    name: "Montblanc",
    monogram: "MONTBLANC",
    origin: "Hamburg, Germany",
    description:
      "Writing-instrument craftsmanship applied to fragrance. Explorer is a cedar-and-vetiver workhorse.",
    niche: false,
  },
  {
    slug: "carolina-herrera",
    name: "Carolina Herrera",
    monogram: "CH",
    origin: "New York, USA",
    description:
      "New York glamour with Latin warmth. Good Girl is a sweet, confident floral with a coffee edge.",
    niche: false,
  },
  {
    slug: "narciso-rodriguez",
    name: "Narciso Rodriguez",
    monogram: "NARCISO",
    origin: "New York, USA",
    description:
      "The modern musky aesthetic. For Her is the definitive 'your skin, but better' fragrance of the last decade.",
    niche: false,
  },
  {
    slug: "jo-malone",
    name: "Jo Malone",
    monogram: "JO MALONE",
    origin: "London, England",
    description:
      "English restraint. Colognes, creams and fruit-and-mint compositions that are minimal and immaculate.",
    niche: false,
  },
  {
    slug: "creed",
    name: "Creed",
    monogram: "CREED",
    origin: "Grasse, France",
    description:
      "Six generations in Grasse. Aventus and Silver Mountain Water are the reference points for modern luxury.",
    niche: true,
  },
  {
    slug: "tom-ford",
    name: "Tom Ford",
    monogram: "TOM FORD",
    origin: "New York, USA",
    description:
      "Dense, deliberate formulations. Noir Extreme and Neroli Portofino mark opposite ends of the house's range.",
    niche: true,
  },
  {
    slug: "maison-francis-kurkdjian",
    name: "Maison Francis Kurkdjian",
    monogram: "MFK",
    origin: "Grasse, France",
    description:
      "The house that redefined modern perfumery's reach. Baccarat Rouge 540 remains the benchmark amber.",
    niche: true,
  },
  {
    slug: "byredo",
    name: "Byredo",
    monogram: "BYREDO",
    origin: "Stockholm, Sweden",
    description:
      "Stockholm minimalism with a tactile, dry edge. Balta d'Afrique is quietly addictive.",
    niche: true,
  },
  {
    slug: "le-labo",
    name: "Le Labo",
    monogram: "LE LABO",
    origin: "New York, USA",
    description:
      "Laboratory aesthetic, numbered batches, cult classics. Santal 33 and Bergamote 22 are the signatures.",
    niche: true,
  },
  {
    slug: "lattafa",
    name: "Lattafa",
    monogram: "LATTAFA",
    origin: "Dubai, UAE",
    description:
      "Dubai's most explosive house. Khamrah and Ramz deliver serious performance at a remarkably accessible price.",
    niche: false,
  },
  {
    slug: "afnan",
    name: "Afnan",
    monogram: "AFNAN",
    origin: "Dubai, UAE",
    description:
      "Middle Eastern performance house. 9PM and Bleeding Roses are crowd magnets with genuine staying power.",
    niche: false,
  },
  {
    slug: "rasasi",
    name: "Rasasi",
    monogram: "RASASI",
    origin: "Dubai, UAE",
    description:
      "Fresh, modern and value-forward. Hawas and La Vie are built for hot weather and wide appeal.",
    niche: false,
  },
  {
    slug: "al-haramain",
    name: "Al Haramain",
    monogram: "AL HARAMAIN",
    origin: "Makkah, Saudi Arabia",
    description:
      "Makkah's heritage house. Warm, sweet oud compositions that bridge tradition and modern perfumery.",
    niche: true,
  },
  {
    slug: "swiss-arabian",
    name: "Swiss Arabian",
    monogram: "SWISS ARABIAN",
    origin: "Geneva, Switzerland",
    description:
      "A century of Swiss precision applied to oriental fragrance. Shaghaf Oud is the modern, sweet-leaning icon.",
    niche: false,
  },
  {
    slug: "scentora-atelier",
    name: "Scentora Atelier",
    monogram: "ATELIER",
    origin: "Dhaka, Bangladesh",
    description:
      "Our in-house composition house. Midnight Oud is the first release — dense, warm and long-lasting.",
    niche: true,
  },
];

/** Look up a brand by its display name. */
export const brandByName = new Map(brands.map((brand) => [brand.name, brand]));
