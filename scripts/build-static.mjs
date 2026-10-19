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
import { fileURLToPath } from "node:url";
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

/** Run a node script and wait for it to finish. */
function run(script) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(root, "scripts", script)], {
      cwd: root,
      stdio: "inherit",
    });
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${script} exited with ${code}`)),
    );
  });
}

async function main() {
  // Regenerate the responsive image variants first so the export always
  // contains up-to-date assets.
  await run("build-image-variants.mjs");

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
}

main();
