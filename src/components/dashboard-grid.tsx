"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import * as React from "react";
import { Cancel as X } from "xiod-icons/icons/Cancel";
import { GripVertical } from "xiod-icons/icons/GripVertical";

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface DashboardTileData {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  static?: boolean;
  isDraggable?: boolean;
  isResizable?: boolean;
}

export type CompactType = "vertical" | "horizontal" | null;

export interface Breakpoints {
  lg?: number;
  md?: number;
  sm?: number;
  xs?: number;
  xxs?: number;
}

export interface BreakpointCols {
  lg?: number;
  md?: number;
  sm?: number;
  xs?: number;
  xxs?: number;
}

export const defaultBreakpoints: Required<Breakpoints> = {
  lg: 1200,
  md: 996,
  sm: 768,
  xs: 480,
  xxs: 0,
};

export const defaultCols: Required<BreakpointCols> = {
  lg: 12,
  md: 10,
  sm: 6,
  xs: 4,
  xxs: 2,
};

export const dashboardGridVariants = cva(
  "relative w-full overflow-hidden select-none transition-colors duration-200 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-background/40 border border-border/40 rounded-xl p-3 backdrop-blur-xs",
        ghost: "bg-transparent border-0 p-0",
        bordered: "bg-card border border-border rounded-2xl p-4 shadow-xs/5",
        canvas:
          "bg-muted/10 border border-border/60 rounded-2xl p-4 shadow-inner",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const dashboardTileVariants = cva(
  "absolute flex flex-col rounded-xl border bg-card text-card-foreground shadow-xs/5 transition-[transform,width,height,opacity,border-color,box-shadow] duration-150 group overflow-hidden touch-none",
  {
    variants: {
      variant: {
        default:
          "border-border/80 bg-card hover:border-foreground/20 shadow-xs/5",
        expressive:
          "border-primary/30 bg-card/95 shadow-primary/5 hover:border-primary/50",
        flat: "border-border/40 bg-muted/30 shadow-none",
      },
      isDragging: {
        true: "z-30 shadow-2xl/25 opacity-90 scale-[1.01] border-primary transition-none cursor-grabbing ring-2 ring-primary/20",
        false: "",
      },
      isResizing: {
        true: "z-30 shadow-xl/20 opacity-95 border-primary transition-none ring-2 ring-primary/20",
        false: "",
      },
      isStatic: {
        true: "border-dashed border-border/60 bg-muted/20 opacity-80 cursor-default",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      isDragging: false,
      isResizing: false,
      isStatic: false,
    },
  },
);

// ============================================================================
// Core Dashboard Layout Engine (Collision, Compaction, Breakpoints)
// ============================================================================

function collides(l1: DashboardTileData, l2: DashboardTileData): boolean {
  if (l1.i === l2.i) return false;
  if (l1.x + l1.w <= l2.x) return false;
  if (l1.x >= l2.x + l2.w) return false;
  if (l1.y + l1.h <= l2.y) return false;
  if (l1.y >= l2.y + l2.h) return false;
  return true;
}

function getFirstCollision(
  layout: DashboardTileData[],
  item: DashboardTileData,
): DashboardTileData | undefined {
  return layout.find((other) => collides(other, item));
}

function sortLayout(
  layout: DashboardTileData[],
  compactType: CompactType,
): DashboardTileData[] {
  return layout.toSorted((a, b) => {
    if (compactType === "horizontal") {
      if (a.x > b.x || (a.x === b.x && a.y > b.y)) return 1;
      return -1;
    }
    if (a.y > b.y || (a.y === b.y && a.x > b.x)) return 1;
    return -1;
  });
}

function compactItem(
  compareWith: DashboardTileData[],
  l: DashboardTileData,
  compactType: CompactType,
  cols: number,
): DashboardTileData {
  const item = { ...l };
  if (compactType === "vertical") {
    item.y = Math.min(
      item.y,
      Math.max(0, ...compareWith.map((c) => c.y + c.h)),
    );
    while (item.y > 0 && !getFirstCollision(compareWith, item)) {
      item.y--;
    }
    let collision = getFirstCollision(compareWith, item);
    while (collision) {
      item.y = collision.y + collision.h;
      collision = getFirstCollision(compareWith, item);
    }
  } else if (compactType === "horizontal") {
    while (item.x > 0 && !getFirstCollision(compareWith, item)) {
      item.x--;
    }
    let collision = getFirstCollision(compareWith, item);
    while (collision) {
      item.x = collision.x + collision.w;
      collision = getFirstCollision(compareWith, item);
    }
  }
  item.x = Math.max(0, Math.min(cols - item.w, item.x));
  item.y = Math.max(0, item.y);
  return item;
}

export function compactLayout(
  layout: DashboardTileData[],
  compactType: CompactType,
  cols: number,
): DashboardTileData[] {
  const compareWith: DashboardTileData[] = [];
  const sorted = sortLayout(layout, compactType);
  const out: DashboardTileData[] = [];

  for (const item of sorted) {
    let compacted = { ...item };
    if (!compacted.static && compactType) {
      compacted = compactItem(compareWith, compacted, compactType, cols);
    }
    compareWith.push(compacted);
    out.push(compacted);
  }

  return out;
}

function moveElement(
  layout: DashboardTileData[],
  item: DashboardTileData,
  x: number,
  y: number,
  preventCollision: boolean,
  cols: number,
  compactType: CompactType,
): DashboardTileData[] {
  if (item.static) return layout;

  const nx = Math.max(0, Math.min(cols - item.w, x));
  const ny = Math.max(0, y);
  const movedItem: DashboardTileData = { ...item, x: nx, y: ny };

  if (preventCollision) {
    const collision = getFirstCollision(
      layout.filter((l) => l.i !== item.i),
      movedItem,
    );
    if (collision) return layout;
  }

  const updatedLayout = layout.map((l) =>
    l.i === item.i ? movedItem : { ...l },
  );

  return compactLayout(updatedLayout, compactType, cols);
}

function getColsForWidth(
  width: number,
  breakpoints: Breakpoints = defaultBreakpoints,
  cols: BreakpointCols | number = defaultCols,
): number {
  if (typeof cols === "number") return cols;
  const mergedBreakpoints = { ...defaultBreakpoints, ...breakpoints };
  const mergedCols = { ...defaultCols, ...cols };

  if (width >= mergedBreakpoints.lg) return mergedCols.lg;
  if (width >= mergedBreakpoints.md) return mergedCols.md;
  if (width >= mergedBreakpoints.sm) return mergedCols.sm;
  if (width >= mergedBreakpoints.xs) return mergedCols.xs;
  return mergedCols.xxs;
}

// ============================================================================
// Context & Component Implementation
// ============================================================================

interface DashboardGridContextValue {
  cols: number;
  rowHeight: number;
  margin: [number, number];
  containerPadding: [number, number];
  layout: DashboardTileData[];
  dragItem: DashboardTileData | null;
  resizeItem: DashboardTileData | null;
  isDraggable: boolean;
  isResizable: boolean;
  onTileDragStart: (id: string, e: React.PointerEvent) => void;
  onTileResizeStart: (id: string, e: React.PointerEvent) => void;
  onTileRemove?: (id: string) => void;
}

const DashboardGridContext =
  React.createContext<DashboardGridContextValue | null>(null);
const DEFAULT_GRID_MARGIN: [number, number] = [12, 12];
const DEFAULT_CONTAINER_PADDING: [number, number] = [12, 12];

export interface DashboardGridProps
  extends
    useRender.ComponentProps<"div">,
    VariantProps<typeof dashboardGridVariants> {
  layout: DashboardTileData[];
  cols?: number | BreakpointCols;
  breakpoints?: Breakpoints;
  rowHeight?: number;
  margin?: [number, number];
  containerPadding?: [number, number];
  compactType?: CompactType;
  preventCollision?: boolean;
  isDraggable?: boolean;
  isResizable?: boolean;
  showGridLines?: boolean;
  onLayoutChange?: (layout: DashboardTileData[]) => void;
  onTileRemove?: (id: string) => void;
}

function DashboardGrid({
  className,
  variant,
  layout: externalLayout,
  cols: colsProp = 12,
  breakpoints = defaultBreakpoints,
  rowHeight = 60,
  margin = DEFAULT_GRID_MARGIN,
  containerPadding = DEFAULT_CONTAINER_PADDING,
  compactType = "vertical",
  preventCollision = false,
  isDraggable = true,
  isResizable = true,
  showGridLines = false,
  onLayoutChange,
  onTileRemove,
  render,
  children,
  ...props
}: DashboardGridProps): React.ReactElement {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = React.useState<number>(0);

  const currentCols = React.useMemo(() => {
    return getColsForWidth(containerWidth || 1200, breakpoints, colsProp);
  }, [containerWidth, breakpoints, colsProp]);

  const [layout, setLayout] = React.useState<DashboardTileData[]>(() =>
    compactLayout(externalLayout, compactType, currentCols),
  );
  const [dragItem, setDragItem] = React.useState<DashboardTileData | null>(
    null,
  );
  const [resizeItem, setResizeItem] = React.useState<DashboardTileData | null>(
    null,
  );

  const layoutRef = React.useRef(layout);
  const currentColsRef = React.useRef(currentCols);
  const compactTypeRef = React.useRef(compactType);
  const preventCollisionRef = React.useRef(preventCollision);
  const onLayoutChangeRef = React.useRef(onLayoutChange);

  React.useEffect(() => {
    layoutRef.current = layout;
    currentColsRef.current = currentCols;
    compactTypeRef.current = compactType;
    preventCollisionRef.current = preventCollision;
    onLayoutChangeRef.current = onLayoutChange;
  });

  // The grid keeps transient drag state locally while accepting controlled
  // layout updates, so prop changes must intentionally reset that local copy.
  // oxlint-disable react/no-deriving-state-in-effects
  React.useEffect(() => {
    setLayout(compactLayout(externalLayout, compactType, currentCols));
  }, [externalLayout, compactType, currentCols]);
  // oxlint-enable react/no-deriving-state-in-effects

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    setContainerWidth(el.clientWidth);
    return () => observer.disconnect();
  }, []);

  const colWidth = React.useMemo(() => {
    if (!containerWidth) return 0;
    const availableWidth =
      containerWidth - containerPadding[0] * 2 - margin[0] * (currentCols - 1);
    return Math.max(10, availableWidth / currentCols);
  }, [containerWidth, containerPadding, margin, currentCols]);

  const maxRows = React.useMemo(() => {
    return Math.max(4, ...layout.map((item) => item.y + item.h));
  }, [layout]);

  const containerHeight = React.useMemo(() => {
    return (
      maxRows * rowHeight + (maxRows - 1) * margin[1] + containerPadding[1] * 2
    );
  }, [maxRows, rowHeight, margin, containerPadding]);

  const handlePointerStart = React.useCallback(
    (id: string, mode: "drag" | "resize", e: React.PointerEvent) => {
      const currentLayout = layoutRef.current;
      const targetItem = currentLayout.find((l) => l.i === id);
      if (!targetItem || targetItem.static) return;

      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startY = e.clientY;
      const initialItem = { ...targetItem };

      if (mode === "drag") setDragItem(initialItem);
      else setResizeItem(initialItem);

      const onPointerMove = (moveEvent: PointerEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;
        const activeCols = currentColsRef.current;
        const activeCompactType = compactTypeRef.current;
        const activePreventCollision = preventCollisionRef.current;

        if (mode === "drag") {
          const gridDeltaX = Math.round(deltaX / (colWidth + margin[0]));
          const gridDeltaY = Math.round(deltaY / (rowHeight + margin[1]));

          const newX = initialItem.x + gridDeltaX;
          const newY = initialItem.y + gridDeltaY;

          setLayout((prev) => {
            const next = moveElement(
              prev,
              initialItem,
              newX,
              newY,
              activePreventCollision,
              activeCols,
              activeCompactType,
            );
            const active = next.find((item) => item.i === id);
            if (active) setDragItem(active);
            return next;
          });
        } else {
          const gridDeltaW = Math.round(deltaX / (colWidth + margin[0]));
          const gridDeltaH = Math.round(deltaY / (rowHeight + margin[1]));

          const minW = initialItem.minW ?? 1;
          const maxW = initialItem.maxW ?? activeCols;
          const minH = initialItem.minH ?? 1;
          const maxH = initialItem.maxH ?? 20;

          const newW = Math.max(
            minW,
            Math.min(
              maxW,
              Math.min(activeCols - initialItem.x, initialItem.w + gridDeltaW),
            ),
          );
          const newH = Math.max(
            minH,
            Math.min(maxH, initialItem.h + gridDeltaH),
          );

          setLayout((prev) => {
            const updatedItem = { ...initialItem, w: newW, h: newH };
            const next = compactLayout(
              prev.map((item) => (item.i === id ? updatedItem : item)),
              activeCompactType,
              activeCols,
            );
            const active = next.find((item) => item.i === id);
            if (active) setResizeItem(active);
            return next;
          });
        }
      };

      const onPointerUp = () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);

        setDragItem(null);
        setResizeItem(null);

        setLayout((finalLayout) => {
          const compacted = compactLayout(
            finalLayout,
            compactTypeRef.current,
            currentColsRef.current,
          );
          queueMicrotask(() => {
            onLayoutChangeRef.current?.(compacted);
          });
          return compacted;
        });
      };

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    },
    [colWidth, margin, rowHeight],
  );

  const handleTileDragStart = React.useCallback(
    (id: string, e: React.PointerEvent) => handlePointerStart(id, "drag", e),
    [handlePointerStart],
  );

  const handleTileResizeStart = React.useCallback(
    (id: string, e: React.PointerEvent) => handlePointerStart(id, "resize", e),
    [handlePointerStart],
  );

  const contextValue: DashboardGridContextValue = React.useMemo(
    () => ({
      cols: currentCols,
      rowHeight,
      margin,
      containerPadding,
      layout,
      dragItem,
      resizeItem,
      isDraggable,
      isResizable,
      onTileDragStart: handleTileDragStart,
      onTileResizeStart: handleTileResizeStart,
      onTileRemove,
    }),
    [
      currentCols,
      rowHeight,
      margin,
      containerPadding,
      layout,
      dragItem,
      resizeItem,
      isDraggable,
      isResizable,
      handleTileDragStart,
      handleTileResizeStart,
      onTileRemove,
    ],
  );

  const activeGhost = dragItem || resizeItem;

  const defaultProps = {
    ref: containerRef,
    className: cn(dashboardGridVariants({ variant, className })),
    style: {
      height: containerHeight,
    },
    "data-slot": "dashboard-grid",
    children: (
      <DashboardGridContext.Provider value={contextValue}>
        {showGridLines && (
          <div
            className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)]"
            style={{
              backgroundSize: `${colWidth + margin[0]}px ${rowHeight + margin[1]}px`,
              backgroundPosition: `${containerPadding[0]}px ${containerPadding[1]}px`,
            }}
          />
        )}

        {children}

        {/* Active Drag/Resize Placeholder Ghost */}
        {activeGhost && (
          <div
            className="absolute rounded-xl border-2 border-dashed border-primary bg-primary/10 transition-[left,top,width,height] duration-75 pointer-events-none z-10"
            data-slot="dashboard-grid-placeholder"
            style={{
              left:
                containerPadding[0] + activeGhost.x * (colWidth + margin[0]),
              top:
                containerPadding[1] + activeGhost.y * (rowHeight + margin[1]),
              width: activeGhost.w * colWidth + (activeGhost.w - 1) * margin[0],
              height:
                activeGhost.h * rowHeight + (activeGhost.h - 1) * margin[1],
            }}
          />
        )}
      </DashboardGridContext.Provider>
    ),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

