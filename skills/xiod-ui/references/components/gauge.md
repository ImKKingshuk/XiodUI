# Gauge

```tsx
import { Gauge } from "xiod-ui/gauge";
```

## Gauge

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| max | `number \| undefined` | `100` |
| showValue | `boolean \| undefined` | `true` |
| size | `number \| undefined` | `120` |
| strokeWidth | `number \| undefined` | `12` |
| value | `number \| undefined` | `0` |

- `max` — The maximum progress value. Defaults to 100.
- `showValue` — Whether to display the value text in the center. Defaults to true.
- `size` — The size of the gauge (diameter) in pixels. Defaults to 120.
- `strokeWidth` — The stroke width of the SVG circle. Defaults to 12.
- `value` — The progress value (0 to max).

Required props are bold. Full docs: https://ui.xiod.dev/docs
