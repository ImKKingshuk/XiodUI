"use client";

import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card";
import { cn } from "cn";
import type * as React from "react";

const PreviewCard = PreviewCardPrimitive.Root;

function PreviewCardTrigger({
  className,
  ...props
}: PreviewCardPrimitive.Trigger.Props): React.JSX.Element {
  return (
    <PreviewCardPrimitive.Trigger
      className={cn(className)}
      data-slot="preview-card-trigger"
      {...props}
    />
  );
}

function PreviewCardArrow({
  className,
  children,
  ...props
}: PreviewCardPrimitive.Arrow.Props): React.JSX.Element {
  return (
    <PreviewCardPrimitive.Arrow
      className={cn(
        "z-10 flex data-[side=bottom]:-top-[9px] data-[side=bottom]:rotate-0 data-[side=left]:right-[-14px] data-[side=left]:rotate-90 data-[side=right]:left-[-14px] data-[side=right]:-rotate-90 data-[side=top]:-bottom-[9px] data-[side=top]:rotate-180",
        className,
      )}
      data-slot="preview-card-arrow"
      {...props}
    >
      {children ?? <ArrowSvg />}
    </PreviewCardPrimitive.Arrow>
  );
}

function PreviewCardPopup({
  className,
  children,
  align = "center",
  alignOffset = 0,
  hideArrow = false,
  side = "bottom",
  sideOffset = 8,
  anchor,
  ...props
}: PreviewCardPrimitive.Popup.Props & {
  align?: PreviewCardPrimitive.Positioner.Props["align"];
  alignOffset?: PreviewCardPrimitive.Positioner.Props["alignOffset"];
  side?: PreviewCardPrimitive.Positioner.Props["side"];
  sideOffset?: PreviewCardPrimitive.Positioner.Props["sideOffset"];
  anchor?: PreviewCardPrimitive.Positioner.Props["anchor"];
  hideArrow?: boolean;
}): React.JSX.Element {
  return (
    <PreviewCardPrimitive.Portal>
      <PreviewCardPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width)"
        data-slot="preview-card-positioner"
        side={side}
        sideOffset={sideOffset}
      >
        <PreviewCardPrimitive.Popup
          className={cn(
            "relative flex h-(--popup-height,auto) w-(--popup-width,auto) max-w-(--available-width) origin-(--transform-origin) rounded-lg border bg-popover not-dark:bg-clip-padding text-balance text-popover-foreground text-sm shadow-lg/5 transition-[width,height,scale,opacity] before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] data-ending-style:scale-98 data-starting-style:scale-98 data-ending-style:opacity-0 data-starting-style:opacity-0 dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
            className,
          )}
          data-slot="preview-card-popup"
          {...props}
        >
          {!hideArrow && <PreviewCardArrow />}
          <div
            className="relative flex min-w-64 max-w-full flex-col gap-4 p-4"
            data-slot="preview-card-panel"
          >
            {children}
          </div>
        </PreviewCardPrimitive.Popup>
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
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

export { PreviewCard, PreviewCardArrow, PreviewCardPopup, PreviewCardTrigger };
