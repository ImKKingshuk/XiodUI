import { defineConfig } from "tsdown";

export default defineConfig({
  // No root barrel: XiodUI is subpath-only (`xiod-ui/button`), so every entry is
  // a component or hook module and there is no `.` export to build.
  entry: ["src/components/*.tsx", "src/hooks/*.ts"],
  format: ["esm"],
  platform: "neutral",
  target: "es2022",
  dts: true,
  clean: true,
  sourcemap: false,
  // Bundleless output: every source file is compiled individually and the
  // directory structure is preserved. Keeps subpath imports (`xiod-ui/button`)
  // backed by real files and keeps `"use client"` on the module that needs it.
  unbundle: true,
  // Validate the published shape before it ever reaches npm.
  //   publint — package.json exports/main/module/types vs. actual output
  //   attw    — declaration files resolve correctly under node10/node16/bundler
  publint: {
    level: "error",
  },
  // Catch dependencies declared but never imported, and imports that aren't
  // declared — the latter would break at install time for consumers.
  unused: {
    level: "error",
    ignore: {
      // Never imported by name, but a genuine runtime peer: XiodUI only renders
      // in a DOM environment, and @base-ui/react requires react-dom itself.
      peerDependencies: ["react-dom"],
    },
  },
  attw: {
    profile: "esm-only",
    level: "error",
    // A stylesheet has no type declarations, so attw's type-resolution check
    // can't apply to it. Excluded by entrypoint rather than by disabling the
    // `no-resolution` rule, which must stay active for the JS entrypoints.
    excludeEntrypoints: [
      "./styles",
      "./styles.css",
      "./themes/*",
      "./themes/*/scoped",
    ],
    // The `./*` and `./hooks/*` exports are wildcards, so attw can't discover
    // them automatically. Check a representative sample so a broken subpath
    // mapping fails the build instead of shipping.
    includeEntrypoints: [
      "./button",
      "./dialog",
      "./input-payment",
      "./hooks/use-media-query",
    ],
  },
  // Nothing from node_modules is bundled. `dependencies` and `peerDependencies`
  // are external by default; `true` makes that total, so a stray devDependency
  // import can never be silently inlined into the published output.
  deps: {
    neverBundle: true,
  },
  // Ship the stylesheet alongside the JS. Uses tsdown's `copy` rather than a
  // build:done hook so the file is in place before publint/attw validate the
  // `./styles.css` export.
  // The palette stylesheets are generated into src/themes by `bun run themes`,
  // which `bun run build` runs first, so they exist for this copy step and for
  // publint's validation of the `./themes/*` exports.
  // `to` is the destination's parent, so this lands as dist/themes/*.css.
  copy: ["src/styles.css", { from: "src/themes", to: "dist" }],
});
