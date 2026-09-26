"use client";

import type { VariantProps } from "class-variance-authority";
import { cn } from "cn";
import * as React from "react";
import { ChevronDown as ChevronDownIcon } from "xiod-icons/icons/ChevronDown";

import { Button, type buttonVariants } from "./button";
import { Group, GroupSeparator } from "./group";
import { IconSlot } from "./icon-provider";
import { Popover, PopoverPopup, PopoverTrigger } from "./popover";

const ButtonSplitContext = React.createContext<{
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
}>({ variant: "default", size: "default" });

export interface ButtonSplitProps extends Omit<
  React.ComponentPropsWithoutRef<typeof Popover>,
  "children"
> {
  children: React.ReactNode;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  className?: string;
}

function ButtonSplit({
  variant = "default",
  size = "default",
  className,
  children,
  ...props
}: ButtonSplitProps): React.JSX.Element {
  const contextValue = React.useMemo(
    () => ({ variant, size }),
    [variant, size],
  );

  return (
    <Popover {...props}>
      <ButtonSplitContext.Provider value={contextValue}>
        <Group
          className={cn(
            "rounded-lg [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
            "*:rounded-[inherit] [&>*:before]:rounded-[inherit]",
            className,
          )}
          data-slot="button-split"
        >
          {children}
        </Group>
      </ButtonSplitContext.Provider>
    </Popover>
  );
}

function ButtonSplitAction({
  className,
  render,
  ...props
}: React.ComponentProps<typeof Button>): React.JSX.Element {
  const { variant, size } = React.useContext(ButtonSplitContext);

  return (
    <Button
      variant={props.variant ?? variant}
      size={props.size ?? size}
      className={cn(className)}
      render={render}
      {...props}
    />
  );
}

function ButtonSplitSeparator({
  className,
  ...props
}: React.ComponentProps<typeof GroupSeparator>): React.JSX.Element {
  return <GroupSeparator className={cn(className)} {...props} />;
}

function ButtonSplitTrigger({
  className,
  render,
  children,
  icon,
  ...props
}: React.ComponentProps<typeof PopoverTrigger> & {
  /** Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`. */
  icon?: React.ReactNode;
}): React.JSX.Element {
  const { variant, size } = React.useContext(ButtonSplitContext);

  const triggerSize =
    size === "sm"
      ? "icon-sm"
      : size === "lg"
        ? "icon-lg"
        : size === "xs"
          ? "icon-xs"
          : size === "xl"
            ? "icon-xl"
            : "icon";

  return (
    <PopoverTrigger
      className={cn(className)}
      render={render ?? <Button variant={variant} size={triggerSize} />}
      {...props}
    >
      {children ?? (
        <IconSlot name="ChevronDown" icon={icon} fallback={ChevronDownIcon} />
      )}
    </PopoverTrigger>
  );
}

function ButtonSplitContent({
  className,
  sideOffset = 8,
  hideArrow = false,
  children,
  ...props
}: React.ComponentProps<typeof PopoverPopup>): React.JSX.Element {
  return (
    <PopoverPopup
      className={cn(
        "min-w-(--anchor-width) w-(--popup-width,max-content) **:data-[slot=popover-viewport]:p-1",
        className,
      )}
      sideOffset={sideOffset}
      hideArrow={hideArrow}
      {...props}
    >
      <div className="flex w-full flex-col gap-1">{children}</div>
    </PopoverPopup>
  );
}

export {
  ButtonSplit,
  ButtonSplitAction,
  ButtonSplitContent,
  ButtonSplitSeparator,
  ButtonSplitTrigger,
};
