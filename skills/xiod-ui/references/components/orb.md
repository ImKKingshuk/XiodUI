# Orb

```tsx
import { Orb, OrbBadge, OrbLabel } from "xiod-ui/orb";
```

## Orb

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| aria-label | `string \| undefined` | — |
| color | `string \| undefined` | — |
| glow | `"none" \| "subtle" \| "intense" \| null \| undefined` | `"none"` |
| intent | `"default" \| "primary" \| "secondary" \| "success" \| "warning" \| "destructive" \| "info" \| null \| undefined` | `"default"` |
| interactive | `boolean \| undefined` | `false` |
| paused | `boolean \| undefined` | `false` |
| pixelSize | `number \| undefined` | — |
| size | `"sm" \| "lg" \| "xs" \| "md" \| "xl" \| "2xl" \| null \| undefined` | `"lg"` |
| speed | `number \| undefined` | `1` |
| state | `OrbState \| undefined` | `"working"` |
| theme | `OrbTheme \| undefined` | `"auto"` |
| variant | `"default" \| "expressive" \| "classic" \| "sharp" \| "diamond" \| "ring" \| "cross" \| null \| undefined` | `"default"` |

- `aria-label` — Accessibility label
- `color` — Custom ink color override (CSS hex, rgb, or color)
- `interactive` — Interactive hover speed boost
- `paused` — Pause animation loop
- `pixelSize` — Explicit pixel size override
- `speed` — Speed multiplier
- `state` — AI status state / animation preset
- `theme` — Theme mode resolution

## OrbBadge

Takes the DOM props of the element it renders. Pass `render` to render a different element.

## OrbLabel

Takes the DOM props of the element it renders. Pass `render` to render a different element.

Required props are bold. Full docs: https://ui.xiod.dev/docs
