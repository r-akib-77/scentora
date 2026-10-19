/**
 * Builds a fully static export of the site into `out/`.
 *
 * Sets `STATIC_EXPORT=true` (which flips `next.config.ts` into export mode)
 * and then runs `next build`. Kept as a small Node script so the command
 * works identically on Windows, macOS and Linux.
 *
 * Usage: node scripts/build-static.mjs
 */
import { spawn } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const nextBin = path.join(
  root,
  "node_modules",
  "next",
  "dist",
  "bin",
  "next",
);

const child = spawn(process.execPath, [nextBin, "build"], {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env, STATIC_EXPORT: "true" },
});

child.on("exit", (code) => {
  if (code === 0) {
    console.log("\nStatic export written to ./out");
  }
  process.exit(code ?? 0);
});
