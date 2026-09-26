# Changelog

All notable changes to `xiod-ui` are recorded here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] — 2026-09-26

The components XiodUI builds itself, rather than on a Base UI primitive, now
match Base UI's keyboard, screen reader, touch and reduced-motion behaviour.

### Added

- **Swappable icons.** Replace any built-in icon with your own — from any icon
  library, an inline `<svg>`, or an emoji. Pass an icon prop to change one
  instance (`icon`, or named props such as `prevIcon` / `nextIcon`), or wrap your
  app in `IconProvider` from `xiod-ui/icon-provider` to change it everywhere.
  Existing code is unaffected. See [Icons](https://github.com/ImKKingshuk/XiodUI#icons).

- **`render` on 31 more components**, so you can swap the rendered element or
  merge a component into one of your own anywhere in the library: AgentSteps,
  Alert, AlertDialog, Breadcrumb, ButtonGroup, Calendar, Carousel, ColorPicker,
  Command, ContextMenu, DatePicker, Dialog, DotMatrix, Empty, FileUpload, Frame,
  Group, InputGroup, Kbd, KineticClick, Marker, Menu, Message, NavigationMenu,
  Pagination, Resizable, RulerPicker, Sidebar, Skeleton, Table, Waveform and
  WheelPicker.

- **An agent skill**, so coding assistants know the library's real API instead of
  guessing at it. Install it with `npx skills add ImKKingshuk/XiodUI`.

- `PreviewCardCreateHandle`, to open a PreviewCard from a trigger outside it, as
  Dialog, Popover, Tooltip and the other popups already allow.

- Form support: `name` on ListBox and InputPhone (InputPhone submits the E.164
  number), and `defaultValue` on ListBox. FileUpload's input now carries
  dropped files too, so a plain form submit sends them.

- `onFilesRejected` on FileUpload, for files over `maxFiles`.

- `DraggableHandle`, to move a Draggable panel from a part you choose.

- `onError` on `useCopyToClipboard`.

### Changed

- **Breaking. 38 compatibility aliases were removed.** Each part now has exactly
  one name. If you used any of the names on the left, rename them:

  | Removed                                                               | Use instead                                                                 |
  | :-------------------------------------------------------------------- | :-------------------------------------------------------------------------- |
  | `DropdownMenu`, `DropdownMenu*` (16 exports)                          | `Menu`, `Menu*`                                                             |
  | `HoverCard`, `HoverCardArrow`, `HoverCardContent`, `HoverCardTrigger` | `PreviewCard`, `PreviewCardArrow`, `PreviewCardPopup`, `PreviewCardTrigger` |
  | `DialogContent`, `AlertDialogContent`                                 | `DialogPopup`, `AlertDialogPopup`                                           |
  | `DialogOverlay`, `AlertDialogOverlay`                                 | `DialogBackdrop`, `AlertDialogBackdrop`                                     |
  | `PopoverContent`, `SelectContent`, `TooltipContent`                   | `PopoverPopup`, `SelectPopup`, `TooltipPopup`                               |
  | `MenubarContent`, `MenubarSubContent`                                 | `MenubarPopup`, `MenubarSubPopup`                                           |
  | `ContextMenuContent`, `ContextMenuSubContent`                         | `ContextMenuPopup`, `ContextMenuSubPopup`                                   |
  | `AccordionContent`, `CardContent`, `CollapsibleContent`               | `AccordionPanel`, `CardPanel`, `CollapsiblePanel`                           |
  | `TabsContent`, `TabsTrigger`                                          | `TabsPanel`, `TabsTab`                                                      |
  | `RadioGroup`, `RadioGroupItem`                                        | `Radio`, `RadioItem`                                                        |

  The import path and the props are unchanged — only the name moves.

- MorphicToast's animation and colour tokens (`--morphic-duration`,
  `--morphic-spring-easing`, `--morphic-state-*`) moved into `xiod-ui/styles`,
  so you can now override them from your own stylesheet.

- ListBox is a single tab stop: arrow keys, Home/End and typing a letter
  move between options, as in a native list box.

