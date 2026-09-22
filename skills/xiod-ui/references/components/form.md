# form

```tsx
import { Form } from "xiod-ui/form";
```

## Form

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| actionsRef | `RefObject<FormActions \| null> \| undefined` | — |
| className | `string \| ((state: FormState) => string \| undefined) \| undefined` | — |
| errors | `Errors \| undefined` | — |
| onFormSubmit | `((formValues: Record<string, any>, eventDetails: { reason: "none"; event: Event; }) => void) \| undefined` | — |
| style | `CSSProperties \| ((state: FormState) => CSSProperties \| undefined) \| undefined` | — |
| validationMode | `FormValidationMode \| undefined` | — |

- `actionsRef` — A ref to imperative actions. - `validate`: Validates all fields when called. Optionally pass a field name to validate a single field.
- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `errors` — Validation errors returned externally, typically after submission by a server or a form action. This should be an object where keys correspond to the `name` attribute on `<Field.Root>`, and values correspond to error(s) related to that field.
- `onFormSubmit` — Event handler called when the form is submitted. `preventDefault()` is called on the native submit event when used.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `validationMode` — Determines when the form should be validated. The `validationMode` prop on `<Field.Root>` takes precedence over this. - `onSubmit` (default): validates the field when the form is submitted, afterwards fields will re-validate on change. - `onBlur`: validates a field when it loses focus. - `onChange`: validates the field on every change to its value.

Required props are bold. Full docs: https://ui.xiod.dev/docs
