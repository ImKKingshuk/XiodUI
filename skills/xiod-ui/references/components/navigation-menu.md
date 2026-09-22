# navigation-menu

```tsx
import { NavigationMenu, NavigationMenuContent, NavigationMenuIcon, NavigationMenuIndicator, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuPopup, NavigationMenuPortal, NavigationMenuTrigger, NavigationMenuViewport } from "xiod-ui/navigation-menu";
```

## NavigationMenu

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| actionsRef | `RefObject<NavigationMenuRootActions \| null> \| undefined` | — |
| className | `string \| ((state: NavigationMenuRootState) => string \| undefined) \| undefined` | — |
| closeDelay | `number \| undefined` | — |
| defaultValue | `any` | — |
| delay | `number \| undefined` | — |
| onOpenChangeComplete | `((open: boolean) => void) \| undefined` | — |
| onValueChange | `((value: any, eventDetails: NavigationMenuRootChangeEventDetails) => void) \| undefined` | — |
| orientation | `"horizontal" \| "vertical" \| undefined` | — |
| style | `CSSProperties \| ((state: NavigationMenuRootState) => CSSProperties \| undefined) \| undefined` | — |
| value | `any` | — |

- `actionsRef` — A ref to imperative actions.
- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `closeDelay` — How long to wait before closing the navigation popup. Specified in milliseconds.
- `defaultValue` — The uncontrolled value of the item that should be initially selected. To render a controlled navigation menu, use the `value` prop instead.
- `delay` — How long to wait before opening the navigation popup. Specified in milliseconds.
- `onOpenChangeComplete` — Event handler called after any animations complete when the navigation menu is closed.
- `onValueChange` — Callback fired when the value changes.
- `orientation` — The orientation of the navigation menu.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `value` — The controlled value of the navigation menu item that should be currently open. When non-nullish, the menu will be open. When nullish, the menu will be closed. To render an uncontrolled navigation menu, use the `defaultValue` prop instead.

## NavigationMenuContent

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: NavigationMenuContentState) => string \| undefined) \| undefined` | — |
| keepMounted | `boolean \| undefined` | — |
| style | `CSSProperties \| ((state: NavigationMenuContentState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `keepMounted` — Whether to keep the content mounted in the DOM while the popup is closed. Ensures the content is present during server-side rendering for web crawlers.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## NavigationMenuIcon

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: NavigationMenuIconState) => string \| undefined) \| undefined` | — |
| style | `CSSProperties \| ((state: NavigationMenuIconState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## NavigationMenuIndicator

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## NavigationMenuItem

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: NavigationMenuItemState) => string \| undefined) \| undefined` | — |
| style | `CSSProperties \| ((state: NavigationMenuItemState) => CSSProperties \| undefined) \| undefined` | — |
| value | `any` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `value` — A unique value that identifies this navigation menu item. If no value is provided, a unique ID will be generated automatically. Use when controlling the navigation menu programmatically.

## NavigationMenuLink

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| active | `boolean \| undefined` | — |

## NavigationMenuList

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: NavigationMenuListState) => string \| undefined) \| undefined` | — |
| style | `CSSProperties \| ((state: NavigationMenuListState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## NavigationMenuPopup

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| align | `Align \| undefined` | `"center"` |
| alignOffset | `number \| OffsetFunction \| undefined` | — |
| anchor | `Element \| VirtualElement \| RefObject<Element \| null> \| (() => Element \| VirtualElement \| null) \| null \| undefined` | — |
| className | `string \| ((state: NavigationMenuPopupState) => string \| undefined) \| undefined` | — |
| hideArrow | `boolean \| undefined` | `false` |
| side | `Side \| undefined` | `"bottom"` |
| sideOffset | `number \| OffsetFunction \| undefined` | `10` |
| style | `CSSProperties \| ((state: NavigationMenuPopupState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## NavigationMenuPortal

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: NavigationMenuPortalState) => string \| undefined) \| undefined` | — |
| container | `HTMLElement \| ShadowRoot \| RefObject<HTMLElement \| ShadowRoot \| null> \| null \| undefined` | — |
| keepMounted | `boolean \| undefined` | — |
| style | `CSSProperties \| ((state: NavigationMenuPortalState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `container` — A parent element to render the portal element into.
- `keepMounted` — Whether to keep the portal mounted in the DOM while the popup is hidden.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## NavigationMenuTrigger

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: NavigationMenuTriggerState) => string \| undefined) \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| nativeButton | `boolean \| undefined` | — |
| style | `CSSProperties \| ((state: NavigationMenuTriggerState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `disabled` — Whether the component should ignore user interaction.
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `false` if the rendered element is not a button (for example, `<div>`).
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## NavigationMenuViewport

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: NavigationMenuViewportState) => string \| undefined) \| undefined` | — |
| style | `CSSProperties \| ((state: NavigationMenuViewportState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

Required props are bold. Full docs: https://ui.xiod.dev/docs
