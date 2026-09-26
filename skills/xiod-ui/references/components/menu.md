# Menu

```tsx
import { Menu, MenuArrow, MenuCheckboxItem, MenuCreateHandle, MenuGroup, MenuGroupLabel, MenuItem, MenuPopup, MenuPortal, MenuRadioGroup, MenuRadioItem, MenuSeparator, MenuShortcut, MenuSub, MenuSubPopup, MenuSubTrigger, MenuTrigger } from "xiod-ui/menu";
```

## Menu

| Prop | Type |
| :--- | :--- |
| actionsRef | `RefObject<MenuRootActions \| null> \| undefined` |
| children | `ReactNode \| PayloadChildRenderFunction<Payload>` |
| closeParentOnEsc | `boolean \| undefined` |
| defaultOpen | `boolean \| undefined` |
| defaultTriggerId | `string \| null \| undefined` |
| disabled | `boolean \| undefined` |
| handle | `MenuHandle<Payload> \| undefined` |
| highlightItemOnHover | `boolean \| undefined` |
| loopFocus | `boolean \| undefined` |
| modal | `boolean \| undefined` |
| onOpenChange | `((open: boolean, eventDetails: MenuRootChangeEventDetails) => void) \| undefined` |
| onOpenChangeComplete | `((open: boolean) => void) \| undefined` |
| open | `boolean \| undefined` |
| orientation | `MenuRootOrientation \| undefined` |
| triggerId | `string \| null \| undefined` |

- `actionsRef` — A ref to imperative actions.
  - `unmount`: Manually unmounts the menu. Call this after any externally controlled closing animation finishes.
  - `close`: When specified, the menu can be closed imperatively.
- `children` — The content of the menu. This can be a regular React node or a render function that receives the `payload` of the active trigger.
- `closeParentOnEsc` — When in a submenu, determines whether pressing the Escape key closes the entire menu, or only the current child menu.
- `defaultOpen` — Whether the menu is initially open.
  To render a controlled menu, use the `open` prop instead.
- `defaultTriggerId` — ID of the trigger that the menu is associated with. This is useful in conjunction with the `defaultOpen` prop to create an initially open menu.
- `disabled` — Whether the component should ignore user interaction.
- `handle` — A handle to associate the menu with a trigger. If specified, allows external triggers to control the menu's open state.
- `highlightItemOnHover` — Whether moving the pointer over items should highlight them. Disabling this prop allows CSS `:hover` to be differentiated from the `:focus` (`data-highlighted`) state.
- `loopFocus` — Whether to loop keyboard focus back to the first item when the end of the list is reached while using the arrow keys.
- `modal` — Determines if the menu enters a modal state when open.
  - `true`: user interaction is limited to the menu: document page scroll is locked and pointer interactions on outside elements are disabled.
  - `false`: user interaction with the rest of the document is allowed.
  On touch devices, a `true` modal blocks outside taps but leaves the page scrollable unless the popup spans nearly the full viewport width, matching native iOS behavior.
  Nested menus ignore this prop, and menus opened by hover are never modal.
- `onOpenChange` — Event handler called when the menu is opened or closed.
- `onOpenChangeComplete` — Event handler called after any animations complete when the menu is opened or closed.
- `open` — Whether the menu is currently open.
- `orientation` — The visual orientation of the menu. Controls whether roving focus uses up/down or left/right arrow keys.
- `triggerId` — ID of the trigger that the menu is associated with. This is useful in conjunction with the `open` prop to create a controlled menu. There's no need to specify this prop when the menu is uncontrolled (that is, when the `open` prop is not set).

