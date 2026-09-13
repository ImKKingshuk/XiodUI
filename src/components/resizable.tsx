"use client";

import { cn } from "cn";
import * as React from "react";
import { GripHorizontal } from "xiod-icons/icons/GripHorizontal";
import { GripVertical } from "xiod-icons/icons/GripVertical";

// --- Global Registry for Coordinating Dragging across Groups ---

interface GroupRegistryEntry {
  groupId: string;
  direction: "horizontal" | "vertical";
  element: HTMLDivElement | null;
  groupSize: number;
  panels: PanelData[];
  handles: HandleData[];
  layout: number[];
  setLayout: (nextLayout: number[]) => void;
  setActiveHandleId: (handleId: string | null) => void;
  triggerLayoutChanged: () => void;
}

const activeGroups = new Map<string, GroupRegistryEntry>();

// --- Types & Interfaces ---

export interface ImperativePanelHandle {
  collapse: () => void;
  expand: () => void;
  resize: (size: number | string) => void;
  isCollapsed: () => boolean;
  isExpanded: () => boolean;
  getSize: () => { asPercentage: number; inPixels: number };
}

export interface ImperativeGroupHandle {
  getLayout: () => number[];
  setLayout: (layout: number[]) => void;
}

export type SizeUnit = "px" | "%" | "em" | "rem" | "vh" | "vw";

interface PanelConfig {
  defaultSize?: number | string;
  minSize?: number | string;
  maxSize?: number | string;
  collapsible?: boolean;
  collapsedSize?: number | string;
  disabled?: boolean;
  groupResizeBehavior?: "preserve-relative-size" | "preserve-pixel-size";
  onResize?: (size: { asPercentage: number; inPixels: number }) => void;
  onCollapse?: () => void;
  onExpand?: () => void;
}

interface PanelData {
  id: string;
  ref: React.RefObject<HTMLDivElement | null>;
  config: PanelConfig;
  expandToSize?: number; // Pre-collapsed percentage size
}

interface HandleData {
  id: string;
  ref: React.RefObject<HTMLButtonElement | null>;
  config?: {
    disabled?: boolean;
    disableDoubleClick?: boolean;
  };
}

interface ResolvedConstraints {
  collapsedSize: number;
  minSize: number;
  maxSize: number;
  defaultSize?: number;
  collapsible: boolean;
  disabled: boolean;
}

interface ResizableGroupContextValue {
  direction: "horizontal" | "vertical";
  registerPanel: (
    id: string,
    ref: React.RefObject<HTMLDivElement | null>,
    config: PanelConfig,
  ) => () => void;
  registerHandle: (
    id: string,
    ref: React.RefObject<HTMLButtonElement | null>,
    config?: { disabled?: boolean; disableDoubleClick?: boolean },
  ) => () => void;
  startDragging: (
    handleId: string,
    event: React.PointerEvent<HTMLButtonElement>,
  ) => void;
  handleKeyDown: (
    handleId: string,
    event: React.KeyboardEvent<HTMLButtonElement>,
  ) => void;
  handleDoubleClick: (handleId: string) => void;
  activeHandleId: string | null;
  layout: number[];
  panels: PanelData[];
  handles: HandleData[];
  groupSize: number;
  resizePanel: (panelId: string, targetSize: number) => void;
}

const ResizableGroupContext =
  React.createContext<ResizableGroupContextValue | null>(null);

function useResizableGroup() {
  const context = React.useContext(ResizableGroupContext);
  if (!context) {
    throw new Error(
      "useResizableGroup must be used within a ResizablePanelGroup",
    );
  }
  return context;
}

// --- Sizing & Unit Helpers ---

function parseSizeAndUnit(
  size: number | string | undefined,
): [number, SizeUnit] {
  if (size === undefined) return [0, "%"];
  if (typeof size === "number") {
    return [size, "px"];
  }
  const numeric = parseFloat(size);
  if (Number.isNaN(numeric)) return [0, "%"];

  if (size.endsWith("%")) return [numeric, "%"];
  if (size.endsWith("px")) return [numeric, "px"];
  if (size.endsWith("rem")) return [numeric, "rem"];
  if (size.endsWith("em")) return [numeric, "em"];
  if (size.endsWith("vh")) return [numeric, "vh"];
  if (size.endsWith("vw")) return [numeric, "vw"];

  // Default string without unit is treated as percentage
  return [numeric, "%"];
}

function convertSizeToPixels(
  size: number | string | undefined,
  element: HTMLElement | null,
  groupSize: number,
): number {
  if (size === undefined) return 0;
  const [val, unit] = parseSizeAndUnit(size);

  switch (unit) {
    case "%":
      return (val / 100) * groupSize;
    case "px":
      return val;
    case "rem": {
      if (typeof window === "undefined" || !element) return val * 16;
      const style = window.getComputedStyle(
        element.ownerDocument.documentElement,
      );
      const fontSize = parseFloat(style.fontSize) || 16;
      return val * fontSize;
    }
    case "em": {
      if (typeof window === "undefined" || !element) return val * 16;
      const style = window.getComputedStyle(element);
      const fontSize = parseFloat(style.fontSize) || 16;
      return val * fontSize;
    }
    case "vh":
      if (typeof window === "undefined") return val * 800;
      return (val / 100) * window.innerHeight;
    case "vw":
      if (typeof window === "undefined") return val * 1200;
      return (val / 100) * window.innerWidth;
    default:
      return 0;
  }
}

