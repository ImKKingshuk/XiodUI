# input

```tsx
import { Input } from "xiod-ui/input";
```

## Input

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| undefined` | — |
| defaultValue | `string \| number \| readonly string[] \| undefined` | — |
| nativeInput | `boolean \| undefined` | `false` |
| onValueChange | `((value: string, eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element \| undefined; }) => void) \| undefined` | — |
| size | `number \| "sm" \| "default" \| "lg" \| undefined` | `"default"` |
| style | `CSSProperties \| undefined` | — |
| unstyled | `boolean \| undefined` | `false` |
| value | `string \| number \| readonly string[] \| undefined` | — |

- `defaultValue` — The default value of the input. Use when uncontrolled.
- `onValueChange` — Callback fired when the `value` changes. Use when controlled.
- `value` — The value of the input. Use when controlled.

Required props are bold. Full docs: https://ui.xiod.dev/docs
