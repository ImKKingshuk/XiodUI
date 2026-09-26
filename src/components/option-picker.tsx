"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { cn } from "cn";
import * as React from "react";
import { ChevronDown as ChevronDownIcon } from "xiod-icons/icons/ChevronDown";

import { Button } from "./button";
import { IconSlot } from "./icon-provider";

export interface Option {
  id: string;
  label: string;
  icon: React.ComponentType<React.ComponentProps<"svg">>;
}

export interface OptionPickerProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  options: Option[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  triggerClassName?: string;
  popupClassName?: string;
}

function OptionPicker({
  options,
  value,
  defaultValue,
  onChange,
  className,
  triggerClassName,
  popupClassName,
  icon,
  ...props
}: OptionPickerProps & {
  /** Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`. */
  icon?: React.ReactNode;
}): React.JSX.Element {
  const [open, setOpen] = React.useState(false);

  // Restrict to max 5 options
  const displayOptions = React.useMemo(() => {
    if (process.env.NODE_ENV !== "production" && options.length > 5) {
      console.warn(
        "OptionPicker: Only a maximum of 5 options are allowed. Excess options will be truncated.",
      );
    }
    return options.slice(0, 5);
  }, [options]);

  const [internalValue, setInternalValue] = React.useState(
    defaultValue ?? displayOptions[0]?.id,
  );

  const selectedId = value !== undefined ? value : internalValue;
  const selectedOption =
    displayOptions.find((opt) => opt.id === selectedId) ?? displayOptions[0];

  const handleSelect = (id: string) => {
    if (value === undefined) {
      setInternalValue(id);
    }
    onChange?.(id);
    setOpen(false);
  };

  return (
    <div
      className={cn(
        "relative inline-block [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      data-slot="option-picker"
      {...props}
    >
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger
          render={
            <Button
              variant="outline"
              className={cn(
                " select-none outline-none rounded-3xl",
                open && "bg-accent/80",
                triggerClassName,
              )}
            />
          }
          data-slot="option-picker-trigger"
        >
          {selectedOption && (
            <span className="flex items-center gap-2" key={selectedOption.id}>
              <selectedOption.icon className="size-4.5 sm:size-4 text-muted-foreground/80 dark:text-muted-foreground transition-colors duration-200" />
              <span className="text-sm font-semibold text-foreground/90 dark:text-foreground">
                {selectedOption.label}
              </span>
            </span>
          )}

          <IconSlot
            name="ChevronDown"
            icon={icon}
            fallback={ChevronDownIcon}
            className={cn(
              "size-4 sm:size-3.5 text-muted-foreground/80 dark:text-muted-foreground transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Positioner
            side="top"
            sideOffset={6}
            align="center"
            className="z-50 perspective-distant transform-3d"
            data-slot="option-picker-positioner"
          >
            <PopoverPrimitive.Popup
              className={cn(
                "relative flex min-w-max gap-1 rounded-full border border-border bg-popover p-[calc(--spacing(1)-1px)] whitespace-nowrap origin-bottom transform-3d transition-[opacity,transform,filter] duration-300 cubic-bezier(0.16, 1, 0.3, 1) opacity-100 scale-100 rotate-x-0 -translate-y-1 blur-none starting:opacity-0 starting:scale-105 starting:transform-[rotateX(-70deg)_translateY(10px)] starting:blur-sm shadow-lg/5 before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
                popupClassName,
              )}
              data-slot="option-picker-popup"
            >
              {displayOptions.map((option) => {
                const isActive = selectedOption.id === option.id;

                return (
                  <Button
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    variant={isActive ? "default" : "ghost"}
                    size="xs"
                    className="rounded-full select-none cursor-pointer px-2.5 gap-1.5 h-8"
                    title={`Set as ${option.label}`}
                    aria-label={`Select ${option.label}`}
                    data-slot="option-picker-item"
                  >
                    <option.icon className="size-4 sm:size-3.5" />
                    <span className="text-xs font-semibold">
                      {option.label}
                    </span>
                  </Button>
                );
              })}

              <PopoverPrimitive.Arrow className="z-10 flex data-[side=bottom]:top-[-9px] data-[side=bottom]:rotate-0 data-[side=left]:right-[-14px] data-[side=left]:rotate-90 data-[side=right]:left-[-14px] data-[side=right]:-rotate-90 data-[side=top]:bottom-[-9px] data-[side=top]:rotate-180">
                <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
                  <path
                    d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
                    className="fill-popover"
                  />
                  <path
                    d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
                    className="fill-border"
                  />
                </svg>
              </PopoverPrimitive.Arrow>
            </PopoverPrimitive.Popup>
          </PopoverPrimitive.Positioner>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  );
}

export { OptionPicker };
