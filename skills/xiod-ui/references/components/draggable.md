# Draggable

```tsx
import { Draggable, DraggableBody, DraggableControls, DraggableFooter, DraggableHeader, DraggableResizeHandle, DraggableTitle } from "xiod-ui/draggable";
```

## Draggable

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| bounds | `DraggableBounds \| undefined` | `"viewport"` |
| defaultHeight | `number \| undefined` | `300` |
| defaultOpen | `boolean \| undefined` | `true` |
| defaultWidth | `number \| undefined` | `360` |
| defaultX | `number \| undefined` | `40` |
| defaultY | `number \| undefined` | `40` |
| isDraggable | `boolean \| undefined` | `true` |
| isDragging | `boolean \| null \| undefined` | `false` |
| isMinimized | `boolean \| null \| undefined` | `false` |
| isResizable | `boolean \| undefined` | `true` |
| isResizing | `boolean \| null \| undefined` | `false` |
| maxHeight | `number \| undefined` | `600` |
| maxWidth | `number \| undefined` | `800` |
| minHeight | `number \| undefined` | `160` |
| minWidth | `number \| undefined` | `240` |
| onOpenChange | `((open: boolean) => void) \| undefined` | — |
| open | `boolean \| undefined` | — |
| variant | `"default" \| "expressive" \| "flat" \| null \| undefined` | `"default"` |

## DraggableBody

Takes the DOM props of the element it renders. Pass `render` to render a different element.

## DraggableControls

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| closeIcon | `ReactNode` |
| maximizeIcon | `ReactNode` |
| minimizeIcon | `ReactNode` |
| restoreIcon | `ReactNode` |

- `closeIcon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `maximizeIcon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `minimizeIcon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `restoreIcon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.

## DraggableFooter

Takes the DOM props of the element it renders. Pass `render` to render a different element.

## DraggableHeader

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| icon | `ReactNode` |

- `icon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.

## DraggableResizeHandle

Takes the DOM props of the element it renders. Pass `render` to render a different element.

## DraggableTitle

Takes the DOM props of the element it renders. Pass `render` to render a different element.

Required props are bold. Full docs: https://ui.xiod.dev/docs
