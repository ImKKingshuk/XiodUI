"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "cn";
// SVG guards present via Button (uses [&_svg:not([class*='size-'])] / [&_svg])
import * as React from "react";
import { ChevronLeft } from "xiod-icons/icons/ChevronLeft";
import { ChevronRight } from "xiod-icons/icons/ChevronRight";

import { Button } from "./button";

// ============================================================================
// Carousel viewport engine — scrolling, snapping and drag, implemented here
// ============================================================================

export type CarouselApi = {
  scrollPrev: (jump?: boolean) => void;
  scrollNext: (jump?: boolean) => void;
  scrollTo: (index: number, jump?: boolean) => void;
  canScrollPrev: () => boolean;
  canScrollNext: () => boolean;
  selectedScrollSnap: () => number;
  scrollSnapList: () => number[];
  on: (event: string, cb: (api: CarouselApi) => void) => void;
  off: (event: string, cb: (api: CarouselApi) => void) => void;
  reInit: (options?: CarouselOptions) => void;
  destroy: () => void;
};

export type CarouselOptions = {
  align?: "start" | "center" | "end";
  axis?: "x" | "y";
  containScroll?: boolean;
  loop?: boolean;
  dragFree?: boolean;
  speed?: number;
};

export type CarouselPlugin = {
  name?: string;
  init?: (api: CarouselApi) => void;
  destroy?: () => void;
};

export type UseCarouselViewport = [
  (node: HTMLElement | null) => void,
  CarouselApi | undefined,
];

