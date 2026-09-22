# combobox

```tsx
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxClear, ComboboxCollection, ComboboxEmpty, ComboboxGroup, ComboboxGroupLabel, ComboboxInput, ComboboxItem, ComboboxList, ComboboxPopup, ComboboxRow, ComboboxSeparator, ComboboxStatus, ComboboxTrigger, ComboboxValue, useComboboxFilter } from "xiod-ui/combobox";
```

## Combobox

| Prop | Type | Default |
| :--- | :--- | :--- |
| actionsRef | `RefObject<Actions \| null> \| undefined` | — |
| autoComplete | `string \| undefined` | — |
| autoHighlight | `boolean \| undefined` | — |
| children | `ReactNode` | — |
| defaultInputValue | `string \| number \| readonly string[] \| undefined` | — |
| defaultOpen | `boolean \| undefined` | — |
| defaultValue | `ComboboxValueType<Value, Multiple> \| null \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| filter | `((item: Item, query: string, itemToString?: ((item: Item) => string) \| undefined) => boolean) \| null \| undefined` | — |
| filteredItems | `readonly Item[] \| readonly Group<Item>[] \| undefined` | — |
| form | `string \| undefined` | — |
| grid | `boolean \| undefined` | — |
| highlightItemOnHover | `boolean \| undefined` | — |
| id | `string \| undefined` | — |
| inline | `boolean \| undefined` | — |
| inputRef | `Ref<HTMLInputElement> \| undefined` | — |
| inputValue | `string \| number \| readonly string[] \| undefined` | — |
| isItemEqualToValue | `((itemValue: Value, value: Value) => boolean) \| undefined` | — |
| items | `readonly any[] \| readonly Group<any>[] \| ComboboxItemCollection<Item, Value> \| undefined` | — |
| itemToStringLabel | `((itemValue: Value) => string) \| undefined` | — |
| itemToStringValue | `((itemValue: Value) => string) \| undefined` | — |
| limit | `number \| undefined` | — |
| locale | `LocalesArgument` | — |
| loopFocus | `boolean \| undefined` | — |
| modal | `boolean \| undefined` | — |
| multiple | `Multiple \| undefined` | — |
| name | `string \| undefined` | — |
| onInputValueChange | `((inputValue: string, eventDetails: ChangeEventDetails) => void) \| undefined` | — |
| onItemHighlighted | `((highlightedValue: Value \| undefined, eventDetails: HighlightEventDetails) => void) \| undefined` | — |
| onOpenChange | `((open: boolean, eventDetails: ChangeEventDetails) => void) \| undefined` | — |
| onOpenChangeComplete | `((open: boolean) => void) \| undefined` | — |
| onValueChange | `((value: ComboboxValueType<Value, Multiple> \| (Multiple extends true ? never : null), eventDetails: ChangeEventDetails) => void) \| undefined` | — |
| open | `boolean \| undefined` | — |
| openOnInputClick | `boolean \| undefined` | — |
| readOnly | `boolean \| undefined` | — |
| required | `boolean \| undefined` | — |
| value | `ComboboxValueType<Value, Multiple> \| null \| undefined` | — |
| virtualized | `boolean \| undefined` | — |

- `actionsRef` — A ref to imperative actions. - `unmount`: Manually unmounts the combobox. Call this after any externally controlled closing animation finishes.
- `autoComplete` — Provides a hint to the browser for autofill.
- `autoHighlight` — Whether the first matching item is highlighted automatically while filtering.
- `defaultInputValue` — The uncontrolled input value when initially rendered. To render a controlled input, use the `inputValue` prop instead.
- `defaultOpen` — Whether the popup is initially open. To render a controlled popup, use the `open` prop instead.
- `defaultValue` — The uncontrolled selected value of the combobox when it's initially rendered. To render a controlled combobox, use the `value` prop instead.
- `disabled` — Whether the component should ignore user interaction.
- `filter` — Filter function used to match items vs input query. Receives the source item, which is the derived value's item when `items` is a `createItems()` collection, and the item itself otherwise.
- `filteredItems` — Filtered items to display in the list. When provided, the list uses these items instead of filtering the `items` prop internally. When `items` is also provided, this array must preserve its flat or grouped structure. With a `createItems()` collection, pass source items rather than derived values. Nullish entries are not supported, as in `items`. Use when you want to control filtering logic externally with the `useFilter()` hook.
- `form` — Identifies the form that owns the internal input. Useful when the combobox is rendered outside the form.
- `grid` — Whether list items are presented in a grid layout. When enabled, arrow keys navigate across rows and columns inferred from DOM rows.
- `highlightItemOnHover` — Whether moving the pointer over items should highlight them. Disabling this prop allows CSS `:hover` to be differentiated from the `:focus` (`data-highlighted`) state.
- `id` — The id of the component.
- `inline` — Whether the list is rendered inline without using the component's own popup. Specify `open` unconditionally in conjunction with this prop so the list is considered visible: `<Combobox.Root inline open>` In a `Combobox.Root` > `Dialog.Root` composition, bind the Combobox's `open` and `onOpenChange` props to the `Dialog`'s `open` and `onOpenChange` state instead so the component resets its transient state (filter query, highlighted item, and input value) when the dialog closes.
- `inputRef` — A ref to the hidden input element.
- `inputValue` — The input value of the combobox. Use when controlled.
- `isItemEqualToValue` — Custom comparison logic used to determine if a combobox item value matches the current selected value. Useful when item values are objects without matching referentially. With a `createItems()` collection, both arguments are derived values. Defaults to `Object.is` comparison.
- `items` — The items to be displayed in the list. Can be a flat array of items, an array of groups with items, or a collection created by the `createItems()` function, which derives each item's selection value and label. Nullish entries are not supported: remove them from the data before passing it.
- `itemToStringLabel` — When the item values are objects (`<Combobox.Item value={object}>`), this function converts the object value to a string representation for display in the input. If the shape of the object is `{ value, label }`, the label will be used automatically without needing to specify this prop. With a `createItems()` collection, this receives the derived value, and the collection's `getLabel` takes precedence for values it can resolve.
- `itemToStringValue` — When the item values are objects (`<Combobox.Item value={object}>`), this function converts the object value to a string representation for form submission. If the shape of the object is `{ value, label }`, the value will be used automatically without needing to specify this prop. With a `createItems()` collection, this receives the derived value.
- `limit` — The maximum number of items to display in the list.
- `locale` — The locale to use for string comparison. Defaults to the user's runtime locale.
- `loopFocus` — Whether to loop keyboard focus back to the input when the end of the list is reached while using the arrow keys. The first item can then be reached by pressing <kbd>ArrowDown</kbd> again from the input, or the last item can be reached by pressing <kbd>ArrowUp</kbd> from the input. The input is always included in the focus loop per [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/). When disabled, focus does not move when on the last element and the user presses <kbd>ArrowDown</kbd>, or when on the first element and the user presses <kbd>ArrowUp</kbd>.
- `modal` — Determines if the popup enters a modal state when open. - `true`: user interaction is limited to the popup: document page scroll is locked and pointer interactions on outside elements are disabled. - `false`: user interaction with the rest of the document is allowed. On touch devices, a `true` modal blocks outside taps but leaves the page scrollable unless the popup spans nearly the full viewport width, matching native iOS behavior.
- `multiple` — Whether multiple items can be selected.
- `name` — Identifies the field when a form is submitted.
- `onInputValueChange` — Event handler called when the input value changes.
- `onItemHighlighted` — Callback fired when an item is highlighted or unhighlighted. Receives the highlighted item value (or `undefined` if no item is highlighted) and event details with a `reason` property describing why the highlight changed. The `reason` can be: - `'keyboard'`: the highlight changed due to keyboard navigation. - `'pointer'`: the highlight changed due to pointer hovering. - `'none'`: the highlight changed programmatically.
- `onOpenChange` — Event handler called when the popup is opened or closed.
- `onOpenChangeComplete` — Event handler called after any animations complete when the popup is opened or closed.
- `onValueChange` — Event handler called when the selected value of the combobox changes.
- `open` — Whether the popup is currently open. Use when controlled.
- `openOnInputClick` — Whether the popup opens when clicking the input.
- `readOnly` — Whether the user should be unable to choose a different option from the popup.
- `required` — Whether the user must choose a value before submitting a form.
- `value` — The selected value of the combobox. Use when controlled.
- `virtualized` — Whether the items are being externally virtualized.

## ComboboxChip

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: ComboboxChipState) => string \| undefined) \| undefined` | — |
| removeProps | `ComboboxChipRemoveProps \| undefined` | — |
| style | `CSSProperties \| ((state: ComboboxChipState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## ComboboxChips

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: ComboboxChipsState) => string \| undefined) \| undefined` | — |
| startAddon | `ReactNode` | — |
| style | `CSSProperties \| ((state: ComboboxChipsState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## ComboboxChipsInput

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: ComboboxInputState) => string \| undefined) \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| size | `number \| "sm" \| "default" \| "lg" \| undefined` | — |
| style | `CSSProperties \| ((state: ComboboxInputState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `disabled` — Whether the component should ignore user interaction.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## ComboboxClear

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: ComboboxClearState) => string \| undefined) \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| keepMounted | `boolean \| undefined` | — |
| nativeButton | `boolean \| undefined` | — |
| style | `CSSProperties \| ((state: ComboboxClearState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `disabled` — Whether the component should ignore user interaction.
- `keepMounted` — Whether the component should remain mounted in the DOM when not visible.
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `false` if the rendered element is not a button (for example, `<div>`).
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## ComboboxCollection

| Prop | Type | Default |
| :--- | :--- | :--- |
| **children** | `(item: any, index: number) => ReactNode` | — |

## ComboboxEmpty

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: ComboboxEmptyState) => string \| undefined) \| undefined` | — |
| style | `CSSProperties \| ((state: ComboboxEmptyState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## ComboboxGroup

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: ComboboxGroupState) => string \| undefined) \| undefined` | — |
| items | `readonly any[] \| undefined` | — |
| style | `CSSProperties \| ((state: ComboboxGroupState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `items` — Items to be rendered within this group. When provided, child `Collection` components will use these items.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## ComboboxGroupLabel

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: ComboboxGroupLabelState) => string \| undefined) \| undefined` | — |
| style | `CSSProperties \| ((state: ComboboxGroupLabelState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## ComboboxInput

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: ComboboxInputState) => string \| undefined) \| undefined` | — |
| clearProps | `ComboboxClearProps \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| showClear | `boolean \| undefined` | `false` |
| showTrigger | `boolean \| undefined` | `true` |
| size | `number \| "sm" \| "default" \| "lg" \| undefined` | — |
| startAddon | `ReactNode` | — |
| style | `CSSProperties \| ((state: ComboboxInputState) => CSSProperties \| undefined) \| undefined` | — |
| triggerProps | `ComboboxTriggerProps \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `disabled` — Whether the component should ignore user interaction.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## ComboboxItem

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| children | `ReactNode` | — |
| className | `string \| ((state: ComboboxItemState) => string \| undefined) \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| index | `number \| undefined` | — |
| nativeButton | `boolean \| undefined` | — |
| onClick | `((event: BaseUIEvent<MouseEvent<HTMLDivElement, MouseEvent>>) => void) \| undefined` | — |
| style | `CSSProperties \| ((state: ComboboxItemState) => CSSProperties \| undefined) \| undefined` | — |
| value | `any` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `disabled` — Whether the component should ignore user interaction.
- `index` — The index of the item in the list. Improves performance when specified by avoiding the need to calculate the index automatically from the DOM.
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `true` if the rendered element is a native button.
- `onClick` — An optional click handler for the item when selected. It fires when clicking the item with the pointer, as well as when pressing `Enter` with the keyboard if the item is highlighted when the `Input` or `List` element has focus.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `value` — A unique value that identifies this item.

## ComboboxList

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| children | `ReactNode \| ((item: any, index: number) => ReactNode)` | — |
| className | `string \| ((state: ComboboxListState) => string \| undefined) \| undefined` | — |
| style | `CSSProperties \| ((state: ComboboxListState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## ComboboxPopup

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| align | `Align \| undefined` | `"start"` |
| alignOffset | `number \| OffsetFunction \| undefined` | — |
| anchor | `Element \| VirtualElement \| RefObject<Element \| null> \| (() => Element \| VirtualElement \| null) \| null \| undefined` | — |
| className | `string \| ((state: ComboboxPopupState) => string \| undefined) \| undefined` | — |
| finalFocus | `boolean \| RefObject<HTMLElement \| null> \| ((closeType: InteractionType) => boolean \| void \| HTMLElement \| null) \| undefined` | — |
| initialFocus | `boolean \| RefObject<HTMLElement \| null> \| ((openType: InteractionType) => boolean \| void \| HTMLElement \| null) \| undefined` | — |
| side | `Side \| undefined` | `"bottom"` |
| sideOffset | `number \| OffsetFunction \| undefined` | `4` |
| style | `CSSProperties \| ((state: ComboboxPopupState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `finalFocus` — Determines the element to focus when the popup is closed. - `false`: Do not move focus. - `true`: Move focus based on the default behavior (trigger or previously focused element). - `RefObject`: Move focus to the ref element. - `function`: Called with the interaction type (`mouse`, `touch`, `pen`, or `keyboard`). Return an element to focus, `true` to use the default behavior, or `false`/`undefined` to do nothing.
- `initialFocus` — Determines the element to focus when the popup is opened. - `false`: Do not move focus. - `true`: Move focus based on the default behavior (first tabbable element or popup). - `RefObject`: Move focus to the ref element. - `function`: Called with the interaction type (`mouse`, `touch`, `pen`, or `keyboard`). Return an element to focus, `true` to use the default behavior, or `false`/`undefined` to do nothing.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## ComboboxRow

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: ComboboxRowState) => string \| undefined) \| undefined` | — |
| style | `CSSProperties \| ((state: ComboboxRowState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## ComboboxSeparator

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: ComboboxSeparatorState) => string \| undefined) \| undefined` | — |
| orientation | `Orientation \| undefined` | — |
| style | `CSSProperties \| ((state: ComboboxSeparatorState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `orientation` — The orientation of the separator.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## ComboboxStatus

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: ComboboxStatusState) => string \| undefined) \| undefined` | — |
| style | `CSSProperties \| ((state: ComboboxStatusState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## ComboboxTrigger

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: ComboboxTriggerState) => string \| undefined) \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| nativeButton | `boolean \| undefined` | — |
| style | `CSSProperties \| ((state: ComboboxTriggerState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `disabled` — Whether the component should ignore user interaction.
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `false` if the rendered element is not a button (for example, `<div>`).
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## ComboboxValue

| Prop | Type | Default |
| :--- | :--- | :--- |
| children | `ReactNode \| ((selectedValue: any) => ReactNode)` | — |
| placeholder | `ReactNode` | — |

- `children` — Accepts a function that returns a `ReactNode` to format the selected value. Treat the value as read-only: in `multiple` mode it may be a shared frozen array when nothing is selected.
- `placeholder` — The placeholder value to display when no value is selected. This is overridden by `children` if specified, or by a null item's label in `items`.

## useComboboxFilter

This hook accepts no arguments.

Required props are bold. Full docs: https://ui.xiod.dev/docs
