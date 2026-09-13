import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../src/components/alert-dialog";
import {
  Autocomplete,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
  AutocompleteStatus,
} from "../../src/components/autocomplete";
import { Button } from "../../src/components/button";
import {
  ButtonSplit,
  ButtonSplitAction,
  ButtonSplitContent,
  ButtonSplitSeparator,
  ButtonSplitTrigger,
} from "../../src/components/button-split";
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxStatus,
} from "../../src/components/combobox";
import {
  Command,
  CommandCollection,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
  CommandSeparator,
  CommandShortcut,
} from "../../src/components/command";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "../../src/components/context-menu";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "../../src/components/dialog";
import {
  Menu,
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuShortcut,
  MenuTrigger,
} from "../../src/components/menu";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "../../src/components/menubar";
import {
  Popover,
  PopoverClose,
  PopoverDescription,
  PopoverPopup,
  PopoverTitle,
  PopoverTrigger,
} from "../../src/components/popover";
import {
  PreviewCard,
  PreviewCardPopup,
  PreviewCardTrigger,
} from "../../src/components/preview-card";
import {
  Select,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectPopup,
  SelectSeparator,
  SelectTrigger,
  selectTriggerVariants,
  SelectValue,
} from "../../src/components/select";
import { ToastProvider, toastManager } from "../../src/components/toast";
import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "../../src/components/tooltip";

describe("modal and floating-surface contracts", () => {
  it("traps dialog focus, closes through controls and Escape, and restores focus", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger render={<Button>Open settings</Button>} />
        <DialogPopup>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Update preferences.</DialogDescription>
          </DialogHeader>
          <DialogPanel>
            <input aria-label="Display name" />
          </DialogPanel>
          <DialogFooter variant="bare">
            <DialogClose render={<Button>Done</Button>} />
          </DialogFooter>
        </DialogPopup>
      </Dialog>,
    );

    const trigger = screen.getByRole("button", { name: "Open settings" });
    await user.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Settings" });
    expect(dialog).toBeVisible();
    expect(screen.getByRole("textbox", { name: "Display name" })).toHaveFocus();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();

    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Done" }));
    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", { name: "Settings" }),
      ).not.toBeInTheDocument(),
    );
  });

  it("requires an explicit alert-dialog decision and restores its trigger", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(
      <AlertDialog>
        <AlertDialogTrigger render={<Button>Delete project</Button>} />
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogClose
              render={<Button variant="outline">Cancel</Button>}
            />
            <AlertDialogClose
              onClick={onConfirm}
              render={<Button variant="destructive">Delete</Button>}
            />
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>,
    );

    const trigger = screen.getByRole("button", { name: "Delete project" });
    await user.click(trigger);
    const dialog = screen.getByRole("alertdialog", { name: "Delete project?" });
    expect(dialog).toHaveAccessibleDescription("This cannot be undone.");
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(onConfirm).toHaveBeenCalledOnce();
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("opens and closes a popover with title and description semantics", async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger render={<Button>Open details</Button>} />
        <PopoverPopup>
          <PopoverTitle>Details</PopoverTitle>
          <PopoverDescription>Additional information.</PopoverDescription>
          <PopoverClose render={<Button>Close details</Button>} />
        </PopoverPopup>
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "Open details" }));
    const popup = document.querySelector('[data-slot="popover-popup"]');
    expect(popup).not.toBeNull();
    expect(screen.getByText("Details")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Close details" }));
    await waitFor(() =>
      expect(
        screen.queryByText("Additional information."),
      ).not.toBeInTheDocument(),
    );
  });

  it("opens tooltip through keyboard focus and preview card through pointer hover", async () => {
    const user = userEvent.setup();

    render(
      <>
        <TooltipProvider delay={0}>
          <Tooltip>
            <TooltipTrigger
              aria-label="Helpful text"
              render={<button type="button">Help</button>}
            />
            <TooltipPopup>Helpful text</TooltipPopup>
          </Tooltip>
        </TooltipProvider>
        <PreviewCard>
          <PreviewCardTrigger href="/profile">Profile</PreviewCardTrigger>
          <PreviewCardPopup>Profile preview</PreviewCardPopup>
        </PreviewCard>
      </>,
    );

    await user.tab();
    expect(await screen.findByText("Helpful text")).toBeVisible();
    await user.unhover(screen.getByRole("button", { name: "Helpful text" }));

    await user.hover(screen.getByRole("link", { name: "Profile" }));
    expect(await screen.findByText("Profile preview")).toBeVisible();
  });
});

