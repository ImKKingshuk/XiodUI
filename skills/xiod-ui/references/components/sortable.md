# sortable

```tsx
import { Sortable, SortableColumn, SortableColumnHeader, SortableColumnTitle, SortableItem, SortableItemHandle, SortableItemRemove } from "xiod-ui/sortable";
```

## Sortable

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

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

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| **id** | `string` | — |

## SortableColumnHeader

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## SortableColumnTitle

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## SortableItem

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| **id** | `string` | — |
| isDragging | `boolean \| null \| undefined` | `false` |
| isHoveredTarget | `boolean \| null \| undefined` | `false` |
| isKeyboardActive | `boolean \| null \| undefined` | `false` |
| variant | `"default" \| "flat" \| "accent" \| null \| undefined` | `"default"` |

## SortableItemHandle

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| icon | `ReactNode` | — |
| id | `string \| undefined` | — |

- `icon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.

## SortableItemRemove

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| icon | `ReactNode` | — |
| **id** | `string` | — |

- `icon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.

Required props are bold. Full docs: https://ui.xiod.dev/docs
