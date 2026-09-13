"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type * as React from "react";

function CheckboxGroup({
  className,
  ...props
}: CheckboxGroupPrimitive.Props): React.JSX.Element {
  return (
    <CheckboxGroupPrimitive
      className={cn("flex flex-col items-start gap-3", className)}
      data-slot="checkbox-group"
      {...props}
    />
  );
}

const checkboxItemVariants = cva(
  "relative inline-flex size-4.5 shrink-0 items-center justify-center border border-input bg-background not-dark:bg-clip-padding shadow-xs/5 outline-none ring-ring transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:shadow-[0_1px_var(--border)] not-data-checked:not-data-disabled:inset-shadow-[0_1.5px_3px_var(--input)] pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-background aria-invalid:border-destructive/36 focus-visible:aria-invalid:border-destructive/64 focus-visible:aria-invalid:ring-destructive/48 data-disabled:opacity-64 sm:size-4 dark:not-data-checked:bg-input/32 dark:aria-invalid:ring-destructive/24 [[data-disabled],[data-checked],[aria-invalid]]:shadow-none",
  {
    variants: {
      variant: {
        default: "rounded-[.25rem] before:rounded-[3px]",
        diamond: "rotate-45 rounded-[.35rem] before:rounded-[5px]",
        expressive: "rounded-full before:rounded-full",
        sharp: "rounded-none before:rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const checkboxIndicatorVariants = cva(
  "-inset-px absolute flex items-center justify-center pointer-events-none transition-[transform,opacity,background-color] duration-200 ease-out data-unchecked:scale-50 data-unchecked:opacity-0 data-checked:scale-100 data-checked:opacity-100 data-checked:bg-primary data-checked:text-primary-foreground data-checked:inset-shadow-[0_1px_--alpha(var(--primary-foreground)/16%)] data-checked:shadow-primary/24 data-checked:shadow-xs data-indeterminate:scale-100 data-indeterminate:opacity-100 data-indeterminate:bg-primary data-indeterminate:text-primary-foreground data-indeterminate:inset-shadow-[0_1px_--alpha(var(--primary-foreground)/16%)] data-indeterminate:shadow-primary/24 data-indeterminate:shadow-xs",
  {
    variants: {
      variant: {
        default: "rounded-[.25rem]",
        diamond: "rounded-[.35rem]",
        expressive: "rounded-full",
        sharp: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface CheckboxProps
  extends
    CheckboxPrimitive.Root.Props,
    VariantProps<typeof checkboxItemVariants> {}

function Checkbox({
  className,
  variant,
  ...props
}: CheckboxProps): React.JSX.Element {
  return (
    <CheckboxPrimitive.Root
      className={cn(checkboxItemVariants({ variant }), className)}
      data-slot="checkbox"
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn(checkboxIndicatorVariants({ variant }))}
        data-slot="checkbox-indicator"
        keepMounted
        render={(indicatorProps, state) => (
          <span {...indicatorProps}>
            {state.indeterminate ? (
              <svg
                className={cn(
                  "size-3.5 sm:size-3",
                  variant === "diamond" && "-rotate-45",
                )}
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  className="transition-[stroke-dashoffset] duration-200 ease-out"
                  d="M5.252 12h13.496"
                  strokeDasharray="14"
                  strokeDashoffset={state.indeterminate ? 0 : 14}
                  style={{
                    transitionDelay: state.indeterminate ? "50ms" : "0ms",
                  }}
                />
              </svg>
            ) : (
              <svg
                className={cn(
                  "size-3.5 sm:size-3",
                  variant === "diamond" && "-rotate-45",
                )}
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  className="transition-[stroke-dashoffset] duration-200 ease-out"
                  d="M5.252 12.7 10.2 18.63 18.748 5.37"
                  strokeDasharray="24"
                  strokeDashoffset={state.checked ? 0 : 24}
                  style={{ transitionDelay: state.checked ? "50ms" : "0ms" }}
                />
              </svg>
            )}
          </span>
        )}
      />
    </CheckboxPrimitive.Root>
  );
}

export {
  Checkbox,
  Checkbox as CheckboxGroupItem,
  CheckboxGroup,
  checkboxIndicatorVariants,
  checkboxItemVariants,
};
