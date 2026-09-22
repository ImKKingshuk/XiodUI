"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "cn";
import type * as React from "react";

export interface CircularProgressProps extends useRender.ComponentProps<"div"> {
  /**
   * The progress value (0 to max). If undefined, the indicator will be indeterminate.
   */
  value?: number | null;
  /**
   * The maximum progress value. Defaults to 100.
   */
  max?: number;
  /**
   * The size of the circular progress indicator.
   * Can be a string identifier ("sm" to "2xl") or explicit pixel dimensions.
   */
  size?: number | "sm" | "default" | "lg" | "xl" | "2xl";
  /**
   * Defines standard rendering or wavy geometries wrapping the progress stroke.
   */
  variant?: "default" | "expressive";
  /**
   * The stroke width of the SVG circle.
   */
  strokeWidth?: number;
}

function getSizeConfig(
  sizeProp: CircularProgressProps["size"],
  strokeProp?: number,
) {
  if (typeof sizeProp === "number") {
    return {
      size: sizeProp,
      stroke: strokeProp ?? Math.max(2, Math.floor(sizeProp / 12)),
      amplitude: sizeProp / 24,
      waves: 8 + Math.floor(sizeProp / 16),
    };
  }

  const map: Record<
    string,
    { size: number; stroke: number; amplitude: number; waves: number }
  > = {
    sm: { size: 32, stroke: 3, amplitude: 1.5, waves: 8 },
    default: { size: 40, stroke: 4, amplitude: 2, waves: 10 },
    lg: { size: 64, stroke: 5, amplitude: 3, waves: 12 },
    xl: { size: 96, stroke: 6, amplitude: 4, waves: 14 },
    "2xl": { size: 128, stroke: 8, amplitude: 5, waves: 16 },
  };

  const config = map[sizeProp as string] || map.default;
  if (strokeProp !== undefined) config.stroke = strokeProp;
  return config;
}

function generateWavyCirclePath(
  size: number,
  strokeWidth: number,
  amplitude: number,
  numWaves: number,
) {
  const center = size / 2;
  const baseRadius = center - strokeWidth / 2 - amplitude;
  const points: string[] = [];

  for (let i = 0; i <= 360; i++) {
    const angle = (i * Math.PI) / 180;
    const currentRadius = baseRadius + amplitude * Math.sin(numWaves * angle);
    const x = center + currentRadius * Math.cos(angle);
    const y = center + currentRadius * Math.sin(angle);
    points.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return `${points.join(" ")} Z`;
}

export function CircularProgress({
  render,
  value,
  max = 100,
  size: sizeProp = "default",
  variant = "default",
  strokeWidth: strokeWidthProp,
  ...props
}: CircularProgressProps): React.ReactElement {
  const {
    size,
    stroke: strokeWidth,
    amplitude,
    waves,
  } = getSizeConfig(sizeProp, strokeWidthProp);

  const isIndeterminate = value === undefined || value === null;
  const safeValue = isIndeterminate ? 0 : Math.min(Math.max(value, 0), max);
  const percentage = isIndeterminate ? 25 : (safeValue / max) * 100;

  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffsetDefault =
    circumference - (percentage / 100) * circumference;

  const wavyPath =
    variant === "expressive"
      ? generateWavyCirclePath(size, strokeWidth, amplitude, waves)
      : "";

  const defaultProps = {
    className: cn(
      "relative inline-flex items-center justify-center shrink-0",
      isIndeterminate && "animate-spin",
    ),
    role: "progressbar",
    "aria-valuemin": 0,
    "aria-valuemax": max,
    ...(isIndeterminate ? {} : { "aria-valuenow": safeValue }),
    "data-state": isIndeterminate ? "indeterminate" : "determinate",
    "data-slot": "circular-progress",
    style: { width: size, height: size },
    children: (
      <svg
        className="size-auto h-full w-full -rotate-90 pointer-events-none"
        viewBox={`0 0 ${size} ${size}`}
      >
        {variant === "expressive" ? (
          <>
            <path
              d={wavyPath}
              className="fill-transparent stroke-muted transition-colors duration-200"
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />
            <path
              d={wavyPath}
              className={cn(
                "fill-transparent stroke-primary",
                !isIndeterminate &&
                  "transition-[stroke-dashoffset] duration-300 ease-in-out",
              )}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100"
              strokeDashoffset={100 - percentage}
            />
          </>
        ) : (
          <>
            <circle
              className="fill-transparent stroke-muted transition-colors duration-200"
              cx={center}
              cy={center}
              r={radius}
              strokeWidth={strokeWidth}
            />
            <circle
              className={cn(
                "fill-transparent stroke-primary",
                !isIndeterminate &&
                  "transition-[stroke-dashoffset] duration-300 ease-in-out",
              )}
              cx={center}
              cy={center}
              r={radius}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffsetDefault}
              strokeLinecap="round"
            />
          </>
        )}
      </svg>
    ),
  };

  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(defaultProps, props),
  });
}
