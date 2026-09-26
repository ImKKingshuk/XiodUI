# InputSensitive

```tsx
import { InputSensitive } from "xiod-ui/input-sensitive";
```

## InputSensitive

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| undefined` | — |
| copiedIcon | `ReactNode` | — |
| copyIcon | `ReactNode` | — |
| defaultValue | `string \| number \| readonly string[] \| undefined` | — |
| hideIcon | `ReactNode` | — |
| onValueChange | `((value: string, eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element \| undefined; }) => void) \| undefined` | — |
| revealIcon | `ReactNode` | — |
| size | `number \| "sm" \| "default" \| "lg" \| undefined` | `"default"` |
| style | `CSSProperties \| undefined` | — |
| value | `string \| number \| readonly string[] \| undefined` | — |

- `copiedIcon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `copyIcon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `defaultValue` — The default value of the input. Use when uncontrolled.
- `hideIcon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `onValueChange` — Callback fired when the `value` changes. Use when controlled.
- `revealIcon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `value` — The value of the input. Use when controlled.

Required props are bold. Full docs: https://ui.xiod.dev/docs
