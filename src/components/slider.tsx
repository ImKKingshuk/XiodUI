"use client";

import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import * as React from "react";

const sliderVariants = cva("", {
  variants: {
    variant: {
      default: "",
      expressive: "",
      classic: "",
      fader: "",
      segmented: "",
      dotted: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface SliderProps
  extends SliderPrimitive.Root.Props, VariantProps<typeof sliderVariants> {}

function Slider({
  className,
  children,
  defaultValue,
  value,
  min = 0,
  max = 100,
  variant,
  orientation = "horizontal",
  ...props
}: SliderProps): React.JSX.Element {
  const _values = React.useMemo(() => {
    if (value !== undefined) {
      return Array.isArray(value) ? value : [value];
    }
    if (defaultValue !== undefined) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    }
    return [min];
  }, [value, defaultValue, min]);

  const maskStyle = React.useMemo(() => {
    if (variant !== "segmented" && variant !== "dotted") return {};
    const isHorizontal = orientation === "horizontal";

    if (variant === "segmented") {
      const svg = isHorizontal
        ? `<svg viewBox="0 0 6 24" xmlns="http://www.w3.org/2000/svg"><rect x="1.5" y="0" width="3" height="24" rx="1.5" fill="black"/></svg>`
        : `<svg viewBox="0 0 24 6" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="1.5" width="24" height="3" rx="1.5" fill="black"/></svg>`;

      const maskUrl = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;

      return {
        maskImage: maskUrl,
        WebkitMaskImage: maskUrl,
        maskRepeat: isHorizontal ? "repeat-x" : "repeat-y",
        WebkitMaskRepeat: isHorizontal ? "repeat-x" : "repeat-y",
        maskSize: isHorizontal ? "6px 100%" : "100% 6px",
        WebkitMaskSize: isHorizontal ? "6px 100%" : "100% 6px",
        maskPosition: isHorizontal ? "left center" : "center bottom",
        WebkitMaskPosition: isHorizontal ? "left center" : "center bottom",
      };
    } else {
      // Dotted variant: larger dots (circle r=2.8 in 8x8 viewBox)
      const svg = `<svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg"><circle cx="4" cy="4" r="2.8" fill="black"/></svg>`;
      const maskUrl = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;

      return {
        maskImage: maskUrl,
        WebkitMaskImage: maskUrl,
        maskRepeat: isHorizontal ? "repeat-x" : "repeat-y",
        WebkitMaskRepeat: isHorizontal ? "repeat-x" : "repeat-y",
        maskSize: "8px 8px",
        WebkitMaskSize: "8px 8px",
        maskPosition: isHorizontal ? "left center" : "center bottom",
        WebkitMaskPosition: isHorizontal ? "left center" : "center bottom",
      };
    }
  }, [variant, orientation]);

  return (
    <SliderPrimitive.Root
      className={cn(
        "data-[orientation=horizontal]:w-full flex items-center data-dragging:cursor-grabbing",
        sliderVariants({ variant }),
        className,
      )}
      data-slot="slider"
      defaultValue={defaultValue}
      max={max}
      min={min}
      orientation={orientation}
      thumbAlignment={variant === "expressive" ? "center" : "edge-client-only"}
      value={value}
      {...props}
    >
      {children}
      <SliderPrimitive.Control
        className={cn(
          "group flex touch-none select-none data-disabled:pointer-events-none data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=horizontal]:w-full data-[orientation=horizontal]:min-w-44 data-[orientation=vertical]:flex-col data-disabled:opacity-64 relative items-center",
          variant === "fader" &&
            "bg-muted/40 dark:bg-muted/10 border border-border shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] p-0.5 rounded-xl data-[orientation=horizontal]:h-10 data-[orientation=vertical]:w-10 sm:data-[orientation=horizontal]:h-8 sm:data-[orientation=vertical]:w-8 overflow-hidden z-0 isolate",
          variant === "segmented" &&
            "bg-background dark:bg-muted/10 border border-border/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] rounded-2xl data-[orientation=horizontal]:h-10 data-[orientation=horizontal]:px-[calc(--spacing(2)-1px)] data-[orientation=vertical]:w-10 data-[orientation=vertical]:py-[calc(--spacing(3)-1px)] sm:data-[orientation=horizontal]:h-8 sm:data-[orientation=horizontal]:px-[calc(--spacing(2)-1px)] sm:data-[orientation=vertical]:w-8 sm:data-[orientation=vertical]:py-[calc(--spacing(2.5)-1px)] overflow-hidden z-0 isolate",
          variant === "dotted" &&
            "bg-background dark:bg-muted/10 border border-border/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] rounded-xl data-[orientation=horizontal]:h-5 data-[orientation=horizontal]:px-[calc(--spacing(1.5)-1px)] data-[orientation=vertical]:w-5 data-[orientation=vertical]:py-[calc(--spacing(1.5)-1px)] sm:data-[orientation=horizontal]:h-4 sm:data-[orientation=horizontal]:px-[calc(--spacing(1)-1px)] sm:data-[orientation=vertical]:w-4 sm:data-[orientation=vertical]:py-[calc(--spacing(1)-1px)] overflow-hidden z-0 isolate",
        )}
        data-slot="slider-control"
      >
        {/* Track */}
        <SliderPrimitive.Track
          className={cn(
            "relative grow select-none rounded-full transition-transform duration-200 ease-out origin-center",
            variant === "expressive"
              ? "bg-muted-foreground/20 data-[orientation=horizontal]:h-2 aria-orientation-vertical:w-2 overflow-hidden"
              : variant === "classic"
                ? "before:absolute before:rounded-full before:bg-input data-[orientation=horizontal]:h-1 data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-1 data-[orientation=horizontal]:before:inset-x-0.5 data-[orientation=vertical]:before:inset-x-0 data-[orientation=horizontal]:before:inset-y-0 data-[orientation=vertical]:before:inset-y-0.5"
                : variant === "fader"
                  ? "bg-transparent w-full h-full rounded-lg overflow-hidden"
                  : variant === "segmented"
                    ? "bg-linear-to-b from-muted-foreground/32 to-muted-foreground/18 dark:from-muted-foreground/24 dark:to-muted-foreground/12 data-[orientation=horizontal]:h-5 aria-orientation-vertical:w-5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=horizontal]:group-hover:scale-y-110 data-[orientation=horizontal]:group-data-dragging:scale-y-90 data-[orientation=vertical]:group-hover:scale-x-110 data-[orientation=vertical]:group-data-dragging:scale-x-90"
                    : variant === "dotted"
                      ? "bg-linear-to-b from-muted-foreground/32 to-muted-foreground/18 dark:from-muted-foreground/24 dark:to-muted-foreground/12 data-[orientation=horizontal]:h-2.5 sm:data-[orientation=horizontal]:h-2 aria-orientation-vertical:w-2.5 sm:aria-orientation-vertical:w-2 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full"
                      : "bg-muted-foreground/20 data-[orientation=horizontal]:h-5 aria-orientation-vertical:w-5 overflow-hidden",
          )}
          style={maskStyle}
          data-slot="slider-track"
        >
          {/* Active Fill Indicator */}
          <SliderPrimitive.Indicator
            className={cn(
              "relative select-none bg-primary rounded-full",
              "data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
              variant === "expressive"
                ? ""
                : variant === "classic"
                  ? "data-[orientation=horizontal]:ms-0.5 data-[orientation=vertical]:mb-0.5"
                  : variant === "fader"
                    ? "bg-foreground data-[orientation=horizontal]:rounded-s-lg data-[orientation=horizontal]:rounded-e-none data-[orientation=vertical]:rounded-b-none data-[orientation=vertical]:rounded-t-lg"
                    : variant === "segmented" || variant === "dotted"
                      ? "bg-linear-to-b from-foreground to-foreground/80 dark:from-foreground dark:to-foreground/90"
                      : "after:content-[''] after:absolute after:inset-0 after:bg-primary after:rounded-full data-[orientation=horizontal]:after:-right-4 data-[orientation=vertical]:after:-top-4",
            )}
            style={maskStyle}
            data-slot="slider-indicator"
          />
        </SliderPrimitive.Track>

        {/* Thumbs */}
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            className={cn(
              "block shrink-0 select-none bg-card bg-clip-padding border-2 border-transparent shadow-sm/5 outline-none transition-[box-shadow,scale,transform,height,width,border-radius] focus-visible:ring-4 hover:cursor-grab focus-visible:ring-primary/30 data-dragging:cursor-grabbing absolute data-[orientation=horizontal]:top-1/2 data-[orientation=horizontal]:-translate-y-1/2 aria-orientation-vertical:left-1/2 aria-orientation-vertical:-translate-x-1/2 z-10",
              variant === "expressive"
                ? "data-[orientation=horizontal]:h-6 data-[orientation=horizontal]:w-2 data-[orientation=horizontal]:rounded-full aria-orientation-vertical:w-6 aria-orientation-vertical:h-2 aria-orientation-vertical:rounded-full bg-primary border-none shadow-md/20 data-dragging:scale-x-150 data-dragging:scale-y-75 data-[orientation=vertical]:data-dragging:scale-y-150 data-[orientation=vertical]:data-dragging:scale-x-75"
                : variant === "classic"
                  ? "rounded-full border border-input bg-card shadow-xs/5 before:absolute before:inset-0 before:rounded-full before:shadow-[0_1px_var(--border)] focus-visible:ring-[3px] focus-visible:ring-ring/24 data-[orientation=horizontal]:h-4 data-[orientation=horizontal]:w-6 aria-orientation-vertical:w-4 aria-orientation-vertical:h-6 sm:data-[orientation=horizontal]:h-3.5 sm:data-[orientation=horizontal]:w-5 sm:aria-orientation-vertical:w-3.5 sm:aria-orientation-vertical:h-5 data-dragging:scale-95 dark:focus-visible:ring-ring/48 [:focus-visible,[data-dragging]]:shadow-none"
                  : variant === "fader"
                    ? "bg-foreground data-[orientation=horizontal]:rounded-lg data-[orientation=horizontal]:rounded-e-lg data-[orientation=vertical]:rounded-b-none data-[orientation=vertical]:rounded-t-lg border-0 shadow-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background hover:scale-105 data-dragging:scale-95 data-[orientation=horizontal]:h-[34px] data-[orientation=horizontal]:w-3 data-[orientation=vertical]:w-[34px] data-[orientation=vertical]:h-3 sm:data-[orientation=horizontal]:h-[26px] sm:data-[orientation=horizontal]:w-2.5 sm:data-[orientation=vertical]:w-[26px] sm:data-[orientation=vertical]:h-2.5 before:absolute before:bg-background before:rounded-full data-[orientation=horizontal]:before:w-[3px] data-[orientation=horizontal]:before:h-[22px] data-[orientation=horizontal]:before:top-1/2 data-[orientation=horizontal]:before:-translate-y-1/2 data-[orientation=horizontal]:before:right-1 sm:data-[orientation=horizontal]:before:h-[18px] data-[orientation=vertical]:before:h-[3px] data-[orientation=vertical]:before:w-[22px] data-[orientation=vertical]:before:left-1/2 data-[orientation=vertical]:before:-translate-x-1/2 data-[orientation=vertical]:before:top-1 sm:data-[orientation=vertical]:before:w-[18px] hover:before:bg-background/90"
                    : variant === "segmented"
                      ? "size-0 opacity-0 pointer-events-none border-0 outline-none"
                      : variant === "dotted"
                        ? "rounded-full bg-linear-to-b from-foreground to-foreground/80 dark:from-foreground dark:to-foreground/90 border-0 shadow-[0_1.5px_3px_rgba(0,0,0,0.15)] transition-[transform,scale,box-shadow] duration-200 ease-out hover:scale-125 data-dragging:scale-140 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-1 focus-visible:ring-offset-background data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:w-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=vertical]:h-2.5 sm:data-[orientation=horizontal]:h-2 sm:data-[orientation=horizontal]:w-2 sm:data-[orientation=vertical]:w-2 sm:data-[orientation=vertical]:h-2 cursor-grab data-dragging:cursor-grabbing"
                        : "rounded-full data-[orientation=horizontal]:h-5 data-[orientation=horizontal]:w-8 aria-orientation-vertical:w-5 aria-orientation-vertical:h-8 data-dragging:scale-95",
            )}
            data-slot="slider-thumb"
            index={index}
            key={String(index)}
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

function SliderValue({
  className,
  ...props
}: SliderPrimitive.Value.Props): React.JSX.Element {
  return (
    <SliderPrimitive.Value
      className={cn("flex justify-end text-sm", className)}
      data-slot="slider-value"
      {...props}
    />
  );
}

export { Slider, SliderValue, sliderVariants };
