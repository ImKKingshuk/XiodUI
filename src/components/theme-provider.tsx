"use client";

import * as React from "react";

export type ThemeMode = "light" | "dark" | "system";

export type ResolvedTheme = "light" | "dark";

export interface ThemeContextValue {
  /** The selected mode, which may be `"system"`. */
  theme: ThemeMode;
  /** The mode actually applied to the document — never `"system"`. */
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
  /**
   * The active palette, or `undefined` when none is set and the base tokens
   * from `xiod-ui/styles` apply.
   */
  palette: string | undefined;
  /** Pass `undefined` to clear the palette and fall back to the base tokens. */
  setPalette: (palette: string | undefined) => void;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  /** Mode to use before anything is read from storage. */
  defaultTheme?: ThemeMode;
  /** Follow `prefers-color-scheme` when the mode is `"system"`. */
  enableSystemTheme?: boolean;
  /**
   * How the theme is written to `<html>`. `"class"` toggles the `light`/`dark`
   * classes, which is what XiodUI's `dark` variant keys off. Any other value is
   * set as an attribute (e.g. `"data-theme"`).
   */
  attribute?: string;
  /** localStorage key used to remember the choice. */
  storageKey?: string;
  /**
   * Palette to apply before anything is read from storage. Leave unset to ship
   * a single palette the CSS way — `@import "xiod-ui/themes/<name>"` overrides
   * the base tokens directly and needs no attribute on `<html>` at all. This
   * prop is for apps that let their own users switch palettes at runtime, which
   * requires the scoped stylesheets (`xiod-ui/themes/<name>/scoped`).
   */
  defaultPalette?: string;
  /**
   * Attribute used to write the palette. Must differ from `attribute`, or the
   * two axes overwrite each other on the same element.
   */
  paletteAttribute?: string;
  /** localStorage key used to remember the palette. */
  paletteStorageKey?: string;
  /**
   * Nonce for the inline script that applies the stored theme before the page
   * paints. Only needed when a Content Security Policy blocks inline scripts
   * without one.
   */
  nonce?: string;
}

/*
 * How the theme reaches the page before React has hydrated
 * ─────────────────────────────────────────────────────────
 * React compares `<html>` with the server's HTML when it hydrates, and reports
 * any class or attribute added to it before then as a mismatch. So until
 * hydration the theme lives on a marker instead: a `<style>` element, first
 * child of `<body>`, whose classes name the mode and palette. React skips
 * elements it didn't render at that level and keeps `<style>` elements even
 * when it re-renders the whole document. `xiod-ui/styles` and the palette
 * stylesheets read it with `body:has(> .xiod-dark)`, a form browsers can check
 * without restyling the page when unrelated parts of it change.
 *
 * Once hydrated, the provider writes the theme to `<html>` and removes the
 * marker, when the browser is idle: the page already looks right, and the swap
 * restyles it once.
 */
const MARKER_ID = "xiod-theme";

function markerClassName(
  resolvedTheme: ResolvedTheme,
  palette: string | undefined,
): string {
  return `xiod-${resolvedTheme}${palette ? ` xiod-palette-${palette}` : ""}`;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined,
);

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

const DARK_QUERY = "(prefers-color-scheme: dark)";

function isThemeMode(theme: string | null): theme is ThemeMode {
  return theme === "light" || theme === "dark" || theme === "system";
}

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    // Private mode / disabled storage: behave as if nothing was saved.
    return null;
  }
}

function writeStorage(key: string, value: string | undefined): void {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch {
    // The theme still applies, it just won't survive a reload.
  }
}

/**
 * Adds the marker for the saved theme and palette while the page is parsing,
 * before the first paint. Rendered as an inline script, so it must be
 * self-contained: no imports, no helpers from this module.
 */