export function useCarouselViewport(
  options: CarouselOptions = {},
  plugins: CarouselPlugin[] = [],
): UseCarouselViewport {
  const [viewportNode, setViewportNode] = React.useState<HTMLElement | null>(
    null,
  );
  const [api, setApi] = React.useState<CarouselApi>();

  const optionsRef = React.useRef(options);
  optionsRef.current = options;

  const apiRef = React.useRef<CarouselApi | null>(null);
  const viewportNodeRef = React.useRef<HTMLElement | null>(null);

  // Viewport and track references
  const containerRef = React.useRef<HTMLElement | null>(null);
  const activeIndexRef = React.useRef(0);
  const [_activeIndexState, setActiveIndexState] = React.useState(0);
  const snapOffsetsRef = React.useRef<number[]>([]);
  const listenersRef = React.useRef<
    Record<string, Array<(api: CarouselApi) => void>>
  >({});

  // Pointer drag tracking variables
  const isDraggingRef = React.useRef(false);
  const dragStartPosRef = React.useRef(0);
  const dragStartTimeRef = React.useRef(0);
  const baseTranslationRef = React.useRef(0);
  const currentTranslationRef = React.useRef(0);
  const draggedDistanceRef = React.useRef(0);

  const _getAxisKey = React.useCallback(() => {
    return optionsRef.current.axis === "y" ? "y" : "x";
  }, []);

  const emit = React.useCallback((event: string) => {
    if (!apiRef.current) return;
    const list = listenersRef.current[event] || [];
    for (const cb of list) {
      cb(apiRef.current);
    }
  }, []);

  // Translate track wrapper helper
  const translateTrack = React.useCallback((value: number, animate = true) => {
    const container = containerRef.current;
    if (!container) return;

    if (animate) {
      container.style.transition =
        "transform 400ms cubic-bezier(0.25, 1, 0.5, 1)";
      // Force reflow to ensure the browser registers the transition style update
      void container.offsetHeight;
    } else {
      container.style.transition = "none";
    }

    const isY = optionsRef.current.axis === "y";
    container.style.transform = isY
      ? `translate3d(0, ${value}px, 0)`
      : `translate3d(${value}px, 0, 0)`;

    currentTranslationRef.current = value;
  }, []);

  // Snap position calculations
  const calculateSnaps = React.useCallback(() => {
    const viewport = viewportNodeRef.current;
    const container = containerRef.current;
    if (!viewport || !container) return;

    const isY = optionsRef.current.axis === "y";
    const children = Array.from(container.children) as HTMLElement[];
    if (children.length === 0) {
      snapOffsetsRef.current = [];
      return;
    }

    const viewportSize = isY ? viewport.clientHeight : viewport.clientWidth;
    const containerSize = isY ? container.scrollHeight : container.scrollWidth;

    const align = optionsRef.current.align || "center";
    const snaps: number[] = [];

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const childSize = isY ? child.clientHeight : child.clientWidth;
      const childOffset = isY ? child.offsetTop : child.offsetLeft;

      let alignOffset = 0;
      if (align === "start") {
        alignOffset = 0;
      } else if (align === "end") {
        alignOffset = viewportSize - childSize;
      } else {
        alignOffset = (viewportSize - childSize) / 2;
      }

      let snapTarget = childOffset - alignOffset;

      // Contain snaps to scroll limits
      if (optionsRef.current.containScroll !== false) {
        const maxLimit = containerSize - viewportSize;
        snapTarget = Math.max(0, Math.min(maxLimit, snapTarget));
      }

      snaps.push(-snapTarget);
    }

    // Deduplicate snaps to prevent dead zones
    snapOffsetsRef.current = snaps.filter(
      (val, index, self) => self.indexOf(val) === index,
    );
    emit("reInit");
  }, [emit]);

  const scrollTo = React.useCallback(
    (index: number, jump = false) => {
      if (snapOffsetsRef.current.length === 0) return;
      const loop = optionsRef.current.loop;

      let targetIndex = index;
      if (loop) {
        const len = snapOffsetsRef.current.length;
        targetIndex = ((index % len) + len) % len;
      } else {
        targetIndex = Math.max(
          0,
          Math.min(snapOffsetsRef.current.length - 1, index),
        );
      }

      activeIndexRef.current = targetIndex;
      setActiveIndexState(targetIndex);

      const targetTranslation = snapOffsetsRef.current[targetIndex];
      translateTrack(targetTranslation, !jump);
      baseTranslationRef.current = targetTranslation;
      emit("select");
    },
    [translateTrack, emit],
  );

  const scrollPrev = React.useCallback(
    (jump?: boolean) => {
      scrollTo(activeIndexRef.current - 1, jump === true);
    },
    [scrollTo],
  );

  const scrollNext = React.useCallback(
    (jump?: boolean) => {
      scrollTo(activeIndexRef.current + 1, jump === true);
    },
    [scrollTo],
  );

  const canScrollPrev = React.useCallback(() => {
    return optionsRef.current.loop || activeIndexRef.current > 0;
  }, []);

  const canScrollNext = React.useCallback(() => {
    return (
      optionsRef.current.loop ||
      activeIndexRef.current < snapOffsetsRef.current.length - 1
    );
  }, []);

  const selectedScrollSnap = React.useCallback(() => {
    return activeIndexRef.current;
  }, []);

  const scrollSnapList = React.useCallback(() => {
    return snapOffsetsRef.current.map((_, i) => i);
  }, []);

  // Event handlers
  const handlePointerDown = React.useCallback((e: PointerEvent) => {
    const container = containerRef.current;
    const viewport = viewportNodeRef.current;
    if (!container || !viewport) return;

    if (e.button !== 0 && e.pointerType !== "touch") return;

    // Prevent default browser drag-and-drop or selection behaviors for mouse pointer
    if (e.pointerType === "mouse") {
      e.preventDefault();
    }

    isDraggingRef.current = true;
    draggedDistanceRef.current = 0;
    dragStartTimeRef.current = Date.now();

    const isY = optionsRef.current.axis === "y";
    dragStartPosRef.current = isY ? e.pageY : e.pageX;

    // Remove transition during drag
    container.style.transition = "none";
    baseTranslationRef.current = currentTranslationRef.current;

    // Capture pointer events to ensure we receive moves even outside the viewport bounds
    try {
      viewport.setPointerCapture(e.pointerId);
    } catch {}
  }, []);

  const handlePointerMove = React.useCallback(
    (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const viewport = viewportNodeRef.current;
      const container = containerRef.current;
      if (!viewport || !container) return;

      const isY = optionsRef.current.axis === "y";
      const currentPos = isY ? e.pageY : e.pageX;
      const delta = currentPos - dragStartPosRef.current;
      draggedDistanceRef.current = Math.abs(delta);

      if (draggedDistanceRef.current > 4) {
        e.preventDefault();
        container.style.userSelect = "none";
        container.style.webkitUserSelect = "none";
        viewport.style.cursor = "grabbing";

        let translation = baseTranslationRef.current + delta;

        // Apply elastic rubber-band bounds
        if (!optionsRef.current.loop) {
          const snaps = snapOffsetsRef.current;
          if (snaps.length > 0) {
            const maxBound = snaps[0];
            const minBound = snaps[snaps.length - 1];

            if (translation > maxBound) {
              translation = maxBound + (translation - maxBound) * 0.35;
            } else if (translation < minBound) {
              translation = minBound + (translation - minBound) * 0.35;
            }
          }
        }

        translateTrack(translation, false);
      }
    },
    [translateTrack],
  );

  const handlePointerUp = React.useCallback(
    (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      const viewport = viewportNodeRef.current;
      const container = containerRef.current;
      if (!viewport || !container) return;

      // Release pointer capture
      try {
        viewport.releasePointerCapture(e.pointerId);
      } catch {}

      container.style.userSelect = "";
      container.style.webkitUserSelect = "";
      viewport.style.cursor = "";

      const snaps = snapOffsetsRef.current;
      if (snaps.length === 0) return;

      const _isY = optionsRef.current.axis === "y";
      const delta = currentTranslationRef.current - baseTranslationRef.current;
      const elapsedTime = Date.now() - dragStartTimeRef.current;
      const velocity = delta / (elapsedTime || 1); // pixels per ms

      // Snapping logic based on drag direction and speed
      let targetIndex = activeIndexRef.current;

      if (Math.abs(delta) > 30) {
        if (Math.abs(velocity) > 0.25) {
          // Swipe velocity trigger
          targetIndex =
            velocity > 0
              ? activeIndexRef.current - 1
              : activeIndexRef.current + 1;
        } else {
          // Snap to nearest position
          let minDiff = Number.POSITIVE_INFINITY;
          for (let i = 0; i < snaps.length; i++) {
            const diff = Math.abs(currentTranslationRef.current - snaps[i]);
            if (diff < minDiff) {
              minDiff = diff;
              targetIndex = i;
            }
          }
        }
      }

      scrollTo(targetIndex, false);
    },
    [scrollTo],
  );

  // Click interceptor to prevent link triggers on drag releases
  const handleClickCapture = React.useCallback((e: MouseEvent) => {
    if (draggedDistanceRef.current > 6) {
      e.preventDefault();
      e.stopPropagation();
      draggedDistanceRef.current = 0;
    }
  }, []);

  const on = React.useCallback(
    (event: string, cb: (api: CarouselApi) => void) => {
      listenersRef.current[event] = listenersRef.current[event] || [];
      listenersRef.current[event].push(cb);
    },
    [],
  );

  const off = React.useCallback(
    (event: string, cb: (api: CarouselApi) => void) => {
      if (!listenersRef.current[event]) return;
      listenersRef.current[event] = listenersRef.current[event].filter(
        (item) => item !== cb,
      );
    },
    [],
  );

  const reInit = React.useCallback(
    (newOptions?: CarouselOptions) => {
      if (newOptions) {
        optionsRef.current = { ...optionsRef.current, ...newOptions };
      }
      calculateSnaps();
      scrollTo(activeIndexRef.current, true);
    },
    [calculateSnaps, scrollTo],
  );

  const destroy = React.useCallback(() => {
    listenersRef.current = {};
  }, []);

  // Set API reference
  React.useEffect(() => {
    const apiObject: CarouselApi = {
      scrollPrev,
      scrollNext,
      scrollTo,
      canScrollPrev,
      canScrollNext,
      selectedScrollSnap,
      scrollSnapList,
      on,
      off,
      reInit,
      destroy,
    };
    apiRef.current = apiObject;
    setApi(apiObject);
  }, [
    scrollPrev,
    scrollNext,
    scrollTo,
    canScrollPrev,
    canScrollNext,
    selectedScrollSnap,
    scrollSnapList,
    on,
    off,
    reInit,
    destroy,
  ]);

  // ResizeObserver binding to track viewport scale resizes
  React.useEffect(() => {
    const viewport = viewportNode;
    if (!viewport) return;

    viewportNodeRef.current = viewport;
    const container = viewport.firstElementChild as HTMLElement;
    containerRef.current = container;
    calculateSnaps();

    // Trigger snaps calculation on resize of viewport or container track
    const observer = new ResizeObserver(() => calculateSnaps());
    observer.observe(viewport);
    if (container) {
      observer.observe(container);
    }

    // Initial positioning
    scrollTo(activeIndexRef.current, true);

    // Add pointer listeners
    viewport.addEventListener("pointerdown", handlePointerDown);
    viewport.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    viewport.addEventListener("click", handleClickCapture, true);

    return () => {
      observer.disconnect();
      viewport.removeEventListener("pointerdown", handlePointerDown);
      viewport.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      viewport.removeEventListener("click", handleClickCapture, true);
    };
  }, [
    viewportNode,
    calculateSnaps,
    scrollTo,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleClickCapture,
  ]);

  // Support plugins initialization
  React.useEffect(() => {
    if (!api || plugins.length === 0) return;
    for (const plugin of plugins) {
      if (plugin && typeof plugin.init === "function") {
        plugin.init(api);
      }
    }
  }, [api, plugins]);

  const refCallback = React.useCallback((node: HTMLElement | null) => {
    setViewportNode(node);
  }, []);

  return [refCallback, api];
}

