# Development tooling

None of these scripts are part of the running application — they are helpers for building,
verifying and presenting the storefront.

| Script | What it does |
| --- | --- |
| `verify-assets.mjs` | Checks that every image referenced by the catalogue exists in `public/`, and reports unused files. |
| `verify-links.mjs` | Crawls the running site and confirms every internal link resolves (no dead links). |
| `interact.mjs` | Drives a real browser through the whole storefront and runs 27 functional checks — size selection, price updates, add to bag, cart maths, persistence, removal, search, filters, sorting, the empty state, the quiz, bundles, the mobile drawer, horizontal overflow, the 404 page and console errors. |
| `shoot.mjs` | Captures full-page screenshots at 1440 / 768 / 390 px for review or for a client deck. |
| `download-pexels.mjs` | Downloads the curated Pexels photo ids in `pexels-ids.txt` into `public/images/pool` (git-ignored). |
| `build-assets.mjs` | Copies and re-encodes the curated pool images into `public/images/products`, `/categories`, `/bundles` and `/hero`, and writes `public/images/ATTRIBUTION.json`. |

## Usage

```bash
# 1. Start the app
npm run build && npx next start -p 3100

# 2. Verify
node scripts/verify-assets.mjs
node scripts/verify-links.mjs http://localhost:3100
node scripts/interact.mjs http://localhost:3100

# 3. Capture
node scripts/shoot.mjs http://localhost:3100
```

## Rebuilding the imagery

```bash
node scripts/download-pexels.mjs      # fills public/images/pool
node scripts/build-assets.mjs          # writes the curated folders + attribution
node scripts/verify-assets.mjs
```

`pexels-ids.txt` holds the photo ids and the mapping from photo to product lives in
`build-assets.mjs`. Swap both to re-skin the catalogue for a different client.
