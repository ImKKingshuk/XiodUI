"use client";

import { cn } from "cn";
import type * as React from "react";
import {
  type CSSProperties,
  type MouseEventHandler,
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AlertCircle as CircleAlertIcon } from "xiod-icons/icons/AlertCircle";
import { ArrowRight as ArrowRightIcon } from "xiod-icons/icons/ArrowRight";
import { Cancel as XIcon } from "xiod-icons/icons/Cancel";
import { Check as CheckIcon } from "xiod-icons/icons/Check";
import { InformationCircle as InfoIcon } from "xiod-icons/icons/InformationCircle";
import { LoadingSpinner as LoaderCircleIcon } from "xiod-icons/icons/LoadingSpinner";

/* --------------------------------- Layout --------------------------------- */
const HEIGHT = 40;
const WIDTH = 350;
const DEFAULT_ROUNDNESS = 16;

/* --------------------------------- Timing --------------------------------- */
const DEFAULT_TOAST_DURATION = 6000;
const EXIT_DURATION = 600;
const AUTO_EXPAND_DELAY = 150;
const AUTO_COLLAPSE_DELAY = 4000;

/* --------------------------------- Render --------------------------------- */
const BLUR_RATIO = 0.5;
const PILL_PADDING = 10;
const MIN_EXPAND_RATIO = 2.25;
const SWAP_COLLAPSE_MS = 200;
const HEADER_EXIT_MS = 420;

export type MorphicToastState =
  | "success"
  | "loading"
  | "error"
  | "warning"
  | "info"
  | "action";

export interface MorphicToastStyles {
  title?: string;
  description?: string;
  badge?: string;
  button?: string;
}

export interface MorphicToastButton {
  title: string;
  onClick: () => void;
}

export type MorphicToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface MorphicToastOptions {
  id?: string;
  title?: string;
  description?: ReactNode | string;
  type?: MorphicToastState;
  position?: MorphicToastPosition;
  duration?: number | null;
  icon?: ReactNode | null;
  styles?: MorphicToastStyles;
  fill?: string;
  roundness?: number;
  autopilot?: boolean | { expand?: number; collapse?: number };
  button?: MorphicToastButton;
  className?: string;
}

interface InternalMorphicToastOptions extends MorphicToastOptions {
  id?: string;
  state?: MorphicToastState;
}

interface MorphicToastItem extends InternalMorphicToastOptions {
  id: string;
  instanceId: string;
  exiting?: boolean;
  autoExpandDelayMs?: number;
  autoCollapseDelayMs?: number;
}

type MorphicToastOffsetValue = number | string;
type MorphicToastOffsetConfig = Partial<
  Record<"top" | "right" | "bottom" | "left", MorphicToastOffsetValue>
>;

export interface MorphicToasterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  position?: MorphicToastPosition;
  offset?: MorphicToastOffsetValue | MorphicToastOffsetConfig;
  options?: Partial<MorphicToastOptions>;
}

interface View {
  title?: string;
  description?: ReactNode | string;
  state: MorphicToastState;
  icon?: ReactNode | null;
  styles?: MorphicToastStyles;
  button?: MorphicToastButton;
  fill?: string;
}

const pillAlign = (pos: MorphicToastPosition) =>
  pos.includes("right") ? "right" : pos.includes("center") ? "center" : "left";

const expandDir = (pos: MorphicToastPosition) =>
  pos.startsWith("top") ? ("bottom" as const) : ("top" as const);

const STATE_ICON: Record<MorphicToastState, ReactNode> = {
  success: <CheckIcon className="size-3.5" />,
  loading: (
    <LoaderCircleIcon className="size-3.5 animate-spin" aria-hidden="true" />
  ),
  error: <XIcon className="size-3.5" />,
  warning: <CircleAlertIcon className="size-3.5" />,
  info: <InfoIcon className="size-3.5" />,
  action: <ArrowRightIcon className="size-3.5" />,
};

/* ------------------------------ Global Store ------------------------------ */
type MorphicToastListener = (toasts: MorphicToastItem[]) => void;

const store = {
  toasts: [] as MorphicToastItem[],
  listeners: new Set<MorphicToastListener>(),
  position: "top-right" as MorphicToastPosition,
  options: undefined as Partial<MorphicToastOptions> | undefined,

  emit() {
    for (const fn of this.listeners) fn(this.toasts);
  },

  update(fn: (prev: MorphicToastItem[]) => MorphicToastItem[]) {
    this.toasts = fn(this.toasts);
    this.emit();
  },
};

