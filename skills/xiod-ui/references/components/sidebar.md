# Sidebar

```tsx
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInput, SidebarInset, SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger, useSidebar } from "xiod-ui/sidebar";
```

## Sidebar

Renders a `<div>` and takes its props.

| Prop | Type | Default |
| :--- | :--- | :--- |
| collapsible | `"none" \| "icon" \| "offcanvas" \| undefined` | `"offcanvas"` |
| side | `"left" \| "right" \| undefined` | `"left"` |
| variant | `"modal" \| "inset" \| "sidebar" \| "floating" \| undefined` | `"sidebar"` |

## SidebarContent

Renders a `<div>` and takes its props.

## SidebarFooter

Renders a `<div>` and takes its props. Pass `render` to render a different element.

## SidebarGroup

Renders a `<div>` and takes its props. Pass `render` to render a different element.

## SidebarGroupAction

Renders a `<button>` and takes its props. Pass `render` to render a different element.

## SidebarGroupContent

Renders a `<div>` and takes its props. Pass `render` to render a different element.

## SidebarGroupLabel

Renders a `<div>` and takes its props. Pass `render` to render a different element.

## SidebarHeader

Renders a `<div>` and takes its props. Pass `render` to render a different element.

## SidebarInput

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| undefined` |
| defaultValue | `string \| number \| readonly string[] \| undefined` |
| nativeInput | `boolean \| undefined` |
| onValueChange | `((value: string, eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element \| undefined; }) => void) \| undefined` |
| size | `number \| "sm" \| "default" \| "lg" \| undefined` |
| style | `CSSProperties \| undefined` |
| unstyled | `boolean \| undefined` |
| value | `string \| number \| readonly string[] \| undefined` |

- `defaultValue` — The default value of the input. Use when uncontrolled.
- `onValueChange` — Callback fired when the `value` changes. Use when controlled.
- `value` — The value of the input. Use when controlled.

## SidebarInset

Renders a `<main>` and takes its props. Pass `render` to render a different element.

## SidebarMenu

Renders a `<ul>` and takes its props. Pass `render` to render a different element.

## SidebarMenuAction

Renders a `<button>` and takes its props. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| showOnHover | `boolean \| undefined` | `false` |

## SidebarMenuBadge

Renders a `<div>` and takes its props. Pass `render` to render a different element.

## SidebarMenuButton

Renders a `<button>` and takes its props. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| isActive | `boolean \| undefined` | `false` |
| size | `"sm" \| "default" \| "lg" \| null \| undefined` | `"default"` |
| tooltip | `string \| (TooltipPopupProps & { align?: Align \| undefined; side?: Side \| undefined; sideOffset?: number \| OffsetFunction \| undefined; anchor?: Element \| ... 4 more ... \| undefined; hideArrow?: boolean \| undefined; }) \| undefined` | — |
| variant | `"default" \| "outline" \| null \| undefined` | `"default"` |

## SidebarMenuItem

Renders a `<li>` and takes its props. Pass `render` to render a different element.

## SidebarMenuSkeleton

Renders a `<div>` and takes its props. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| showIcon | `boolean \| undefined` | `false` |

## SidebarMenuSub

Renders a `<ul>` and takes its props. Pass `render` to render a different element.

## SidebarMenuSubButton

Renders a `<a>` and takes its props. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| isActive | `boolean \| undefined` | `false` |
| size | `"sm" \| "md" \| undefined` | `"md"` |

## SidebarMenuSubItem

Renders a `<li>` and takes its props. Pass `render` to render a different element.

## SidebarProvider

Renders a `<div>` and takes its props.

| Prop | Type | Default |
| :--- | :--- | :--- |
| defaultOpen | `boolean \| undefined` | `true` |
| onOpenChange | `((open: boolean) => void) \| undefined` | — |
| open | `boolean \| undefined` | — |

## SidebarRail

Renders a `<button>` and takes its props. Pass `render` to render a different element.

## SidebarSeparator

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: SeparatorState) => string \| undefined) \| undefined` |
| orientation | `Orientation \| undefined` |
| style | `CSSProperties \| ((state: SeparatorState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `orientation` — The orientation of the separator.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## SidebarTrigger

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| icon | `ReactNode` |
| size | `"sm" \| "default" \| "lg" \| "xs" \| "xl" \| "icon" \| "icon-lg" \| "icon-sm" \| "icon-xl" \| "icon-xs" \| null \| undefined` |
| variant | `"link" \| "default" \| "secondary" \| "destructive" \| "destructive-outline" \| "ghost" \| "outline" \| null \| undefined` |

- `icon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.

## useSidebar

```tsx
useSidebar()
```

Returns `{ state: "expanded" | "collapsed"; open: boolean; setOpen: (open: boolean) => void; openMobile: boolean; setOpenMobile: (open: boolean) => void; isMobile: boolean; toggleSidebar: () => void }`.

Required props are bold. Full docs: https://ui.xiod.dev/docs
