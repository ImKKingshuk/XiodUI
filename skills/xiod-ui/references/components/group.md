# group

```tsx
import { Group, GroupSeparator, GroupText } from "xiod-ui/group";
```

## Group

| Prop | Type | Default |
| :--- | :--- | :--- |
| orientation | `"horizontal" \| "vertical" \| null \| undefined` | `"horizontal"` |

## GroupSeparator

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| (string & ((state: SeparatorState) => string \| undefined)) \| undefined` | — |
| orientation | `Orientation \| undefined` | `"vertical"` |
| style | `CSSProperties \| ((state: SeparatorState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `orientation` — The orientation of the separator.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## GroupText

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

Required props are bold. Full docs: https://ui.xiod.dev/docs