let idCounter = 0;
const generateId = () =>
  `${++idCounter}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const timeoutKey = (t: MorphicToastItem) => `${t.id}:${t.instanceId}`;

const dismissToast = (id: string): void => {
  const item = store.toasts.find((t) => t.id === id);
  if (!item || item.exiting) return;

  store.update((prev) =>
    prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
  );

  setTimeout(
    () => store.update((prev) => prev.filter((t) => t.id !== id)),
    EXIT_DURATION,
  );
};

const resolveAutopilot = (
  opts: InternalMorphicToastOptions,
  duration: number | null,
): { expandDelayMs?: number; collapseDelayMs?: number } => {
  if (opts.autopilot === false || !duration || duration <= 0) return {};
  const cfg = typeof opts.autopilot === "object" ? opts.autopilot : undefined;
  const clamp = (v: number) => Math.min(duration, Math.max(0, v));
  return {
    expandDelayMs: clamp(cfg?.expand ?? AUTO_EXPAND_DELAY),
    collapseDelayMs: clamp(cfg?.collapse ?? AUTO_COLLAPSE_DELAY),
  };
};

const mergeOptions = (options: InternalMorphicToastOptions) => ({
  ...store.options,
  ...options,
  styles: { ...store.options?.styles, ...options.styles },
});

const buildMorphicToastItem = (
  merged: InternalMorphicToastOptions,
  id: string,
  fallbackPosition?: MorphicToastPosition,
): MorphicToastItem => {
  const duration = merged.duration ?? DEFAULT_TOAST_DURATION;
  const auto = resolveAutopilot(merged, duration);
  return {
    ...merged,
    id,
    instanceId: generateId(),
    position: merged.position ?? fallbackPosition ?? store.position,
    autoExpandDelayMs: auto.expandDelayMs,
    autoCollapseDelayMs: auto.collapseDelayMs,
  };
};

const createToast = (options: InternalMorphicToastOptions) => {
  const live = store.toasts.filter((t) => !t.exiting);
  const merged = mergeOptions(options);

  const id = merged.id ?? "morphic-default";
  const prev = live.find((t) => t.id === id);
  const item = buildMorphicToastItem(merged, id, prev?.position);

  if (prev) {
    store.update((p) => p.map((t) => (t.id === id ? item : t)));
  } else {
    store.update((p) => [...p.filter((t) => t.id !== id), item]);
  }
  return { id, duration: merged.duration ?? DEFAULT_TOAST_DURATION };
};

const updateToast = (id: string, options: InternalMorphicToastOptions) => {
  const existing = store.toasts.find((t) => t.id === id);
  if (!existing) return;

  const item = buildMorphicToastItem(
    mergeOptions(options),
    id,
    existing.position,
  );
  store.update((prev) => prev.map((t) => (t.id === id ? item : t)));
};

export interface MorphicToastPromiseOptions<T = unknown> {
  loading: MorphicToastOptions;
  success: MorphicToastOptions | ((data: T) => MorphicToastOptions);
  error: MorphicToastOptions | ((err: unknown) => MorphicToastOptions);
  action?: MorphicToastOptions | ((data: T) => MorphicToastOptions);
  position?: MorphicToastPosition;
}

export const morphicToast = {
  show: (opts: MorphicToastOptions): string =>
    createToast({ ...opts, state: opts.type }).id,
  success: (opts: MorphicToastOptions): string =>
    createToast({ ...opts, state: "success" }).id,
  error: (opts: MorphicToastOptions): string =>
    createToast({ ...opts, state: "error" }).id,
  warning: (opts: MorphicToastOptions): string =>
    createToast({ ...opts, state: "warning" }).id,
  info: (opts: MorphicToastOptions): string =>
    createToast({ ...opts, state: "info" }).id,
  action: (opts: MorphicToastOptions): string =>
    createToast({ ...opts, state: "action" }).id,

  promise: <T,>(
    promise: Promise<T> | (() => Promise<T>),
    opts: MorphicToastPromiseOptions<T>,
  ): Promise<T> => {
    const { id } = createToast({
      ...opts.loading,
      state: "loading",
      duration: null,
      position: opts.position,
    });

    const p = typeof promise === "function" ? promise() : promise;

    void (async () => {
      try {
        const data = await p;
        if (opts.action) {
          const actionOpts =
            typeof opts.action === "function" ? opts.action(data) : opts.action;
          updateToast(id, { ...actionOpts, state: "action", id });
        } else {
          const successOpts =
            typeof opts.success === "function"
              ? opts.success(data)
              : opts.success;
          updateToast(id, { ...successOpts, state: "success", id });
        }
      } catch (error) {
        const errorOpts =
          typeof opts.error === "function" ? opts.error(error) : opts.error;
        updateToast(id, { ...errorOpts, state: "error", id });
      }
    })();

    return p;
  },

  dismiss: dismissToast,

  clear: (position?: MorphicToastPosition): void =>
    store.update((prev) =>
      position ? prev.filter((t) => t.position !== position) : [],
    ),
};

/* ----------------------------- Gooey Defs ------------------------------ */
const GooeyDefs = memo(function GooeyDefs({
  filterId,
  blur,
}: {
  filterId: string;
  blur: number;
}) {
  return (
    <defs>
      <filter
        id={filterId}
        x="-20%"
        y="-20%"
        width="140%"
        height="140%"
        colorInterpolationFilters="sRGB"
      >
        <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur" />
        <feColorMatrix
          in="blur"
          mode="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
          result="goo"
        />
        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
      </filter>
    </defs>
  );
});

/* ------------------------------- Component -------------------------------- */
interface MorphicToastProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  fill?: string;
  state?: MorphicToastState;
  title?: string;
  description?: ReactNode | string;
  position?: "left" | "center" | "right";
  expand?: "top" | "bottom";
  className?: string;
  icon?: ReactNode | null;
  styles?: MorphicToastStyles;
  button?: MorphicToastButton;
  roundness?: number;
  exiting?: boolean;
  autoExpandDelayMs?: number;
  autoCollapseDelayMs?: number;
  canExpand?: boolean;
  refreshKey?: string;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
  onDismiss?: () => void;
}

const MorphicToast = memo(function MorphicToast({
  id,
  fill,
  state = "success",
  title = state,
  description,
  position = "left",
  expand = "bottom",
  className,
  icon,
  styles,
  button,
  roundness,
  exiting = false,
  autoExpandDelayMs,
  autoCollapseDelayMs,
  canExpand,
  refreshKey,
  onMouseEnter,
  onMouseLeave,
  onDismiss,
  ...props
}: MorphicToastProps) {
  const next: View = useMemo(
    () => ({ title, description, state, icon, styles, button, fill }),
    [title, description, state, icon, styles, button, fill],
  );

  const [view, setView] = useState<View>(next);
  const [applied, setApplied] = useState(refreshKey);
  const [isExpanded, setIsExpanded] = useState(false);
  const [ready, setReady] = useState(false);
  const [pillWidth, setPillWidth] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const hasDesc = Boolean(view.description) || Boolean(view.button);
  const isLoading = view.state === "loading";
  const open = hasDesc && isExpanded && !isLoading;
  const allowExpand = isLoading ? false : canExpand;

  const headerKey = `${view.state}-${view.title}`;
  const filterId = `morphic-gooey-${id}`;
  const resolvedRoundness = Math.max(0, roundness ?? DEFAULT_ROUNDNESS);
  const blur = resolvedRoundness * BLUR_RATIO;

  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headerExitRef = useRef<number | null>(null);
  const autoExpandRef = useRef<number | null>(null);
  const autoCollapseRef = useRef<number | null>(null);
  const swapTimerRef = useRef<number | null>(null);
  const lastRefreshKeyRef = useRef(refreshKey);
  const pendingRef = useRef<{ key?: string; payload: View } | null>(null);

  const [headerLayer, setHeaderLayer] = useState<{
    current: { key: string; view: View };
    prev: { key: string; view: View } | null;
  }>({ current: { key: headerKey, view }, prev: null });

  /* ------------------------------ Measurements ------------------------------ */
  const innerRef = useRef<HTMLDivElement>(null);
  const headerPadRef = useRef<number | null>(null);
  const pillRoRef = useRef<ResizeObserver | null>(null);
  const pillRafRef = useRef(0);
  const pillObservedRef = useRef<Element | null>(null);

  // The dependency list deliberately carries a value this effect does not
  // read: it exists to force a remeasure when the key changes.
  useLayoutEffect(() => {
    const el = innerRef.current;
    const header = headerRef.current;
    if (!el || !header) return;
    if (headerPadRef.current === null) {
      const cs = getComputedStyle(header);
      headerPadRef.current =
        parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    }
    const px = headerPadRef.current;
    const measure = () => {
      const w = el.scrollWidth + px + PILL_PADDING;
      if (w > PILL_PADDING) {
        setPillWidth((prev) => (prev === w ? prev : w));
      }
    };
    measure();

    if (!pillRoRef.current) {
      pillRoRef.current = new ResizeObserver(() => {
        cancelAnimationFrame(pillRafRef.current);
        pillRafRef.current = requestAnimationFrame(() => {
          const inner = innerRef.current;
          const pad = headerPadRef.current ?? 0;
          if (!inner) return;
          const w = inner.scrollWidth + pad + PILL_PADDING;
          if (w > PILL_PADDING) {
            setPillWidth((prev) => (prev === w ? prev : w));
          }
        });
      });
    }

    if (pillObservedRef.current !== el) {
      if (pillObservedRef.current) {
        pillRoRef.current.unobserve(pillObservedRef.current);
      }
      pillRoRef.current.observe(el);
      pillObservedRef.current = el;
    }
  }, []);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(pillRafRef.current);
      pillRoRef.current?.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    if (!hasDesc) {
      setContentHeight(0);
      return;
    }
    const el = contentRef.current;
    if (!el) return;
    const measure = () => {
      const h = el.scrollHeight;
      setContentHeight((prev) => (prev === h ? prev : h));
    };
    measure();
    let rafId = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(measure);
    });
    ro.observe(el);
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [hasDesc]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useLayoutEffect(() => {
    setHeaderLayer((currentLayer) => {
      if (currentLayer.current.key === headerKey) {
        if (currentLayer.current.view === view) return currentLayer;
        return { ...currentLayer, current: { key: headerKey, view } };
      }
      return {
        prev: currentLayer.current,
        current: { key: headerKey, view },
      };
    });
  }, [headerKey, view]);

  useEffect(() => {
    if (!headerLayer.prev) return;
    if (headerExitRef.current) {
      clearTimeout(headerExitRef.current);
    }
    headerExitRef.current = window.setTimeout(() => {
      headerExitRef.current = null;
      setHeaderLayer((currentLayer) => ({ ...currentLayer, prev: null }));
    }, HEADER_EXIT_MS);
    return () => {
      if (headerExitRef.current) {
        clearTimeout(headerExitRef.current);
        headerExitRef.current = null;
      }
    };
  }, [headerLayer.prev]);

  /* ----------------------------- Sync fill ---------------------------------- */
  useEffect(() => {
    setView((prev) => (prev.fill === fill ? prev : { ...prev, fill }));
  }, [fill]);

  /* ----------------------------- Refresh logic ------------------------------ */
  useEffect(() => {
    if (refreshKey === undefined) {
      setView(next);
      setApplied(undefined);
      pendingRef.current = null;
      lastRefreshKeyRef.current = refreshKey;
      return;
    }

    if (lastRefreshKeyRef.current === refreshKey) return;
    lastRefreshKeyRef.current = refreshKey;

    if (swapTimerRef.current) {
      clearTimeout(swapTimerRef.current);
      swapTimerRef.current = null;
    }

    if (open) {
      pendingRef.current = { key: refreshKey, payload: next };
      setIsExpanded(false);
      swapTimerRef.current = window.setTimeout(() => {
        swapTimerRef.current = null;
        const pending = pendingRef.current;
        if (!pending) return;
        setView(pending.payload);
        setApplied(pending.key);
        pendingRef.current = null;
      }, SWAP_COLLAPSE_MS);
    } else {
      pendingRef.current = null;
      setView(next);
      setApplied(refreshKey);
    }
  }, [open, refreshKey, next]);

  // `applied` intentionally restarts auto-expand timers after refreshed content
  // commits, even though its value is not otherwise needed by the effect.
  // oxlint-disable react/exhaustive-effect-dependencies
  useEffect(() => {
    if (!hasDesc) return;

    if (autoExpandRef.current) clearTimeout(autoExpandRef.current);
    if (autoCollapseRef.current) clearTimeout(autoCollapseRef.current);

    if (exiting || !allowExpand) {
      setIsExpanded(false);
      return;
    }

    if (autoExpandDelayMs == null && autoCollapseDelayMs == null) return;

    const expandDelay = autoExpandDelayMs ?? 0;
    const collapseDelay = autoCollapseDelayMs ?? 0;

    if (expandDelay > 0) {
      autoExpandRef.current = window.setTimeout(
        () => setIsExpanded(true),
        expandDelay,
      );
    } else {
      setIsExpanded(true);
    }

    if (collapseDelay > 0) {
      autoCollapseRef.current = window.setTimeout(
        () => setIsExpanded(false),
        collapseDelay,
      );
    }

    return () => {
      if (autoExpandRef.current) clearTimeout(autoExpandRef.current);
      if (autoCollapseRef.current) clearTimeout(autoCollapseRef.current);
    };
  }, [
    autoCollapseDelayMs,
    autoExpandDelayMs,
    hasDesc,
    allowExpand,
    exiting,
    applied,
  ]);
  // oxlint-enable react/exhaustive-effect-dependencies

  /* ------------------------------ Derived values ---------------------------- */
  const minExpanded = HEIGHT * MIN_EXPAND_RATIO;
  const rawExpanded = hasDesc
    ? Math.max(minExpanded, HEIGHT + contentHeight)
    : minExpanded;

  const frozenExpandedRef = useRef(rawExpanded);
  if (open) {
    frozenExpandedRef.current = rawExpanded;
  }

  const expanded = open ? rawExpanded : frozenExpandedRef.current;
  const svgHeight = hasDesc ? Math.max(expanded, minExpanded) : HEIGHT;
  const expandedContent = Math.max(0, expanded - HEIGHT);
  const resolvedPillWidth = Math.max(pillWidth || HEIGHT, HEIGHT);
  const pillHeight = HEIGHT + blur * 3;

  const pillX =
    position === "right"
      ? WIDTH - resolvedPillWidth
      : position === "center"
        ? (WIDTH - resolvedPillWidth) / 2
        : 0;

  const viewBox = `0 0 ${WIDTH} ${svgHeight}`;

  const canvasStyle = useMemo<CSSProperties>(
    () => ({ filter: `url(#${filterId})` }),
    [filterId],
  );

  const rootStyle = useMemo<CSSProperties & Record<string, string>>(
    () => ({
      "--_h": `${open ? expanded : HEIGHT}px`,
      "--_pw": `${resolvedPillWidth}px`,
      "--_px": `${pillX}px`,
      "--_ht": `translateY(${open ? (expand === "bottom" ? 3 : -3) : 0}px) scale(${open ? 0.98 : 1})`,
      "--_co": `${open ? 1 : 0}`,
    }),
    [open, expanded, resolvedPillWidth, pillX, expand],
  );

  /* -------------------------------- Handlers -------------------------------- */
  const handleEnter: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      onMouseEnter?.(e);
      if (hasDesc) setIsExpanded(true);
    },
    [hasDesc, onMouseEnter],
  );

  const handleLeave: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      onMouseLeave?.(e);
      setIsExpanded(false);
    },
    [onMouseLeave],
  );

  const handleTransitionEnd: React.TransitionEventHandler<HTMLDivElement> =
    useCallback(
      (e) => {
        if (e.propertyName !== "height" && e.propertyName !== "transform")
          return;
        if (open) return;
        const pending = pendingRef.current;
        if (!pending) return;
        if (swapTimerRef.current) {
          clearTimeout(swapTimerRef.current);
          swapTimerRef.current = null;
        }
        setView(pending.payload);
        setApplied(pending.key);
        pendingRef.current = null;
      },
      [open],
    );

  /* -------------------------------- Swipe ----------------------------------- */
  const SWIPE_DISMISS = 30;
  const SWIPE_MAX = 20;
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerStartRef = useRef<number | null>(null);
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  const swipeHandlersRef = useRef<{
    onMove: (e: PointerEvent) => void;
    onUp: (e: PointerEvent) => void;
  } | null>(null);

  if (!swipeHandlersRef.current) {
    const handlers = {
      onMove: (e: PointerEvent) => {
        const el = containerRef.current;
        if (pointerStartRef.current === null || !el) return;
        const dy = e.clientY - pointerStartRef.current;
        const sign = dy > 0 ? 1 : -1;
        const clamped = Math.min(Math.abs(dy), SWIPE_MAX) * sign;
        el.style.transform = `translateY(${clamped}px)`;
      },
      onUp: (e: PointerEvent) => {
        const el = containerRef.current;
        if (pointerStartRef.current === null || !el) return;
        const dy = e.clientY - pointerStartRef.current;
        pointerStartRef.current = null;
        el.style.transform = "";
        el.removeEventListener("pointermove", handlers.onMove);
        el.removeEventListener("pointerup", handlers.onUp);
        if (Math.abs(dy) > SWIPE_DISMISS) {
          onDismissRef.current?.();
        }
      },
    };
    swipeHandlersRef.current = handlers;
  }

  const handleButtonClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      view.button?.onClick();
    },
    [view.button],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (exiting || !onDismiss) return;
      const target = e.target as HTMLElement;
      if (target.closest("[data-morphic-button]")) return;
      pointerStartRef.current = e.clientY;
      e.currentTarget.setPointerCapture(e.pointerId);
      const el = containerRef.current;
      const h = swipeHandlersRef.current;
      if (el && h) {
        el.addEventListener("pointermove", h.onMove, { passive: true });
        el.addEventListener("pointerup", h.onUp, { passive: true });
      }
    },
    [exiting, onDismiss],
  );

  /* --------------------------------- Render --------------------------------- */
  return (
    <div
      ref={containerRef}
      role="status"
      data-morphic-toast
      data-slot="morphic-toast"
      {...props}
      data-ready={ready}
      data-expanded={open}
      data-exiting={exiting}
      data-edge={expand}
      data-position={position}
      data-state={view.state}
      className={cn(
        "relative pointer-events-auto w-[350px] overflow-visible transition-[opacity,height] duration-600 will-change-transform text-zinc-900 dark:text-white drop-shadow-[0_8px_16px_rgba(0,0,0,0.06)] dark:drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)] [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        exiting && "opacity-0 scale-95 pointer-events-none",
        className,
      )}
      style={{
        ...rootStyle,
        height: open ? expanded : HEIGHT,
        transition: ready
          ? `transform 396ms var(--morphic-spring-easing), opacity 396ms var(--morphic-spring-easing), height 600ms var(--morphic-spring-easing)`
          : "none",
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onTransitionEnd={handleTransitionEnd}
      onPointerDown={handlePointerDown}
    >
      <div
        data-morphic-canvas
        data-edge={expand}
        className={cn(
          "absolute left-0 right-0 pointer-events-none overflow-visible",
          expand === "top" ? "bottom-0 scale-y-[-1]" : "top-0",
        )}
        style={canvasStyle}
      >
        {/* `size-auto` is load-bearing: the root clamps every descendant svg
            with `[&_svg:not([class*='size-'])]:size-4.5` so icons stay 18px.
            Without a `size-` class this canvas matches that rule and collapses
            to an 18px box, hiding the gooey pill and body entirely. */}
        <svg
          data-morphic-svg
          width={WIDTH}
          height={svgHeight}
          viewBox={viewBox}
          className="size-auto overflow-visible"
        >
          <title>Morphic Notification</title>
          <GooeyDefs filterId={filterId} blur={blur} />
          <rect
            data-morphic-pill
            className="fill-white dark:fill-zinc-900"
            style={{
              x: pillX,
              y: 0,
              width: resolvedPillWidth,
              height: open ? pillHeight : HEIGHT,
              rx: resolvedRoundness,
              ry: resolvedRoundness,
              fill: fill,
              transition: ready
                ? `x var(--morphic-duration) var(--morphic-spring-easing), width var(--morphic-duration) var(--morphic-spring-easing), height var(--morphic-duration) var(--morphic-spring-easing)`
                : "none",
            }}
          />
          <rect
            data-morphic-body
            y={HEIGHT}
            width={WIDTH}
            className="fill-white dark:fill-zinc-900"
            style={{
              height: open ? expandedContent : 0,
              opacity: open ? 1 : 0,
              rx: resolvedRoundness,
              ry: resolvedRoundness,
              fill: fill,
              transition: `height var(--morphic-duration) ${open ? "var(--morphic-spring-easing)" : "ease-in"}, opacity var(--morphic-duration) ${open ? "var(--morphic-spring-easing)" : "ease-in"}`,
            }}
          />
        </svg>
      </div>

      <div
        ref={headerRef}
        data-morphic-header
        data-edge={expand}
        className={cn(
          "absolute z-20 flex items-center px-4 h-10 overflow-hidden select-none left-(--_px,0px) max-w-(--_pw,350px)",
          expand === "top" ? "bottom-0" : "top-0",
        )}
        style={{
          transform: "var(--_ht)",
          transition: ready
            ? `transform var(--morphic-duration) var(--morphic-spring-easing), left var(--morphic-duration) var(--morphic-spring-easing), max-width var(--morphic-duration) var(--morphic-spring-easing)`
            : "none",
        }}
      >
        <div className="relative inline-flex items-center h-full">
          <div
            ref={innerRef}
            key={headerLayer.current.key}
            data-morphic-header-inner
            data-layer="current"
            className="flex items-center gap-2.5 whitespace-nowrap"
            style={{
              animation: ready
                ? "morphic-header-enter var(--morphic-duration) var(--morphic-spring-easing) both"
                : "none",
            }}
          >
            <div
              data-morphic-badge
              data-state={headerLayer.current.view.state}
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full p-0.5 box-border",
                headerLayer.current.view.styles?.badge,
              )}
            >
              {headerLayer.current.view.icon ??
                STATE_ICON[headerLayer.current.view.state]}
            </div>
            <span
              data-morphic-title
              data-state={headerLayer.current.view.state}
              className={cn(
                "text-[13px] leading-4 font-medium capitalize",
                headerLayer.current.view.styles?.title,
              )}
            >
              {headerLayer.current.view.title}
            </span>
          </div>

          {headerLayer.prev && (
            <div
              key={headerLayer.prev.key}
              data-morphic-header-inner
              data-layer="prev"
              data-exiting="true"
              className="absolute left-0 top-0 z-0 pointer-events-none flex items-center gap-2.5 whitespace-nowrap"
              style={{
                animation:
                  "morphic-header-exit calc(var(--morphic-duration) * 0.7) ease forwards",
              }}
            >
              <div
                data-morphic-badge
                data-state={headerLayer.prev.view.state}
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full p-0.5 box-border",
                  headerLayer.prev.view.styles?.badge,
                )}
              >
                {headerLayer.prev.view.icon ??
                  STATE_ICON[headerLayer.prev.view.state]}
              </div>
              <span
                data-morphic-title
                data-state={headerLayer.prev.view.state}
                className={cn(
                  "text-[13px] leading-4 font-medium capitalize",
                  headerLayer.prev.view.styles?.title,
                )}
              >
                {headerLayer.prev.view.title}
              </span>
            </div>
          )}
        </div>
      </div>

      {hasDesc && (
        <div
          data-morphic-content
          data-edge={expand}
          data-visible={open}
          className={cn(
            "absolute left-0 z-10 w-full pointer-events-none opacity-0 select-none",
            expand === "top" ? "top-0" : "top-10",
            open && "pointer-events-auto opacity-100 select-text",
          )}
          style={{
            transition: ready
              ? open
                ? `opacity calc(var(--morphic-duration) * 0.6) ease calc(var(--morphic-duration) * 0.3)`
                : `opacity calc(var(--morphic-duration) * 0.08) ease calc(var(--morphic-duration) * 0.04)`
              : "none",
          }}
        >
          <div
            ref={contentRef}
            data-morphic-description
            className={cn(
              "w-full text-left p-4 text-[13.5px] leading-5 text-zinc-900/60 dark:text-white/60",
              view.styles?.description,
            )}
          >
            {view.description}
            {view.button && (
              <button
                type="button"
                data-morphic-button
                data-state={view.state}
                className={cn(
                  "relative inline-flex items-center justify-center h-7 px-3 mt-3 rounded-full text-xs font-medium cursor-pointer transition-colors duration-150 border-0 outline-none select-none text-zinc-900 bg-zinc-900/10 hover:bg-zinc-900/20 dark:text-white dark:bg-white/10 dark:hover:bg-white/20 pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11",
                  view.styles?.button,
                )}
                onClick={handleButtonClick}
              >
                {view.button.title}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

/* ------------------------------ Toaster Component ------------------------- */
export function MorphicToaster({
  children,
  position = "top-right",
  offset,
  options,
  className,
  style,
  ...props
}: MorphicToasterProps): React.JSX.Element {
  const [toasts, setToasts] = useState<MorphicToastItem[]>(store.toasts);
  const [activeId, setActiveId] = useState<string>();

  const hoverRef = useRef(false);
  const timersRef = useRef(new Map<string, number>());
  const listRef = useRef(toasts);
  const latestRef = useRef<string | undefined>(undefined);
  const handlersCache = useRef(
    new Map<
      string,
      {
        enter: MouseEventHandler<HTMLDivElement>;
        leave: MouseEventHandler<HTMLDivElement>;
        dismiss: () => void;
      }
    >(),
  );

  useEffect(() => {
    store.position = position;
    store.options = options;
  }, [position, options]);

  const clearAllTimers = useCallback(() => {
    for (const t of timersRef.current.values()) clearTimeout(t);
    timersRef.current.clear();
  }, []);

  const schedule = useCallback((items: MorphicToastItem[]) => {
    if (hoverRef.current) return;

    for (const item of items) {
      if (item.exiting) continue;
      const key = timeoutKey(item);
      if (timersRef.current.has(key)) continue;

      if (item.duration === null) continue;
      const dur = item.duration ?? DEFAULT_TOAST_DURATION;
      if (dur <= 0) continue;

      timersRef.current.set(
        key,
        window.setTimeout(() => dismissToast(item.id), dur),
      );
    }
  }, []);

  useEffect(() => {
    const listener: MorphicToastListener = (next) => setToasts(next);
    store.listeners.add(listener);
    return () => {
      store.listeners.delete(listener);
      clearAllTimers();
    };
  }, [clearAllTimers]);

  useEffect(() => {
    listRef.current = toasts;

    const toastKeys = new Set(toasts.map(timeoutKey));
    const toastIds = new Set(toasts.map((t) => t.id));
    for (const [key, timer] of timersRef.current) {
      if (!toastKeys.has(key)) {
        clearTimeout(timer);
        timersRef.current.delete(key);
      }
    }
    for (const id of handlersCache.current.keys()) {
      if (!toastIds.has(id)) handlersCache.current.delete(id);
    }

    schedule(toasts);
  }, [toasts, schedule]);

  const handleMouseEnterRef = useRef<MouseEventHandler<HTMLDivElement>>(null);
  const handleMouseLeaveRef = useRef<MouseEventHandler<HTMLDivElement>>(null);

  handleMouseEnterRef.current = useCallback<
    MouseEventHandler<HTMLDivElement>
  >(() => {
    if (hoverRef.current) return;
    hoverRef.current = true;
    clearAllTimers();
  }, [clearAllTimers]);

  handleMouseLeaveRef.current = useCallback<
    MouseEventHandler<HTMLDivElement>
  >(() => {
    if (!hoverRef.current) return;
    hoverRef.current = false;
    schedule(listRef.current);
  }, [schedule]);

  const latest = useMemo(() => {
    for (let i = toasts.length - 1; i >= 0; i--) {
      if (!toasts[i].exiting) return toasts[i].id;
    }
    return undefined;
  }, [toasts]);

  useEffect(() => {
    latestRef.current = latest;
    setActiveId(latest);
  }, [latest]);

  const getHandlers = useCallback((toastId: string) => {
    let cached = handlersCache.current.get(toastId);
    if (cached) return cached;

    cached = {
      enter: (e) => {
        setActiveId((prev) => (prev === toastId ? prev : toastId));
        handleMouseEnterRef.current?.(e);
      },
      leave: (e) => {
        setActiveId((prev) =>
          prev === latestRef.current ? prev : latestRef.current,
        );
        handleMouseLeaveRef.current?.(e);
      },
      dismiss: () => dismissToast(toastId),
    };

    handlersCache.current.set(toastId, cached);
    return cached;
  }, []);

  const getViewportStyle = useCallback(
    (pos: MorphicToastPosition): CSSProperties | undefined => {
      if (offset === undefined) return undefined;

      const o =
        typeof offset === "object"
          ? offset
          : { top: offset, right: offset, bottom: offset, left: offset };

      const s: CSSProperties = {};
      const px = (v: MorphicToastOffsetValue) =>
        typeof v === "number" ? `${v}px` : v;

      if (pos.startsWith("top") && o.top) s.top = px(o.top);
      if (pos.startsWith("bottom") && o.bottom) s.bottom = px(o.bottom);
      if (pos.endsWith("left") && o.left) s.left = px(o.left);
      if (pos.endsWith("right") && o.right) s.right = px(o.right);

      return s;
    },
    [offset],
  );

  const activePositions = useMemo(() => {
    const map = new Map<MorphicToastPosition, MorphicToastItem[]>();
    for (const t of toasts) {
      const pos = t.position ?? position;
      const arr = map.get(pos);
      if (arr) {
        arr.push(t);
      } else {
        map.set(pos, [t]);
      }
    }
    return map;
  }, [toasts, position]);

  return (
    <>
      <style href="xiod-ui-morphic-toast" precedence="default">
        {`
            @keyframes morphic-header-enter {
              from { opacity: 0; filter: blur(6px); }
              to { opacity: 1; filter: blur(0px); }
            }
            @keyframes morphic-header-exit {
              from { opacity: 1; filter: blur(0px); }
              to { opacity: 0; filter: blur(6px); }
            }
            [data-morphic-toast] [data-morphic-badge],
            [data-morphic-toast] [data-morphic-title] {
              --_c: var(--morphic-state-success);
            }
            [data-morphic-toast] [data-morphic-badge][data-state="loading"],
            [data-morphic-toast] [data-morphic-title][data-state="loading"] {
              --_c: var(--morphic-state-loading);
            }
            [data-morphic-toast] [data-morphic-badge][data-state="error"],
            [data-morphic-toast] [data-morphic-title][data-state="error"] {
              --_c: var(--morphic-state-error);
            }
            [data-morphic-toast] [data-morphic-badge][data-state="warning"],
            [data-morphic-toast] [data-morphic-title][data-state="warning"] {
              --_c: var(--morphic-state-warning);
            }
            [data-morphic-toast] [data-morphic-badge][data-state="info"],
            [data-morphic-toast] [data-morphic-title][data-state="info"] {
              --_c: var(--morphic-state-info);
            }
            [data-morphic-toast] [data-morphic-badge][data-state="action"],
            [data-morphic-toast] [data-morphic-title][data-state="action"] {
              --_c: var(--morphic-state-action);
            }

            [data-morphic-toast] [data-morphic-badge] {
              color: var(--_c) !important;
              background-color: color-mix(in oklch, var(--_c) 15%, transparent) !important;
            }
            [data-morphic-toast] [data-morphic-title] {
              color: var(--_c) !important;
            }

            [data-morphic-button][data-state] {
              --_c: var(--morphic-state-success);
            }
            [data-morphic-button][data-state="loading"] {
              --_c: var(--morphic-state-loading);
            }
            [data-morphic-button][data-state="error"] {
              --_c: var(--morphic-state-error);
            }
            [data-morphic-button][data-state="warning"] {
              --_c: var(--morphic-state-warning);
            }
            [data-morphic-button][data-state="info"] {
              --_c: var(--morphic-state-info);
            }
            [data-morphic-button][data-state="action"] {
              --_c: var(--morphic-state-action);
            }

            [data-morphic-toast] [data-morphic-button] {
              color: var(--_c) !important;
              background-color: color-mix(in oklch, var(--_c) 15%, transparent) !important;
            }
            [data-morphic-toast] [data-morphic-button]:hover {
              background-color: color-mix(in oklch, var(--_c) 25%, transparent) !important;
            }
            [data-morphic-toast] [data-morphic-button][data-state="action"] {
              color: #ffffff !important;
              background-color: var(--_c) !important;
            }
            [data-morphic-toast] [data-morphic-button][data-state="action"]:hover {
              background-color: color-mix(in oklch, var(--_c) 85%, #000000) !important;
            }

            [data-morphic-viewport][data-position^="top"] [data-morphic-toast]:not([data-ready="true"]) {
              margin-bottom: calc(-1 * (${HEIGHT}px + 0.75rem));
              transform: translateY(-6px) scale(0.95);
            }
            [data-morphic-viewport][data-position^="bottom"] [data-morphic-toast]:not([data-ready="true"]) {
              margin-top: calc(-1 * (${HEIGHT}px + 0.75rem));
              transform: translateY(6px) scale(0.95);
            }
            [data-morphic-viewport][data-position^="top"] [data-morphic-toast][data-ready="true"][data-exiting="true"] {
              transform: translateY(-6px) scale(0.95);
            }
            [data-morphic-viewport][data-position^="bottom"] [data-morphic-toast][data-ready="true"][data-exiting="true"] {
              transform: translateY(6px) scale(0.95);
            }
          `}
      </style>
      {children}
      {Array.from(activePositions, ([pos, items]) => {
        const pill = pillAlign(pos);
        const expand = expandDir(pos);

        return (
          <section
            key={pos}
            data-morphic-viewport
            data-slot="morphic-toaster-viewport"
            data-position={pos}
            aria-live="polite"
            className={cn(
              "fixed z-50 flex flex-col gap-3 p-3 pointer-events-none max-w-[calc(100vw-1.5rem)]",
              pos.startsWith("top")
                ? "top-0 flex-col-reverse"
                : "bottom-0 flex-col",
              pos.endsWith("left")
                ? "left-0 items-start"
                : pos.endsWith("right")
                  ? "right-0 items-end"
                  : "left-1/2 -translate-x-1/2 items-center",
              className,
            )}
            style={{ ...getViewportStyle(pos), ...style }}
            {...props}
          >
            {items.map((item) => {
              const h = getHandlers(item.id);

              return (
                <MorphicToast
                  key={item.id}
                  id={item.id}
                  state={item.state}
                  title={item.title}
                  description={item.description}
                  position={pill}
                  expand={expand}
                  icon={item.icon}
                  fill={item.fill}
                  styles={item.styles}
                  button={item.button}
                  roundness={item.roundness}
                  exiting={item.exiting}
                  autoExpandDelayMs={item.autoExpandDelayMs}
                  autoCollapseDelayMs={item.autoCollapseDelayMs}
                  refreshKey={item.instanceId}
                  canExpand={activeId === undefined || activeId === item.id}
                  onMouseEnter={h.enter}
                  onMouseLeave={h.leave}
                  onDismiss={h.dismiss}
                  className={item.className}
                />
              );
            })}
          </section>
        );
      })}
    </>
  );
}
