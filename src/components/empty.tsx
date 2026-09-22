"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type * as React from "react";

function Empty({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const defaultProps = {
    className: cn(
      "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 text-balance p-6 text-center md:p-12",
      className,
    ),
    "data-slot": "empty",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

function EmptyHeader({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const defaultProps = {
    className: cn("flex max-w-sm flex-col items-center text-center", className),
    "data-slot": "empty-header",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export const emptyMediaVariants = cva(
  "flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "relative flex size-9 shrink-0 items-center justify-center rounded-md border bg-card not-dark:bg-clip-padding text-foreground shadow-sm/5 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-md)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)] [&_svg:not([class*='size-'])]:size-4.5",
      },
    },
  },
);

interface EmptyMediaProps
  extends
    useRender.ComponentProps<"div">,
    VariantProps<typeof emptyMediaVariants> {}

function EmptyMedia({
  className,
  variant = "default",
  children,
  render,
  ...props
}: EmptyMediaProps): React.ReactElement {
  const defaultProps = {
    className: cn("relative mb-6", className),
    "data-slot": "empty-media",
    "data-variant": variant,
    children: (
      <>
        {variant === "icon" && (
          <>
            <div
              aria-hidden="true"
              className={cn(
                emptyMediaVariants({ className, variant }),
                "-translate-x-0.5 -rotate-10 pointer-events-none absolute bottom-px origin-bottom-left scale-84 shadow-none",
              )}
            />
            <div
              aria-hidden="true"
              className={cn(
                emptyMediaVariants({ className, variant }),
                "pointer-events-none absolute bottom-px origin-bottom-right translate-x-0.5 rotate-10 scale-84 shadow-none",
              )}
            />
          </>
        )}
        <div className={cn(emptyMediaVariants({ className, variant }))}>
          {children}
        </div>
      </>
    ),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

function EmptyTitle({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const defaultProps = {
    className: cn("font-heading font-semibold text-xl", className),
    "data-slot": "empty-title",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

function EmptyDescription({
  className,
  render,
  ...props
}: useRender.ComponentProps<"p">): React.ReactElement {
  const defaultProps = {
    className: cn(
      "text-muted-foreground text-sm [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4 [[data-slot=empty-title]+&]:mt-1",
      className,
    ),
    "data-slot": "empty-description",
  };

  return useRender({
    defaultTagName: "p",
    props: mergeProps<"p">(defaultProps, props),
    render,
  });
}

function EmptyContent({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const defaultProps = {
    className: cn(
      "flex w-full min-w-0 max-w-sm flex-col items-center gap-4 text-balance text-sm",
      className,
    ),
    "data-slot": "empty-content",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export type { EmptyMediaProps };
export {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
};
