/**
 * Tree-shaking / bundle-size report.
 *
 * Bundles a few representative consumer entrypoints against the built `dist/`
 * using rolldown + oxc-minify (the same engines behind Vite 8 and oxlint), then
 * reports gzipped sizes.
 *
 * The point is not the absolute numbers — it's the ratio. Importing one
 * component must not drag in the rest of the library.
 *
 *   bun run size
 *
 * Requires `bun run build` first.
 */

import {
  existsSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

import { minifySync } from "oxc-minify";
import { build } from "rolldown";

if (!existsSync("dist/components/button.js")) {
  console.error("dist/ not found — run `bun run build` first.");
  process.exit(1);
}

const components = readdirSync("dist/components")
  .filter((f) => f.endsWith(".js"))
  .map((f) => f.replace(/\.js$/, ""));

// The "everything" case stands in for a consumer who imported every component.
// With no barrel there is no single module to measure, so build the worst case
// explicitly from the component list.
const allImports = components
  .map((c, i) => `import * as M${i} from "./dist/components/${c}.js";`)
  .join("\n");

const CASES = [
  {
    name: "Button",
    code: `import { Button } from "./dist/components/button.js";\nconsole.log(Button);`,
  },
  {
    name: "Button + Badge",
    code:
      `import { Button } from "./dist/components/button.js";\n` +
      `import { Badge } from "./dist/components/badge.js";\n` +
      `console.log(Button, Badge);`,
  },
  {
    name: "cn only",
    code: `import { cn } from "cn";\nconsole.log(cn);`,
  },
  {
    name: `All ${components.length} components`,
    code: `${allImports}\nconsole.log(${components.map((_, i) => `M${i}`).join(", ")});`,
  },
];

// Kept inside the project so bare imports (`cn`) resolve through the local
// node_modules — a temp dir outside the tree would leave them unresolved and
// silently external, reporting a misleadingly tiny bundle.
const tmp = mkdtempSync(join(process.cwd(), ".size-"));
const results: Array<{ name: string; gzip: number }> = [];

try {
  const measurements = CASES.map(async (c, i) => {
    const entry = join(tmp, `case-${i}.js`);
    // Rewrite ./dist -> absolute so the temp entry resolves correctly.
    writeFileSync(
      entry,
      c.code.replaceAll("./dist/", `${process.cwd()}/dist/`),
    );

    const out = join(tmp, `out-${i}.js`);
    await build({
      input: entry,
      external: [/^react/, /^@base-ui/],
      output: { file: out, format: "esm" },
      logLevel: "silent",
    });

    const code = await Bun.file(out).text();
    const min = minifySync(out, code, { compress: true, mangle: true }).code;
    return { name: c.name, gzip: gzipSync(min, { level: 9 }).length };
  });

  results.push(...(await Promise.all(measurements)));
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

const kb = (n: number) => `${(n / 1024).toFixed(1)} kB`;
const width = Math.max(...results.map((r) => r.name.length));

console.log("\n  gzipped, React + Base UI external (rolldown + oxc-minify)\n");
for (const r of results) {
  console.log(`  ${r.name.padEnd(width)}  ${kb(r.gzip).padStart(9)}`);
}

const one = results.find((r) => r.name === "Button")?.gzip ?? 0;
const all =
  results.find((r) => r.name.startsWith("All "))?.gzip ??
  Number.MAX_SAFE_INTEGER;
const cn = results.find((r) => r.name === "cn only")?.gzip ?? 0;

const share = one / all;
console.log(
  `\n  One component is ${(share * 100).toFixed(1)}% of the full library.`,
);
console.log(`  Of that, ${kb(cn)} is cn — Button itself is ~${kb(one - cn)}.`);

// A single component pulls in cn and little else. If that share creeps up,
// something has started importing across component boundaries and the per-file
// isolation that makes subpath imports cheap is gone.
const LIMIT = 0.25;
if (share > LIMIT) {
  console.error(
    `\n  FAIL: one component is ${(share * 100).toFixed(1)}% of the library ` +
      `(limit ${LIMIT * 100}%) — components are no longer independent.`,
  );
  process.exit(1);
}
console.log("  Components are independent; you ship only what you import.\n");
