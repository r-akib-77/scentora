import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Noto_Sans_Bengali } from "next/font/google";

import { CartDrawer } from "@/components/cart/cart-drawer";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { SearchOverlay } from "@/components/layout/search-overlay";
import { ProductQuickView } from "@/components/product/product-quick-view";
import { siteConfig } from "@/config/site";
import { CartProvider } from "@/providers/cart-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { UIProvider } from "@/providers/ui-provider";

import "./globals.css";

const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

/**
 * The Bengali taka sign (৳) is not part of the Latin display faces, so it is
 * supplied by a dedicated Bengali face and picked up automatically as a
 * per-glyph fallback. Without this the currency symbol renders in whatever
 * the operating system happens to provide and breaks the price alignment.
 */
const takaFont = Noto_Sans_Bengali({
  variable: "--font-taka",
  subsets: ["bengali"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://scentora.pages.dev",
  ),
  title: {
    default: `${siteConfig.brand.name} — ${siteConfig.brand.description}`,
    template: `%s · ${siteConfig.brand.name}`,
  },
  description: siteConfig.brand.description,
  applicationName: siteConfig.brand.name,
  keywords: [
    "perfume",
    "fragrance",
    "decant",
    "niche perfume",
    "designer fragrance",
    "Bangladesh",
    siteConfig.brand.name,
  ],
  authors: [{ name: siteConfig.brand.name }],
  openGraph: {
    title: `${siteConfig.brand.name} — ${siteConfig.brand.tagline}`,
    description: siteConfig.brand.description,
    type: "website",
    siteName: siteConfig.brand.name,
    url: "/",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: `${siteConfig.brand.name} — ${siteConfig.brand.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.brand.name} — ${siteConfig.brand.tagline}`,
    description: siteConfig.brand.description,
    images: ["/og.jpg"],
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: siteConfig.brand.colors.ivory,
  width: "device-width",
  initialScale: 1,
};

/**
 * Injects the brand palette from `src/config/site.ts` as CSS custom
 * properties. Change the colours there and the whole site re-themes.
 */
function BrandTheme() {
  const { colors } = siteConfig.brand;
  const css = `:root{
  --sc-ivory:${colors.ivory};
  --sc-paper:${colors.paper};
  --sc-beige:${colors.beige};
  --sc-charcoal:${colors.charcoal};
  --sc-muted:${colors.muted};
  --sc-gold:${colors.gold};
  --sc-gold-soft:${colors.goldSoft};
  --sc-line:${colors.line};
}`;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <BrandTheme />
      </head>
      <body
        className={`${displayFont.variable} ${bodyFont.variable} ${takaFont.variable} antialiased`}
      >
        <ToastProvider>
          <UIProvider>
            <CartProvider>
              <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-[var(--sc-charcoal)] focus:px-4 focus:py-2 focus:text-[12px] focus:uppercase focus:tracking-[0.16em] focus:text-[var(--sc-ivory)]"
              >
                Skip to content
              </a>
              <AnnouncementBar />
              <Header />
              <main id="main">{children}</main>
              <Footer />
              <CartDrawer />
              <MobileNavigation />
              <SearchOverlay />
              <ProductQuickView />
            </CartProvider>
          </UIProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
