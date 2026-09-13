"use client";

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type * as React from "react";

const avatarVariants = cva(
  "inline-flex shrink-0 select-none items-center justify-center overflow-hidden bg-background align-middle font-medium text-xs",
  {
    variants: {
      size: {
        xs: "size-6 text-[10px]",
        sm: "size-8 text-xs",
        md: "size-10 text-sm",
        lg: "size-12 text-base",
        xl: "size-16 text-lg",
        "2xl": "size-20 text-xl",
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-md",
      },
    },
    defaultVariants: {
      size: "md",
      shape: "circle",
    },
  },
);

export interface AvatarProps
  extends
    React.ComponentProps<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {}

function Avatar({
  className,
  size,
  shape,
  ...props
}: AvatarProps): React.JSX.Element {
  return (
    <AvatarPrimitive.Root
      className={cn(avatarVariants({ size, shape }), className)}
      data-slot="avatar"
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>): React.JSX.Element {
  return (
    <AvatarPrimitive.Image
      className={cn("size-full object-cover", className)}
      data-slot="avatar-image"
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>): React.JSX.Element {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        "flex size-full items-center justify-center bg-muted text-muted-foreground",
        className,
      )}
      data-slot="avatar-fallback"
      {...props}
    />
  );
}

export interface AvatarGroupProps extends useRender.ComponentProps<"div"> {}

function AvatarGroup({
  className,
  render,
  ...props
}: AvatarGroupProps): React.ReactElement {
  const rootProps = {
    className: cn(
      "flex items-center -space-x-2 *:ring-2 *:ring-background",
      className,
    ),
    "data-slot": "avatar-group",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(rootProps, props),
    render,
  });
}

export { Avatar, AvatarFallback, AvatarGroup, AvatarImage, avatarVariants };
