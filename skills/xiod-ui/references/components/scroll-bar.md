# scroll-bar

```tsx
import { ScrollBar } from "xiod-ui/scroll-bar";
```

## ScrollBar

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: ScrollAreaScrollbarState) => string \| undefined) \| undefined` | — |
| keepMounted | `boolean \| undefined` | — |
| orientation | `"horizontal" \| "vertical" \| undefined` | `"vertical"` |
| size | `"sm" \| "lg" \| "md" \| null \| undefined` | `"sm"` |
| style | `CSSProperties \| ((state: ScrollAreaScrollbarState) => CSSProperties \| undefined) \| undefined` | — |
| variant | `"default" \| "card" \| null \| undefined` | `"default"` |
| visibility | `"auto" \| "always" \| "hover" \| null \| undefined` | `"auto"` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `keepMounted` — Whether to keep the HTML element in the DOM when the viewport isn't scrollable.
- `orientation` — Whether the scrollbar controls vertical or horizontal scroll.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

Required props are bold. Full docs: https://ui.xiod.dev/docs
