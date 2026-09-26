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

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined,
);

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

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

/**
 * Applies the saved theme and palette to `<html>` before the first paint.
 * Rendered as an inline script, so it must be self-contained: no imports,
 * no helpers from this module, nothing a bundler would rewrite.
 */
function initTheme(
  attribute: string,
  storageKey: string,
  defaultTheme: string,
  enableSystemTheme: boolean,
  paletteAttribute: string,
  paletteStorageKey: string,
  defaultPalette: string | null,
): void {
  const root = document.documentElement;
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
  const resolved =
    theme === "system"
      ? enableSystemTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  if (attribute === "class") {
    root.classList.remove("light", "dark");
    root.classList.add(resolved);
  } else {
    root.setAttribute(attribute, resolved);
  }
  root.style.colorScheme = resolved;

  const palette = read(paletteStorageKey) || defaultPalette;
  if (palette) root.setAttribute(paletteAttribute, palette);
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

function getResolvedTheme(
  theme: ThemeMode,
  enableSystemTheme: boolean,
): ResolvedTheme {
  if (theme === "system") {
    // With system detection off there is nothing to resolve against, so fall
    // back to light — that is what `:root` renders as without the `dark` class.
    if (!enableSystemTheme) return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return theme;
}

/**
 * Suppress transitions for one frame while the theme swaps, so every
 * transitioned property doesn't animate from the old palette to the new one.
 */
function disableThemeTransitions(): () => void {
  if (typeof document === "undefined") return () => {};

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

function applyTheme(
  theme: ResolvedTheme,
  attribute: string,
  disableTransitions = false,
): void {
  const removeTransitionGuard = disableTransitions
    ? disableThemeTransitions()
    : undefined;
  const root = document.documentElement;

  if (attribute === "class") {
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  } else {
    root.setAttribute(attribute, theme);
  }

  root.style.colorScheme = theme;
  removeTransitionGuard?.();
}

function applyPalette(
  palette: string | undefined,
  attribute: string,
  disableTransitions = false,
): void {
  const removeTransitionGuard = disableTransitions
    ? disableThemeTransitions()
    : undefined;
  const root = document.documentElement;

  // No palette means no attribute at all, so the base tokens from
  // `xiod-ui/styles` apply untouched rather than through an empty-string match.
  if (palette) root.setAttribute(attribute, palette);
  else root.removeAttribute(attribute);

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
  const [resolvedTheme, setResolvedTheme] =
    React.useState<ResolvedTheme>("light");
  const [palette, setPaletteState] = React.useState<string | undefined>(
    defaultPalette,
  );
  const [mounted, setMounted] = React.useState(false);

  if (process.env.NODE_ENV !== "production" && attribute === paletteAttribute) {
    console.warn(
      `ThemeProvider: \`attribute\` and \`paletteAttribute\` are both "${attribute}". ` +
        "The light/dark mode and the palette would overwrite each other on the " +
        "same attribute — give one of them a different name.",
    );
  }

  const setTheme = React.useCallback(
    (newTheme: ThemeMode) => {
      const newResolvedTheme = getResolvedTheme(newTheme, enableSystemTheme);

      applyTheme(newResolvedTheme, attribute, true);
      setThemeState(newTheme);
      setResolvedTheme(newResolvedTheme);

      try {
        localStorage.setItem(storageKey, newTheme);
      } catch {
        // Private mode / disabled storage: the theme still applies, it just
        // won't survive a reload.
      }
    },
    [attribute, enableSystemTheme, storageKey],
  );

  const setPalette = React.useCallback(
    (newPalette: string | undefined) => {
      applyPalette(newPalette, paletteAttribute, true);
      setPaletteState(newPalette);

      try {
        if (newPalette) localStorage.setItem(paletteStorageKey, newPalette);
        else localStorage.removeItem(paletteStorageKey);
      } catch {
        // See above.
      }
    },
    [paletteAttribute, paletteStorageKey],
  );

  // A layout effect, so a render that starts in the browser applies the saved
  // theme before the first paint too. Server-rendered pages already have it
  // from the inline script; applying it again below changes nothing.
  useIsomorphicLayoutEffect(() => {
    const savedTheme = readStorage(storageKey);
    if (isThemeMode(savedTheme)) setThemeState(savedTheme);

    const savedPalette = readStorage(paletteStorageKey);
    if (savedPalette) setPaletteState(savedPalette);

    setMounted(true);
  }, [storageKey, paletteStorageKey]);

  useIsomorphicLayoutEffect(() => {
    if (!mounted) return;

    const newResolvedTheme = getResolvedTheme(theme, enableSystemTheme);
    applyTheme(newResolvedTheme, attribute);
    setResolvedTheme(newResolvedTheme);
  }, [theme, mounted, attribute, enableSystemTheme]);

  useIsomorphicLayoutEffect(() => {
    // Skipped entirely while no palette is set, so apps importing a palette
    // stylesheet the plain way never get an attribute written to `<html>`.
    if (!mounted || palette === undefined) return;

    applyPalette(palette, paletteAttribute);
  }, [palette, mounted, paletteAttribute]);

  React.useEffect(() => {
    if (!mounted || theme !== "system" || !enableSystemTheme) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (): void => {
      const newTheme = mediaQuery.matches ? "dark" : "light";
      setResolvedTheme(newTheme);
      applyTheme(newTheme, attribute);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, mounted, attribute, enableSystemTheme]);

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme, palette, setPalette }),
    [theme, resolvedTheme, setTheme, palette, setPalette],
  );

  const scriptArgs = JSON.stringify([
    attribute,
    storageKey,
    defaultTheme,
    enableSystemTheme,
    paletteAttribute,
    paletteStorageKey,
    defaultPalette ?? null,
  ]).slice(1, -1);

  return (
    <ThemeContext.Provider value={value}>
      {/* Only server HTML needs it: the browser runs it while parsing, before
          the first paint. React never runs scripts it creates itself, so a
          render that starts in the browser leaves it out. */}
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
