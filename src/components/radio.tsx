"use client";

import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type * as React from "react";

const radioItemVariants = cva(
  "relative inline-flex size-4.5 shrink-0 items-center justify-center border border-input bg-background not-dark:bg-clip-padding shadow-xs/5 outline-none ring-ring transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:shadow-[0_1px_var(--border)] not-data-checked:not-data-disabled:inset-shadow-[0_1.5px_3px_var(--input)] pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background aria-invalid:border-destructive/36 focus-visible:aria-invalid:border-destructive/64 focus-visible:aria-invalid:ring-destructive/48 data-disabled:pointer-events-none data-disabled:opacity-64 sm:size-4 dark:not-data-checked:bg-input/32 dark:aria-invalid:ring-destructive/24 [[data-disabled],[data-checked],[aria-invalid]]:shadow-none",
  {
    variants: {
      variant: {
        default: "rounded-full before:rounded-full",
        diamond: "rotate-45 rounded-[.35rem] before:rounded-[5px]",
        expressive: "rounded-full before:rounded-full",
        sharp: "rounded-[.25rem] before:rounded-[3px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const radioIndicatorVariants = cva(
  "-inset-px absolute flex size-4.5 items-center justify-center text-primary-foreground transition-[transform,opacity] duration-205 ease-out data-unchecked:scale-50 data-unchecked:opacity-0 data-checked:scale-100 data-checked:opacity-100 data-checked:bg-primary data-checked:inset-shadow-[0_1px_--alpha(var(--primary-foreground)/16%)] data-checked:shadow-primary/24 data-checked:shadow-xs sm:size-4",
  {
    variants: {
      variant: {
        default:
          "rounded-full before:size-2 before:rounded-full before:bg-primary-foreground sm:before:size-1.5 before:transition-transform before:duration-200 before:ease-out data-unchecked:before:scale-0 data-checked:before:scale-100",
        diamond:
          "rounded-[.35rem] before:size-2 before:rounded-[4px] before:bg-primary-foreground sm:before:size-1.5 before:transition-transform before:duration-200 before:ease-out data-unchecked:before:scale-0 data-checked:before:scale-100",
        expressive: "rounded-full",
        sharp:
          "rounded-[.25rem] before:size-2 before:rounded-[3px] before:bg-primary-foreground sm:before:size-1.5 before:transition-transform before:duration-200 before:ease-out data-unchecked:before:scale-0 data-checked:before:scale-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Radio({
  className,
  ...props
}: RadioGroupPrimitive.Props): React.JSX.Element {
  return (
    <RadioGroupPrimitive
      className={cn("flex flex-col gap-3", className)}
      data-slot="radio-group"
      {...props}
    />
  );
}

interface RadioItemProps
  extends RadioPrimitive.Root.Props, VariantProps<typeof radioItemVariants> {}

function RadioItem({
  className,
  variant,
  ...props
}: RadioItemProps): React.JSX.Element {
  return (
    <RadioPrimitive.Root
      className={cn(radioItemVariants({ variant }), className)}
      data-slot="radio-item"
      {...props}
    >
      <RadioPrimitive.Indicator
        className={cn(radioIndicatorVariants({ variant }))}
        data-slot="radio-indicator"
        keepMounted
        render={(indicatorProps, state) => (
          <span {...indicatorProps}>
            {variant === "expressive" && (
              <svg
                className="size-3.5 sm:size-3"
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
    </RadioPrimitive.Root>
  );
}

export {
  Radio,
  Radio as RadioGroup,
  RadioItem,
  RadioItem as RadioGroupItem,
  radioIndicatorVariants,
  radioItemVariants,
};
