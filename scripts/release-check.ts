import { execFileSync } from "node:child_process";
import { lstatSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { PALETTES } from "./palettes";

export const root = fileURLToPath(new URL("../", import.meta.url));

export function checkContent(path: string, content: string): void {
  const rules: [string, RegExp][] = [
    [
      "source-map metadata",
      /sourceMappingURL|sourceURL\s*=|["'](?:sourcesContent|sourceRoot)["']\s*:/,
    ],
    [
      "private workstation path",
      /\/Users\/|\/home\/|\/private\/var\/|[A-Za-z]:[\\/]Users[\\/]/,
    ],
    [
      "recognized credential",
      /-----BEGIN (?:RSA |EC |OPENSSH |ENCRYPTED )?PRIVATE KEY-----|npm_[A-Za-z0-9]{30,}|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|(?:AKIA|ASIA)[A-Z0-9]{16}/,
    ],
  ];
  for (const [label, pattern] of rules) {
    if (pattern.test(content))
      throw new Error(`Release blocked: ${label} in ${path}`);
  }
}

export function checkFileSet(actual: string[], expected: Set<string>): void {
  const entries = new Set(actual);
  if (entries.size !== actual.length)
    throw new Error("Release blocked: duplicate entries");
  for (const path of actual) {
    if (!expected.has(path))
      throw new Error(`Release blocked: unexpected file ${path}`);
  }
  for (const path of expected) {
    if (!entries.has(path))
      throw new Error(`Release blocked: missing file ${path}`);
  }
}

export function walk(directory: string, prefix = "dist"): string[] {
  if (!lstatSync(directory).isDirectory())
    throw new Error(`Release blocked: invalid directory ${prefix}`);
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    const relative = `${prefix}/${name}`;
    const stat = lstatSync(path);
    if (stat.isSymbolicLink())
      throw new Error(`Release blocked: symlink ${relative}`);
    if (stat.isDirectory()) {
      if (
        !["dist/components", "dist/hooks", "dist/themes"].includes(relative)
      ) {
        throw new Error(`Release blocked: unexpected directory ${relative}`);
      }
      return walk(path, relative);
    }
    if (!stat.isFile())
      throw new Error(`Release blocked: non-regular file ${relative}`);
    return [relative];
  });
}

export function expectedFiles(): Set<string> {
  const files = ["package.json", "README.md", "LICENSE", "dist/styles.css"];
  for (const [directory, extension] of [
    ["components", ".tsx"],
    ["hooks", ".ts"],
  ]) {
    const names = readdirSync(join(root, "src", directory)).filter((name) =>
      name.endsWith(extension),
    );
    if (!names.length) throw new Error(`Empty ${directory} inventory`);
    for (const name of names) {
      const stem = name.slice(0, -extension.length);
      if (!/^[a-z][a-z0-9-]*$/.test(stem))
        throw new Error(`Invalid entrypoint ${name}`);
      files.push(
        `dist/${directory}/${stem}.js`,
        `dist/${directory}/${stem}.d.ts`,
      );
    }
  }
  for (const name of Object.keys(PALETTES)) {
    files.push(`dist/themes/${name}.css`, `dist/themes/${name}.scoped.css`);
  }
  return new Set(files);
}

export function checkPackage(): void {
  const expected = expectedFiles();
  checkFileSet(
    walk(join(root, "dist")),
    new Set([...expected].filter((path) => path.startsWith("dist/"))),
  );
  // Internal inventory only: suppress hooks to avoid recursively invoking prepack.
  // Never bypass scripts for the actual tarball or publication.
  const inventory = JSON.parse(
    execFileSync("npm", ["pack", "--dry-run", "--ignore-scripts", "--json"], {
      cwd: root,
      encoding: "utf8",
    }),
  );
  if (
    !Array.isArray(inventory) ||
    inventory.length !== 1 ||
    !Array.isArray(inventory[0]?.files)
  ) {
    throw new Error("Invalid npm pack inventory");
  }
  const files: string[] = inventory[0].files.map(
    (file: { path: string }) => file.path,
  );
  checkFileSet(files, expected);
  for (const path of files) {
    const absolute = join(root, path);
    if (!lstatSync(absolute).isFile())
      throw new Error(`Release blocked: non-regular file ${path}`);
    checkContent(path, readFileSync(absolute, "utf8"));
  }
  console.log(
    `Release safety passed: ${files.length} exact allowed files; no source maps, private paths, or recognized credentials.`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) checkPackage();
