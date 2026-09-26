# Fieldset

```tsx
import { Fieldset, FieldsetLegend } from "xiod-ui/fieldset";
```

## Fieldset

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: FieldsetRootState) => string \| undefined) \| undefined` |
| style | `CSSProperties \| ((state: FieldsetRootState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## FieldsetLegend

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: FieldsetLegendState) => string \| undefined) \| undefined` |
| style | `CSSProperties \| ((state: FieldsetLegendState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

Required props are bold. Full docs: https://ui.xiod.dev/docs
