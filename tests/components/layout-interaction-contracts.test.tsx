import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "../../src/components/button";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../src/components/carousel";
import {
  DashboardGrid,
  DashboardTile,
  DashboardTileControls,
  DashboardTileHandle,
  DashboardTileHeader,
  DashboardTileTitle,
} from "../../src/components/dashboard-grid";
import {
  Draggable,
  DraggableBody,
  DraggableControls,
  DraggableFooter,
  DraggableHeader,
  DraggableTitle,
} from "../../src/components/draggable";
import {
  Drawer,
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerMenu,
  DrawerMenuCheckboxItem,
  DrawerMenuGroup,
  DrawerMenuGroupLabel,
  DrawerMenuItem,
  DrawerMenuRadioGroup,
  DrawerMenuRadioItem,
  DrawerMenuSeparator,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from "../../src/components/drawer";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../src/components/resizable";
import { RulerPicker } from "../../src/components/ruler-picker";
import {
  Sortable,
  SortableColumn,
  SortableColumnHeader,
  SortableColumnTitle,
  SortableItem,
  SortableItemHandle,
  SortableItemRemove,
} from "../../src/components/sortable";
import {
  WheelPicker,
  WheelPickerGroup,
  wheelPickerVariants,
} from "../../src/components/wheel-picker";

function SortableList(): React.JSX.Element {
  const [items, setItems] = React.useState(["alpha", "beta", "gamma"]);
  return (
    <Sortable items={items} onReorder={setItems}>
      {items.map((item) => (
        <SortableItem id={item} key={item}>
          {item}
          <SortableItemRemove id={item} />
        </SortableItem>
      ))}
    </Sortable>
  );
}

const sortableOrder = () =>
  screen.getAllByRole("listitem").map((item) => item.dataset.sortableId);

const cursorLock = () =>
  document.head.querySelector("style[id^=resizable-style-]");

describe("carousel and drawer contracts", () => {
  it("exposes carousel structure, slide semantics, orientation, and named controls", () => {
    const { container, rerender } = render(
      <Carousel
        aria-label="Featured products"
        loop={false}
        orientation="horizontal"
      >
        <CarouselContent>
          <CarouselItem>First</CarouselItem>
          <CarouselItem>Second</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </Carousel>,
    );

    expect(
      screen.getByRole("region", { name: "Featured products" }),
    ).toHaveAttribute("aria-roledescription", "carousel");
    expect(screen.getAllByRole("group")).toHaveLength(2);
    expect(
      screen.getByRole("button", { name: "Previous slide" }),
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next slide" })).toBeDisabled();
    expect(
      container.querySelector('[data-slot="carousel-viewport"]'),
    ).not.toBeNull();
    expect(
      container.querySelector('[data-slot="carousel-content"]'),
    ).toHaveAttribute("aria-live", "polite");

    rerender(
      <Carousel aria-label="Featured products" orientation="vertical">
        <CarouselContent>
          <CarouselItem>First</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>,
    );
    expect(
      container.querySelector('[data-slot="carousel-content"]'),
    ).toHaveClass("flex-col", "touch-pan-x");

    rerender(
      <Carousel aria-label="Featured products" autoplay>
        <CarouselContent>
          <CarouselItem>First</CarouselItem>
        </CarouselContent>
      </Carousel>,
    );
    // Autoplay changes slides on its own: don't announce each one.
    expect(
      container.querySelector('[data-slot="carousel-content"]'),
    ).toHaveAttribute("aria-live", "off");
  });

  it("opens a semantic drawer, covers menu item states, and restores focus", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const onRadioChange = vi.fn();

    render(
      <Drawer position="right">
        <DrawerTrigger render={<Button>Open preferences</Button>} />
        <DrawerPopup position="right" showBar showCloseButton>
          <DrawerHeader>
            <DrawerTitle>Preferences</DrawerTitle>
            <DrawerDescription>Choose display settings.</DrawerDescription>
          </DrawerHeader>
          <DrawerPanel scrollable={false}>
            <DrawerMenu aria-label="Preference sections">
              <DrawerMenuGroup>
                <DrawerMenuGroupLabel>Display</DrawerMenuGroupLabel>
                <DrawerMenuItem>Appearance</DrawerMenuItem>
                <DrawerMenuItem disabled>Unavailable</DrawerMenuItem>
                <DrawerMenuCheckboxItem
                  checked
                  onCheckedChange={onCheckedChange}
                  variant="switch"
                >
                  Animations
                </DrawerMenuCheckboxItem>
              </DrawerMenuGroup>
              <DrawerMenuSeparator />
              <DrawerMenuRadioGroup onValueChange={onRadioChange} value="light">
                <DrawerMenuRadioItem value="light">Light</DrawerMenuRadioItem>
                <DrawerMenuRadioItem value="dark">Dark</DrawerMenuRadioItem>
              </DrawerMenuRadioGroup>
            </DrawerMenu>
          </DrawerPanel>
          <DrawerFooter>
            <DrawerClose render={<Button>Done</Button>} />
          </DrawerFooter>
        </DrawerPopup>
      </Drawer>,
    );

    const trigger = screen.getByRole("button", { name: "Open preferences" });
    await user.click(trigger);
    const dialog = await screen.findByRole("dialog", { name: "Preferences" });
    expect(dialog).toHaveAccessibleDescription("Choose display settings.");
    expect(screen.getByRole("button", { name: "Unavailable" })).toBeDisabled();
    await user.click(screen.getByRole("checkbox", { name: "Animations" }));
    expect(onCheckedChange).toHaveBeenCalledWith(false, expect.anything());
    await user.click(screen.getByRole("radio", { name: "Dark" }));
    expect(onRadioChange).toHaveBeenCalledWith("dark", expect.anything());
    await user.click(screen.getByRole("button", { name: "Done" }));
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });
});

describe("movable and sortable layout contracts", () => {
  it("supports draggable minimize, maximize, restore, and close states", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { container } = render(
      <Draggable onOpenChange={onOpenChange}>
        <DraggableHeader>
          <DraggableTitle>Inspector</DraggableTitle>
          <DraggableControls />
        </DraggableHeader>
        <DraggableBody>Panel body</DraggableBody>
        <DraggableFooter>Panel footer</DraggableFooter>
      </Draggable>,
    );

    const panel = container.querySelector('[data-slot="draggable"]');
    expect(panel).not.toBeNull();
    await user.click(screen.getByRole("button", { name: "Minimize" }));
    expect(screen.queryByText("Panel body")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Minimize" }));
    expect(screen.getByText("Panel body")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Maximize" }));
    expect(panel).toHaveAttribute("style", expect.stringContaining("width"));
    await user.click(screen.getByRole("button", { name: "Maximize" }));
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(panel).not.toBeInTheDocument();
  });

  it("names the draggable panel and moves and resizes it from the keyboard", async () => {
    const user = userEvent.setup();
    render(
      <Draggable defaultX={100} defaultY={100} bounds="none">
        <DraggableHeader />
        <DraggableBody>Panel body</DraggableBody>
      </Draggable>,
    );

    const panel = screen.getByRole("dialog", { name: "Draggable Panel" });
    screen.getByRole("button", { name: "Move panel" }).focus();
    await user.keyboard("{ArrowRight}{Shift>}{ArrowDown}{/Shift}");
    expect(panel).toHaveStyle({ left: "110px", top: "150px" });

    screen.getByRole("button", { name: "Resize panel" }).focus();
    await user.keyboard("{ArrowLeft}");
    expect(panel).toHaveStyle({ width: "350px" });

    const maximize = screen.getByRole("button", { name: "Maximize" });
    expect(maximize).toHaveAttribute("aria-pressed", "false");
    await user.click(maximize);
    expect(maximize).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.queryByRole("button", { name: "Move panel" }),
    ).not.toBeInTheDocument();
  });

  it("renders dashboard geometry and provides an accessible remove action", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    const layout = [{ h: 2, i: "traffic", w: 4, x: 0, y: 0 }];
    const { container } = render(
      <DashboardGrid layout={layout} onTileRemove={onRemove} showGridLines>
        <DashboardTile id="traffic">
          <DashboardTileHeader id="traffic">
            <DashboardTileTitle>Traffic</DashboardTileTitle>
            <DashboardTileControls id="traffic" />
          </DashboardTileHeader>
          <DashboardTileHandle id="traffic" />
        </DashboardTile>
      </DashboardGrid>,
    );

    expect(
      container.querySelector('[data-slot="dashboard-tile"]'),
    ).toHaveAttribute("data-tile-id", "traffic");
    await user.click(screen.getByRole("button", { name: "Remove Widget" }));
    expect(onRemove).toHaveBeenCalledWith("traffic");
  });

  it("moves and resizes dashboard tiles from the keyboard", async () => {
    const user = userEvent.setup();
    const onLayoutChange = vi.fn();
    const layout = [
      { h: 2, i: "traffic", w: 4, x: 0, y: 0 },
      { h: 2, i: "sales", w: 4, x: 0, y: 2, static: true },
    ];
    const { container } = render(
      <DashboardGrid
        layout={layout}
        cols={12}
        compactType={null}
        onLayoutChange={onLayoutChange}
      >
        <DashboardTile id="traffic">
          <DashboardTileHeader id="traffic" />
        </DashboardTile>
        <DashboardTile id="sales">
          <DashboardTileHeader id="sales" />
        </DashboardTile>
      </DashboardGrid>,
    );
    const announcer = container.querySelector(
      "[data-slot=dashboard-grid-announcer]",
    );

    // Only the movable tile gets a move handle and a resize handle.
    const [move] = screen.getAllByRole("button", { name: "Move tile" });
    expect(screen.getAllByRole("button", { name: "Move tile" })).toHaveLength(
      1,
    );
    expect(screen.getAllByRole("button", { name: "Resize tile" })).toHaveLength(
      1,
    );

    move.focus();
    await user.keyboard("{ArrowRight}{ArrowRight}");
    expect(onLayoutChange).toHaveBeenLastCalledWith([
      expect.objectContaining({ i: "traffic", x: 2, y: 0 }),
      expect.objectContaining({ i: "sales", x: 0, y: 2 }),
    ]);
    expect(announcer).toHaveTextContent("Moved to column 3, row 1.");

    screen.getByRole("button", { name: "Resize tile" }).focus();
    await user.keyboard("{ArrowRight}{ArrowDown}");
    expect(onLayoutChange).toHaveBeenLastCalledWith([
      expect.objectContaining({ i: "traffic", w: 5, h: 3 }),
      expect.objectContaining({ i: "sales" }),
    ]);
    expect(announcer).toHaveTextContent("Resized to 5 columns by 3 rows.");
  });

  it("reorders by keyboard and names icon-only removal controls", async () => {
    const user = userEvent.setup();
    const onReorder = vi.fn();
    const onRemove = vi.fn();
    const items = ["alpha", "beta", "gamma"];
    render(
      <Sortable items={items} onRemove={onRemove} onReorder={onReorder}>
        {items.map((item) => (
          <SortableItem id={item} key={item}>
            <SortableItemHandle />
            {item}
            <SortableItemRemove id={item} />
          </SortableItem>
        ))}
        <SortableColumn id="backlog">
          <SortableColumnHeader>
            <SortableColumnTitle>Backlog</SortableColumnTitle>
          </SortableColumnHeader>
        </SortableColumn>
      </Sortable>,
    );

    expect(screen.getByRole("list")).toBeVisible();
    const alpha = screen.getByRole("listitem", { name: "alpha" });
    alpha.focus();
    expect(alpha).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.keyboard("{ArrowDown}");
    expect(onReorder).toHaveBeenCalledWith(["beta", "alpha", "gamma"]);
    await user.click(screen.getByRole("button", { name: "Remove beta" }));
    expect(onRemove).toHaveBeenCalledWith("beta");
  });

  it("announces a keyboard drag and restores the order on Escape", async () => {
    const user = userEvent.setup();
    const { container } = render(<SortableList />);
    const announcer = container.querySelector("[data-slot=sortable-announcer]");

    // Enter on a control inside an item doesn't lift the item.
    screen.getByRole("button", { name: "Remove alpha" }).focus();
    await user.keyboard("{Enter}");
    expect(announcer).toHaveTextContent("");

    screen.getByRole("listitem", { name: "alpha" }).focus();
    await user.keyboard("{Enter}");
    expect(announcer).toHaveTextContent(/Picked up alpha, position 1 of 3/);
    await user.keyboard("{End}");
    expect(sortableOrder()).toEqual(["beta", "gamma", "alpha"]);
    expect(announcer).toHaveTextContent("alpha moved to position 3 of 3.");
    expect(screen.getByRole("listitem", { name: "alpha" })).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(sortableOrder()).toEqual(["alpha", "beta", "gamma"]);
    expect(announcer).toHaveTextContent(/alpha returned to position 1 of 3/);
  });
});

