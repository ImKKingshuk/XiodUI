"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "cn";
import type * as React from "react";

export interface GaugeProps extends useRender.ComponentProps<"div"> {
  /**
   * The progress value (0 to max).
   */
  value?: number;
  /**
   * The maximum progress value. Defaults to 100.
   */
  max?: number;
  /**
   * The size of the gauge (diameter) in pixels. Defaults to 120.
   */
  size?: number;
  /**
   * The stroke width of the SVG circle. Defaults to 12.
   */
  strokeWidth?: number;
  /**
   * Whether to display the value text in the center. Defaults to true.
   */
  showValue?: boolean;
}

export function Gauge({
  render,
  value = 0,
  max = 100,
  size = 120,
  strokeWidth = 12,
  showValue = true,
  className,
  children,
  ...props
}: GaugeProps): React.ReactElement {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
  const normalizedValue = Number.isFinite(value) ? value : 0;
  const safeValue = Math.min(Math.max(normalizedValue, 0), safeMax);
  const safeSize = Number.isFinite(size) && size > 0 ? size : 120;
  const safeStrokeWidth =
    Number.isFinite(strokeWidth) && strokeWidth > 0
      ? Math.min(strokeWidth, safeSize)
      : Math.min(12, safeSize);
  const percentage = (safeValue / safeMax) * 100;

  const center = safeSize / 2;
  const radius = Math.max(0, center - safeStrokeWidth / 2);
  const circumference = 2 * Math.PI * radius;
  const semiCircumference = circumference / 2;

  // The track is drawn from 0 to semiCircumference.
  // We use dasharray="circumference", dashoffset="circumference / 2".
  const trackDashoffset = semiCircumference;

  // The indicator is drawn up to the percentage of the semicircle.
  const indicatorLength = semiCircumference * (percentage / 100);
  const indicatorDashoffset = circumference - indicatorLength;

  const defaultProps = {
    className: cn(
      "relative inline-flex flex-col items-center justify-end shrink-0",
      className,
    ),
    role: "meter",
    "aria-valuemin": 0,
    "aria-valuemax": safeMax,
    "aria-valuenow": safeValue,
    "data-state": percentage === 100 ? "complete" : "loading",
    "data-slot": "gauge",
    // Container only needs to be half the height + enough space for the rounded line caps
    style: {
      width: safeSize,
      height: safeSize / 2 + safeStrokeWidth / 2,
    },
    children: (
      <>
        <svg
          className="absolute top-0 left-0 overflow-visible pointer-events-none"
          style={{ width: safeSize, height: safeSize }}
          viewBox={`0 0 ${safeSize} ${safeSize}`}
        >
          {/* Track */}
          <circle
            className="stroke-muted fill-transparent"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={safeStrokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={trackDashoffset}
            strokeLinecap="round"
            // Rotate 180 deg to start drawing from 9 o'clock.
            // SVG natural start is 3 o'clock.
            transform={`rotate(180 ${center} ${center})`}
          />
          {/* Indicator */}
          <circle
            className="stroke-primary fill-transparent transition-[stroke-dashoffset] duration-500 ease-in-out"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={safeStrokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={indicatorDashoffset}
            strokeLinecap="round"
            transform={`rotate(180 ${center} ${center})`}
          />
        </svg>
        <div className="flex flex-col items-center justify-end z-10 w-full h-full pb-1">
          {children ? (
            children
          ) : showValue ? (
            <span className="text-2xl font-bold tracking-tighter text-foreground leading-none">
              {safeValue}
            </span>
          ) : null}
        </div>
      </>
    ),
  } as React.ComponentProps<"div">;

  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(defaultProps, props),
  });
}
