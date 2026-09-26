# InputOtp

```tsx
import { InputOtp, InputOtpGroup, InputOtpInput, InputOtpSeparator, OTPField, OTPFieldGroup, OTPFieldInput, OTPFieldSeparator } from "xiod-ui/input-otp";
```

## InputOtp

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| autoComplete | `string \| undefined` |
| autoSubmit | `boolean \| undefined` |
| className | `string \| undefined` |
| defaultValue | `string \| undefined` |
| disabled | `boolean \| undefined` |
| form | `string \| undefined` |
| id | `string \| undefined` |
| inputMode | `"search" \| "text" \| "none" \| "tel" \| "url" \| "email" \| "numeric" \| "decimal" \| undefined` |
| **length** | `number` |
| mask | `boolean \| undefined` |
| name | `string \| undefined` |
| normalizeValue | `((value: string) => string) \| undefined` |
| onValueChange | `((value: string, eventDetails: OTPFieldRootChangeEventDetails) => void) \| undefined` |
| onValueComplete | `((value: string, eventDetails: OTPFieldRootCompleteEventDetails) => void) \| undefined` |
| onValueInvalid | `((value: string, eventDetails: OTPFieldRootInvalidEventDetails) => void) \| undefined` |
| readOnly | `boolean \| undefined` |
| required | `boolean \| undefined` |
| style | `CSSProperties \| ((state: OTPFieldRootState) => CSSProperties \| undefined) \| undefined` |
| validationType | `OTPValidationType \| undefined` |
| value | `string \| undefined` |

- `autoComplete` — The input autocomplete attribute. Applied to the first slot and hidden validation input.
- `autoSubmit` — Whether to submit the owning form when the OTP becomes complete.
- `defaultValue` — The uncontrolled OTP value when the component is initially rendered.
- `disabled` — Whether the component should ignore user interaction.
- `form` — A string specifying the `form` element with which the hidden input is associated. This string's value must match the id of a `form` element in the same document.
- `id` — The id of the first input element. Subsequent inputs derive their ids from it (`{id}-2`, `{id}-3`, and so on).
- `inputMode` — The virtual keyboard hint applied to the slot inputs and hidden validation input.
  Built-in validation modes provide sensible defaults, but you can override them when needed.
- `length` — The number of OTP input slots. Required so the root can clamp values, detect completion, and generate consistent validation markup before all slots hydrate.
- `mask` — Whether the slot inputs should mask entered characters. Pass `type` directly to individual `<OTPFieldInput>` parts to use a custom input type.
- `name` — Identifies the field when a form is submitted.
- `normalizeValue` — Function that normalizes the OTP value after whitespace and `validationType` filtering. It runs whenever OTP Field normalizes a value, including initial/default values, controlled values, and user edits.
  The returned value is filtered by `validationType` again, then clamped to `length`. It should be idempotent because OTP Field may normalize the same value more than once while handling edits, storing state, and rendering controlled or uncontrolled values. Non-idempotent normalizers can compound across those normalization passes. Characters rejected while normalizing typed or pasted text are reported through `onValueInvalid`.
- `onValueChange` — Callback fired when the OTP value changes.
  The `eventDetails.reason` indicates what triggered the change:
  - `'input-change'` for typing or autofill
  - `'input-clear'` when a character is removed by text input
  - `'input-paste'` for paste interactions
  - `'keyboard'` for keyboard interactions that change the value
- `onValueComplete` — Callback function that is fired when the OTP value becomes complete, or when a complete value is pasted while the OTP is already complete.
  When the value changes, it runs later than `onValueChange`, after the internal value update is applied. If a complete pasted value matches the current value, `onValueChange` does not fire.
  If `autoSubmit` is enabled, it runs immediately before the owning form is submitted.
- `onValueInvalid` — Callback fired when entered text contains characters that are rejected by validation or normalization before the OTP value updates.
  The `value` argument is the attempted user-entered string before normalization.
- `readOnly` — Whether the user should be unable to change the field value.
- `required` — Whether the user must enter a value before submitting a form.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `validationType` — The type of input validation to apply to the OTP value.
- `value` — The OTP value.

## InputOtpGroup

Takes the DOM props of the element it renders. Pass `render` to render a different element.

## InputOtpInput

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| undefined` |
| style | `CSSProperties \| ((state: OTPFieldInputState) => CSSProperties \| undefined) \| undefined` |

- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## InputOtpSeparator

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| undefined` |
| icon | `ReactNode` |
| orientation | `Orientation \| undefined` |
| style | `CSSProperties \| ((state: SeparatorState) => CSSProperties \| undefined) \| undefined` |

