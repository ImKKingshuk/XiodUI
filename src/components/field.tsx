"use client";

import { Field as FieldPrimitive } from "@base-ui/react/field";
import { cn } from "cn";
import type * as React from "react";

function Field({
  className,
  ...props
}: FieldPrimitive.Root.Props): React.JSX.Element {
  return (
    <FieldPrimitive.Root
      className={cn("flex flex-col items-start gap-2", className)}
      data-slot="field"
      {...props}
    />
  );
}

function FieldLabel({
  className,
  ...props
}: FieldPrimitive.Label.Props): React.JSX.Element {
  return (
    <FieldPrimitive.Label
      className={cn(
        "inline-flex items-center gap-2 font-medium text-base/4.5 text-foreground data-disabled:opacity-64 sm:text-sm/4",
        className,
      )}
      data-slot="field-label"
      {...props}
    />
  );
}

function FieldItem({
  className,
  ...props
}: FieldPrimitive.Item.Props): React.JSX.Element {
  return (
    <FieldPrimitive.Item
      className={cn("flex", className)}
      data-slot="field-item"
      {...props}
    />
  );
}

function FieldDescription({
  className,
  ...props
}: FieldPrimitive.Description.Props): React.JSX.Element {
  return (
    <FieldPrimitive.Description
      className={cn(
        "text-muted-foreground text-xs data-disabled:opacity-64",
        className,
      )}
      data-slot="field-description"
      {...props}
    />
  );
}

function FieldError({
  className,
  ...props
}: FieldPrimitive.Error.Props): React.JSX.Element {
  return (
    <FieldPrimitive.Error
      className={cn("text-destructive-foreground text-xs", className)}
      data-slot="field-error"
      {...props}
    />
  );
}

const FieldControl = FieldPrimitive.Control;
const FieldValidity = FieldPrimitive.Validity;

export {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldItem,
  FieldLabel,
  FieldValidity,
};
