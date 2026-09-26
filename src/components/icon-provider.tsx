"use client";

import * as React from "react";

/**
 * Every icon a XiodUI component renders. Replace one for the whole app with
 * `IconProvider`, or for a single instance with that part's icon prop.
 */
export type IconName =
  | "Alert"
  | "AlertCircle"
  | "ArrowExpandDiagonalUpRight"
  | "ArrowRight"
  | "ArrowShrinkDiagonalUpRight"
  | "Calendar"
  | "Cancel"
  | "Check"
  | "CheckmarkCircle"
  | "ChevronDown"
  | "ChevronFirst"
  | "ChevronLast"
  | "ChevronLeft"
  | "ChevronRight"
  | "ChevronUp"
  | "Copy"
  | "CreditCard"
  | "Delete"
  | "Dropper"
  | "Eye"
  | "EyeOff"
  | "File"
  | "FileArchive"
  | "FileAudio"
  | "FileCode"
  | "FileEmpty"
  | "FileImage"
  | "FileVideo"
  | "GripHorizontal"
  | "GripVertical"
  | "InformationCircle"
  | "LoadingSpinner"
  | "MinusSign"
  | "MoreHorizontal"
  | "Pencil"
  | "PlusSign"
  | "Search"
  | "SecurityCheck"
  | "Terminal"
  | "UnfoldMore"
  | "ViewSidebarLeft"
  | "Zap";

/**
 * The shape a replacement icon must have: a component taking SVG props,
 * including `className`. Components from any icon library qualify, as does a
 * function returning an inline `<svg>`.
 */
export type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export type IconOverrides = Partial<Record<IconName, IconComponent>>;

const IconContext = React.createContext<IconOverrides | null>(null);

export interface IconProviderProps {
  /**
   * Icons to use in place of the built-in ones, keyed by `IconName`. Any name
   * left out keeps its default, so pass only what you want to change.
   */
  icons: IconOverrides;
  children?: React.ReactNode;
}

/**
 * Replaces XiodUI's default icons for everything rendered inside it.
 *
 * ```tsx
 * import { IconProvider } from "xiod-ui/icon-provider";
 * import { X, Check } from "your-icon-library";
 *
 * <IconProvider icons={{ Cancel: X, Check }}>
 *   <App />
 * </IconProvider>
 * ```
 *
 * Providers nest: an inner one is merged over the outer one, so a section of
 * the app can override a single icon without restating the rest.
 */
export function IconProvider({
  icons,
  children,
}: IconProviderProps): React.ReactElement {
  const inherited = React.useContext(IconContext);

  const merged = React.useMemo(
    () => (inherited ? { ...inherited, ...icons } : icons),
    [inherited, icons],
  );

  return <IconContext.Provider value={merged}>{children}</IconContext.Provider>;
}

/**
 * Returns the icons in effect at this point in the tree, or `null` when no
 * `IconProvider` wraps it. Use `useIcon` to resolve a single icon.
 */
export function useIconOverrides(): IconOverrides | null {
  return React.useContext(IconContext);
}

/**
 * Returns the icon to render for `name` — the one an `IconProvider` supplies,
 * or `fallback` when none does. Use this to give a custom component the same
 * icon overrides the library's own components respect.
 */
export function useIcon(
  name: IconName,
  fallback: IconComponent,
): IconComponent {
  return React.useContext(IconContext)?.[name] ?? fallback;
}

export interface IconSlotProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Replaces this icon. Accepts any node — an element from another icon
   * library, a raw `<svg>`, or `null` to render nothing. Takes precedence over
   * `IconProvider`.
   */
  icon?: React.ReactNode;
  /** Which icon this is. `IconProvider` matches its keys against this. */
  name: IconName;
  /** The icon to render when nothing replaces it. */
  fallback: IconComponent;
}

/**
 * Renders one icon, honouring both ways of replacing it: the `icon` prop first,
 * then an `IconProvider`, then `fallback`.
 *
 * Prefer `IconProvider` or a component's icon prop. Reach for `IconSlot`
 * directly only when building a component of your own that should pick up the
 * same overrides.
 *
 * A node passed as `icon` renders exactly as given, so give it its own size
 * classes. A component resolved from the provider or from `fallback` receives
 * the remaining props, sizing included.
 */
export function IconSlot({
  icon,
  name,
  fallback,
  ...props
}: IconSlotProps): React.ReactNode {
  const resolved = useIcon(name, fallback);

  // `undefined` means "nothing was passed"; `null` means "render no icon".
  if (icon !== undefined) return icon;

  // `createElement` rather than JSX: the component comes from context, and a
  // capitalised local would read to the linter as one declared during render.
  return React.createElement(resolved, props);
}