describe("menu contracts", () => {
  it("handles action, checkbox, radio, disabled, and keyboard menu states", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const onCheckedChange = vi.fn();
    const onValueChange = vi.fn();

    render(
      <Menu>
        <MenuTrigger render={<Button>Actions</Button>} />
        <MenuPopup>
          <MenuGroup>
            <MenuGroupLabel>Editing</MenuGroupLabel>
            <MenuItem onClick={onAction}>
              Rename
              <MenuShortcut>R</MenuShortcut>
            </MenuItem>
            <MenuItem disabled>Unavailable</MenuItem>
            <MenuCheckboxItem checked onCheckedChange={onCheckedChange}>
              Show labels
            </MenuCheckboxItem>
            <MenuCheckboxItem checked={false} variant="switch">
              Compact mode
            </MenuCheckboxItem>
          </MenuGroup>
          <MenuSeparator />
          <MenuRadioGroup onValueChange={onValueChange} value="list">
            <MenuRadioItem value="list">List</MenuRadioItem>
            <MenuRadioItem value="grid">Grid</MenuRadioItem>
          </MenuRadioGroup>
        </MenuPopup>
      </Menu>,
    );

    await user.click(screen.getByRole("button", { name: "Actions" }));
    const menu = await screen.findByRole("menu");
    expect(within(menu).getByText("Editing")).toBeVisible();
    expect(
      within(menu).getByRole("menuitem", { name: "Unavailable" }),
    ).toHaveAttribute("aria-disabled", "true");
    await user.click(
      within(menu).getByRole("menuitemcheckbox", { name: "Show labels" }),
    );
    expect(onCheckedChange).toHaveBeenCalledWith(false, expect.anything());

    await user.click(screen.getByRole("menuitemradio", { name: "Grid" }));
    expect(onValueChange).toHaveBeenCalledWith("grid", expect.anything());

    await user.click(screen.getByRole("menuitem", { name: /Rename/ }));
    expect(onAction).toHaveBeenCalledOnce();
  });

  it("opens a context menu and supports all item families", async () => {
    const user = userEvent.setup();

    render(
      <ContextMenu>
        <ContextMenuTrigger>Context target</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuLabel>Actions</ContextMenuLabel>
            <ContextMenuItem>
              Copy
              <ContextMenuShortcut>⌘C</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuCheckboxItem checked>Favorite</ContextMenuCheckboxItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuRadioGroup value="small">
            <ContextMenuRadioItem value="small">Small</ContextMenuRadioItem>
            <ContextMenuRadioItem value="large">Large</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>,
    );

    await user.pointer({
      keys: "[MouseRight]",
      target: screen.getByText("Context target"),
    });
    const menu = await screen.findByRole("menu");
    expect(within(menu).getByRole("menuitem", { name: /Copy/ })).toBeVisible();
    expect(
      within(menu).getByRole("menuitemcheckbox", { name: "Favorite" }),
    ).toHaveAttribute("aria-checked", "true");
    expect(
      within(menu).getByRole("menuitemradio", { name: "Small" }),
    ).toHaveAttribute("aria-checked", "true");
  });

  it("opens menubar menus and moves between triggers by keyboard", async () => {
    const user = userEvent.setup();

    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              New
              <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarCheckboxItem checked>Autosave</MenubarCheckboxItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup value="word">
              <MenubarRadioItem value="word">Word wrap</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    );

    const file = screen.getByRole("menuitem", { name: "File" });
    await user.click(file);
    expect(await screen.findByRole("menuitem", { name: /New/ })).toBeVisible();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(
      await screen.findByRole("menuitemradio", { name: "Word wrap" }),
    ).toBeVisible();
  });
});

