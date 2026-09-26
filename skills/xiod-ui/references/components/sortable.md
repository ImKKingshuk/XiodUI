# Sortable

```tsx
import { Sortable, SortableColumn, SortableColumnHeader, SortableColumnTitle, SortableItem, SortableItemHandle, SortableItemRemove } from "xiod-ui/sortable";
```

## Sortable

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| handleIcon | `ReactNode` | — |
| **items** | `string[]` | — |
| onRemove | `((id: string) => void) \| undefined` | — |
| **onReorder** | `(newItems: string[]) => void` | — |
| orientation | `SortableOrientation \| undefined` | `"vertical"` |
| variant | `"default" \| "ghost" \| "bordered" \| null \| undefined` | `"default"` |

- `handleIcon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.

## SortableColumn

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| **id** | `string` |

## SortableColumnHeader

Takes the DOM props of the element it renders. Pass `render` to render a different element.

## SortableColumnTitle

Takes the DOM props of the element it renders. Pass `render` to render a different element.

## SortableItem

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| **id** | `string` | — |
| isDragging | `boolean \| null \| undefined` | `false` |
| isHoveredTarget | `boolean \| null \| undefined` | `false` |
| isKeyboardActive | `boolean \| null \| undefined` | `false` |
| variant | `"default" \| "flat" \| "accent" \| null \| undefined` | `"default"` |

## SortableItemHandle

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| icon | `ReactNode` |
| id | `string \| undefined` |

- `icon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.

## SortableItemRemove

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| icon | `ReactNode` |
| **id** | `string` |

- `icon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.

Required props are bold. Full docs: https://ui.xiod.dev/docs