function initTheme(
  markerId: string,
  storageKey: string,
  defaultTheme: string,
  enableSystemTheme: boolean,
  paletteStorageKey: string,
  defaultPalette: string | null,
): void {
  // Inside on purpose: the script is serialised on its own and can't reach
  // anything outside this function.
  // oxlint-disable-next-line unicorn/consistent-function-scoping
  const read = (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  let theme = read(storageKey);
  if (theme !== "light" && theme !== "dark" && theme !== "system") {
    theme = defaultTheme;
  }
  const dark =
    theme === "dark" ||
    (theme === "system" &&
      enableSystemTheme &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const palette = read(paletteStorageKey) || defaultPalette;

  document.getElementById(markerId)?.remove();
  const marker = document.createElement("style");
  marker.id = markerId;
  marker.className =
    (dark ? "xiod-dark" : "xiod-light") +
    (palette ? " xiod-palette-" + palette : "");
  document.body.prepend(marker);
}

function subscribeNever(): () => void {
  return () => {};
}

/**
 * `true` while rendering on the server and while hydrating what the server
 * sent, `false` for a render that starts in the browser.
 */
function useIsServerRender(): boolean {
  return React.useSyncExternalStore(
    subscribeNever,
    () => false,
    () => true,
  );
}

function onIdle(callback: () => void): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(callback, { timeout: 1000 });
    return () => window.cancelIdleCallback(id);
  }
  // Safari has no requestIdleCallback; a new task still keeps the work out of
  // hydration.
  const id = window.setTimeout(callback, 1);
  return () => window.clearTimeout(id);
}

/**
 * Suppress transitions for one frame while the theme swaps, so every
 * transitioned property doesn't animate from the old palette to the new one.
 */
function disableThemeTransitions(): () => void {
  const style = document.createElement("style");
  style.dataset.themeTransitionGuard = "true";
  style.appendChild(
    document.createTextNode(
      "*,:before,:after{transition:none!important;transition-delay:0s!important;}",
    ),
  );

  document.head.appendChild(style);
  // Force a reflow so the guard applies before the class changes.
  document.documentElement.getBoundingClientRect();

  return () => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        style.remove();
      });
    });
  };
}

interface DocumentTheme {
  resolvedTheme: ResolvedTheme;
  palette: string | undefined;
  /** Whether to touch the palette attribute at all. */
  writePalette: boolean;
  attribute: string;
  paletteAttribute: string;
}

function applyToDocument(
  {
    resolvedTheme,
    palette,
    writePalette,
    attribute,
    paletteAttribute,
  }: DocumentTheme,
  disableTransitions: boolean,
): void {
  const removeTransitionGuard = disableTransitions
    ? disableThemeTransitions()
    : undefined;
  const root = document.documentElement;

  if (attribute === "class") {
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  } else {
    root.setAttribute(attribute, resolvedTheme);
  }
  root.style.colorScheme = resolvedTheme;

  // No palette means no attribute at all, so the base tokens from
  // `xiod-ui/styles` apply untouched rather than through an empty-string match.
  if (writePalette) {
    if (palette) root.setAttribute(paletteAttribute, palette);
    else root.removeAttribute(paletteAttribute);
  }

  // XiodUI's stylesheets read `.dark` and `data-palette` on `<html>`. With any
  // other names they can't see what was just written, so keep the marker for
  // them.
  const keepMode = attribute !== "class";
  const keepPalette = paletteAttribute !== "data-palette" && palette;
  let marker = document.getElementById(MARKER_ID);

  if (!keepMode && !keepPalette) {
    marker?.remove();
  } else {
    if (!marker) {
      marker = document.createElement("style");
      marker.id = MARKER_ID;
      document.body.prepend(marker);
    }
    marker.className = [
      keepMode && `xiod-${resolvedTheme}`,
      keepPalette && `xiod-palette-${palette}`,
    ]
      .filter(Boolean)
      .join(" ");
  }

  removeTransitionGuard?.();
}

