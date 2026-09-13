"use client";

import { cn } from "cn";
import * as React from "react";
import { ChevronLeft as ChevronLeftIcon } from "xiod-icons/icons/ChevronLeft";
import { ChevronRight as ChevronRightIcon } from "xiod-icons/icons/ChevronRight";

/* --------------------------------- Types --------------------------------- */

export type CalendarMode = "single" | "range";

export interface DateRange {
  from?: Date;
  to?: Date;
}

export type Matcher =
  | boolean
  | Date
  | Date[]
  | ((date: Date) => boolean)
  | { before?: Date; after?: Date }
  | { after?: Date }
  | { before?: Date }
  | { dayOfWeek?: number | number[] };

export interface CalendarClassNames {
  root?: string;
  nav?: string;
  button_previous?: string;
  button_next?: string;
  caption_label?: string;
  grid?: string;
  weekday?: string;
  day?: string;
  day_selected?: string;
  day_today?: string;
  day_outside?: string;
  day_range_start?: string;
  day_range_end?: string;
  day_range_middle?: string;
  month_view_grid?: string;
  year_view_grid?: string;
  footer?: string;
  today_button?: string;
}

export interface CalendarProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onSelect" | "disabled"
> {
  mode?: CalendarMode;
  selected?: Date | DateRange | null;
  onSelect?: (date: Date | DateRange | undefined) => void;
  showOutsideDays?: boolean;
  disableOutsideDays?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabled?: Matcher | Matcher[];
  modifiers?: Record<string, Matcher | Matcher[]>;
  modifiersClassNames?: Record<string, string>;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  numberOfMonths?: number;
  fixedWeeks?: boolean;
  localeWeekdays?: string[];
  localeWeekdaysLong?: string[];
  localeMonths?: string[];
  localeMonthsShort?: string[];
  classNames?: CalendarClassNames;
}

/* ---------------------------- Helper Utilities ---------------------------- */

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

const sameDay = (a: Date | null | undefined, b: Date | null | undefined) =>
  !!a &&
  !!b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const addDays = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

const firstOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

function buildMonth(
  cursor: Date,
  weekStartsOn = 0,
  fixedWeeks = true,
): { date: Date; inMonth: boolean }[] {
  const first = firstOfMonth(cursor);
  const startWeekday = first.getDay();
  const offset = (startWeekday - weekStartsOn + 7) % 7;
  const start = addDays(first, -offset);
  const out: { date: Date; inMonth: boolean }[] = [];

  let totalDays = 42;
  if (!fixedWeeks) {
    const day35 = addDays(start, 35);
    if (day35.getMonth() !== cursor.getMonth()) {
      totalDays = 35;
    }
  }

  for (let i = 0; i < totalDays; i++) {
    const date = addDays(start, i);
    out.push({ date, inMonth: date.getMonth() === cursor.getMonth() });
  }
  return out;
}

