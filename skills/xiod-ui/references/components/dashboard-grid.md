# dashboard-grid

```tsx
import { DashboardGrid, DashboardTile, DashboardTileControls, DashboardTileHandle, DashboardTileHeader, DashboardTileResizeHandle, DashboardTileTitle } from "xiod-ui/dashboard-grid";
```

## DashboardGrid

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

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

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| **id** | `string` | — |
| isDragging | `boolean \| null \| undefined` | `false` |
| isResizing | `boolean \| null \| undefined` | `false` |
| isStatic | `boolean \| null \| undefined` | `false` |
| variant | `"default" \| "expressive" \| "flat" \| null \| undefined` | `"default"` |

## DashboardTileControls

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| icon | `ReactNode` | — |
| id | `string \| undefined` | — |

- `icon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.

## DashboardTileHandle

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| icon | `ReactNode` | — |
| id | `string \| undefined` | — |

- `icon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.

## DashboardTileHeader

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| icon | `ReactNode` | — |
| id | `string \| undefined` | — |

- `icon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.

## DashboardTileResizeHandle

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## DashboardTileTitle

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

Required props are bold. Full docs: https://ui.xiod.dev/docs
