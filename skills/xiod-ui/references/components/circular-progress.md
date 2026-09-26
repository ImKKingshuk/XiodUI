# CircularProgress

```tsx
import { CircularProgress } from "xiod-ui/circular-progress";
```

## CircularProgress

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| max | `number \| undefined` | `100` |
| size | `number \| "sm" \| "default" \| "lg" \| "xl" \| "2xl" \| undefined` | `"default"` |
| strokeWidth | `number \| undefined` | — |
| value | `number \| null \| undefined` | — |
| variant | `"default" \| "expressive" \| undefined` | `"default"` |

- `max` — The maximum progress value. Defaults to 100.
- `size` — The size of the circular progress indicator. Can be a string identifier ("sm" to "2xl") or explicit pixel dimensions.
- `strokeWidth` — The stroke width of the SVG circle.
- `value` — The progress value (0 to max). If undefined, the indicator will be indeterminate.
- `variant` — Defines standard rendering or wavy geometries wrapping the progress stroke.

Required props are bold. Full docs: https://ui.xiod.dev/docs
