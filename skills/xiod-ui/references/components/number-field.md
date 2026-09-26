# number-field

```tsx
import { NumberField, NumberFieldDecrement, NumberFieldGroup, NumberFieldIncrement, NumberFieldInput, NumberFieldScrubArea } from "xiod-ui/number-field";
```

## NumberField

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| allowOutOfRange | `boolean \| undefined` | — |
| allowWheelScrub | `boolean \| undefined` | — |
| className | `string \| ((state: NumberFieldRootState) => string \| undefined) \| undefined` | — |
| defaultValue | `number \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| form | `string \| undefined` | — |
| format | `NumberFormatOptions \| undefined` | — |
| id | `string \| undefined` | — |
| inputRef | `Ref<HTMLInputElement> \| undefined` | — |
| largeStep | `number \| undefined` | — |
| locale | `LocalesArgument` | — |
| max | `number \| undefined` | — |
| min | `number \| undefined` | — |
| name | `string \| undefined` | — |
| onValueChange | `((value: number \| null, eventDetails: NumberFieldRootChangeEventDetails) => void) \| undefined` | — |
| onValueCommitted | `((value: number \| null, eventDetails: NumberFieldRootCommitEventDetails) => void) \| undefined` | — |
| readOnly | `boolean \| undefined` | — |
| required | `boolean \| undefined` | — |
| size | `"sm" \| "default" \| "lg" \| undefined` | `"default"` |
| smallStep | `number \| undefined` | — |
| snapOnStep | `boolean \| undefined` | — |
| step | `number \| "any" \| undefined` | — |
| style | `CSSProperties \| ((state: NumberFieldRootState) => CSSProperties \| undefined) \| undefined` | — |
| value | `number \| null \| undefined` | — |

- `allowOutOfRange` — When true, direct text entry may be outside the `min`/`max` range without clamping, so native range underflow/overflow validation can occur. Step-based interactions (keyboard arrows, buttons, wheel, scrub) still clamp.
- `allowWheelScrub` — Whether to allow the user to scrub the input value with the mouse wheel while focused and hovering over the input.
- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `defaultValue` — The uncontrolled value of the field when it's initially rendered. To render a controlled number field, use the `value` prop instead.
- `disabled` — Whether the component should ignore user interaction.
- `form` — Identifies the form that owns the hidden input. Useful when the number field is rendered outside the form.
- `format` — Options to format the input value.
- `id` — The id of the input element.
- `inputRef` — A ref to access the hidden input element.
- `largeStep` — The large step value of the input element when incrementing while the shift key is held. Snaps to multiples of this value when `snapOnStep` is enabled.
- `locale` — The locale of the input element. Defaults to the user's runtime locale.
- `max` — The maximum value of the input element.
- `min` — The minimum value of the input element.
- `name` — Identifies the field when a form is submitted.
- `onValueChange` — Callback fired when the number value changes. The `eventDetails.reason` indicates what triggered the change: - `'input-change'` for parseable typing or programmatic text updates - `'input-clear'` when the field becomes empty - `'input-blur'` when formatting (and clamping, if enabled) occurs on blur - `'input-paste'` for paste interactions - `'keyboard'` for arrow-key/Home/End stepping (typing digits uses `'input-change'`/`'input-clear'`) - `'increment-press'` / `'decrement-press'` for button presses on the increment and decrement controls - `'wheel'` for wheel-based scrubbing - `'scrub'` for scrub area drags
- `onValueCommitted` — Callback function that is fired when the value is committed. It runs later than `onValueChange`, when: - The input is blurred after typing a value. - The pointer is released after scrubbing or pressing the increment/decrement buttons. It runs simultaneously with `onValueChange` when interacting with the keyboard or the mouse wheel. **Warning**: This is a generic event not a change event.
- `readOnly` — Whether the user should be unable to change the field value.
- `required` — Whether the user must enter a value before submitting a form.
- `smallStep` — The small step value of the input element when incrementing while the alt key is held. Snaps to multiples of this value when `snapOnStep` is enabled.
- `snapOnStep` — Whether the value should snap to the nearest step when incrementing or decrementing.
- `step` — Amount to increment and decrement with the buttons and arrow keys, or to scrub with pointer movement in the scrub area. To always enable step validation on form submission, specify the `min` prop explicitly in conjunction with this prop. Specify `step="any"` to always disable step validation; interactive stepping then uses a base amount of `1`, while the alt and shift keys still step by `smallStep` and `largeStep`.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `value` — The raw numeric value of the field.

## NumberFieldDecrement

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: NumberFieldDecrementState) => string \| undefined) \| undefined` | — |
| icon | `ReactNode` | — |
| nativeButton | `boolean \| undefined` | — |
| style | `CSSProperties \| ((state: NumberFieldDecrementState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `icon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `false` if the rendered element is not a button (for example, `<div>`).
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## NumberFieldGroup

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: NumberFieldGroupState) => string \| undefined) \| undefined` | — |
| style | `CSSProperties \| ((state: NumberFieldGroupState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## NumberFieldIncrement

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: NumberFieldIncrementState) => string \| undefined) \| undefined` | — |
| icon | `ReactNode` | — |
| nativeButton | `boolean \| undefined` | — |
| style | `CSSProperties \| ((state: NumberFieldIncrementState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `icon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `false` if the rendered element is not a button (for example, `<div>`).
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## NumberFieldInput

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| aria-roledescription | `string \| undefined` | — |
| className | `string \| ((state: NumberFieldInputState) => string \| undefined) \| undefined` | — |
| style | `CSSProperties \| ((state: NumberFieldInputState) => CSSProperties \| undefined) \| undefined` | — |

- `aria-roledescription` — A user-friendly description of the input's role for assistive tech. This is a role description, not an accessible name — use `Field.Label` or `aria-label` to name the control.
- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## NumberFieldScrubArea

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: NumberFieldScrubAreaState) => string \| undefined) \| undefined` | — |
| direction | `"horizontal" \| "vertical" \| undefined` | — |
| **label** | `string` | — |
| pixelSensitivity | `number \| undefined` | — |
| style | `CSSProperties \| ((state: NumberFieldScrubAreaState) => CSSProperties \| undefined) \| undefined` | — |
| teleportDistance | `number \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `direction` — Cursor movement direction in the scrub area.
- `pixelSensitivity` — Determines how many pixels the cursor must move before the value changes. A higher value will make scrubbing less sensitive.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `teleportDistance` — If specified, determines the distance that the cursor may move from the center of the scrub area before it will loop back around.

Required props are bold. Full docs: https://ui.xiod.dev/docs