function getResolvedConstraints(
  panel: PanelData,
  groupSizeInPixels: number,
): ResolvedConstraints {
  const element = panel.ref.current;
  const config = panel.config;

  const collapsedSizePct =
    config.collapsedSize !== undefined
      ? parseFloat(
          (
            (convertSizeToPixels(
              config.collapsedSize,
              element,
              groupSizeInPixels,
            ) /
              groupSizeInPixels) *
            100
          ).toFixed(3),
        )
      : 0;

  const minSizePct =
    config.minSize !== undefined
      ? parseFloat(
          (
            (convertSizeToPixels(config.minSize, element, groupSizeInPixels) /
              groupSizeInPixels) *
            100
          ).toFixed(3),
        )
      : 0;

  const maxSizePct =
    config.maxSize !== undefined
      ? parseFloat(
          (
            (convertSizeToPixels(config.maxSize, element, groupSizeInPixels) /
              groupSizeInPixels) *
            100
          ).toFixed(3),
        )
      : 100;

  const defaultSizePct =
    config.defaultSize !== undefined
      ? parseFloat(
          (
            (convertSizeToPixels(
              config.defaultSize,
              element,
              groupSizeInPixels,
            ) /
              groupSizeInPixels) *
            100
          ).toFixed(3),
        )
      : undefined;

  return {
    collapsedSize: collapsedSizePct,
    minSize: minSizePct,
    maxSize: maxSizePct,
    defaultSize: defaultSizePct,
    collapsible: !!config.collapsible,
    disabled: !!config.disabled,
  };
}

function validatePanelSize({
  size,
  prevSize,
  constraints,
  overrideDisabledPanels,
}: {
  size: number;
  prevSize: number;
  constraints: ResolvedConstraints;
  overrideDisabledPanels?: boolean;
}) {
  const { collapsedSize, minSize, maxSize, collapsible, disabled } =
    constraints;

  if (disabled && !overrideDisabledPanels) {
    return prevSize;
  }

  let finalSize = size;
  if (finalSize < minSize) {
    if (collapsible) {
      const halfway = (collapsedSize + minSize) / 2;
      if (finalSize < halfway) {
        finalSize = collapsedSize;
      } else {
        finalSize = minSize;
      }
    } else {
      finalSize = minSize;
    }
  }

  finalSize = Math.min(maxSize, finalSize);
  return parseFloat(finalSize.toFixed(3));
}

function validateLayoutUnderConstraints(
  layout: number[],
  groupSize: number,
  panels: PanelData[],
): number[] {
  if (groupSize <= 0 || layout.length === 0) return layout;

  const constraints = panels.map((p) => getResolvedConstraints(p, groupSize));
  const nextLayout = [...layout];

  // First pass: clamp each panel to constraints
  let remainingSize = 0;
  for (let i = 0; i < nextLayout.length; i++) {
    const prevSize = layout[i];
    const unsafeSize = nextLayout[i];
    const safeSize = validatePanelSize({
      size: unsafeSize,
      prevSize,
      constraints: constraints[i],
      overrideDisabledPanels: true,
    });

    if (Math.abs(unsafeSize - safeSize) > 0.001) {
      remainingSize += unsafeSize - safeSize;
      nextLayout[i] = safeSize;
    }
  }

  // Second pass: distribute remaining size to panels that permit it
  if (Math.abs(remainingSize) > 0.001) {
    for (let i = 0; i < nextLayout.length; i++) {
      const prevSize = nextLayout[i];
      const unsafeSize = prevSize + remainingSize;
      const safeSize = validatePanelSize({
        size: unsafeSize,
        prevSize,
        constraints: constraints[i],
        overrideDisabledPanels: true,
      });

      if (Math.abs(prevSize - safeSize) > 0.001) {
        remainingSize -= safeSize - prevSize;
        nextLayout[i] = safeSize;

        if (Math.abs(remainingSize) <= 0.001) {
          break;
        }
      }
    }
  }

  // Final normalization to ensure exact 100%
  const finalTotal = nextLayout.reduce((a, b) => a + b, 0);
  if (Math.abs(finalTotal - 100) > 0.01) {
    return nextLayout.map((val) =>
      parseFloat(((val / finalTotal) * 100).toFixed(3)),
    );
  }

  return nextLayout;
}

// --- Cascading layout adjustment engine ---

function adjustLayout({
  delta,
  layout: initialLayout,
  panels,
  handleIndex,
  groupSize,
  overrideDisabledPanels = false,
}: {
  delta: number;
  layout: number[];
  panels: PanelData[];
  handleIndex: number;
  groupSize: number;
  overrideDisabledPanels?: boolean;
}): number[] {
  if (Math.abs(delta) < 0.001) return initialLayout;

  const nextLayout = [...initialLayout];
  const totalPanels = panels.length;
  const isLeftGrowing = delta > 0;
  const absDelta = Math.abs(delta);

  const constraints = panels.map((p) => getResolvedConstraints(p, groupSize));

  // Phase 1: Distribute shrinkage outwards in the drag direction
  let deltaToShrink = absDelta;
  let shrinkDeltaApplied = 0;

  if (isLeftGrowing) {
    // Right panels shrink: traverse indices from handleIndex + 1 to totalPanels - 1
    for (let i = handleIndex + 1; i < totalPanels; i++) {
      const prevSize = nextLayout[i];
      const unsafeSize = prevSize - deltaToShrink;
      const newSize = validatePanelSize({
        size: unsafeSize,
        prevSize,
        constraints: constraints[i],
        overrideDisabledPanels,
      });

      const applied = prevSize - newSize;
      shrinkDeltaApplied += applied;
      nextLayout[i] = parseFloat(newSize.toFixed(3));
      deltaToShrink -= applied;

      if (deltaToShrink <= 0.001) break;
    }
  } else {
    // Left panels shrink: traverse indices from handleIndex down to 0
    for (let i = handleIndex; i >= 0; i--) {
      const prevSize = nextLayout[i];
      const unsafeSize = prevSize - deltaToShrink;
      const newSize = validatePanelSize({
        size: unsafeSize,
        prevSize,
        constraints: constraints[i],
        overrideDisabledPanels,
      });

      const applied = prevSize - newSize;
      shrinkDeltaApplied += applied;
      nextLayout[i] = parseFloat(newSize.toFixed(3));
      deltaToShrink -= applied;

      if (deltaToShrink <= 0.001) break;
    }
  }

  // Phase 2: Grow other side by the exact amount actually shrunk
  let deltaToGrow = shrinkDeltaApplied;

  if (isLeftGrowing) {
    // Left panels grow: traverse indices from handleIndex down to 0
    for (let i = handleIndex; i >= 0; i--) {
      const prevSize = nextLayout[i];
      const unsafeSize = prevSize + deltaToGrow;
      const newSize = validatePanelSize({
        size: unsafeSize,
        prevSize,
        constraints: constraints[i],
        overrideDisabledPanels,
      });

      const applied = newSize - prevSize;
      nextLayout[i] = parseFloat(newSize.toFixed(3));
      deltaToGrow -= applied;

      if (deltaToGrow <= 0.001) break;
    }
  } else {
    // Right panels grow: traverse indices from handleIndex + 1 to totalPanels - 1
    for (let i = handleIndex + 1; i < totalPanels; i++) {
      const prevSize = nextLayout[i];
      const unsafeSize = prevSize + deltaToGrow;
      const newSize = validatePanelSize({
        size: unsafeSize,
        prevSize,
        constraints: constraints[i],
        overrideDisabledPanels,
      });

      const applied = newSize - prevSize;
      nextLayout[i] = parseFloat(newSize.toFixed(3));
      deltaToGrow -= applied;

      if (deltaToGrow <= 0.001) break;
    }
  }

  // Normalize final array to exactly 100%
  const total = nextLayout.reduce((sum, size) => sum + size, 0);
  if (Math.abs(total - 100) > 0.01) {
    return nextLayout.map((val) =>
      parseFloat(((val / total) * 100).toFixed(3)),
    );
  }

  return nextLayout;
}

