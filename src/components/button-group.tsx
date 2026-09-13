"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type * as React from "react";

import { Separator } from "./separator";

const buttonGroupVariants = cva(
  "inline-flex w-fit items-stretch isolate *:relative *:focus-visible:z-10 *:hover:z-10 *:active:z-10",
  {
    defaultVariants: {
      orientation: "horizontal",
    },
    variants: {
      orientation: {
        horizontal:
          "flex-row [&>*:not(:first-child)]:-ms-px [&>*:first-child:not(:last-child)]:rounded-e-none [&>*:first-child:not(:last-child)]:before:rounded-e-none [&>*:last-child:not(:first-child)]:rounded-s-none [&>*:last-child:not(:first-child)]:before:rounded-s-none [&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:not(:first-child):not(:last-child)]:before:rounded-none",
        vertical:
          "flex-col [&>*:not(:first-child)]:-mt-px [&>*:first-child:not(:last-child)]:rounded-b-none [&>*:first-child:not(:last-child)]:before:rounded-b-none [&>*:last-child:not(:first-child)]:rounded-t-none [&>*:last-child:not(:first-child)]:before:rounded-t-none [&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:not(:first-child):not(:last-child)]:before:rounded-none",
      },
    },
  },
);

export interface ButtonGroupProps
  extends
    React.ComponentProps<"div">,
    VariantProps<typeof buttonGroupVariants> {}

function ButtonGroup({
  className,
  orientation,
  ...props
}: ButtonGroupProps): React.JSX.Element {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  );
}

function ButtonGroupText({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const defaultProps = {
    className: cn(
      "flex items-center gap-2 rounded-lg border border-input bg-muted/50 px-[calc(--spacing(3)-1px)] text-base font-medium text-muted-foreground sm:text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
      className,
    ),
    "data-slot": "button-group-text",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>): React.JSX.Element {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        "relative self-stretch bg-border",
        orientation === "vertical"
          ? "mx-px my-1.5 w-px h-auto"
          : "my-px mx-1.5 h-px w-auto",
        className,
      )}
      {...props}
    />
  );
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
};
