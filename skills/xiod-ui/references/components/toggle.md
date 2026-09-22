# toggle

```tsx
import { Toggle } from "xiod-ui/toggle";
```

## Toggle

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: ToggleState) => string \| undefined) \| undefined` | — |
| defaultPressed | `boolean \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| nativeButton | `boolean \| undefined` | — |
| onPressedChange | `((pressed: boolean, eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element \| undefined; }) => void) \| undefined` | — |
| pressed | `boolean \| undefined` | — |
| size | `"sm" \| "default" \| "lg" \| null \| undefined` | `"default"` |
| style | `CSSProperties \| ((state: ToggleState) => CSSProperties \| undefined) \| undefined` | — |
| value | `string \| undefined` | — |
| variant | `"default" \| "outline" \| null \| undefined` | `"default"` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `defaultPressed` — Whether the toggle button is currently pressed. This is the uncontrolled counterpart of `pressed`.
- `disabled` — Whether the component should ignore user interaction.
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `false` if the rendered element is not a button (for example, `<div>`).
- `onPressedChange` — Callback fired when the pressed state is changed.
- `pressed` — Whether the toggle button is currently pressed. This is the controlled counterpart of `defaultPressed`.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `value` — A unique string that identifies the toggle when used inside a toggle group.

Required props are bold. Full docs: https://ui.xiod.dev/docs
