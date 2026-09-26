"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import * as React from "react";
import { ArrowExpandDiagonalUpRight as Maximize2 } from "xiod-icons/icons/ArrowExpandDiagonalUpRight";
import { ArrowShrinkDiagonalUpRight as Minimize2 } from "xiod-icons/icons/ArrowShrinkDiagonalUpRight";
import { Cancel as X } from "xiod-icons/icons/Cancel";
import { GripHorizontal } from "xiod-icons/icons/GripHorizontal";
import { MinusSign as Minus } from "xiod-icons/icons/MinusSign";

import { IconSlot } from "./icon-provider";

// ============================================================================
// Types & CVA Variants
// ============================================================================

export type DraggableBounds = "viewport" | "parent" | "none";

export const draggableVariants = cva(
  "fixed flex flex-col rounded-xl border bg-card/95 text-card-foreground shadow-lg/15 backdrop-blur-md overflow-hidden select-none transition-[box-shadow,border-color] duration-150 z-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "border-border/80 bg-card/95 shadow-lg/10",
        expressive:
          "border-primary/30 bg-card/95 shadow-primary/10 shadow-xl/15",
        flat: "border-border/60 bg-muted/90 shadow-xs/5",
      },
      isDragging: {
        true: "z-50 shadow-2xl/25 border-primary transition-none cursor-grabbing opacity-95",
        false: "",
      },
      isResizing: {
        true: "z-50 shadow-xl/20 border-primary transition-none opacity-95",
        false: "",
      },
      isMinimized: {
        true: "h-auto! min-h-0!",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      isDragging: false,
      isResizing: false,
      isMinimized: false,
    },
  },
);

// ============================================================================
// Context & Component Implementation
// ============================================================================

interface DraggableContextValue {
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isDraggable: boolean;
  isResizable: boolean;
  onDragStart: (e: React.PointerEvent) => void;
  onResizeStart: (e: React.PointerEvent) => void;
  onMoveKeyDown: (e: React.KeyboardEvent) => void;
  titleId: string;
  onToggleMinimize: () => void;
  onToggleMaximize: () => void;
  onClose: () => void;
}

function getArrowDelta(e: React.KeyboardEvent): [number, number] | null {
  const step = e.shiftKey ? 50 : 10;
  switch (e.key) {
    case "ArrowLeft":
      return [-step, 0];
    case "ArrowRight":
      return [step, 0];
    case "ArrowUp":
      return [0, -step];
    case "ArrowDown":
      return [0, step];
    default:
      return null;
  }
}

const DraggableContext = React.createContext<DraggableContextValue | null>(
  null,
);