// --- Resizable Panel Group ---

export interface ResizablePanelGroupProps extends React.ComponentProps<"div"> {
  direction?: "horizontal" | "vertical";
  onLayoutChange?: (layout: number[]) => void;
  onLayoutChanged?: (layout: number[]) => void;
  defaultLayout?: (number | string)[];
  storageKey?: string;
  storage?: {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
  };
  groupRef?: React.RefObject<ImperativeGroupHandle | null>;
  disabled?: boolean;
}

function ResizablePanelGroup({
  children,
  className,
  direction = "horizontal",
  onLayoutChange,
  onLayoutChanged,
  defaultLayout,
  storageKey,
  storage,
  groupRef,
  disabled = false,
  ...props
}: ResizablePanelGroupProps): React.JSX.Element {
  const id = React.useId();
  const panelsRef = React.useRef<PanelData[]>([]);
  const handlesRef = React.useRef<HandleData[]>([]);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const [layout, setLayout] = React.useState<number[]>([]);
  const [panelsList, setPanelsList] = React.useState<PanelData[]>([]);
  const [activeHandleId, setActiveHandleId] = React.useState<string | null>(
    null,
  );
  const [groupSize, setGroupSize] = React.useState<number>(0);

  const layoutRef = React.useRef(layout);
  React.useEffect(() => {
    layoutRef.current = layout;
  }, [layout]);

  const directionRef = React.useRef(direction);
  React.useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const sortPanels = React.useCallback(() => {
    panelsRef.current.sort((a, b) => {
      const elA = a.ref.current;
      const elB = b.ref.current;
      if (!elA || !elB) return 0;
      return elA.compareDocumentPosition(elB) & Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : 1;
    });
    setPanelsList([...panelsRef.current]);
  }, []);

  const sortHandles = React.useCallback(() => {
    handlesRef.current.sort((a, b) => {
      const elA = a.ref.current;
      const elB = b.ref.current;
      if (!elA || !elB) return 0;
      return elA.compareDocumentPosition(elB) & Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : 1;
    });
  }, []);

  const registerPanel = React.useCallback(
    (
      panelId: string,
      ref: React.RefObject<HTMLDivElement | null>,
      config: PanelConfig,
    ) => {
      panelsRef.current.push({ id: panelId, ref, config });
      sortPanels();
      return () => {
        panelsRef.current = panelsRef.current.filter((p) => p.id !== panelId);
        sortPanels();
      };
    },
    [sortPanels],
  );

  const registerHandle = React.useCallback(
    (
      handleId: string,
      ref: React.RefObject<HTMLButtonElement | null>,
      config?: { disabled?: boolean; disableDoubleClick?: boolean },
    ) => {
      handlesRef.current.push({ id: handleId, ref, config });
      sortHandles();
      return () => {
        handlesRef.current = handlesRef.current.filter(
          (handle) => handle.id !== handleId,
        );
        sortHandles();
      };
    },
    [sortHandles],
  );

  // ResizeObserver for measuring available size and handling groupResizeBehavior
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === container) {
          const isHorizontal = directionRef.current === "horizontal";
          const newSize = panelsRef.current.reduce((total, panel) => {
            const el = panel.ref.current;
            if (!el) return total;
            return total + (isHorizontal ? el.offsetWidth : el.offsetHeight);
          }, 0);

          if (newSize > 0) {
            setGroupSize((prevSize) => {
              if (prevSize === newSize) return prevSize;

              setLayout((prevLayout) => {
                if (prevLayout.length === 0 || prevSize <= 0) return prevLayout;

                let fixedPanelsTotalPercent = 0;
                let flexiblePanelsTotalPrevPercent = 0;
                let hasPreservePixelSize = false;

                const fixedPercentMap = new Map<number, number>();
                const flexibleIndices: number[] = [];

                panelsRef.current.forEach((panel, i) => {
                  const prevVal = prevLayout[i] ?? 0;
                  const behavior = panel.config.groupResizeBehavior;
                  if (behavior === "preserve-pixel-size") {
                    hasPreservePixelSize = true;
                    const prevSizeInPixels = (prevVal / 100) * prevSize;
                    const nextPercent = parseFloat(
                      ((prevSizeInPixels / newSize) * 100).toFixed(3),
                    );
                    fixedPercentMap.set(i, nextPercent);
                    fixedPanelsTotalPercent += nextPercent;
                  } else {
                    flexibleIndices.push(i);
                    flexiblePanelsTotalPrevPercent += prevVal;
                  }
                });

                if (!hasPreservePixelSize || flexibleIndices.length === 0) {
                  return prevLayout;
                }

                const remainingPercent = 100 - fixedPanelsTotalPercent;
                const nextLayout = [...prevLayout];

                fixedPercentMap.forEach((pct, i) => {
                  nextLayout[i] = pct;
                });

                if (flexiblePanelsTotalPrevPercent > 0) {
                  flexibleIndices.forEach((i) => {
                    const prevVal = prevLayout[i] ?? 0;
                    nextLayout[i] = parseFloat(
                      (
                        (prevVal / flexiblePanelsTotalPrevPercent) *
                        remainingPercent
                      ).toFixed(3),
                    );
                  });
                } else {
                  const share = remainingPercent / flexibleIndices.length;
                  flexibleIndices.forEach((i) => {
                    nextLayout[i] = parseFloat(share.toFixed(3));
                  });
                }

                return validateLayoutUnderConstraints(
                  nextLayout,
                  newSize,
                  panelsRef.current,
                );
              });

              return newSize;
            });
          }
        }
      }
    });

    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, []);

  // Initialize layout based on defaults
  React.useEffect(() => {
    if (panelsList.length === 0) return;

    setLayout((prev) => {
      if (prev.length === panelsList.length) {
        return prev;
      }

      const newLayout = Array.from<number>({ length: panelsList.length }).fill(
        0,
      );
      let totalSpecified = 0;
      let unspecifiedCount = 0;

      panelsList.forEach((panel, i) => {
        const def = defaultLayout?.[i] ?? panel.config.defaultSize;
        if (def !== undefined) {
          const [val, unit] = parseSizeAndUnit(def);
          let pct = val;
          if (unit !== "%") {
            if (groupSize > 0) {
              const pixels = convertSizeToPixels(
                def,
                panel.ref.current,
                groupSize,
              );
              pct = (pixels / groupSize) * 100;
            } else {
              pct = unit === "px" ? 0 : val;
            }
          }
          newLayout[i] = parseFloat(pct.toFixed(3));
          totalSpecified += pct;
        } else {
          unspecifiedCount++;
        }
      });

      if (unspecifiedCount > 0) {
        const remaining = Math.max(0, 100 - totalSpecified);
        const share = remaining / unspecifiedCount;
        panelsList.forEach((panel, i) => {
          if (
            defaultLayout?.[i] === undefined &&
            panel.config.defaultSize === undefined
          ) {
            newLayout[i] = parseFloat(share.toFixed(3));
          }
        });
      } else if (Math.abs(totalSpecified - 100) > 0.05 && totalSpecified > 0) {
        panelsList.forEach((_, i) => {
          newLayout[i] = parseFloat(
            ((newLayout[i] / totalSpecified) * 100).toFixed(3),
          );
        });
      }

      return validateLayoutUnderConstraints(newLayout, groupSize, panelsList);
    });
  }, [panelsList, groupSize, defaultLayout]);

  const onLayoutChangedRef = React.useRef(onLayoutChanged);
  React.useEffect(() => {
    onLayoutChangedRef.current = onLayoutChanged;
  }, [onLayoutChanged]);

  const triggerLayoutChanged = React.useCallback(() => {
    onLayoutChangedRef.current?.(layoutRef.current);
  }, []);

  // Load layout from storage on mount (hydration safe)
  React.useEffect(() => {
    if (!storageKey || panelsList.length === 0) return;
    try {
      const panelIdsSuffix = panelsRef.current.map((p) => p.id).join(":");
      const finalKey = `${storageKey}:${panelIdsSuffix}`;
      const storageProvider = storage || window.localStorage;
      const saved = storageProvider.getItem(finalKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.length === panelsRef.current.length
        ) {
          const validated = validateLayoutUnderConstraints(
            parsed,
            groupSize,
            panelsList,
          );
          setLayout(validated);
        }
      }
    } catch (e) {
      console.warn("Resizable: Failed to load layout from storage", e);
    }
  }, [storageKey, storage, panelsList, groupSize]);

  // Safe layout changes triggering of callback and storage updates (post-commit useEffect)
  const prevLayoutStringRef = React.useRef("");
  React.useEffect(() => {
    if (layout.length === 0) return;
    const layoutStr = JSON.stringify(layout);
    if (prevLayoutStringRef.current !== layoutStr) {
      prevLayoutStringRef.current = layoutStr;

      // Trigger callback
      onLayoutChange?.(layout);

      // Persist layout
      if (storageKey && panelsRef.current.length > 0) {
        try {
          const panelIdsSuffix = panelsRef.current.map((p) => p.id).join(":");
          const finalKey = `${storageKey}:${panelIdsSuffix}`;
          const storageProvider = storage || window.localStorage;
          storageProvider.setItem(finalKey, layoutStr);
        } catch (e) {
          console.warn("Resizable: Failed to save layout to storage", e);
        }
      }
    }
  }, [layout, onLayoutChange, storageKey, storage]);

  // Safe collapse/expand change triggers (post-commit useEffect)
  const prevCollapsedRef = React.useRef<Record<string, boolean>>({});
  React.useEffect(() => {
    if (
      layout.length === 0 ||
      panelsList.length !== layout.length ||
      groupSize === 0
    )
      return;

    const nextCollapsed: Record<string, boolean> = {};
    panelsList.forEach((panel, i) => {
      const size = layout[i];
      if (size === undefined) return;
      const pc = getResolvedConstraints(panel, groupSize);
      const isCollapsed =
        pc.collapsible && Math.abs(size - pc.collapsedSize) < 0.01;
      nextCollapsed[panel.id] = isCollapsed;

      const wasCollapsed = prevCollapsedRef.current[panel.id];
      if (wasCollapsed !== undefined && wasCollapsed !== isCollapsed) {
        if (isCollapsed) {
          panel.config.onCollapse?.();
        } else {
          panel.config.onExpand?.();
        }
      }
    });

    prevCollapsedRef.current = nextCollapsed;
  }, [layout, panelsList, groupSize]);

  // Register in global activeGroups registry
  React.useEffect(() => {
    activeGroups.set(id, {
      groupId: id,
      direction,
      element: containerRef.current,
      groupSize,
      panels: panelsRef.current,
      handles: handlesRef.current,
      layout,
      setLayout: (nextLayout) => {
        setLayout(nextLayout);
      },
      setActiveHandleId,
      triggerLayoutChanged,
    });
    return () => {
      activeGroups.delete(id);
    };
  }, [id, direction, groupSize, layout, triggerLayoutChanged]);

  // Expose programmatic group methods
  React.useImperativeHandle(groupRef, () => ({
    getLayout: () => layoutRef.current,
    setLayout: (newLayout: number[]) => {
      if (newLayout.length !== panelsRef.current.length) return;
      const validated = validateLayoutUnderConstraints(
        newLayout,
        groupSize,
        panelsRef.current,
      );
      setLayout(validated);
    },
  }));

  const startDragging = React.useCallback(
    (handleId: string, event: React.PointerEvent<HTMLButtonElement>) => {
      if (disabled) return;
      event.preventDefault();

      const container = containerRef.current;
      if (!container || groupSize === 0) return;

      const startX = event.clientX;
      const startY = event.clientY;

      // Find all matching handles across all groups that intersect the drag start point
      const activeDragHandles: {
        groupId: string;
        handleId: string;
        handleIndex: number;
        direction: "horizontal" | "vertical";
        initialLayout: number[];
        groupSize: number;
        handleEl: HTMLButtonElement;
      }[] = [];

      activeGroups.forEach((group) => {
        group.handles.forEach((h) => {
          const handleEl = h.ref.current;
          if (!handleEl || h.config?.disabled) return;

          const rect = handleEl.getBoundingClientRect();
          const threshold = 12; // pixels

          // Expand bounding box by threshold in all directions for hit-testing intersections
          const isNear =
            startX >= rect.left - threshold &&
            startX <= rect.right + threshold &&
            startY >= rect.top - threshold &&
            startY <= rect.bottom + threshold;

          if (isNear) {
            const handleIndex = group.handles.findIndex(
              (item) => item.id === h.id,
            );
            if (handleIndex !== -1 && handleIndex < group.panels.length - 1) {
              activeDragHandles.push({
                groupId: group.groupId,
                handleId: h.id,
                handleIndex,
                direction: group.direction,
                initialLayout: [...group.layout],
                groupSize: group.groupSize,
                handleEl,
              });
            }
          }
        });
      });

      if (activeDragHandles.length === 0) return;

      // Set active handle ID for each matched group to activate dragging visual state
      activeDragHandles.forEach((adh) => {
        const group = activeGroups.get(adh.groupId);
        if (group) {
          group.setActiveHandleId(adh.handleId);
        }
      });

      const hasHorizontal = activeDragHandles.some(
        (h) => h.direction === "horizontal",
      );
      const hasVertical = activeDragHandles.some(
        (h) => h.direction === "vertical",
      );

      let cursorStyle = "col-resize";
      if (hasHorizontal && hasVertical) {
        cursorStyle = "move";
      } else if (hasVertical) {
        cursorStyle = "row-resize";
      }

      // Lock cursor globally and prevent text selection
      const style = document.createElement("style");
      style.id = `resizable-style-${handleId}`;
      style.innerHTML = `* { cursor: ${cursorStyle} !important; user-select: none !important; }`;
      document.head.appendChild(style);

      const handlePointerMove = (moveEvent: PointerEvent) => {
        // Set pointer capture on the primary clicked handle element (only one can capture at a time)
        const clickedAdh = activeDragHandles.find(
          (adh) => adh.handleId === handleId,
        );
        if (
          clickedAdh?.handleEl &&
          !clickedAdh.handleEl.hasPointerCapture(moveEvent.pointerId)
        ) {
          clickedAdh.handleEl.setPointerCapture(moveEvent.pointerId);
        }

        activeDragHandles.forEach((adh) => {
          const {
            direction: activeDirection,
            initialLayout,
            handleIndex,
            groupSize: activeGroupSize,
            groupId,
          } = adh;
          const group = activeGroups.get(groupId);
          if (!group || activeGroupSize === 0) return;

          const currentPos =
            activeDirection === "horizontal"
              ? moveEvent.clientX
              : moveEvent.clientY;
          const startPos = activeDirection === "horizontal" ? startX : startY;
          const deltaPx = currentPos - startPos;
          const deltaPercent = (deltaPx / activeGroupSize) * 100;

          const next = adjustLayout({
            delta: deltaPercent,
            layout: initialLayout,
            panels: group.panels,
            handleIndex,
            groupSize: activeGroupSize,
            overrideDisabledPanels: false,
          });

          group.setLayout(next);
        });
      };

      const handlePointerUp = () => {
        // Reset active handle ID for all matched groups
        activeDragHandles.forEach((adh) => {
          const group = activeGroups.get(adh.groupId);
          if (group) {
            group.setActiveHandleId(null);
            group.triggerLayoutChanged();
          }
        });

        const styleElement = document.getElementById(
          `resizable-style-${handleId}`,
        );
        styleElement?.remove();
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    },
    [disabled, groupSize],
  );

  const handleKeyDown = React.useCallback(
    (handleId: string, event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled || groupSize <= 0) return;
      const handleIndex = handlesRef.current.findIndex(
        (h) => h.id === handleId,
      );
      if (handleIndex === -1 || handleIndex >= panelsRef.current.length - 1)
        return;

      const handleData = handlesRef.current[handleIndex];
      if (handleData.config?.disabled) return;

      const isHorizontal = directionRef.current === "horizontal";
      const currentLayout = [...layoutRef.current];
      const panelA = panelsRef.current[handleIndex];
      const panelB = panelsRef.current[handleIndex + 1];

      let deltaPercent = 0;
      const step = event.shiftKey ? 10 : 5;

      switch (event.key) {
        case "ArrowLeft":
          if (isHorizontal) deltaPercent = -step;
          break;
        case "ArrowUp":
          if (!isHorizontal) deltaPercent = -step;
          break;
        case "ArrowRight":
          if (isHorizontal) deltaPercent = step;
          break;
        case "ArrowDown":
          if (!isHorizontal) deltaPercent = step;
          break;
        case "Home": {
          const pc = getResolvedConstraints(panelA, groupSize);
          deltaPercent =
            -currentLayout[handleIndex] +
            (pc.collapsible ? pc.collapsedSize : pc.minSize);
          break;
        }
        case "End": {
          const pc = getResolvedConstraints(panelB, groupSize);
          deltaPercent =
            currentLayout[handleIndex + 1] -
            (pc.collapsible ? pc.collapsedSize : pc.minSize);
          break;
        }
        case "Enter": {
          event.preventDefault();
          const pc = getResolvedConstraints(panelA, groupSize);
          if (pc.collapsible) {
            const sizeA = currentLayout[handleIndex];
            const isCollapsed = Math.abs(sizeA - pc.collapsedSize) < 0.01;

            let targetSize = sizeA;
            if (isCollapsed) {
              targetSize = panelA.expandToSize ?? pc.minSize;
              if (targetSize === pc.collapsedSize) {
                targetSize =
                  pc.minSize > pc.collapsedSize
                    ? pc.minSize
                    : pc.collapsedSize + 1;
              }
            } else {
              panelA.expandToSize = sizeA;
              targetSize = pc.collapsedSize;
            }

            deltaPercent = targetSize - sizeA;
          }
          break;
        }
        case "F6": {
          event.preventDefault();
          const separatorElements = handlesRef.current
            .map((h) => h.ref.current)
            .filter(Boolean) as HTMLButtonElement[];
          const currentIndex = separatorElements.indexOf(event.currentTarget);
          if (currentIndex !== -1) {
            const nextIndex = event.shiftKey
              ? currentIndex > 0
                ? currentIndex - 1
                : separatorElements.length - 1
              : currentIndex + 1 < separatorElements.length
                ? currentIndex + 1
                : 0;
            separatorElements[nextIndex]?.focus({ preventScroll: true });
          }
          return;
        }
        default:
          return;
      }

      event.preventDefault();
      if (Math.abs(deltaPercent) < 0.001) return;

      const next = adjustLayout({
        delta: deltaPercent,
        layout: currentLayout,
        panels: panelsRef.current,
        handleIndex,
        groupSize,
        overrideDisabledPanels: false,
      });

      setLayout(next);
      onLayoutChanged?.(next);
    },
    [groupSize, disabled, onLayoutChanged],
  );

  const handleDoubleClick = React.useCallback(
    (handleId: string) => {
      if (disabled) return;
      const handleIndex = handlesRef.current.findIndex(
        (h) => h.id === handleId,
      );
      if (handleIndex === -1 || handleIndex >= panelsRef.current.length - 1)
        return;

      const handle = handlesRef.current[handleIndex];
      if (handle?.config?.disabled || handle?.config?.disableDoubleClick)
        return;

      const currentLayout = [...layoutRef.current];
      const panelA = panelsRef.current[handleIndex];
      const sizeA = currentLayout[handleIndex];

      const pc = getResolvedConstraints(panelA, groupSize);
      if (!pc.collapsible) return;

      const isCollapsed = Math.abs(sizeA - pc.collapsedSize) < 0.01;
      let targetSize = sizeA;
      if (isCollapsed) {
        targetSize = panelA.expandToSize ?? pc.minSize;
        if (targetSize === pc.collapsedSize) {
          targetSize =
            pc.minSize > pc.collapsedSize ? pc.minSize : pc.collapsedSize + 1;
        }
      } else {
        panelA.expandToSize = sizeA;
        targetSize = pc.collapsedSize;
      }

      if (Math.abs(targetSize - sizeA) > 0.01) {
        const delta = targetSize - sizeA;
        const next = adjustLayout({
          delta,
          layout: currentLayout,
          panels: panelsRef.current,
          handleIndex,
          groupSize,
          overrideDisabledPanels: false,
        });

        setLayout(next);
        onLayoutChanged?.(next);
      }
    },
    [groupSize, disabled, onLayoutChanged],
  );

  const resizePanel = React.useCallback(
    (panelId: string, targetSize: number) => {
      const panelIndex = panelsRef.current.findIndex((p) => p.id === panelId);
      if (panelIndex === -1 || groupSize === 0) return;

      const prev = layoutRef.current;
      const currentSize = prev[panelIndex];
      if (currentSize === undefined) return;

      const delta = targetSize - currentSize;
      if (Math.abs(delta) < 0.001) return;

      const handleIndex =
        panelIndex === prev.length - 1 ? panelIndex - 1 : panelIndex;
      const adjustedDelta = panelIndex === handleIndex ? delta : -delta;

      const next = adjustLayout({
        delta: adjustedDelta,
        layout: prev,
        panels: panelsRef.current,
        handleIndex,
        groupSize,
        overrideDisabledPanels: true, // Imperative API overrides panel disabled state
      });

      if (JSON.stringify(prev) !== JSON.stringify(next)) {
        setLayout(next);
      }
    },
    [groupSize],
  );

  const contextValue = React.useMemo(
    () => ({
      direction,
      registerPanel,
      registerHandle,
      startDragging,
      handleKeyDown,
      handleDoubleClick,
      activeHandleId,
      layout,
      panels: panelsList,
      handles: handlesRef.current,
      groupSize,
      resizePanel,
    }),
    [
      direction,
      registerPanel,
      registerHandle,
      startDragging,
      handleKeyDown,
      handleDoubleClick,
      activeHandleId,
      layout,
      panelsList,
      groupSize,
      resizePanel,
    ],
  );

  return (
    <ResizableGroupContext.Provider value={contextValue}>
      <div
        ref={(node) => {
          containerRef.current = node;
        }}
        className={cn(
          "flex size-full data-[panel-group-direction=vertical]:flex-col",
          className,
        )}
        data-panel-group
        data-panel-group-direction={direction}
        data-slot="resizable-group"
        style={{
          touchAction: direction === "horizontal" ? "pan-y" : "pan-x",
        }}
        {...props}
      >
        {children}
      </div>
    </ResizableGroupContext.Provider>
  );
}

