/**
 * Contrast and distinctness gate for the palettes in `scripts/palettes.ts`.
 *
 * Exits non-zero on any failure, so `bun run check` refuses to build a palette
 * that would ship an unreadable pairing. Run directly with `bun run themes:verify`.
 *
 * Four families of check:
 *
 *   text pairs      every `*-foreground` against the surface it sits on, at
 *                   the 4.5:1 AA threshold for body text.
 *   state tints     `destructive`/`info`/`success`/`warning` foregrounds
 *                   against their own colour mixed over the background at the
 *                   opacity components actually use — 8% light, 16% dark.
 *   destructive     white against the solid `destructive` fill (4.5:1, since
 *   fill            button.tsx and badge.tsx hardcode `text-white` on it) and
 *                   that fill against the background (3:1, WCAG 1.4.11 for
 *                   non-text UI). Only `destructive` is ever a solid fill;
 *                   the other three appear exclusively as tints.
 *   distinctness     every pair of palettes, in the same mode, must differ in
 *                    `primary` by at least `MIN_PRIMARY_DISTANCE` in OKLab.
 *                    Contrast alone says nothing about whether two palettes
 *                    look like each other, and five near-duplicate pairs got
 *                    in that way before this check existed.
 */

import { type Palette, PALETTES } from "./palettes.ts";

const AA_TEXT = 4.5;
const AA_NON_TEXT = 3;

/**
 * Floor for how far apart two palettes' `primary` colours must sit in OKLab,
 * where Euclidean distance is roughly perceptual: ~0.02 is barely perceptible,
 * ~0.05 reads as two shades of one colour, 0.10+ as two different colours.
 *
 * 0.055 is deliberately just above the "same family" band. Palettes may share
 * a hue — the point is that no two should be mistakable for each other at a
 * glance, which is exactly the failure a contrast check cannot see.
 */
const MIN_PRIMARY_DISTANCE = 0.055;

/** `[foreground, background]` pairs, as the components compose them. */
const TEXT_PAIRS: ReadonlyArray<readonly [string, string]> = [
  ["foreground", "background"],
  ["card-foreground", "card"],
  ["popover-foreground", "popover"],
  ["primary-foreground", "primary"],
  ["secondary-foreground", "secondary"],
  ["muted-foreground", "background"],
  ["muted-foreground", "muted"],
  ["accent-foreground", "accent"],
  ["sidebar-foreground", "sidebar"],
  ["sidebar-primary-foreground", "sidebar-primary"],
  ["sidebar-accent-foreground", "sidebar-accent"],
];

const STATES = ["destructive", "info", "success", "warning"] as const;

function channels(hex: string): [number, number, number] {
  return [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16)) as [
    number,
    number,
    number,
  ];
}

function luminance(hex: string): number {
  const [r, g, b] = channels(hex)
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)];

  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/** Flattens `color` at `alpha` over `over`, as a browser composites a tint. */
function flatten(color: string, over: string, alpha: number): string {
  const [fr, fg, fb] = channels(color);
  const [br, bg, bb] = channels(over);

  return `#${[
    [fr, br],
    [fg, bg],
    [fb, bb],
  ]
    .map(([f, b]) =>
      Math.round(f * alpha + b * (1 - alpha))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

/**
 * OKLab coordinates for a hex colour.
 *
 * Not the WCAG luminance transfer above — that one answers "can this be read",
 * this one answers "do these look like the same colour", and they disagree
 * often enough that both are needed.
 */
function oklab(hex: string): [number, number, number] {
  const [r, g, b] = channels(hex)
    .map((v) => v / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function perceptualDistance(a: string, b: string): number {
  const [x, y, z] = oklab(a);
  const [p, q, r] = oklab(b);

  return Math.hypot(x - p, y - q, z - r);
}

function check(palette: Palette, mode: "light" | "dark"): string[] {
  const tokens = palette[mode];
  const failures: string[] = [];
  const assert = (ratio: number, threshold: number, label: string): void => {
    if (ratio < threshold) {
      failures.push(`${label} — ${ratio.toFixed(2)}:1, needs ${threshold}:1`);
    }
  };

  for (const [fg, bg] of TEXT_PAIRS) {
    assert(contrast(tokens[fg], tokens[bg]), AA_TEXT, `${fg} on ${bg}`);
  }

  const tintAlpha = mode === "light" ? 0.08 : 0.16;

  for (const state of STATES) {
    const tint = flatten(tokens[state], tokens.background, tintAlpha);
    assert(
      contrast(tokens[`${state}-foreground`], tint),
      AA_TEXT,
      `${state}-foreground on ${state}/${tintAlpha * 100}% tint`,
    );
  }

  assert(
    contrast("#ffffff", tokens.destructive),
    AA_TEXT,
    "hardcoded white text on the solid destructive fill",
  );
  assert(
    contrast(tokens.destructive, tokens.background),
    AA_NON_TEXT,
    "solid destructive fill against the background",
  );

  return failures;
}

let failed = 0;

for (const [name, palette] of Object.entries(PALETTES)) {
  for (const mode of ["light", "dark"] as const) {
    const failures = check(palette, mode);

    if (failures.length > 0) {
      failed += failures.length;
      console.error(`✖ ${name} ${mode}`);
      for (const failure of failures) console.error(`    ${failure}`);
    }
  }
}

const names = Object.keys(PALETTES);

for (const mode of ["light", "dark"] as const) {
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      const distance = perceptualDistance(
        PALETTES[names[i]][mode].primary,
        PALETTES[names[j]][mode].primary,
      );

      if (distance < MIN_PRIMARY_DISTANCE) {
        failed += 1;
        console.error(
          `✖ ${names[i]} and ${names[j]} are too alike in ${mode} — primaries ${distance.toFixed(3)} apart in OKLab, needs ${MIN_PRIMARY_DISTANCE}`,
        );
      }
    }
  }
}

if (failed > 0) {
  console.error(`\n✖ ${failed} failure(s)`);
  process.exit(1);
}

const count = names.length;
console.log(`✔ ${count} palettes pass contrast and distinctness checks`);