export interface DraggableProps
  extends
    useRender.ComponentProps<"div">,
    VariantProps<typeof draggableVariants> {
  defaultX?: number;
  defaultY?: number;
  defaultWidth?: number;
  defaultHeight?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  bounds?: DraggableBounds;
  isDraggable?: boolean;
  isResizable?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function Draggable({
  className,
  variant,
  defaultX = 40,
  defaultY = 40,
  defaultWidth = 360,
  defaultHeight = 300,
  minWidth = 240,
  minHeight = 160,
  maxWidth = 800,
  maxHeight = 600,
  bounds = "viewport",
  isDraggable = true,
  isResizable = true,
  open: controlledOpen,
  defaultOpen = true,
  onOpenChange,
  render,
  children,
  ...props
}: DraggableProps): React.ReactElement | null {
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isOpen = controlledOpen ?? uncontrolledOpen;

  const [position, setPosition] = React.useState({ x: defaultX, y: defaultY });
  const [size, setSize] = React.useState({
    width: defaultWidth,
    height: defaultHeight,
  });
  const [isDragging, setIsDragging] = React.useState(false);
  const [isResizing, setIsResizing] = React.useState(false);
  const [isMinimized, setIsMinimized] = React.useState(false);
  const [isMaximized, setIsMaximized] = React.useState(false);

  const prevSizeRef = React.useRef({
    width: defaultWidth,
    height: defaultHeight,
  });
  const prevPosRef = React.useRef({ x: defaultX, y: defaultY });
  const titleId = React.useId();

  const handleClose = React.useCallback(() => {
    if (controlledOpen === undefined) setUncontrolledOpen(false);
    onOpenChange?.(false);
  }, [controlledOpen, onOpenChange]);

  const handleToggleMinimize = React.useCallback(() => {
    setIsMinimized((prev) => !prev);
  }, []);

  const handleToggleMaximize = React.useCallback(() => {
    if (isMaximized) {
      setSize(prevSizeRef.current);
      setPosition(prevPosRef.current);
      setIsMaximized(false);
    } else {
      prevSizeRef.current = size;
      prevPosRef.current = position;
      setPosition({ x: 12, y: 12 });
      setSize({
        width: window.innerWidth - 24,
        height: window.innerHeight - 24,
      });
      setIsMaximized(true);
    }
  }, [isMaximized, size, position]);

  // Removes the window listeners of a pointer drag or resize in progress.
  const pointerCleanupRef = React.useRef<(() => void) | null>(null);
  React.useEffect(() => () => pointerCleanupRef.current?.(), []);

  // Keeps the panel inside `bounds`. The panel is position: fixed, so both
  // the viewport and the parent's rect are in viewport coordinates.
  const clampPosition = React.useCallback(
    (x: number, y: number) => {
      const height = isMinimized
        ? (panelRef.current?.offsetHeight ?? 44)
        : size.height;
      let rect: { left: number; top: number; right: number; bottom: number };
      if (bounds === "viewport") {
        rect = {
          left: 0,
          top: 0,
          right: window.innerWidth,
          bottom: window.innerHeight,
        };
      } else if (bounds === "parent" && panelRef.current?.parentElement) {
        rect = panelRef.current.parentElement.getBoundingClientRect();
      } else {
        return { x, y };
      }
      return {
        x: Math.max(rect.left, Math.min(rect.right - size.width, x)),
        y: Math.max(rect.top, Math.min(rect.bottom - height, y)),
      };
    },
    [bounds, size, isMinimized],
  );

  // Tracks a pointer on window until it's released or cancelled.
  const trackPointer = React.useCallback(
    (onMove: (e: PointerEvent) => void, onEnd: () => void) => {
      pointerCleanupRef.current?.();
      const detach = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", end);
        window.removeEventListener("pointercancel", end);
        pointerCleanupRef.current = null;
      };
      function end() {
        detach();
        onEnd();
      }
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", end);
      window.addEventListener("pointercancel", end);
      pointerCleanupRef.current = detach;
    },
    [],
  );

  const handleDragStart = React.useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggable || isMaximized || e.button !== 0) return;
      e.preventDefault();

      setIsDragging(true);
      const startX = e.clientX - position.x;
      const startY = e.clientY - position.y;

      trackPointer(
        (moveEvent) => {
          setPosition(
            clampPosition(
              moveEvent.clientX - startX,
              moveEvent.clientY - startY,
            ),
          );
        },
        () => setIsDragging(false),
      );
    },
    [isDraggable, isMaximized, position, clampPosition, trackPointer],
  );

  const handleResizeStart = React.useCallback(
    (e: React.PointerEvent) => {
      if (!isResizable || isMaximized || isMinimized || e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();

      setIsResizing(true);
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = size.width;
      const startHeight = size.height;

      trackPointer(
        (moveEvent) => {
          setSize({
            width: Math.max(
              minWidth,
              Math.min(maxWidth, startWidth + moveEvent.clientX - startX),
            ),
            height: Math.max(
              minHeight,
              Math.min(maxHeight, startHeight + moveEvent.clientY - startY),
            ),
          });
        },
        () => setIsResizing(false),
      );
    },
    [
      isResizable,
      isMaximized,
      isMinimized,
      size,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      trackPointer,
    ],
  );

  // Keyboard counterparts: arrow keys move or resize by 10px (50px with
  // Shift), within the same limits as the pointer.
  const handleMoveKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (!isDraggable || isMaximized) return;
      const delta = getArrowDelta(e);
      if (!delta) return;
      e.preventDefault();
      setPosition(clampPosition(position.x + delta[0], position.y + delta[1]));
    },
    [isDraggable, isMaximized, position, clampPosition],
  );

  const handleResizeKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (!isResizable || isMaximized || isMinimized) return;
      const delta = getArrowDelta(e);
      if (!delta) return;
      e.preventDefault();
      setSize({
        width: Math.max(minWidth, Math.min(maxWidth, size.width + delta[0])),
        height: Math.max(
          minHeight,
          Math.min(maxHeight, size.height + delta[1]),
        ),
      });
    },
    [
      isResizable,
      isMaximized,
      isMinimized,
      size,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
    ],
  );

  const contextValue: DraggableContextValue = React.useMemo(
    () => ({
      isOpen,
      isMinimized,
      isMaximized,
      isDraggable,
      isResizable,
      onDragStart: handleDragStart,
      onResizeStart: handleResizeStart,
      onMoveKeyDown: handleMoveKeyDown,
      titleId,
      onToggleMinimize: handleToggleMinimize,
      onToggleMaximize: handleToggleMaximize,
      onClose: handleClose,
    }),
    [
      isOpen,
      isMinimized,
      isMaximized,
      isDraggable,
      isResizable,
      handleDragStart,
      handleResizeStart,
      handleMoveKeyDown,
      titleId,
      handleToggleMinimize,
      handleToggleMaximize,
      handleClose,
    ],
  );

  const defaultProps = {
    ref: panelRef,
    className: cn(
      draggableVariants({
        variant,
        isDragging,
        isResizing,
        isMinimized,
        className,
      }),
    ),
    style: {
      left: position.x,
      top: position.y,
      width: size.width,
      height: isMinimized ? "auto" : size.height,
    },
    // A non-modal window: named by its DraggableTitle.
    role: "dialog",
    "aria-labelledby": titleId,
    "data-slot": "draggable",
    children: (
      <DraggableContext.Provider value={contextValue}>
        {children}
        {isResizable && !isMinimized && !isMaximized && (
          <DraggableResizeHandle
            onPointerDown={handleResizeStart}
            onKeyDown={handleResizeKeyDown}
          />
        )}
      </DraggableContext.Provider>
    ),
  };

  const renderedElement = useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });

  if (!isOpen) return null;
  return renderedElement;
}

