# Radio

```tsx
import { Radio, RadioItem } from "xiod-ui/radio";
```

## Radio

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: RadioGroupState) => string \| undefined) \| undefined` |
| defaultValue | `any` |
| disabled | `boolean \| undefined` |
| form | `string \| undefined` |
| inputRef | `Ref<HTMLInputElement> \| undefined` |
| name | `string \| undefined` |
| onValueChange | `((value: any, eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element \| undefined; }) => void) \| undefined` |
| readOnly | `boolean \| undefined` |
| required | `boolean \| undefined` |
| style | `CSSProperties \| ((state: RadioGroupState) => CSSProperties \| undefined) \| undefined` |
| value | `any` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `defaultValue` — The uncontrolled value of the radio button that should be initially selected.
  To render a controlled radio group, use the `value` prop instead.
- `disabled` — Whether the component should ignore user interaction.
- `form` — Identifies the form that owns the radio inputs. Useful when the radio group is rendered outside the form.
- `inputRef` — A ref to access the hidden input element.
- `name` — Identifies the field when a form is submitted.
- `onValueChange` — Callback fired when the value changes.
- `readOnly` — Whether the user should be unable to select a different radio button in the group.
- `required` — Whether the user must choose a value before submitting a form.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `value` — The controlled value of the radio item that should be currently selected.
  To render an uncontrolled radio group, use the `defaultValue` prop instead.

## RadioItem

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: RadioRootState) => string \| undefined) \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| inputRef | `Ref<HTMLInputElement> \| undefined` | — |
| nativeButton | `boolean \| undefined` | — |
| readOnly | `boolean \| undefined` | — |
| required | `boolean \| undefined` | — |
| style | `CSSProperties \| ((state: RadioRootState) => CSSProperties \| undefined) \| undefined` | — |
| **value** | `any` | — |
| variant | `"default" \| "expressive" \| "sharp" \| "diamond" \| null \| undefined` | `"default"` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `disabled` — Whether the component should ignore user interaction.
- `inputRef` — A ref to access the hidden input element.
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `true` if the rendered element is a native button.
- `readOnly` — Whether the user should be unable to select the radio button.
- `required` — Whether the user must choose a value before submitting a form.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `value` — The unique identifying value of the radio in a group.

Required props are bold. Full docs: https://ui.xiod.dev/docs
