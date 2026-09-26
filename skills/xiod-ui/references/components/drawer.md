# drawer

```tsx
import { Drawer, DrawerBackdrop, DrawerBar, DrawerClose, DrawerContent, DrawerCreateHandle, DrawerDescription, DrawerFooter, DrawerHeader, DrawerMenu, DrawerMenuCheckboxItem, DrawerMenuGroup, DrawerMenuGroupLabel, DrawerMenuItem, DrawerMenuRadioGroup, DrawerMenuRadioItem, DrawerMenuSeparator, DrawerMenuTrigger, DrawerPanel, DrawerPopup, DrawerPortal, DrawerSwipeArea, DrawerTitle, DrawerTrigger, DrawerViewport } from "xiod-ui/drawer";
```

## Drawer

| Prop | Type | Default |
| :--- | :--- | :--- |
| actionsRef | `RefObject<DrawerRootActions \| null> \| undefined` | — |
| children | `ReactNode \| PayloadChildRenderFunction<unknown>` | — |
| defaultOpen | `boolean \| undefined` | — |
| defaultSnapPoint | `DrawerSnapPoint \| null \| undefined` | — |
| defaultTriggerId | `string \| null \| undefined` | — |
| disablePointerDismissal | `boolean \| undefined` | — |
| handle | `DrawerHandle<unknown> \| undefined` | — |
| modal | `boolean \| "trap-focus" \| undefined` | — |
| onOpenChange | `((open: boolean, eventDetails: DrawerRootChangeEventDetails) => void) \| undefined` | — |
| onOpenChangeComplete | `((open: boolean) => void) \| undefined` | — |
| onSnapPointChange | `((snapPoint: DrawerSnapPoint \| null, eventDetails: DrawerRootSnapPointChangeEventDetails) => void) \| undefined` | — |
| open | `boolean \| undefined` | — |
| position | `DrawerPosition \| undefined` | `"bottom"` |
| snapPoint | `DrawerSnapPoint \| null \| undefined` | — |
| snapPoints | `DrawerSnapPoint[] \| undefined` | — |
| snapToSequentialPoints | `boolean \| undefined` | — |
| swipeDirection | `SwipeDirection \| undefined` | — |
| triggerId | `string \| null \| undefined` | — |

- `actionsRef` — A ref to imperative actions. - `unmount`: Manually unmounts the drawer. Call this after any externally controlled closing animation finishes. - `close`: Closes the drawer imperatively when called.
- `children` — The content of the drawer.
- `defaultOpen` — Whether the drawer is initially open. To render a controlled drawer, use the `open` prop instead.
- `defaultSnapPoint` — The initial snap point value when uncontrolled.
- `defaultTriggerId` — ID of the trigger that the drawer is associated with. This is useful in conjunction with the `defaultOpen` prop to create an initially open drawer.
- `disablePointerDismissal` — Whether to prevent the drawer from closing on outside presses. For non-modal drawers, this also prevents the drawer from closing when focus moves outside of it.
- `handle` — A handle to associate the drawer with a trigger. If specified, allows detached triggers to control the drawer's open state. Can be created with the Drawer.createHandle() method.
- `modal` — Determines if the drawer enters a modal state when open. - `true`: user interaction is limited to just the drawer: focus is trapped, document page scroll is locked, and pointer interactions on outside elements are disabled. - `false`: user interaction with the rest of the document is allowed. - `'trap-focus'`: focus is trapped inside the drawer, but document page scroll is not locked and pointer interactions outside of it remain enabled.
- `onOpenChange` — Event handler called when the drawer is opened or closed.
- `onOpenChangeComplete` — Event handler called after any animations complete when the drawer is opened or closed.
- `onSnapPointChange` — Callback fired when the snap point changes.
- `open` — Whether the drawer is currently open.
- `snapPoint` — The currently active snap point. Use with `onSnapPointChange` to control the snap point.
- `snapPoints` — Snap points used to position the drawer. Use numbers between 0 and 1 to represent fractions of the viewport height, numbers greater than 1 as pixel values, or strings in `px`/`rem` units (for example, `'148px'` or `'30rem'`).
- `snapToSequentialPoints` — Disables velocity-based snap skipping so drag distance determines the next snap point.
- `swipeDirection` — The swipe direction used to dismiss the drawer.
- `triggerId` — ID of the trigger that the drawer is associated with. This is useful in conjunction with the `open` prop to create a controlled drawer. There's no need to specify this prop when the drawer is uncontrolled (that is, when the `open` prop is not set).