// ============================================================================
// DashboardTile Component
// ============================================================================

export interface DashboardTileProps
  extends
    useRender.ComponentProps<"div">,
    VariantProps<typeof dashboardTileVariants> {
  id: string;
}

function DashboardTile({
  className,
  variant,
  id,
  render,
  children,
  ...props
}: DashboardTileProps): React.ReactElement | null {
  const context = React.useContext(DashboardGridContext);

  const tileData = context?.layout.find((item) => item.i === id);
  const isDragging = context?.dragItem?.i === id;
  const isResizing = context?.resizeItem?.i === id;

  const top =
    context && tileData
      ? context.containerPadding[1] +
        tileData.y * (context.rowHeight + context.margin[1])
      : 0;

  const defaultProps = {
    className: cn(
      dashboardTileVariants({
        variant,
        isDragging,
        isResizing,
        isStatic: tileData?.static,
        className,
      }),
    ),
    style:
      context && tileData
        ? {
            // A percentage in `translate3d` resolves against this tile's own
            // border box, not the grid — but `width` below resolves against
            // the grid. Using `x * 100%` mixes the two: a tile at x: 8 in a
            // 12-column grid is 4 columns wide, so `translateX(800%)` moves it
            // eight of its own widths — 32 columns — and it lands off-screen.
            // It is only correct when w === 1.
            //
            // The offset wanted is `x * (containerWidth / cols)`. This tile's
            // own width is `containerWidth * (w / cols) - margin`, so one
            // column equals `(ownWidth + margin) / w`, giving `x / w` of the
            // tile's width plus `x * margin / w` to make up the gutter the
            // width subtracts.
            transform: `translate3d(calc(${(tileData.x / Math.max(1, tileData.w)) * 100}% + ${(tileData.x * context.margin[0]) / Math.max(1, tileData.w)}px), ${top}px, 0)`,
            width: `calc(${tileData.w * (100 / context.cols)}% - ${context.margin[0]}px)`,
            height:
              tileData.h * context.rowHeight +
              (tileData.h - 1) * context.margin[1],
          }
        : undefined,
    "data-slot": "dashboard-tile",
    "data-tile-id": id,
    children: (
      <>
        {children}
        {context?.isResizable && !tileData?.static && (
          <DashboardTileResizeHandle
            onPointerDown={(e) => context?.onTileResizeStart(id, e)}
          />
        )}
      </>
    ),
  };

  const renderedElement = useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });

  if (!context || !tileData) return null;
  return renderedElement;
}

