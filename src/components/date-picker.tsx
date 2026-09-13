"use client";

import { cn } from "cn";
import * as React from "react";
import { Calendar as CalendarIcon } from "xiod-icons/icons/Calendar";

import { Button } from "./button";
import { Calendar, type DateRange } from "./calendar";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { Popover, PopoverPopup, PopoverTrigger } from "./popover";

/* ---------------------------- Type Definitions ---------------------------- */

export interface DatePickerProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onSelect" | "defaultValue"
> {
  mode?: "single" | "range";
  triggerType?: "button" | "input";
  defaultValue?: Date | DateRange;
  value?: Date | DateRange;
  onSelect?: (value: Date | DateRange | undefined) => void;
  placeholder?: string;
  formatStr?: "PPP" | "LLL dd, y" | "yyyy-MM-dd";
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean | Date | Date[] | ((date: Date) => boolean);
  numberOfMonths?: number;
  fixedWeeks?: boolean;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  showOutsideDays?: boolean;
  disableOutsideDays?: boolean;
  triggerClassName?: string;
  triggerVariant?: "default" | "outline" | "ghost" | "secondary";
  triggerSize?: "default" | "sm" | "lg" | "xs";
}

/* ---------------------------- Helper Utilities ---------------------------- */

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formatSingleDate = (
  d: Date,
  style: "PPP" | "LLL dd, y" | "yyyy-MM-dd" = "PPP",
) => {
  if (style === "yyyy-MM-dd") {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  const day = d.getDate();
  const month = MONTHS_SHORT[d.getMonth()];
  const year = d.getFullYear();
  if (style === "LLL dd, y") {
    return `${month} ${day}, ${year}`;
  }
  return `${MONTHS[d.getMonth()]} ${day}, ${year}`;
};

const parseDateString = (val: string): Date | null => {
  const parts = val.split("-");
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    if (
      !Number.isNaN(y) &&
      !Number.isNaN(m) &&
      !Number.isNaN(d) &&
      m >= 0 &&
      m < 12 &&
      d >= 1 &&
      d <= 31
    ) {
      const parsed = new Date(y, m, d);
      if (!Number.isNaN(parsed.getTime())) return parsed;
    }
  }
  return null;
};

function handleInputKeyDown(
  event: React.KeyboardEvent<HTMLInputElement>,
): void {
  if (event.key === "Enter") {
    event.currentTarget.blur();
  }
}

/* ---------------------------- Main Component ---------------------------- */

