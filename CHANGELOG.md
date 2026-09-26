# Changelog

All notable changes to `xiod-ui` are recorded here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] — 2026-09-26

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

### Fixed

- An icon in an Autocomplete or Command item no longer sits flush against its
  label.
- Loader, Gauge, CircularProgress, DotMatrix and the InputPayment card logos
  no longer shrink to icon size inside a Button, Empty, InputGroup or Sidebar.
- AgentSteps, DotMatrix and MorphicToast no longer add a copy of their styles
  to the page for every instance.

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
