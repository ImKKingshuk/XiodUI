# Tabs

```tsx
import { Tabs, TabsList, TabsPanel, TabsTab } from "xiod-ui/tabs";
```

## Tabs

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: TabsRootState) => string \| undefined) \| undefined` |
| defaultValue | `any` |
| onValueChange | `((value: any, eventDetails: TabsRootChangeEventDetails) => void) \| undefined` |
| orientation | `Orientation \| undefined` |
| style | `CSSProperties \| ((state: TabsRootState) => CSSProperties \| undefined) \| undefined` |
| value | `any` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `defaultValue` — The default value. Use when the component is not controlled. When the value is `null`, no Tab will be active.
- `onValueChange` — Callback invoked when new value is being set.
  The event `reason` is `'none'` for user-initiated changes, such as a click or keyboard navigation; `'initial'` for the first automatic selection or fallback in uncontrolled roots when `defaultValue` is omitted or `undefined`, including when the implicit initial value is disabled or missing; `'disabled'` for automatic fallback when the selected tab becomes disabled in uncontrolled roots; or `'missing'` for automatic fallback when the selected tab is removed, or when an explicit `defaultValue` never matches a mounted tab in uncontrolled roots.
  For automatic changes, the selected value can be `null` when no enabled Tab is available as a fallback.
  Automatic changes cannot be canceled; calling `eventDetails.cancel()` for `'initial'`, `'disabled'`, or `'missing'` has no effect.
- `orientation` — The component orientation (layout flow direction).
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `value` — The value of the currently active `Tab`. Use when the component is controlled. When the value is `null`, no Tab will be active.

## TabsList

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| activateOnFocus | `boolean \| undefined` | — |
| className | `string \| ((state: TabsListState) => string \| undefined) \| undefined` | — |
| loopFocus | `boolean \| undefined` | — |
| style | `CSSProperties \| ((state: TabsListState) => CSSProperties \| undefined) \| undefined` | — |
| variant | `TabsVariant \| undefined` | `"default"` |

- `activateOnFocus` — Whether to automatically change the active tab on arrow key focus. Otherwise, tabs will be activated using <kbd>Enter</kbd> or <kbd>Space</kbd> key press.
- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `loopFocus` — Whether to loop keyboard focus back to the first item when the end of the list is reached while using the arrow keys.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## TabsPanel

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: TabsPanelState) => string \| undefined) \| undefined` |
| keepMounted | `boolean \| undefined` |
| style | `CSSProperties \| ((state: TabsPanelState) => CSSProperties \| undefined) \| undefined` |
| **value** | `any` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `keepMounted` — Whether to keep the HTML element in the DOM while the panel is hidden.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `value` — The value of the TabPanel. It will be shown when the Tab with the corresponding value is active.

## TabsTab

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: TabsTabState) => string \| undefined) \| undefined` |
| disabled | `boolean \| undefined` |
| nativeButton | `boolean \| undefined` |
| style | `CSSProperties \| ((state: TabsTabState) => CSSProperties \| undefined) \| undefined` |
| **value** | `any` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `disabled` — Whether the Tab is disabled.
  If a first Tab on a `<TabsList>` is disabled, it won't initially be selected. Instead, the next enabled Tab will be selected. However, it does not work like this during server-side rendering, as it is not known during pre-rendering which Tabs are disabled. To work around it, ensure that `defaultValue` or `value` on `<Tabs>` is set to an enabled Tab's value.
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `false` if the rendered element is not a button (for example, `<div>`).
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `value` — The value of the Tab.

Required props are bold. Full docs: https://ui.xiod.dev/docs
