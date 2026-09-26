"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "cn";
import * as React from "react";
import { ChevronFirst as ChevronFirstIcon } from "xiod-icons/icons/ChevronFirst";
import { ChevronLast as ChevronLastIcon } from "xiod-icons/icons/ChevronLast";
import { ChevronLeft as ChevronLeftIcon } from "xiod-icons/icons/ChevronLeft";
import { ChevronRight as ChevronRightIcon } from "xiod-icons/icons/ChevronRight";
import { MoreHorizontal as MoreHorizontalIcon } from "xiod-icons/icons/MoreHorizontal";

import { type Button, buttonVariants } from "./button";
import { IconSlot } from "./icon-provider";

function Pagination({
  className,
  render,
  ...props
}: useRender.ComponentProps<"nav">): React.ReactElement {
  const defaultProps = {
    "aria-label": "pagination",
    className: cn(
      "mx-auto flex w-full justify-center [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
      className,
    ),
    "data-slot": "pagination",
  };

  return useRender({
    defaultTagName: "nav",
    props: mergeProps<"nav">(defaultProps, props),
    render,
  });
}

function PaginationContent({
  className,
  render,
  ...props
}: useRender.ComponentProps<"ul">): React.ReactElement {
  const defaultProps = {
    className: cn("flex flex-row items-center gap-1", className),
    "data-slot": "pagination-content",
  };

  return useRender({
    defaultTagName: "ul",
    props: mergeProps<"ul">(defaultProps, props),
    render,
  });
}

function PaginationItem({
  className,
  render,
  ...props
}: useRender.ComponentProps<"li">): React.ReactElement {
  const defaultProps = {
    className: cn(className),
    "data-slot": "pagination-item",
  };

  return useRender({
    defaultTagName: "li",
    props: mergeProps<"li">(defaultProps, props),
    render,
  });
}

type PaginationLinkProps = {
  isActive?: boolean;
  size?: React.ComponentProps<typeof Button>["size"];
} & useRender.ComponentProps<"a">;

function PaginationLink({
  className,
  isActive,
  size = "icon",
  render,
  ...props
}: PaginationLinkProps): React.ReactElement {
  const defaultProps = {
    "aria-current": isActive ? ("page" as const) : undefined,
    className: render
      ? className
      : cn(
          buttonVariants({
            size,
            variant: isActive ? "outline" : "ghost",
          }),
          className,
        ),
    "data-active": isActive,
    "data-slot": "pagination-link",
  };

  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(defaultProps, props),
    render,
  });
}

function PaginationFirst({
  className,
  icon,
  ...props
}: React.ComponentProps<typeof PaginationLink> & {
  /** Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`. */
  icon?: React.ReactNode;
}): React.JSX.Element {
  return (
    <PaginationLink
      aria-label="Go to first page"
      className={cn("max-sm:aspect-square max-sm:p-0", className)}
      size="default"
      {...props}
    >
      <IconSlot
        name="ChevronFirst"
        icon={icon}
        fallback={ChevronFirstIcon}
        className="sm:-ms-1"
      />
      <span className="max-sm:hidden">First</span>
    </PaginationLink>
  );
}

function PaginationPrevious({
  className,
  icon,
  ...props
}: React.ComponentProps<typeof PaginationLink> & {
  /** Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`. */
  icon?: React.ReactNode;
}): React.JSX.Element {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      className={cn("max-sm:aspect-square max-sm:p-0", className)}
      size="default"
      {...props}
    >
      <IconSlot
        name="ChevronLeft"
        icon={icon}
        fallback={ChevronLeftIcon}
        className="sm:-ms-1"
      />
      <span className="max-sm:hidden">Previous</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  icon,
  ...props
}: React.ComponentProps<typeof PaginationLink> & {
  /** Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`. */
  icon?: React.ReactNode;
}): React.JSX.Element {
  return (
    <PaginationLink
      aria-label="Go to next page"
      className={cn("max-sm:aspect-square max-sm:p-0", className)}
      size="default"
      {...props}
    >
      <span className="max-sm:hidden">Next</span>
      <IconSlot
        name="ChevronRight"
        icon={icon}
        fallback={ChevronRightIcon}
        className="sm:-me-1"
      />
    </PaginationLink>
  );
}

function PaginationLast({
  className,
  icon,
  ...props
}: React.ComponentProps<typeof PaginationLink> & {
  /** Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`. */
  icon?: React.ReactNode;
}): React.JSX.Element {
  return (
    <PaginationLink
      aria-label="Go to last page"
      className={cn("max-sm:aspect-square max-sm:p-0", className)}
      size="default"
      {...props}
    >
      <span className="max-sm:hidden">Last</span>
      <IconSlot
        name="ChevronLast"
        icon={icon}
        fallback={ChevronLastIcon}
        className="sm:-me-1"
      />
    </PaginationLink>
  );
}

function PaginationEllipsis({
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
    className: cn("flex min-w-7 justify-center", className),
    "data-slot": "pagination-ellipsis",
    children: (
      <>
        <IconSlot
          name="MoreHorizontal"
          icon={icon}
          fallback={MoreHorizontalIcon}
          className="size-5 sm:size-4"
        />
        <span className="sr-only">More pages</span>
      </>
    ),
  };

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(defaultProps, props),
    render,
  });
}

export interface PaginationInputProps extends Omit<
  React.ComponentProps<"input">,
  "value" | "onChange"
> {
  value?: number;
  onChange?: (page: number) => void;
  totalPages?: number;
}

function PaginationInput({
  className,
  value,
  onChange,
  totalPages,
  ...props
}: PaginationInputProps): React.JSX.Element {
  const [editingValue, setEditingValue] = React.useState<string>(
    value ? value.toString() : "",
  );

  React.useEffect(() => {
    setEditingValue(value ? value.toString() : "");
  }, [value]);

  const handleCommit = (val: string) => {
    let num = Number.parseInt(val, 10);
    if (Number.isNaN(num) || num < 1) {
      num = 1;
    }
    if (totalPages && num > totalPages) {
      num = totalPages;
    }
    setEditingValue(num.toString());
    if (onChange) {
      onChange(num);
    }
  };

  return (
    <div
      className={cn(
        "relative inline-flex w-12 rounded-lg border border-input bg-background not-dark:bg-clip-padding text-sm text-foreground shadow-xs/5 ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] has-focus-visible:has-aria-invalid:border-destructive/64 has-focus-visible:has-aria-invalid:ring-destructive/16 has-aria-invalid:border-destructive/36 has-focus-visible:border-ring has-disabled:opacity-64 has-[:disabled,:focus-visible,[aria-invalid]]:shadow-none has-focus-visible:ring-[3px] dark:bg-input/32 dark:has-aria-invalid:ring-destructive/24 dark:not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]",
        className,
      )}
      data-slot="pagination-input-wrapper"
    >
      <input
        aria-label="Go to page"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        className="h-9 w-full rounded-[inherit] bg-transparent px-2 text-center text-sm outline-none sm:h-8"
        value={editingValue}
        onChange={(e) => setEditingValue(e.target.value)}
        onBlur={(e) => handleCommit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleCommit(e.currentTarget.value);
          }
        }}
        data-slot="pagination-input"
        {...props}
      />
    </div>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationInput,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
