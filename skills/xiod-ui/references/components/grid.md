# Grid

```tsx
import { Grid, GridItem } from "xiod-ui/grid";
```

## Grid

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| align | `"center" \| "start" \| "end" \| "stretch" \| "baseline" \| null \| undefined` | — |
| columns | `1 \| "none" \| 2 \| 3 \| 4 \| 5 \| 6 \| "subgrid" \| 7 \| 8 \| 9 \| 10 \| 11 \| 12 \| null \| undefined` | — |
| flow | `"col" \| "row" \| "dense" \| "row-dense" \| "col-dense" \| null \| undefined` | — |
| gap | `"base" \| "none" \| "sm" \| "lg" \| "md" \| "xl" \| null \| undefined` | `"base"` |
| justify | `"center" \| "start" \| "end" \| "stretch" \| "between" \| null \| undefined` | — |
| rows | `1 \| "none" \| 2 \| 3 \| 4 \| 5 \| 6 \| "subgrid" \| 7 \| 8 \| 9 \| 10 \| 11 \| 12 \| null \| undefined` | — |

## GridItem

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| colEnd | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8 \| 9 \| 10 \| 11 \| 12 \| 13 \| null \| undefined` |
| colSpan | `1 \| "auto" \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8 \| 9 \| 10 \| 11 \| 12 \| "full" \| null \| undefined` |
| colStart | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8 \| 9 \| 10 \| 11 \| 12 \| 13 \| null \| undefined` |
| rowEnd | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8 \| 9 \| 10 \| 11 \| 12 \| 13 \| null \| undefined` |
| rowSpan | `1 \| "auto" \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8 \| 9 \| 10 \| 11 \| 12 \| "full" \| null \| undefined` |
| rowStart | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8 \| 9 \| 10 \| 11 \| 12 \| 13 \| null \| undefined` |

Required props are bold. Full docs: https://ui.xiod.dev/docs
