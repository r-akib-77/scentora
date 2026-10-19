import type { NextConfig } from "next";

/**
 * The site can run in two modes:
 *
 *  - **Server mode** (default) — `npm run dev` / `npm run build && npm start`.
 *  - **Static export mode** — set `STATIC_EXPORT=true` to emit a fully static
 *    site in `out/`, ready for any static host (Cloudflare Pages, Netlify,
 *    S3, nginx …). This is what the Cloudflare deployment uses.
 *
 * Images are served through a custom loader (`src/lib/image-loader.ts`) in
 * both modes, so there is no image optimiser and no server dependency.
 */
const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : undefined,
  trailingSlash: isStaticExport,
  reactStrictMode: true,
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
  },
};

export default nextConfig;
