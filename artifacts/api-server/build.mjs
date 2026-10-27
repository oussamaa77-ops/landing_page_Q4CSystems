import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";
import { rm } from "node:fs/promises";
import { sharedOptions } from "./esbuild-options.mjs";

const artifactDir = path.dirname(fileURLToPath(import.meta.url));

async function buildAll() {
  const distDir = path.resolve(artifactDir, "dist");
  await rm(distDir, { recursive: true, force: true });

  await esbuild({
    ...sharedOptions,
    entryPoints: [path.resolve(artifactDir, "src/index.ts")],
    outdir: distDir,
  });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