// ============================================================================
// Compound Component Context
export interface CarouselProps {
  orientation?: "horizontal" | "vertical";
  autoplay?: boolean;
  autoplayInterval?: number;
  loop?: boolean;
  activeIndex?: number;
}

type CarouselContextProps = {
  carouselRef: (node: HTMLElement | null) => void;
  api: CarouselApi | undefined;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  orientation: "horizontal" | "vertical";
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

export function useCarousel(): CarouselContextProps {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

export function Carousel({
  orientation = "horizontal",
  opts,
  plugins,
  autoplay = false,
  autoplayInterval = 5000,
  loop = true,
  className,
  children,
  render,
  ...props
}: useRender.ComponentProps<"div"> &
  CarouselProps & {
    opts?: CarouselOptions;
    plugins?: CarouselPlugin[];
  }): React.JSX.Element {
  // Translate options and merge
  const viewportOptions = React.useMemo(
    () => ({
      axis: orientation === "horizontal" ? ("x" as const) : ("y" as const),
      loop,
      ...opts,
    }),
    [orientation, loop, opts],
  );

  const [carouselRef, api] = useCarouselViewport(viewportOptions, plugins);

  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const autoplayTimerRef = React.useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const isHoveredRef = React.useRef(false);
  const isFocusedRef = React.useRef(false);

  const onSelect = React.useCallback((carouselApi: CarouselApi) => {
    if (!carouselApi) return;
    setCanScrollPrev(carouselApi.canScrollPrev());
    setCanScrollNext(carouselApi.canScrollNext());
    setActiveIndex(carouselApi.selectedScrollSnap());
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  // Autoplay loop setup
  const stopAutoplay = React.useCallback(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);

  const startAutoplay = React.useCallback(() => {
    if (!autoplay || !api) return;
    stopAutoplay();
    autoplayTimerRef.current = setInterval(() => {
      if (!isHoveredRef.current && !isFocusedRef.current) {
        api.scrollNext();
      }
    }, autoplayInterval);
  }, [autoplay, autoplayInterval, api, stopAutoplay]);

  React.useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    startAutoplay();

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
      stopAutoplay();
    };
  }, [api, onSelect, startAutoplay, stopAutoplay]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (orientation === "horizontal") {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      } else {
        if (event.key === "ArrowUp") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowDown") {
          event.preventDefault();
          scrollNext();
        }
      }
    },
    [scrollPrev, scrollNext, orientation],
  );
  const contextValue = React.useMemo(
    () => ({
      carouselRef,
      api,
      orientation,
      scrollPrev,
      scrollNext,
      canScrollPrev,
      canScrollNext,
      autoplay,
      autoplayInterval,
      loop,
      activeIndex,
    }),
    [
      carouselRef,
      api,
      orientation,
      scrollPrev,
      scrollNext,
      canScrollPrev,
      canScrollNext,
      autoplay,
      autoplayInterval,
      loop,
      activeIndex,
    ],
  );

  const defaultProps = {
    onKeyDownCapture: handleKeyDown,
    onMouseEnter: () => {
      isHoveredRef.current = true;
      stopAutoplay();
    },
    onMouseLeave: () => {
      isHoveredRef.current = false;
      startAutoplay();
    },
    onFocus: () => {
      isFocusedRef.current = true;
      stopAutoplay();
    },
    onBlur: () => {
      isFocusedRef.current = false;
      startAutoplay();
    },
    className: cn("relative outline-none", className),
    role: "region",
    "aria-roledescription": "carousel",
    "data-slot": "carousel",
    children,
  };

  const element = useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });

  return (
    <CarouselContext.Provider value={contextValue}>
      {element}
    </CarouselContext.Provider>
  );
}

