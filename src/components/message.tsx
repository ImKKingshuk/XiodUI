"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type * as React from "react";

// ============================================================================
// Message Thread Containers
// ============================================================================

export interface MessageGroupProps extends useRender.ComponentProps<"div"> {}

export function MessageGroup({
  className,
  render,
  ...props
}: MessageGroupProps): React.ReactElement {
  const defaultProps = {
    "data-slot": "message-group",
    className: cn("flex min-w-0 flex-col gap-2", className),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export interface MessageProps extends useRender.ComponentProps<"div"> {
  align?: "start" | "end";
}

export function Message({
  className,
  align = "start",
  render,
  ...props
}: MessageProps): React.ReactElement {
  const defaultProps = {
    "data-slot": "message",
    "data-align": align,
    className: cn(
      "group/message relative flex w-full min-w-0 gap-3 text-sm data-[align=end]:flex-row-reverse",
      className,
    ),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export interface MessageAvatarProps extends useRender.ComponentProps<"div"> {}

export function MessageAvatar({
  className,
  render,
  ...props
}: MessageAvatarProps): React.ReactElement {
  const defaultProps = {
    "data-slot": "message-avatar",
    className: cn(
      "flex w-8 h-8 shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-muted select-none group-has-data-[slot=message-footer]/message:-translate-y-6 transition-transform duration-200",
      className,
    ),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export interface MessageContentProps extends useRender.ComponentProps<"div"> {}

export function MessageContent({
  className,
  render,
  ...props
}: MessageContentProps): React.ReactElement {
  const defaultProps = {
    "data-slot": "message-content",
    className: cn(
      "flex w-full min-w-0 flex-col gap-1.5 break-words group-data-[align=end]/message:*:data-[slot=bubble]:self-end group-data-[align=end]/message:*:data-[slot=message-header]:self-end group-data-[align=end]/message:*:data-[slot=message-footer]:self-end",
      className,
    ),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export interface MessageHeaderProps extends useRender.ComponentProps<"div"> {}

export function MessageHeader({
  className,
  render,
  ...props
}: MessageHeaderProps): React.ReactElement {
  const defaultProps = {
    "data-slot": "message-header",
    className: cn(
      "flex max-w-full min-w-0 items-center px-3.5 text-xs font-medium text-muted-foreground",
      className,
    ),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export interface MessageFooterProps extends useRender.ComponentProps<"div"> {}

export function MessageFooter({
  className,
  render,
  ...props
}: MessageFooterProps): React.ReactElement {
  const defaultProps = {
    "data-slot": "message-footer",
    className: cn(
      "flex max-w-full min-w-0 items-center px-3.5 text-xs font-medium text-muted-foreground group-data-[align=end]/message:justify-end",
      className,
    ),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

// ============================================================================
// Bubble Visual Presentation Layer
// ============================================================================

export const bubbleVariants = cva(
  "group/bubble relative flex w-fit max-w-[80%] min-w-0 flex-col gap-1 transition-[color,background-color,border-color,opacity,box-shadow] duration-200",
  {
    variants: {
      variant: {
        default:
          "*:data-[slot=bubble-content]:bg-primary *:data-[slot=bubble-content]:text-primary-foreground [&_[data-slot=bubble-content]:is(button,a):hover]:bg-primary/90",
        secondary:
          "*:data-[slot=bubble-content]:bg-secondary *:data-[slot=bubble-content]:text-secondary-foreground [&_[data-slot=bubble-content]:is(button,a):hover]:bg-secondary/80",
        muted:
          "*:data-[slot=bubble-content]:bg-muted *:data-[slot=bubble-content]:text-foreground [&_[data-slot=bubble-content]:is(button,a):hover]:bg-muted/80",
        tinted:
          "*:data-[slot=bubble-content]:bg-primary/8 *:data-[slot=bubble-content]:text-primary [&_[data-slot=bubble-content]:is(button,a):hover]:bg-primary/16",
        outline:
          "*:data-[slot=bubble-content]:border-border *:data-[slot=bubble-content]:bg-background *:data-[slot=bubble-content]:text-foreground [&_[data-slot=bubble-content]:is(button,a):hover]:bg-muted",
        ghost:
          "*:data-[slot=bubble-content]:border-none *:data-[slot=bubble-content]:bg-transparent *:data-[slot=bubble-content]:p-0 *:data-[slot=bubble-content]:text-foreground [&_[data-slot=bubble-content]:is(button,a):hover]:bg-muted/30",
        destructive:
          "*:data-[slot=bubble-content]:bg-destructive/10 *:data-[slot=bubble-content]:text-destructive [&_[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BubbleProps
  extends useRender.ComponentProps<"div">, VariantProps<typeof bubbleVariants> {
  align?: "start" | "end";
}

export function Bubble({
  variant = "default",
  align = "start",
  className,
  render,
  ...props
}: BubbleProps): React.ReactElement {
  const defaultProps = {
    "data-slot": "bubble",
    "data-variant": variant,
    "data-align": align,
    className: cn(
      bubbleVariants({ variant }),
      "has-[[data-slot=bubble-reactions][data-side=bottom]]:mb-2.5",
      "has-[[data-slot=bubble-reactions][data-side=top]]:mt-2.5",
      className,
    ),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export function BubbleContent({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const defaultProps = {
    className: cn(
      "w-fit max-w-full min-w-0 overflow-hidden rounded-3xl border border-transparent px-[calc(--spacing(4)-1px)] py-[calc(--spacing(2.5)-1px)] text-sm leading-relaxed break-words",
      "group-data-[align=end]/bubble:self-end group-data-[align=end]/bubble:rounded-tr-md",
      "group-data-[align=start]/bubble:self-start group-data-[align=start]/bubble:rounded-tl-md",
      "[button]:text-left [button,a]:transition-colors [button,a]:outline-none [button,a]:focus-visible:border-ring [button,a]:focus-visible:ring-2 [button,a]:focus-visible:ring-ring/30",
      className,
    ),
    "data-slot": "bubble-content",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export const bubbleReactionsVariants = cva(
  "absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-full bg-muted border border-border px-[calc(--spacing(1.5)-1px)] py-[calc(--spacing(0.5)-1px)] text-xs select-none shadow-sm/5 transition-[transform,opacity,color,background-color,border-color,box-shadow]",
  {
    variants: {
      side: {
        top: "top-0 -translate-y-1/2",
        bottom: "bottom-0 translate-y-1/2",
      },
      align: {
        start: "left-4",
        end: "right-4",
      },
    },
    defaultVariants: {
      side: "bottom",
      align: "end",
    },
  },
);

export interface BubbleReactionsProps
  extends
    useRender.ComponentProps<"div">,
    VariantProps<typeof bubbleReactionsVariants> {}

export function BubbleReactions({
  side = "bottom",
  align = "end",
  className,
  render,
  ...props
}: BubbleReactionsProps): React.ReactElement {
  const defaultProps = {
    "data-slot": "bubble-reactions",
    "data-align": align,
    "data-side": side,
    className: cn(bubbleReactionsVariants({ side, align }), className),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}
