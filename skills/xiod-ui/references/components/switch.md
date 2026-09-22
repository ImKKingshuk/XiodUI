# switch

```tsx
import { Switch } from "xiod-ui/switch";
```

## Switch

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| checked | `boolean \| undefined` | — |
| className | `string \| ((state: SwitchRootState) => string \| undefined) \| undefined` | — |
| defaultChecked | `boolean \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| form | `string \| undefined` | — |
| id | `string \| undefined` | — |
| inputRef | `Ref<HTMLInputElement> \| undefined` | — |
| name | `string \| undefined` | — |
| nativeButton | `boolean \| undefined` | — |
| onCheckedChange | `((checked: boolean, eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element \| undefined; }) => void) \| undefined` | — |
| readOnly | `boolean \| undefined` | — |
| required | `boolean \| undefined` | — |
| size | `"sm" \| "lg" \| "md" \| "xl" \| "2xl" \| null \| undefined` | `"md"` |
| style | `CSSProperties \| ((state: SwitchRootState) => CSSProperties \| undefined) \| undefined` | — |
| uncheckedValue | `string \| undefined` | — |
| value | `string \| undefined` | — |
| variant | `"default" \| "expressive" \| "classic" \| "sharp" \| null \| undefined` | `"default"` |

- `checked` — Whether the switch is currently active. To render an uncontrolled switch, use the `defaultChecked` prop instead.
- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `defaultChecked` — Whether the switch is initially active. To render a controlled switch, use the `checked` prop instead.
- `disabled` — Whether the component should ignore user interaction.
- `form` — Identifies the form that owns the hidden input. Useful when the switch is rendered outside the form.
- `id` — The id of the hidden input element. When `nativeButton` is `true`, the id is applied to the root element.
- `inputRef` — A ref to access the hidden `<input>` element.
- `name` — Identifies the field when a form is submitted.
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `true` if the rendered element is a native button.
- `onCheckedChange` — Event handler called when the switch is activated or deactivated.
- `readOnly` — Whether the user should be unable to activate or deactivate the switch.
- `required` — Whether the user must activate the switch before submitting a form.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `uncheckedValue` — The value submitted with the form when the switch is off. By default, unchecked switches do not submit any value, matching native checkbox behavior.
- `value` — The value submitted with the form when the switch is on. By default, switch submits the "on" value, matching native checkbox behavior.

Required props are bold. Full docs: https://ui.xiod.dev/docs
