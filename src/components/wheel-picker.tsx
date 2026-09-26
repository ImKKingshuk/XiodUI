"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Resistance when scrolling past bounds in non-infinite mode
const RESISTANCE = 0.3;
const MAX_VELOCITY = 30;

const easeOutCubic = (p: number) => (p - 1) ** 3 + 1;

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

// Context for multi-column picker groups (e.g., date/time pickers)
interface WheelPickerGroupContextValue {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  register: (existingIndex: number | null, ref: HTMLDivElement) => number;
  getPickerRef: (index: number) => HTMLDivElement | null;
  getPickerIndices: () => number[];
}

const WheelPickerGroupContext =
  React.createContext<WheelPickerGroupContextValue | null>(null);

export function useWheelPickerGroup(): WheelPickerGroupContextValue | null {
  return React.useContext(WheelPickerGroupContext);
}

export interface WheelPickerGroupProps extends useRender.ComponentProps<"div"> {
  children?: React.ReactNode;
}

export function WheelPickerGroup({
  className,
  children,
  render,
  ...props
}: WheelPickerGroupProps): React.JSX.Element {
  const [activeIndex, setActiveIndex] = useState(-1);
  const counterRef = useRef(0);
  const pickerRefsRef = useRef(new Map<number, HTMLDivElement>());

  const register = useCallback(
    (existingIndex: number | null, ref: HTMLDivElement) => {
      const index =
        existingIndex !== null ? existingIndex : counterRef.current++;
      pickerRefsRef.current.set(index, ref);
      setActiveIndex((current) => (current === -1 ? index : current));
      return index;
    },
    [],
  );

  const getPickerRef = useCallback(
    (index: number) => pickerRefsRef.current.get(index) ?? null,
    [],
  );

  const getPickerIndices = useCallback(
    () => Array.from(pickerRefsRef.current.keys()).toSorted((a, b) => a - b),
    [],
  );

  const value = useMemo<WheelPickerGroupContextValue>(
    () => ({
      activeIndex,
      setActiveIndex,
      register,
      getPickerRef,
      getPickerIndices,
    }),
    [activeIndex, register, getPickerRef, getPickerIndices],
  );

  const defaultProps = {
    className: cn(
      "relative flex items-stretch justify-center border border-border/80 bg-background/50 rounded-2xl p-[calc(--spacing(2)-1px)] select-none shadow-xs/5 max-w-full overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
      className,
    ),
    "data-slot": "wheel-picker-group",
    children,
  };

  const element = useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });

  return (
    <WheelPickerGroupContext.Provider value={value}>
      {element}
    </WheelPickerGroupContext.Provider>
  );
}

// Type-ahead quick search hook
const TYPEAHEAD_TIMEOUT_MS = 600;

function useTypeaheadSearch<T>(
  options: T[],
  {
    getTextValue,
    getCurrentIndex,
    onMatch,
  }: {
    getTextValue: (option: T) => string;
    getCurrentIndex: () => number;
    onMatch: (index: number) => void;
  },
) {
  const searchBufferRef = useRef("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTypeahead = useCallback(() => {
    searchBufferRef.current = "";
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleTypeaheadSearch = useCallback(
    (char: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      searchBufferRef.current += char.toLowerCase();
      const searchTerm = searchBufferRef.current;
      const isRepeated =
        searchTerm.length > 1 &&
        Array.from(searchTerm).every((c) => c === searchTerm[0]);

      const normalizedSearch = isRepeated ? searchTerm[0] : searchTerm;
      const currentIndex = getCurrentIndex();
      const shouldCycle = normalizedSearch.length === 1;

      let matchIndex = -1;

      if (shouldCycle) {
        // Cycle matching items starting from current index
        for (let i = 1; i <= options.length; i++) {
          const index = (currentIndex + i) % options.length;
          const text = getTextValue(options[index]);
          if (text.toLowerCase().startsWith(normalizedSearch)) {
            matchIndex = index;
            break;
          }
        }
      } else {
        // Find first exact match starting from beginning
        matchIndex = options.findIndex((option) => {
          const text = getTextValue(option);
          return text.toLowerCase().startsWith(normalizedSearch);
        });
      }

      if (matchIndex !== -1) {
        onMatch(matchIndex);
      }

      timeoutRef.current = setTimeout(() => {
        searchBufferRef.current = "";
        timeoutRef.current = null;
      }, TYPEAHEAD_TIMEOUT_MS);
    },
    [options, getTextValue, getCurrentIndex, onMatch],
  );

  return {
    handleTypeaheadSearch,
    resetTypeahead,
  };
}

function useCallbackRef<T extends (...args: never[]) => unknown>(
  callback: T | undefined,
): T {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  });
  return useMemo(
    () =>
      ((...args: never[]) => callbackRef.current?.(...args)) as unknown as T,
    [],
  );
}

