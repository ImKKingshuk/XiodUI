"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type * as React from "react";

const gridVariants = cva("grid", {
  variants: {
    columns: {
      none: "grid-cols-none",
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
      7: "grid-cols-7",
      8: "grid-cols-8",
      9: "grid-cols-9",
      10: "grid-cols-10",
      11: "grid-cols-11",
      12: "grid-cols-12",
      subgrid: "grid-cols-subgrid",
    },
    rows: {
      none: "grid-rows-none",
      1: "grid-rows-1",
      2: "grid-rows-2",
      3: "grid-rows-3",
      4: "grid-rows-4",
      5: "grid-rows-5",
      6: "grid-rows-6",
      7: "grid-rows-7",
      8: "grid-rows-8",
      9: "grid-rows-9",
      10: "grid-rows-10",
      11: "grid-rows-11",
      12: "grid-rows-12",
      subgrid: "grid-rows-subgrid",
    },
    flow: {
      row: "grid-flow-row",
      col: "grid-flow-col",
      dense: "grid-flow-dense",
      "row-dense": "grid-flow-row-dense",
      "col-dense": "grid-flow-col-dense",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    },
    justify: {
      start: "justify-items-start",
      center: "justify-items-center",
      end: "justify-items-end",
      stretch: "justify-items-stretch",
      between: "justify-between",
    },
    gap: {
      none: "gap-0",
      sm: "gap-3",
      base: "gap-4 sm:gap-6",
      md: "gap-6",
      lg: "gap-8",
      xl: "gap-12",
    },
  },
  defaultVariants: {
    gap: "base",
  },
});

interface GridProps
  extends useRender.ComponentProps<"div">, VariantProps<typeof gridVariants> {}

function Grid({
  className,
  render,
  columns,
  rows,
  flow,
  align,
  justify,
  gap,
  ...props
}: GridProps): React.ReactElement {
  const defaultProps = {
    className: cn(
      gridVariants({ columns, rows, flow, align, justify, gap }),
      className,
    ),
    "data-slot": "grid",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

const gridItemVariants = cva("", {
  variants: {
    colSpan: {
      auto: "col-auto",
      full: "col-span-full",
      1: "col-span-1",
      2: "col-span-2",
      3: "col-span-3",
      4: "col-span-4",
      5: "col-span-5",
      6: "col-span-6",
      7: "col-span-7",
      8: "col-span-8",
      9: "col-span-9",
      10: "col-span-10",
      11: "col-span-11",
      12: "col-span-12",
    },
    rowSpan: {
      auto: "row-auto",
      full: "row-span-full",
      1: "row-span-1",
      2: "row-span-2",
      3: "row-span-3",
      4: "row-span-4",
      5: "row-span-5",
      6: "row-span-6",
      7: "row-span-7",
      8: "row-span-8",
      9: "row-span-9",
      10: "row-span-10",
      11: "row-span-11",
      12: "row-span-12",
    },
    colStart: {
      1: "col-start-1",
      2: "col-start-2",
      3: "col-start-3",
      4: "col-start-4",
      5: "col-start-5",
      6: "col-start-6",
      7: "col-start-7",
      8: "col-start-8",
      9: "col-start-9",
      10: "col-start-10",
      11: "col-start-11",
      12: "col-start-12",
      13: "col-start-13",
    },
    colEnd: {
      1: "col-end-1",
      2: "col-end-2",
      3: "col-end-3",
      4: "col-end-4",
      5: "col-end-5",
      6: "col-end-6",
      7: "col-end-7",
      8: "col-end-8",
      9: "col-end-9",
      10: "col-end-10",
      11: "col-end-11",
      12: "col-end-12",
      13: "col-end-13",
    },
    rowStart: {
      1: "row-start-1",
      2: "row-start-2",
      3: "row-start-3",
      4: "row-start-4",
      5: "row-start-5",
      6: "row-start-6",
      7: "row-start-7",
      8: "row-start-8",
      9: "row-start-9",
      10: "row-start-10",
      11: "row-start-11",
      12: "row-start-12",
      13: "row-start-13",
    },
    rowEnd: {
      1: "row-end-1",
      2: "row-end-2",
      3: "row-end-3",
      4: "row-end-4",
      5: "row-end-5",
      6: "row-end-6",
      7: "row-end-7",
      8: "row-end-8",
      9: "row-end-9",
      10: "row-end-10",
      11: "row-end-11",
      12: "row-end-12",
      13: "row-end-13",
    },
  },
});

interface GridItemProps
  extends
    useRender.ComponentProps<"div">,
    VariantProps<typeof gridItemVariants> {}

function GridItem({
  className,
  render,
  colSpan,
  rowSpan,
  colStart,
  colEnd,
  rowStart,
  rowEnd,
  ...props
}: GridItemProps): React.ReactElement {
  const defaultProps = {
    className: cn(
      gridItemVariants({
        colSpan,
        rowSpan,
        colStart,
        colEnd,
        rowStart,
        rowEnd,
      }),
      className,
    ),
    "data-slot": "grid-item",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export type { GridItemProps, GridProps };
export { Grid, GridItem, gridItemVariants, gridVariants };
