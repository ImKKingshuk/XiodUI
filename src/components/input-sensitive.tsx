"use client";

import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "cn";
import * as React from "react";
import { Check } from "xiod-icons/icons/Check";
import { Copy } from "xiod-icons/icons/Copy";
import { Eye } from "xiod-icons/icons/Eye";
import { EyeOff } from "xiod-icons/icons/EyeOff";

import { IconSlot } from "./icon-provider";

type Mode = "masked" | "revealed" | "empty";

type InputSensitiveProps = Omit<
  InputPrimitive.Props,
  "size" | "className" | "style" | "type"
> & {
  size?: "sm" | "default" | "lg" | number;
  className?: string;
  style?: React.CSSProperties;
  onCopy?: () => void;
};

function InputSensitive({
  className,
  size = "default",
  onCopy,
  onChange,
  onBlur,
  onKeyDown,
  disabled,
  readOnly,
  copiedIcon,
  copyIcon,
  hideIcon,
  revealIcon,
  ...props
}: InputSensitiveProps & {
  /** Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`. */
  copiedIcon?: React.ReactNode;
  /** Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`. */
  copyIcon?: React.ReactNode;
  /** Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`. */
  hideIcon?: React.ReactNode;
  /** Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`. */
  revealIcon?: React.ReactNode;
}): React.JSX.Element {
  const isControlled = props.value !== undefined;
  const [internalValue, setInternalValue] = React.useState(
    (props.defaultValue as string) || "",
  );
  const value = (isControlled ? props.value : internalValue) as string;
  const hasValue = value.length > 0;

  const [mode, setMode] = React.useState<Mode>(() =>
    hasValue ? "masked" : "empty",
  );
  const [copied, setCopied] = React.useState(false);

  const containerRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (copied) {
      const timeoutId = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [copied]);

  const copyToClipboard = React.useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();
      try {
        if (
          typeof navigator !== "undefined" &&
          navigator.clipboard &&
          typeof navigator.clipboard.writeText === "function"
        ) {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          onCopy?.();
          return;
        }
      } catch {
        // Fallback
      }
    },
    [value, onCopy],
  );

  const prevHasValueRef = React.useRef(hasValue);
  if (prevHasValueRef.current !== hasValue) {
    prevHasValueRef.current = hasValue;
    if (!hasValue && mode === "masked") {
      setMode("empty");
    }
  }

  const handleContainerClick = React.useCallback(
    (_e: React.MouseEvent) => {
      if (disabled) return;
      if (mode === "masked" && hasValue) {
        setMode("revealed");
        if (!readOnly) {
          setTimeout(() => {
            containerRef.current?.querySelector("input")?.focus();
          }, 0);
        }
      }
    },
    [mode, hasValue, disabled, readOnly],
  );

  const handleToggleVisibility = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();
      if (mode === "revealed") {
        setMode("masked");
      } else if (mode === "empty" && hasValue) {
        setMode("revealed");
      }
    },
    [mode, hasValue],
  );

  const handleChange: NonNullable<
    React.ComponentProps<typeof InputPrimitive>["onChange"]
  > = React.useCallback(
    (e) => {
      const newValue = e.target.value;
      if (!isControlled) {
        setInternalValue(newValue);
      }
      if (mode === "empty" && newValue.length > 0) {
        setMode("revealed");
      }
      onChange?.(e);
    },
    [isControlled, onChange, mode],
  );

  const handleBlur: NonNullable<
    React.ComponentProps<typeof InputPrimitive>["onBlur"]
  > = React.useCallback(
    (e) => {
      if (
        containerRef.current &&
        e.relatedTarget instanceof Node &&
        containerRef.current.contains(e.relatedTarget)
      ) {
        return;
      }
      if (hasValue) {
        setMode("masked");
      }
      onBlur?.(e);
    },
    [hasValue, onBlur],
  );

  const handleContainerKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLSpanElement>) => {
      if (disabled) return;
      if (mode === "masked" && hasValue) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setMode("revealed");
          if (!readOnly) {
            setTimeout(() => {
              containerRef.current?.querySelector("input")?.focus();
            }, 0);
          }
        }
      }
    },
    [mode, hasValue, disabled, readOnly],
  );

  const handleInputKeyDown: NonNullable<
    React.ComponentProps<typeof InputPrimitive>["onKeyDown"]
  > = React.useCallback(
    (e) => {
      if (mode === "revealed" && e.key === "Escape") {
        setMode("masked");
        setTimeout(
          () =>
            containerRef.current
              ?.querySelector<HTMLElement>('[data-slot="input-sensitive-mask"]')
              ?.focus(),
          0,
        );
      }
      onKeyDown?.(e);
    },
    [mode, onKeyDown],
  );

  const isMaskedWithValue = mode === "masked" && hasValue;
  const showEyeButton =
    !disabled && (mode === "revealed" || (mode === "empty" && hasValue));

  const inputClassName = cn(
    "h-8.5 w-full min-w-0 rounded-[inherit] leading-8.5 outline-none placeholder:text-muted-foreground/72 sm:h-7.5 sm:leading-7.5 [transition:background-color_5000000s_ease-in-out_0s]",
    "bg-transparent border-0 ring-0",
    size === "sm" && "h-7.5 leading-7.5 sm:h-6.5 sm:leading-6.5",
    size === "lg" && "h-9.5 leading-9.5 sm:h-8.5 sm:leading-8.5",
    "px-[calc(--spacing(3)-1px)] pr-[--sensitive-pr]",
    size === "sm" && "px-[calc(--spacing(2.5)-1px)] pr-[--sensitive-pr]",
    disabled && "cursor-not-allowed",
    isMaskedWithValue && "pointer-events-none opacity-0",
  );

  return (
    <span
      ref={containerRef}
      className={
        cn(
          "group/container relative inline-flex w-full rounded-lg border border-input bg-background not-dark:bg-clip-padding text-base text-foreground shadow-xs/5 ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] has-focus-visible:has-aria-invalid:border-destructive/64 has-focus-visible:has-aria-invalid:ring-destructive/16 has-aria-invalid:border-destructive/36 has-focus-visible:border-ring has-autofill:bg-foreground/4 has-disabled:opacity-64 has-[:disabled,:focus-visible,[aria-invalid]]:shadow-none has-focus-visible:ring-[3px] sm:text-sm dark:bg-input/32 dark:has-autofill:bg-foreground/8 dark:has-aria-invalid:ring-destructive/24 dark:not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)] [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
          isMaskedWithValue && !disabled && "cursor-pointer",
          className,
        ) || undefined
      }
      style={
        {
          "--sensitive-pr": "calc(--spacing(18))",
        } as React.CSSProperties
      }
      data-size={size}
      data-slot="input-control"
    >
      <InputPrimitive
        data-slot="input"
        size={typeof size === "number" ? size : undefined}
        {...props}
        className={inputClassName}
        type={mode === "revealed" ? "text" : "password"}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleInputKeyDown}
        readOnly={readOnly || isMaskedWithValue}
        disabled={disabled}
        tabIndex={isMaskedWithValue ? -1 : 0}
        aria-hidden={isMaskedWithValue}
      />

      <span
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 flex items-center overflow-hidden select-none",
          "px-[calc(--spacing(3)-1px)]",
          size === "sm" && "px-[calc(--spacing(2.5)-1px)]",
          "right-[--sensitive-pr]",
          !isMaskedWithValue && "invisible",
          isMaskedWithValue && "pointer-events-auto text-foreground group/mask",
        )}
        role={isMaskedWithValue ? "button" : undefined}
        aria-label={
          isMaskedWithValue
            ? (props["aria-label"] ?? "Reveal sensitive value")
            : undefined
        }
        aria-hidden={isMaskedWithValue ? undefined : true}
        tabIndex={isMaskedWithValue && !disabled ? 0 : undefined}
        onClick={isMaskedWithValue ? handleContainerClick : undefined}
        onKeyDown={isMaskedWithValue ? handleContainerKeyDown : undefined}
        data-slot="input-sensitive-mask"
      >
        <span className="relative flex items-center">
          <span
            className={cn(
              "tracking-widest",
              isMaskedWithValue &&
                !disabled &&
                "group-focus/container:invisible group-hover/container:invisible",
            )}
          >
            ••••••••
          </span>
          {isMaskedWithValue && !disabled && (
            <span className="invisible absolute left-0 whitespace-nowrap text-muted-foreground group-focus/container:visible group-hover/container:visible">
              Click to reveal
            </span>
          )}
        </span>
      </span>

      {/* Buttons Container */}
      <div className="absolute inset-y-0 right-0 flex items-center gap-0.5 pr-[calc(--spacing(1)-1px)]">
        {hasValue && !disabled && (
          <button
            type="button"
            onClick={copyToClipboard}
            onKeyDown={(e) => e.stopPropagation()}
            aria-label={copied ? "Copied" : "Copy to clipboard"}
            className={cn(
              "relative flex size-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-accent hover:text-accent-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:size-6 pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11",
              "group-focus-within/container:opacity-100 group-hover/container:opacity-100",
            )}
          >
            {copied ? (
              <IconSlot
                name="Check"
                icon={copiedIcon}
                fallback={Check}
                className="size-4 text-success sm:size-3.5"
              />
            ) : (
              <IconSlot
                name="Copy"
                icon={copyIcon}
                fallback={Copy}
                className="size-4 sm:size-3.5"
              />
            )}
          </button>
        )}

        <button
          type="button"
          onClick={handleToggleVisibility}
          onKeyDown={(e) => e.stopPropagation()}
          aria-label={mode === "revealed" ? "Hide value" : "Reveal value"}
          tabIndex={showEyeButton ? 0 : -1}
          className={cn(
            "relative flex size-7 items-center justify-center rounded-md text-muted-foreground transition-[color,background-color,opacity,box-shadow] hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:size-6 pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11",
            !showEyeButton &&
              !disabled &&
              "pointer-events-none opacity-0 group-hover/container:pointer-events-auto group-hover/container:opacity-100 group-focus-within/container:pointer-events-auto group-focus-within/container:opacity-100",
            !showEyeButton && disabled && "pointer-events-none opacity-0",
          )}
        >
          {mode === "revealed" ? (
            <IconSlot
              name="EyeOff"
              icon={hideIcon}
              fallback={EyeOff}
              className="size-4 sm:size-3.5"
            />
          ) : (
            <IconSlot
              name="Eye"
              icon={revealIcon}
              fallback={Eye}
              className="size-4 sm:size-3.5"
            />
          )}
        </button>
      </div>
    </span>
  );
}

export { InputSensitive, type InputSensitiveProps };
