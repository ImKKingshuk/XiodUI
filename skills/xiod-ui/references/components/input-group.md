# InputGroup

```tsx
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText, InputGroupTextarea } from "xiod-ui/input-group";
```

## InputGroup

Renders a `<div>` and takes its props. Pass `render` to render a different element.

## InputGroupAddon

Renders a `<div>` and takes its props. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| align | `"inline-start" \| "block-end" \| "block-start" \| "inline-end" \| null \| undefined` | `"inline-start"` |

## InputGroupInput

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| undefined` |
| defaultValue | `string \| number \| readonly string[] \| undefined` |
| nativeInput | `boolean \| undefined` |
| onValueChange | `((value: string, eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element \| undefined; }) => void) \| undefined` |
| size | `number \| "sm" \| "default" \| "lg" \| undefined` |
| style | `CSSProperties \| undefined` |
| unstyled | `boolean \| undefined` |
| value | `string \| number \| readonly string[] \| undefined` |

- `defaultValue` — The default value of the input. Use when uncontrolled.
- `onValueChange` — Callback fired when the `value` changes. Use when controlled.
- `value` — The value of the input. Use when controlled.

## InputGroupText

Renders a `<span>` and takes its props. Pass `render` to render a different element.

## InputGroupTextarea

| Prop | Type |
| :--- | :--- |
| size | `number \| "sm" \| "default" \| "lg" \| undefined` |
| unstyled | `boolean \| undefined` |

Required props are bold. Full docs: https://ui.xiod.dev/docs
