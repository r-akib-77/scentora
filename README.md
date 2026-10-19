# Scentora — Premium Perfume E-Commerce Demo

A production-quality, **frontend-only** fragrance storefront built with Next.js 15 (App
Router), TypeScript, Tailwind CSS v4, Lucide icons and Framer Motion.

Everything runs locally in the browser. There is **no backend, no database, no
authentication service, no payment gateway and no external API** — the catalogue, the
shopping bag, the filters and the fragrance finder are all driven by local data and React
state.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm run start    # serve the production build
```

No environment variables are required. The only build-time network access is Google Fonts
(for `next/font`), which is cached in `.next/cache` after the first build.

---

## What's in the box

| Route | Purpose |
| --- | --- |
| `/` | Home — hero, categories, featured, bestsellers, bundles, finder, brands, trust, testimonials, FAQ, newsletter |
| `/shop` | Full collection — search, filters, sorting, active chips, empty state, responsive filter drawer |
| `/product/[slug]` | Product detail — gallery, size/quantity selectors, notes, performance, related products |
| `/brands` | Brand directory (25 houses) — each links to a filtered collection |
| `/combos` | Curated bundles with per-item breakdown and savings |
| `/fragrance-guide` | Editorial guide, glossary, FAQ and the five-step fragrance finder |
| `/about` | About, why-us, authenticity, decant sizes, sample testimonials |
| `/contact` | Validated contact form with a demo success state |
| `/privacy`, `/shipping`, `/returns` | Policy pages built from a shared layout |
| 404 | Custom not-found page with product suggestions |

### Interactions

- **Decant size selector** on every card, quick view and product page — 3 / 5 / 10 / 15 ml,
  priced per size, carried through to the bag as its own line.
- **Shopping bag** with live count, quantity steppers, removal, subtotal, free-delivery
  progress, empty state and a clearly-labelled **demo checkout** (no order, no payment).
- **Cart persistence** via `localStorage`.
- **Search overlay** with live, weighted local results.
- **Collection filters** — free text, brand, gender, scent family, bottle size, price range,
  price bracket — plus sorting by featured, popularity, price and name.
- **Fragrance finder** — five questions, local scoring engine, explained results.
- **Bundle builder** — adds each decant to the bag at its normal price.
- **Toasts**, mobile drawer, quick-view modal, scroll reveals, reduced-motion support.

---

## Re-branding for a new client (≈ 5 minutes)

Everything that identifies the brand lives in **one file**: `src/config/site.ts`.

1. **`brand.name` / `brand.wordmark`** — the new brand name.
2. **`brand.colors`** — the whole storefront re-themes from these eight values. They are
   injected as CSS custom properties at runtime, so no component changes are needed.
3. **`announcement`**, **`delivery`**, **`contact`**, **`social`** — the shop's own messaging.
4. **`currency`** — symbol, code and locale (`Intl.NumberFormat`).
5. **`hero`**, **`sections`**, **`footer`**, **`trustPoints`**, **`newsletter`** — all copy.
6. **`featuredProductSlugs` / `bestsellerProductSlugs`** — which products lead the home page.

### Replacing the catalogue

`src/data/products.ts` holds **34 fragrances**. One record looks like this:

```ts
{
  id: "p-001",
  slug: "dior-sauvage",              // becomes /product/dior-sauvage
  brand: "Dior",
  name: "Sauvage",
  tagline: "The modern signature",
  description: "…",
  image: "/images/products/dior-sauvage.jpg",
  gallery: ["/images/products/dior-sauvage.jpg"],
  variants: [                        // only list the sizes you actually stock
    { size: 3,  price: 650 },
    { size: 5,  price: 1000 },
    { size: 10, price: 1850 },
    { size: 15, price: 2650 },
  ],
  notes: { top: [...], heart: [...], base: [...] },
  family: "spicy",
  familyLabel: "Aromatic Fougère",
  gender: "men",
  occasions: ["daily", "office", "date-night"],
  seasons: ["summer", "spring", "all-season"],
  tier: "premium",
  concentration: "Eau de Parfum",
  concentrationPercent: 18,
  featured: true,
  bestseller: true,
  rating: 4.8,                       // clearly labelled as demo data in the UI
  reviewCount: 312,
  longevity: 8,                      // illustrative
  projection: 5,                     // illustrative, 1–5
  tags: ["bergamot", "fougere", "pepper"],
  popularity: 98,
}
```

Drop the matching photo into `public/images/products/<slug>.jpg`. If a photo is missing the
`SmartImage` component falls back to a branded placeholder, so the catalogue never shows a
broken image.

Other editable data files:

| File | Contents |
| --- | --- |
| `src/data/brands.ts` | 25 fragrance houses (typographic wordmarks — no third-party logos) |
| `src/data/bundles.ts` | Curated bundles and the six category tiles |
| `src/data/content.ts` | Sample testimonials and FAQs |
| `src/data/guide.ts` | Fragrance-guide sections, glossary and the quiz definition |

---

## Project structure

```
src/
  app/                 Routes (App Router)
    layout.tsx         Fonts, providers, header, footer, overlays
    page.tsx           Home
    shop/              Collection
    product/[slug]/    Product detail
    brands/ combos/ fragrance-guide/ about/ contact/
    privacy/ shipping/ returns/
    not-found.tsx
  components/
    layout/            Header, announcement bar, mobile nav, search overlay, footer
    product/           Card, grid, size selector, gallery, quick view, purchase panel
    shop/              Filter sidebar, mobile filter drawer, collection view
    cart/              Cart drawer, cart item
    finder/            Fragrance finder
    home/              Hero, categories, brands, bundles, testimonials, FAQ, newsletter
    brands/ contact/ policy/ ui/
  providers/           Cart, toast and UI (overlay) state — shared React context
  lib/                 Filters, recommendation engine, formatting, scroll lock
  config/site.ts       ← the single brand configuration file
  data/                The mock catalogue
  types/               Shared TypeScript types
