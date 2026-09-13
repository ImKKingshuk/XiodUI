"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type * as React from "react";

const switchVariants = cva(
  "relative inline-flex shrink-0 items-center rounded-full p-px outline-none transition-[background-color,box-shadow,inset-shadow] duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background data-checked:bg-primary data-checked:not-data-disabled:inset-shadow-[0_1px_--alpha(var(--primary-foreground)/16%)] data-checked:shadow-primary/24 data-checked:shadow-xs data-unchecked:bg-input data-unchecked:inset-shadow-[0_1px_var(--border)] data-disabled:pointer-events-none data-disabled:opacity-64 pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11",
  {
    variants: {
      size: {
        sm: "[--thumb-size:--spacing(4)] sm:[--thumb-size:--spacing(3.5)]",
        md: "[--thumb-size:--spacing(5)] sm:[--thumb-size:--spacing(4)]",
        lg: "[--thumb-size:--spacing(6)] sm:[--thumb-size:--spacing(5)]",
        xl: "[--thumb-size:--spacing(7)] sm:[--thumb-size:--spacing(6)]",
        "2xl": "[--thumb-size:--spacing(8)] sm:[--thumb-size:--spacing(7)]",
      },
      variant: {
        default:
          "h-[calc(var(--thumb-size)+2px)] w-[calc(var(--thumb-size)*2.5+2px)]",
        classic:
          "h-[calc(var(--thumb-size)+2px)] w-[calc(var(--thumb-size)*2-2px)]",
        expressive:
          "h-[calc(var(--thumb-size)+2px)] w-[calc(var(--thumb-size)*2-2px)]",
        sharp:
          "rounded-md h-[calc(var(--thumb-size)+2px)] w-[calc(var(--thumb-size)*2-2px)]",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);

const switchThumbVariants = cva(
  "pointer-events-none relative flex h-full origin-left items-center justify-center rounded-full bg-background shadow-xs border border-black/8 dark:border-white/8 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)] will-change-transform",
  {
    variants: {
      variant: {
        default:
          "block w-[calc(var(--thumb-size)*1.5)] border-[0.5px] border-black/5 dark:border-white/5 [transition:translate_.15s,scale_.1s_.1s,transform-origin_.15s] in-[[role=switch]:active,[data-slot=label]:active,[data-slot=field-label]:active]:not-data-disabled:scale-x-125 data-checked:origin-[calc(var(--thumb-size)*1.3)_50%] data-checked:translate-x-[calc(var(--thumb-size))]",
        classic:
          "block aspect-square in-[[role=switch]:active,[data-slot=label]:active,[data-slot=field-label]:active]:not-data-disabled:scale-x-110 in-[[role=switch]:active,[data-slot=label]:active,[data-slot=field-label]:active]:rounded-[var(--thumb-size)/calc(var(--thumb-size)*1.1)] rounded-(--thumb-size) [transition:translate_.15s,border-radius_.15s,scale_.1s_.1s,transform-origin_.15s] data-checked:origin-[var(--thumb-size)_50%] data-checked:translate-x-[calc(var(--thumb-size)-4px)]",
        expressive:
          "aspect-square origin-center scale-60 in-[[role=switch]:active,[data-slot=label]:active,[data-slot=field-label]:active]:not-data-disabled:scale-75 [transition:translate_.15s,scale_.15s,transform-origin_.15s] data-checked:scale-100 data-checked:translate-x-[calc(var(--thumb-size)-4px)]",
        sharp:
          "block aspect-square rounded-sm in-[[role=switch]:active,[data-slot=label]:active,[data-slot=field-label]:active]:not-data-disabled:scale-x-110 in-[[role=switch]:active,[data-slot=label]:active,[data-slot=field-label]:active]:rounded-md [transition:translate_.15s,border-radius_.15s,scale_.1s_.1s,transform-origin_.15s] data-checked:origin-[var(--thumb-size)_50%] data-checked:translate-x-[calc(var(--thumb-size)-4px)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface SwitchProps
  extends SwitchPrimitive.Root.Props, VariantProps<typeof switchVariants> {}

function Switch({
  className,
  size,
  variant,
  ...props
}: SwitchProps): React.JSX.Element {
  return (
    <SwitchPrimitive.Root
      className={cn(switchVariants({ size, variant }), className)}
      data-slot="switch"
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(switchThumbVariants({ variant }))}
        data-slot="switch-thumb"
      >
        {variant === "expressive" && (
          <svg
            className="size-[calc(var(--thumb-size)*0.75)] text-primary transition-opacity duration-150 opacity-0 in-data-checked:opacity-100"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            viewBox="0 0 24 24"
            data-slot="switch-icon"
          >
            <path d="M5.252 12.7 10.2 18.63 18.748 5.37" />
          </svg>
        )}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

export { Switch, switchThumbVariants, switchVariants };
