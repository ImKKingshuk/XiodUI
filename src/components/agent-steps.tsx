"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import * as React from "react";
import type { IconComponent } from "xiod-icons";
import { Cancel as X } from "xiod-icons/icons/Cancel";
import { Check } from "xiod-icons/icons/Check";
import { Pencil } from "xiod-icons/icons/Pencil";
import { Search } from "xiod-icons/icons/Search";
import { SecurityCheck as ShieldCheck } from "xiod-icons/icons/SecurityCheck";
import { Terminal } from "xiod-icons/icons/Terminal";

// Predefined SMIL path morph geometries for the thinking/loading state
const pathCircleA =
  "M 12 8 C 14.21 8 16 9.79 16 12 C 16 14.21 14.21 16 12 16 C 9.79 16 8 14.21 8 12 C 8 9.79 9.79 8 12 8 Z";
const pathInfinity =
  "M 12 12 C 14 8.5 19 8.5 19 12 C 19 15.5 14 15.5 12 12 C 10 8.5 5 8.5 5 12 C 5 15.5 10 15.5 12 12 Z";
const pathCircleB =
  "M 12 16 C 14.21 16 16 14.21 16 12 C 16 9.79 14.21 8 12 8 C 9.79 8 8 9.79 8 12 C 8 14.21 9.79 16 12 16 Z";

const STYLE_INLINE = `
@keyframes agent-step-icon-in {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes agent-shimmer-sweep {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.animate-agent-step-icon {
  animation: agent-step-icon-in 350ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}
.agent-step-text-base {
  transition: opacity 450ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.agent-shimmer-text-base {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--color-foreground) 40%, transparent) 0%,
    color-mix(in srgb, var(--color-foreground) 40%, transparent) 40%,
    var(--color-foreground) 50%,
    color-mix(in srgb, var(--color-foreground) 40%, transparent) 60%,
    color-mix(in srgb, var(--color-foreground) 40%, transparent) 100%
  );
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: agent-shimmer-sweep 5s infinite linear;
}
`;

// Contexts for compound components
interface AgentStepsContextValue {
  size: "sm" | "md" | "lg";
}

const AgentStepsContext = React.createContext<AgentStepsContextValue | null>(
  null,
);

function useAgentSteps() {
  const context = React.useContext(AgentStepsContext);
  if (!context) {
    throw new Error(
      "AgentSteps compound subcomponents must be used within <AgentSteps />",
    );
  }
  return context;
}

interface AgentStepContextValue {
  status: "waiting" | "running" | "completed" | "failed";
}

const AgentStepContext = React.createContext<AgentStepContextValue | null>(
  null,
);

function useAgentStep() {
  const context = React.useContext(AgentStepContext);
  if (!context) {
    throw new Error(
      "AgentStep subcomponents must be used within <AgentStep />",
    );
  }
  return context;
}

