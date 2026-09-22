# kinetic-click

```tsx
import { KineticClick } from "xiod-ui/kinetic-click";
```

## KineticClick

| Prop | Type | Default |
| :--- | :--- | :--- |
| children | `ReactNode` | — |
| color | `string \| undefined` | — |
| colorFrom | `"text" \| "auto" \| "background" \| "border" \| undefined` | — |
| count | `number \| undefined` | — |
| duration | `number \| undefined` | — |
| size | `number \| undefined` | — |
| trigger | `KineticClickTrigger \| undefined` | — |
| variant | `KineticClickVariant \| undefined` | — |

- `color` — The particle/effect color. Accepts standard hex, rgb, or "currentColor" to automatically inherit computed style colors of the clicked target.
- `colorFrom` — The style property to inherit color from when color is "currentColor". - "text": Inherits from computed text color. - "background": Inherits from computed background color. - "border": Inherits from computed border color. - "auto": Intelligently fallback from text -> background -> border (useful if text is neutral like white/black).
- `count` — Number of particles/ripples/structures to spawn.
- `duration` — Overall animation duration in milliseconds.
- `size` — Custom scale/size metric for particles/ripples.
- `trigger` — Trigger event type.
- `variant` — The animation variant to trigger on click.

Required props are bold. Full docs: https://ui.xiod.dev/docs
