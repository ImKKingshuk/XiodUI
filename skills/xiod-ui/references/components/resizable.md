# Resizable

```tsx
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "xiod-ui/resizable";
```

## ResizableHandle

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| disabled | `boolean \| undefined` | `false` |
| disableDoubleClick | `boolean \| undefined` | `false` |
| icon | `ReactNode` | — |
| withHandle | `boolean \| undefined` | `false` |

- `icon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.

## ResizablePanel

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| collapsedSize | `string \| number \| undefined` | `"0%"` |
| collapsible | `boolean \| undefined` | `false` |
| defaultSize | `string \| number \| undefined` | — |
| disabled | `boolean \| undefined` | `false` |
| groupResizeBehavior | `"preserve-relative-size" \| "preserve-pixel-size" \| undefined` | `"preserve-relative-size"` |
| id | `string \| undefined` | — |
| maxSize | `string \| number \| undefined` | `"100%"` |
| minSize | `string \| number \| undefined` | `"0%"` |
| onCollapse | `(() => void) \| undefined` | — |
| onExpand | `(() => void) \| undefined` | — |
| onResize | `((size: { asPercentage: number; inPixels: number; }) => void) \| undefined` | — |
| panelRef | `RefObject<ImperativePanelHandle \| null> \| undefined` | — |

## ResizablePanelGroup

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| defaultLayout | `(string \| number)[] \| undefined` | — |
| direction | `"horizontal" \| "vertical" \| undefined` | `"horizontal"` |
| disabled | `boolean \| undefined` | `false` |
| groupRef | `RefObject<ImperativeGroupHandle \| null> \| undefined` | — |
| onLayoutChange | `((layout: number[]) => void) \| undefined` | — |
| onLayoutChanged | `((layout: number[]) => void) \| undefined` | — |
| storage | `{ getItem: (key: string) => string \| null; setItem: (key: string, value: string) => void; } \| undefined` | — |
| storageKey | `string \| undefined` | — |

Required props are bold. Full docs: https://ui.xiod.dev/docs
