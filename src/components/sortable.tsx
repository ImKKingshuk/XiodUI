"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import * as React from "react";
import { Cancel as X } from "xiod-icons/icons/Cancel";
import { GripVertical } from "xiod-icons/icons/GripVertical";

import { IconSlot } from "./icon-provider";

// ============================================================================
// Types & CVA Variants
// ============================================================================

export type SortableOrientation = "vertical" | "horizontal" | "grid";

export const sortableVariants = cva(
  "relative flex select-none transition-colors duration-200 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      orientation: {
        vertical: "flex-col gap-2 w-full",
        horizontal: "flex-row gap-2 items-center overflow-x-auto",
        grid: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full",
      },
      variant: {
        default: "",
        ghost: "bg-transparent p-0",
        bordered:
          "border border-border/60 bg-background/50 rounded-xl p-3 backdrop-blur-xs",
      },
    },
    defaultVariants: {
      orientation: "vertical",
      variant: "default",
    },
  },
);

export const sortableItemVariants = cva(
  "relative flex items-center gap-3 rounded-lg border text-card-foreground shadow-xs/5 transition-[transform,box-shadow,border-color,opacity] duration-150 group overflow-hidden touch-none",
  {
    variants: {
      variant: {
        default: "border-border/80 bg-card hover:border-foreground/20",
        accent: "border-primary/30 bg-primary/5 hover:border-primary/50",
        flat: "border-border/40 bg-muted/40 shadow-none",
      },
      isDragging: {
        true: "z-30 opacity-30 border-dashed border-primary shadow-none scale-[0.98]",
        false: "",
      },
      isHoveredTarget: {
        true: "border-primary bg-primary/10 scale-[1.02] shadow-md/10 z-20",
        false: "",
      },
      isKeyboardActive: {
        true: "ring-2 ring-ring ring-offset-2 ring-offset-background border-primary z-20",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      isDragging: false,
      isHoveredTarget: false,
      isKeyboardActive: false,
    },
  },
);

// ============================================================================
// Context & Component Implementation
// ============================================================================

interface SortableContextValue {
  items: string[];
  activeIndex: number | null;
  overIndex: number | null;
  keyboardActiveIndex: number | null;
  orientation: SortableOrientation;
  onItemPointerDown: (index: number, e: React.PointerEvent) => void;
  onItemKeyDown: (index: number, e: React.KeyboardEvent) => void;
  onItemBlur: (e: React.FocusEvent) => void;
  onItemRemove?: (id: string) => void;
}

const SortableContext = React.createContext<SortableContextValue | null>(null);

export interface SortableProps
  extends
    useRender.ComponentProps<"div">,
    VariantProps<typeof sortableVariants> {
  items: string[];
  onReorder: (newItems: string[]) => void;
  onRemove?: (id: string) => void;
  orientation?: SortableOrientation;
}

function Sortable({
  className,
  orientation = "vertical",
  variant,
  items,
  onReorder,
  onRemove,
  render,
  children,
  handleIcon,
  ...props
}: SortableProps & {
  /** Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`. */
  handleIcon?: React.ReactNode;
}): React.ReactElement {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [overIndex, setOverIndex] = React.useState<number | null>(null);
  const [keyboardActiveIndex, setKeyboardActiveIndex] = React.useState<
    number | null
  >(null);
  const [dragOverlayPos, setDragOverlayPos] = React.useState<{
    x: number;
    y: number;
  } | null>(null);

  // Real-time mutable refs to prevent stale closure bugs in pointer event listeners
  const [announcement, setAnnouncement] = React.useState("");

  const activeIndexRef = React.useRef<number | null>(null);
  const overIndexRef = React.useRef<number | null>(null);
  const itemsRef = React.useRef(items);
  const onReorderRef = React.useRef(onReorder);
  // The order when a keyboard drag began, restored by Escape.
  const keyboardOriginRef = React.useRef<string[] | null>(null);
  // Removes the window listeners of a pointer drag in progress.
  const pointerCleanupRef = React.useRef<(() => void) | null>(null);

  React.useEffect(() => {
    itemsRef.current = items;
    onReorderRef.current = onReorder;
  }, [items, onReorder]);

  // Unmounting mid-drag must not leave window listeners behind.
  React.useEffect(() => () => pointerCleanupRef.current?.(), []);

  // Reordering moves the lifted item's DOM node, which can drop focus; put
  // it back so the keyboard drag continues.
  React.useEffect(() => {
    if (keyboardActiveIndex === null || keyboardActiveIndex >= items.length) {
      return;
    }
    const el = containerRef.current?.querySelector<HTMLElement>(
      `[data-sortable-index="${keyboardActiveIndex}"]`,
    );
    if (el && document.activeElement !== el) el.focus();
  }, [keyboardActiveIndex, items]);

  const handlePointerDown = React.useCallback(
    (index: number, e: React.PointerEvent) => {
      if (e.button !== 0) return;
      pointerCleanupRef.current?.();
      e.preventDefault();
      e.stopPropagation();

      activeIndexRef.current = index;
      overIndexRef.current = index;
      setActiveIndex(index);
      setOverIndex(index);
      setDragOverlayPos({ x: e.clientX, y: e.clientY });

      const container = containerRef.current;

      const onPointerMove = (moveEvent: PointerEvent) => {
        setDragOverlayPos({ x: moveEvent.clientX, y: moveEvent.clientY });

        if (!container) return;

        // Determine element under the pointer cursor
        const elementUnder = document.elementFromPoint(
          moveEvent.clientX,
          moveEvent.clientY,
        );
        if (!elementUnder) return;

        const itemEl = elementUnder.closest("[data-sortable-index]");
        if (itemEl && container.contains(itemEl)) {
          const hoverIdx = Number(itemEl.getAttribute("data-sortable-index"));
          if (!Number.isNaN(hoverIdx) && hoverIdx !== overIndexRef.current) {
            overIndexRef.current = hoverIdx;
            setOverIndex(hoverIdx);
          }
        }
      };

      const reset = () => {
        activeIndexRef.current = null;
        overIndexRef.current = null;
        setActiveIndex(null);
        setOverIndex(null);
        setDragOverlayPos(null);
      };

      const cleanup = () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerCancel);
        pointerCleanupRef.current = null;
      };

      // The browser took the pointer (a scroll gesture, a system dialog):
      // drop without reordering.
      const onPointerCancel = () => {
        cleanup();
        reset();
      };

      const onPointerUp = () => {
        cleanup();

        const fromIdx = activeIndexRef.current;
        const toIdx = overIndexRef.current;

        if (
          fromIdx !== null &&
          toIdx !== null &&
          fromIdx !== toIdx &&
          fromIdx >= 0 &&
          fromIdx < itemsRef.current.length &&
          toIdx >= 0 &&
          toIdx < itemsRef.current.length
        ) {
          const reordered = [...itemsRef.current];
          const [removed] = reordered.splice(fromIdx, 1);
          reordered.splice(toIdx, 0, removed);
          onReorderRef.current(reordered);
        }

        reset();
      };

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerCancel);
      pointerCleanupRef.current = cleanup;
    },
    [],
  );

  // Keyboard drag: Space/Enter lifts the item, arrows (Home/End) move it,
  // Space/Enter drops it, Escape puts the list back as it was. Each step is
  // announced, since the only other feedback is visual.
  const handleKeyDown = React.useCallback(
    (index: number, e: React.KeyboardEvent) => {
      // Keys typed into a control inside the item belong to that control.
      if (e.target !== e.currentTarget) return;
      const total = items.length;

      if (keyboardActiveIndex === null) {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          keyboardOriginRef.current = items;
          setKeyboardActiveIndex(index);
          setAnnouncement(
            `Picked up ${items[index]}, position ${index + 1} of ${total}. Use the arrow keys to move it, Space or Enter to drop it, Escape to cancel.`,
          );
        }
        return;
      }

      const id = items[keyboardActiveIndex];

      if (e.key === "Escape") {
        e.preventDefault();
        const origin = keyboardOriginRef.current;
        keyboardOriginRef.current = null;
        setKeyboardActiveIndex(null);
        if (origin && origin.join("\u0000") !== items.join("\u0000")) {
          onReorder(origin);
        }
        const originIndex = origin ? origin.indexOf(id) : keyboardActiveIndex;
        setAnnouncement(
          `Cancelled. ${id} returned to position ${originIndex + 1} of ${total}.`,
        );
        return;
      }

      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        keyboardOriginRef.current = null;
        setKeyboardActiveIndex(null);
        setAnnouncement(
          `Dropped ${id} at position ${keyboardActiveIndex + 1} of ${total}.`,
        );
        return;
      }

      let nextIdx = keyboardActiveIndex;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        nextIdx = Math.min(total - 1, keyboardActiveIndex + 1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        nextIdx = Math.max(0, keyboardActiveIndex - 1);
      } else if (e.key === "Home") {
        nextIdx = 0;
      } else if (e.key === "End") {
        nextIdx = total - 1;
      } else {
        return;
      }
      e.preventDefault();

      if (nextIdx !== keyboardActiveIndex) {
        const reordered = [...items];
        const [removed] = reordered.splice(keyboardActiveIndex, 1);
        reordered.splice(nextIdx, 0, removed);
        setKeyboardActiveIndex(nextIdx);
        onReorder(reordered);
        setAnnouncement(`${id} moved to position ${nextIdx + 1} of ${total}.`);
      }
    },
    [keyboardActiveIndex, items, onReorder],
  );

  // Tabbing away from a lifted item drops it where it is. (A null
  // relatedTarget is the node being moved by a reorder, not the user.)
  const handleItemBlur = React.useCallback(
    (e: React.FocusEvent) => {
      if (keyboardActiveIndex === null) return;
      const next = e.relatedTarget as Node | null;
      if (!next || containerRef.current?.contains(next)) return;
      keyboardOriginRef.current = null;
      setKeyboardActiveIndex(null);
    },
    [keyboardActiveIndex],
  );

  const contextValue: SortableContextValue = React.useMemo(
    () => ({
      items,
      activeIndex,
      overIndex,
      keyboardActiveIndex,
      orientation,
      onItemPointerDown: handlePointerDown,
      onItemKeyDown: handleKeyDown,
      onItemBlur: handleItemBlur,
      onItemRemove: onRemove,
    }),
    [
      items,
      activeIndex,
      overIndex,
      keyboardActiveIndex,
      orientation,
      onRemove,
      handlePointerDown,
      handleKeyDown,
      handleItemBlur,
    ],
  );

  const activeItemValue = activeIndex !== null ? items[activeIndex] : null;

  const defaultProps = {
    ref: containerRef,
    className: cn(sortableVariants({ orientation, variant, className })),
    role: "list",
    "data-slot": "sortable",
    children: (
      <SortableContext.Provider value={contextValue}>
        {children}

        <div
          aria-live="assertive"
          aria-atomic="true"
          className="sr-only"
          data-slot="sortable-announcer"
        >
          {announcement}
        </div>

        {/* Floating Active Drag Ghost */}
        {activeItemValue && dragOverlayPos && (
          <div
            className="fixed pointer-events-none z-50 rounded-lg border border-primary bg-card/95 px-[calc(--spacing(4)-1px)] py-[calc(--spacing(3)-1px)] shadow-xl/20 backdrop-blur-md text-foreground opacity-95 scale-105 transition-none"
            style={{
              left: dragOverlayPos.x - 24,
              top: dragOverlayPos.y - 20,
            }}
          >
            <div className="flex items-center gap-2 text-xs font-medium">
              <IconSlot
                name="GripVertical"
                icon={handleIcon}
                fallback={GripVertical}
                className="size-4 text-primary shrink-0"
              />
              <span>{activeItemValue}</span>
            </div>
          </div>
        )}
      </SortableContext.Provider>
    ),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

// ============================================================================
// SortableItem Component
// ============================================================================

export interface SortableItemProps
  extends
    useRender.ComponentProps<"div">,
    VariantProps<typeof sortableItemVariants> {
  id: string;
}

function SortableItem({
  className,
  variant,
  id,
  render,
  children,
  ...props
}: SortableItemProps): React.ReactElement | null {
  const context = React.useContext(SortableContext);

  const index = context ? context.items.indexOf(id) : -1;
  const isDragging = context?.activeIndex === index;
  const isHoveredTarget =
    context?.overIndex === index && context?.activeIndex !== index;
  const isKeyboardActive = context?.keyboardActiveIndex === index;

  const handleItemPointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      if (!context || index < 0) return;
      const target = e.target as HTMLElement;
      // Do not initiate drag if user clicked on an interactive control or explicit handle
      if (
        target.closest(
          "button, input, textarea, select, a, [data-slot='sortable-handle'], [data-slot='sortable-remove']",
        )
      ) {
        return;
      }
      context.onItemPointerDown(index, e);
    },
    [context, index],
  );

  const defaultProps = {
    tabIndex: 0,
    role: "listitem",
    "aria-label": id,
    className: cn(
      sortableItemVariants({
        variant,
        isDragging,
        isHoveredTarget,
        isKeyboardActive,
        className,
      }),
    ),
    onPointerDown: handleItemPointerDown,
    "data-slot": "sortable-item",
    "data-sortable-id": id,
    "data-sortable-index": index,
    "aria-roledescription": "sortable item",
    onKeyDown: (e: React.KeyboardEvent) => context?.onItemKeyDown(index, e),
    onBlur: (e: React.FocusEvent) => context?.onItemBlur(e),
    children,
  };

  const renderedElement = useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });

  if (!context) return null;
  return renderedElement;
}

