import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const componentsDir = join(import.meta.dirname, "../../src/components");
const sources = readdirSync(componentsDir)
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => ({
    file,
    source: readFileSync(join(componentsDir, file), "utf8"),
  }));

describe("Radix leftovers", () => {
  // Base UI sets data-open, data-checked, data-popup-open and friends; Radix's
  // data-state values never appear on its parts, so these selectors are dead.
  it("styles Base UI parts with Base UI state attributes", () => {
    const offenders = sources.filter(({ source }) =>
      /data-\[state=(open|closed|checked|unchecked|active|inactive|on|off)\]/.test(
        source,
      ),
    );
    expect(offenders.map(({ file }) => file)).toEqual([]);
  });

  // Tokens hold complete colours, so hsl(var(--token)) is invalid CSS.
  it("never wraps a colour token in hsl()", () => {
    const offenders = sources.filter(({ source }) =>
      /hsl\(var\(--/.test(source),
    );
    expect(offenders.map(({ file }) => file)).toEqual([]);
  });
});