- `icon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `orientation` — The orientation of the separator.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## OTPField

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| autoComplete | `string \| undefined` |
| autoSubmit | `boolean \| undefined` |
| className | `string \| undefined` |
| defaultValue | `string \| undefined` |
| disabled | `boolean \| undefined` |
| form | `string \| undefined` |
| id | `string \| undefined` |
| inputMode | `"search" \| "text" \| "none" \| "tel" \| "url" \| "email" \| "numeric" \| "decimal" \| undefined` |
| **length** | `number` |
| mask | `boolean \| undefined` |
| name | `string \| undefined` |
| normalizeValue | `((value: string) => string) \| undefined` |
| onValueChange | `((value: string, eventDetails: OTPFieldRootChangeEventDetails) => void) \| undefined` |
| onValueComplete | `((value: string, eventDetails: OTPFieldRootCompleteEventDetails) => void) \| undefined` |
| onValueInvalid | `((value: string, eventDetails: OTPFieldRootInvalidEventDetails) => void) \| undefined` |
| readOnly | `boolean \| undefined` |
| required | `boolean \| undefined` |
| style | `CSSProperties \| ((state: OTPFieldRootState) => CSSProperties \| undefined) \| undefined` |
| validationType | `OTPValidationType \| undefined` |
| value | `string \| undefined` |

- `autoComplete` — The input autocomplete attribute. Applied to the first slot and hidden validation input.
- `autoSubmit` — Whether to submit the owning form when the OTP becomes complete.
- `defaultValue` — The uncontrolled OTP value when the component is initially rendered.
- `disabled` — Whether the component should ignore user interaction.
- `form` — A string specifying the `form` element with which the hidden input is associated. This string's value must match the id of a `form` element in the same document.
- `id` — The id of the first input element. Subsequent inputs derive their ids from it (`{id}-2`, `{id}-3`, and so on).
- `inputMode` — The virtual keyboard hint applied to the slot inputs and hidden validation input.
  Built-in validation modes provide sensible defaults, but you can override them when needed.
- `length` — The number of OTP input slots. Required so the root can clamp values, detect completion, and generate consistent validation markup before all slots hydrate.
- `mask` — Whether the slot inputs should mask entered characters. Pass `type` directly to individual `<OTPFieldInput>` parts to use a custom input type.
- `name` — Identifies the field when a form is submitted.
- `normalizeValue` — Function that normalizes the OTP value after whitespace and `validationType` filtering. It runs whenever OTP Field normalizes a value, including initial/default values, controlled values, and user edits.
  The returned value is filtered by `validationType` again, then clamped to `length`. It should be idempotent because OTP Field may normalize the same value more than once while handling edits, storing state, and rendering controlled or uncontrolled values. Non-idempotent normalizers can compound across those normalization passes. Characters rejected while normalizing typed or pasted text are reported through `onValueInvalid`.
- `onValueChange` — Callback fired when the OTP value changes.
  The `eventDetails.reason` indicates what triggered the change:
  - `'input-change'` for typing or autofill
  - `'input-clear'` when a character is removed by text input
  - `'input-paste'` for paste interactions
  - `'keyboard'` for keyboard interactions that change the value
- `onValueComplete` — Callback function that is fired when the OTP value becomes complete, or when a complete value is pasted while the OTP is already complete.
  When the value changes, it runs later than `onValueChange`, after the internal value update is applied. If a complete pasted value matches the current value, `onValueChange` does not fire.
  If `autoSubmit` is enabled, it runs immediately before the owning form is submitted.
- `onValueInvalid` — Callback fired when entered text contains characters that are rejected by validation or normalization before the OTP value updates.
  The `value` argument is the attempted user-entered string before normalization.
- `readOnly` — Whether the user should be unable to change the field value.
- `required` — Whether the user must enter a value before submitting a form.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `validationType` — The type of input validation to apply to the OTP value.
- `value` — The OTP value.

## OTPFieldGroup

Takes the DOM props of the element it renders. Pass `render` to render a different element.

## OTPFieldInput

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| undefined` |
| style | `CSSProperties \| ((state: OTPFieldInputState) => CSSProperties \| undefined) \| undefined` |

- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## OTPFieldSeparator

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| undefined` |
| icon | `ReactNode` |
| orientation | `Orientation \| undefined` |
| style | `CSSProperties \| ((state: SeparatorState) => CSSProperties \| undefined) \| undefined` |

- `icon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `orientation` — The orientation of the separator.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

Required props are bold. Full docs: https://ui.xiod.dev/docs
