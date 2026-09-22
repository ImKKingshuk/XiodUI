# input-group

```tsx
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText, InputGroupTextarea } from "xiod-ui/input-group";
```

## InputGroup

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## InputGroupAddon

| Prop | Type | Default |
| :--- | :--- | :--- |
| align | `"inline-start" \| "block-end" \| "block-start" \| "inline-end" \| null \| undefined` | `"inline-start"` |

## InputGroupInput

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| undefined` | — |
| defaultValue | `string \| number \| readonly string[] \| undefined` | — |
| nativeInput | `boolean \| undefined` | — |
| onValueChange | `((value: string, eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element \| undefined; }) => void) \| undefined` | — |
| size | `number \| "sm" \| "default" \| "lg" \| undefined` | — |
| style | `CSSProperties \| undefined` | — |
| unstyled | `boolean \| undefined` | — |
| value | `string \| number \| readonly string[] \| undefined` | — |

- `defaultValue` — The default value of the input. Use when uncontrolled.
- `onValueChange` — Callback fired when the `value` changes. Use when controlled.
- `value` — The value of the input. Use when controlled.

## InputGroupText

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## InputGroupTextarea

| Prop | Type | Default |
| :--- | :--- | :--- |
| size | `number \| "sm" \| "default" \| "lg" \| undefined` | — |
| unstyled | `boolean \| undefined` | — |

Required props are bold. Full docs: https://ui.xiod.dev/docs
