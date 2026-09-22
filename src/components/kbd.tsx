"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "cn";
import type * as React from "react";

function Kbd({
  className,
  render,
  ...props
}: useRender.ComponentProps<"kbd">): React.ReactElement {
  const defaultProps = {
    className: cn(
      "pointer-events-none relative inline-flex h-5 min-w-5 select-none items-center justify-center gap-1 rounded-sm border border-input border-b-2 bg-popover px-1.5 font-medium font-sans text-muted-foreground text-[10px] shadow-xs/5 before:absolute before:inset-0 before:pointer-events-none before:rounded-[inherit] before:shadow-[0_1px_var(--border)] [&_svg:not([class*='size-'])]:size-3",
      className,
    ),
    "data-slot": "kbd",
  };

  return useRender({
    defaultTagName: "kbd",
    props: mergeProps<"kbd">(defaultProps, props),
    render,
  });
}

function KbdGroup({
  className,
  render,
  ...props
}: useRender.ComponentProps<"kbd">): React.ReactElement {
  const defaultProps = {
    className: cn("inline-flex items-center gap-1", className),
    "data-slot": "kbd-group",
  };

  return useRender({
    defaultTagName: "kbd",
    props: mergeProps<"kbd">(defaultProps, props),
    render,
  });
}

export { Kbd, KbdGroup };
