# Pagination

```tsx
import { Pagination, PaginationContent, PaginationEllipsis, PaginationFirst, PaginationInput, PaginationItem, PaginationLast, PaginationLink, PaginationNext, PaginationPrevious } from "xiod-ui/pagination";
```

## Pagination

Renders a `<nav>` and takes its props. Pass `render` to render a different element.

## PaginationContent

Renders a `<ul>` and takes its props. Pass `render` to render a different element.

## PaginationEllipsis

Renders a `<span>` and takes its props. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| icon | `ReactNode` |

- `icon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.

## PaginationFirst

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| icon | `ReactNode` |
| isActive | `boolean \| undefined` |
| size | `"sm" \| "default" \| "lg" \| "xs" \| "xl" \| "icon" \| "icon-lg" \| "icon-sm" \| "icon-xl" \| "icon-xs" \| null \| undefined` |

- `icon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.

## PaginationInput

| Prop | Type |
| :--- | :--- |
| onChange | `((page: number) => void) \| undefined` |
| totalPages | `number \| undefined` |
| value | `number \| undefined` |

## PaginationItem

Renders a `<li>` and takes its props. Pass `render` to render a different element.

## PaginationLast

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| icon | `ReactNode` |
| isActive | `boolean \| undefined` |
| size | `"sm" \| "default" \| "lg" \| "xs" \| "xl" \| "icon" \| "icon-lg" \| "icon-sm" \| "icon-xl" \| "icon-xs" \| null \| undefined` |

- `icon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.

## PaginationLink

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| isActive | `boolean \| undefined` | — |
| size | `"sm" \| "default" \| "lg" \| "xs" \| "xl" \| "icon" \| "icon-lg" \| "icon-sm" \| "icon-xl" \| "icon-xs" \| null \| undefined` | `"icon"` |

## PaginationNext

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| icon | `ReactNode` |
| isActive | `boolean \| undefined` |
| size | `"sm" \| "default" \| "lg" \| "xs" \| "xl" \| "icon" \| "icon-lg" \| "icon-sm" \| "icon-xl" \| "icon-xs" \| null \| undefined` |

- `icon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.

## PaginationPrevious

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| icon | `ReactNode` |
| isActive | `boolean \| undefined` |
| size | `"sm" \| "default" \| "lg" \| "xs" \| "xl" \| "icon" \| "icon-lg" \| "icon-sm" \| "icon-xl" \| "icon-xs" \| null \| undefined` |

- `icon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.

Required props are bold. Full docs: https://ui.xiod.dev/docs