public/images/         Product, category, bundle and hero photography
scripts/               Optional QA + asset tooling (see scripts/README.md)
```

---

## Architecture notes

- **State** — `CartProvider`, `ToastProvider` and `UIProvider` are React context providers
  mounted once in the root layout. No global library, no duplicated business logic.
- **Server vs client** — pages are Server Components; only interactive pieces
  (`"use client"`) hold state. `parseFiltersFromParams` lives in `src/lib/filters.ts` so the
  server page can read the URL and hydrate the client view with the same filters.
- **Types** — every domain object (product, variant, cart line, filter state, quiz answers,
  recommendation) is typed in `src/types/index.ts`.
- **Fonts** — Cormorant Garamond (display), Inter (UI) and Noto Sans Bengali (the ৳ taka
  sign, which is not part of the Latin faces). All self-hosted by `next/font`.
- **Accessibility** — semantic landmarks, skip link, visible focus rings, `aria-pressed` /
  `aria-checked` on toggles, labelled dialogs, keyboard-dismissable overlays, and a global
  `prefers-reduced-motion` fallback.
- **Performance** — `next/image` with sized `sizes`, static generation for all product pages,
  and lightweight animation (transform/opacity only).

### Demo-content honesty

Ratings, review counts, testimonials, longevity figures, delivery promises and the checkout
are **clearly labelled as sample/demo content** in the interface. The checkout copy states
explicitly that no order is created and no payment is taken. Rewrite these to match what the
real business can claim before going live.

---

## Optional tooling (`scripts/`)

Development helpers — not part of the running app. See `scripts/README.md`.

```bash
node scripts/verify-assets.mjs        # every referenced image exists
node scripts/verify-links.mjs         # every internal link resolves
node scripts/interact.mjs http://localhost:3100   # 27 functional checks in a real browser
node scripts/shoot.mjs  http://localhost:3100    # screenshots at 3 breakpoints
```

---

## Image credits

Catalogue photography is sourced from [Pexels](https://www.pexels.com) under the Pexels
licence. A machine-readable list of the photo ids used is written to
`public/images/ATTRIBUTION.json` by the asset build script.
