"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import * as React from "react";

export interface TimelineContextValue {
  activeStep?: number;
  setActiveStep: (step: number) => void;
}

export const TimelineContext: React.Context<TimelineContextValue | undefined> =
  React.createContext<TimelineContextValue | undefined>(undefined);

export function useTimeline(): TimelineContextValue | undefined {
  return React.useContext(TimelineContext);
}

export interface TimelineProps extends useRender.ComponentProps<"div"> {
  defaultValue?: number;
  value?: number;
  onValueChange?: (value: number) => void;
  orientation?: "horizontal" | "vertical";
}

export function Timeline({
  defaultValue,
  value,
  onValueChange,
  orientation = "vertical",
  className,
  render,
  ...props
}: TimelineProps): React.ReactElement {
  const [internalStep, setInternalStep] = React.useState(defaultValue);

  const activeStep = value !== undefined ? value : internalStep;

  const setActiveStep = React.useCallback(
    (step: number) => {
      if (value === undefined) {
        setInternalStep(step);
      }
      onValueChange?.(step);
    },
    [value, onValueChange],
  );
  const contextValue = React.useMemo(
    () => ({ activeStep, setActiveStep }),
    [activeStep, setActiveStep],
  );

  const defaultProps = {
    className: cn(
      "group/timeline flex w-full",
      orientation === "horizontal" ? "flex-row" : "flex-col",
      className,
    ),
    "data-orientation": orientation,
    "data-slot": "timeline",
  };

  return (
    <TimelineContext.Provider value={contextValue}>
      {useRender({
        defaultTagName: "div",
        render,
        props: mergeProps<"div">(defaultProps, props),
      })}
    </TimelineContext.Provider>
  );
}

export interface TimelineItemProps extends useRender.ComponentProps<"div"> {
  step?: number;
  status?: "completed" | "active" | "pending";
}

export function TimelineItem({
  step,
  status: statusProp,
  className,
  render,
  ...props
}: TimelineItemProps): React.ReactElement {
  const context = useTimeline();

  let status = statusProp;
  if (!status && step !== undefined && context?.activeStep !== undefined) {
    if (step < context.activeStep) {
      status = "completed";
    } else if (step === context.activeStep) {
      status = "active";
    } else {
      status = "pending";
    }
  }

  const resolvedStatus = status || "pending";

  const defaultProps = {
    className: cn(
      "group/timeline-item relative flex flex-1 flex-col gap-1",
      // Spacing constraints depending on orientation
      "group-data-[orientation=vertical]/timeline:ms-8",
      "group-data-[orientation=vertical]/timeline:not-last:pb-8",
      "group-data-[orientation=horizontal]/timeline:mt-8",
      "group-data-[orientation=horizontal]/timeline:not-last:pe-8",
      className,
    ),
    "data-status": resolvedStatus,
    "data-slot": "timeline-item",
  };

  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(defaultProps, props),
  });
}

export function TimelineHeader({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const defaultProps = {
    className: cn(
      "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1",
      className,
    ),
    "data-slot": "timeline-header",
  };

  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(defaultProps, props),
  });
}

export function TimelineTitle({
  className,
  render,
  ...props
}: useRender.ComponentProps<"h3">): React.ReactElement {
  const defaultProps = {
    className: cn("font-medium text-sm text-foreground", className),
    "data-slot": "timeline-title",
  };

  return useRender({
    defaultTagName: "h3",
    render,
    props: mergeProps<"h3">(defaultProps, props),
  });
}

export function TimelineDate({
  className,
  render,
  ...props
}: useRender.ComponentProps<"time">): React.ReactElement {
  const defaultProps = {
    className: cn("text-xs text-muted-foreground tabular-nums", className),
    "data-slot": "timeline-date",
  };

  return useRender({
    defaultTagName: "time",
    render,
    props: mergeProps<"time">(defaultProps, props),
  });
}

export function TimelineContent({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const defaultProps = {
    className: cn("text-sm text-muted-foreground", className),
    "data-slot": "timeline-content",
  };

  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(defaultProps, props),
  });
}

export const timelineIndicatorVariants = cva(
  "absolute flex items-center justify-center rounded-full transition-colors duration-200 before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
  {
    variants: {
      variant: {
        default:
          "border border-border bg-background shadow-xs/5 not-dark:bg-clip-padding group-data-[status=completed]/timeline-item:border-primary group-data-[status=active]/timeline-item:border-primary",
        solid:
          "border border-transparent bg-border shadow-xs/5 group-data-[status=completed]/timeline-item:bg-primary group-data-[status=active]/timeline-item:bg-primary",
      },
      size: {
        sm: "size-3",
        default: "size-4",
        lg: "size-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface TimelineIndicatorProps
  extends
    useRender.ComponentProps<"div">,
    VariantProps<typeof timelineIndicatorVariants> {}

export function TimelineIndicator({
  className,
  variant,
  size,
  render,
  ...props
}: TimelineIndicatorProps): React.ReactElement {
  const defaultProps = {
    "aria-hidden": true,
    className: cn(
      timelineIndicatorVariants({ variant, size }),
      // Vertical Positioning
      "group-data-[orientation=vertical]/timeline:-left-8 group-data-[orientation=vertical]/timeline:-translate-x-1/2",
      "group-data-[orientation=vertical]/timeline:top-1.5", // Aligns roughly with line height
      // Horizontal Positioning
      "group-data-[orientation=horizontal]/timeline:-top-8 group-data-[orientation=horizontal]/timeline:-translate-y-1/2",
      "group-data-[orientation=horizontal]/timeline:left-0",
      className,
    ),
    "data-slot": "timeline-indicator",
  };

  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(defaultProps, props),
  });
}

export function TimelineSeparator({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const defaultProps = {
    "aria-hidden": true,
    className: cn(
      "absolute bg-border transition-colors duration-200 group-last/timeline-item:hidden",
      "group-data-[status=completed]/timeline-item:bg-primary",
      // Vertical Positioning
      "group-data-[orientation=vertical]/timeline:-left-8 group-data-[orientation=vertical]/timeline:-translate-x-1/2 group-data-[orientation=vertical]/timeline:w-px",
      "group-data-[orientation=vertical]/timeline:top-7 group-data-[orientation=vertical]/timeline:-bottom-1.5",
      // Horizontal Positioning
      "group-data-[orientation=horizontal]/timeline:-top-8 group-data-[orientation=horizontal]/timeline:-translate-y-1/2 group-data-[orientation=horizontal]/timeline:h-px",
      "group-data-[orientation=horizontal]/timeline:left-6 group-data-[orientation=horizontal]/timeline:-right-1.5",
      className,
    ),
    "data-slot": "timeline-separator",
  };

  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(defaultProps, props),
  });
}
