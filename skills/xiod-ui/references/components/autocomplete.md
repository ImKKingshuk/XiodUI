# Autocomplete

```tsx
import { Autocomplete, AutocompleteClear, AutocompleteCollection, AutocompleteEmpty, AutocompleteGroup, AutocompleteGroupLabel, AutocompleteInput, AutocompleteItem, AutocompleteList, AutocompletePopup, AutocompleteRow, AutocompleteSeparator, AutocompleteStatus, AutocompleteTrigger, AutocompleteValue, useAutocompleteFilter } from "xiod-ui/autocomplete";
```

## Autocomplete

| Prop | Type |
| :--- | :--- |
| actionsRef | `RefObject<AutocompleteRootActions \| null> \| undefined` |
| autoHighlight | `boolean \| "always" \| undefined` |
| children | `ReactNode` |
| defaultOpen | `boolean \| undefined` |
| defaultValue | `string \| number \| readonly string[] \| undefined` |
| disabled | `boolean \| undefined` |
| filter | `((item: Items[number]["items"][number], query: string, itemToString?: ((item: Items[number]["items"][number]) => string) \| undefined) => boolean) \| null \| undefined` |
| filteredItems | `readonly Items[number]["items"][number][] \| readonly Group<Items[number]["items"][number]>[] \| undefined` |
| form | `string \| undefined` |
| grid | `boolean \| undefined` |
| highlightItemOnHover | `boolean \| undefined` |
| id | `string \| undefined` |
| inline | `boolean \| undefined` |
| inputRef | `Ref<HTMLInputElement> \| undefined` |
| **items** | `Items` |
| itemToStringValue | `((itemValue: Items[number]["items"][number]) => string) \| undefined` |
| keepHighlight | `boolean \| undefined` |
| limit | `number \| undefined` |
| locale | `LocalesArgument` |
| loopFocus | `boolean \| undefined` |
| modal | `boolean \| undefined` |
| mode | `"list" \| "none" \| "both" \| "inline" \| undefined` |
| name | `string \| undefined` |
| onItemHighlighted | `((highlightedValue: Items[number]["items"][number] \| undefined, eventDetails: HighlightEventDetails) => void) \| undefined` |
| onOpenChange | `((open: boolean, eventDetails: AutocompleteRootChangeEventDetails) => void) \| undefined` |
| onOpenChangeComplete | `((open: boolean) => void) \| undefined` |
| onValueChange | `((value: string, eventDetails: AutocompleteRootChangeEventDetails) => void) \| undefined` |
| open | `boolean \| undefined` |
| openOnInputClick | `boolean \| undefined` |
| readOnly | `boolean \| undefined` |
| required | `boolean \| undefined` |
| submitOnItemClick | `boolean \| undefined` |
| value | `string \| number \| readonly string[] \| undefined` |
| virtualized | `boolean \| undefined` |

- `actionsRef` — A ref to imperative actions.
  - `unmount`: Manually unmounts the autocomplete. Call this after any externally controlled closing animation finishes.
- `autoHighlight` — Whether the first matching item is highlighted automatically.
  - `true`: highlight after the user types and keep the highlight while the query changes.
  - `'always'`: always highlight the first item.
- `defaultOpen` — Whether the popup is initially open.
  To render a controlled popup, use the `open` prop instead.
- `defaultValue` — The uncontrolled input value of the autocomplete when it's initially rendered.
  To render a controlled autocomplete, use the `value` prop instead.
- `disabled` — Whether the component should ignore user interaction.
- `filter` — Filter function used to match items against the input query.
- `filteredItems` — Filtered items to display in the list. When provided, the list uses these items instead of filtering the `items` prop internally. When `items` is also provided, this array must preserve its flat or grouped structure. Nullish entries are not supported, as in `items`. Use when you want to control filtering logic externally with the `useFilter()` hook.
- `form` — Identifies the form that owns the internal input. Useful when the autocomplete is rendered outside the form.
- `grid` — Whether list items are presented in a grid layout. When enabled, arrow keys navigate across rows and columns inferred from DOM rows.
- `highlightItemOnHover` — Whether moving the pointer over items should highlight them. Disabling this prop allows CSS `:hover` to be differentiated from the `:focus` (`data-highlighted`) state.
- `id` — The id of the component.
- `inline` — Whether the list is rendered inline without using the component's own popup.
  Specify `open` unconditionally in conjunction with this prop so the list is considered visible: `<Autocomplete inline open>`
