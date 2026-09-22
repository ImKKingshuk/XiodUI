# sidebar

```tsx
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInput, SidebarInset, SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger, useSidebar } from "xiod-ui/sidebar";
```

## Sidebar

| Prop | Type | Default |
| :--- | :--- | :--- |
| collapsible | `"none" \| "icon" \| "offcanvas" \| undefined` | `"offcanvas"` |
| side | `"left" \| "right" \| undefined` | `"left"` |
| variant | `"modal" \| "inset" \| "sidebar" \| "floating" \| undefined` | `"sidebar"` |

## SidebarContent

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## SidebarFooter

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## SidebarGroup

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## SidebarGroupAction

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## SidebarGroupContent

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## SidebarGroupLabel

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## SidebarHeader

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## SidebarInput

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| undefined` | — |
| defaultValue | `string \| number \| readonly string[] \| undefined` | — |
| nativeInput | `boolean \| undefined` | — |
| onValueChange | `((value: string, eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element \| undefined; }) => void) \| undefined` | — |
| size | `number \| "sm" \| "default" \| "lg" \| undefined` | — |
| style | `CSSProperties \| undefined` | — |
| unstyled | `boolean \| undefined` | — |
| value | `string \| number \| readonly string[] \| undefined` | — |

- `defaultValue` — The default value of the input. Use when uncontrolled.
- `onValueChange` — Callback fired when the `value` changes. Use when controlled.
- `value` — The value of the input. Use when controlled.

## SidebarInset

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## SidebarMenu

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## SidebarMenuAction

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| showOnHover | `boolean \| undefined` | `false` |

## SidebarMenuBadge

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## SidebarMenuButton

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| isActive | `boolean \| undefined` | `false` |
| size | `"sm" \| "default" \| "lg" \| null \| undefined` | `"default"` |
| tooltip | `string \| (TooltipPopupProps & { align?: Align \| undefined; side?: Side \| undefined; sideOffset?: number \| OffsetFunction \| undefined; anchor?: Element \| ... 4 more ... \| undefined; hideArrow?: boolean \| undefined; }) \| undefined` | — |
| variant | `"default" \| "outline" \| null \| undefined` | `"default"` |

## SidebarMenuItem

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## SidebarMenuSkeleton

| Prop | Type | Default |
| :--- | :--- | :--- |
| showIcon | `boolean \| undefined` | `false` |

## SidebarMenuSub

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## SidebarMenuSubButton

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| isActive | `boolean \| undefined` | `false` |
| size | `"sm" \| "md" \| undefined` | `"md"` |

## SidebarMenuSubItem

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## SidebarProvider

| Prop | Type | Default |
| :--- | :--- | :--- |
| defaultOpen | `boolean \| undefined` | `true` |
| onOpenChange | `((open: boolean) => void) \| undefined` | — |
| open | `boolean \| undefined` | — |

## SidebarRail

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## SidebarSeparator

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: SeparatorState) => string \| undefined) \| undefined` | — |
| orientation | `Orientation \| undefined` | — |
| style | `CSSProperties \| ((state: SeparatorState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `orientation` — The orientation of the separator.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## SidebarTrigger

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| size | `"sm" \| "default" \| "lg" \| "xs" \| "xl" \| "icon" \| "icon-lg" \| "icon-sm" \| "icon-xl" \| "icon-xs" \| null \| undefined` | — |
| variant | `"link" \| "default" \| "secondary" \| "destructive" \| "destructive-outline" \| "ghost" \| "outline" \| null \| undefined` | — |

## useSidebar

This hook accepts no arguments.

Required props are bold. Full docs: https://ui.xiod.dev/docs
