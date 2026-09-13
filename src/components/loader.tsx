"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import * as React from "react";

const loaderVariants = cva("inline-flex items-center justify-center relative", {
  variants: {
    intent: {
      default: "text-foreground",
      primary: "text-primary",
      success: "text-success",
      warning: "text-warning",
      danger: "text-destructive",
      muted: "text-muted-foreground",
    },
    size: {
      sm: "size-4",
      md: "size-6",
      lg: "size-8",
      xl: "size-12",
    },
    variant: {
      ring: "",
      expressive: "",
      pulse: "",
      dots: "",
      "circular-arrows": "",
      "radial-pulse": "",
      "arc-head": "",
      "segmented-ring": "",
      "chunked-circular": "",
      petal: "",
      "orbiting-dots": "",
      "dotted-ring": "",
      "radial-arrow": "",
      "bar-segment": "",
      "orbiting-ball": "",
    },
  },
  defaultVariants: {
    intent: "default",
    size: "md",
    variant: "ring",
  },
});

const morphPaths = [
  "M 12 2 C 17.52 2 22 6.48 22 12 C 22 17.52 17.52 22 12 22 C 6.48 22 2 17.52 2 12 C 2 6.48 6.48 2 12 2 Z", // Circle
  "M 12 2 C 19 2 22 5 22 12 C 22 19 19 22 12 22 C 5 22 2 19 2 12 C 2 5 5 2 12 2 Z", // Rounded Square
  "M 12 2 C 21.5 2 22 2.5 22 12 C 22 21.5 21.5 22 12 22 C 2.5 22 2 21.5 2 12 C 2 2.5 2.5 2 12 2 Z", // Squircle
  "M 12 2 C 14 4 18 10 22 12 C 18 14 14 18 12 22 C 10 18 6 14 2 12 C 6 10 10 4 12 2 Z", // Diamond
  "M 12 2 C 15 5 19 8 22 12 C 19 16 15 19 12 22 C 9 19 5 16 2 12 C 5 8 9 5 12 2 Z", // Soft Diamond
  "M 12 4 C 16 2 20 8 20 12 C 20 16 16 22 12 20 C 8 22 4 16 4 12 C 4 8 8 2 12 4 Z", // Blob
  "M 12 2 C 13 8 14 10 22 12 C 14 14 13 16 12 22 C 11 16 10 14 2 12 C 10 10 11 8 12 2 Z", // Star
  "M 12 3 C 15 5 18 9 19 12 C 18 15 15 19 12 21 C 9 19 6 15 5 12 C 6 9 9 5 12 3 Z", // Pinched
  "M 12 5 C 18 5 22 8 22 12 C 22 16 18 19 12 19 C 6 19 2 16 2 12 C 2 8 6 5 12 5 Z", // Ellipse H
  "M 12 2 C 15 2 18 6 18 12 C 18 18 15 22 12 22 C 9 22 6 18 6 12 C 6 6 9 2 12 2 Z", // Ellipse V
  "M 12 2 C 17.52 2 22 6.48 22 12 C 22 17.52 17.52 22 12 22 C 6.48 22 2 17.52 2 12 C 2 6.48 6.48 2 12 2 Z", // Circle
].join(";");

export interface LoaderProps
  extends
    useRender.ComponentProps<"div">,
    VariantProps<typeof loaderVariants> {}

