"use client";

import { Meter as MeterPrimitive } from "@base-ui/react/meter";
import { cn } from "cn";
import type * as React from "react";

function Meter({
  className,
  children,
  ...props
}: MeterPrimitive.Root.Props): React.JSX.Element {
  return (
    <MeterPrimitive.Root
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    >
      {children ? (
        children
      ) : (
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      )}
    </MeterPrimitive.Root>
  );
}

function MeterLabel({
  className,
  ...props
}: MeterPrimitive.Label.Props): React.JSX.Element {
  return (
    <MeterPrimitive.Label
      className={cn("font-medium text-foreground text-sm", className)}
      data-slot="meter-label"
      {...props}
    />
  );
}

function MeterTrack({
  className,
  ...props
}: MeterPrimitive.Track.Props): React.JSX.Element {
  return (
    <MeterPrimitive.Track
      className={cn(
        "block h-2 w-full overflow-hidden bg-input inset-shadow-[0_1px_2px_var(--input)]",
        className,
      )}
      data-slot="meter-track"
      {...props}
    />
  );
}

function MeterIndicator({
  className,
  ...props
}: MeterPrimitive.Indicator.Props): React.JSX.Element {
  return (
    <MeterPrimitive.Indicator
      className={cn(
        "bg-primary inset-shadow-[0_1px_--alpha(var(--primary-foreground)/16%)] transition-[width,transform] duration-500",
        className,
      )}
      data-slot="meter-indicator"
      {...props}
    />
  );
}

function MeterValue({
  className,
  ...props
}: MeterPrimitive.Value.Props): React.JSX.Element {
  return (
    <MeterPrimitive.Value
      className={cn("text-foreground text-sm tabular-nums", className)}
      data-slot="meter-value"
      {...props}
    />
  );
}

export { Meter, MeterIndicator, MeterLabel, MeterTrack, MeterValue };
