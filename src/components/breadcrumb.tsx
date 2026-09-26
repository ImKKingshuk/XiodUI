"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "cn";
import type * as React from "react";
import { ChevronRight } from "xiod-icons/icons/ChevronRight";
import { MoreHorizontal } from "xiod-icons/icons/MoreHorizontal";

import { IconSlot } from "./icon-provider";

function Breadcrumb({
  className,
  render,
  ...props
}: useRender.ComponentProps<"nav">): React.ReactElement {
  const defaultProps = {
    "aria-label": "breadcrumb",
    className: cn(className),
    "data-slot": "breadcrumb",
  };

  return useRender({
    defaultTagName: "nav",
    props: mergeProps<"nav">(defaultProps, props),
    render,
  });
}

function BreadcrumbList({
  className,
  render,
  ...props
}: useRender.ComponentProps<"ol">): React.ReactElement {
  const defaultProps = {
    className: cn(
      "wrap-break-word flex flex-wrap items-center gap-1.5 text-muted-foreground text-sm sm:gap-2.5",
      className,
    ),
    "data-slot": "breadcrumb-list",
  };

  return useRender({
    defaultTagName: "ol",
    props: mergeProps<"ol">(defaultProps, props),
    render,
  });
}

function BreadcrumbItem({
  className,
  render,
  ...props
}: useRender.ComponentProps<"li">): React.ReactElement {
  const defaultProps = {
    className: cn("inline-flex items-center gap-1.5", className),
    "data-slot": "breadcrumb-item",
  };

  return useRender({
    defaultTagName: "li",
    props: mergeProps<"li">(defaultProps, props),
    render,
  });
}

function BreadcrumbLink({
  className,
  render,
  ...props
}: useRender.ComponentProps<"a">): React.ReactElement {
  const defaultProps = {
    className: cn("transition-colors hover:text-foreground", className),
    "data-slot": "breadcrumb-link",
  };

  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(defaultProps, props),
    render,
  });
}

function BreadcrumbPage({
  className,
  render,
  ...props
}: useRender.ComponentProps<"span">): React.ReactElement {
  const defaultProps = {
    "aria-current": "page" as const,
    "aria-disabled": true,
    className: cn("font-normal text-foreground", className),
    "data-slot": "breadcrumb-page",
    role: "link",
  };

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(defaultProps, props),
    render,
  });
}

function BreadcrumbSeparator({
  children,
  className,
  render,
  icon,
  ...props
}: useRender.ComponentProps<"li"> & {
  /** Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`. */
  icon?: React.ReactNode;
}): React.ReactElement {
  const defaultProps = {
    "aria-hidden": true,
    className: cn(
      "opacity-80 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
      className,
    ),
    "data-slot": "breadcrumb-separator",
    role: "presentation",
    children: children ?? (
      <IconSlot name="ChevronRight" icon={icon} fallback={ChevronRight} />
    ),
  };

  return useRender({
    defaultTagName: "li",
    props: mergeProps<"li">(defaultProps, props),
    render,
  });
}

function BreadcrumbEllipsis({
  className,
  render,
  icon,
  ...props
}: useRender.ComponentProps<"span"> & {
  /** Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`. */
  icon?: React.ReactNode;
}): React.ReactElement {
  const defaultProps = {
    "aria-hidden": true,
    className: cn(
      "flex size-9 items-center justify-center [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
      className,
    ),
    "data-slot": "breadcrumb-ellipsis",
    role: "presentation",
    children: (
      <>
        <IconSlot
          name="MoreHorizontal"
          icon={icon}
          fallback={MoreHorizontal}
          className="size-4"
        />
        <span className="sr-only">More</span>
      </>
    ),
  };

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(defaultProps, props),
    render,
  });
}

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
