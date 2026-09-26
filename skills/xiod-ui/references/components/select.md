# select

```tsx
import { Select, SelectButton, SelectGroup, SelectGroupLabel, SelectItem, SelectPopup, SelectSeparator, SelectTrigger, SelectValue } from "xiod-ui/select";
```

## Select

| Prop | Type | Default |
| :--- | :--- | :--- |
| actionsRef | `RefObject<SelectRootActions \| null> \| undefined` | — |
| autoComplete | `string \| undefined` | — |
| children | `ReactNode` | — |
| defaultOpen | `boolean \| undefined` | — |
| defaultValue | `SelectValueType<Value, Multiple> \| null \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| form | `string \| undefined` | — |
| highlightItemOnHover | `boolean \| undefined` | — |
| id | `string \| undefined` | — |
| inputRef | `Ref<HTMLInputElement> \| undefined` | — |
| isItemEqualToValue | `((itemValue: Value, value: Value) => boolean) \| undefined` | — |
| items | `readonly Group<any>[] \| Record<string, ReactNode> \| readonly { label: ReactNode; value: any; }[] \| undefined` | — |
| itemToStringLabel | `((itemValue: Value) => string) \| undefined` | — |
| itemToStringValue | `((itemValue: Value) => string) \| undefined` | — |
| modal | `boolean \| undefined` | — |
| multiple | `Multiple \| undefined` | — |
| name | `string \| undefined` | — |
| onOpenChange | `((open: boolean, eventDetails: SelectRootChangeEventDetails) => void) \| undefined` | — |
| onOpenChangeComplete | `((open: boolean) => void) \| undefined` | — |
| onValueChange | `((value: SelectValueType<Value, Multiple> \| (Multiple extends true ? never : null), eventDetails: SelectRootChangeEventDetails) => void) \| undefined` | — |
| open | `boolean \| undefined` | — |
| readOnly | `boolean \| undefined` | — |
| required | `boolean \| undefined` | — |
| value | `SelectValueType<Value, Multiple> \| null \| undefined` | — |

- `actionsRef` — A ref to imperative actions. - `unmount`: Manually unmounts the select. Call this after any externally controlled closing animation finishes.
- `autoComplete` — Provides a hint to the browser for autofill.
- `defaultOpen` — Whether the select popup is initially open. To render a controlled select popup, use the `open` prop instead.
- `defaultValue` — The uncontrolled value of the select when it's initially rendered. To render a controlled select, use the `value` prop instead.
- `disabled` — Whether the component should ignore user interaction.
- `form` — Identifies the form that owns the hidden input. Useful when the select is rendered outside the form.
- `highlightItemOnHover` — Whether moving the pointer over items should highlight them. Disabling this prop allows CSS `:hover` to be differentiated from the `:focus` (`data-highlighted`) state.
- `id` — The id of the Select.
- `inputRef` — A ref to access the hidden input element.
- `isItemEqualToValue` — Custom comparison logic used to determine if a select item value matches the current selected value. Useful when item values are objects without matching referentially. Defaults to `Object.is` comparison.
- `items` — Data structure of the items rendered in the select popup. When specified, `<Select.Value>` renders the label of the selected item instead of the raw value.
- `itemToStringLabel` — When the item values are objects (`<Select.Item value={object}>`), this function converts the object value to a string representation for display in the trigger. If the shape of the object is `{ value, label }`, the label will be used automatically without needing to specify this prop.
- `itemToStringValue` — When the item values are objects (`<Select.Item value={object}>`), this function converts the object value to a string representation for form submission. If the shape of the object is `{ value, label }`, the value will be used automatically without needing to specify this prop.
- `modal` — Determines if the select enters a modal state when open. - `true`: user interaction is limited to the select: document page scroll is locked and pointer interactions on outside elements are disabled. - `false`: user interaction with the rest of the document is allowed. On touch devices, a `true` modal blocks outside taps but leaves the page scrollable unless the popup spans nearly the full viewport width, matching native iOS behavior.
- `multiple` — Whether multiple items can be selected.
- `name` — Identifies the field when a form is submitted.
- `onOpenChange` — Event handler called when the select popup is opened or closed.
- `onOpenChangeComplete` — Event handler called after any animations complete when the select popup is opened or closed.
- `onValueChange` — Event handler called when the value of the select changes.
- `open` — Whether the select popup is currently open.
- `readOnly` — Whether the user should be unable to choose a different option from the select popup.
- `required` — Whether the user must choose a value before submitting a form.
- `value` — The value of the select. Use when controlled.

## SelectButton

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| icon | `ReactNode` | — |
| size | `"sm" \| "default" \| "lg" \| null \| undefined` | `"default"` |

- `icon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.

