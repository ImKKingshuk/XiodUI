"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import * as React from "react";
import { Check as CheckIcon } from "xiod-icons/icons/Check";
import { Copy as CopyIcon } from "xiod-icons/icons/Copy";

import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard";
import { anchoredToastManager } from "./toast";
import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

export const copyToClipboardVariants = cva(
  "relative inline-flex w-fit max-w-full min-w-0 items-center rounded-lg border border-input bg-background not-dark:bg-clip-padding text-base text-foreground shadow-xs/5 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/24 sm:text-sm dark:bg-input/32 dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
  {
    variants: {
      size: {
        default: "h-8.5 sm:h-7.5",
        sm: "h-7.5 sm:h-6.5",
        lg: "h-9.5 sm:h-8.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export interface CopyToClipboardProps
  extends
    useRender.ComponentProps<"div">,
    VariantProps<typeof copyToClipboardVariants> {
  /** The text to display in the field */
  text: string;
  /**
   * If provided, this text will be copied to clipboard instead of the `text` prop.
   */
  textToCopy?: string;
  /**
   * Text shown in the tooltip on hover.
   * @default "Copy"
   */
  tooltipText?: string;
  /**
   * Text shown in the toast after copying.
   * @default "Copied!"
   */
  copiedText?: string;
  /**
   * Disable the tooltip entirely.
   * @default false
   */
  disableTooltip?: boolean;
}

export function CopyToClipboard({
  className,
  size = "default",
  text,
  textToCopy,
  tooltipText = "Copy",
  copiedText = "Copied!",
  disableTooltip = false,
  render,
  ...props
}: CopyToClipboardProps): React.ReactElement {
  const { copyToClipboard, isCopied } = useCopyToClipboard({ timeout: 2000 });
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const valueToCopy = textToCopy ?? text;

  const handleCopy = React.useCallback(() => {
    copyToClipboard(valueToCopy);

    // Trigger anchored toast
    if (buttonRef.current) {
      anchoredToastManager.add({
        description: copiedText,
        positionerProps: {
          anchor: buttonRef.current,
          side: "top",
          sideOffset: 8,
        },
        data: { tooltipStyle: true },
        timeout: 2000,
      });
    }
  }, [copyToClipboard, valueToCopy, copiedText]);

  const buttonContent = (
    <>
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-[transform,opacity] duration-200",
          isCopied
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none",
        )}
        aria-hidden="true"
      >
        <CheckIcon className="size-4 text-success" />
      </span>
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-[transform,opacity] duration-200",
          isCopied
            ? "-translate-y-full opacity-0 pointer-events-none"
            : "translate-y-0 opacity-100",
        )}
        aria-hidden="true"
      >
        <CopyIcon className="size-4 text-muted-foreground transition-colors group-hover/btn:text-foreground" />
      </span>
    </>
  );

  const buttonElement = (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleCopy}
      aria-label={tooltipText}
      className={cn(
        "group/btn relative isolate flex aspect-square h-full items-center justify-center overflow-hidden rounded-r-[calc(var(--radius-lg)-1px)] border-l border-border text-muted-foreground transition-[color,background-color,box-shadow] hover:bg-accent hover:text-accent-foreground focus-visible:-outline-offset-1 focus-visible:outline-ring pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
      )}
    >
      {buttonContent}
    </button>
  );

  const wrappedButton = disableTooltip ? (
    buttonElement
  ) : (
    <TooltipProvider delay={200}>
      <Tooltip>
        <TooltipTrigger render={buttonElement} />
        <TooltipPopup side="top" sideOffset={8}>
          {tooltipText}
        </TooltipPopup>
      </Tooltip>
    </TooltipProvider>
  );

  const defaultProps = {
    className: cn(copyToClipboardVariants({ size }), className),
    "data-slot": "copy-to-clipboard",
  };

  const wrapperProps = mergeProps<"div">(defaultProps, props, {
    children: (
      <>
        <span className="flex-1 truncate ps-[calc(--spacing(3)-1px)] pe-3 font-mono text-[0.875em] text-foreground sm:ps-[calc(--spacing(2.5)-1px)]">
          {text}
        </span>
        {wrappedButton}
      </>
    ),
  });

  return useRender({
    defaultTagName: "div",
    render,
    props: wrapperProps,
  });
}
