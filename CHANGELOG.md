# Changelog

All notable changes to `xiod-ui` are recorded here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `render` prop support for composition on 31 more components, bringing them in
  line with the rest of the library: AgentSteps, Alert, AlertDialog, Breadcrumb,
  ButtonGroup, Calendar, Carousel, ColorPicker, Command, ContextMenu, DatePicker,
  Dialog, DotMatrix, Empty, FileUpload, Frame, Group, InputGroup, Kbd,
  KineticClick, Marker, Menu, Message, NavigationMenu, Pagination, Resizable,
  RulerPicker, Sidebar, Skeleton, Table, Waveform and WheelPicker.
- An agent skill at `skills/xiod-ui` — `SKILL.md` plus a generated reference page
  for each of the 89 components. Install it with `npx skills add ImKKingshuk/XiodUI`.

### Changed

- **Breaking.** Removed 38 compatibility aliases. Every part keeps its real name; there is
  now exactly one name per export.

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

  `ContextMenuPopup` and `ContextMenuSubPopup` were previously reachable only
  through their aliases; they are now exported directly.

### Fixed

- Structural SVG no longer collapses to icon size. 40 components carry
  `[&_svg:not([class*='size-'])]:size-4` to normalize icons; it compiles to a
  descendant selector at specificity (0,2,1), which beats a plain `.h-full` or
  `.w-6`. Loader, Gauge, CircularProgress, DotMatrix and the 16 InputPayment card
  brand logos all drew at the wrong size once nested in a Button, Empty,
  InputGroup or Sidebar — `<Button><Loader size="lg" /></Button>` rendered a 16px
  spinner inside a 32px box. All 32 now carry `size-auto`, and audit RULE 31
  rejects any new inline `<svg>` that states a size without opting out.
- MorphicToast's design tokens (`--morphic-duration`, `--morphic-spring-easing`,
  `--morphic-state-*`) moved from a component-injected `<style>` into
  `xiod-ui/styles`. Injected at runtime they landed after the consumer's
  stylesheet and could not be overridden.

### Changed

- AgentSteps, DotMatrix and MorphicToast tag their injected `<style>` with `href`
  and `precedence`, so React hoists each into `<head>` once rather than repeating
  it per mounted instance.
- `dangerouslySetInnerHTML` is gone from the library entirely.

## [1.0.3] — 2026-09-19

### Fixed

- ColorPicker: adaptive slider placement now requires room on _both_ sides of an
  axis before choosing it. Testing one side at a time let a cramped top force a
  vertical placement even when left and right were both wide open.
- ColorPicker: the arcs no longer jump to their resting side while the picker
  collapses. They stay mounted for the fade-out, so the axis in effect while open
  is kept until the next expand recomputes it.

## [1.0.2] — 2026-09-19

### Fixed

- ColorPicker and MorphicToast: structural SVG canvases — the arc sliders, the
  ring, the gooey pill — no longer collapse to icon size. The library's own icon
  normalizer (`[&_svg:not([class*='size-'])]:size-4`) matched them because they
  carried no `size-` class; they now set `size-auto` explicitly.
- DashboardGrid: corrected the tile transform. A percentage in `translate3d`
  resolves against the tile's own border box while its `width` resolves against
  the grid, so `translateX(x * 100%)` moved a tile by that many of its own widths
  and pushed it off-screen for any tile wider than one column.

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
