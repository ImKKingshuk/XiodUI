# Checkbox

```tsx
import { Checkbox, CheckboxGroup, CheckboxGroupItem } from "xiod-ui/checkbox";
```

## Checkbox

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| checked | `boolean \| undefined` | — |
| className | `string \| ((state: CheckboxRootState) => string \| undefined) \| undefined` | — |
| defaultChecked | `boolean \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| form | `string \| undefined` | — |
| id | `string \| undefined` | — |
| indeterminate | `boolean \| undefined` | — |
| inputRef | `Ref<HTMLInputElement> \| undefined` | — |
| name | `string \| undefined` | — |
| nativeButton | `boolean \| undefined` | — |
| onCheckedChange | `((checked: boolean, eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element \| undefined; }) => void) \| undefined` | — |
| parent | `boolean \| undefined` | — |
| readOnly | `boolean \| undefined` | — |
| required | `boolean \| undefined` | — |
| style | `CSSProperties \| ((state: CheckboxRootState) => CSSProperties \| undefined) \| undefined` | — |
| uncheckedValue | `string \| undefined` | — |
| value | `string \| undefined` | — |
| variant | `"default" \| "expressive" \| "sharp" \| "diamond" \| null \| undefined` | `"default"` |

- `checked` — Whether the checkbox is currently ticked.
  To render an uncontrolled checkbox, use the `defaultChecked` prop instead.
- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `defaultChecked` — Whether the checkbox is initially ticked.
  To render a controlled checkbox, use the `checked` prop instead.
- `disabled` — Whether the component should ignore user interaction.
- `form` — Identifies the form that owns the hidden input. Useful when the checkbox is rendered outside the form.
- `id` — The id of the input element.
- `indeterminate` — Whether the checkbox is in a mixed state: neither ticked, nor unticked.
- `inputRef` — A ref to access the hidden `<input>` element.
- `name` — Identifies the field when a form is submitted.
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `true` if the rendered element is a native button.
- `onCheckedChange` — Event handler called when the checkbox is ticked or unticked.
- `parent` — Whether the checkbox controls a group of child checkboxes.
  Must be used in a [Checkbox Group](https://base-ui.com/react/components/checkbox-group).
- `readOnly` — Whether the user should be unable to tick or untick the checkbox.
- `required` — Whether the user must tick the checkbox before submitting a form.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `uncheckedValue` — The value submitted with the form when the checkbox is unchecked. By default, unchecked checkboxes do not submit any value, matching native checkbox behavior.
- `value` — The checkbox's value. Identifies it within a [Checkbox Group](https://base-ui.com/react/components/checkbox-group), falling back to `name` when omitted. When submitting a form, a checked box submits `value`; with no `value`, it submits the native "on".

## CheckboxGroup

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| allValues | `string[] \| undefined` |
| className | `string \| ((state: CheckboxGroupState) => string \| undefined) \| undefined` |
| defaultValue | `string[] \| undefined` |
| disabled | `boolean \| undefined` |
| onValueChange | `((value: string[], eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element \| undefined; }) => void) \| undefined` |
| style | `CSSProperties \| ((state: CheckboxGroupState) => CSSProperties \| undefined) \| undefined` |
| value | `string[] \| undefined` |

- `allValues` — Names of all checkboxes in the group. Use this when creating a parent checkbox.
- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `defaultValue` — Names of the checkboxes in the group that should be initially ticked.
  To render a controlled checkbox group, use the `value` prop instead.
- `disabled` — Whether the component should ignore user interaction.
- `onValueChange` — Event handler called when a checkbox in the group is ticked or unticked. Provides the new value as an argument.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `value` — Names of the checkboxes in the group that should be ticked.
  To render an uncontrolled checkbox group, use the `defaultValue` prop instead.

## CheckboxGroupItem

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| checked | `boolean \| undefined` | — |
| className | `string \| ((state: CheckboxRootState) => string \| undefined) \| undefined` | — |
| defaultChecked | `boolean \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| form | `string \| undefined` | — |
| id | `string \| undefined` | — |
| indeterminate | `boolean \| undefined` | — |
| inputRef | `Ref<HTMLInputElement> \| undefined` | — |
| name | `string \| undefined` | — |
| nativeButton | `boolean \| undefined` | — |
| onCheckedChange | `((checked: boolean, eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element \| undefined; }) => void) \| undefined` | — |
| parent | `boolean \| undefined` | — |
| readOnly | `boolean \| undefined` | — |
| required | `boolean \| undefined` | — |
| style | `CSSProperties \| ((state: CheckboxRootState) => CSSProperties \| undefined) \| undefined` | — |
| uncheckedValue | `string \| undefined` | — |
| value | `string \| undefined` | — |
| variant | `"default" \| "expressive" \| "sharp" \| "diamond" \| null \| undefined` | `"default"` |

- `checked` — Whether the checkbox is currently ticked.
  To render an uncontrolled checkbox, use the `defaultChecked` prop instead.
- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `defaultChecked` — Whether the checkbox is initially ticked.
  To render a controlled checkbox, use the `checked` prop instead.
- `disabled` — Whether the component should ignore user interaction.
- `form` — Identifies the form that owns the hidden input. Useful when the checkbox is rendered outside the form.
- `id` — The id of the input element.
- `indeterminate` — Whether the checkbox is in a mixed state: neither ticked, nor unticked.
- `inputRef` — A ref to access the hidden `<input>` element.
- `name` — Identifies the field when a form is submitted.
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `true` if the rendered element is a native button.
- `onCheckedChange` — Event handler called when the checkbox is ticked or unticked.
- `parent` — Whether the checkbox controls a group of child checkboxes.
  Must be used in a [Checkbox Group](https://base-ui.com/react/components/checkbox-group).
- `readOnly` — Whether the user should be unable to tick or untick the checkbox.
- `required` — Whether the user must tick the checkbox before submitting a form.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `uncheckedValue` — The value submitted with the form when the checkbox is unchecked. By default, unchecked checkboxes do not submit any value, matching native checkbox behavior.
- `value` — The checkbox's value. Identifies it within a [Checkbox Group](https://base-ui.com/react/components/checkbox-group), falling back to `name` when omitted. When submitting a form, a checked box submits `value`; with no `value`, it submits the native "on".

Required props are bold. Full docs: https://ui.xiod.dev/docs