export const agentStepsVariants = cva(
  "inline-flex select-none items-center gap-2 justify-center bg-transparent p-0",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type AgentStepIconValue =
  | "thinking"
  | "searching"
  | "editing"
  | "executing"
  | "planning"
  | "completed"
  | "execute"
  | "verify"
  | "done"
  | "error"
  | IconComponent
  | Exclude<React.ReactNode, string>;

// ============================================================================
// Root Components
// ============================================================================

export interface AgentStepItem {
  label: React.ReactNode;
  icon?: AgentStepIconValue;
  status?: "waiting" | "running" | "completed" | "failed";
}

export interface AgentStepsProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof agentStepsVariants> {
  /** [Single-mode] The current active step label */
  label?: React.ReactNode;
  /** [Single-mode] The icon type or XiodIcons component to show */
  icon?: AgentStepIconValue;
  /** [Single-mode] The status of the step. Default is "running". */
  status?: "waiting" | "running" | "completed" | "failed";
  /** [Single-mode] Whether to show the icon. Default is true. */
  showIcon?: boolean;
  /** [Single-mode] Optional array of steps to cycle through automatically */
  steps?: AgentStepItem[] | string[];
  /** [Single-mode] Transition interval for automatic cycling in milliseconds. Default is 4000. */
  interval?: number;
  /** [Single-mode] Whether to disable the shimmering text sweep. Default is false. */
  disableShimmer?: boolean;
  /** [Single-mode] Whether to show the spinning dashed ring. Default is false. */
  showSpinner?: boolean;
}

export function AgentSteps({
  size = "md",
  label: labelProp,
  icon: iconProp,
  status = "running",
  showIcon = true,
  steps,
  interval = 4000,
  disableShimmer = false,
  showSpinner = false,
  className,
  children,
  ...props
}: AgentStepsProps): React.JSX.Element {
  // If children are not provided, fall back to backward-compatible automatic rendering mode
  const isSingleMode = !children;

  const [cycleIndex, setCycleIndex] = React.useState(0);

  const normalizedSteps = React.useMemo<AgentStepItem[]>(() => {
    if (!steps || steps.length === 0) return [];
    return steps.map((step) => {
      if (typeof step === "string") {
        return {
          label: step,
          icon: "thinking" as const,
          status: "running" as const,
        };
      }
      return step;
    });
  }, [steps]);

  React.useEffect(() => {
    if (!isSingleMode || normalizedSteps.length <= 1) return;
    const timer = setInterval(() => {
      setCycleIndex((prev) => (prev + 1) % normalizedSteps.length);
    }, interval);
    return () => clearInterval(timer);
  }, [isSingleMode, normalizedSteps, interval]);

  const activeStep = normalizedSteps[cycleIndex];
  const activeLabel = activeStep ? activeStep.label : labelProp;
  const activeIcon = activeStep ? activeStep.icon : iconProp;
  const activeStatus = activeStep ? (activeStep.status ?? status) : status;

  const contextValue = React.useMemo(
    () => ({
      size: size ?? "md",
    }),
    [size],
  );

  return (
    <AgentStepsContext.Provider value={contextValue}>
      <div
        className={cn(
          agentStepsVariants({ size }),
          "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
          className,
        )}
        data-slot="agent-steps"
        {...props}
      >
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: inline static animations are safe and self-contained */}
        <style dangerouslySetInnerHTML={{ __html: STYLE_INLINE }} />

        {isSingleMode ? (
          <AgentStep
            status={activeStatus}
            className="bg-transparent border-none p-0 flex-row"
          >
            {showIcon && (
              <AgentStepIcon icon={activeIcon} showSpinner={showSpinner} />
            )}
            {activeLabel && (
              <AgentStepLabel shimmer={!disableShimmer}>
                {activeLabel}
              </AgentStepLabel>
            )}
          </AgentStep>
        ) : (
          children
        )}
      </div>
    </AgentStepsContext.Provider>
  );
}

// ============================================================================
// Compound Subcomponents
// ============================================================================

export interface AgentStepProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: "waiting" | "running" | "completed" | "failed";
}

export function AgentStep({
  status = "running",
  className,
  children,
  ...props
}: AgentStepProps): React.JSX.Element {
  const contextValue = React.useMemo(() => ({ status }), [status]);

  return (
    <AgentStepContext.Provider value={contextValue}>
      <div
        className={cn("flex items-center gap-2", className)}
        data-status={status}
        data-slot="agent-step"
        {...props}
      >
        {children}
      </div>
    </AgentStepContext.Provider>
  );
}

export interface AgentStepIconProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: AgentStepIconValue;
  showSpinner?: boolean;
}