- `copyToClipboard` from `useCopyToClipboard` now resolves to whether the copy
  succeeded.

### Fixed

- An icon in an Autocomplete or Command item no longer sits flush against its
  label.
- Loader, Gauge, CircularProgress, DotMatrix and the InputPayment card logos
  no longer shrink to icon size inside a Button, Empty, InputGroup or Sidebar.
- AgentSteps, DotMatrix and MorphicToast no longer add a copy of their styles
  to the page for every instance, and each DotMatrix keeps its own speed,
  gradient and glow.
- **Keyboard:**
  - Calendar supports Home/End, PageUp/PageDown (Shift for a year) and no
    longer takes focus when it re-renders.
  - The ColorPicker arcs, DashboardGrid tiles, Draggable panels and Sortable
    items can be moved and resized from the keyboard. Escape cancels a
    Sortable move.
  - RulerPicker supports every slider key.
  - InputPhone's country list works with the arrow keys and Enter.
  - Carousel's arrow keys no longer fire from text fields or sliders inside a
    slide.
  - Drawer menu items and the MorphicToast action show keyboard focus.
- **Screen readers:**
  - Moves in DashboardGrid and Sortable are announced, and so are FileUpload
    changes (including rejected files), AgentSteps progress and MorphicToast
    messages. MorphicToast now announces its first toast and no longer reads
    each toast twice.
  - Step statuses and upload errors are spoken, not only shown.
- **Pointer and touch:**
  - Right and middle clicks no longer start drags, and an interrupted touch
    drag snaps back instead of sticking.
  - A Resizable drag cut short (by the browser or by unmounting) no longer
    leaves the resize cursor on the page, and handles work with touch.
  - A cancelled touch on WheelPicker no longer selects a value.
  - FileUpload's drop zone no longer flickers as the pointer crosses its
    content.
  - Backspace over a `(`, `)` or `-` in InputPhone deletes the digit before
    it instead of doing nothing, and the caret stays in place.
- **Reduced motion:** Waveform, WheelPicker, RulerPicker, Carousel autoplay,
  AgentSteps, KineticClick, MorphicToast and CopyToClipboard all respect it.
- **Focus:** removing a FileUpload file or clearing InputPhone keeps focus
  where you are.
- InputSensitive's text no longer runs under its copy and reveal buttons, the
  reveal button works while the value is masked, and copying works on plain
  `http` pages.
- MorphicToast stays open while it has focus or the tab is in the
  background, and its shape renders with any toast `id`.
- CopyToClipboard works on plain `http` pages and shows "Copied!" only after
  a copy succeeds.
- KineticClick is sharp on high-density screens and bursts from the element
  when triggered from the keyboard.
- Waveform draws only while something changes, instead of every frame.
- `SidebarMenuButton variant="outline"` draws its border again, and a
  SidebarMenuButton or SidebarMenuAction that opens a Menu keeps its open
  styles while the menu is open.

## [1.0.3] — 2026-09-19

### Fixed

- ColorPicker: the sliders no longer open toward a cramped edge when there is
  room on the other side.
- ColorPicker: the arcs no longer jump to the other side while the picker
  closes.

## [1.0.2] — 2026-09-19

### Fixed

- ColorPicker's sliders and MorphicToast's pill no longer shrink to icon size.
- DashboardGrid no longer pushes tiles that span several columns off-screen.

## [1.0.1] — 2026-09-17

### Changed

- Updated the `xiod-icons` dependency.

## [1.0.0] — 2026-09-13

Initial public release.

### Added

- 89 accessible components built on [Base UI](https://base-ui.com) and Tailwind CSS 4.
- 19 colour palettes — 9 core (clay, sepia, sage, lagoon, cobalt, iris, roast,
  crimson, sorbet) and 10 expressive (riso, afterglow, cathode, ion, cel, taffy,
  mochi, toxin, cinder, blacklight).
- Per-component subpath exports (`xiod-ui/button`), a design-token stylesheet at
  `xiod-ui/styles`, and `ThemeProvider` / `useTheme` at `xiod-ui/theme-provider`.
