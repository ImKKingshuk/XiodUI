# button-group

```tsx
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "xiod-ui/button-group";
```

## ButtonGroup

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| orientation | `"horizontal" \| "vertical" \| null \| undefined` | `"horizontal"` |

## ButtonGroupSeparator

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: SeparatorState) => string \| undefined) \| undefined` | — |
| orientation | `Orientation \| undefined` | `"vertical"` |
| style | `CSSProperties \| ((state: SeparatorState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `orientation` — The orientation of the separator.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## ButtonGroupText

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

Required props are bold. Full docs: https://ui.xiod.dev/docs
