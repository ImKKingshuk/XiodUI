"use client";

import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import { cn } from "cn";
import type * as React from "react";

import { ScrollBar, type ScrollBarProps } from "./scroll-bar";

function ScrollArea({
  className,
  children,
  scrollFade = false,
  scrollbarGutter = false,
  scrollbarSize = "sm",
  scrollbarVariant = "default",
  scrollbarVisibility = "auto",
  ...props
}: ScrollAreaPrimitive.Root.Props & {
  scrollFade?: boolean;
  scrollbarGutter?: boolean;
  scrollbarSize?: ScrollBarProps["size"];
  scrollbarVariant?: ScrollBarProps["variant"];
  scrollbarVisibility?: ScrollBarProps["visibility"];
}): React.JSX.Element {
  return (
    <ScrollAreaPrimitive.Root
      className={cn("size-full min-h-0", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        className={cn(
          "h-full overscroll-contain rounded-[inherit] outline-none transition-shadows focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background data-has-overflow-x:overscroll-x-contain",
          scrollFade &&
            "mask-t-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-start)))] mask-b-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-y-end)))] mask-l-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-start)))] mask-r-from-[calc(100%-min(var(--fade-size),var(--scroll-area-overflow-x-end)))] [--fade-size:1.5rem]",
          scrollbarGutter &&
            "data-has-overflow-y:pe-2.5 data-has-overflow-x:pb-2.5",
        )}
        data-slot="scroll-area-viewport"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar
        orientation="vertical"
        size={scrollbarSize}
        variant={scrollbarVariant}
        visibility={scrollbarVisibility}
      />
      <ScrollBar
        orientation="horizontal"
        size={scrollbarSize}
        variant={scrollbarVariant}
        visibility={scrollbarVisibility}
      />
      <ScrollAreaPrimitive.Corner data-slot="scroll-area-corner" />
    </ScrollAreaPrimitive.Root>
  );
}

export { ScrollArea, ScrollBar };
