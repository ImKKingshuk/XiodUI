# theme-provider

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
| paletteAttribute | `string \| undefined` | `"data-palette"` |
| paletteStorageKey | `string \| undefined` | `"palette"` |
| storageKey | `string \| undefined` | `"theme"` |

- `attribute` — How the theme is written to `<html>`. `"class"` toggles the `light`/`dark` classes, which is what XiodUI's `dark` variant keys off. Any other value is set as an attribute (e.g. `"data-theme"`).
- `defaultPalette` — Palette to apply before anything is read from storage. Leave unset to ship a single palette the CSS way — `@import "xiod-ui/themes/<name>"` overrides the base tokens directly and needs no attribute on `<html>` at all. This prop is for apps that let their own users switch palettes at runtime, which requires the scoped stylesheets (`xiod-ui/themes/<name>/scoped`).
- `defaultTheme` — Mode to use before anything is read from storage.
- `enableSystemTheme` — Follow `prefers-color-scheme` when the mode is `"system"`.
- `paletteAttribute` — Attribute used to write the palette. Must differ from `attribute`, or the two axes overwrite each other on the same element.
- `paletteStorageKey` — localStorage key used to remember the palette.
- `storageKey` — localStorage key used to remember the choice.

## useTheme

```tsx
useTheme()
```

Required props are bold. Full docs: https://ui.xiod.dev/docs