describe("resizing and picker contracts", () => {
  it("exposes an ARIA separator, disabled state, and all panel slots", async () => {
    const user = userEvent.setup();
    const onLayoutChanged = vi.fn();
    const { container } = render(
      <div style={{ height: 300, width: 600 }}>
        <ResizablePanelGroup
          defaultLayout={[50, 50]}
          onLayoutChanged={onLayoutChanged}
        >
          <ResizablePanel id="left">Left</ResizablePanel>
          <ResizableHandle aria-label="Resize panels" withHandle />
          <ResizablePanel id="right">Right</ResizablePanel>
        </ResizablePanelGroup>
      </div>,
    );

    const handle = screen.getByRole("separator", { name: "Resize panels" });
    expect(handle).toHaveAttribute("aria-orientation", "vertical");
    await user.click(handle);
    await user.keyboard("{ArrowRight}");
    expect(
      container.querySelectorAll('[data-slot="resizable-panel"]'),
    ).toHaveLength(2);
  });

  it("ends a resize drag on pointercancel or unmount and ignores other buttons", () => {
    // Report a real size so the group allows dragging.
    const offsetWidth = vi
      .spyOn(HTMLElement.prototype, "offsetWidth", "get")
      .mockReturnValue(300);
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(private readonly callback: ResizeObserverCallback) {}
        observe(target: Element) {
          this.callback([{ target } as ResizeObserverEntry], this);
        }
        unobserve() {}
        disconnect() {}
      },
    );
    try {
      const { unmount } = render(
        <ResizablePanelGroup defaultLayout={[50, 50]}>
          <ResizablePanel id="left">Left</ResizablePanel>
          <ResizableHandle aria-label="Resize panels" />
          <ResizablePanel id="right">Right</ResizablePanel>
        </ResizablePanelGroup>,
      );
      const handle = screen.getByRole("separator", { name: "Resize panels" });

      fireEvent.pointerDown(handle, { button: 2, pointerId: 1 });
      expect(cursorLock()).toBeNull();

      fireEvent.pointerDown(handle, { button: 0, pointerId: 1 });
      expect(cursorLock()).not.toBeNull();
      fireEvent(window, new Event("pointercancel"));
      expect(cursorLock()).toBeNull();

      fireEvent.pointerDown(handle, { button: 0, pointerId: 1 });
      expect(cursorLock()).not.toBeNull();
      unmount();
      expect(cursorLock()).toBeNull();
    } finally {
      vi.unstubAllGlobals();
      offsetWidth.mockRestore();
    }
  });

  it("updates ruler picker value through keyboard-driven scrolling", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <RulerPicker
        defaultValue={1}
        itemWidth={20}
        max={3}
        min={0}
        onChange={onChange}
      />,
    );
    const ruler = screen.getByRole("slider", { name: "Ruler Picker" });
    ruler.focus();
    await user.keyboard("{ArrowRight}");
    const track = container.querySelector<HTMLElement>(
      '[data-slot="ruler-picker-track"]',
    );
    expect(track).not.toBeNull();
    fireEvent.scroll(track!);
    expect(onChange).toHaveBeenLastCalledWith(2);
    expect(ruler).toHaveAttribute("aria-valuenow", "2");

    // Home/End jump to the ends; PageUp steps ten, clamped to max.
    await user.keyboard("{Home}");
    fireEvent.scroll(track!);
    expect(ruler).toHaveAttribute("aria-valuenow", "0");
    await user.keyboard("{PageUp}");
    fireEvent.scroll(track!);
    expect(ruler).toHaveAttribute("aria-valuenow", "3");
    await user.keyboard("{ArrowDown}");
    fireEvent.scroll(track!);
    expect(onChange).toHaveBeenLastCalledWith(2);
  });

  it("announces wheel values, marks disabled options, and roves focus in groups", async () => {
    const user = userEvent.setup();
    const options = [
      { label: "Alpha", value: "a" },
      { disabled: true, label: "Beta", value: "b" },
      { label: "Charlie", value: "c" },
    ];
    render(
      <WheelPickerGroup aria-label="Schedule">
        <WheelPicker
          aria-label="Letter"
          defaultValue="a"
          options={options}
          size="sm"
        />
        <WheelPicker
          aria-label="Number"
          defaultValue={1}
          options={[
            { label: "One", value: 1 },
            { label: "Two", value: 2 },
          ]}
        />
      </WheelPickerGroup>,
    );

    const letter = screen.getByRole("spinbutton", { name: "Letter" });
    expect(letter).toHaveAttribute("aria-valuetext", "Alpha");
    expect(letter).toHaveAttribute("aria-valuenow", "0");
    expect(
      document.querySelector(
        '[data-slot="wheel-picker-option"][data-disabled]',
      ),
    ).not.toBeNull();
    await user.click(letter);
    fireEvent.keyDown(letter, { key: "ArrowRight" });
    expect(screen.getByRole("spinbutton", { name: "Number" })).toHaveFocus();
    expect(wheelPickerVariants({ size: "lg" })).toContain("h-[260px]");
  });

  it("treats a cancelled touch on the wheel as no selection", async () => {
    const onValueChange = vi.fn();
    render(
      <WheelPicker
        aria-label="Letter"
        defaultValue="a"
        onValueChange={onValueChange}
        options={[
          { label: "Alpha", value: "a" },
          { label: "Bravo", value: "b" },
          { label: "Charlie", value: "c" },
        ]}
      />,
    );
    const wheel = screen.getByRole("spinbutton", { name: "Letter" });
    const container = wheel.closest("[data-slot=wheel-picker]") ?? wheel;
    // A touch one row below the centre, on "Bravo".
    fireEvent.touchStart(container, { touches: [{ clientY: 180 }] });
    fireEvent.touchCancel(container);
    // Losing window focus mid-press isn't a tap either.
    fireEvent.touchStart(container, { touches: [{ clientY: 180 }] });
    fireEvent.blur(window);
    // Let any scroll animation run out.
    await act(() => new Promise((resolve) => setTimeout(resolve, 1000)));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(wheel).toHaveAttribute("aria-valuetext", "Alpha");
  });
});
