import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "../../src/components/collapsible";
import {
  ListBox,
  ListBoxGroup,
  ListBoxItem,
  ListBoxLabel,
  ListBoxSeparator,
} from "../../src/components/list-box";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIcon,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPopup,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "../../src/components/navigation-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationInput,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../src/components/pagination";
import { ScrollArea } from "../../src/components/scroll-area";
import { scrollBarVariants } from "../../src/components/scroll-bar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "../../src/components/sidebar";

const option = (name: string) => screen.getByRole("option", { name });

describe("navigation and disclosure contracts", () => {
  it("opens, closes, and disables a collapsible section", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <Collapsible>
        <CollapsibleTrigger>Details</CollapsibleTrigger>
        <CollapsiblePanel>Hidden details</CollapsiblePanel>
      </Collapsible>,
    );

    const trigger = screen.getByRole("button", { name: "Details" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Hidden details")).toBeVisible();

    rerender(
      <Collapsible disabled>
        <CollapsibleTrigger>Details</CollapsibleTrigger>
        <CollapsiblePanel>Hidden details</CollapsiblePanel>
      </Collapsible>,
    );
    expect(screen.getByRole("button", { name: "Details" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("supports single and multiple list-box selection plus keyboard focus", async () => {
    const user = userEvent.setup();
    const onSingleChange = vi.fn();
    const onMultipleChange = vi.fn();

    render(
      <>
        <ListBox aria-label="Single choice" onValueChange={onSingleChange}>
          <ListBoxGroup>
            <ListBoxLabel>Languages</ListBoxLabel>
            <ListBoxItem value="typescript">TypeScript</ListBoxItem>
            <ListBoxItem disabled value="rust">
              Rust
            </ListBoxItem>
            <ListBoxSeparator />
            <ListBoxItem value="go">Go</ListBoxItem>
          </ListBoxGroup>
        </ListBox>
        <ListBox
          aria-label="Multiple choice"
          multiple
          onValueChange={onMultipleChange}
          value={["alpha"]}
        >
          <ListBoxItem value="alpha">Alpha</ListBoxItem>
          <ListBoxItem value="beta">Beta</ListBoxItem>
        </ListBox>
      </>,
    );

    const single = screen.getByRole("listbox", { name: "Single choice" });
    single.focus();
    // Focus highlights the first option; Enter selects it.
    await user.keyboard("{Enter}");
    expect(onSingleChange).toHaveBeenCalledWith("typescript");
    await user.click(screen.getByRole("option", { name: "Go" }));
    expect(onSingleChange).toHaveBeenLastCalledWith("go");
    expect(screen.getByRole("option", { name: "Rust" })).toHaveAttribute(
      "data-disabled",
      "true",
    );

    await user.click(screen.getByRole("option", { name: "Beta" }));
    expect(onMultipleChange).toHaveBeenCalledWith(["alpha", "beta"]);
    expect(screen.getByRole("option", { name: "Alpha" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("keeps a list box to one tab stop with an active descendant", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <ListBox aria-label="Fruit" name="fruit" defaultValue="banana">
          <ListBoxItem value="apple">Apple</ListBoxItem>
          <ListBoxItem value="banana">Banana</ListBoxItem>
          <ListBoxItem disabled value="cherry">
            Cherry
          </ListBoxItem>
          <ListBoxItem value="date">Date</ListBoxItem>
          <ListBoxItem value="durian">Durian</ListBoxItem>
        </ListBox>
        <button type="button">After</button>
      </form>,
    );
    const list = screen.getByRole("listbox", { name: "Fruit" });
    const active = () =>
      document.getElementById(list.getAttribute("aria-activedescendant")!);

    await user.tab();
    expect(list).toHaveFocus();
    // The selected option is highlighted on entry.
    expect(active()).toBe(option("Banana"));

    // Disabled options are skipped and marked for assistive tech.
    await user.keyboard("{ArrowDown}");
    expect(active()).toBe(option("Date"));
    expect(option("Cherry")).toHaveAttribute("aria-disabled", "true");

    await user.keyboard("{Home}");
    expect(active()).toBe(option("Apple"));
    await user.keyboard("{End}");
    expect(active()).toBe(option("Durian"));

    // Typeahead, and a repeated letter cycles.
    await user.keyboard("a");
    expect(active()).toBe(option("Apple"));
    await new Promise((resolve) => setTimeout(resolve, 600));
    await user.keyboard("d");
    expect(active()).toBe(option("Date"));
    await user.keyboard("d");
    expect(active()).toBe(option("Durian"));

    await user.keyboard(" ");
    expect(option("Durian")).toHaveAttribute("aria-selected", "true");
    expect(
      container.querySelector<HTMLInputElement>("input[name=fruit]")?.value,
    ).toBe("durian");

    // The options aren't tab stops: Tab leaves the list.
    await user.tab();
    expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
  });

  it("renders pagination semantics and clamps typed pages", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationFirst href="/page/1" />
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious href="/page/2" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="/page/3" isActive>
              3
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationInput onChange={onChange} totalPages={5} value={3} />
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="/page/4" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLast href="/page/5" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );

    expect(
      screen.getByRole("navigation", { name: "pagination" }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "3" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByRole("link", { name: "Go to first page" }),
    ).toHaveAttribute("href", "/page/1");

    const input = screen.getByRole("textbox", { name: "Go to page" });
    await user.clear(input);
    await user.type(input, "99{Enter}");
    expect(input).toHaveValue("5");
    expect(onChange).toHaveBeenLastCalledWith(5);
    await user.clear(input);
    await user.type(input, "invalid{Enter}");
    expect(input).toHaveValue("1");
    expect(onChange).toHaveBeenLastCalledWith(1);
  });

  it("opens a navigation-menu popup and exposes its structural parts", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem value="products">
            <NavigationMenuTrigger>
              Products
              <NavigationMenuIcon />
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="/widgets">Widgets</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuPopup>
          <NavigationMenuViewport />
        </NavigationMenuPopup>
        <NavigationMenuIndicator />
      </NavigationMenu>,
    );

    await user.click(screen.getByRole("button", { name: "Products" }));
    expect(
      await screen.findByRole("link", { name: "Widgets" }),
    ).toHaveAttribute("href", "/widgets");
    expect(
      document.querySelector('[data-slot="navigation-menu-viewport"]'),
    ).not.toBeNull();
    expect(
      container.querySelector('[data-slot="navigation-menu-indicator"]'),
    ).not.toBeNull();
  });

  it("renders a scroll viewport and covers all scrollbar states", async () => {
    for (const size of ["sm", "md", "lg"] as const) {
      for (const visibility of ["auto", "always", "hover"] as const) {
        for (const variant of ["default", "card"] as const) {
          expect(scrollBarVariants({ size, variant, visibility })).toContain(
            "select-none",
          );
        }
      }
    }

    const { container } = render(
      <div style={{ height: 100, width: 100 }}>
        <ScrollArea
          scrollFade
          scrollbarGutter
          scrollbarSize="lg"
          scrollbarVariant="card"
          scrollbarVisibility="always"
        >
          <div style={{ height: 300, width: 300 }}>Scrollable content</div>
        </ScrollArea>
      </div>,
    );

    expect(screen.getByText("Scrollable content")).toBeVisible();
    expect(
      container.querySelector('[data-slot="scroll-area-viewport"]'),
    ).not.toBeNull();
    // Base UI mounts native-replacement scrollbars only after observing real
    // overflow. JSDOM has no layout engine, so the browser suite owns that
    // assertion; flush mount-time measurement work here to keep cleanup quiet.
    await act(async () => undefined);
  });
});

describe("sidebar contracts", () => {
  it("renders every structural slot and toggles with button and keyboard shortcut", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarInput aria-label="Search navigation" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <SidebarGroupAction aria-label="Add workspace">
                +
              </SidebarGroupAction>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>Overview</SidebarMenuButton>
                    <SidebarMenuAction aria-label="More options">
                      …
                    </SidebarMenuAction>
                    <SidebarMenuBadge>3</SidebarMenuBadge>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuSkeleton showIcon />
                  </SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton href="/reports">
                      Reports
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarSeparator />
          <SidebarFooter>Footer</SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <SidebarTrigger />
          Main content
        </SidebarInset>
      </SidebarProvider>,
    );

    const sidebar = container.querySelector('[data-slot="sidebar"]');
    expect(sidebar).toHaveAttribute("data-state", "expanded");
    const trigger = container.querySelector<HTMLButtonElement>(
      '[data-slot="sidebar-trigger"]',
    );
    expect(trigger).not.toBeNull();
    await user.click(trigger!);
    expect(sidebar).toHaveAttribute("data-state", "collapsed");
    const cookieStoreMock = cookieStore as unknown as {
      set: ReturnType<typeof vi.fn>;
    };
    expect(cookieStoreMock.set).toHaveBeenCalled();

    await user.keyboard("{Control>}b{/Control}");
    expect(sidebar).toHaveAttribute("data-state", "expanded");

    for (const slot of [
      "sidebar-header",
      "sidebar-input",
      "sidebar-content",
      "sidebar-group",
      "sidebar-group-label",
      "sidebar-group-action",
      "sidebar-group-content",
      "sidebar-menu",
      "sidebar-menu-item",
      "sidebar-menu-button",
      "sidebar-menu-action",
      "sidebar-menu-badge",
      "sidebar-menu-skeleton",
      "sidebar-menu-sub",
      "sidebar-menu-sub-item",
      "sidebar-menu-sub-button",
      "sidebar-separator",
      "sidebar-footer",
      "sidebar-rail",
      "sidebar-inset",
      "sidebar-trigger",
    ]) {
      expect(container.querySelector(`[data-slot="${slot}"]`)).not.toBeNull();
    }
    expect(
      within(screen.getByRole("main")).getByText("Main content"),
    ).toBeVisible();
  });
});
