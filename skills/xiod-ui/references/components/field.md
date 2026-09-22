# field

```tsx
import { Field, FieldControl, FieldDescription, FieldError, FieldItem, FieldLabel, FieldValidity } from "xiod-ui/field";
```

## Field

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| actionsRef | `RefObject<FieldRootActions \| null> \| undefined` | — |
| className | `string \| ((state: FieldRootState) => string \| undefined) \| undefined` | — |
| dirty | `boolean \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| invalid | `boolean \| undefined` | — |
| name | `string \| undefined` | — |
| style | `CSSProperties \| ((state: FieldRootState) => CSSProperties \| undefined) \| undefined` | — |
| touched | `boolean \| undefined` | — |
| validate | `((value: unknown, formValues: Record<string, any>) => string \| void \| string[] \| Promise<string \| void \| string[] \| null> \| null) \| undefined` | — |
| validationDebounceTime | `number \| undefined` | — |
| validationMode | `FormValidationMode \| undefined` | — |

- `actionsRef` — A ref to imperative actions. - `validate`: Validates the field when called.
- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `dirty` — Whether the field's value has been changed from its initial value. Useful when the field state is controlled by an external library.
- `disabled` — Whether the component should ignore user interaction. Takes precedence over the `disabled` prop on the `<Field.Control>` component.
- `invalid` — Whether the field is invalid. Useful when the field state is controlled by an external library.
- `name` — Identifies the field when a form is submitted. Takes precedence over the `name` prop on the `<Field.Control>` component.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `touched` — Whether the field has been touched. Useful when the field state is controlled by an external library.
- `validate` — A function for custom validation. Return a string or an array of strings with the error message(s) if the value is invalid. Returning nothing, `null`, an empty string, or an empty array means the value is valid. Asynchronous functions are supported, but they do not prevent form submission when using `validationMode="onSubmit"`.
- `validationDebounceTime` — How long to wait between `validate` callbacks if `validationMode="onChange"` is used. Specified in milliseconds.
- `validationMode` — Determines when the field should be validated. This takes precedence over the `validationMode` prop on `<Form>`. - `onSubmit`: triggers validation when the form is submitted, and re-validates on change after submission. - `onBlur`: triggers validation when the control loses focus. - `onChange`: triggers validation on every change to the control value.

## FieldControl

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: FieldControlState) => string \| undefined) \| undefined` | — |
| defaultValue | `string \| number \| readonly string[] \| undefined` | — |
| onValueChange | `((value: string, eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element \| undefined; }) => void) \| undefined` | — |
| style | `CSSProperties \| ((state: FieldControlState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `onValueChange` — Callback fired when the `value` changes. Use when controlled.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## FieldDescription

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: FieldDescriptionState) => string \| undefined) \| undefined` | — |
| style | `CSSProperties \| ((state: FieldDescriptionState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## FieldError

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: FieldErrorState) => string \| undefined) \| undefined` | — |
| match | `boolean \| keyof ValidityState \| undefined` | — |
| style | `CSSProperties \| ((state: FieldErrorState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `match` — Determines whether to show the error message according to the field's [ValidityState](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState). Specifying `true` will always show the error message, and lets external libraries control the visibility.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## FieldItem

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: FieldItemState) => string \| undefined) \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| style | `CSSProperties \| ((state: FieldItemState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `disabled` — Whether the wrapped control should ignore user interaction. The `disabled` prop on `<Field.Root>` takes precedence over this.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## FieldLabel

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: FieldLabelState) => string \| undefined) \| undefined` | — |
| nativeLabel | `boolean \| undefined` | — |
| style | `CSSProperties \| ((state: FieldLabelState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `nativeLabel` — Whether the component renders a native `<label>` element when replacing it via the `render` prop. Set to `false` if the rendered element is not a label (for example, `<div>`). This is useful to avoid inheriting label behaviors on `<button>` controls (such as `<Select.Trigger>` and `<Combobox.Trigger>`), including avoiding `:hover` on the button when hovering the label, and preventing clicks on the label from firing on the button.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## FieldValidity

| Prop | Type | Default |
| :--- | :--- | :--- |
| **children** | `(state: FieldValidityState) => ReactNode` | — |

- `children` — A function that accepts the field validity state as an argument. ```jsx <Field.Validity> {(validity) => { return <div>...</div> }} </Field.Validity> ```

Required props are bold. Full docs: https://ui.xiod.dev/docs
