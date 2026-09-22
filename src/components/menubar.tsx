"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar";
import { cn } from "cn";
import type * as React from "react";

import {
  Menu,
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuPortal,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
} from "./menu";

function Menubar({
  className,
  ...props
}: MenubarPrimitive.Props): React.JSX.Element {
  return (
    <MenubarPrimitive
      className={cn(
        "relative flex flex-wrap min-h-10 sm:min-h-9 items-center gap-1 rounded-lg border bg-card not-dark:bg-clip-padding p-[calc(--spacing(1)-1px)] text-card-foreground shadow-xs/5 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
        className,
      )}
      data-slot="menubar"
      {...props}
    />
  );
}

function MenubarMenu(props: MenuPrimitive.Root.Props): React.JSX.Element {
  return <Menu data-slot="menubar-menu" {...props} />;
}

function MenubarGroup(props: MenuPrimitive.Group.Props): React.JSX.Element {
  return <MenuGroup data-slot="menubar-group" {...props} />;
}

function MenubarPortal(props: MenuPrimitive.Portal.Props): React.JSX.Element {
  return <MenuPortal {...props} />;
}

function MenubarSub(props: MenuPrimitive.SubmenuRoot.Props): React.JSX.Element {
  return <MenuSub data-slot="menubar-sub" {...props} />;
}

function MenubarRadioGroup(
  props: MenuPrimitive.RadioGroup.Props,
): React.JSX.Element {
  return <MenuRadioGroup data-slot="menubar-radio-group" {...props} />;
}

function MenubarTrigger({
  className,
  ...props
}: MenuPrimitive.Trigger.Props): React.JSX.Element {
  return (
    <MenuPrimitive.Trigger
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-3 py-1.5 sm:py-1 text-base sm:text-sm font-medium outline-none focus-visible:bg-accent focus-visible:text-accent-foreground data-popup-open:bg-accent data-popup-open:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-64 pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11",
        className,
      )}
      data-slot="menubar-trigger"
      {...props}
    />
  );
}

function MenubarPopup({
  align = "start",
  sideOffset = 10,
  hideArrow = false,
  ...props
}: MenuPrimitive.Popup.Props & {
  align?: MenuPrimitive.Positioner.Props["align"];
  sideOffset?: MenuPrimitive.Positioner.Props["sideOffset"];
  alignOffset?: MenuPrimitive.Positioner.Props["alignOffset"];
  side?: MenuPrimitive.Positioner.Props["side"];
  anchor?: MenuPrimitive.Positioner.Props["anchor"];
  /**
   * Whether to hide the arrow indicator.
   * @default false
   */
  hideArrow?: boolean;
}): React.JSX.Element {
  return (
    // Animated via MenuPopup (uses data-starting-style / data-ending-style)
    <MenuPopup
      align={align}
      data-slot="menubar-popup"
      sideOffset={sideOffset}
      hideArrow={hideArrow}
      {...props}
    />
  );
}

function MenubarItem(
  props: MenuPrimitive.Item.Props & {
    inset?: boolean;
    variant?: "default" | "destructive";
  },
): React.JSX.Element {
  return <MenuItem data-slot="menubar-item" {...props} />;
}

function MenubarCheckboxItem(
  props: MenuPrimitive.CheckboxItem.Props,
): React.JSX.Element {
  return <MenuCheckboxItem data-slot="menubar-checkbox-item" {...props} />;
}

function MenubarRadioItem(
  props: MenuPrimitive.RadioItem.Props,
): React.JSX.Element {
  return <MenuRadioItem data-slot="menubar-radio-item" {...props} />;
}

function MenubarLabel(
  props: MenuPrimitive.GroupLabel.Props & { inset?: boolean },
): React.JSX.Element {
  return <MenuGroupLabel data-slot="menubar-label" {...props} />;
}

function MenubarSeparator(
  props: MenuPrimitive.Separator.Props,
): React.JSX.Element {
  return <MenuSeparator data-slot="menubar-separator" {...props} />;
}

function MenubarShortcut(
  props: React.HTMLAttributes<HTMLSpanElement>,
): React.JSX.Element {
  return <MenuShortcut data-slot="menubar-shortcut" {...props} />;
}

function MenubarSubTrigger(
  props: MenuPrimitive.SubmenuTrigger.Props & {
    inset?: boolean;
  },
): React.JSX.Element {
  return <MenuSubTrigger data-slot="menubar-sub-trigger" {...props} />;
}

function MenubarSubPopup(props: MenuPrimitive.Popup.Props): React.JSX.Element {
  return <MenuSubPopup data-slot="menubar-sub-popup" {...props} />;
}

export {
  Menubar,
  MenubarCheckboxItem,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPopup,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubPopup,
  MenubarSubTrigger,
  MenubarTrigger,
};
