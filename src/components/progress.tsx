"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { cva } from "class-variance-authority";
import { cn } from "cn";
import * as React from "react";

const ProgressContext = React.createContext<{
  variant?: "default" | "expressive";
  size?: "sm" | "default" | "lg" | "xl" | "2xl";
}>({ variant: "default", size: "default" });

export interface ProgressProps extends ProgressPrimitive.Root.Props {
  variant?: "default" | "expressive";
  size?: "sm" | "default" | "lg" | "xl" | "2xl";
}

function Progress({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: ProgressProps): React.JSX.Element {
  const contextValue = React.useMemo(
    () => ({ variant, size }),
    [variant, size],
  );

  return (
    <ProgressPrimitive.Root
      className={cn("flex w-full flex-col gap-2", className)}
      data-slot="progress"
      {...props}
    >
      <ProgressContext.Provider value={contextValue}>
        {children ? (
          children
        ) : (
          <ProgressTrack>
            <ProgressIndicator />
          </ProgressTrack>
        )}
      </ProgressContext.Provider>
    </ProgressPrimitive.Root>
  );
}

function ProgressLabel({
  className,
  ...props
}: ProgressPrimitive.Label.Props): React.JSX.Element {
  return (
    <ProgressPrimitive.Label
      className={cn("font-medium text-sm", className)}
      data-slot="progress-label"
      {...props}
    />
  );
}

export const progressTrackVariants = cva(
  "block w-full overflow-hidden rounded-full",
  {
    variants: {
      variant: {
        default: "bg-input inset-shadow-[0_1.5px_3px_var(--input)]",
        expressive:
          "bg-input [mask-repeat:repeat-x] inset-shadow-[0_1.5px_3px_var(--input)]",
      },
      size: {
        sm: "",
        default: "",
        lg: "",
        xl: "",
        "2xl": "",
      },
    },
    compoundVariants: [
      { variant: "default", size: "sm", className: "h-1" },
      { variant: "default", size: "default", className: "h-1.5" },
      { variant: "default", size: "lg", className: "h-2" },
      { variant: "default", size: "xl", className: "h-2.5" },
      { variant: "default", size: "2xl", className: "h-3" },
      {
        variant: "expressive",
        size: "sm",
        className:
          "h-1.5 [mask-image:url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%228%22%20height=%226%22%20viewBox=%220%200%208%206%22%20preserveAspectRatio=%22none%22%3E%3Cpath%20d=%22M-4,3%20Q-2,6%200,3%20T4,3%20T8,3%20T12,3%22%20fill=%22none%22%20stroke=%22black%22%20stroke-width=%222%22%20/%3E%3C/svg%3E')] [mask-size:8px_100%]",
      },
      {
        variant: "expressive",
        size: "default",
        className:
          "h-2.5 [mask-image:url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2210%22%20viewBox=%220%200%2012%2010%22%20preserveAspectRatio=%22none%22%3E%3Cpath%20d=%22M-6,5%20Q-3,10%200,5%20T6,5%20T12,5%20T18,5%22%20fill=%22none%22%20stroke=%22black%22%20stroke-width=%223%22%20/%3E%3C/svg%3E')] [mask-size:12px_100%]",
      },
      {
        variant: "expressive",
        size: "lg",
        className:
          "h-3.5 [mask-image:url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2216%22%20height=%2214%22%20viewBox=%220%200%2016%2014%22%20preserveAspectRatio=%22none%22%3E%3Cpath%20d=%22M-8,7%20Q-4,14%200,7%20T8,7%20T16,7%20T24,7%22%20fill=%22none%22%20stroke=%22black%22%20stroke-width=%224%22%20/%3E%3C/svg%3E')] [mask-size:16px_100%]",
      },
      {
        variant: "expressive",
        size: "xl",
        className:
          "h-5 [mask-image:url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2224%22%20height=%2220%22%20viewBox=%220%200%2024%2020%22%20preserveAspectRatio=%22none%22%3E%3Cpath%20d=%22M-12,10%20Q-6,20%200,10%20T12,10%20T24,10%20T36,10%22%20fill=%22none%22%20stroke=%22black%22%20stroke-width=%225%22%20/%3E%3C/svg%3E')] [mask-size:24px_100%]",
      },
      {
        variant: "expressive",
        size: "2xl",
        className:
          "h-6 [mask-image:url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2228%22%20height=%2224%22%20viewBox=%220%200%2028%2024%22%20preserveAspectRatio=%22none%22%3E%3Cpath%20d=%22M-14,12%20Q-7,24%200,12%20T14,12%20T28,12%20T42,12%22%20fill=%22none%22%20stroke=%22black%22%20stroke-width=%226%22%20/%3E%3C/svg%3E')] [mask-size:28px_100%]",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function ProgressTrack({
  className,
  ...props
}: ProgressPrimitive.Track.Props): React.JSX.Element {
  const { variant, size } = React.useContext(ProgressContext);

  return (
    <ProgressPrimitive.Track
      className={cn(progressTrackVariants({ variant, size }), className)}
      data-slot="progress-track"
      {...props}
    />
  );
}

export const progressIndicatorVariants = cva(
  "bg-primary inset-shadow-[0_1px_--alpha(var(--primary-foreground)/16%)] transition-[width,transform] duration-500",
  {
    variants: {
      variant: {
        default: "size-full",
        expressive: "size-full",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function ProgressIndicator({
  className,
  ...props
}: ProgressPrimitive.Indicator.Props): React.JSX.Element {
  const { variant } = React.useContext(ProgressContext);

  return (
    <ProgressPrimitive.Indicator
      className={cn(progressIndicatorVariants({ variant }), className)}
      data-slot="progress-indicator"
      {...props}
    />
  );
}

function ProgressValue({
  className,
  ...props
}: ProgressPrimitive.Value.Props): React.JSX.Element {
  return (
    <ProgressPrimitive.Value
      className={cn("text-sm tabular-nums", className)}
      data-slot="progress-value"
      {...props}
    />
  );
}

export {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
};