export function CarouselContent({
  className,
  render,
  children,
  ...props
}: useRender.ComponentProps<"div">): React.JSX.Element {
  const { carouselRef, orientation } = useCarousel();

  const defaultProps = {
    className: cn(
      "flex h-full w-full touch-pan-y pointer-events-auto will-change-transform",
      orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
      className,
    ),
    "data-slot": "carousel-content",
    children,
  };

  const innerElement = useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden w-full h-full relative"
      data-slot="carousel-viewport"
    >
      {innerElement}
    </div>
  );
}

export function CarouselItem({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.JSX.Element {
  const { orientation } = useCarousel();

  const defaultProps = {
    role: "group",
    "aria-roledescription": "slide",
    className: cn(
      "min-w-0 shrink-0 grow-0 basis-full select-none",
      orientation === "horizontal" ? "pl-4" : "pt-4",
      className,
    ),
    "data-slot": "carousel-item",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof Button>): React.JSX.Element {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        "absolute z-10 rounded-full",
        orientation === "horizontal"
          ? "inset-y-0 -left-12 my-auto"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ChevronLeft className="size-4.5 sm:size-4 cn-rtl-flip" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
}

export function CarouselNext({
  className,
  variant = "outline",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof Button>): React.JSX.Element {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        "absolute z-10 rounded-full",
        orientation === "horizontal"
          ? "inset-y-0 -right-12 my-auto"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ChevronRight className="size-4.5 sm:size-4 cn-rtl-flip" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
}

export function CarouselDots({
  className,
  render,
  children,
  ...props
}: useRender.ComponentProps<"div">): React.JSX.Element | null {
  const { api, activeIndex } = useCarousel();
  const snaps = api ? api.scrollSnapList() : [];

  const defaultProps = {
    className: cn("flex justify-center items-center gap-1.5", className),
    role: "tablist",
    "aria-label": "Carousel pagination",
    "data-slot": "carousel-dots",
    children:
      children ??
      snaps.map((_, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === activeIndex}
          aria-label={`Go to slide ${i + 1}`}
          className={cn(
            "h-1.5 rounded-full transition-[width,background-color] duration-300 pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
            i === activeIndex
              ? "bg-foreground w-4"
              : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-1.5",
          )}
          onClick={() => api?.scrollTo(i)}
        />
      )),
  };

  const element = useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });

  if (snaps.length <= 1) return null;

  return element;
}