function DatePicker({
  className,
  mode = "single",
  triggerType = "button",
  defaultValue,
  value,
  onSelect,
  placeholder,
  formatStr = "PPP",
  minDate,
  maxDate,
  disabled,
  numberOfMonths = 1,
  fixedWeeks = true,
  weekStartsOn = 0,
  showOutsideDays = true,
  disableOutsideDays = false,
  triggerClassName,
  triggerVariant = "outline",
  triggerSize = "default",
  ...props
}: DatePickerProps): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const inputGroupRef = React.useRef<HTMLDivElement>(null);

  // Controlled vs Uncontrolled states
  const [uncontrolledVal, setUncontrolledVal] = React.useState<
    Date | DateRange | undefined
  >(defaultValue);
  const isControlled = value !== undefined;
  const activeValue = isControlled ? value : uncontrolledVal;

  // Sync typed text values in Input Mode
  const [inputValFrom, setInputValFrom] = React.useState("");
  const [inputValTo, setInputValTo] = React.useState("");

  // Update input text fields only when the new date value does not match the currently parsed input value
  React.useEffect(() => {
    if (mode === "single") {
      const parsed = parseDateString(inputValFrom);
      const activeTime =
        activeValue instanceof Date ? activeValue.getTime() : null;
      const parsedTime = parsed ? parsed.getTime() : null;

      if (activeTime !== parsedTime) {
        if (activeValue instanceof Date) {
          setInputValFrom(formatSingleDate(activeValue, "yyyy-MM-dd"));
        } else {
          setInputValFrom("");
        }
      }
    } else {
      const range = activeValue as DateRange;
      const parsedFrom = parseDateString(inputValFrom);
      const parsedTo = parseDateString(inputValTo);
      const activeFromTime = range?.from ? range.from.getTime() : null;
      const activeToTime = range?.to ? range.to.getTime() : null;
      const parsedFromTime = parsedFrom ? parsedFrom.getTime() : null;
      const parsedToTime = parsedTo ? parsedTo.getTime() : null;

      if (activeFromTime !== parsedFromTime) {
        if (range?.from) {
          setInputValFrom(formatSingleDate(range.from, "yyyy-MM-dd"));
        } else {
          setInputValFrom("");
        }
      }
      if (activeToTime !== parsedToTime) {
        if (range?.to) {
          setInputValTo(formatSingleDate(range.to, "yyyy-MM-dd"));
        } else {
          setInputValTo("");
        }
      }
    }
  }, [activeValue, mode, inputValFrom, inputValTo]);

  const handleSelect = (val: Date | DateRange | undefined) => {
    if (!isControlled) {
      setUncontrolledVal(val);
    }
    onSelect?.(val);

    // Auto-close Popover when a complete selection is made in Button Mode
    if (triggerType === "button") {
      if (mode === "single" && val) {
        setOpen(false);
      } else if (
        mode === "range" &&
        val &&
        typeof val === "object" &&
        "from" in val &&
        "to" in val &&
        val.from &&
        val.to
      ) {
        setOpen(false);
      }
    }
  };

  // Input typing handlers
  const handleInputChangeFrom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValFrom(val);
    const parsed = parseDateString(val);

    if (parsed) {
      if (mode === "single") {
        handleSelect(parsed);
      } else {
        const range = (activeValue as DateRange) || {};
        handleSelect({ from: parsed, to: range.to });
      }
    } else if (val === "") {
      if (mode === "single") {
        handleSelect(undefined);
      } else {
        const range = (activeValue as DateRange) || {};
        handleSelect({ from: undefined, to: range.to });
      }
    }
  };

  const handleInputChangeTo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValTo(val);
    const parsed = parseDateString(val);

    if (parsed) {
      const range = (activeValue as DateRange) || {};
      handleSelect({ from: range.from, to: parsed });
    } else if (val === "") {
      const range = (activeValue as DateRange) || {};
      handleSelect({ from: range.from, to: undefined });
    }
  };
  const handleInputBlurFrom = () => {
    const parsed = parseDateString(inputValFrom);
    if (parsed) {
      setInputValFrom(formatSingleDate(parsed, "yyyy-MM-dd"));
    } else {
      if (mode === "single") {
        if (activeValue instanceof Date) {
          setInputValFrom(formatSingleDate(activeValue, "yyyy-MM-dd"));
        } else {
          setInputValFrom("");
        }
      } else {
        const range = activeValue as DateRange;
        if (range?.from) {
          setInputValFrom(formatSingleDate(range.from, "yyyy-MM-dd"));
        } else {
          setInputValFrom("");
        }
      }
    }
  };

  const handleInputBlurTo = () => {
    const parsed = parseDateString(inputValTo);
    if (parsed) {
      setInputValTo(formatSingleDate(parsed, "yyyy-MM-dd"));
    } else {
      const range = activeValue as DateRange;
      if (range?.to) {
        setInputValTo(formatSingleDate(range.to, "yyyy-MM-dd"));
      } else {
        setInputValTo("");
      }
    }
  };
  // Helper to format visual display label for Button trigger
  const renderTriggerLabel = () => {
    if (mode === "single") {
      return activeValue instanceof Date
        ? formatSingleDate(activeValue, formatStr)
        : placeholder || "Pick a date";
    }

    const range = activeValue as DateRange;
    if (range?.from) {
      if (range.to) {
        return `${formatSingleDate(range.from, "LLL dd, y")} - ${formatSingleDate(range.to, "LLL dd, y")}`;
      }
      return `${formatSingleDate(range.from, "LLL dd, y")} - ...`;
    }
    return placeholder || "Pick a date range";
  };

  return (
    <div
      data-slot="date-picker"
      className={cn("relative w-full max-w-sm", className)}
      {...props}
    >
      <Popover open={open} onOpenChange={setOpen}>
        {triggerType === "button" ? (
          /* Dropdown Button Trigger Mode */
          <PopoverTrigger
            render={
              <Button
                variant={triggerVariant}
                size={triggerSize}
                className={cn(
                  "w-full justify-start text-left font-normal tabular-nums [&_svg]:text-muted-foreground/80 pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11",
                  !activeValue && "text-muted-foreground",
                  triggerClassName,
                )}
              />
            }
          >
            <CalendarIcon className="size-4 shrink-0 pointer-events-none mr-2" />
            {renderTriggerLabel()}
          </PopoverTrigger>
        ) : (
          /* Interactive Input Typing Trigger Mode */
          <InputGroup ref={inputGroupRef} className="w-full">
            {mode === "single" ? (
              <InputGroupInput
                type="date"
                placeholder={placeholder || "YYYY-MM-DD"}
                value={inputValFrom}
                onChange={handleInputChangeFrom}
                onKeyDown={handleInputKeyDown}
                onBlur={handleInputBlurFrom}
                onClick={(e) => e.stopPropagation()}
                data-slot="date-picker-input"
                className="font-medium tabular-nums *:[input]:[&::-webkit-calendar-picker-indicator]:hidden *:[input]:[&::-webkit-calendar-picker-indicator]:appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            ) : (
              <div className="flex items-center gap-1.5 flex-1 px-3 py-1">
                <input
                  type="date"
                  placeholder="Start (YYYY-MM-DD)"
                  value={inputValFrom}
                  onChange={handleInputChangeFrom}
                  onKeyDown={handleInputKeyDown}
                  onBlur={handleInputBlurFrom}
                  onClick={(e) => e.stopPropagation()}
                  data-slot="date-picker-input-from"
                  className="bg-transparent border-none outline-none font-medium text-sm w-full tabular-nums text-foreground placeholder:text-muted-foreground/50 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
                <span className="text-muted-foreground/50 text-[10px] uppercase font-bold select-none shrink-0">
                  to
                </span>
                <input
                  type="date"
                  placeholder="End (YYYY-MM-DD)"
                  value={inputValTo}
                  onChange={handleInputChangeTo}
                  onKeyDown={handleInputKeyDown}
                  onBlur={handleInputBlurTo}
                  onClick={(e) => e.stopPropagation()}
                  data-slot="date-picker-input-to"
                  className="bg-transparent border-none outline-none font-medium text-sm w-full tabular-nums text-foreground placeholder:text-muted-foreground/50 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </div>
            )}
            <InputGroupAddon>
              <PopoverTrigger
                render={
                  <Button
                    size="icon-xs"
                    variant="ghost"
                    className="pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11"
                    aria-label="Open Calendar popup"
                  />
                }
              >
                <CalendarIcon className="size-4 shrink-0 pointer-events-none" />
              </PopoverTrigger>
            </InputGroupAddon>
          </InputGroup>
        )}

        <PopoverPopup
          align="start"
          alignOffset={triggerType === "input" ? -1 : 0}
          sideOffset={8}
          anchor={triggerType === "input" ? inputGroupRef : undefined}
        >
          <Calendar
            mode={mode}
            selected={activeValue}
            onSelect={handleSelect}
            minDate={minDate}
            maxDate={maxDate}
            disabled={disabled}
            numberOfMonths={numberOfMonths}
            fixedWeeks={fixedWeeks}
            weekStartsOn={weekStartsOn}
            showOutsideDays={showOutsideDays}
            disableOutsideDays={disableOutsideDays}
            className="border-none bg-transparent shadow-none p-0 before:shadow-none!"
          />
        </PopoverPopup>
      </Popover>
    </div>
  );
}

DatePicker.displayName = "DatePicker";

export { DatePicker };