describe("choice popup contracts", () => {
  it("selects grouped options, exposes placeholder and disabled state, and closes", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Select onValueChange={onValueChange}>
        <SelectTrigger aria-label="Framework">
          <SelectValue placeholder="Choose a framework" />
        </SelectTrigger>
        <SelectPopup>
          <SelectGroup>
            <SelectGroupLabel>Frameworks</SelectGroupLabel>
            <SelectItem value="react">React</SelectItem>
            <SelectItem disabled value="vue">
              Vue
            </SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectItem value="svelte">Svelte</SelectItem>
        </SelectPopup>
      </Select>,
    );

    expect(selectTriggerVariants({ size: "sm" })).toContain("min-h-8");
    const trigger = screen.getByRole("combobox", { name: "Framework" });
    expect(trigger).toHaveTextContent("Choose a framework");
    await user.click(trigger);
    expect(await screen.findByRole("option", { name: "Vue" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await user.click(screen.getByRole("option", { name: "React" }));
    expect(onValueChange).toHaveBeenCalledWith("react", expect.anything());
    expect(trigger).toHaveTextContent("react");
  });

  it("filters and selects autocomplete items, then clears the value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const items = ["Apple", "Banana", "Cherry"];

    render(
      <Autocomplete items={items} onValueChange={onValueChange}>
        <AutocompleteInput
          aria-label="Fruit"
          placeholder="Search fruit"
          showClear
          showTrigger
        />
        <AutocompletePopup>
          <AutocompleteStatus />
          <AutocompleteList>
            {(item: string) => (
              <AutocompleteItem key={item} value={item}>
                {item}
              </AutocompleteItem>
            )}
          </AutocompleteList>
          <AutocompleteEmpty>No fruit found</AutocompleteEmpty>
        </AutocompletePopup>
      </Autocomplete>,
    );

    const input = screen.getByRole("combobox", { name: "Fruit" });
    await user.type(input, "Ban");
    expect(await screen.findByRole("option", { name: "Banana" })).toBeVisible();
    expect(
      screen.queryByRole("option", { name: "Apple" }),
    ).not.toBeInTheDocument();
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("Banana", expect.anything());
    await user.click(screen.getByRole("button", { name: "Clear value" }));
    expect(input).toHaveValue("");
  });

  it("filters and selects combobox items, including empty and disabled states", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const items = ["London", "Paris", "Tokyo"];

    render(
      <Combobox items={items} onValueChange={onValueChange}>
        <ComboboxInput aria-label="City" showClear />
        <ComboboxPopup>
          <ComboboxStatus />
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem disabled={item === "Tokyo"} key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
          <ComboboxEmpty>No city found</ComboboxEmpty>
        </ComboboxPopup>
      </Combobox>,
    );

    const input = screen.getByRole("combobox", { name: "City" });
    await user.type(input, "Par");
    expect(await screen.findByRole("option", { name: "Paris" })).toBeVisible();
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("Paris", expect.anything());
  });
});

describe("command and toast contracts", () => {
  it("filters a command collection and supports empty, shortcut, separator, and footer slots", async () => {
    const user = userEvent.setup();
    const items = ["Open file", "Save file"];

    render(
      <Command items={items}>
        <CommandPanel>
          <CommandInput aria-label="Commands" placeholder="Search commands" />
          <CommandList>
            <CommandGroup>
              <CommandGroupLabel>Files</CommandGroupLabel>
              <CommandCollection>
                {(item: string) => (
                  <CommandItem key={item} value={item}>
                    {item}
                    <CommandShortcut>⌘</CommandShortcut>
                  </CommandItem>
                )}
              </CommandCollection>
            </CommandGroup>
            <CommandSeparator />
            <CommandEmpty>No commands</CommandEmpty>
          </CommandList>
        </CommandPanel>
        <CommandFooter>2 commands</CommandFooter>
      </Command>,
    );

    const input = screen.getByRole("combobox", { name: "Commands" });
    await user.type(input, "missing");
    expect(screen.getByText("No commands")).toBeVisible();
    await user.clear(input);
    expect(screen.getByRole("option", { name: /Open file/ })).toBeVisible();
    expect(screen.getByText("2 commands")).toHaveAttribute(
      "data-slot",
      "command-footer",
    );
  });

  it("announces, acts on, and dismisses typed toast states", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    render(
      <ToastProvider closeButton timeout={10_000}>
        App
      </ToastProvider>,
    );
    act(() => {
      toastManager.add({
        actionProps: { children: "Undo", onClick: onAction },
        description: "The file was saved.",
        title: "Saved",
        type: "success",
      });
    });

    const toast = await screen.findByRole("dialog", { name: "Saved" });
    expect(toast).toHaveTextContent("Saved");
    expect(toast).toHaveTextContent("The file was saved.");
    await user.click(within(toast).getByRole("button", { name: "Undo" }));
    expect(onAction).toHaveBeenCalledOnce();

    act(() => {
      toastManager.add({ description: "Still working", type: "loading" });
    });
    const loadingToast = screen
      .getByText("Still working")
      .closest('[role="dialog"]');
    expect(loadingToast).not.toBeNull();
    await user.click(
      within(loadingToast as HTMLElement).getByRole("button", {
        name: "Close",
      }),
    );
    await waitFor(() =>
      expect(screen.queryByText("Still working")).not.toBeInTheDocument(),
    );
  });
});

describe("compound action contracts", () => {
  it("inherits button-split variants and opens its popup action list", async () => {
    const user = userEvent.setup();
    const onPrimary = vi.fn();

    render(
      <ButtonSplit size="sm" variant="outline">
        <ButtonSplitAction onClick={onPrimary}>Save</ButtonSplitAction>
        <ButtonSplitSeparator />
        <ButtonSplitTrigger aria-label="More save actions" />
        <ButtonSplitContent>
          <button type="button">Save as copy</button>
        </ButtonSplitContent>
      </ButtonSplit>,
    );

    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onPrimary).toHaveBeenCalledOnce();
    await user.click(screen.getByRole("button", { name: "More save actions" }));
    expect(
      await screen.findByRole("button", { name: "Save as copy" }),
    ).toBeVisible();
  });
});