// ============================================================================
// Sub-Components (TileHeader, TileTitle, TileControls, TileHandle, ResizeHandle)
// ============================================================================

export interface DashboardTileHeaderProps extends useRender.ComponentProps<"div"> {
  id?: string;
}

function DashboardTileHeader({
  className,
  id,
  render,
  children,
  ...props
}: DashboardTileHeaderProps): React.ReactElement {
  const context = React.useContext(DashboardGridContext);

  const handlePointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      if (id && context?.isDraggable) {
        context.onTileDragStart(id, e);
      }
    },
    [id, context],
  );

  const defaultProps = {
    className: cn(
      "flex items-center justify-between gap-2 px-3 py-2 border-b border-border/40 bg-muted/30 cursor-grab active:cursor-grabbing select-none text-xs font-medium text-foreground shrink-0",
      className,
    ),
    onPointerDown: handlePointerDown,
    "data-slot": "dashboard-tile-header",
    children: children || (
      <>
        <div className="flex items-center gap-1.5 truncate">
          <GripVertical className="size-3.5 text-muted-foreground/60 shrink-0" />
          <DashboardTileTitle />
        </div>
        <DashboardTileControls id={id} />
      </>
    ),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export interface DashboardTileTitleProps extends useRender.ComponentProps<"span"> {}

function DashboardTileTitle({
  className,
  render,
  children,
  ...props
}: DashboardTileTitleProps): React.ReactElement {
  const defaultProps = {
    className: cn("font-semibold truncate text-xs text-foreground", className),
    "data-slot": "dashboard-tile-title",
    children: children || "Widget Tile",
  };

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(defaultProps, props),
    render,
  });
}