function ThemeProvider({
  children,
  defaultTheme = "system",
  enableSystemTheme = true,
  attribute = "class",
  storageKey = "theme",
  defaultPalette,
  paletteAttribute = "data-palette",
  paletteStorageKey = "palette",
  nonce,
}: ThemeProviderProps): React.ReactElement {
  const isServerRender = useIsServerRender();
  const [theme, setThemeState] = React.useState<ThemeMode>(defaultTheme);
  const [palette, setPaletteState] = React.useState<string | undefined>(
    defaultPalette,
  );
  const [systemDark, setSystemDark] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  // Leave the palette attribute alone until a palette is in play, so apps that
  // import a palette stylesheet the plain way never get one written to <html>.
  const paletteInPlay = React.useRef(defaultPalette !== undefined);
  const handedOff = React.useRef(false);

  if (process.env.NODE_ENV !== "production" && attribute === paletteAttribute) {
    console.warn(
      `ThemeProvider: \`attribute\` and \`paletteAttribute\` are both "${attribute}". ` +
        "The light/dark mode and the palette would overwrite each other on the " +
        "same attribute — give one of them a different name.",
    );
  }

  // With system detection off there is nothing to resolve against, so
  // "system" falls back to light — what `:root` renders as without `dark`.
  const resolvedTheme: ResolvedTheme =
    theme === "system"
      ? enableSystemTheme && systemDark
        ? "dark"
        : "light"
      : theme;

  // Layout effects, so a render that starts in the browser applies the saved
  // theme before the first paint too.
  useIsomorphicLayoutEffect(() => {
    const savedTheme = readStorage(storageKey);
    if (isThemeMode(savedTheme)) setThemeState(savedTheme);

    const savedPalette = readStorage(paletteStorageKey);
    if (savedPalette) {
      paletteInPlay.current = true;
      setPaletteState(savedPalette);
    }

    setMounted(true);
  }, [storageKey, paletteStorageKey]);

  useIsomorphicLayoutEffect(() => {
    if (!enableSystemTheme) return;

    const mediaQuery = window.matchMedia(DARK_QUERY);
    const handleChange = (): void => setSystemDark(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [enableSystemTheme]);

  useIsomorphicLayoutEffect(() => {
    if (!mounted) return;

    const documentTheme: DocumentTheme = {
      resolvedTheme,
      palette,
      writePalette: paletteInPlay.current,
      attribute,
      paletteAttribute,
    };
    const marker = document.getElementById(MARKER_ID);

    if (
      !handedOff.current &&
      marker?.className === markerClassName(resolvedTheme, palette)
    ) {
      // The page already shows this theme through the pre-paint marker.
      return onIdle(() => {
        handedOff.current = true;
        applyToDocument(documentTheme, false);
      });
    }

    // A real change (or the first paint of a client-only app): apply it now.
    const visibleChange = handedOff.current || marker !== null;
    handedOff.current = true;
    applyToDocument(documentTheme, visibleChange);
  }, [mounted, resolvedTheme, palette, attribute, paletteAttribute]);

  const setTheme = React.useCallback(
    (newTheme: ThemeMode) => {
      setThemeState(newTheme);
      writeStorage(storageKey, newTheme);
    },
    [storageKey],
  );

  const setPalette = React.useCallback(
    (newPalette: string | undefined) => {
      paletteInPlay.current = true;
      setPaletteState(newPalette);
      writeStorage(paletteStorageKey, newPalette);
    },
    [paletteStorageKey],
  );

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme, palette, setPalette }),
    [theme, resolvedTheme, setTheme, palette, setPalette],
  );

  const scriptArgs = JSON.stringify([
    MARKER_ID,
    storageKey,
    defaultTheme,
    enableSystemTheme,
    paletteStorageKey,
    defaultPalette ?? null,
  ]).slice(1, -1);

  return (
    <ThemeContext.Provider value={value}>
      {/* Only server HTML needs it: the browser runs it while parsing, before
          the first paint. React never runs scripts it creates itself, so a
          render that starts in the browser leaves it out. The warning is
          suppressed on this element alone, because browsers hide a script's
          `nonce` attribute once it has run. */}
      {isServerRender ? (
        <script nonce={nonce} suppressHydrationWarning>
          {`(${initTheme.toString()})(${scriptArgs})`}
        </script>
      ) : null}
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export { ThemeProvider, useTheme };