function Loader({
  className,
  intent,
  size,
  variant,
  render,
  ...props
}: LoaderProps): React.ReactElement {
  const rootProps = {
    className: cn(loaderVariants({ intent, size, variant, className })),
    role: "status",
    "aria-label": "Loading",
    "data-slot": "loader",
  };

  const element = useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(rootProps, props),
    render,
  });

  const baseId = React.useId();
  const gradientId = `loader-fade-${baseId.replace(/:/g, "")}`;

  const content = React.useMemo(() => {
    switch (variant) {
      case "expressive":
        return (
          <svg
            className="h-full w-full animate-spin text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            data-slot="loader-expressive"
          >
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
                <stop offset="50%" stopColor="currentColor" stopOpacity="0.5" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path
              stroke={`url(#${gradientId})`}
              strokeWidth="3"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="75 25"
            >
              <animate
                attributeName="d"
                dur="6s"
                repeatCount="indefinite"
                values={morphPaths}
              />
            </path>
          </svg>
        );
      case "circular-arrows":
        return (
          <svg
            className="h-full w-full animate-spin text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            data-slot="loader-circular-arrows"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M12 22c5.523 0 10-4.477 10-10a10 10 0 0 0-4.713-8.495"
            />
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M17 3l.287.495m0 0L20 6.5M17.287 3.495 14 5"
            />
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M12 2C6.477 2 2 6.477 2 12a10 10 0 0 0 4.713 8.495"
            />
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M7 21l-.287-.495m0 0L4 17.5m2.713 3.005L10 19"
            />
          </svg>
        );
      case "radial-pulse":
        return (
          <svg
            className="h-full w-full text-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            data-slot="loader-radial-pulse"
          >
            {[...Array(12)].map((_, i) => (
              <rect
                key={i}
                x="11"
                y="1"
                width="2"
                height="6"
                rx="1"
                fill="currentColor"
                opacity="0"
                transform={`rotate(${i * 30} 12 12)`}
              >
                <animate
                  attributeName="opacity"
                  values="1;0"
                  dur="1s"
                  begin={`${i * 0.083}s`}
                  repeatCount="indefinite"
                />
              </rect>
            ))}
          </svg>
        );
      case "arc-head":
        return (
          <svg
            className="h-full w-full animate-spin text-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            data-slot="loader-arc-head"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeOpacity="0.15"
              strokeWidth="3"
            />
            <path
              d="M12 2a10 10 0 0 1 10 10"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        );
      case "segmented-ring":
        return (
          <svg
            className="h-full w-full animate-spin text-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            data-slot="loader-segmented-ring"
            style={{ animationDuration: "3s" }}
          >
            {[...Array(8)].map((_, i) => (
              <path
                key={i}
                d="M 12 2 A 10 10 0 0 1 19.07 4.93"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                transform={`rotate(${i * 45} 12 12)`}
                opacity={1 - i * 0.1}
              />
            ))}
          </svg>
        );
      case "chunked-circular":
        return (
          <svg
            className="h-full w-full text-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            data-slot="loader-chunked-circular"
          >
            {[...Array(4)].map((_, i) => (
              <path
                key={i}
                d="M 12 2 A 10 10 0 0 1 22 12"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                transform={`rotate(${i * 90} 12 12)`}
                strokeDasharray="10 20"
                opacity="0.2"
              >
                <animate
                  attributeName="opacity"
                  values="0.2;1;0.2"
                  dur="1.5s"
                  begin={`${i * 0.375}s`}
                  repeatCount="indefinite"
                />
              </path>
            ))}
          </svg>
        );
      case "petal":
        return (
          <svg
            className="h-full w-full animate-spin text-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            data-slot="loader-petal"
            style={{ animationDuration: "4s" }}
          >
            {[...Array(6)].map((_, i) => (
              <path
                key={i}
                d="M12 2 C 14 2 15 5 15 8 C 15 11 12 12 12 12 C 12 12 9 11 9 8 C 9 5 10 2 12 2 Z"
                fill="currentColor"
                transform={`rotate(${i * 60} 12 12)`}
                opacity={1 - i * 0.15}
              />
            ))}
          </svg>
        );
      case "orbiting-dots":
        return (
          <svg
            className="h-full w-full animate-spin text-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            data-slot="loader-orbiting-dots"
            style={{ animationDuration: "2.5s" }}
          >
            {[...Array(3)].map((_, i) => (
              <circle
                key={i}
                cx="12"
                cy="3"
                r="2.5"
                fill="currentColor"
                transform={`rotate(${i * 120} 12 12)`}
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from={`${i * 120} 12 12`}
                  to={`${i * 120 + 360} 12 12`}
                  dur="1.5s"
                  repeatCount="indefinite"
                  additive="sum"
                />
              </circle>
            ))}
          </svg>
        );
      case "dotted-ring":
        return (
          <svg
            className="h-full w-full text-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            data-slot="loader-dotted-ring"
          >
            {[...Array(16)].map((_, i) => (
              <circle
                key={i}
                cx="12"
                cy="2"
                r="1.5"
                fill="currentColor"
                transform={`rotate(${i * 22.5} 12 12)`}
                opacity="0.1"
              >
                <animate
                  attributeName="opacity"
                  values="0.1;1;0.1"
                  dur="1.2s"
                  begin={`${i * 0.075}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </svg>
        );
      case "radial-arrow":
        return (
          <svg
            className="h-full w-full animate-spin text-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            data-slot="loader-radial-arrow"
          >
            {[...Array(4)].map((_, i) => (
              <path
                key={i}
                d="M12 2 L15 6 L9 6 Z"
                fill="currentColor"
                transform={`rotate(${i * 90} 12 12)`}
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0,0; 0,2; 0,0"
                  dur="1s"
                  begin={`${i * 0.25}s`}
                  repeatCount="indefinite"
                  additive="sum"
                />
              </path>
            ))}
          </svg>
        );
      case "bar-segment":
        return (
          <svg
            className="h-full w-full animate-spin text-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            data-slot="loader-bar-segment"
            style={{ animationDuration: "2s" }}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray="10 15"
              fill="none"
              strokeLinecap="square"
            />
          </svg>
        );
      case "orbiting-ball":
        return (
          <svg
            className="h-full w-full text-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            data-slot="loader-orbiting-ball"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeOpacity="0.15"
              strokeWidth="2"
              fill="none"
            />
            <circle cx="12" cy="2" r="3" fill="currentColor">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 12 12"
                to="360 12 12"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        );
      case "pulse":
        return (
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75"
            data-slot="loader-pulse"
          />
        );
      case "dots":
        return (
          <span
            className="flex h-full w-full items-center justify-between"
            data-slot="loader-dots"
          >
            <span
              className="h-[30%] w-[30%] animate-bounce rounded-full bg-current"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="h-[30%] w-[30%] animate-bounce rounded-full bg-current"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="h-[30%] w-[30%] animate-bounce rounded-full bg-current"
              style={{ animationDelay: "300ms" }}
            />
          </span>
        );
      default:
        return (
          <svg
            className="h-full w-full animate-spin text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            data-slot="loader-ring"
          >
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
              </linearGradient>
            </defs>
            {/* Fading tail: 180 degrees (Left to Right through Top) */}
            <path
              d="M 22 12 A 10 10 0 0 0 2 12"
              stroke={`url(#${gradientId})`}
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Solid head: 90 degrees (Right to Bottom) */}
            <path
              d="M 22 12 A 10 10 0 0 1 12 22"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        );
    }
  }, [variant, gradientId]);

  return React.cloneElement(element, {}, content);
}

export { Loader, loaderVariants };