- `inputRef` — A ref to the hidden input element.
- `items` — The items to be displayed in the list. Can be either a flat array of items or an array of groups with items. Nullish entries are not supported: remove them from the data before passing it.
- `itemToStringValue` — When the item values are objects (`<AutocompleteItem value={object}>`), this function converts the object value to a string representation for both display in the input and form submission. If the shape of the object is `{ value, label }`, the label will be used automatically without needing to specify this prop.
- `keepHighlight` — Whether the highlighted item should be preserved when the pointer leaves the list.
- `limit` — The maximum number of items to display in the list.
- `locale` — The locale to use for string comparison. Defaults to the user's runtime locale.
- `loopFocus` — Whether to loop keyboard focus back to the input when the end of the list is reached while using the arrow keys. The first item can then be reached by pressing <kbd>ArrowDown</kbd> again from the input, or the last item can be reached by pressing <kbd>ArrowUp</kbd> from the input. The input is always included in the focus loop per [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/). When disabled, focus does not move when on the last element and the user presses <kbd>ArrowDown</kbd>, or when on the first element and the user presses <kbd>ArrowUp</kbd>.
- `modal` — Determines if the popup enters a modal state when open.
  - `true`: user interaction is limited to the popup: document page scroll is locked and pointer interactions on outside elements are disabled.
  - `false`: user interaction with the rest of the document is allowed.
  On touch devices, a `true` modal blocks outside taps but leaves the page scrollable unless the popup spans nearly the full viewport width, matching native iOS behavior.
- `mode` — Controls how the autocomplete behaves with respect to list filtering and inline autocompletion.
  - `list` (default): items are dynamically filtered based on the input value. The input value does not change based on the active item.
  - `both`: items are dynamically filtered based on the input value, which will temporarily change based on the active item (inline autocompletion).
  - `inline`: items are static (not filtered), and the input value will temporarily change based on the active item (inline autocompletion).
  - `none`: items are static (not filtered), and the input value will not change based on the active item.
- `name` — Identifies the field when a form is submitted.
- `onItemHighlighted` — Callback fired when an item is highlighted or unhighlighted. Receives the highlighted item value (or `undefined` if no item is highlighted) and event details with a `reason` property describing why the highlight changed. The `reason` can be:
  - `'keyboard'`: the highlight changed due to keyboard navigation.
  - `'pointer'`: the highlight changed due to pointer hovering.
  - `'none'`: the highlight changed programmatically.
- `onOpenChange` — Event handler called when the popup is opened or closed.
- `onOpenChangeComplete` — Event handler called after any animations complete when the popup is opened or closed.
- `onValueChange` — Event handler called when the input value of the autocomplete changes.
- `open` — Whether the popup is currently open. Use when controlled.
- `openOnInputClick` — Whether the popup opens when clicking the input.
- `readOnly` — Whether the user should be unable to choose a different option from the popup.
- `required` — Whether the user must choose a value before submitting a form.
- `submitOnItemClick` — Whether clicking an item should submit the autocomplete's owning form. By default, clicking an item via a pointer or <kbd>Enter</kbd> key does not submit the owning form. Useful when the autocomplete is used as a single-field form search input.
- `value` — The input value of the autocomplete. Use when controlled.
- `virtualized` — Whether the items are being externally virtualized.

