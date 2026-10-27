// Assembles the Vercel Build Output (https://vercel.com/docs/build-output-api)
// at the repository root: the built landing page as static files, and the
// Express app bundled into a single Node.js function that answers /api/*.
// Run after the landing page build (see `build:vercel` in the root package.json).
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { sharedOptions } from "./esbuild-options.mjs";

const artifactDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(artifactDir, "..", "..");
const outputDir = path.resolve(rootDir, ".vercel", "output");
const staticDir = path.resolve(outputDir, "static");
const functionDir = path.resolve(outputDir, "functions", "api.func");
const siteDistDir = path.resolve(rootDir, "artifacts", "q4c-systemes", "dist", "public");

async function writeJson(file, value) {
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

async function buildVercelOutput() {
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(functionDir, { recursive: true });

  await cp(siteDistDir, staticDir, { recursive: true });

  await esbuild({
    ...sharedOptions,
    entryPoints: [path.resolve(artifactDir, "src/vercel.ts")],
    outdir: functionDir,
    define: { "process.env.NODE_ENV": '"production"' },
  });

  await writeJson(path.resolve(functionDir, ".vc-config.json"), {
    runtime: "nodejs22.x",
    handler: "vercel.mjs",
    launcherType: "Nodejs",
    shouldAddHelpers: false,
    maxDuration: 15,
  });

  await writeJson(path.resolve(outputDir, "config.json"), {
    version: 3,
    routes: [
      {
        src: "^/assets/(.*)$",
        headers: { "cache-control": "public, max-age=31536000, immutable" },
        continue: true,
      },
      { handle: "filesystem" },
      { src: "^/api(?:/.*)?$", dest: "/api" },
      { src: "^/(.*)$", dest: "/index.html" },
    ],
  });
}

buildVercelOutput().catch((err) => {
  console.error(err);
  process.exit(1);
});
