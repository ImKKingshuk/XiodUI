# ThemeProvider

```tsx
import { ThemeProvider, useTheme } from "xiod-ui/theme-provider";
```

## ThemeProvider

| Prop | Type | Default |
| :--- | :--- | :--- |
| attribute | `string \| undefined` | `"class"` |
| **children** | `ReactNode` | — |
| defaultPalette | `string \| undefined` | — |
| defaultTheme | `ThemeMode \| undefined` | `"system"` |
| enableSystemTheme | `boolean \| undefined` | `true` |
| nonce | `string \| undefined` | — |
| paletteAttribute | `string \| undefined` | `"data-palette"` |
| paletteStorageKey | `string \| undefined` | `"palette"` |
| storageKey | `string \| undefined` | `"theme"` |

- `attribute` — How the theme is written to `<html>`. `"class"` toggles the `light`/`dark` classes, which is what XiodUI's `dark` variant keys off. Any other value is set as an attribute (e.g. `"data-theme"`).
- `defaultPalette` — Palette to apply before anything is read from storage. Leave unset to ship a single palette the CSS way — `@import "xiod-ui/themes/<name>"` overrides the base tokens directly and needs no attribute on `<html>` at all. This prop is for apps that let their own users switch palettes at runtime, which requires the scoped stylesheets (`xiod-ui/themes/<name>/scoped`).
- `defaultTheme` — Mode to use before anything is read from storage.
- `enableSystemTheme` — Follow `prefers-color-scheme` when the mode is `"system"`.
- `nonce` — Nonce for the inline script that applies the stored theme before the page paints. Only needed when a Content Security Policy blocks inline scripts without one.
- `paletteAttribute` — Attribute used to write the palette. Must differ from `attribute`, or the two axes overwrite each other on the same element.
- `paletteStorageKey` — localStorage key used to remember the palette.
- `storageKey` — localStorage key used to remember the choice.

## useTheme

```tsx
useTheme()
```

Returns `{ theme: ThemeMode; resolvedTheme: ResolvedTheme; setTheme: (theme: ThemeMode) => void; palette: string | undefined; setPalette: (palette: string | undefined) => void }`.

Required props are bold. Full docs: https://ui.xiod.dev/docs
