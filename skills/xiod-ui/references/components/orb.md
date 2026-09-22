# orb

```tsx
import { Orb, OrbBadge, OrbLabel } from "xiod-ui/orb";
```

## Orb

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

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

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## OrbLabel

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

Required props are bold. Full docs: https://ui.xiod.dev/docs