## SelectGroup

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: SelectGroupState) => string \| undefined) \| undefined` | — |
| style | `CSSProperties \| ((state: SelectGroupState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## SelectGroupLabel

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: SelectGroupLabelState) => string \| undefined) \| undefined` | — |
| style | `CSSProperties \| ((state: SelectGroupLabelState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## SelectItem

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| children | `ReactNode` | — |
| className | `string \| ((state: SelectItemState) => string \| undefined) \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| label | `string \| undefined` | — |
| nativeButton | `boolean \| undefined` | — |
| style | `CSSProperties \| ((state: SelectItemState) => CSSProperties \| undefined) \| undefined` | — |
| value | `any` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `disabled` — Whether the component should ignore user interaction.
- `label` — Specifies the text label to use when the item is matched during keyboard text navigation. Defaults to the item text content if not provided.
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `true` if the rendered element is a native button.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `value` — A unique value that identifies this select item.

## SelectPopup

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| align | `Align \| undefined` | `"start"` |
| alignItemWithTrigger | `boolean \| undefined` | `true` |
| alignOffset | `number \| OffsetFunction \| undefined` | `0` |
| anchor | `Element \| VirtualElement \| RefObject<Element \| null> \| (() => Element \| VirtualElement \| null) \| null \| undefined` | — |
| children | `ReactNode` | — |
| className | `string \| ((state: SelectPopupState) => string \| undefined) \| undefined` | — |
| finalFocus | `boolean \| RefObject<HTMLElement \| null> \| ((closeType: InteractionType) => boolean \| void \| HTMLElement \| null) \| undefined` | — |
| scrollDownIcon | `ReactNode` | — |
| scrollUpIcon | `ReactNode` | — |
| side | `Side \| undefined` | `"bottom"` |
| sideOffset | `number \| OffsetFunction \| undefined` | `4` |
| style | `CSSProperties \| ((state: SelectPopupState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `finalFocus` — Determines the element to focus when the select popup is closed. - `false`: Do not move focus. - `true`: Move focus based on the default behavior (trigger or previously focused element). - `RefObject`: Move focus to the ref element. - `function`: Called with the interaction type (`mouse`, `touch`, `pen`, or `keyboard`). Return an element to focus, `true` to use the default behavior, or `false`/`undefined` to do nothing.
- `scrollDownIcon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `scrollUpIcon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## SelectSeparator

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: SelectSeparatorState) => string \| undefined) \| undefined` | — |
| orientation | `Orientation \| undefined` | — |
| style | `CSSProperties \| ((state: SelectSeparatorState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `orientation` — The orientation of the separator.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## SelectTrigger

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| children | `ReactNode` | — |
| className | `string \| ((state: SelectTriggerState) => string \| undefined) \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| icon | `ReactNode` | — |
| nativeButton | `boolean \| undefined` | — |
| size | `"sm" \| "default" \| "lg" \| null \| undefined` | `"default"` |
| style | `CSSProperties \| ((state: SelectTriggerState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `disabled` — Whether the component should ignore user interaction.
- `icon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `false` if the rendered element is not a button (for example, `<div>`).
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## SelectValue

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| children | `ReactNode \| ((value: any) => ReactNode)` | — |
| className | `string \| ((state: SelectValueState) => string \| undefined) \| undefined` | — |
| placeholder | `ReactNode` | — |
| style | `CSSProperties \| ((state: SelectValueState) => CSSProperties \| undefined) \| undefined` | — |

- `children` — Accepts a function that returns a `ReactNode` to format the selected value. Treat the value as read-only: in `multiple` mode it may be a shared frozen array when nothing is selected.
- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `placeholder` — The placeholder value to display when no value is selected. This is overridden by `children` if specified, or by a null item's label in `items`.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

Required props are bold. Full docs: https://ui.xiod.dev/docs
