"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type * as React from "react";

import { badgeVariants } from "./badge";

const cornerBadgeVariants = cva(
  "absolute z-10 flex origin-center items-center justify-center whitespace-nowrap transition-[transform,opacity,scale] duration-200 ring-2 ring-background data-invisible:scale-0 data-invisible:opacity-0",
  {
    variants: {
      position: {
        "top-right": "top-0 right-0 -translate-y-1/2 translate-x-1/2",
        "top-left": "top-0 left-0 -translate-y-1/2 -translate-x-1/2",
        "bottom-right": "bottom-0 right-0 translate-y-1/2 translate-x-1/2",
        "bottom-left": "bottom-0 left-0 translate-y-1/2 -translate-x-1/2",
      },
      overlap: {
        rectangle: "",
        circular: "",
      },
      dot: {
        true: "size-3 min-w-3 p-0 sm:size-2.5 sm:min-w-2.5 rounded-full [&_svg]:hidden",
        false: "",
      },
    },
    compoundVariants: [
      {
        position: "top-right",
        overlap: "circular",
        className: "top-[14.6%] right-[14.6%] -translate-y-1/2 translate-x-1/2",
      },
      {
        position: "top-left",
        overlap: "circular",
        className: "top-[14.6%] left-[14.6%] -translate-y-1/2 -translate-x-1/2",
      },
      {
        position: "bottom-right",
        overlap: "circular",
        className:
          "bottom-[14.6%] right-[14.6%] translate-y-1/2 translate-x-1/2",
      },
      {
        position: "bottom-left",
        overlap: "circular",
        className:
          "bottom-[14.6%] left-[14.6%] translate-y-1/2 -translate-x-1/2",
      },
    ],
    defaultVariants: {
      position: "top-right",
      overlap: "rectangle",
      dot: false,
    },
  },
);

interface CornerBadgeProps extends useRender.ComponentProps<"span"> {
  variant?: VariantProps<typeof badgeVariants>["variant"];
  size?: VariantProps<typeof badgeVariants>["size"];
  position?: VariantProps<typeof cornerBadgeVariants>["position"];
  overlap?: VariantProps<typeof cornerBadgeVariants>["overlap"];
  dot?: boolean;
  invisible?: boolean;
}

function CornerBadge({
  className,
  variant,
  size,
  position,
  overlap,
  dot,
  invisible,
  render,
  ...props
}: CornerBadgeProps): React.ReactElement {
  const defaultProps = {
    className: cn(
      badgeVariants({ variant, size }),
      cornerBadgeVariants({ position, overlap, dot }),
      className,
    ),
    "data-invisible": invisible,
    "data-slot": "corner-badge",
  };

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(defaultProps, props),
    render,
  });
}

function CornerBadgeAnchor({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const defaultProps = {
    className: cn("relative inline-flex shrink-0 align-middle", className),
    "data-slot": "corner-badge-anchor",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export { CornerBadge, CornerBadgeAnchor, cornerBadgeVariants };