export function AgentStepIcon({
  icon,
  showSpinner = false,
  className,
  ...props
}: AgentStepIconProps): React.JSX.Element {
  const { size } = useAgentSteps();
  const { status } = useAgentStep();

  // Resolve inner icon SVG element
  const iconElement = React.useMemo(() => {
    const iconSizeClass =
      size === "sm" ? "size-3" : size === "lg" ? "size-5" : "size-3.5";

    if (status === "completed" || icon === "done") {
      return <Check className={iconSizeClass} strokeWidth={3} />;
    }
    if (status === "failed" || icon === "error") {
      return <X className={iconSizeClass} strokeWidth={3} />;
    }
    if (status === "waiting") {
      const waitDotSize =
        size === "sm" ? "size-1" : size === "lg" ? "size-2" : "size-1.5";
      return (
        <div
          className={cn("rounded-full bg-muted-foreground/40", waitDotSize)}
        />
      );
    }

    // Default "thinking" morphing SVG loop
    if (!icon || icon === "thinking") {
      const thinkingSize =
        size === "sm" ? "size-3.5" : size === "lg" ? "size-5.5" : "size-4.5";
      return (
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("text-primary shrink-0", thinkingSize)}
        >
          <path d={pathCircleA}>
            <animate
              attributeName="d"
              dur="6s"
              repeatCount="indefinite"
              values={`${pathCircleA}; ${pathInfinity}; ${pathCircleB}; ${pathInfinity}; ${pathCircleA}`}
              keyTimes="0; 0.25; 0.5; 0.75; 1"
            />
          </path>
        </svg>
      );
    }

    if (icon === "searching") {
      return <Search className={iconSizeClass} />;
    }
    if (icon === "editing") {
      return <Pencil className={iconSizeClass} />;
    }
    if (icon === "execute") {
      return <Terminal className={iconSizeClass} />;
    }
    if (icon === "verify") {
      return <ShieldCheck className={iconSizeClass} />;
    }

    if (
      typeof icon === "function" ||
      (typeof icon === "object" && icon !== null && "displayName" in icon)
    ) {
      const CustomIcon = icon as IconComponent;
      return <CustomIcon className={iconSizeClass} />;
    }

    return icon as React.ReactNode;
  }, [icon, status, size]);

  const iconFrameClasses = cn(
    "relative flex items-center justify-center rounded-full shrink-0 select-none bg-transparent text-muted-foreground transition-[color,background-color,opacity] duration-300",
    size === "sm" && "size-5",
    size === "md" && "size-6",
    size === "lg" && "size-8",
    className,
  );

  return (
    <div className={iconFrameClasses} data-slot="agent-step-icon" {...props}>
      {status === "running" && showSpinner && (
        <div
          className={cn(
            "absolute inset-[-1.5px] rounded-full border border-dashed border-primary/60 animate-spin pointer-events-none",
            size === "sm" && "inset-[-1.5px]",
            size === "md" && "inset-[-2px]",
            size === "lg" && "inset-[-3px]",
          )}
        />
      )}
      <div
        key={`${status}-${typeof icon === "string" ? icon : "custom"}`}
        className="flex items-center justify-center size-full animate-agent-step-icon"
      >
        {iconElement}
      </div>
    </div>
  );
}

export interface AgentStepLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  shimmer?: boolean;
}

export function AgentStepLabel({
  shimmer = true,
  className,
  children,
  ...props
}: AgentStepLabelProps): React.JSX.Element {
  const { status } = useAgentStep();

  // Double buffering states to prevent unmounting and key resets
  const [activeBuffer, setActiveBuffer] = React.useState<"A" | "B">("A");
  const [labelA, setLabelA] = React.useState(children);
  const [labelB, setLabelB] = React.useState<React.ReactNode>("");

  React.useEffect(() => {
    if (activeBuffer === "A") {
      if (children !== labelA) {
        setLabelB(children);
        setActiveBuffer("B");
      }
    } else {
      if (children !== labelB) {
        setLabelA(children);
        setActiveBuffer("A");
      }
    }
  }, [children, activeBuffer, labelA, labelB]);

  const isAActive = activeBuffer === "A";
  const isRunning = status === "running" && shimmer;

  return (
    <span
      className={cn(
        "relative inline-grid grid-cols-1 grid-rows-1 items-center overflow-hidden h-5 min-w-[80px]",
        className,
      )}
      data-slot="agent-step-label"
      {...props}
    >
      <span
        className={cn(
          "col-start-1 row-start-1 flex items-center whitespace-nowrap agent-step-text-base",
          isAActive ? "opacity-100" : "opacity-0 pointer-events-none",
          isRunning && "agent-shimmer-text-base",
          status === "waiting" && "text-muted-foreground",
          status === "completed" && "text-foreground font-semibold",
          status === "failed" && "text-destructive font-semibold",
        )}
      >
        {labelA}
      </span>
      <span
        className={cn(
          "col-start-1 row-start-1 flex items-center whitespace-nowrap agent-step-text-base",
          !isAActive ? "opacity-100" : "opacity-0 pointer-events-none",
          isRunning && "agent-shimmer-text-base",
          status === "waiting" && "text-muted-foreground",
          status === "completed" && "text-foreground font-semibold",
          status === "failed" && "text-destructive font-semibold",
        )}
      >
        {labelB}
      </span>
    </span>
  );
}

// Backward-compatible export alias
export { AgentSteps as AgentStepIndicator };
