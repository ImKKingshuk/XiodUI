import { act, render, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  ThemeProvider,
  type ThemeProviderProps,
  useTheme,
} from "../../src/components/theme-provider";

type Props = Omit<ThemeProviderProps, "children">;

function ThemeControls(): React.JSX.Element {
  const { palette, resolvedTheme, setPalette, setTheme, theme } = useTheme();
  return (
    <div>
      <output aria-label="state">
        {theme}/{resolvedTheme}/{palette ?? "base"}
      </output>
      <button type="button" onClick={() => setTheme("light")}>
        Light
      </button>
      <button type="button" onClick={() => setPalette(undefined)}>
        No palette
      </button>
    </div>
  );
}

function App(props: Props): React.JSX.Element {
  return (
    <ThemeProvider {...props}>
      <ThemeControls />
    </ThemeProvider>
  );
}

/** A whole document, the way a Next.js root layout renders one — note: no suppressHydrationWarning. */
function Page(props: Props): React.JSX.Element {
  return (
    <html lang="en" className="font-sans antialiased">
      <head>
        <title>Page</title>
      </head>
      <body>
        <App {...props} />
      </body>
    </html>
  );
}

const marker = () => document.getElementById("xiod-theme");
// `screen` stays bound to the <body> that existed at import, and these tests
// replace the document.
const view = () => within(document.body);

/** Loads server HTML and runs its inline script, as the browser would while parsing. */
function loadServerHtml(element: React.ReactElement): void {
  // jsdom would run the script in its own context, without the test setup's
  // matchMedia and localStorage, so park it and run it here instead.
  const html = renderToString(element).replace(
    "<script",
    '<script type="text/x-parked"',
  );
  document.open();
  document.write(`<!DOCTYPE html>${html}`);
  document.close();
  const script = document.body.querySelector("script");
  expect(script).not.toBeNull();
  script?.removeAttribute("type");
  // oxlint-disable-next-line typescript/no-implied-eval
  new Function(script?.textContent ?? "")();
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

let roots: ReturnType<typeof hydrateRoot>[] = [];

async function hydrate(props: Props = {}): Promise<void> {
  await act(async () => {
    roots.push(hydrateRoot(document, <Page {...props} />));
  });
}

beforeEach(() => {
  localStorage.clear();
  marker()?.remove();
});

afterEach(async () => {
  await act(async () => {
    for (const root of roots) root.unmount();
  });
  roots = [];
  marker()?.remove();
});

describe("ThemeProvider before hydration", () => {
  it("marks the saved theme and palette without touching <html>", () => {
    localStorage.setItem("theme", "dark");
    localStorage.setItem("palette", "cobalt");

    loadServerHtml(<Page />);

    expect(marker()).toBe(document.body.firstElementChild);
    expect(marker()?.tagName).toBe("STYLE");
    expect(marker()?.className).toBe("xiod-dark xiod-palette-cobalt");
    // What the server sent, unchanged: nothing for hydration to trip over.
    expect(document.documentElement.getAttribute("class")).toBe(
      "font-sans antialiased",
    );
    expect(document.documentElement.getAttribute("style")).toBeNull();
    expect(document.documentElement.hasAttribute("data-palette")).toBe(false);
  });

  it("follows the system preference when nothing is saved", () => {
    prefersDark(true);
    loadServerHtml(<Page />);
    expect(marker()?.className).toBe("xiod-dark");

    loadServerHtml(<Page enableSystemTheme={false} />);
    expect(marker()?.className).toBe("xiod-light");
  });

  it("honours the storage keys and defaults", () => {
    localStorage.setItem("mode", "not-a-theme");

    loadServerHtml(
      <Page storageKey="mode" defaultTheme="dark" defaultPalette="ember" />,
    );

    expect(marker()?.className).toBe("xiod-dark xiod-palette-ember");
  });

  it("still marks the default theme when storage is unavailable", () => {
    vi.spyOn(localStorage, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });

    loadServerHtml(<Page defaultTheme="dark" />);
    expect(marker()?.className).toBe("xiod-dark");
  });

  it("puts the nonce on the script and escapes the arguments", () => {
    const html = renderToString(
      <App nonce="abc123" storageKey="</script><script>alert(1)//" />,
    );
    expect(html).toContain('nonce="abc123"');
    expect(html.match(/<script/g)).toHaveLength(1);
    expect(html.match(/<\/script>/g)).toHaveLength(1);
  });
});

