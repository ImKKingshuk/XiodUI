"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "cn";
import type * as React from "react";

function Frame({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const defaultProps = {
    className: cn(
      "relative flex flex-col rounded-2xl bg-muted/72 p-1",
      "*:[[data-slot=frame-panel]+[data-slot=frame-panel]]:mt-1",
      className,
    ),
    "data-slot": "frame",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

function FramePanel({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const defaultProps = {
    className: cn(
      "relative rounded-xl border bg-background bg-clip-padding p-[calc(--spacing(5)-1px)] shadow-xs/5 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
      className,
    ),
    "data-slot": "frame-panel",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

function FrameHeader({
  className,
  render,
  ...props
}: useRender.ComponentProps<"header">): React.ReactElement {
  const defaultProps = {
    className: cn("flex flex-col px-5 py-4", className),
    "data-slot": "frame-panel-header",
  };

  return useRender({
    defaultTagName: "header",
    props: mergeProps<"header">(defaultProps, props),
    render,
  });
}

function FrameTitle({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const defaultProps = {
    className: cn("font-semibold text-sm", className),
    "data-slot": "frame-panel-title",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

function FrameDescription({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const defaultProps = {
    className: cn("text-muted-foreground text-sm", className),
    "data-slot": "frame-panel-description",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

function FrameFooter({
  className,
  render,
  ...props
}: useRender.ComponentProps<"footer">): React.ReactElement {
  const defaultProps = {
    className: cn("px-5 py-4", className),
    "data-slot": "frame-panel-footer",
  };

  return useRender({
    defaultTagName: "footer",
    props: mergeProps<"footer">(defaultProps, props),
    render,
  });
}

export {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
};