// ============================================================================
// Sub-Components
// ============================================================================

export interface DraggableHeaderProps extends useRender.ComponentProps<"div"> {}

function DraggableHeader({
  className,
  render,
  children,
  icon,
  ...props
}: DraggableHeaderProps & {
  /** Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`. */
  icon?: React.ReactNode;
}): React.ReactElement {
  const context = React.useContext(DraggableContext);

  const defaultProps = {
    className: cn(
      "flex items-center justify-between gap-2 px-3 py-2 border-b border-border/40 bg-muted/30 cursor-grab active:cursor-grabbing select-none text-xs font-medium text-foreground shrink-0 touch-none",
      className,
    ),
    onPointerDown: context?.onDragStart,
    "data-slot": "draggable-header",
    children: children || (
      <>
        <div className="flex items-center gap-1.5 truncate">
          <DraggableHandle icon={icon} />
          <DraggableTitle />
        </div>
        <DraggableControls />
      </>
    ),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export interface DraggableHandleProps extends useRender.ComponentProps<"span"> {}

// The keyboard way to move the panel (arrow keys), since the header itself
// can't be a button: it holds the window controls.
function DraggableHandle({
  className,
  render,
  children,
  icon,
  ...props
}: DraggableHandleProps & {
  /** Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`. */
  icon?: React.ReactNode;
}): React.ReactElement {
  const context = React.useContext(DraggableContext);
  const movable = !!context?.isDraggable && !context.isMaximized;

  const defaultProps = {
    className: cn(
      "inline-flex shrink-0 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring",
      className,
    ),
    ...(movable
      ? {
          role: "button",
          tabIndex: 0,
          "aria-label": "Move panel",
          "aria-roledescription": "draggable",
          "aria-keyshortcuts": "ArrowUp ArrowDown ArrowLeft ArrowRight",
          onKeyDown: context.onMoveKeyDown,
        }
      : {}),
    "data-slot": "draggable-handle",
    children: children || (
      <IconSlot
        name="GripHorizontal"
        icon={icon}
        fallback={GripHorizontal}
        className="size-3.5 text-muted-foreground/60 shrink-0"
      />
    ),
  };

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(defaultProps, props),
    render,
  });
}

export interface DraggableTitleProps extends useRender.ComponentProps<"span"> {}

function DraggableTitle({
  className,
  render,
  children,
  ...props
}: DraggableTitleProps): React.ReactElement {
  const context = React.useContext(DraggableContext);

  const defaultProps = {
    id: context?.titleId,
    className: cn("font-semibold truncate text-xs", className),
    "data-slot": "draggable-title",
    children: children || "Draggable Panel",
  };

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(defaultProps, props),
    render,
  });
}

export interface DraggableControlsProps extends useRender.ComponentProps<"div"> {}

