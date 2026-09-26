# DashboardGrid

```tsx
import { DashboardGrid, DashboardTile, DashboardTileControls, DashboardTileHandle, DashboardTileHeader, DashboardTileResizeHandle, DashboardTileTitle } from "xiod-ui/dashboard-grid";
```

## DashboardGrid

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| breakpoints | `Breakpoints \| undefined` | `defaultBreakpoints` |
| cols | `number \| BreakpointCols \| undefined` | `12` |
| compactType | `CompactType \| undefined` | `"vertical"` |
| containerPadding | `[number, number] \| undefined` | `DEFAULT_CONTAINER_PADDING` |
| isDraggable | `boolean \| undefined` | `true` |
| isResizable | `boolean \| undefined` | `true` |
| **layout** | `DashboardTileData[]` | — |
| margin | `[number, number] \| undefined` | `DEFAULT_GRID_MARGIN` |
| onLayoutChange | `((layout: DashboardTileData[]) => void) \| undefined` | — |
| onTileRemove | `((id: string) => void) \| undefined` | — |
| preventCollision | `boolean \| undefined` | `false` |
| rowHeight | `number \| undefined` | `60` |
| showGridLines | `boolean \| undefined` | `false` |
| variant | `"canvas" \| "default" \| "ghost" \| "bordered" \| null \| undefined` | `"default"` |

## DashboardTile

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| **id** | `string` | — |
| isDragging | `boolean \| null \| undefined` | `false` |
| isResizing | `boolean \| null \| undefined` | `false` |
| isStatic | `boolean \| null \| undefined` | `false` |
| variant | `"default" \| "expressive" \| "flat" \| null \| undefined` | `"default"` |

## DashboardTileControls

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| icon | `ReactNode` |
| id | `string \| undefined` |

- `icon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.

## DashboardTileHandle

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| icon | `ReactNode` |
| id | `string \| undefined` |

- `icon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.

## DashboardTileHeader

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| icon | `ReactNode` |
| id | `string \| undefined` |

- `icon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.

## DashboardTileResizeHandle

Takes the DOM props of the element it renders. Pass `render` to render a different element.

## DashboardTileTitle

Takes the DOM props of the element it renders. Pass `render` to render a different element.

Required props are bold. Full docs: https://ui.xiod.dev/docs
