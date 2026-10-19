/**
 * ============================================================================
 *  SCENTORA — CENTRAL SITE CONFIGURATION
 * ============================================================================
 *
 *  This is the single file you edit when presenting this demo to a new
 *  client. Everything that identifies the brand lives here: name, wordmark,
 *  colour palette, contact details, social links, announcement bar, delivery
 *  messaging, currency, hero copy, footer content and the products that are
 *  featured on the home page.
 *
 *  HOW TO RE-BRAND (2 minutes):
 *  --------------------------------------------------------------------------
 *  1. Change `brand.name` / `brand.wordmark` below.
 *  2. Swap the hex values in `brand.colors` — the whole site re-themes.
 *  3. Update `contact`, `social`, `announcement` and `delivery`.
 *  4. Replace the catalogue in `src/data/products.ts` (same TypeScript shape).
 *  5. Update the `featured` arrays to point at your own product slugs.
 *
 *  No component hardcodes the brand name — they all read from this file.
 */

export interface SiteConfig {
  brand: {
    /** Full brand name, used in metadata and copy. */
    name: string;
    /** Short wordmark shown in the header. */
    wordmark: string;
    /** Optional tagline used under the wordmark / in the footer. */
    tagline: string;
    /** One-line brand description used in the footer + meta description. */
    description: string;
    /**
     * Core palette. Every colour in the interface resolves through these
     * values, so changing them re-skins the entire storefront.
     */
    colors: {
      /** Page background — warm ivory. */
      ivory: string;
      /** Slightly deeper background for alternating sections. */
      paper: string;
      /** Sand / beige panel colour. */
      beige: string;
      /** Primary body text — charcoal. */
      charcoal: string;
      /** Secondary text. */
      muted: string;
      /** Muted gold accent used for CTAs, badges and rules. */
      gold: string;
      /** Very light gold for gradients and highlights. */
      goldSoft: string;
      /** Hairline border colour. */
      line: string;
    };
  };

  /** Store currency. */
  currency: {
    code: string;
    symbol: string;
    /** Locale used by `Intl.NumberFormat`. */
    locale: string;
  };

  /** Announcement bar copy. Set `text` to "" to hide the bar. */
  announcement: {
    text: string;
    /** Optional secondary message shown beside the main one on wide screens. */
    secondary?: string;
  };

  /** Contact details surfaced in the footer, contact page and header. */
  contact: {
    /** Dialable number, digits only. */
    phone: string;
    /** Human-friendly number shown in the interface. */
    phoneDisplay: string;
    /** WhatsApp number in international format. */
    whatsapp: string;
    email: string;
    /** Physical address — demo placeholder. */
    address: string;
    hours: string;
  };

  /** Social profiles. `href` values are demo placeholders. */
  social: { platform: string; href: string }[];

  /** Delivery + fulfilment messaging (demo content). */
  delivery: {
    headline: string;
    body: string;
    /** Free delivery threshold in store currency. */
    freeDeliveryThreshold: number;
    /** Standard delivery fee in store currency. */
    deliveryFee: number;
  };

  /** Hero section content. */
  hero: {
    eyebrow: string;
    /** Main headline. `headlineHighlight` is rendered in the accent colour. */
    headline: string;
    headlineHighlight: string;
    body: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    /** Small promotional label rendered over the hero image. */
    promo: {
      label: string;
      title: string;
      meta: string;
      price: string;
      href: string;
    };
    /** Short proof points listed below the CTAs. */
    highlights: { label: string }[];
  };

  /** Home page section configuration. */
  sections: {
    categoriesTitle: string;
    categoriesSubtitle: string;
    featuredTitle: string;
    featuredSubtitle: string;
    bestsellersTitle: string;
    bestsellersSubtitle: string;
    bundlesTitle: string;
    bundlesSubtitle: string;
    brandsTitle: string;
    brandsSubtitle: string;
    finderTitle: string;
    finderSubtitle: string;
    testimonialsTitle: string;
    testimonialsSubtitle: string;
    faqTitle: string;
    faqSubtitle: string;
    newsletterTitle: string;
    newsletterSubtitle: string;
  };

