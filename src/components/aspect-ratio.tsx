"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "cn";
import type * as React from "react";

export interface AspectRatioProps extends useRender.ComponentProps<"div"> {
  ratio?: number;
}

function AspectRatio({
  className,
  ratio = 1,
  render,
  style,
  ...props
}: AspectRatioProps): React.ReactElement {
  const rootProps = {
    className: cn("relative w-full", className),
    style: {
      aspectRatio: `${ratio}`,
      ...style,
    },
    "data-slot": "aspect-ratio",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(rootProps, props),
    render,
  });
}

export { AspectRatio };