function matchDate(
  date: Date,
  matcher: Matcher | Matcher[] | undefined,
): boolean {
  if (!matcher) return false;
  if (Array.isArray(matcher)) {
    return matcher.some((m) => matchDate(date, m));
  }
  if (typeof matcher === "boolean") {
    return matcher;
  }
  if (matcher instanceof Date) {
    return sameDay(date, matcher);
  }
  if (typeof matcher === "function") {
    return matcher(date);
  }
  if (typeof matcher === "object") {
    const start = startOfDay(date).getTime();
    if ("before" in matcher && matcher.before) {
      if (start < startOfDay(matcher.before).getTime()) return true;
    }
    if ("after" in matcher && matcher.after) {
      if (start > startOfDay(matcher.after).getTime()) return true;
    }
    if ("dayOfWeek" in matcher && matcher.dayOfWeek) {
      const dow = matcher.dayOfWeek;
      if (Array.isArray(dow)) {
        return dow.includes(date.getDay());
      }
      return dow === date.getDay();
    }
  }
  return false;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const WEEKDAYS_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
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

function getYearRangeStart(date: Date): number {
  const year = date.getFullYear();
  return year - (((year % 12) + 12) % 12);
}

/* ---------------------------- Main Component ---------------------------- */

function Calendar({
  className,
  mode = "single",
  selected,
  onSelect,
  showOutsideDays = true,
  disableOutsideDays = false,
  minDate,
  maxDate,
  disabled,
  modifiers,
  modifiersClassNames,
  weekStartsOn = 0,
  numberOfMonths = 1,
  fixedWeeks = true,
  localeWeekdays,
  localeWeekdaysLong,
  localeMonths,
  localeMonthsShort,
  classNames,
  ...props
}: CalendarProps): React.JSX.Element {
  const today = React.useMemo(() => new Date(), []);

  const weekdaysList = localeWeekdays || WEEKDAYS;
  const weekdaysLongList = localeWeekdaysLong || WEEKDAYS_LONG;
  const monthsList = localeMonths || MONTHS;
  const monthsShortList = localeMonthsShort || MONTHS_SHORT;

  // Determine initial cursor month based on selected date
  const initialCursor = React.useMemo(() => {
    if (selected instanceof Date) return firstOfMonth(selected);
    if (
      selected &&
      typeof selected === "object" &&
      "from" in selected &&
      selected.from
    ) {
      return firstOfMonth(selected.from);
    }
    return firstOfMonth(today);
  }, [selected, today]);

  const [cursor, setCursor] = React.useState<Date>(initialCursor);
  const [viewMode, setViewMode] = React.useState<"days" | "months" | "years">(
    "days",
  );

  // Sync cursor when selected date changes externally
  React.useEffect(() => {
    if (selected instanceof Date) {
      setCursor(firstOfMonth(selected));
    } else if (
      selected &&
      typeof selected === "object" &&
      "from" in selected &&
      selected.from
    ) {
      setCursor(firstOfMonth(selected.from));
    }
  }, [selected]);

  // Keyboard navigation focus day
  const [focusDate, setFocusDate] = React.useState<Date>(() => {
    if (selected instanceof Date) return selected;
    if (
      selected &&
      typeof selected === "object" &&
      "from" in selected &&
      selected.from
    ) {
      return selected.from;
    }
    return today;
  });

  const gridRef = React.useRef<HTMLDivElement>(null);

  // Helper to check if a date matches the disabled prop
  const isDateDisabled = React.useCallback(
    (date: Date) => {
      if (minDate && startOfDay(date).getTime() < startOfDay(minDate).getTime())
        return true;
      if (maxDate && startOfDay(date).getTime() > startOfDay(maxDate).getTime())
        return true;
      return matchDate(date, disabled);
    },
    [disabled, minDate, maxDate],
  );

  // Handle single and range selection clicks
  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    if (mode === "single") {
      onSelect?.(date);
    } else {
      const range = (selected as DateRange) || {};
      if (!range.from || (range.from && range.to)) {
        onSelect?.({ from: date, to: undefined });
      } else if (range.from && !range.to) {
        if (date.getTime() < range.from.getTime()) {
          onSelect?.({ from: date, to: undefined });
        } else {
          onSelect?.({ from: range.from, to: date });
        }
      }
    }
    setFocusDate(date);
    // If clicking a date from a different month, adjust cursor
    if (date.getMonth() !== cursor.getMonth()) {
      setCursor(firstOfMonth(date));
    }
  };

  // Determine if Prev navigation is disabled
  const isPrevNavigationDisabled = React.useMemo(() => {
    if (!minDate) return false;
    const minStart = startOfDay(minDate);
    if (viewMode === "days") {
      const currentMonthStart = firstOfMonth(cursor);
      return currentMonthStart.getTime() <= minStart.getTime();
    }
    if (viewMode === "months") {
      return cursor.getFullYear() <= minDate.getFullYear();
    }
    const yearRangeStart =
      cursor.getFullYear() - (((cursor.getFullYear() % 12) + 12) % 12);
    return yearRangeStart <= minDate.getFullYear();
  }, [cursor, minDate, viewMode]);

  // Determine if Next navigation is disabled
  const isNextNavigationDisabled = React.useMemo(() => {
    if (!maxDate) return false;
    const maxStart = startOfDay(maxDate);
    if (viewMode === "days") {
      const lastDisplayedMonth = new Date(
        cursor.getFullYear(),
        cursor.getMonth() + numberOfMonths - 1,
        1,
      );
      return lastDisplayedMonth.getTime() >= firstOfMonth(maxStart).getTime();
    }
    if (viewMode === "months") {
      return cursor.getFullYear() >= maxDate.getFullYear();
    }
    const yearRangeStart =
      cursor.getFullYear() - (((cursor.getFullYear() % 12) + 12) % 12);
    return yearRangeStart + 11 >= maxDate.getFullYear();
  }, [cursor, maxDate, viewMode, numberOfMonths]);

  const handlePrev = () => {
    if (isPrevNavigationDisabled) return;
    if (viewMode === "days") {
      setCursor(
        (c) => new Date(c.getFullYear(), c.getMonth() - numberOfMonths, 1),
      );
    } else if (viewMode === "months") {
      setCursor((c) => new Date(c.getFullYear() - 1, c.getMonth(), 1));
    } else {
      setCursor((c) => new Date(c.getFullYear() - 12, c.getMonth(), 1));
    }
  };

  const handleNext = () => {
    if (isNextNavigationDisabled) return;
    if (viewMode === "days") {
      setCursor(
        (c) => new Date(c.getFullYear(), c.getMonth() + numberOfMonths, 1),
      );
    } else if (viewMode === "months") {
      setCursor((c) => new Date(c.getFullYear() + 1, c.getMonth(), 1));
    } else {
      setCursor((c) => new Date(c.getFullYear() + 12, c.getMonth(), 1));
    }
  };

  // Zoom views: days -> months -> years
  const handleHeaderClick = () => {
    if (viewMode === "days") {
      setViewMode("months");
    } else if (viewMode === "months") {
      setViewMode("years");
    }
  };

  // Keyboard navigation
  const moveFocus = (days: number) => {
    setFocusDate((prev) => {
      const next = addDays(prev, days);
      if (isDateDisabled(next)) return prev;

      // Adjust cursor month if focus moves out of current page
      if (
        next.getMonth() !== prev.getMonth() ||
        next.getFullYear() !== prev.getFullYear()
      ) {
        setCursor(firstOfMonth(next));
      }
      return next;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (viewMode !== "days") return;

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        moveFocus(-1);
        break;
      case "ArrowRight":
        e.preventDefault();
        moveFocus(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        moveFocus(-7);
        break;
      case "ArrowDown":
        e.preventDefault();
        moveFocus(7);
        break;
      case "PageUp":
        e.preventDefault();
        handlePrev();
        break;
      case "PageDown":
        e.preventDefault();
        handleNext();
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        handleDateClick(focusDate);
        break;
      default:
        break;
    }
  };

  // Focus grid element when focus changes
  React.useEffect(() => {
    if (viewMode !== "days") return;
    if (Number.isNaN(focusDate.getTime())) return;
    const activeEl = gridRef.current?.querySelector<HTMLElement>(
      '[data-focused="true"]',
    );
    activeEl?.focus();
  }, [viewMode, focusDate]);

  const renderHeaderLabel = () => {
    if (viewMode === "days") {
      if (numberOfMonths === 1) {
        return `${monthsList[cursor.getMonth()]} ${cursor.getFullYear()}`;
      }
      const nextMonth = new Date(
        cursor.getFullYear(),
        cursor.getMonth() + numberOfMonths - 1,
        1,
      );
      return `${monthsList[cursor.getMonth()]} ${cursor.getFullYear()} - ${monthsList[nextMonth.getMonth()]} ${nextMonth.getFullYear()}`;
    }
    if (viewMode === "months") {
      return `${cursor.getFullYear()}`;
    }
    const start = getYearRangeStart(cursor);
    return `${start} – ${start + 11}`;
  };

  // Selection state checkers
  const getDaySelectionState = (date: Date) => {
    const isStart =
      mode === "range" &&
      selected &&
      typeof selected === "object" &&
      "from" in selected &&
      sameDay(date, selected.from);

    const isEnd =
      mode === "range" &&
      selected &&
      typeof selected === "object" &&
      "to" in selected &&
      sameDay(date, selected.to);

    const isMiddle =
      mode === "range" &&
      selected &&
      typeof selected === "object" &&
      "from" in selected &&
      "to" in selected &&
      selected.from &&
      selected.to &&
      date.getTime() > selected.from.getTime() &&
      date.getTime() < selected.to.getTime();

    const isSelectedSingle =
      mode === "single" && selected instanceof Date && sameDay(date, selected);

    return {
      isSelected: isStart || isEnd || isSelectedSingle,
      isStart,
      isEnd,
      isMiddle,
    };
  };

  // Get dynamic classes from custom modifiers
  const getModifierClassNames = (date: Date) => {
    if (!modifiers) return "";
    const activeModifiers: string[] = [];
    for (const [key, matcher] of Object.entries(modifiers)) {
      if (matchDate(date, matcher)) {
        activeModifiers.push(key);
      }
    }
    return activeModifiers
      .map((m) => modifiersClassNames?.[m])
      .filter(Boolean)
      .join(" ");
  };

  // Rotated weekday list for the headers
  const rotatedWeekdays = React.useMemo(() => {
    return [
      ...weekdaysList.slice(weekStartsOn),
      ...weekdaysList.slice(0, weekStartsOn),
    ];
  }, [weekdaysList, weekStartsOn]);

  return (
    <div
      data-slot="calendar"
      style={
        {
          "--number-of-months": numberOfMonths,
        } as React.CSSProperties
      }
      className={cn(
        "relative flex flex-col rounded-2xl border bg-card p-4 shadow-xs/5 select-none text-foreground before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] not-data-disabled:not-focus-visible:not-aria-invalid:not-data-pressed:before:shadow-[0_1px_--theme(--color-black/4%)] dark:not-data-disabled:not-focus-visible:not-aria-invalid:not-data-pressed:before:shadow-[0_-1px_--theme(--color-white/6%)] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg:not([class*='opacity-'])]:opacity-80",
        numberOfMonths === 1
          ? "w-72"
          : "w-full md:w-[calc(16rem*var(--number-of-months)+2rem)]",
        classNames?.root,
        className,
      )}
      {...props}
    >
      {/* Calendar Header Navigation */}
      <div
        className={cn(
          "flex items-center justify-between mb-4",
          classNames?.nav,
        )}
      >
        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={isPrevNavigationDisabled}
          className={cn(
            "relative inline-flex size-8 items-center justify-center rounded-lg border border-input bg-background/20 transition-colors hover:bg-accent hover:text-accent-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 disabled:pointer-events-none disabled:opacity-64",
            classNames?.button_previous,
          )}
          aria-label="Previous Page"
        >
          <ChevronLeftIcon className="size-4 shrink-0 pointer-events-none" />
        </button>

        {/* Dynamic Zoom Title */}
        <button
          type="button"
          onClick={handleHeaderClick}
          disabled={viewMode === "years"}
          className={cn(
            "rounded-md px-2.5 py-1 text-sm font-semibold tracking-tight transition-colors outline-none focus-visible:ring-1 focus-visible:ring-ring",
            viewMode !== "years" &&
              "hover:bg-accent hover:text-accent-foreground",
            classNames?.caption_label,
          )}
        >
          {renderHeaderLabel()}
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          disabled={isNextNavigationDisabled}
          className={cn(
            "relative inline-flex size-8 items-center justify-center rounded-lg border border-input bg-background/20 transition-colors hover:bg-accent hover:text-accent-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 disabled:pointer-events-none disabled:opacity-64",
            classNames?.button_next,
          )}
          aria-label="Next Page"
        >
          <ChevronRightIcon className="size-4 shrink-0 pointer-events-none" />
        </button>
      </div>

      {/* Grid Container */}
      <div
        ref={gridRef}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative overflow-hidden rounded-xl bg-muted/20 border border-border/30 p-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]",
          viewMode === "days" ? "h-fit" : "h-60",
          classNames?.grid,
        )}
      >
        {/* View Mode: Days */}
        {viewMode === "days" && (
          <div
            className={cn(
              "flex flex-col gap-6 md:flex-row",
              numberOfMonths > 1 && "divide-x divide-border/20 md:gap-0",
            )}
          >
            {Array.from({ length: numberOfMonths }).map((_, monthIdx) => {
              const currentMonthCursor = new Date(
                cursor.getFullYear(),
                cursor.getMonth() + monthIdx,
                1,
              );

              return (
                <div
                  key={currentMonthCursor.toISOString()}
                  className={cn(
                    "flex flex-col w-full md:w-64",
                    numberOfMonths > 1 && "px-4 first:ps-0 last:pe-0",
                  )}
                >
                  {numberOfMonths > 1 && (
                    <div className="text-center text-xs font-semibold mb-3 tracking-tight text-muted-foreground">
                      {monthsList[currentMonthCursor.getMonth()]}{" "}
                      {currentMonthCursor.getFullYear()}
                    </div>
                  )}

                  {/* Weekday Row */}
                  <div className="grid grid-cols-7 mb-1 text-center w-full">
                    {rotatedWeekdays.map((d) => (
                      <span
                        key={d}
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 h-6 flex items-center justify-center",
                          classNames?.weekday,
                        )}
                      >
                        {d}
                      </span>
                    ))}
                  </div>

                  {/* Day Cells Grid */}
                  <div className="grid grid-cols-7 grid-rows-6 gap-y-0.5 w-full">
                    {buildMonth(
                      currentMonthCursor,
                      weekStartsOn,
                      fixedWeeks,
                    ).map(({ date, inMonth }) => {
                      const { isSelected, isStart, isEnd, isMiddle } =
                        getDaySelectionState(date);
                      const isToday = sameDay(date, today);
                      const disabledState =
                        isDateDisabled(date) ||
                        (disableOutsideDays && !inMonth);
                      const showCell = inMonth || showOutsideDays;
                      const customClasses = getModifierClassNames(date);

                      if (!showCell) {
                        return (
                          <div
                            key={date.toISOString()}
                            className="h-8 w-8 sm:h-7.5 sm:w-7.5"
                          />
                        );
                      }

                      const isFocused = sameDay(date, focusDate);

                      return (
                        <button
                          key={date.toISOString()}
                          type="button"
                          tabIndex={isFocused ? 0 : -1}
                          data-focused={isFocused}
                          disabled={disabledState}
                          onClick={() => handleDateClick(date)}
                          className={cn(
                            "relative h-8 w-8 sm:h-7.5 sm:w-7.5 m-auto text-[12.5px] font-medium transition-[background-color,color,border-radius] duration-150 flex items-center justify-center outline-none focus-visible:z-10 focus-visible:ring-1 focus-visible:ring-ring pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11",
                            // Range middle styles
                            isMiddle &&
                              "bg-primary/12 text-primary rounded-none w-full h-8 sm:h-7.5 m-0",
                            isMiddle && classNames?.day_range_middle,
                            // Range start styles
                            isStart &&
                              "bg-primary text-primary-foreground font-semibold rounded-l-lg rounded-r-none w-full h-8 sm:h-7.5 m-0",
                            isStart && classNames?.day_range_start,
                            // Range end styles
                            isEnd &&
                              "bg-primary text-primary-foreground font-semibold rounded-r-lg rounded-l-none w-full h-8 sm:h-7.5 m-0",
                            isEnd && classNames?.day_range_end,
                            // Normal selected day styles
                            isSelected &&
                              !isStart &&
                              !isEnd &&
                              "bg-primary text-primary-foreground font-semibold rounded-lg",
                            isSelected && classNames?.day_selected,
                            // Hover states when not selected and not middle
                            !isSelected &&
                              !isMiddle &&
                              !disabledState &&
                              "hover:bg-accent hover:text-accent-foreground rounded-lg",
                            // Month active vs outside days
                            !isSelected &&
                              !isMiddle &&
                              (inMonth
                                ? "text-foreground"
                                : "text-muted-foreground/35"),
                            !inMonth && classNames?.day_outside,
                            // Today class override
                            isToday && classNames?.day_today,
                            // Disabled state
                            disabledState &&
                              "opacity-30 cursor-not-allowed line-through",
                            // Custom modifier classes
                            customClasses,
                            classNames?.day,
                          )}
                          aria-label={`${weekdaysLongList[date.getDay()]}, ${monthsList[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`}
                          aria-pressed={isSelected}
                        >
                          <span className="relative z-10">
                            {date.getDate()}
                          </span>
                          {/* Today indicator dot */}
                          {isToday && (
                            <span
                              className={cn(
                                "absolute bottom-1 size-1 rounded-full",
                                isSelected || isStart || isEnd
                                  ? "bg-primary-foreground"
                                  : "bg-primary",
                              )}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View Mode: Months */}
        {viewMode === "months" && (
          <div
            className={cn(
              "grid h-full grid-cols-3 grid-rows-4 gap-1.5 p-1 w-full max-w-64 mx-auto",
              classNames?.month_view_grid,
            )}
          >
            {monthsShortList.map((mName, mIdx) => {
              const isSelectedMonth =
                selected instanceof Date &&
                selected.getMonth() === mIdx &&
                selected.getFullYear() === cursor.getFullYear();

              return (
                <button
                  key={mName}
                  type="button"
                  onClick={() => {
                    setCursor(new Date(cursor.getFullYear(), mIdx, 1));
                    setViewMode("days");
                  }}
                  className={cn(
                    "rounded-lg text-xs font-semibold transition-colors hover:bg-accent hover:text-accent-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11",
                    isSelectedMonth
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground",
                  )}
                >
                  {mName}
                </button>
              );
            })}
          </div>
        )}

        {/* View Mode: Years */}
        {viewMode === "years" && (
          <div
            className={cn(
              "grid h-full grid-cols-3 grid-rows-4 gap-1.5 p-1 w-full max-w-64 mx-auto",
              classNames?.year_view_grid,
            )}
          >
            {Array.from(
              { length: 12 },
              (_, i) => getYearRangeStart(cursor) + i,
            ).map((yr) => {
              const isSelectedYear =
                selected instanceof Date && selected.getFullYear() === yr;

              return (
                <button
                  key={yr}
                  type="button"
                  onClick={() => {
                    setCursor(new Date(yr, cursor.getMonth(), 1));
                    setViewMode("months");
                  }}
                  className={cn(
                    "rounded-lg text-xs font-semibold transition-colors hover:bg-accent hover:text-accent-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11",
                    isSelectedYear
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground",
                  )}
                >
                  {yr}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer / Today Quick link */}
      <div
        className={cn(
          "flex items-center justify-between mt-3 px-1 pt-1 border-t border-border/20",
          classNames?.footer,
        )}
      >
        <button
          type="button"
          onClick={() => {
            setCursor(firstOfMonth(today));
            setFocusDate(today);
            handleDateClick(today);
            setViewMode("days");
          }}
          className={cn(
            "text-xs font-semibold text-primary transition-colors hover:text-primary/80 outline-none focus-visible:ring-1 focus-visible:ring-ring pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11",
            classNames?.today_button,
          )}
        >
          Today
        </button>

        {selected instanceof Date && (
          <span className="text-2xs tabular-nums text-muted-foreground/80 font-medium">
            {`${monthsShortList[selected.getMonth()]} ${selected.getDate()}, ${selected.getFullYear()}`}
          </span>
        )}

        {selected &&
          typeof selected === "object" &&
          "from" in selected &&
          selected.from && (
            <span className="text-2xs tabular-nums text-muted-foreground/80 font-medium">
              {`${monthsShortList[selected.from.getMonth()]} ${selected.from.getDate()}`}
              {selected.to
                ? ` - ${monthsShortList[selected.to.getMonth()]} ${selected.to.getDate()}`
                : " - ..."}
            </span>
          )}
      </div>
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
