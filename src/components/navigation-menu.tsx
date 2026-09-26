"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "cn";
import type * as React from "react";
import { ChevronDown as ChevronDownIcon } from "xiod-icons/icons/ChevronDown";

import { IconSlot } from "./icon-provider";

function NavigationMenu({
  className,
  ...props
}: NavigationMenuPrimitive.Root.Props): React.JSX.Element {
  return (
    <NavigationMenuPrimitive.Root
      className={cn(
        "relative flex max-w-max flex-1 items-center justify-center",
        className,
      )}
      data-slot="navigation-menu"
      {...props}
    />
  );
}

function NavigationMenuList({
  className,
  ...props
}: NavigationMenuPrimitive.List.Props): React.JSX.Element {
  return (
    <NavigationMenuPrimitive.List
      className={cn(
        "group flex flex-1 list-none items-center justify-center space-x-1",
        className,
      )}
      data-slot="navigation-menu-list"
      {...props}
    />
  );
}

function NavigationMenuItem({
  className,
  ...props
}: NavigationMenuPrimitive.Item.Props): React.JSX.Element {
  return (
    <NavigationMenuPrimitive.Item
      className={cn("relative", className)}
      data-slot="navigation-menu-item"
      {...props}
    />
  );
}

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Trigger.Props): React.JSX.Element {
  return (
    <NavigationMenuPrimitive.Trigger
      className={cn(
        "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-64 data-popup-open:bg-accent/50 data-popup-open:text-accent-foreground pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 sm:h-8",
        className,
      )}
      data-slot="navigation-menu-trigger"
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuIcon({
  className,
  icon,
  ...props
}: NavigationMenuPrimitive.Icon.Props & {
  /** Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`. */
  icon?: React.ReactNode;
}): React.JSX.Element {
  return (
    <NavigationMenuPrimitive.Icon
      className={cn(
        "relative ml-1 size-3 transition duration-200 data-popup-open:rotate-180 [&_svg:not([class*='size-'])]:size-full [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      data-slot="navigation-menu-icon"
      {...props}
    >
      <IconSlot
        name="ChevronDown"
        icon={icon}
        fallback={ChevronDownIcon}
        className="size-full"
      />
    </NavigationMenuPrimitive.Icon>
  );
}

function NavigationMenuContent({
  className,
  ...props
}: NavigationMenuPrimitive.Content.Props): React.JSX.Element {
  return (
    <NavigationMenuPrimitive.Content
      className={cn(
        "left-0 top-0 w-[calc(100vw-40px)] min-w-[280px] sm:min-w-[400px] p-4 transition-[opacity,transform,translate] duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:data-[activation-direction=left]:translate-x-[50%] data-ending-style:data-[activation-direction=right]:translate-x-[-50%] data-starting-style:data-[activation-direction=left]:translate-x-[-50%] data-starting-style:data-[activation-direction=right]:translate-x-[50%] sm:w-max",
        className,
      )}
      data-slot="navigation-menu-content"
      {...props}
    />
  );
}

function NavigationMenuLink({
  className,
  render,
  ...props
}: useRender.ComponentProps<"a"> & {
  active?: boolean;
}): React.JSX.Element {
  const defaultProps = {
    className: cn(
      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-ring pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11",
      className,
    ),
    "data-slot": "navigation-menu-link",
  };

  return (
    <NavigationMenuPrimitive.Link
      render={useRender({
        defaultTagName: "a",
        props: mergeProps<"a">(defaultProps, props),
        render,
      })}
    />
  );
}

function ArrowSvg(props: React.ComponentProps<"svg">) {
  return (
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none" {...props}>
      <path
        d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
        className="fill-popover"
      />
      <path
        d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
        className="fill-border"
      />
    </svg>
  );
}

function NavigationMenuViewport({
  className,
  ...props
}: NavigationMenuPrimitive.Viewport.Props): React.JSX.Element {
  return (
    <NavigationMenuPrimitive.Viewport
      className={cn("relative h-full w-full overflow-hidden", className)}
      data-slot="navigation-menu-viewport"
      {...props}
    />
  );
}

const NavigationMenuPortal = NavigationMenuPrimitive.Portal;

function NavigationMenuPopup({
  children,
  className,
  sideOffset = 10,
  align = "center",
  alignOffset,
  side = "bottom",
  anchor,
  hideArrow = false,
  ...props
}: NavigationMenuPrimitive.Popup.Props & {
  align?: NavigationMenuPrimitive.Positioner.Props["align"];
  sideOffset?: NavigationMenuPrimitive.Positioner.Props["sideOffset"];
  alignOffset?: NavigationMenuPrimitive.Positioner.Props["alignOffset"];
  side?: NavigationMenuPrimitive.Positioner.Props["side"];
  anchor?: NavigationMenuPrimitive.Positioner.Props["anchor"];
  hideArrow?: boolean;
}): React.JSX.Element {
  return (
    <NavigationMenuPrimitive.Portal>
      <NavigationMenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="box-border h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-200 ease-in-out z-50 before:absolute before:content-[''] data-instant:transition-none data-[side=bottom]:before:top-[-10px] data-[side=bottom]:before:right-0 data-[side=bottom]:before:left-0 data-[side=bottom]:before:h-2.5 data-[side=left]:before:top-0 data-[side=left]:before:right-[-10px] data-[side=left]:before:bottom-0 data-[side=left]:before:w-2.5 data-[side=right]:before:top-0 data-[side=right]:before:bottom-0 data-[side=right]:before:left-[-10px] data-[side=right]:before:w-2.5 data-[side=top]:before:right-0 data-[side=top]:before:bottom-[-10px] data-[side=top]:before:left-0 data-[side=top]:before:h-2.5"
        data-slot="navigation-menu-positioner"
        side={side}
        sideOffset={sideOffset}
      >
        <NavigationMenuPrimitive.Popup
          className={cn(
            "relative origin-(--transform-origin) w-(--popup-width) h-(--popup-height) rounded-xl border bg-popover text-popover-foreground shadow-lg/5 outline-none before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] focus:outline-none dark:before:shadow-[0_-1px_--theme(--color-white/6%)] transition-[opacity,transform,width,height,scale,translate] duration-200 ease-in-out data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0",
            className,
          )}
          data-slot="navigation-menu-popup"
          {...props}
        >
          {!hideArrow && (
            <NavigationMenuPrimitive.Arrow className="z-10 flex transition-[left] duration-200 ease-in-out data-[side=bottom]:top-[-9px] data-[side=bottom]:rotate-0 data-[side=left]:right-[-14px] data-[side=left]:rotate-90 data-[side=right]:left-[-14px] data-[side=right]:-rotate-90 data-[side=top]:bottom-[-9px] data-[side=top]:rotate-180">
              <ArrowSvg />
            </NavigationMenuPrimitive.Arrow>
          )}
          {children}
        </NavigationMenuPrimitive.Popup>
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPrimitive.Portal>
  );
}

function NavigationMenuIndicator({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  // There is no separate indicator element: the active-item affordance is
  // handled by the positioner and popup animation. This stays as a no-op
  // placeholder so the part is available if that ever changes.
  const defaultProps = {
    className: cn("hidden", className),
    "data-slot": "navigation-menu-indicator",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIcon,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPopup,
  NavigationMenuPortal,
  NavigationMenuTrigger,
  NavigationMenuViewport,
};