## AutocompleteClear

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: ComboboxClearState) => string \| undefined) \| undefined` |
| disabled | `boolean \| undefined` |
| icon | `ReactNode` |
| keepMounted | `boolean \| undefined` |
| nativeButton | `boolean \| undefined` |
| style | `CSSProperties \| ((state: ComboboxClearState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `disabled` — Whether the component should ignore user interaction.
- `icon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `keepMounted` — Whether the component should remain mounted in the DOM when not visible.
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `false` if the rendered element is not a button (for example, `<div>`).
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## AutocompleteCollection

| Prop | Type |
| :--- | :--- |
| **children** | `(item: any, index: number) => ReactNode` |

## AutocompleteEmpty

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: ComboboxEmptyState) => string \| undefined) \| undefined` |
| style | `CSSProperties \| ((state: ComboboxEmptyState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## AutocompleteGroup

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: ComboboxGroupState) => string \| undefined) \| undefined` |
| items | `readonly any[] \| undefined` |
| style | `CSSProperties \| ((state: ComboboxGroupState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `items` — Items to be rendered within this group. When provided, child `Collection` components will use these items.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## AutocompleteGroupLabel

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: ComboboxGroupLabelState) => string \| undefined) \| undefined` |
| style | `CSSProperties \| ((state: ComboboxGroupLabelState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## AutocompleteInput

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: ComboboxInputState) => string \| undefined) \| undefined` | — |
| clearIcon | `ReactNode` | — |
| clearProps | `ComboboxClearProps \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| showClear | `boolean \| undefined` | `false` |
| showTrigger | `boolean \| undefined` | `false` |
| size | `number \| "sm" \| "default" \| "lg" \| undefined` | — |
| startAddon | `ReactNode` | — |
| style | `CSSProperties \| ((state: ComboboxInputState) => CSSProperties \| undefined) \| undefined` | — |
| triggerIcon | `ReactNode` | — |
| triggerProps | `AutocompleteTriggerProps \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `clearIcon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `disabled` — Whether the component should ignore user interaction.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `triggerIcon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.

## AutocompleteItem

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| children | `ReactNode` |
| className | `string \| ((state: AutocompleteItemState) => string \| undefined) \| undefined` |
| disabled | `boolean \| undefined` |
| index | `number \| undefined` |
| nativeButton | `boolean \| undefined` |
| onClick | `((event: BaseUIEvent<MouseEvent<HTMLDivElement, MouseEvent>>) => void) \| undefined` |
| style | `CSSProperties \| ((state: AutocompleteItemState) => CSSProperties \| undefined) \| undefined` |
| value | `any` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `disabled` — Whether the component should ignore user interaction.
- `index` — The index of the item in the list. Improves performance when specified by avoiding the need to calculate the index automatically from the DOM.
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `true` if the rendered element is a native button.
- `onClick` — An optional click handler for the item when selected. It fires when clicking the item with the pointer, as well as when pressing `Enter` with the keyboard if the item is highlighted when the `Input` or `List` element has focus.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `value` — A unique value that identifies this item.

## AutocompleteList

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| children | `ReactNode \| ((item: any, index: number) => ReactNode)` |
| className | `string \| ((state: ComboboxListState) => string \| undefined) \| undefined` |
| style | `CSSProperties \| ((state: ComboboxListState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## AutocompletePopup

Takes the DOM props of the element it renders. Pass `render` to render a different element.

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
- `finalFocus` — Determines the element to focus when the popup is closed.
  - `false`: Do not move focus.
  - `true`: Move focus based on the default behavior (trigger or previously focused element).
  - `RefObject`: Move focus to the ref element.
  - `function`: Called with the interaction type (`mouse`, `touch`, `pen`, or `keyboard`). Return an element to focus, `true` to use the default behavior, or `false`/`undefined` to do nothing.
- `initialFocus` — Determines the element to focus when the popup is opened.
  - `false`: Do not move focus.
  - `true`: Move focus based on the default behavior (first tabbable element or popup).
  - `RefObject`: Move focus to the ref element.
  - `function`: Called with the interaction type (`mouse`, `touch`, `pen`, or `keyboard`). Return an element to focus, `true` to use the default behavior, or `false`/`undefined` to do nothing.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## AutocompleteRow

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: ComboboxRowState) => string \| undefined) \| undefined` |
| style | `CSSProperties \| ((state: ComboboxRowState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## AutocompleteSeparator

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: AutocompleteSeparatorState) => string \| undefined) \| undefined` |
| orientation | `Orientation \| undefined` |
| style | `CSSProperties \| ((state: AutocompleteSeparatorState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `orientation` — The orientation of the separator.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## AutocompleteStatus

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: ComboboxStatusState) => string \| undefined) \| undefined` |
| style | `CSSProperties \| ((state: ComboboxStatusState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## AutocompleteTrigger

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: AutocompleteTriggerState) => string \| undefined) \| undefined` |
| disabled | `boolean \| undefined` |
| nativeButton | `boolean \| undefined` |
| style | `CSSProperties \| ((state: AutocompleteTriggerState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `disabled` — Whether the component should ignore user interaction.
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `false` if the rendered element is not a button (for example, `<div>`).
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## AutocompleteValue

| Prop | Type |
| :--- | :--- |
| children | `ReactNode \| ((value: string) => ReactNode)` |

## useAutocompleteFilter

```tsx
useAutocompleteFilter(options?)
```

Returns `Filter`.

- `options` — `GetFilterParameters \| undefined`

Required props are bold. Full docs: https://ui.xiod.dev/docs
