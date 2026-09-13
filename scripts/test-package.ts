import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  checkContent,
  checkFileSet,
  expectedFiles,
  root,
  walk,
} from "./release-check";

const installedVersion = (name: string) =>
  JSON.parse(
    readFileSync(join(root, "node_modules", name, "package.json"), "utf8"),
  ).version;

const fixture = mkdtempSync(join(tmpdir(), "xiod-ui-consumer-"));
try {
  // Real pack: prepack builds and validates the package. Never skip its hooks.
  // Override an outer npm publish --dry-run: this test still needs a local
  // archive, but never publishes it or contacts the registry to upload it.
  execFileSync(
    "npm",
    ["pack", "--dry-run=false", "--json", "--pack-destination", fixture],
    {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024,
    },
  );
  const expected = expectedFiles();
  // Hook output can precede npm's JSON; inspect the actual archive instead.
  const archives = readdirSync(fixture).filter((name) => name.endsWith(".tgz"));
  if (archives.length !== 1) throw new Error("Expected exactly one tarball");
  const archive = join(fixture, archives[0]);
  const entries = execFileSync("tar", ["-tzf", archive], { encoding: "utf8" })
    .trim()
    .split("\n");
  checkFileSet(
    entries.map((path) => path.replace(/^package\//, "")),
    expected,
  );

  const consumer = join(fixture, "consumer");
  mkdirSync(consumer);
  writeFileSync(
    join(consumer, "package.json"),
    JSON.stringify({
      name: "xiod-ui-release-consumer",
      private: true,
      type: "module",
      dependencies: {
        "xiod-ui": `file:${archive}`,
        react: installedVersion("react"),
        "react-dom": installedVersion("react-dom"),
      },
      devDependencies: {
        typescript: installedVersion("typescript"),
        "@types/react": installedVersion("@types/react"),
        "@types/react-dom": installedVersion("@types/react-dom"),
      },
    }),
  );
  // Consumer installation must not execute dependency lifecycle scripts.
  execFileSync("bun", ["install", "--ignore-scripts"], {
    cwd: consumer,
    stdio: "inherit",
  });
  const installed = join(consumer, "node_modules/xiod-ui");
  checkFileSet(
    walk(join(installed, "dist")),
    new Set([...expected].filter((path) => path.startsWith("dist/"))),
  );
  for (const path of expected) {
    const contents = readFileSync(join(installed, path));
    if (!contents.equals(readFileSync(join(root, path))))
      throw new Error(`Tarball content mismatch: ${path}`);
    checkContent(path, contents.toString("utf8"));
  }
  for (const file of ["smoke.mjs", "consumer.tsx", "tsconfig.json"]) {
    copyFileSync(
      join(root, "scripts/fixtures/consumer", file),
      join(consumer, file),
    );
  }
  execFileSync("node", ["smoke.mjs"], { cwd: consumer, stdio: "inherit" });
  execFileSync("bun", ["node_modules/typescript/bin/tsc", "--noEmit"], {
    cwd: consumer,
    stdio: "inherit",
  });
  console.log(
    `Tarball consumer passed: ${expected.size} files verified, entrypoints imported, SSR and TypeScript checked.`,
  );
} finally {
  // Only remove the isolated directory created by this invocation.
  rmSync(fixture, { recursive: true, force: true });
}
