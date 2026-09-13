"use client";

import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type * as React from "react";

const scrollBarVariants = cva(
  "m-1 flex select-none touch-none transition-[opacity,width,height] duration-200 ease-out opacity-0 z-50",
  {
    variants: {
      size: {
        sm: "data-[orientation=horizontal]:h-1 data-[orientation=vertical]:w-1 data-hovering:data-[orientation=horizontal]:h-1.5 data-hovering:data-[orientation=vertical]:w-1.5 data-scrolling:data-[orientation=horizontal]:h-1.5 data-scrolling:data-[orientation=vertical]:w-1.5",
        md: "data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:w-1.5 data-hovering:data-[orientation=horizontal]:h-2.5 data-hovering:data-[orientation=vertical]:w-2.5 data-scrolling:data-[orientation=horizontal]:h-2.5 data-scrolling:data-[orientation=vertical]:w-2.5",
        lg: "data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-hovering:data-[orientation=horizontal]:h-3.5 data-hovering:data-[orientation=vertical]:w-3.5 data-scrolling:data-[orientation=horizontal]:h-3.5 data-scrolling:data-[orientation=vertical]:w-3.5",
      },
      variant: {
        default: "bg-transparent",
        card: "bg-muted/30 border border-border/40 rounded-full",
      },
      visibility: {
        auto: "delay-300 data-hovering:opacity-100 data-scrolling:opacity-100 data-hovering:delay-0 data-scrolling:delay-0 data-hovering:duration-100 data-scrolling:duration-100",
        always: "opacity-100",
        hover:
          "data-hovering:opacity-100 data-hovering:delay-0 data-hovering:duration-100",
      },
    },
    defaultVariants: {
      size: "sm",
      variant: "default",
      visibility: "auto",
    },
  },
);

export interface ScrollBarProps
  extends
    ScrollAreaPrimitive.Scrollbar.Props,
    VariantProps<typeof scrollBarVariants> {}

function ScrollBar({
  className,
  orientation = "vertical",
  size,
  variant,
  visibility,
  ...props
}: ScrollBarProps): React.JSX.Element {
  return (
    <ScrollAreaPrimitive.Scrollbar
      className={cn(
        scrollBarVariants({ size, variant, visibility }),
        className,
      )}
      data-slot="scroll-bar"
      orientation={orientation}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        className={cn(
          "relative flex-1 rounded-full bg-foreground/20 transition-[background-color,transform] duration-150 ease-out cursor-grab active:cursor-grabbing hover:bg-foreground/35 active:bg-foreground/50",
          "after:absolute after:inset-0 in-[[data-slot=scroll-bar][data-orientation=vertical]]:after:-inset-x-2.5 in-[[data-slot=scroll-bar][data-orientation=horizontal]]:after:-inset-y-2.5 pointer-coarse:in-[[data-slot=scroll-bar][data-orientation=vertical]]:after:-inset-x-4 pointer-coarse:in-[[data-slot=scroll-bar][data-orientation=horizontal]]:after:-inset-y-4",
        )}
        data-slot="scroll-bar-thumb"
      />
    </ScrollAreaPrimitive.Scrollbar>
  );
}

export { ScrollBar, scrollBarVariants };
