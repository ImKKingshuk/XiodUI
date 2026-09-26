# ButtonGroup

```tsx
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "xiod-ui/button-group";
```

## ButtonGroup

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| orientation | `"horizontal" \| "vertical" \| null \| undefined` | `"horizontal"` |

## ButtonGroupSeparator

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: SeparatorState) => string \| undefined) \| undefined` | — |
| orientation | `Orientation \| undefined` | `"vertical"` |
| style | `CSSProperties \| ((state: SeparatorState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `orientation` — The orientation of the separator.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## ButtonGroupText

Renders a `<div>` and takes its props. Pass `render` to render a different element.

Required props are bold. Full docs: https://ui.xiod.dev/docs
