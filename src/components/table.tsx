"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "cn";
import type * as React from "react";

function Table({
  className,
  render,
  ...props
}: useRender.ComponentProps<"table">): React.ReactElement {
  const defaultProps = {
    className: cn(
      "w-full caption-bottom in-data-[slot=frame]:border-separate in-data-[slot=frame]:border-spacing-0 text-sm",
      className,
    ),
    "data-slot": "table",
  };

  const tableElement = useRender({
    defaultTagName: "table",
    props: mergeProps<"table">(defaultProps, props),
    render,
  });

  return (
    <div
      className="relative w-full overflow-x-auto"
      data-slot="table-container"
    >
      {tableElement}
    </div>
  );
}

function TableHeader({
  className,
  render,
  ...props
}: useRender.ComponentProps<"thead">): React.ReactElement {
  const defaultProps = {
    className: cn(
      "[&_tr]:border-b in-data-[slot=frame]:**:[th]:h-9 in-data-[slot=frame]:*:[tr]:border-none in-data-[slot=frame]:*:[tr]:hover:bg-transparent",
      className,
    ),
    "data-slot": "table-header",
  };

  return useRender({
    defaultTagName: "thead",
    props: mergeProps<"thead">(defaultProps, props),
    render,
  });
}

function TableBody({
  className,
  render,
  ...props
}: useRender.ComponentProps<"tbody">): React.ReactElement {
  const defaultProps = {
    className: cn(
      "relative in-data-[slot=frame]:rounded-xl in-data-[slot=frame]:shadow-xs/5 before:pointer-events-none before:absolute before:inset-px not-in-data-[slot=frame]:before:hidden before:rounded-[calc(var(--radius-xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/8%)] [&_tr:last-child]:border-0 in-data-[slot=frame]:*:[tr]:border-0 in-data-[slot=frame]:*:[tr]:*:[td]:border-b in-data-[slot=frame]:*:[tr]:*:[td]:bg-background in-data-[slot=frame]:*:[tr]:*:[td]:bg-clip-padding in-data-[slot=frame]:*:[tr]:first:*:[td]:first:rounded-ss-xl in-data-[slot=frame]:*:[tr]:*:[td]:first:border-s in-data-[slot=frame]:*:[tr]:first:*:[td]:border-t in-data-[slot=frame]:*:[tr]:last:*:[td]:last:rounded-ee-xl in-data-[slot=frame]:*:[tr]:*:[td]:last:border-e in-data-[slot=frame]:*:[tr]:first:*:[td]:last:rounded-se-xl in-data-[slot=frame]:*:[tr]:last:*:[td]:first:rounded-es-xl in-data-[slot=frame]:*:[tr]:hover:*:[td]:bg-transparent in-data-[slot=frame]:*:[tr]:data-[state=selected]:*:[td]:bg-muted/72",
      className,
    ),
    "data-slot": "table-body",
  };

  return useRender({
    defaultTagName: "tbody",
    props: mergeProps<"tbody">(defaultProps, props),
    render,
  });
}

function TableFooter({
  className,
  render,
  ...props
}: useRender.ComponentProps<"tfoot">): React.ReactElement {
  const defaultProps = {
    className: cn(
      "border-t in-data-[slot=frame]:border-none bg-muted/72 in-data-[slot=frame]:bg-transparent font-medium [&>tr]:last:border-b-0 in-data-[slot=frame]:*:[tr]:hover:bg-transparent",
      className,
    ),
    "data-slot": "table-footer",
  };

  return useRender({
    defaultTagName: "tfoot",
    props: mergeProps<"tfoot">(defaultProps, props),
    render,
  });
}

function TableRow({
  className,
  render,
  ...props
}: useRender.ComponentProps<"tr">): React.ReactElement {
  const defaultProps = {
    className: cn(
      "border-b transition-colors hover:bg-muted/72 in-data-[slot=frame]:hover:bg-transparent data-[state=selected]:bg-muted/72 in-data-[slot=frame]:data-[state=selected]:bg-transparent",
      className,
    ),
    "data-slot": "table-row",
  };

  return useRender({
    defaultTagName: "tr",
    props: mergeProps<"tr">(defaultProps, props),
    render,
  });
}

function TableHead({
  className,
  render,
  ...props
}: useRender.ComponentProps<"th">): React.ReactElement {
  const defaultProps = {
    className: cn(
      "h-10 whitespace-nowrap px-2.5 text-left align-middle font-medium text-muted-foreground leading-none has-[[role=checkbox]]:w-px has-[[role=checkbox]]:pe-0",
      className,
    ),
    "data-slot": "table-head",
  };

  return useRender({
    defaultTagName: "th",
    props: mergeProps<"th">(defaultProps, props),
    render,
  });
}

function TableCell({
  className,
  render,
  ...props
}: useRender.ComponentProps<"td">): React.ReactElement {
  const defaultProps = {
    className: cn(
      "whitespace-nowrap p-2.5 align-middle leading-none in-data-[slot=frame]:first:p-[calc(--spacing(2.5)-1px)] in-data-[slot=frame]:last:p-[calc(--spacing(2.5)-1px)] has-[[role=checkbox]]:pe-0",
      className,
    ),
    "data-slot": "table-cell",
  };

  return useRender({
    defaultTagName: "td",
    props: mergeProps<"td">(defaultProps, props),
    render,
  });
}

function TableCaption({
  className,
  render,
  ...props
}: useRender.ComponentProps<"caption">): React.ReactElement {
  const defaultProps = {
    className: cn(
      "in-data-[slot=frame]:my-4 mt-4 text-muted-foreground text-sm",
      className,
    ),
    "data-slot": "table-caption",
  };

  return useRender({
    defaultTagName: "caption",
    props: mergeProps<"caption">(defaultProps, props),
    render,
  });
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
