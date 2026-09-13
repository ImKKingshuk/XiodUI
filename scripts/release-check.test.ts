import {
  mkdtempSync,
  mkdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { expect, test } from "vitest";

import { checkContent, checkFileSet, walk } from "./release-check";

test("requires the exact complete inventory", () => {
  const expected = new Set(["dist/components/button.js", "LICENSE"]);
  expect(() => checkFileSet([...expected], expected)).not.toThrow();
  for (const extra of [
    "dist/components/button.js.map",
    "dist/source.tsx",
    "dist/.env",
    "../secret",
    "website/page.tsx",
    "dist/extra.js",
    "dist/themes/secret.css",
  ]) {
    expect(() => checkFileSet([...expected, extra], expected)).toThrow(
      "unexpected file",
    );
  }
  expect(() => checkFileSet(["LICENSE"], expected)).toThrow("missing file");
  expect(() => checkFileSet([...expected, "LICENSE"], expected)).toThrow(
    "duplicate",
  );
});

test("rejects disclosure patterns without printing their contents", () => {
  for (const content of [
    "//# sourceMappingURL=data:application/json;base64,e30=",
    '{"sourcesContent":["original source"]}',
    '{"sourceRoot":"secret"}',
    "//# sourceURL=original.ts",
    "/Users/developer/project",
    "/home/developer/project",
    "/private/var/tmp/project",
    "C:\\Users\\developer",
    "C:/Users/developer",
    "-----BEGIN PRIVATE KEY-----",
    "-----BEGIN OPENSSH PRIVATE KEY-----",
    "npm_" + "a".repeat(36),
    "github_pat_" + "a".repeat(40),
    "AKIA" + "A".repeat(16),
  ]) {
    expect(() => checkContent("dist/example.js", content)).toThrow(
      "Release blocked",
    );
  }
  expect(() =>
    checkContent(
      "dist/example.js",
      'import { Check } from "xiod-icons/icons/Check";',
    ),
  ).not.toThrow();
});

test("rejects symlinks and hidden directories", () => {
  const fixture = mkdtempSync(join(tmpdir(), "xiod-ui-release-test-"));
  try {
    mkdirSync(join(fixture, "components"));
    writeFileSync(join(fixture, "components/button.js"), "export {};");
    expect(walk(fixture)).toEqual(["dist/components/button.js"]);
    symlinkSync("button.js", join(fixture, "components/link.js"));
    expect(() => walk(fixture)).toThrow("symlink");
    rmSync(join(fixture, "components/link.js"));
    mkdirSync(join(fixture, ".private"));
    expect(() => walk(fixture)).toThrow("unexpected directory");
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});
