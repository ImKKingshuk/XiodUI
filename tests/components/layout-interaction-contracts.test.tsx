import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    ).toHaveClass("flex-col");
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
});