## MenuArrow

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: MenuArrowState) => string \| undefined) \| undefined` |
| style | `CSSProperties \| ((state: MenuArrowState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## MenuCheckboxItem

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| checked | `boolean \| undefined` | — |
| className | `string \| ((state: MenuCheckboxItemState) => string \| undefined) \| undefined` | — |
| closeOnClick | `boolean \| undefined` | — |
| defaultChecked | `boolean \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| id | `string \| undefined` | — |
| label | `string \| undefined` | — |
| nativeButton | `boolean \| undefined` | — |
| onCheckedChange | `((checked: boolean, eventDetails: MenuRootChangeEventDetails) => void) \| undefined` | — |
| onClick | `((event: BaseUIEvent<MouseEvent<HTMLDivElement, MouseEvent>>) => void) \| undefined` | — |
| style | `CSSProperties \| ((state: MenuCheckboxItemState) => CSSProperties \| undefined) \| undefined` | — |
| variant | `"switch" \| "default" \| undefined` | `"default"` |

- `checked` — Whether the checkbox item is currently ticked.
  To render an uncontrolled checkbox item, use the `defaultChecked` prop instead.
- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `closeOnClick` — Whether to close the menu when the item is clicked.
- `defaultChecked` — Whether the checkbox item is initially ticked.
  To render a controlled checkbox item, use the `checked` prop instead.
- `disabled` — Whether the component should ignore user interaction.
- `label` — Overrides the text label to use when the item is matched during keyboard text navigation.
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `true` if the rendered element is a native button.
- `onCheckedChange` — Event handler called when the checkbox item is ticked or unticked.
- `onClick` — The click handler for the menu item.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## MenuCreateHandle

A function, not a component. It creates a handle that connects triggers
to a `Menu` they are not nested in:

```tsx
const handle = MenuCreateHandle();

<Menu handle={handle}>…</Menu>
<MenuTrigger handle={handle}>Open</MenuTrigger>
```

Create it outside render, once per instance.

## MenuGroup

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| children | `ReactNode` |
| className | `string \| ((state: MenuGroupState) => string \| undefined) \| undefined` |
| style | `CSSProperties \| ((state: MenuGroupState) => CSSProperties \| undefined) \| undefined` |

- `children` — The content of the component.
- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## MenuGroupLabel

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: MenuGroupLabelState) => string \| undefined) \| undefined` |
| inset | `boolean \| undefined` |
| style | `CSSProperties \| ((state: MenuGroupLabelState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## MenuItem

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: MenuItemState) => string \| undefined) \| undefined` | — |
| closeOnClick | `boolean \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| id | `string \| undefined` | — |
| inset | `boolean \| undefined` | — |
| label | `string \| undefined` | — |
| nativeButton | `boolean \| undefined` | — |
| onClick | `((event: BaseUIEvent<MouseEvent<HTMLDivElement, MouseEvent>>) => void) \| undefined` | — |
| style | `CSSProperties \| ((state: MenuItemState) => CSSProperties \| undefined) \| undefined` | — |
| variant | `"default" \| "destructive" \| undefined` | `"default"` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `closeOnClick` — Whether to close the menu when the item is clicked.
- `disabled` — Whether the component should ignore user interaction.
- `label` — Overrides the text label to use when the item is matched during keyboard text navigation.
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `true` if the rendered element is a native button.
- `onClick` — The click handler for the menu item.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## MenuPopup

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| align | `Align \| undefined` | `"center"` |
| alignOffset | `number \| OffsetFunction \| undefined` | — |
| anchor | `Element \| VirtualElement \| RefObject<Element \| null> \| (() => Element \| VirtualElement \| null) \| null \| undefined` | — |
| children | `ReactNode` | — |
| className | `string \| ((state: MenuPopupState) => string \| undefined) \| undefined` | — |
| finalFocus | `boolean \| RefObject<HTMLElement \| null> \| ((closeType: InteractionType) => boolean \| void \| HTMLElement \| null) \| undefined` | — |
| hideArrow | `boolean \| undefined` | `false` |
| id | `string \| undefined` | — |
| side | `Side \| undefined` | `"bottom"` |
| sideOffset | `number \| OffsetFunction \| undefined` | `8` |
| style | `CSSProperties \| ((state: MenuPopupState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `finalFocus` — Determines the element to focus when the menu is closed.
  - `false`: Do not move focus.
  - `true`: Move focus based on the default behavior (trigger or previously focused element).
  - `RefObject`: Move focus to the ref element.
  - `function`: Called with the interaction type (`mouse`, `touch`, `pen`, or `keyboard`). Return an element to focus, `true` to use the default behavior, or `false`/`undefined` to do nothing.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## MenuPortal

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: MenuPortalState) => string \| undefined) \| undefined` |
| container | `HTMLElement \| ShadowRoot \| RefObject<HTMLElement \| ShadowRoot \| null> \| null \| undefined` |
| keepMounted | `boolean \| undefined` |
| style | `CSSProperties \| ((state: MenuPortalState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `container` — A parent element to render the portal element into.
- `keepMounted` — Whether to keep the portal mounted in the DOM while the popup is hidden.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## MenuRadioGroup

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| children | `ReactNode` |
| className | `string \| ((state: MenuRadioGroupState) => string \| undefined) \| undefined` |
| defaultValue | `any` |
| disabled | `boolean \| undefined` |
| onValueChange | `((value: any, eventDetails: MenuRootChangeEventDetails) => void) \| undefined` |
| style | `CSSProperties \| ((state: MenuRadioGroupState) => CSSProperties \| undefined) \| undefined` |
| value | `any` |

- `children` — The content of the component.
- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `defaultValue` — The uncontrolled value of the radio item that should be initially selected.
  To render a controlled radio group, use the `value` prop instead.
- `disabled` — Whether the component should ignore user interaction.
- `onValueChange` — Function called when the selected value changes.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `value` — The controlled value of the radio item that should be currently selected.
  To render an uncontrolled radio group, use the `defaultValue` prop instead.

## MenuRadioItem

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: MenuRadioItemState) => string \| undefined) \| undefined` |
| closeOnClick | `boolean \| undefined` |
| disabled | `boolean \| undefined` |
| id | `string \| undefined` |
| label | `string \| undefined` |
| nativeButton | `boolean \| undefined` |
| onClick | `((event: BaseUIEvent<MouseEvent<HTMLDivElement, MouseEvent>>) => void) \| undefined` |
| style | `CSSProperties \| ((state: MenuRadioItemState) => CSSProperties \| undefined) \| undefined` |
| **value** | `any` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `closeOnClick` — Whether to close the menu when the item is clicked.
- `disabled` — Whether the component should ignore user interaction.
- `label` — Overrides the text label to use when the item is matched during keyboard text navigation.
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `true` if the rendered element is a native button.
- `onClick` — The click handler for the menu item.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `value` — Value of the radio item. This is the value that will be set in the MenuRadioGroup when the item is selected.

## MenuSeparator

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: SeparatorState) => string \| undefined) \| undefined` |
| orientation | `Orientation \| undefined` |
| style | `CSSProperties \| ((state: SeparatorState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `orientation` — The orientation of the separator.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## MenuShortcut

Renders a `<kbd>` and takes its props. Pass `render` to render a different element.

## MenuSub

| Prop | Type |
| :--- | :--- |
| actionsRef | `RefObject<MenuRootActions \| null> \| undefined` |
| children | `ReactNode` |
| closeParentOnEsc | `boolean \| undefined` |
| defaultOpen | `boolean \| undefined` |
| disabled | `boolean \| undefined` |
| highlightItemOnHover | `boolean \| undefined` |
| loopFocus | `boolean \| undefined` |
| onOpenChange | `((open: boolean, eventDetails: MenuRootChangeEventDetails) => void) \| undefined` |
| onOpenChangeComplete | `((open: boolean) => void) \| undefined` |
| open | `boolean \| undefined` |
| orientation | `MenuRootOrientation \| undefined` |

- `actionsRef` — A ref to imperative actions.
  - `unmount`: Manually unmounts the menu. Call this after any externally controlled closing animation finishes.
  - `close`: When specified, the menu can be closed imperatively.
- `children` — The content of the submenu.
- `closeParentOnEsc` — When in a submenu, determines whether pressing the Escape key closes the entire menu, or only the current child menu.
- `defaultOpen` — Whether the menu is initially open.
  To render a controlled menu, use the `open` prop instead.
- `disabled` — Whether the component should ignore user interaction.
- `highlightItemOnHover` — Whether moving the pointer over items should highlight them. Disabling this prop allows CSS `:hover` to be differentiated from the `:focus` (`data-highlighted`) state.
- `loopFocus` — Whether to loop keyboard focus back to the first item when the end of the list is reached while using the arrow keys.
- `onOpenChange` — Event handler called when the menu is opened or closed.
- `onOpenChangeComplete` — Event handler called after any animations complete when the menu is opened or closed.
- `open` — Whether the menu is currently open.
- `orientation` — The visual orientation of the menu. Controls whether roving focus uses up/down or left/right arrow keys.

## MenuSubPopup

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| align | `Align \| undefined` | `"start"` |
| alignOffset | `number \| OffsetFunction \| undefined` | — |
| children | `ReactNode` | — |
| className | `string \| ((state: MenuPopupState) => string \| undefined) \| undefined` | — |
| finalFocus | `boolean \| RefObject<HTMLElement \| null> \| ((closeType: InteractionType) => boolean \| void \| HTMLElement \| null) \| undefined` | — |
| id | `string \| undefined` | — |
| sideOffset | `number \| OffsetFunction \| undefined` | `0` |
| style | `CSSProperties \| ((state: MenuPopupState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `finalFocus` — Determines the element to focus when the menu is closed.
  - `false`: Do not move focus.
  - `true`: Move focus based on the default behavior (trigger or previously focused element).
  - `RefObject`: Move focus to the ref element.
  - `function`: Called with the interaction type (`mouse`, `touch`, `pen`, or `keyboard`). Return an element to focus, `true` to use the default behavior, or `false`/`undefined` to do nothing.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## MenuSubTrigger

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: MenuSubmenuTriggerState) => string \| undefined) \| undefined` |
| closeDelay | `number \| undefined` |
| delay | `number \| undefined` |
| disabled | `boolean \| undefined` |
| icon | `ReactNode` |
| id | `string \| undefined` |
| inset | `boolean \| undefined` |
| label | `string \| undefined` |
| nativeButton | `boolean \| undefined` |
| onClick | `((event: BaseUIEvent<MouseEvent<HTMLDivElement, MouseEvent>>) => void) \| undefined` |
| openOnHover | `boolean \| undefined` |
| style | `CSSProperties \| ((state: MenuSubmenuTriggerState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `closeDelay` — How long to wait before closing the menu that was opened on hover. Specified in milliseconds.
  Requires the `openOnHover` prop.
- `delay` — How long to wait before the menu may be opened on hover. Specified in milliseconds.
  Requires the `openOnHover` prop.
- `disabled` — Whether the component should ignore user interaction.
- `icon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `label` — Overrides the text label to use when the item is matched during keyboard text navigation.
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `true` if the rendered element is a native button.
- `openOnHover` — Whether the menu should also open when the trigger is hovered.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## MenuTrigger

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| children | `ReactNode` |
| className | `string \| ((state: MenuTriggerState) => string \| undefined) \| undefined` |
| closeDelay | `number \| undefined` |
| delay | `number \| undefined` |
| disabled | `boolean \| undefined` |
| handle | `MenuHandle<unknown> \| undefined` |
| nativeButton | `boolean \| undefined` |
| openOnHover | `boolean \| undefined` |
| payload | `unknown` |
| style | `CSSProperties \| ((state: MenuTriggerState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `closeDelay` — How long to wait before closing the menu that was opened on hover. Specified in milliseconds.
  Requires the `openOnHover` prop.
- `delay` — How long to wait before the menu may be opened on hover. Specified in milliseconds.
  Requires the `openOnHover` prop.
- `disabled` — Whether the component should ignore user interaction.
- `handle` — A handle to associate the trigger with a menu.
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `false` if the rendered element is not a button (for example, `<div>`).
- `openOnHover` — Whether the menu should also open when the trigger is hovered.
- `payload` — A payload to pass to the menu when it is opened.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

Required props are bold. Full docs: https://ui.xiod.dev/docs
