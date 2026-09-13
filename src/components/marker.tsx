"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type * as React from "react";

export const markerVariants = cva(
  "group/marker relative flex min-h-4 w-full items-center gap-2 text-left text-muted-foreground transition-colors [a]:underline [a]:underline-offset-3 [a]:hover:text-foreground",
  {
    variants: {
      variant: {
        default: "",
        separator:
          "before:mr-1.5 before:h-px before:min-w-0 before:flex-1 before:bg-border after:ml-1.5 after:h-px after:min-w-0 after:flex-1 after:bg-border",
        border: "border-b border-border pb-2",
      },
      size: {
        default: "text-sm",
        sm: "text-xs",
        lg: "text-base font-semibold text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface MarkerProps
  extends
    useRender.ComponentProps<"div">,
    VariantProps<typeof markerVariants> {}

export function Marker({
  className,
  variant = "default",
  size = "default",
  render,
  ...props
}: MarkerProps): React.ReactElement {
  const defaultProps = {
    className: cn(markerVariants({ variant, size, className })),
    "data-slot": "marker",
    "data-variant": variant,
    "data-size": size,
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export interface MarkerIconProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function MarkerIcon({
  className,
  ...props
}: MarkerIconProps): React.JSX.Element {
  return (
    <span
      data-slot="marker-icon"
      aria-hidden="true"
      className={cn(
        "shrink-0 flex items-center justify-center text-muted-foreground/80 group-data-[size=sm]/marker:size-3.5 group-data-[size=default]/marker:size-4 group-data-[size=lg]/marker:size-5 [&_svg:not([class*='size-'])]:size-full",
        className,
      )}
      {...props}
    />
  );
}

export interface MarkerContentProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function MarkerContent({
  className,
  ...props
}: MarkerContentProps): React.JSX.Element {
  return (
    <span
      data-slot="marker-content"
      className={cn(
        "min-w-0 break-words group-data-[variant=separator]/marker:flex-none group-data-[variant=separator]/marker:text-center",
        className,
      )}
      {...props}
    />
  );
}