// ============================================================================
// SortableItemHandle Component
// ============================================================================

export interface SortableItemHandleProps extends useRender.ComponentProps<"div"> {
  id?: string;
}

function SortableItemHandle({
  className,
  id: _id,
  render,
  children,
  icon,
  ...props
}: SortableItemHandleProps & {
  /** Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`. */
  icon?: React.ReactNode;
}): React.ReactElement {
  const context = React.useContext(SortableContext);

  const handlePointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      if (!context) return;
      const parentItem = (e.currentTarget as HTMLElement).closest(
        "[data-sortable-index]",
      );
      if (parentItem) {
        const idx = Number(parentItem.getAttribute("data-sortable-index"));
        if (!Number.isNaN(idx)) {
          context.onItemPointerDown(idx, e);
        }
      }
    },
    [context],
  );

  const defaultProps = {
    className: cn(
      "flex items-center justify-center p-2 text-muted-foreground/60 hover:text-foreground cursor-grab active:cursor-grabbing select-none shrink-0 touch-none pointer-coarse:after:absolute pointer-coarse:after:size-11",
      className,
    ),
    onPointerDown: handlePointerDown,
    "data-slot": "sortable-handle",
    children: children || (
      <IconSlot
        name="GripVertical"
        icon={icon}
        fallback={GripVertical}
        className="size-4 shrink-0"
      />
    ),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

// ============================================================================
// SortableItemRemove Component
// ============================================================================

export interface SortableItemRemoveProps extends useRender.ComponentProps<"button"> {
  id: string;
}

function SortableItemRemove({
  className,
  id,
  render,
  children,
  icon,
  ...props
}: SortableItemRemoveProps & {
  /** Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`. */
  icon?: React.ReactNode;
}): React.ReactElement {
  const context = React.useContext(SortableContext);

  const handleClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      context?.onItemRemove?.(id);
    },
    [context, id],
  );

  const defaultProps = {
    type: "button" as const,
    "aria-label": `Remove ${id}`,
    className: cn(
      "flex items-center justify-center p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0 pointer-coarse:after:absolute pointer-coarse:after:size-11",
      className,
    ),
    onClick: handleClick,
    "data-slot": "sortable-remove",
    children: children || (
      <IconSlot
        name="Cancel"
        icon={icon}
        fallback={X}
        className="size-3.5 shrink-0"
      />
    ),
  };

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(defaultProps, props),
    render,
  });
}

