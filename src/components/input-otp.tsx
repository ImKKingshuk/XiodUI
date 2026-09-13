"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { OTPField as OTPFieldPrimitive } from "@base-ui/react/otp-field";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "cn";
import type * as React from "react";
import { MinusSign as MinusIcon } from "xiod-icons/icons/MinusSign";

export interface InputOtpProps extends Omit<
  OTPFieldPrimitive.Root.Props,
  "className"
> {
  className?: string;
}

export interface InputOtpGroupProps extends useRender.ComponentProps<"div"> {}

export interface InputOtpInputProps extends Omit<
  OTPFieldPrimitive.Input.Props,
  "className"
> {
  className?: string;
}

export interface InputOtpSeparatorProps extends Omit<
  OTPFieldPrimitive.Separator.Props,
  "className"
> {
  className?: string;
}

// Pattern A: Direct Primitive Wrapper
function InputOtp({ className, ...props }: InputOtpProps): React.JSX.Element {
  return (
    <OTPFieldPrimitive.Root
      className={cn(
        "flex items-center gap-2 has-disabled:opacity-64",
        className,
      )}
      data-slot="input-otp"
      {...props}
    />
  );
}

// Pattern B: Sibling Polymorphic Structural Layer
function InputOtpGroup({
  className,
  render,
  ...props
}: InputOtpGroupProps): React.ReactElement {
  const defaultProps = {
    className: cn("flex items-center gap-2", className),
    "data-slot": "input-otp-group",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

// Pattern A: Direct Primitive Wrapper with styling proxy via wrapper div
function InputOtpInput({
  className,
  ...props
}: InputOtpInputProps): React.JSX.Element {
  return (
    <span
      className={cn(
        "relative flex h-10 w-10 sm:h-9 sm:w-9 shrink-0 box-border items-center justify-center rounded-lg border border-input bg-background not-dark:bg-clip-padding text-center text-base sm:text-sm font-medium text-foreground shadow-xs/5 ring-ring/24 transition-shadow",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] dark:bg-input/32",
        "not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] dark:not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]",
        "has-focus-visible:border-ring has-focus-visible:ring-[3px]",
        "has-aria-invalid:border-destructive/36 has-focus-visible:has-aria-invalid:border-destructive/64 has-focus-visible:has-aria-invalid:ring-destructive/16 dark:has-aria-invalid:ring-destructive/24",
        "has-disabled:opacity-64 has-[:disabled,:focus-visible,[aria-invalid]]:shadow-none",
        className,
      )}
      data-slot="input-otp-input"
    >
      <OTPFieldPrimitive.Input
        className="w-full h-full bg-transparent text-center font-inherit text-inherit outline-none caret-foreground placeholder:text-muted-foreground focus-visible:placeholder:text-muted-foreground/0"
        {...props}
      />
    </span>
  );
}

// Pattern A: Direct Primitive Wrapper for the Separator
function InputOtpSeparator({
  className,
  children,
  ...props
}: InputOtpSeparatorProps): React.JSX.Element {
  return (
    <OTPFieldPrimitive.Separator
      className={cn(
        "flex items-center justify-center text-muted-foreground/64 [&_svg:not([class*='size-'])]:size-5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      data-slot="input-otp-separator"
      {...props}
    >
      {children || <MinusIcon className="h-5 w-5" />}
    </OTPFieldPrimitive.Separator>
  );
}

// Backward compatible aliases
const OTPField = InputOtp;
const OTPFieldGroup = InputOtpGroup;
const OTPFieldInput = InputOtpInput;
const OTPFieldSeparator = InputOtpSeparator;

export {
  InputOtp,
  InputOtpGroup,
  InputOtpInput,
  InputOtpSeparator,
  OTPField,
  OTPFieldGroup,
  OTPFieldInput,
  OTPFieldSeparator,
};