// Controlled or uncontrolled state, resolved from whichever the caller gave.
function useControllableState<T>({
  prop,
  defaultProp,
  onChange = () => {},
}: {
  prop?: T;
  defaultProp?: T;
  onChange?: (state: T) => void;
}) {
  const [uncontrolledProp, setUncontrolledProp] = useState<T | undefined>(
    defaultProp,
  );
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolledProp;
  const handleChange = useCallbackRef(onChange);

  const setValue = useCallback(
    (nextValue: React.SetStateAction<T | undefined>) => {
      if (isControlled) {
        const setter = nextValue as (prevState?: T) => T;
        const val = typeof nextValue === "function" ? setter(prop) : nextValue;
        if (val !== prop && val !== undefined) handleChange(val);
      } else {
        setUncontrolledProp(nextValue);
      }
    },
    [isControlled, prop, handleChange],
  );

  return [value, setValue] as const;
}

export type WheelPickerValue = string | number;

export interface WheelPickerOption<
  T extends WheelPickerValue = WheelPickerValue,
> {
  value: T;
  label: React.ReactNode;
  textValue?: string;
  disabled?: boolean;
}

export interface WheelPickerClassNames {
  optionItem?: string;
  highlightWrapper?: string;
  highlightItem?: string;
}

export const wheelPickerVariants = cva(
  "relative flex-1 cursor-default select-none focus:outline-none focus-visible:outline-none min-w-[70px]",
  {
    variants: {
      size: {
        sm: "h-[180px] rounded-lg",
        md: "h-[220px] rounded-xl",
        lg: "h-[260px] rounded-2xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface WheelPickerProps<T extends WheelPickerValue = WheelPickerValue>
  extends
    Omit<
      useRender.ComponentProps<"div">,
      "value" | "defaultValue" | "onChange"
    >,
    VariantProps<typeof wheelPickerVariants> {
  options: WheelPickerOption<T>[];
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  infinite?: boolean;
  visibleCount?: number; // Must be multiple of 4
  dragSensitivity?: number;
  scrollSensitivity?: number;
  optionItemHeight?: number;
  classNames?: WheelPickerClassNames;
}

function findNearestEnabledIndex<T extends WheelPickerValue>(
  startIndex: number,
  direction: 1 | -1,
  options: WheelPickerOption<T>[],
  infinite: boolean,
): number {
  if (options.length === 0) return startIndex;
  const hasEnabledItem = options.some((opt) => !opt.disabled);
  if (!hasEnabledItem) return startIndex;

  const searchInDirection = (dir: 1 | -1): number => {
    let currentIndex = startIndex;
    let attempts = 0;
    const maxAttempts = options.length;

    while (attempts < maxAttempts) {
      currentIndex = currentIndex + dir;
      if (infinite) {
        currentIndex =
          ((currentIndex % options.length) + options.length) % options.length;
      } else {
        if (currentIndex < 0 || currentIndex >= options.length) {
          return -1;
        }
      }
      if (!options[currentIndex]?.disabled) {
        return currentIndex;
      }
      attempts++;
    }
    return -1;
  };

  let nearestIndex = searchInDirection(direction);
  if (nearestIndex === -1) {
    nearestIndex = searchInDirection((direction * -1) as 1 | -1);
  }
  return nearestIndex === -1 ? startIndex : nearestIndex;
}

export function WheelPicker<T extends WheelPickerValue = WheelPickerValue>({
  className,
  options: optionsProp,
  value: valueProp,
  defaultValue,
  onValueChange,
  infinite = false,
  visibleCount = 20,
  dragSensitivity = 3,
  scrollSensitivity = 5,
  optionItemHeight,
  classNames,
  size = "md",
  render,
  ...props
}: WheelPickerProps<T>): React.JSX.Element {
  // Option height computed dynamically from size variant if not overridden
  const itemHeight =
    optionItemHeight ?? (size === "sm" ? 28 : size === "lg" ? 44 : 36);

  const firstEnabledValue = useMemo(() => {
    const firstEnabled = optionsProp.find((opt) => !opt.disabled);
    return firstEnabled?.value ?? optionsProp[0]?.value;
  }, [optionsProp]);

  const [value = firstEnabledValue, setValue] = useControllableState<T>({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  // Infinite list expansion: repeat options so cylinder stays continuous and wrapping is 100% seamless
  const options = useMemo(() => {
    if (!infinite || optionsProp.length === 0) return optionsProp;
    const result: WheelPickerOption<T>[] = [];
    const L = optionsProp.length;

    // Calculate Least Common Multiple (LCM) of L and visibleCount
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const lcm = (L * visibleCount) / gcd(L, visibleCount);

    // We want the total length N = k * L to be a multiple of visibleCount, and at least visibleCount * 1.5
    let targetLength = lcm;
    const minLength = Math.ceil(visibleCount * 1.5);
    if (targetLength < minLength) {
      targetLength = Math.ceil(minLength / lcm) * lcm;
    }

    const k = targetLength / L;
    for (let i = 0; i < k; i++) {
      result.push(...optionsProp);
    }
    return result;
  }, [optionsProp, infinite, visibleCount]);

  const halfItemHeight = itemHeight * 0.5;
  const itemAngle = 360 / visibleCount;
  const radius = itemHeight / Math.tan((itemAngle * Math.PI) / 180);
  const containerHeight = Math.round(radius * 2 + itemHeight * 0.25);
  const quarterCount = visibleCount >> 2; // Math.floor(visibleCount / 4)
  const baseDeceleration = dragSensitivity * 12;
  const snapBackDeceleration = 10;

  const containerRef = useRef<HTMLDivElement>(null);
  const wheelItemsRef = useRef<HTMLUListElement>(null);
  const highlightListRef = useRef<HTMLUListElement>(null);

  const scrollRef = useRef(0);
  const moveId = useRef(0);
  const draggingRef = useRef(false);
  const _lastWheelTimeRef = useRef(0);
  const wheelSnapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const [isFocused, setIsFocused] = useState(false);
  const pickerIndexRef = useRef(-1);
  const group = useWheelPickerGroup();

  // Register picker in parent group context
  const containerRefCallback = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (node && group) {
        const existingIndex =
          pickerIndexRef.current === -1 ? null : pickerIndexRef.current;
        pickerIndexRef.current = group.register(existingIndex, node);
      }
    },
    [group],
  );

  const touchDataRef = useRef<{
    startY: number;
    yList: [number, number][];
    touchScroll?: number;
    isClick?: boolean;
  }>({
    startY: 0,
    yList: [],
    touchScroll: 0,
    isClick: true,
  });

  const dragControllerRef = useRef<AbortController | null>(null);

  // 3D Rotated options
  const renderWheelItems = useMemo(() => {
    const renderItem = (
      item: WheelPickerOption<T>,
      index: number,
      angle: number,
    ) => (
      <li
        key={index}
        className={cn(
          "absolute left-0 w-full flex items-center justify-center text-muted-foreground/70 dark:text-muted-foreground/60 transition-[color] duration-150 text-sm font-medium tabular-nums select-none",
          item.disabled && "opacity-30 pointer-events-none",
          classNames?.optionItem,
        )}
        data-slot="wheel-picker-option"
        data-index={index}
        data-disabled={item.disabled || undefined}
        style={{
          top: -halfItemHeight,
          height: itemHeight,
          lineHeight: `${itemHeight}px`,
          transform: `rotateX(${angle}deg) translateZ(${radius}px)`,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          visibility: "hidden",
        }}
      >
        {item.label}
      </li>
    );

    const items = options.map((option, index) =>
      renderItem(option, index, -itemAngle * index),
    );

    if (infinite) {
      for (let i = 0; i < quarterCount; ++i) {
        const prependIndex = -i - 1;
        const appendIndex = i + options.length;

        items.unshift(
          renderItem(
            options[options.length - i - 1],
            prependIndex,
            itemAngle * (i + 1),
          ),
        );
        items.push(
          renderItem(options[i], appendIndex, -itemAngle * appendIndex),
        );
      }
    }

    return items;
  }, [
    itemHeight,
    halfItemHeight,
    infinite,
    itemAngle,
    options,
    quarterCount,
    radius,
    classNames?.optionItem,
  ]);

  // High contrast center overlay items
  const renderHighlightItems = useMemo(() => {
    const renderItem = (item: WheelPickerOption<T>, key: React.Key) => (
      <li
        key={key}
        className={cn(
          "w-full flex items-center justify-center text-foreground font-semibold tabular-nums select-none transition-colors duration-150",
          size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base",
          item.disabled && "opacity-30 pointer-events-none",
          classNames?.highlightItem,
        )}
        data-slot="wheel-picker-highlight-item"
        data-disabled={item.disabled || undefined}
        style={{ height: itemHeight }}
      >
        {item.label}
      </li>
    );

    const items = options.map((option, index) => renderItem(option, index));

    if (infinite && options.length > 0) {
      const firstItem = options[0];
      const lastItem = options[options.length - 1];
      items.unshift(renderItem(lastItem, "infinite-start"));
      items.push(renderItem(firstItem, "infinite-end"));
    }

    return items;
  }, [classNames?.highlightItem, itemHeight, infinite, options, size]);

  const wheelSegmentPositions = useMemo(() => {
    let positionAlongWheel = 0;
    const degToRad = Math.PI / 180;
    const segmentRanges: [number, number][] = [];

    for (let i = quarterCount - 1; i >= -quarterCount + 1; --i) {
      const angle = i * itemAngle;
      const segmentLength = itemHeight * Math.cos(angle * degToRad);
      const start = positionAlongWheel;
      positionAlongWheel += segmentLength;
      segmentRanges.push([start, positionAlongWheel]);
    }
    return segmentRanges;
  }, [itemAngle, itemHeight, quarterCount]);

  const normalizeScroll = useCallback(
    (scroll: number) => {
      if (options.length === 0) return 0;
      return ((scroll % options.length) + options.length) % options.length;
    },
    [options.length],
  );

  const scrollTo = useCallback(
    (scroll: number) => {
      const normalizedScroll = infinite ? normalizeScroll(scroll) : scroll;

      if (wheelItemsRef.current) {
        const transform = `translateZ(${-radius}px) rotateX(${itemAngle * normalizedScroll}deg)`;
        wheelItemsRef.current.style.transform = transform;

        const children = wheelItemsRef.current.childNodes;
        for (let i = 0; i < children.length; i++) {
          const li = children[i] as HTMLLIElement;
          const distance = Math.abs(
            Number(li.dataset.index) - normalizedScroll,
          );
          li.style.visibility = distance > quarterCount ? "hidden" : "visible";

          const baseOpacity = li.dataset.disabled ? 0.3 : 1;
          const opacity =
            distance < 0.5 ? (distance / 0.5) * baseOpacity : baseOpacity;
          li.style.opacity = opacity.toString();
        }
      }

      if (highlightListRef.current) {
        highlightListRef.current.style.transform = `translateY(${-normalizedScroll * itemHeight}px)`;
      }

      return normalizedScroll;
    },
    [radius, itemAngle, quarterCount, itemHeight, infinite, normalizeScroll],
  );

  const cancelAnimation = useCallback(() => {
    cancelAnimationFrame(moveId.current);
  }, []);

  const animateScroll = useCallback(
    (
      startScroll: number,
      endScroll: number,
      duration: number,
      onComplete?: () => void,
    ) => {
      if (
        startScroll === endScroll ||
        duration === 0 ||
        // Reduced motion: land on the value without the spin.
        (typeof window !== "undefined" &&
          window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
      ) {
        cancelAnimation();
        scrollRef.current = scrollTo(endScroll);
        onComplete?.();
        return;
      }

      const startTime = performance.now();
      const totalDistance = endScroll - startScroll;

      const tick = (currentTime: number) => {
        const elapsed = (currentTime - startTime) / 1000;
        if (elapsed < duration) {
          const progress = easeOutCubic(elapsed / duration);
          scrollRef.current = scrollTo(startScroll + progress * totalDistance);
          moveId.current = requestAnimationFrame(tick);
        } else {
          cancelAnimation();
          scrollRef.current = scrollTo(endScroll);
          onComplete?.();
        }
      };

      cancelAnimation();
      moveId.current = requestAnimationFrame(tick);
    },
    [scrollTo, cancelAnimation],
  );

  const scrollDirectionRef = useRef<1 | -1>(1);

  const selectByScroll = useCallbackRef(
    (scroll: number, scrollDirection?: 1 | -1) => {
      if (options.length === 0) return;
      const normalized = Math.round(normalizeScroll(scroll));
      const boundedScroll = infinite
        ? normalized
        : clamp(Math.round(scroll), 0, options.length - 1);

      if (!infinite && boundedScroll !== scroll) return;

      if (options[boundedScroll]?.disabled) {
        const direction = scrollDirection ?? scrollDirectionRef.current;
        const nearestEnabled = findNearestEnabledIndex(
          boundedScroll,
          direction,
          options,
          infinite,
        );
        const step = nearestEnabled - scrollRef.current;
        if (step !== 0) {
          scrollByStep(step);
          return;
        }
      }

      scrollRef.current = scrollTo(boundedScroll);
      const selected = options[scrollRef.current];
      if (selected && !selected.disabled) {
        setValue(selected.value);
      }
    },
  );

  const selectByValue = useCallbackRef((val: T) => {
    if (options.length === 0 || draggingRef.current) return;

    const currentIndex = Math.round(scrollRef.current);

    // Find the duplicate option that is closest to the current scroll position to keep motion continuous
    let index = -1;
    let minDistance = Number.MAX_VALUE;

    for (let i = 0; i < options.length; i++) {
      if (options[i].value === val) {
        const distance = Math.abs(i - currentIndex);
        if (distance < minDistance) {
          minDistance = distance;
          index = i;
        }
      }
    }

    if (index === -1) return;
    if (options[index]?.disabled) {
      index = findNearestEnabledIndex(index, 1, options, infinite);
    }
    cancelAnimation();
    selectByScroll(index);
  });

  const scrollByStep = useCallbackRef((step: number) => {
    if (options.length === 0) return;
    const startScroll = scrollRef.current;
    let endScroll = startScroll + step;

    if (infinite) {
      endScroll = Math.round(endScroll);
    } else {
      endScroll = clamp(Math.round(endScroll), 0, options.length - 1);
    }

    const distance = Math.abs(endScroll - startScroll);
    if (distance === 0) return;

    const direction = step > 0 ? 1 : -1;
    scrollDirectionRef.current = direction;

    const duration = Math.sqrt(distance / scrollSensitivity);
    cancelAnimation();
    animateScroll(startScroll, endScroll, duration, () => {
      selectByScroll(scrollRef.current, direction);
    });
  });

  const handleWheelItemClick = useCallback(
    (clientY: number) => {
      const container = containerRef.current;
      if (!container) return;

      const { top } = container.getBoundingClientRect();
      const clickOffsetY = clientY - top;

      const clickedSegmentIndex = wheelSegmentPositions.findIndex(
        ([start, end]) => clickOffsetY >= start && clickOffsetY <= end,
      );

      if (clickedSegmentIndex === -1) return;

      const stepsToScroll = (quarterCount - clickedSegmentIndex - 1) * -1;
      const targetIndex = scrollRef.current + stepsToScroll;
      const normalizedIndex = infinite
        ? normalizeScroll(targetIndex)
        : Math.max(0, Math.min(targetIndex, options.length - 1));

      if (options[normalizedIndex]?.disabled) return;

      scrollByStep(stepsToScroll);
    },
    [
      wheelSegmentPositions,
      quarterCount,
      infinite,
      normalizeScroll,
      options,
      scrollByStep,
    ],
  );

  const updateScrollDuringDrag = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (options.length === 0) return;
      const currentY =
        (e instanceof MouseEvent ? e.clientY : e.touches?.[0]?.clientY) || 0;
      const touchData = touchDataRef.current;

      if (touchData.isClick) {
        if (Math.abs(currentY - touchData.startY) > 5) {
          touchData.isClick = false;
        }
      }

      touchData.yList.push([currentY, Date.now()]);
      if (touchData.yList.length > 5) touchData.yList.shift();

      const dragDelta = (touchData.startY - currentY) / itemHeight;
      let nextScroll = scrollRef.current + dragDelta;

      if (infinite) {
        nextScroll = normalizeScroll(nextScroll);
      } else {
        const maxIndex = options.length - 1;
        if (nextScroll < 0) {
          nextScroll *= RESISTANCE;
        } else if (nextScroll > maxIndex) {
          nextScroll = maxIndex + (nextScroll - maxIndex) * RESISTANCE;
        }
      }

      touchData.touchScroll = scrollTo(nextScroll);
    },
    [options.length, itemHeight, infinite, normalizeScroll, scrollTo],
  );

  const decelerateAndAnimateScroll = useCallback(
    (initialVelocity: number) => {
      const currentScroll = scrollRef.current;
      let targetScroll = currentScroll;
      let duration = 0;

      const direction = initialVelocity > 0 ? 1 : -1;
      scrollDirectionRef.current = direction;

      if (infinite) {
        const travelDistance =
          (initialVelocity * initialVelocity) / (2 * baseDeceleration);
        const signedDistance = travelDistance * direction;
        targetScroll = Math.round(currentScroll + signedDistance);

        const inertiaDuration = Math.abs(initialVelocity / baseDeceleration);
        const distanceToTarget = Math.abs(targetScroll - currentScroll);
        const snapDuration = Math.sqrt(distanceToTarget / snapBackDeceleration);

        duration = Math.max(inertiaDuration, snapDuration);
      } else {
        const travelDistance =
          (initialVelocity * initialVelocity) / (2 * baseDeceleration);
        const signedDistance = travelDistance * direction;
        const predictedTarget = currentScroll + signedDistance;

        if (predictedTarget < 0) {
          targetScroll = 0;
          const distance = Math.abs(currentScroll - targetScroll);
          duration = Math.sqrt(distance / snapBackDeceleration);
        } else if (predictedTarget > options.length - 1) {
          targetScroll = options.length - 1;
          const distance = Math.abs(currentScroll - targetScroll);
          duration = Math.sqrt(distance / snapBackDeceleration);
        } else {
          targetScroll = Math.round(predictedTarget);
          const inertiaDuration = Math.abs(initialVelocity / baseDeceleration);
          const distanceToTarget = Math.abs(targetScroll - currentScroll);
          const snapDuration = Math.sqrt(
            distanceToTarget / snapBackDeceleration,
          );
          duration = Math.max(inertiaDuration, snapDuration);
        }
      }

      // Enforce a minimum duration for visual snap feedback
      // and clamp max duration so it doesn't spin forever
      if (targetScroll !== currentScroll) {
        duration = clamp(duration, 0.15, 0.8);
      } else {
        duration = 0;
      }

      animateScroll(currentScroll, targetScroll, duration, () => {
        selectByScroll(scrollRef.current, direction);
      });
    },
    [baseDeceleration, infinite, options.length, animateScroll, selectByScroll],
  );

  const finalizeDragAndStartInertiaScroll = useCallback(() => {
    try {
      dragControllerRef.current?.abort();
      dragControllerRef.current = null;

      const touchData = touchDataRef.current;
      if (touchData.isClick) {
        handleWheelItemClick(touchData.startY);
        return;
      }

      const yList = touchData.yList;
      let velocity = 0;

      if (yList.length > 1) {
        const len = yList.length;
        const [startY, startTime] = yList[len - 2] ?? [0, 0];
        const [endY, endTime] = yList[len - 1] ?? [0, 0];
        const timeDiff = endTime - startTime;

        if (timeDiff > 0) {
          const distance = startY - endY;
          const velocityPerSecond = ((distance / itemHeight) * 1000) / timeDiff;
          const direction = velocityPerSecond > 0 ? 1 : -1;
          const absVelocity = Math.min(
            Math.abs(velocityPerSecond),
            MAX_VELOCITY,
          );
          velocity = absVelocity * direction;
        }
      }

      scrollRef.current = touchData.touchScroll ?? scrollRef.current;
      decelerateAndAnimateScroll(velocity);
    } finally {
      draggingRef.current = false;
    }
  }, [handleWheelItemClick, itemHeight, decelerateAndAnimateScroll]);

  const handleDragMoveEvent = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (event.cancelable) event.preventDefault();
      updateScrollDuringDrag(event);
    },
    [updateScrollDuringDrag],
  );

  const handleDragEndEvent = useCallback(
    (event: Event) => {
      if (options.length === 0) return;
      if (event.cancelable) event.preventDefault();
      finalizeDragAndStartInertiaScroll();
    },
    [options.length, finalizeDragAndStartInertiaScroll],
  );

  // A drag the browser cut short (touchcancel, the window losing focus) is
  // not a tap: settle on the nearest option instead of selecting the one
  // under the finger.
  const cancelDragGesture = useCallback(() => {
    touchDataRef.current.isClick = false;
    finalizeDragAndStartInertiaScroll();
  }, [finalizeDragAndStartInertiaScroll]);

  const initiateDragGesture = useCallback(
    (event: MouseEvent | TouchEvent) => {
      draggingRef.current = true;
      const controller = new AbortController();
      const { signal } = controller;
      dragControllerRef.current = controller;

      const opts = { signal, passive: false };
      containerRef.current?.addEventListener(
        "touchmove",
        handleDragMoveEvent,
        opts,
      );
      containerRef.current?.addEventListener(
        "touchend",
        handleDragEndEvent,
        opts,
      );
      containerRef.current?.addEventListener(
        "touchcancel",
        cancelDragGesture,
        opts,
      );
      document.addEventListener("mousemove", handleDragMoveEvent, opts);
      document.addEventListener("mouseup", handleDragEndEvent, opts);
      window.addEventListener("blur", cancelDragGesture, { signal });

      const startY =
        (event instanceof MouseEvent
          ? event.clientY
          : event.touches?.[0]?.clientY) || 0;
      const touchData = touchDataRef.current;
      touchData.startY = startY;
      touchData.yList = [[startY, Date.now()]];
      touchData.touchScroll = scrollRef.current;
      touchData.isClick = true;

      cancelAnimation();
    },
    [
      handleDragMoveEvent,
      handleDragEndEvent,
      cancelDragGesture,
      cancelAnimation,
    ],
  );

  const handleDragStartEvent = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (options.length === 0) return;
      if (e instanceof MouseEvent && e.button !== 0) return;

      if (e.cancelable) {
        e.preventDefault();
      }
      initiateDragGesture(e);
    },
    [options.length, initiateDragGesture],
  );

  const scrollByWheel = useCallback(
    (event: WheelEvent) => {
      event.preventDefault();
      cancelAnimation();
      if (wheelSnapTimeoutRef.current) {
        clearTimeout(wheelSnapTimeoutRef.current);
      }

      // Continuous Y-axis scrolling accumulation
      const delta = event.deltaY * 0.003 * scrollSensitivity;
      let nextScroll = scrollRef.current + delta;

      if (infinite) {
        nextScroll = normalizeScroll(nextScroll);
      } else {
        nextScroll = clamp(nextScroll, 0, options.length - 1);
      }

      scrollTo(nextScroll);
      scrollRef.current = nextScroll;

      const direction = event.deltaY > 0 ? 1 : -1;
      scrollDirectionRef.current = direction;

      // Snap smoothly to closest option index after wheel stops scrolling
      wheelSnapTimeoutRef.current = setTimeout(() => {
        const targetIndex = Math.round(scrollRef.current);
        animateScroll(scrollRef.current, targetIndex, 0.15, () => {
          selectByScroll(scrollRef.current, direction);
        });
      }, 150);
    },
    [
      scrollSensitivity,
      infinite,
      options.length,
      normalizeScroll,
      scrollTo,
      animateScroll,
      selectByScroll,
      cancelAnimation,
    ],
  );

  const handleWheelEvent = useCallback(
    (event: WheelEvent) => {
      if (options.length === 0 || !containerRef.current) return;
      const isTargetValid = containerRef.current.contains(event.target as Node);
      if (isTargetValid && event.cancelable) {
        event.preventDefault();
        scrollByWheel(event);
      }
    },
    [options.length, scrollByWheel],
  );

  const navigateToPicker = useCallback(
    (direction: "prev" | "next") => {
      const pickerIndex = pickerIndexRef.current;
      if (!group || pickerIndex === -1) return;

      const sortedIndices = group.getPickerIndices();
      const currentPos = sortedIndices.indexOf(pickerIndex);
      if (currentPos === -1) return;

      let targetPos: number;
      if (direction === "prev") {
        targetPos = currentPos > 0 ? currentPos - 1 : sortedIndices.length - 1;
      } else {
        targetPos = currentPos < sortedIndices.length - 1 ? currentPos + 1 : 0;
      }

      const targetIndex = sortedIndices[targetPos];
      const targetRef = group.getPickerRef(targetIndex);

      if (targetRef) {
        const currentRef = containerRef.current;
        if (currentRef) currentRef.tabIndex = -1;
        targetRef.tabIndex = 0;
        group.setActiveIndex(targetIndex);
        targetRef.focus();
      }
    },
    [group],
  );

  const enabledOptionsMap = useMemo(() => {
    const map = new Map<number, number>();
    const reverseMap = new Map<number, number>();
    const enabled: WheelPickerOption<T>[] = [];

    options.forEach((option, index) => {
      if (!option.disabled) {
        const enabledIndex = enabled.length;
        map.set(enabledIndex, index);
        reverseMap.set(index, enabledIndex);
        enabled.push(option);
      }
    });

    return { enabled, map, reverseMap };
  }, [options]);

  const { handleTypeaheadSearch, resetTypeahead } = useTypeaheadSearch(
    enabledOptionsMap.enabled,
    {
      getTextValue: (opt) => {
        return (
          opt.textValue ??
          (typeof opt.label === "string" ? opt.label : String(opt.value))
        );
      },
      getCurrentIndex: useCallback(() => {
        const currentIndex = Math.round(scrollRef.current);
        return enabledOptionsMap.reverseMap.get(currentIndex) ?? 0;
      }, [enabledOptionsMap]),
      onMatch: useCallback(
        (enabledIndex: number) => {
          const originalIndex = enabledOptionsMap.map.get(enabledIndex);
          if (originalIndex !== undefined) {
            const step = originalIndex - Math.round(scrollRef.current);
            scrollByStep(step);
          }
        },
        [enabledOptionsMap, scrollByStep],
      ),
    },
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (options.length === 0) return;

      const handleVerticalNavigation = (direction: 1 | -1) => {
        event.preventDefault();
        const currentIndex = Math.round(scrollRef.current);
        let targetIndex = currentIndex + direction;

        if (!infinite) {
          if (direction === -1 && targetIndex < 0) return;
          if (direction === 1 && targetIndex >= options.length) return;
        }

        const normalizedTarget = infinite
          ? ((targetIndex % options.length) + options.length) % options.length
          : targetIndex;

        if (options[normalizedTarget]?.disabled) {
          const nearestEnabled = findNearestEnabledIndex(
            normalizedTarget,
            direction,
            options,
            infinite,
          );
          targetIndex =
            currentIndex + direction + (nearestEnabled - normalizedTarget);
        }

        const step = targetIndex - currentIndex;
        if (step !== 0) {
          scrollByStep(step);
        }
      };

      const handleHome = () => {
        if (infinite) return;
        event.preventDefault();
        let targetIndex = 0;
        if (options[0]?.disabled) {
          targetIndex = findNearestEnabledIndex(0, 1, options, false);
        }
        const step = targetIndex - scrollRef.current;
        if (step !== 0) scrollByStep(step);
      };

      const handleEnd = () => {
        if (infinite) return;
        event.preventDefault();
        let targetIndex = options.length - 1;
        if (options[targetIndex]?.disabled) {
          targetIndex = findNearestEnabledIndex(
            targetIndex,
            -1,
            options,
            false,
          );
        }
        const step = targetIndex - scrollRef.current;
        if (step !== 0) scrollByStep(step);
      };

      const keyHandlers: Record<string, () => void> = {
        ArrowUp: () => handleVerticalNavigation(-1),
        ArrowDown: () => handleVerticalNavigation(1),
        ArrowLeft: () => {
          event.preventDefault();
          navigateToPicker("prev");
        },
        ArrowRight: () => {
          event.preventDefault();
          navigateToPicker("next");
        },
        Home: handleHome,
        End: handleEnd,
      };

      const handler = keyHandlers[event.key];
      if (handler) {
        handler();
      } else if (
        event.key.length === 1 &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {
        event.preventDefault();
        handleTypeaheadSearch(event.key);
      }
    },
    [options, infinite, navigateToPicker, handleTypeaheadSearch, scrollByStep],
  );

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    const pickerIndex = pickerIndexRef.current;
    if (group && pickerIndex !== -1) {
      group.setActiveIndex(pickerIndex);
    }
  }, [group]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    resetTypeahead();
  }, [resetTypeahead]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const opts = { passive: false };
    container.addEventListener("touchstart", handleDragStartEvent, opts);
    container.addEventListener("wheel", handleWheelEvent, opts);
    container.addEventListener("mousedown", handleDragStartEvent, opts);

    return () => {
      container.removeEventListener("touchstart", handleDragStartEvent);
      container.removeEventListener("wheel", handleWheelEvent);
      container.removeEventListener("mousedown", handleDragStartEvent);

      if (dragControllerRef.current) {
        dragControllerRef.current.abort();
      }
      if (wheelSnapTimeoutRef.current) {
        clearTimeout(wheelSnapTimeoutRef.current);
      }
      cancelAnimation();
    };
  }, [handleDragStartEvent, handleWheelEvent, cancelAnimation]);

  useEffect(() => {
    selectByValue(value);
  }, [value, selectByValue]);

  const pickerIndex = pickerIndexRef.current;
  const activeIndex = group?.activeIndex ?? -1;
  const tabIndex =
    group && pickerIndex !== -1 ? (activeIndex === pickerIndex ? 0 : -1) : 0;
  const selectedIndex = optionsProp.findIndex(
    (option) => option.value === value,
  );
  const selectedOption =
    selectedIndex >= 0 ? optionsProp[selectedIndex] : undefined;
  const selectedText = selectedOption
    ? (selectedOption.textValue ??
      (typeof selectedOption.label === "string" ||
      typeof selectedOption.label === "number"
        ? String(selectedOption.label)
        : String(selectedOption.value)))
    : undefined;

  const defaultProps = {
    ref: containerRefCallback,
    className: cn(
      wheelPickerVariants({ size }),
      "relative flex-1 cursor-default select-none focus:outline-none focus-visible:outline-none [perspective:2000px] [transform-style:preserve-3d] pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11",
      className,
    ),
    tabIndex,
    role: "spinbutton",
    "aria-label": props["aria-label"] ?? "Wheel picker",
    "aria-valuemin": optionsProp.length > 0 ? 0 : undefined,
    "aria-valuemax":
      optionsProp.length > 0 ? optionsProp.length - 1 : undefined,
    "aria-valuenow": selectedIndex >= 0 ? selectedIndex : undefined,
    "aria-valuetext": selectedText,
    onKeyDown: handleKeyDown,
    onFocus: handleFocus,
    onBlur: handleBlur,
    style: {
      height: containerHeight,
    },
    "data-slot": "wheel-picker",
    children: (
      <>
        {/* Top and Bottom Fade-out Overlays */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background to-transparent z-10" />

        {/* 3D Wheel cylinder list */}
        <ul
          aria-hidden="true"
          ref={wheelItemsRef}
          className="absolute top-1/2 left-0 block w-full h-0 m-0 p-0 list-none will-change-transform [transform-style:preserve-3d]"
          data-slot="wheel-picker-cylinder"
        >
          {renderWheelItems}
        </ul>

        {/* Flat selected item preview window overlay */}
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 w-full overflow-hidden border-y border-border/80 bg-accent/40 shadow-xs/5 before:pointer-events-none before:absolute before:inset-0 before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
            isFocused &&
              "border-primary/80 bg-accent/60 ring-2 ring-ring/30 dark:ring-ring/20",
            classNames?.highlightWrapper,
          )}
          style={{
            height: itemHeight,
            lineHeight: `${itemHeight}px`,
          }}
          data-slot="wheel-picker-highlight-window"
        >
          <ul
            aria-hidden="true"
            ref={highlightListRef}
            className="absolute left-0 w-full m-0 p-0 list-none"
            style={{
              top: infinite ? -itemHeight : undefined,
            }}
            data-slot="wheel-picker-highlight-list"
          >
            {renderHighlightItems}
          </ul>
        </div>
      </>
    ),
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}
