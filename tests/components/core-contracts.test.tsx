import {
  act,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "../../src/components/accordion";
import { Button } from "../../src/components/button";
import { Calendar } from "../../src/components/calendar";
import { Checkbox } from "../../src/components/checkbox";
import { Switch } from "../../src/components/switch";
import {
  ThemeProvider,
  type ThemeMode,
  useTheme,
} from "../../src/components/theme-provider";
import { useMediaQuery } from "../../src/hooks/use-media-query";

describe("core component contracts", () => {
  it("renders a safe native button and preserves consumer overrides", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button className="consumer-class" onClick={onClick}>
        Save
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("data-slot", "button");
    expect(button).toHaveClass("consumer-class");

    await user.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("supports polymorphic button rendering", () => {
    render(
      <Button render={<a href="/account">Account</a>} variant="outline" />,
    );

    const link = screen.getByRole("link", { name: "Account" });
    expect(link).toHaveAttribute("href", "/account");
    expect(link).not.toHaveAttribute("type");
    expect(link).toHaveAttribute("data-slot", "button");
  });

  it("opens and closes an accordion panel through user interaction", async () => {
    const user = userEvent.setup();

    render(
      <Accordion>
        <AccordionItem value="shipping">
          <AccordionTrigger>Shipping</AccordionTrigger>
          <AccordionPanel>Ships in two business days.</AccordionPanel>
        </AccordionItem>
      </Accordion>,
    );

    const trigger = screen.getByRole("button", { name: "Shipping" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByText("Ships in two business days."),
    ).not.toBeInTheDocument();

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Ships in two business days.")).toBeVisible();

    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("toggles checkbox and switch state with the keyboard", async () => {
    const user = userEvent.setup();

    render(
      <div>
        <Checkbox aria-label="Accept terms" />
        <Switch aria-label="Enable notifications" />
      </div>,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
    checkbox.focus();
    await user.keyboard("[Space]");
    expect(checkbox).toBeChecked();
    expect(checkbox).toHaveAttribute("data-checked");

    const toggle = screen.getByRole("switch", {
      name: "Enable notifications",
    });
    toggle.focus();
    await user.keyboard("[Space]");
    expect(toggle).toBeChecked();
    expect(toggle).toHaveAttribute("data-checked");
  });

  it("selects calendar dates and moves focus with arrow keys", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const selected = new Date(2026, 8, 15);

    render(<Calendar onSelect={onSelect} selected={selected} />);

    const selectedDay = screen.getByRole("button", {
      name: /September 15, 2026/,
    });
    selectedDay.focus();
    await user.keyboard("{ArrowRight}");

    const nextDay = screen.getByRole("button", {
      name: /September 16, 2026/,
    });
    expect(nextDay).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect.mock.calls[0]?.[0]).toEqual(new Date(2026, 8, 16));
  });

  it("follows the date grid keyboard pattern without stealing focus", async () => {
    const user = userEvent.setup();
    const day = (name: RegExp) => screen.getByRole("button", { name });
    const isWeekend = (date: Date) =>
      date.getDay() === 0 || date.getDay() === 6;

    render(<Calendar selected={new Date(2026, 8, 15)} disabled={isWeekend} />);

    // Rendering doesn't move focus; the selected day is the one tab stop.
    expect(document.body).toHaveFocus();
    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();
    expect(day(/September 15, 2026/)).toHaveFocus();

    // Home/End: the week's ends, skipping disabled weekend days.
    await user.keyboard("{Home}");
    expect(day(/Monday, September 14, 2026/)).toHaveFocus();
    await user.keyboard("{End}");
    expect(day(/Friday, September 18, 2026/)).toHaveFocus();

    // Arrows step over disabled days.
    await user.keyboard("{ArrowRight}");
    expect(day(/Monday, September 21, 2026/)).toHaveFocus();

    // PageDown moves a month (paging the view); Shift+PageDown a year.
    await user.keyboard("{PageDown}");
    expect(day(/October 21, 2026/)).toHaveFocus();
    expect(screen.getByText("October 2026")).toHaveAttribute(
      "aria-live",
      "polite",
    );
    await user.keyboard("{Shift>}{PageDown}{/Shift}");
    expect(day(/October 21, 2027/)).toHaveFocus();
  });

  it("keeps a tab stop in the grid after paging with the header buttons", async () => {
    const user = userEvent.setup();
    render(<Calendar selected={new Date(2026, 8, 15)} />);

    await user.click(screen.getByRole("button", { name: "Next Page" }));
    expect(screen.getByRole("button", { name: "Next Page" })).toHaveFocus();
    expect(
      screen.getByRole("button", { name: /October 15, 2026/ }),
    ).toHaveAttribute("tabindex", "0");
  });

  it("marks today with aria-current", () => {
    render(<Calendar />);
    const today = new Date();
    const current = screen
      .getAllByRole("button")
      .filter((button) => button.getAttribute("aria-current") === "date");
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent(String(today.getDate()));
  });
});

function ThemeConsumer(): React.JSX.Element {
  const { palette, resolvedTheme, setPalette, setTheme, theme } = useTheme();

  return (
    <div>
      <output aria-label="theme">{theme}</output>
      <output aria-label="resolved theme">{resolvedTheme}</output>
      <output aria-label="palette">{palette ?? "base"}</output>
      <button type="button" onClick={() => setTheme("dark")}>
        Use dark theme
      </button>
      <button type="button" onClick={() => setPalette("cobalt")}>
        Use cobalt palette
      </button>
    </div>
  );
}

describe("runtime environment contracts", () => {
  it("applies and persists theme and palette changes", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider defaultTheme="light">
        <ThemeConsumer />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(document.documentElement).toHaveClass("light");
    });

    await user.click(screen.getByRole("button", { name: "Use dark theme" }));
    expect(document.documentElement).toHaveClass("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
    expect(window.localStorage.getItem("theme")).toBe("dark");
    expect(screen.getByLabelText("resolved theme")).toHaveTextContent("dark");

    await user.click(
      screen.getByRole("button", { name: "Use cobalt palette" }),
    );
    expect(document.documentElement).toHaveAttribute("data-palette", "cobalt");
    expect(window.localStorage.getItem("palette")).toBe("cobalt");
  });

  it("subscribes to the exact media query and updates on change", () => {
    let matches = false;
    let listener: ((event: MediaQueryListEvent) => void) | undefined;
    const removeEventListener = vi.fn();

    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
      addEventListener: vi.fn(
        (_type: string, callback: EventListenerOrEventListenerObject) => {
          listener = callback as (event: MediaQueryListEvent) => void;
        },
      ),
      addListener: vi.fn(),
      dispatchEvent: vi.fn(),
      get matches() {
        return matches;
      },
      media: query,
      onchange: null,
      removeEventListener,
      removeListener: vi.fn(),
    }));

    const { result, unmount } = renderHook(() =>
      useMediaQuery({ min: "md", max: "xl", pointer: "fine" }),
    );

    expect(window.matchMedia).toHaveBeenCalledWith(
      "(min-width: 800px) and (max-width: 1279px) and (pointer: fine)",
    );
    expect(result.current).toBe(false);

    act(() => {
      matches = true;
      listener?.({ matches: true } as MediaQueryListEvent);
    });
    expect(result.current).toBe(true);

    unmount();
    expect(removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
  });

  it("keeps the declared theme mode type usable by consumers", () => {
    const theme: ThemeMode = "system";
    expect(theme).toBe("system");
  });
});
