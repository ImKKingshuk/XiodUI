import { act, render, screen } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  ThemeProvider,
  type ThemeProviderProps,
  useTheme,
} from "../../src/components/theme-provider";

function ThemeReadout(): React.JSX.Element {
  const { palette, resolvedTheme, theme } = useTheme();
  return (
    <p>
      {theme}/{resolvedTheme}/{palette ?? "base"}
    </p>
  );
}

function App(props: Omit<ThemeProviderProps, "children">): React.JSX.Element {
  return (
    <ThemeProvider {...props}>
      <ThemeReadout />
    </ThemeProvider>
  );
}

/** Runs the inline script from server HTML, as the browser would while parsing. */
function runInlineScript(html: string): void {
  const container = document.createElement("div");
  container.innerHTML = html;
  const script = container.querySelector("script");
  expect(script).not.toBeNull();
  // jsdom doesn't run parsed scripts here, so run the provider's own output.
  // oxlint-disable-next-line typescript/no-implied-eval
  new Function(script?.textContent ?? "")();
}

function resetRoot(): void {
  const root = document.documentElement;
  root.className = "";
  root.removeAttribute("style");
  for (const name of ["data-theme", "data-palette", "data-accent"]) {
    root.removeAttribute(name);
  }
}

function prefersDark(dark: boolean): void {
  vi.mocked(window.matchMedia).mockImplementation(
    (query: string) =>
      ({
        addEventListener: vi.fn(),
        addListener: vi.fn(),
        dispatchEvent: vi.fn(),
        matches: dark && query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn(),
      }) as MediaQueryList,
  );
}

beforeEach(() => {
  localStorage.clear();
  resetRoot();
});

afterEach(() => {
  resetRoot();
});

describe("ThemeProvider before hydration", () => {
  it("applies the saved theme and palette from the server HTML alone", () => {
    localStorage.setItem("theme", "dark");
    localStorage.setItem("palette", "cobalt");

    runInlineScript(renderToString(<App />));

    const root = document.documentElement;
    expect(root).toHaveClass("dark");
    expect(root).not.toHaveClass("light");
    expect(root.style.colorScheme).toBe("dark");
    expect(root).toHaveAttribute("data-palette", "cobalt");
  });

  it("follows the system preference when nothing is saved", () => {
    prefersDark(true);
    runInlineScript(renderToString(<App />));
    expect(document.documentElement).toHaveClass("dark");

    resetRoot();
    runInlineScript(renderToString(<App enableSystemTheme={false} />));
    expect(document.documentElement).toHaveClass("light");
  });

  it("honours the provider's props", () => {
    localStorage.setItem("mode", "not-a-theme");

    runInlineScript(
      renderToString(
        <App
          attribute="data-theme"
          storageKey="mode"
          defaultTheme="dark"
          defaultPalette="ember"
          paletteAttribute="data-accent"
        />,
      ),
    );

    const root = document.documentElement;
    expect(root).toHaveAttribute("data-theme", "dark");
    expect(root).not.toHaveClass("dark");
    expect(root).toHaveAttribute("data-accent", "ember");
    expect(root).not.toHaveAttribute("data-palette");
  });

  it("leaves the palette attribute alone when there is no palette", () => {
    runInlineScript(renderToString(<App />));
    expect(document.documentElement).not.toHaveAttribute("data-palette");
  });

  it("still applies the default theme when storage is unavailable", () => {
    vi.spyOn(localStorage, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });

    runInlineScript(renderToString(<App defaultTheme="dark" />));
    expect(document.documentElement).toHaveClass("dark");
  });

  it("puts the nonce on the script and escapes the arguments", () => {
    const html = renderToString(
      <App nonce="abc123" storageKey="</script><script>alert(1)//" />,
    );
    expect(html).toContain('nonce="abc123"');
    expect(html.match(/<script/g)).toHaveLength(1);
    expect(html.match(/<\/script>/g)).toHaveLength(1);
  });

  it("hydrates without errors and keeps the saved theme", async () => {
    const consoleError = vi.spyOn(console, "error");
    localStorage.setItem("theme", "dark");

    const html = renderToString(<App />);
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.append(container);
    runInlineScript(html);

    await act(async () => {
      hydrateRoot(container, <App />);
    });

    expect(consoleError).not.toHaveBeenCalled();
    expect(document.documentElement).toHaveClass("dark");
    expect(container).toHaveTextContent("dark/dark/base");
    container.remove();
  });
});

describe("ThemeProvider rendered in the browser", () => {
  it("applies the saved theme without rendering a script", () => {
    const consoleError = vi.spyOn(console, "error");
    localStorage.setItem("theme", "dark");
    localStorage.setItem("palette", "cobalt");

    const { container } = render(<App />);

    expect(container.querySelector("script")).toBeNull();
    expect(consoleError).not.toHaveBeenCalled();
    expect(document.documentElement).toHaveClass("dark");
    expect(document.documentElement).toHaveAttribute("data-palette", "cobalt");
    expect(screen.getByText("dark/dark/cobalt")).toBeInTheDocument();
  });
});