## DrawerBackdrop

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: DrawerBackdropState) => string \| undefined) \| undefined` | — |
| forceRender | `boolean \| undefined` | — |
| style | `CSSProperties \| ((state: DrawerBackdropState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `forceRender` — Whether the backdrop is forced to render even when nested.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## DrawerBar

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| position | `DrawerPosition \| undefined` | — |

## DrawerClose

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: DrawerCloseState) => string \| undefined) \| undefined` | — |
| nativeButton | `boolean \| undefined` | — |
| style | `CSSProperties \| ((state: DrawerCloseState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `false` if the rendered element is not a button (for example, `<div>`).
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## DrawerContent

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: DrawerContentState) => string \| undefined) \| undefined` | — |
| style | `CSSProperties \| ((state: DrawerContentState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## DrawerCreateHandle

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## DrawerDescription

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: DrawerDescriptionState) => string \| undefined) \| undefined` | — |
| style | `CSSProperties \| ((state: DrawerDescriptionState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## DrawerFooter

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| allowSelection | `boolean \| undefined` | `true` |
| variant | `"default" \| "bare" \| undefined` | `"default"` |

## DrawerHeader

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| allowSelection | `boolean \| undefined` | `false` |

## DrawerMenu

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## DrawerMenuCheckboxItem

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

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
| variant | `"switch" \| "default" \| undefined` | `"default"` |

- `checked` — Whether the checkbox is currently ticked. To render an uncontrolled checkbox, use the `defaultChecked` prop instead.
- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `defaultChecked` — Whether the checkbox is initially ticked. To render a controlled checkbox, use the `checked` prop instead.
- `disabled` — Whether the component should ignore user interaction.
- `form` — Identifies the form that owns the hidden input. Useful when the checkbox is rendered outside the form.
- `id` — The id of the input element.
- `indeterminate` — Whether the checkbox is in a mixed state: neither ticked, nor unticked.
- `inputRef` — A ref to access the hidden `<input>` element.
- `name` — Identifies the field when a form is submitted.
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `true` if the rendered element is a native button.
- `onCheckedChange` — Event handler called when the checkbox is ticked or unticked.
- `parent` — Whether the checkbox controls a group of child checkboxes. Must be used in a [Checkbox Group](https://base-ui.com/react/components/checkbox-group).
- `readOnly` — Whether the user should be unable to tick or untick the checkbox.
- `required` — Whether the user must tick the checkbox before submitting a form.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `uncheckedValue` — The value submitted with the form when the checkbox is unchecked. By default, unchecked checkboxes do not submit any value, matching native checkbox behavior.
- `value` — The checkbox's value. Identifies it within a [Checkbox Group](https://base-ui.com/react/components/checkbox-group), falling back to `name` when omitted. When submitting a form, a checked box submits `value`; with no `value`, it submits the native "on".

## DrawerMenuGroup

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## DrawerMenuGroupLabel

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## DrawerMenuItem

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| variant | `"default" \| "destructive" \| undefined` | `"default"` |

## DrawerMenuRadioGroup

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: RadioGroupState) => string \| undefined) \| undefined` | — |
| defaultValue | `any` | — |
| disabled | `boolean \| undefined` | — |
| form | `string \| undefined` | — |
| inputRef | `Ref<HTMLInputElement> \| undefined` | — |
| name | `string \| undefined` | — |
| onValueChange | `((value: any, eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element \| undefined; }) => void) \| undefined` | — |
| readOnly | `boolean \| undefined` | — |
| required | `boolean \| undefined` | — |
| style | `CSSProperties \| ((state: RadioGroupState) => CSSProperties \| undefined) \| undefined` | — |
| value | `any` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `defaultValue` — The uncontrolled value of the radio button that should be initially selected. To render a controlled radio group, use the `value` prop instead.
- `disabled` — Whether the component should ignore user interaction.
- `form` — Identifies the form that owns the radio inputs. Useful when the radio group is rendered outside the form.
- `inputRef` — A ref to access the hidden input element.
- `name` — Identifies the field when a form is submitted.
- `onValueChange` — Callback fired when the value changes.
- `readOnly` — Whether the user should be unable to select a different radio button in the group.
- `required` — Whether the user must choose a value before submitting a form.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `value` — The controlled value of the radio item that should be currently selected. To render an uncontrolled radio group, use the `defaultValue` prop instead.

## DrawerMenuRadioItem

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

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

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `disabled` — Whether the component should ignore user interaction.
- `inputRef` — A ref to access the hidden input element.
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `true` if the rendered element is a native button.
- `readOnly` — Whether the user should be unable to select the radio button.
- `required` — Whether the user must choose a value before submitting a form.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `value` — The unique identifying value of the radio in a group.

## DrawerMenuSeparator

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## DrawerMenuTrigger

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: DrawerTriggerState) => string \| undefined) \| undefined` | — |
| handle | `DrawerHandle<unknown> \| undefined` | — |
| icon | `ReactNode` | — |
| id | `string \| undefined` | — |
| nativeButton | `boolean \| undefined` | — |
| payload | `unknown` | — |
| style | `CSSProperties \| ((state: DrawerTriggerState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `handle` — A handle to associate the trigger with a drawer. Can be created with the Drawer.createHandle() method.
- `icon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `id` — ID of the trigger. In addition to being forwarded to the rendered element, it is also used to specify the active trigger for drawers in controlled mode (with the Drawer.Root `triggerId` prop).
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `false` if the rendered element is not a button (for example, `<div>`).
- `payload` — A payload to pass to the drawer when it is opened.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## DrawerPanel

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| allowSelection | `boolean \| undefined` | `true` |
| scrollable | `boolean \| undefined` | `true` |
| scrollFade | `boolean \| undefined` | `true` |