export interface DashboardTileControlsProps extends useRender.ComponentProps<"div"> {
  id?: string;
}

function DashboardTileControls({
  className,
  id,
  render,
  children,
  ...props
}: DashboardTileControlsProps): React.ReactElement {
  const context = React.useContext(DashboardGridContext);

  const defaultProps = {
    className: cn("flex items-center gap-1 shrink-0", className),
    onPointerDown: (e: React.PointerEvent) => e.stopPropagation(),
    "data-slot": "dashboard-tile-controls",
    children:
      children ||
      (id && context?.onTileRemove && (
        <button
          type="button"
          onClick={() => context.onTileRemove?.(id)}
          className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors pointer-coarse:after:absolute pointer-coarse:after:size-11"
          aria-label="Remove Widget"
        >
          <X className="size-3" />
        </button>
      )),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export interface DashboardTileHandleProps extends useRender.ComponentProps<"div"> {
  id?: string;
}

function DashboardTileHandle({
  className,
  id,
  render,
  ...props
}: DashboardTileHandleProps): React.ReactElement {
  const context = React.useContext(DashboardGridContext);

  const handlePointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      if (id && context?.isDraggable) {
        context.onTileDragStart(id, e);
      }
    },
    [id, context],
  );

  const defaultProps = {
    className: cn(
      "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border/40 bg-muted/40 cursor-grab active:cursor-grabbing select-none text-xs font-medium text-muted-foreground hover:text-foreground",
      className,
    ),
    onPointerDown: handlePointerDown,
    "data-slot": "dashboard-tile-handle",
    children: (
      <>
        <GripVertical className="size-3.5 opacity-60 shrink-0" />
        <span className="truncate flex-1">Drag Handle</span>
      </>
    ),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export interface DashboardTileResizeHandleProps extends useRender.ComponentProps<"div"> {}

function DashboardTileResizeHandle({
  className,
  render,
  ...props
}: DashboardTileResizeHandleProps): React.ReactElement {
  const defaultProps = {
    className: cn(
      "absolute bottom-1 right-1 size-4 cursor-se-resize flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity touch-none pointer-coarse:after:absolute pointer-coarse:after:size-8",
      className,
    ),
    "data-slot": "dashboard-tile-resize-handle",
    children: (
      <svg
        className="size-3 text-muted-foreground"
        viewBox="0 0 6 6"
        fill="currentColor"
      >
        <circle cx="5" cy="5" r="1" />
        <circle cx="5" cy="2" r="1" />
        <circle cx="2" cy="5" r="1" />
      </svg>
    ),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export {
  DashboardGrid,
  DashboardTile,
  DashboardTileControls,
  DashboardTileHandle,
  DashboardTileHeader,
  DashboardTileResizeHandle,
  DashboardTileTitle,
};
