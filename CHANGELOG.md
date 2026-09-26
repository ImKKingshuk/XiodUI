# Changelog

All notable changes to `xiod-ui` are recorded here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Swappable icons.** Every icon the components render can now be replaced
  with your own. Use any icon library, an inline `<svg>`, or an emoji.

  Change one instance with a prop. Parts with a single icon take `icon`; parts
  with several take named props such as `prevIcon` / `nextIcon` or
  `triggerIcon` / `clearIcon`:

  ```tsx
  <DrawerClose closeIcon={<XMarkIcon className="size-4" />} />
  ```

  Change an icon everywhere with `IconProvider`:

  ```tsx
  import { IconProvider } from "xiod-ui/icon-provider";

  <IconProvider icons={{ Cancel: XMarkIcon, Check: CheckIcon }}>
    <App />
  </IconProvider>;
  ```

  A prop beats the provider, and the provider beats the built-in icon, so
  existing code is unaffected. Pass `null` to an icon prop to render no icon at
  all. FileUpload's file-type icons and AgentSteps' status icons follow the
  content, so change those through the provider.

  See [Icons](https://github.com/ImKKingshuk/XiodUI#icons) for the full list of
  replaceable icons.

- **`render` on 31 more components**, so you can swap the rendered element or
  merge a component into one of your own anywhere in the library: AgentSteps,
  Alert, AlertDialog, Breadcrumb, ButtonGroup, Calendar, Carousel, ColorPicker,
  Command, ContextMenu, DatePicker, Dialog, DotMatrix, Empty, FileUpload, Frame,
  Group, InputGroup, Kbd, KineticClick, Marker, Menu, Message, NavigationMenu,
  Pagination, Resizable, RulerPicker, Sidebar, Skeleton, Table, Waveform and
  WheelPicker.

- **An agent skill**, so coding assistants know the library's real API instead of
  guessing at it. Install it with `npx skills add ImKKingshuk/XiodUI`.

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

- Autocomplete and Command items put an 8px gap (`gap-2`) between an icon and
  the label, as Menu items do. The icon used to sit flush against the text.

- Graphics no longer shrink to icon size inside another component. Loader,
  Gauge, CircularProgress, DotMatrix and the 16 InputPayment card logos drew at
  16px when nested in a Button, Empty, InputGroup or Sidebar —
  `<Button><Loader size="lg" /></Button>` put a small spinner in a large box.
- Repeating stylesheets. AgentSteps, DotMatrix and MorphicToast no longer add a
  duplicate `<style>` block for every instance you mount.

## [1.0.3] — 2026-09-19

### Fixed

- ColorPicker: the sliders no longer swing to a cramped edge. A placement is
  used only when there is room on both sides of that axis, so a tight top no
  longer forces a vertical layout when left and right are wide open.
- ColorPicker: the arcs no longer jump to the other side while the picker is
  closing. They hold their position through the fade-out.

## [1.0.2] — 2026-09-19

### Fixed

- ColorPicker and MorphicToast rendered at icon size: the arc sliders, the ring
  and the gooey pill all collapsed to 16px.
- DashboardGrid pushed wide tiles off-screen. Any tile spanning more than one
  column was positioned too far to the right.

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