describe("ThemeProvider hydrating a server-rendered page", () => {
  it("hydrates the whole document without any hydration warning", async () => {
    const consoleError = vi.spyOn(console, "error");
    localStorage.setItem("theme", "dark");
    localStorage.setItem("palette", "cobalt");
    loadServerHtml(<Page />);

    await hydrate();

    expect(consoleError).not.toHaveBeenCalled();
    expect(view().getByLabelText("state")).toHaveTextContent(
      "dark/dark/cobalt",
    );
  });

  it("moves the theme to <html> once idle, then drops the marker", async () => {
    localStorage.setItem("theme", "dark");
    localStorage.setItem("palette", "cobalt");
    loadServerHtml(<Page />);

    await hydrate();
    // Straight after hydration the marker still carries the theme.
    expect(marker()?.className).toBe("xiod-dark xiod-palette-cobalt");

    await waitFor(() => expect(marker()).toBeNull());
    const root = document.documentElement;
    expect(root).toHaveClass("dark", "font-sans", "antialiased");
    expect(root.style.colorScheme).toBe("dark");
    expect(root).toHaveAttribute("data-palette", "cobalt");
    expect(document.head.querySelector("[data-theme-transition-guard]")).toBe(
      null,
    );
  });

  it("applies a change made before the hand-off at once", async () => {
    const user = userEvent.setup();
    localStorage.setItem("theme", "dark");
    loadServerHtml(<Page />);
    await hydrate();

    await user.click(view().getByRole("button", { name: "Light" }));

    expect(document.documentElement).toHaveClass("light");
    expect(document.documentElement).not.toHaveClass("dark");
    expect(marker()).toBeNull();
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("keeps the marker where the stylesheets can't read <html>", async () => {
    localStorage.setItem("theme", "dark");
    localStorage.setItem("palette", "cobalt");
    loadServerHtml(
      <Page attribute="data-mode" paletteAttribute="data-accent" />,
    );
    await hydrate({ attribute: "data-mode", paletteAttribute: "data-accent" });

    await waitFor(() =>
      expect(document.documentElement).toHaveAttribute("data-mode", "dark"),
    );
    expect(document.documentElement).toHaveAttribute("data-accent", "cobalt");
    expect(marker()?.className).toBe("xiod-dark xiod-palette-cobalt");
  });
});

describe("ThemeProvider rendered in the browser", () => {
  it("applies the saved theme before paint without a script or marker", () => {
    const consoleError = vi.spyOn(console, "error");
    localStorage.setItem("theme", "dark");
    localStorage.setItem("palette", "cobalt");

    const { container } = render(<App />);

    expect(container.querySelector("script")).toBeNull();
    expect(marker()).toBeNull();
    expect(consoleError).not.toHaveBeenCalled();
    expect(document.documentElement).toHaveClass("dark");
    expect(document.documentElement).toHaveAttribute("data-palette", "cobalt");
    expect(view().getByLabelText("state")).toHaveTextContent(
      "dark/dark/cobalt",
    );
  });

  it("clears the palette attribute when the palette is cleared", async () => {
    const user = userEvent.setup();
    localStorage.setItem("palette", "cobalt");
    render(<App />);
    expect(document.documentElement).toHaveAttribute("data-palette", "cobalt");

    await user.click(view().getByRole("button", { name: "No palette" }));

    expect(document.documentElement).not.toHaveAttribute("data-palette");
    expect(localStorage.getItem("palette")).toBeNull();
  });

  it("leaves a palette attribute it never set alone", () => {
    document.documentElement.setAttribute("data-palette", "from-the-app");
    render(<App />);
    expect(document.documentElement).toHaveAttribute(
      "data-palette",
      "from-the-app",
    );
  });
});