// --- Resizable Panel ---

export interface ResizablePanelProps extends React.ComponentProps<"div"> {
  id?: string;
  defaultSize?: number | string;
  minSize?: number | string;
  maxSize?: number | string;
  collapsible?: boolean;
  collapsedSize?: number | string;
  disabled?: boolean;
  groupResizeBehavior?: "preserve-relative-size" | "preserve-pixel-size";
  onResize?: (size: { asPercentage: number; inPixels: number }) => void;
  onCollapse?: () => void;
  onExpand?: () => void;
  panelRef?: React.RefObject<ImperativePanelHandle | null>;
}

function ResizablePanel({
  id: idProp,
  children,
  className,
  defaultSize,
  minSize = "0%",
  maxSize = "100%",
  collapsible = false,
  collapsedSize = "0%",
  disabled = false,
  groupResizeBehavior = "preserve-relative-size",
  onResize,
  onCollapse,
  onExpand,
  panelRef,
  style,
  ...props
}: ResizablePanelProps): React.JSX.Element {
  const reactId = React.useId();
  const id = idProp || reactId;
  const ref = React.useRef<HTMLDivElement | null>(null);
  const { registerPanel, layout, panels, resizePanel, groupSize, direction } =
    useResizableGroup();

  const expandToSizeRef = React.useRef<number | undefined>(undefined);

  React.useEffect(() => {
    return registerPanel(id, ref, {
      defaultSize,
      minSize,
      maxSize,
      collapsible,
      collapsedSize,
      disabled,
      groupResizeBehavior,
      onResize,
      onCollapse,
      onExpand,
    });
  }, [
    id,
    registerPanel,
    defaultSize,
    minSize,
    maxSize,
    collapsible,
    collapsedSize,
    disabled,
    groupResizeBehavior,
    onResize,
    onCollapse,
    onExpand,
  ]);

  const index = panels.findIndex((p) => p.id === id);
  const size = index !== -1 ? layout[index] : undefined;

  // Resolve constraints in percentage for collapsed checking
  const pc =
    index !== -1 && groupSize > 0
      ? getResolvedConstraints(panels[index], groupSize)
      : {
          collapsedSize: 0,
          minSize: 0,
          maxSize: 100,
          collapsible: false,
          disabled: false,
        };

  const isCollapsed =
    size !== undefined &&
    pc.collapsible &&
    Math.abs(size - pc.collapsedSize) < 0.01;

  // Trigger size change callbacks
  const prevSizeRef = React.useRef<
    { asPercentage: number; inPixels: number } | undefined
  >(undefined);
  React.useEffect(() => {
    if (size === undefined) return;
    const currentPixels = ref.current
      ? direction === "horizontal"
        ? ref.current.offsetWidth
        : ref.current.offsetHeight
      : 0;

    const currentSizeObj = {
      asPercentage: size,
      inPixels: currentPixels,
    };

    if (
      !prevSizeRef.current ||
      Math.abs(prevSizeRef.current.asPercentage - currentSizeObj.asPercentage) >
        0.01 ||
      Math.abs(prevSizeRef.current.inPixels - currentSizeObj.inPixels) > 1
    ) {
      onResize?.(currentSizeObj);
      prevSizeRef.current = currentSizeObj;
    }
  }, [size, direction, onResize]);

  // Track pre-collapse size history inside panels list to support Enter/Ref toggle
  React.useEffect(() => {
    if (index !== -1 && size !== undefined) {
      const activePanel = panels[index];
      if (activePanel) {
        if (!isCollapsed) {
          activePanel.expandToSize = size;
          expandToSizeRef.current = size;
        } else {
          activePanel.expandToSize = expandToSizeRef.current;
        }
      }
    }
  }, [size, isCollapsed, index, panels]);

  // Expose panel ref methods
  React.useImperativeHandle(panelRef, () => ({
    collapse: () => {
      const idx = panels.findIndex((p) => p.id === id);
      if (idx === -1) return;
      const constraints = getResolvedConstraints(panels[idx], groupSize);
      if (constraints.collapsible && size !== constraints.collapsedSize) {
        expandToSizeRef.current = size;
        panels[idx].expandToSize = size;
        resizePanel(id, constraints.collapsedSize);
      }
    },
    expand: () => {
      const idx = panels.findIndex((p) => p.id === id);
      if (idx === -1) return;
      const constraints = getResolvedConstraints(panels[idx], groupSize);
      const panelIsCollapsed = size === constraints.collapsedSize;
      if (constraints.collapsible && panelIsCollapsed) {
        let target = expandToSizeRef.current ?? constraints.minSize;
        if (target === constraints.collapsedSize) {
          target =
            constraints.minSize > constraints.collapsedSize
              ? constraints.minSize
              : constraints.collapsedSize + 1;
        }
        resizePanel(id, target);
      }
    },
    resize: (newSize: number | string) => {
      const pixels = convertSizeToPixels(newSize, ref.current, groupSize);
      const pct = parseFloat(((pixels / groupSize) * 100).toFixed(3));
      resizePanel(id, pct);
    },
    isCollapsed: () => {
      const idx = panels.findIndex((p) => p.id === id);
      if (idx === -1) return false;
      const constraints = getResolvedConstraints(panels[idx], groupSize);
      return (
        constraints.collapsible &&
        Math.abs((size ?? 0) - constraints.collapsedSize) < 0.01
      );
    },
    isExpanded: () => {
      const idx = panels.findIndex((p) => p.id === id);
      if (idx === -1) return true;
      const constraints = getResolvedConstraints(panels[idx], groupSize);
      return (
        !constraints.collapsible ||
        Math.abs((size ?? 0) - constraints.collapsedSize) >= 0.01
      );
    },
    getSize: () => {
      return {
        asPercentage: size ?? 0,
        inPixels: ref.current
          ? direction === "horizontal"
            ? ref.current.offsetWidth
            : ref.current.offsetHeight
          : 0,
      };
    },
  }));

  const flexStyle =
    size !== undefined
      ? {
          flexGrow: size,
          flexShrink: 1,
          flexBasis: "0px",
        }
      : {
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: "0px",
        };

  const outerStyle = {
    ...flexStyle,
    display: "flex",
    flexBasis: "0px",
    flexShrink: 1,
    overflow: "hidden",
    minHeight: 0,
    minWidth: 0,
  };

  const innerStyle = {
    maxHeight: "100%",
    maxWidth: "100%",
    flexGrow: 1,
    overflow: "auto",
    touchAction: direction === "horizontal" ? "pan-y" : "pan-x",
    ...style,
  };

  return (
    <div
      ref={(node) => {
        ref.current = node;
      }}
      style={outerStyle}
      data-panel
      data-disabled={disabled || undefined}
      data-state={isCollapsed ? "collapsed" : "expanded"}
      data-slot="resizable-panel-outer"
      {...props}
    >
      <div
        className={cn(
          "size-full select-none relative",
          isCollapsed && "pointer-events-none",
          className,
        )}
        style={innerStyle}
        data-slot="resizable-panel"
      >
        {children}
      </div>
    </div>
  );
}

