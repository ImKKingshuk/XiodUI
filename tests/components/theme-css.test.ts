import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

// The pre-hydration marker ThemeProvider puts in <body> only works if every
// stylesheet that reads `.dark` or `data-palette` also reads the marker.
const SRC = join(import.meta.dirname, "..", "..", "src");
const THEMES = join(SRC, "themes");
const DARK_MARKER = ":has(> body > .xiod-dark)";

describe("stylesheets read ThemeProvider's pre-hydration marker", () => {
  const styles = readFileSync(join(SRC, "styles.css"), "utf8");

  it("in the dark variant, for <html>, <body> and everything in them", () => {
    expect(styles).toContain(
      "@custom-variant dark (&:is(.dark, .dark *, :where(:root:has(> body > .xiod-dark), body:has(> .xiod-dark), body:has(> .xiod-dark) *)));",
    );
  });

  it("in the base dark tokens", () => {
    expect(styles).toContain(`.dark,\n:root:where(${DARK_MARKER}) {`);
  });

  for (const file of readdirSync(THEMES).filter((name) =>
    name.endsWith(".css"),
  )) {
    const name = file.replace(/(\.scoped)?\.css$/, "");
    const css = readFileSync(join(THEMES, file), "utf8");

    it(`in ${file}`, () => {
      if (file.endsWith(".scoped.css")) {
        expect(css).toContain(
          `[data-palette="${name}"],\n:root:where(:has(> body > .xiod-palette-${name})) {`,
        );
        expect(css).toContain(
          `.dark[data-palette="${name}"],\n:root:root:where(:has(> body > .xiod-dark.xiod-palette-${name})) {`,
        );
      } else {
        expect(css).toContain(`.dark,\n:root:where(${DARK_MARKER}) {`);
      }
    });
  }
});
