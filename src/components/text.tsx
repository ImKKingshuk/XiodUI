"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type * as React from "react";

const textVariants = cva("", {
  variants: {
    variant: {
      heading1: "text-3xl font-semibold tracking-tight",
      heading2: "text-2xl font-semibold tracking-tight",
      heading3: "text-xl font-semibold tracking-tight",
      heading4: "text-lg font-semibold tracking-tight",
      body: "text-foreground",
      secondary: "text-muted-foreground",
      success: "text-success-foreground",
      error: "text-destructive-foreground",
      warning: "text-warning-foreground",
      info: "text-info-foreground",
      mono: "font-mono text-foreground",
      "mono-secondary": "font-mono text-muted-foreground",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm sm:text-xs",
      default: "text-base sm:text-sm",
      lg: "text-lg sm:text-base",
      xl: "text-xl sm:text-lg",
      none: "",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    truncate: {
      true: "truncate min-w-0",
    },
  },
  defaultVariants: {
    variant: "body",
    size: "default",
  },
});

export interface TextProps
  extends useRender.ComponentProps<"p">, VariantProps<typeof textVariants> {}

function Text({
  className,
  variant,
  size,
  weight,
  truncate,
  render,
  ...props
}: TextProps): React.ReactElement {
  let defaultTagName: React.ElementType = "p";

  if (variant === "heading1") defaultTagName = "h1";
  else if (variant === "heading2") defaultTagName = "h2";
  else if (variant === "heading3") defaultTagName = "h3";
  else if (variant === "heading4") defaultTagName = "h4";
  else if (variant === "mono" || variant === "mono-secondary")
    defaultTagName = "span";

  // If a heading variant is selected, default to size "none" to preserve heading native sizes
  const effectiveSize = variant?.startsWith("heading") && !size ? "none" : size;

  const defaultProps = {
    className: cn(
      textVariants({
        variant,
        size: effectiveSize,
        weight,
        truncate,
        className,
      }),
    ),
    "data-slot": "text",
  };

  return useRender({
    defaultTagName,
    props: mergeProps<"p">(defaultProps, props as React.ComponentProps<"p">),
    render,
  });
}

export { Text, textVariants };