function DraggableControls({
  className,
  render,
  children,
  minimizeIcon,
  restoreIcon,
  maximizeIcon,
  closeIcon,
  ...props
}: DraggableControlsProps & {
  /** Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`. */
  minimizeIcon?: React.ReactNode;
  /** Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`. */
  restoreIcon?: React.ReactNode;
  /** Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`. */
  maximizeIcon?: React.ReactNode;
  /** Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`. */
  closeIcon?: React.ReactNode;
}): React.ReactElement {
  const context = React.useContext(DraggableContext);

  const defaultProps = {
    className: cn("flex items-center gap-1 shrink-0", className),
    onPointerDown: (e: React.PointerEvent) => e.stopPropagation(),
    "data-slot": "draggable-controls",
    children: children || (
      <>
        <button
          type="button"
          onClick={context?.onToggleMinimize}
          aria-pressed={context?.isMinimized ?? false}
          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors pointer-coarse:after:absolute pointer-coarse:after:size-11"
          aria-label="Minimize"
        >
          <IconSlot
            name="MinusSign"
            icon={minimizeIcon}
            fallback={Minus}
            className="size-3"
          />
        </button>
        <button
          type="button"
          onClick={context?.onToggleMaximize}
          aria-pressed={context?.isMaximized ?? false}
          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors pointer-coarse:after:absolute pointer-coarse:after:size-11"
          aria-label="Maximize"
        >
          {context?.isMaximized ? (
            <IconSlot
              name="ArrowShrinkDiagonalUpRight"
              icon={restoreIcon}
              fallback={Minimize2}
              className="size-3"
            />
          ) : (
            <IconSlot
              name="ArrowExpandDiagonalUpRight"
              icon={maximizeIcon}
              fallback={Maximize2}
              className="size-3"
            />
          )}
        </button>
        <button
          type="button"
          onClick={context?.onClose}
          className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors pointer-coarse:after:absolute pointer-coarse:after:size-11"
          aria-label="Close"
        >
          <IconSlot
            name="Cancel"
            icon={closeIcon}
            fallback={X}
            className="size-3"
          />
        </button>
      </>
    ),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export interface DraggableBodyProps extends useRender.ComponentProps<"div"> {}

function DraggableBody({
  className,
  render,
  children,
  ...props
}: DraggableBodyProps): React.ReactElement | null {
  const context = React.useContext(DraggableContext);

  const defaultProps = {
    className: cn(
      "flex-1 p-3 overflow-y-auto text-xs text-foreground",
      className,
    ),
    "data-slot": "draggable-body",
    children,
  };

  const renderedElement = useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });

  if (context?.isMinimized) return null;
  return renderedElement;
}

export interface DraggableFooterProps extends useRender.ComponentProps<"div"> {}

function DraggableFooter({
  className,
  render,
  children,
  ...props
}: DraggableFooterProps): React.ReactElement | null {
  const context = React.useContext(DraggableContext);

  const defaultProps = {
    className: cn(
      "flex items-center justify-end gap-2 px-3 py-2 border-t border-border/40 bg-muted/20 text-xs shrink-0",
      className,
    ),
    "data-slot": "draggable-footer",
    children,
  };

  const renderedElement = useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });

  if (context?.isMinimized) return null;
  return renderedElement;
}

export interface DraggableResizeHandleProps extends useRender.ComponentProps<"div"> {}

function DraggableResizeHandle({
  className,
  render,
  ...props
}: DraggableResizeHandleProps): React.ReactElement {
  const defaultProps = {
    className: cn(
      "absolute bottom-1 right-1 size-4 cursor-se-resize flex items-center justify-center rounded-sm opacity-40 hover:opacity-100 focus-visible:opacity-100 transition-opacity touch-none outline-none focus-visible:ring-2 focus-visible:ring-ring pointer-coarse:after:absolute pointer-coarse:after:size-8",
      className,
    ),
    "data-slot": "draggable-resize-handle",
    role: "button",
    tabIndex: 0,
    "aria-label": "Resize panel",
    "aria-keyshortcuts": "ArrowUp ArrowDown ArrowLeft ArrowRight",
    children: (
      <svg
        aria-hidden="true"
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
  Draggable,
  DraggableBody,
  DraggableControls,
  DraggableFooter,
  DraggableHandle,
  DraggableHeader,
  DraggableResizeHandle,
  DraggableTitle,
};