  /** Product slugs surfaced in the "Featured" row. Empty = auto-pick. */
  featuredProductSlugs: string[];
  /** Product slugs surfaced in the "Bestsellers" row. Empty = auto-pick. */
  bestsellerProductSlugs: string[];

  /** Footer content. */
  footer: {
    about: string;
    columns: {
      shop: { title: string; links: { label: string; href: string }[] };
      help: { title: string; links: { label: string; href: string }[] };
      house: { title: string; links: { label: string; href: string }[] };
    };
    /** `{year}` is replaced with the current year at render time. */
    legal: string;
  };

  /** Trust / "why shop with us" points shown on the home page and about page. */
  trustPoints: {
    title: string;
    body: string;
    icon: "sparkles" | "shield" | "flask" | "truck" | "wallet" | "refresh";
  }[];

  /** Newsletter block copy. */
  newsletter: {
    perk: string;
    disclaimer: string;
  };
}

/** The one exported configuration object. Import this everywhere. */
export const siteConfig: SiteConfig = {
  brand: {
    name: "Scentora",
    wordmark: "Scentora",
    tagline: "Fragrance, considered",
    description:
      "A premium fragrance boutique offering designer and niche scents in decanted sizes from 3 ml to 15 ml.",
    colors: {
      ivory: "#FBF7F1",
      paper: "#F4EEE4",
      beige: "#E9DFCE",
      charcoal: "#1F1B16",
      muted: "#6E6558",
      gold: "#A8874F",
      goldSoft: "#DCC49A",
      line: "#E4DACB",
    },
  },

  currency: {
    code: "BDT",
    symbol: "৳",
    locale: "en-BD",
  },

  announcement: {
    text: "Nationwide delivery across all 64 districts  •  Cash on delivery available  •  Free delivery on orders over ৳3,000",
    secondary: "New: The Luxury Discovery Set — 5 × 5 ml decants, ৳5,450",
  },

  contact: {
    phone: "+8801700000000",
    phoneDisplay: "+880 1700-000000",
    whatsapp: "+8801700000000",
    email: "hello@scentora.demo",
    address: "Studio 14, Gulshan Avenue, Dhaka 1212, Bangladesh",
    hours: "Saturday – Thursday, 10:00 AM – 8:00 PM",
  },

  social: [
    { platform: "Instagram", href: "https://instagram.com" },
    { platform: "Facebook", href: "https://facebook.com" },
    { platform: "TikTok", href: "https://tiktok.com" },
    { platform: "YouTube", href: "https://youtube.com" },
  ],

  delivery: {
    headline: "Nationwide delivery in 2–4 working days",
    body: "We deliver to all 64 districts. Inside Dhaka and Chattogram delivery is available on the next working day, with cash on delivery and bKash/Nagad options at checkout.",
    freeDeliveryThreshold: 3000,
    deliveryFee: 120,
  },

  hero: {
    eyebrow: "The Signature Edit",
    headline: "Discover Your",
    headlineHighlight: "Signature Scent",
    body: "Explore a curated edit of designer, niche and everyday fragrances. Try them in considered decant sizes before you commit to the full bottle.",
    primaryCta: { label: "Explore Collection", href: "/shop" },
    secondaryCta: { label: "Find Your Fragrance", href: "/fragrance-guide#finder" },
    promo: {
      label: "Featured this week",
      title: "Midnight Oud",
      meta: "Amber · Rose · Oud",
      price: "From ৳780",
      href: "/product/midnight-oud",
    },
    highlights: [
      { label: "Authenticity sourced" },
      { label: "Decants from 3 ml" },
      { label: "COD nationwide" },
    ],
  },

  sections: {
    categoriesTitle: "Shop by Category",
    categoriesSubtitle:
      "Start with a mood, a season or a family — then refine until the bottle feels like yours.",
    featuredTitle: "Featured Fragrances",
    featuredSubtitle: "A rotating edit of house favourites, chosen for the season.",
    bestsellersTitle: "Bestsellers",
    bestsellersSubtitle: "The decant sizes our customers reorder most often.",
    bundlesTitle: "Better Together",
    bundlesSubtitle:
      "Curated sets that cost less than buying the same fragrances individually.",
    brandsTitle: "The Houses We Carry",
    brandsSubtitle: "From heritage maisons to modern niche labels.",
    finderTitle: "Not Sure Where to Start?",
    finderSubtitle:
      "Answer five questions and we will match you with fragrances — and explain why each one fits.",
    testimonialsTitle: "Sample Testimonials",
    testimonialsSubtitle:
      "Illustrative copy written to demonstrate layout only. These are not real customer reviews.",
    faqTitle: "Frequently Asked Questions",
    faqSubtitle: "Everything you might want to know before your first order.",
    newsletterTitle: "Stay in the Scent Loop",
    newsletterSubtitle:
      "Occasional notes on new arrivals, restocks and private offers. No noise.",
  },

  featuredProductSlugs: [
    "dior-sauvage",
    "bleu-de-chanel",
    "creed-aventus",
    "baccarat-rouge-540",
    "lattafa-khamrah",
    "ysl-y",
  ],
  bestsellerProductSlugs: [
    "versace-eros",
    "afnan-9pm",
    "rasasi-hawas",
    "tom-ford-noir-extreme",
    "ysl-y",
    "dior-sauvage",
  ],

  footer: {
    about:
      "Scentora is a demonstration storefront for a fragrance boutique. Every product, price and rating in this build is sample data intended to showcase the experience.",
    columns: {
      shop: {
        title: "Shop",
        links: [
          { label: "All Fragrances", href: "/shop" },
          { label: "Men's Fragrances", href: "/shop?gender=men" },
          { label: "Women's Fragrances", href: "/shop?gender=women" },
          { label: "Unisex", href: "/shop?gender=unisex" },
          { label: "Combos", href: "/combos" },
        ],
      },
      help: {
        title: "Help",
        links: [
          { label: "Fragrance Guide", href: "/fragrance-guide" },
          { label: "Contact Us", href: "/contact" },
          { label: "Shipping Policy", href: "/shipping" },
          { label: "Returns & Exchange", href: "/returns" },
          { label: "Privacy Policy", href: "/privacy" },
        ],
      },
      house: {
        title: "The House",
        links: [
          { label: "About Scentora", href: "/about" },
          { label: "Our Brands", href: "/brands" },
          { label: "Why Shop With Us", href: "/about#why-us" },
          { label: "Authenticity", href: "/about#authenticity" },
        ],
      },
    },
    legal: "© {year} Scentora. Demo storefront built for presentation purposes.",
  },

  trustPoints: [
    {
      title: "Considered Selection",
      body: "Every fragrance in the catalogue is hand-checked and decanted by our own team, never repackaged from grey-market stock.",
      icon: "sparkles",
    },
    {
      title: "Try Before You Commit",
      body: "Start at 3 ml. If the dry-down on your skin is right, step up to 5, 10 or 15 ml — no wasted full bottles.",
      icon: "flask",
    },
    {
      title: "Sourced Authentically",
      body: "Our demo sourcing policy: we buy from authorised distributors and label each batch with its origin. Sample copy for layout purposes.",
      icon: "shield",
    },
    {
      title: "Nationwide Delivery",
      body: "Dispatched to all 64 districts, with cash on delivery and mobile wallet options available at checkout.",
      icon: "truck",
    },
    {
      title: "Pay on Delivery",
      body: "Inspect the decant before you pay. Our courier partners support cash on delivery nationwide.",
      icon: "wallet",
    },
    {
      title: "Easy Exchange",
      body: "Unopened decants can be exchanged within 7 days of delivery. See the full returns policy for details.",
      icon: "refresh",
    },
  ],

  newsletter: {
    perk: "10% off your first decant order",
    disclaimer:
      "This signup form runs entirely in your browser for demonstration purposes — no address is sent anywhere.",
  },
};
