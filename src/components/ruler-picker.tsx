"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import * as React from "react";

export const rulerPickerVariants = cva(
  "relative overflow-hidden bg-background border border-border/80 shadow-xs/5 select-none focus-within:ring-2 focus-within:ring-ring/30 focus-within:ring-offset-1 focus-within:ring-offset-background before:absolute before:inset-0 before:pointer-events-none before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)] not-dark:bg-clip-padding",
  {
    variants: {
      size: {
        sm: "h-14 rounded-xl before:rounded-[calc(var(--radius-xl)-1px)] w-full",
        md: "h-16 rounded-2xl before:rounded-[calc(var(--radius-2xl)-1px)] w-full",
        lg: "h-20 rounded-2xl before:rounded-[calc(var(--radius-2xl)-1px)] w-full",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const labelVariants = cva(
  "relative z-20 text-foreground font-semibold tabular-nums select-none origin-bottom transition-colors duration-200",
  {
    variants: {
      size: {
        sm: "text-[10px] mb-0.5",
        md: "text-xs mb-0.5",
        lg: "text-sm mb-1",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const tickContainerVariants = cva(
  "relative flex w-full items-end justify-center",
  {
    variants: {
      size: {
        sm: "h-3.5 mt-0.5",
        md: "h-4 mt-0.5",
        lg: "h-5 mt-1",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const majorTickVariants = cva(
  "w-[2px] rounded-t-full bg-muted-foreground/60",
  {
    variants: {
      size: {
        sm: "h-3",
        md: "h-4",
        lg: "h-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface RulerPickerProps
  extends
    Omit<
      React.ComponentPropsWithRef<"div">,
      "onChange" | "value" | "defaultValue"
    >,
    VariantProps<typeof rulerPickerVariants> {
  min?: number;
  max?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  itemWidth?: number;
  subDivisions?: number;
}

function RulerPicker({
  className,
  min = 0,
  max = 100,
  value,
  defaultValue,
  onChange,
  itemWidth = 80,
  subDivisions = 4,
  size = "md",
  ref,
  ...props
}: RulerPickerProps): React.JSX.Element {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const isMountedRef = React.useRef(false);
  const itemWidthRef = React.useRef(itemWidth);
  React.useEffect(() => {
    itemWidthRef.current = itemWidth;
  }, [itemWidth]);
  const internalValueRef = React.useRef<number | null>(null);
  const [activeValue, setActiveValue] = React.useState<number>(
    value !== undefined
      ? value
      : defaultValue !== undefined
        ? defaultValue
        : min,
  );

  // Synchronize external ref with local rootRef
  React.useImperativeHandle(ref, () => rootRef.current as HTMLDivElement);

  // Helper to calculate and apply inline styles to elements inside the scroll container
  const updateStyles = React.useCallback(
    (container: HTMLDivElement) => {
      const scrollLeft = container.scrollLeft;
      const children = container.children;
      const length = children.length;

      // The closest index to the center based on scroll position
      const closestIndex = Math.max(
        0,
        Math.min(length - 1, Math.round(scrollLeft / itemWidth)),
      );
      const closestVal = min + closestIndex;

      // Loop through all items and apply scale/opacity magnification using fast, layout-free math.
      for (let i = 0; i < length; i++) {
        const itemEl = children[i] as HTMLElement;
        if (!itemEl) continue;

        const distance = Math.abs(i * itemWidth - scrollLeft);
        const maxDistance = itemWidth * 1.2;
        const pct = Math.min(1, distance / maxDistance);

        const opacity = 1 - pct * 0.7; // Scale opacity from 1.0 to 0.3
        const scale = 1.1 - pct * 0.2; // Scale transform from 1.1 to 0.9

        // Access the label via direct child access (first element) to bypass querySelector lookups
        const label = itemEl.firstElementChild as HTMLElement;
        if (label && label.getAttribute("data-slot") === "ruler-picker-label") {
          label.style.opacity = opacity.toString();
          label.style.transform = `scale(${scale})`;
        }
      }

      return closestVal;
    },
    [min, itemWidth],
  );

  // Handle scroll events and report changes
  const onScroll = React.useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const container = e.currentTarget;
      const closestVal = updateStyles(container);

      if (closestVal !== internalValueRef.current) {
        internalValueRef.current = closestVal;
        setActiveValue(closestVal);
        onChange?.(closestVal);
      }
    },
    [updateStyles, onChange],
  );

  // Controlled scroll updates from parent component value changes
  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || value === undefined) return;

    const targetScrollLeft = (value - min) * itemWidth;
    const currentSnapped = Math.round(container.scrollLeft / itemWidth) + min;

    if (currentSnapped !== value) {
      container.scrollTo({
        left: targetScrollLeft,
        behavior: isMountedRef.current ? "smooth" : "instant",
      });
      updateStyles(container);
    }
  }, [value, min, itemWidth, updateStyles]);

  // Initial positioning on mount
  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const initialVal =
      value !== undefined
        ? value
        : defaultValue !== undefined
          ? defaultValue
          : min;
    const targetScrollLeft = (initialVal - min) * itemWidth;

    container.scrollLeft = targetScrollLeft;
    updateStyles(container);

    isMountedRef.current = true;
  }, [min, itemWidth, value, defaultValue, updateStyles]);

  // Translate vertical wheel scroll to horizontal container scroll and snap to the nearest tick upon completion
  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let snapTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleWheel = (e: WheelEvent) => {
      const scrollAmount = e.deltaY || e.deltaX;
      if (scrollAmount !== 0) {
        e.preventDefault();

        // Temporarily remove smooth class to allow responsive wheel scrolling
        container.classList.remove("scroll-smooth");
        container.scrollLeft += scrollAmount * 0.8;

        if (snapTimeout) {
          clearTimeout(snapTimeout);
        }

        // Snap to the nearest tick index after 150ms of inactivity
        snapTimeout = setTimeout(() => {
          container.classList.add("scroll-smooth");
          const closestIndex = Math.round(
            container.scrollLeft / itemWidthRef.current,
          );
          container.scrollTo({
            left: closestIndex * itemWidthRef.current,
            behavior: "smooth",
          });
        }, 150);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
      if (snapTimeout) {
        clearTimeout(snapTimeout);
      }
    };
  }, []);

  // Support drag-to-scroll with mouse on desktop
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    e.preventDefault();
    // Disable snapping and smooth scrolling temporarily while dragging
    container.classList.remove("scroll-smooth", "snap-x", "snap-mandatory");
    const startX = e.pageX - container.offsetLeft;
    const startScrollLeft = container.scrollLeft;

    let isMoving = false;

    const onMouseMove = (moveEvent: MouseEvent) => {
      isMoving = true;
      document.body.style.cursor = "grabbing";
      const x = moveEvent.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = startScrollLeft - walk;
    };

    const onMouseUp = () => {
      document.body.style.cursor = "";
      container.classList.add("scroll-smooth", "snap-x", "snap-mandatory");

      if (isMoving) {
        const scrollLeft = container.scrollLeft;
        const closestValue = Math.round(scrollLeft / itemWidth) * itemWidth;
        container.scrollTo({ left: closestValue, behavior: "smooth" });
      }

      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // Keyboard navigation support
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      const currentSnapped = Math.round(container.scrollLeft / itemWidth);
      const nextSnapped = Math.min(max - min, currentSnapped + 1);
      container.scrollTo({ left: nextSnapped * itemWidth, behavior: "smooth" });
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const currentSnapped = Math.round(container.scrollLeft / itemWidth);
      const prevSnapped = Math.max(0, currentSnapped - 1);
      container.scrollTo({ left: prevSnapped * itemWidth, behavior: "smooth" });
    }
  };

  const range = max - min;

  return (
    <div
      ref={rootRef}
      className={cn(rulerPickerVariants({ size }), className)}
      onMouseDown={onMouseDown}
      onKeyDown={onKeyDown}
      tabIndex={0}
      aria-label="Ruler Picker"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={activeValue}
      role="slider"
      data-slot="ruler-picker"
      {...props}
    >
      {/* Center needle indicator */}
      <div
        className="pointer-events-none absolute inset-y-0 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center"
        data-slot="ruler-picker-indicator"
      >
        <div
          className={cn(
            "bg-primary shadow-xs/5 rounded-b-xs",
            size === "sm"
              ? "h-2 w-3.5"
              : size === "lg"
                ? "h-3.5 w-6"
                : "h-2.5 w-4.5",
          )}
          style={{ clipPath: "polygon(0 0, 100% 0, 70% 100%, 30% 100%)" }}
        />
        <div
          className={cn(
            "w-[1.5px] grow bg-primary",
            size === "sm" && "w-px",
            size === "lg" && "w-[2px]",
          )}
        />
      </div>

      {/* Horizontal scroll timeline */}
      <div
        ref={scrollContainerRef}
        onScroll={onScroll}
        className={cn(
          "h-full w-full overflow-x-auto flex items-end snap-x snap-mandatory scroll-smooth scrollbar-none cursor-grab active:cursor-grabbing",
          size === "lg" ? "pb-2" : "pb-1.5",
        )}
        style={{
          paddingLeft: `calc(50% - ${itemWidth / 2}px)`,
          paddingRight: `calc(50% - ${itemWidth / 2}px)`,
        }}
        data-slot="ruler-picker-track"
      >
        {Array.from({ length: range + 1 }, (_, index) => {
          const val = min + index;
          return (
            <div
              key={val}
              className="flex flex-col justify-end items-center h-full shrink-0 relative"
              style={{ width: itemWidth }}
              data-slot="ruler-picker-item"
              data-value={val}
            >
              <span
                className={labelVariants({ size })}
                data-slot="ruler-picker-label"
              >
                {val}
              </span>

              <div
                className={tickContainerVariants({ size })}
                data-slot="ruler-picker-ticks"
              >
                {/* Major Tick Mark */}
                <div className={majorTickVariants({ size })} />

                {/* Minor Sub-Divisions */}
                {val !== max &&
                  Array.from({ length: subDivisions }).map(
                    (_subdivision, idx) => {
                      const stepPercent =
                        ((idx + 1) / (subDivisions + 1)) * 100;
                      const isMedium = subDivisions === 9 && idx === 4;
                      return (
                        <div
                          key={idx}
                          className={cn(
                            "absolute bottom-0 -translate-x-1/2 w-[1.2px] rounded-t-full bg-muted-foreground/30",
                            size === "sm"
                              ? isMedium
                                ? "h-2 bg-muted-foreground/45"
                                : "h-1.5"
                              : size === "lg"
                                ? isMedium
                                  ? "h-4 bg-muted-foreground/45"
                                  : "h-3"
                                : isMedium
                                  ? "h-3 bg-muted-foreground/45"
                                  : "h-2",
                          )}
                          style={{ left: `calc(50% + ${stepPercent}%)` }}
                        />
                      );
                    },
                  )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Fading side overlays */}
      <div
        className={cn(
          "from-background via-background/50 pointer-events-none absolute inset-y-0 left-0 z-30 bg-linear-to-r to-transparent",
          size === "sm" ? "w-12" : size === "lg" ? "w-20" : "w-16",
        )}
      />
      <div
        className={cn(
          "from-background via-background/50 pointer-events-none absolute inset-y-0 right-0 z-30 bg-linear-to-l to-transparent",
          size === "sm" ? "w-12" : size === "lg" ? "w-20" : "w-16",
        )}
      />
    </div>
  );
}

export { RulerPicker };
