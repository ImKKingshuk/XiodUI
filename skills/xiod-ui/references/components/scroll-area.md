# scroll-area

```tsx
import { ScrollArea, ScrollBar } from "xiod-ui/scroll-area";
```

## ScrollArea

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: ScrollAreaRootState) => string \| undefined) \| undefined` | — |
| overflowEdgeThreshold | `number \| Partial<{ xStart: number; xEnd: number; yStart: number; yEnd: number; }> \| undefined` | — |
| scrollbarGutter | `boolean \| undefined` | `false` |
| scrollbarSize | `"sm" \| "lg" \| "md" \| null \| undefined` | `"sm"` |
| scrollbarVariant | `"default" \| "card" \| null \| undefined` | `"default"` |
| scrollbarVisibility | `"auto" \| "always" \| "hover" \| null \| undefined` | `"auto"` |
| scrollFade | `boolean \| undefined` | `false` |
| style | `CSSProperties \| ((state: ScrollAreaRootState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `overflowEdgeThreshold` — The threshold in pixels that must be passed before the overflow edge attributes are applied. Accepts a single number for all edges or an object to configure them individually.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## ScrollBar

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: ScrollAreaScrollbarState) => string \| undefined) \| undefined` | — |
| keepMounted | `boolean \| undefined` | — |
| orientation | `"horizontal" \| "vertical" \| undefined` | `"vertical"` |
| size | `"sm" \| "lg" \| "md" \| null \| undefined` | — |
| style | `CSSProperties \| ((state: ScrollAreaScrollbarState) => CSSProperties \| undefined) \| undefined` | — |
| variant | `"default" \| "card" \| null \| undefined` | — |
| visibility | `"auto" \| "always" \| "hover" \| null \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `keepMounted` — Whether to keep the HTML element in the DOM when the viewport isn't scrollable.
- `orientation` — Whether the scrollbar controls vertical or horizontal scroll.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

Required props are bold. Full docs: https://ui.xiod.dev/docs