## DrawerPopup

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: DrawerPopupState) => string \| undefined) \| undefined` | — |
| closeIcon | `ReactNode` | — |
| finalFocus | `boolean \| RefObject<HTMLElement \| null> \| ((closeType: InteractionType) => boolean \| void \| HTMLElement \| null) \| undefined` | — |
| initialFocus | `boolean \| RefObject<HTMLElement \| null> \| ((openType: InteractionType) => boolean \| void \| HTMLElement \| null) \| undefined` | — |
| position | `DrawerPosition \| undefined` | — |
| showBar | `boolean \| undefined` | `false` |
| showCloseButton | `boolean \| undefined` | `false` |
| style | `CSSProperties \| ((state: DrawerPopupState) => CSSProperties \| undefined) \| undefined` | — |
| variant | `"default" \| "straight" \| "inset" \| undefined` | `"default"` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `closeIcon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `finalFocus` — Determines the element to focus when the drawer is closed. - `false`: Do not move focus. - `true`: Move focus based on the default behavior (trigger or previously focused element). - `RefObject`: Move focus to the ref element. - `function`: Called with the interaction type (`mouse`, `touch`, `pen`, or `keyboard`). Return an element to focus, `true` to use the default behavior, or `false`/`undefined` to do nothing.
- `initialFocus` — Determines the element to focus when the drawer is opened. - `false`: Do not move focus. - `true`: Move focus based on the default behavior (first tabbable element or popup). - `RefObject`: Move focus to the ref element. - `function`: Called with the interaction type (`mouse`, `touch`, `pen`, or `keyboard`). Return an element to focus, `true` to use the default behavior, or `false`/`undefined` to do nothing.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## DrawerPortal

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: DrawerPortalState) => string \| undefined) \| undefined` | — |
| container | `HTMLElement \| ShadowRoot \| RefObject<HTMLElement \| ShadowRoot \| null> \| null \| undefined` | — |
| keepMounted | `boolean \| undefined` | — |
| style | `CSSProperties \| ((state: DrawerPortalState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `container` — A parent element to render the portal element into.
- `keepMounted` — Whether to keep the portal mounted in the DOM while the popup is hidden.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## DrawerSwipeArea

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: DrawerSwipeAreaState) => string \| undefined) \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| position | `DrawerPosition \| undefined` | — |
| style | `CSSProperties \| ((state: DrawerSwipeAreaState) => CSSProperties \| undefined) \| undefined` | — |
| swipeDirection | `SwipeDirection \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `disabled` — Whether the swipe area is disabled.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `swipeDirection` — The swipe direction that opens the drawer. Defaults to the opposite of `Drawer.Root` `swipeDirection`.

## DrawerTitle

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: DrawerTitleState) => string \| undefined) \| undefined` | — |
| style | `CSSProperties \| ((state: DrawerTitleState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## DrawerTrigger

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: DrawerTriggerState) => string \| undefined) \| undefined` | — |
| handle | `DrawerHandle<unknown> \| undefined` | — |
| id | `string \| undefined` | — |
| nativeButton | `boolean \| undefined` | — |
| payload | `unknown` | — |
| style | `CSSProperties \| ((state: DrawerTriggerState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `handle` — A handle to associate the trigger with a drawer. Can be created with the Drawer.createHandle() method.
- `id` — ID of the trigger. In addition to being forwarded to the rendered element, it is also used to specify the active trigger for drawers in controlled mode (with the Drawer.Root `triggerId` prop).
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `false` if the rendered element is not a button (for example, `<div>`).
- `payload` — A payload to pass to the drawer when it is opened.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## DrawerViewport

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: DrawerViewportState) => string \| undefined) \| undefined` | — |
| position | `DrawerPosition \| undefined` | — |
| style | `CSSProperties \| ((state: DrawerViewportState) => CSSProperties \| undefined) \| undefined` | — |
| variant | `"default" \| "straight" \| "inset" \| undefined` | `"default"` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

Required props are bold. Full docs: https://ui.xiod.dev/docs