// --- Resizable Handle ---

export interface ResizableHandleProps extends React.ComponentProps<"button"> {
  withHandle?: boolean;
  disabled?: boolean;
  disableDoubleClick?: boolean;
}

function ResizableHandle({
  className,
  style,
  withHandle = false,
  disabled = false,
  disableDoubleClick = false,
  ...props
}: ResizableHandleProps): React.JSX.Element {
  const id = React.useId();
  const ref = React.useRef<HTMLButtonElement | null>(null);
  const {
    direction,
    registerHandle,
    startDragging,
    handleKeyDown,
    handleDoubleClick,
    activeHandleId,
    layout,
    panels,
    handles,
    groupSize,
  } = useResizableGroup();

  const [isFocused, setIsFocused] = React.useState(false);

  React.useEffect(() => {
    return registerHandle(id, ref, { disabled, disableDoubleClick });
  }, [id, registerHandle, disabled, disableDoubleClick]);

  const isHorizontal = direction === "horizontal";
  const isDragging = activeHandleId === id;

  const handleClasses = cn(
    "relative flex items-center justify-center transition-colors select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 z-10 bg-border",
    isHorizontal
      ? "w-px h-full cursor-col-resize before:absolute before:inset-y-0 before:inset-x-0 before:bg-gradient-to-b before:from-transparent before:via-ring/80 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 data-[state=dragging]:before:opacity-100 after:absolute after:-inset-x-2 after:inset-y-0 pointer-coarse:after:-inset-x-5"
      : "h-px w-full cursor-row-resize before:absolute before:inset-x-0 before:inset-y-0 before:bg-gradient-to-r before:from-transparent before:via-ring/80 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 data-[state=dragging]:before:opacity-100 after:absolute after:-inset-y-2 after:inset-x-0 pointer-coarse:after:-inset-y-5",
    isDragging && "before:opacity-100",
    disabled && "pointer-events-none opacity-64",
    className,
  );

  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (disabled) return;
      startDragging(id, event);
    },
    [id, disabled, startDragging],
  );

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      handleKeyDown(id, event);
    },
    [id, disabled, handleKeyDown],
  );

  const onDoubleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      event.preventDefault();
      handleDoubleClick(id);
    },
    [id, disabled, handleDoubleClick],
  );

  // ARIA Attributes calculations
  const handleIndex = handles.findIndex((h) => h.id === id);
  let ariaValueNow: number | undefined;
  let ariaValueMin: number | undefined;
  let ariaValueMax: number | undefined;
  let controlledPanelId: string | undefined;

  if (
    handleIndex !== -1 &&
    handleIndex < panels.length - 1 &&
    layout.length > handleIndex &&
    groupSize > 0
  ) {
    const primaryPanel = panels[handleIndex];
    controlledPanelId = primaryPanel.id;
    ariaValueNow = Math.round(layout[handleIndex]);

    const minLayout = adjustLayout({
      delta: -100,
      layout,
      panels,
      handleIndex,
      groupSize,
      overrideDisabledPanels: false,
    });
    ariaValueMin = Math.round(minLayout[handleIndex]);

    const maxLayout = adjustLayout({
      delta: 100,
      layout,
      panels,
      handleIndex,
      groupSize,
      overrideDisabledPanels: false,
    });
    ariaValueMax = Math.round(maxLayout[handleIndex]);
  }

  // data-separator state support
  let dataSeparator = "idle";
  if (disabled) {
    dataSeparator = "disabled";
  } else if (isDragging) {
    dataSeparator = "active";
  } else if (isFocused) {
    dataSeparator = "focus";
  }

  return (
    <button
      ref={(node) => {
        ref.current = node;
      }}
      type="button"
      className={handleClasses}
      onPointerDown={handlePointerDown}
      onKeyDown={onKeyDown}
      onDoubleClick={onDoubleClick}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      role="separator"
      tabIndex={disabled ? -1 : 0}
      aria-orientation={isHorizontal ? "vertical" : "horizontal"}
      aria-valuenow={ariaValueNow}
      aria-valuemin={ariaValueMin}
      aria-valuemax={ariaValueMax}
      aria-controls={controlledPanelId}
      aria-disabled={disabled || undefined}
      data-separator={dataSeparator}
      data-slot="resizable-handle"
      data-state={isDragging ? "dragging" : "idle"}
      style={{
        touchAction: "none",
        ...style,
      }}
      {...props}
    >
      {withHandle && (
        <div
          className={cn(
            "absolute rounded-md bg-background border shadow-xs/5 flex items-center justify-center pointer-events-none z-20 hover:scale-105 transition-transform [&_svg:not([class*='size-'])]:size-2 [&_svg]:pointer-events-none [&_svg]:shrink-0",
            isHorizontal
              ? "h-6 w-3.5 left-1/2 -translate-x-1/2"
              : "h-3.5 w-6 top-1/2 -translate-y-1/2",
          )}
        >
          {isHorizontal ? (
            <GripVertical className="size-2 text-muted-foreground/64" />
          ) : (
            <GripHorizontal className="size-2 text-muted-foreground/64" />
          )}
        </div>
      )}
    </button>
  );
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