// ============================================================================
// Kanban Compound Parts (SortableColumn, SortableColumnHeader, etc.)
// ============================================================================

export interface SortableColumnProps extends useRender.ComponentProps<"div"> {
  id: string;
}

function SortableColumn({
  className,
  id,
  render,
  children,
  ...props
}: SortableColumnProps): React.ReactElement {
  const defaultProps = {
    role: "listitem",
    "aria-label": id,
    className: cn(
      "flex flex-col gap-2.5 w-72 shrink-0 rounded-xl border border-border/60 bg-muted/20 p-3 backdrop-blur-xs shadow-xs/5",
      className,
    ),
    "data-slot": "sortable-column",
    children,
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export interface SortableColumnHeaderProps extends useRender.ComponentProps<"div"> {}

function SortableColumnHeader({
  className,
  render,
  children,
  ...props
}: SortableColumnHeaderProps): React.ReactElement {
  const defaultProps = {
    className: cn(
      "flex items-center justify-between gap-2 px-1 py-0.5 text-xs font-semibold text-foreground select-none",
      className,
    ),
    "data-slot": "sortable-column-header",
    children,
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export interface SortableColumnTitleProps extends useRender.ComponentProps<"span"> {}

function SortableColumnTitle({
  className,
  render,
  children,
  ...props
}: SortableColumnTitleProps): React.ReactElement {
  const defaultProps = {
    className: cn("font-medium text-xs text-foreground truncate", className),
    "data-slot": "sortable-column-title",
    children,
  };

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(defaultProps, props),
    render,
  });
}

export {
  Sortable,
  SortableColumn,
  SortableColumnHeader,
  SortableColumnTitle,
  SortableItem,
  SortableItemHandle,
  SortableItemRemove,
};
