# XiodUI

Precision-Crafted React Component Library - 90 Components, 20 Palettes, Native CSS Animations, Light and Dark Themes. Built on Base UI and Tailwind CSS 4. One npm Package, Nothing Extra to Install.

XiodUI gives you production-ready buttons, forms, overlays, navigation, data display, and layout components that share one design language. Interactive behavior and accessibility come from Base UI primitives; styling comes from Tailwind CSS 4 and a set of CSS variables you can theme. Motion is written in plain CSS inside the components — so controls animate their own state, not just their enter and exit.

Everything ships as a single versioned npm package. Import one component at a time from its own subpath (`xiod-ui/button`), and only what you import ends up in your bundle. Base UI and [XiodIcons](https://icons.xiod.dev) are installed with the package, so there is no CLI, no copy-paste, and no peer dependency to keep in sync.

**Documentation:** [ui.xiod.dev](https://ui.xiod.dev)

## Contents

- [XiodUI](#xiodui)
  - [Contents](#contents)
  - [Features](#features)
  - [Comparison](#comparison)
  - [Installation](#installation)
  - [Quick start](#quick-start)
  - [Imports](#imports)
  - [Components](#components)
  - [Icons](#icons)
  - [Theming](#theming)
    - [Palettes](#palettes)
    - [Dark mode](#dark-mode)
  - [AI Agents](#ai-agents)
    - [Install Agent Skill](#install-agent-skill)
  - [Support](#support)
  - [License](#license)

## Features

- **Composable components** — combine buttons, forms, navigation, overlays, and layouts.
- **Accessible foundations** — Base UI primitives provide behavior for supported interactive components.
- **Customizable styling** — adjust CSS variables, component variants, and `className`.
- **Light and dark themes** — 20 palettes: the default Neutral plus 19 more to choose from.
- **TypeScript support** — typed props and individual component imports.
- **XiodIcons included, and swappable** — built-in icons use the `xiod-icons` package, and any of them can be replaced per instance or globally with `IconProvider`.

## Comparison

| Feature                                                          | XiodUI | shadcn/ui | HeroUI | Others |
| :--------------------------------------------------------------- | :----: | :-------: | :----: | :----: |
| Native CSS motion in the box — no tw-animate-css / framer-motion |   ✅   |    ❌     |   ❌   |   ❌   |
| Controls animate their own state — not just enter / exit         |   ✅   |    ❌     |   ✅   |   ❌   |
| Nothing extra to install beyond React                            |   ✅   |    ❌     |   ❌   |   ❌   |
| Tailwind CSS v4 native                                           |   ✅   |    ✅     |   ✅   |   ❌   |
| 20 ready-made palettes imported by name, not pasted in           |   ✅   |    ❌     |   ❌   |   ❌   |
| 44px touch targets on coarse pointers (WCAG 2.5.5)               |   ✅   |    ❌     |   ❌   |   ❌   |
| Versioned npm package (no copy-paste drift)                      |   ✅   |    ❌     |   ✅   |   ✅   |
| Import one component, ship one component                         |   ✅   |    ✅     |   ✅   |   ❌   |
| Primitives bundled — no peer dependency to keep in sync          |   ✅   |    ❌     |   ✅   |   ❌   |
| Command, Carousel & Drawer built in — no cmdk / embla / vaul     |   ✅   |    ❌     |   ✅   |   ❌   |
| One version number for the whole library                         |   ✅   |    ❌     |   ❌   |   ❌   |

"Nothing extra to install" means beyond `react` and `react-dom`: XiodUI's own dependencies (Base UI, class-variance-authority, cn, and XiodIcons) are installed with the package. Your project still needs Tailwind CSS 4 configured.

## Installation

XiodUI requires React 19.3 or later within React 19, matching React DOM, Node.js 20 or later, and a project configured with Tailwind CSS 4.3 or later.

```bash
# npm
npm install xiod-ui

# pnpm
pnpm add xiod-ui

# yarn
yarn add xiod-ui

# bun
bun add xiod-ui
```

If React is not already installed:

```bash
# npm
npm install react@^19 react-dom@^19

# pnpm
pnpm add react@^19 react-dom@^19

# yarn
yarn add react@^19 react-dom@^19

# bun
bun add react@^19 react-dom@^19
```

Base UI and XiodIcons are installed automatically. You do not need to install them separately to use XiodUI's built-in components.

## Quick start

Import XiodUI's stylesheet after Tailwind in the global CSS loaded by your application:

```css
@import "tailwindcss";
@import "xiod-ui/styles";
```

This provides the design tokens and registers the component files for Tailwind's utility generation. Your project's Tailwind integration must already be configured.

Then import the components you need:

```tsx
"use client";

import { Button } from "xiod-ui/button";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "xiod-ui/dialog";

export function Example() {
  return (
    <Dialog>
      <DialogTrigger render={<Button>View details</Button>} />
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>Everything in one place</DialogTitle>
          <DialogDescription>
            Build your interface with components that work together.
          </DialogDescription>
        </DialogHeader>
      </DialogPopup>
    </Dialog>
  );
}
```

In frameworks that support React Server Components, place interactive code in a client component, as shown above.

## Imports

Each component has its own import path. Root imports such as `import { Button } from "xiod-ui"` are not supported.

```tsx
import { Button } from "xiod-ui/button";
import { Input } from "xiod-ui/input";
import { useCopyToClipboard } from "xiod-ui/hooks/use-copy-to-clipboard";
import { useIsMobile, useMediaQuery } from "xiod-ui/hooks/use-media-query";
```

Your bundler ships only the components you import. The stylesheet is the one exception: it covers the whole library, so its size stays the same whether you use one component or ninety.

## Components

All 90 components, grouped by what they do. Each is imported from its own subpath, such as `xiod-ui/button` or `xiod-ui/date-picker`.

| Category           | Count | Components                                                                                                                                                                         |
| ------------------ | :---: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Actions            |   8   | Button, ButtonGroup, ButtonSplit, Toggle, ToggleGroup, Toolbar, CopyToClipboard, KineticClick                                                                                      |
| Forms              |  19   | Form, Field, Fieldset, Label, Input, InputGroup, Textarea, NumberField, Checkbox, Radio, Switch, Select, Combobox, Autocomplete, ListBox, Slider, Calendar, DatePicker, FileUpload |
| Specialized inputs |   8   | ColorPicker, InputPhone, InputPayment, InputOtp, InputSensitive, OptionPicker, RulerPicker, WheelPicker                                                                            |
| Navigation         |   9   | Breadcrumb, Sidebar, Tabs, Menu, Menubar, ContextMenu, NavigationMenu, Command, Pagination                                                                                         |
| Overlays           |   8   | Dialog, AlertDialog, Drawer, Popover, PreviewCard, Tooltip, Toast, MorphicToast                                                                                                    |
| Content            |  14   | Card, Frame, Table, Accordion, Collapsible, Avatar, Badge, CornerBadge, Kbd, Text, Message, Timeline, AgentSteps, Empty                                                            |
| Feedback           |   7   | Alert, Progress, CircularProgress, Meter, Gauge, Loader, Skeleton                                                                                                                  |
| Layout             |  11   | Grid, DashboardGrid, Group, AspectRatio, Separator, Carousel, Resizable, ScrollArea, ScrollBar, Draggable, Sortable                                                                |
| Visuals            |   4   | Orb, Waveform, DotMatrix, Marker                                                                                                                                                   |
| Theming            |   2   | ThemeProvider, IconProvider                                                                                                                                                        |

Components expose their own typed props and variants. Use your editor's TypeScript suggestions to explore the available options.

## Icons

Components come with icons from [XiodIcons](https://icons.xiod.dev). Every one of them can be replaced with your own.

To change one place, pass a prop. Parts with a single icon take `icon`; parts with several take named props such as `prevIcon` / `nextIcon` or `triggerIcon` / `clearIcon`. The value is anything React can render:

```tsx
import { XMarkIcon } from "@heroicons/react/24/outline";

<DrawerClose closeIcon={<XMarkIcon className="size-4" />} />;
```

To change an icon everywhere, wrap your app in `IconProvider`:

```tsx
import { IconProvider } from "xiod-ui/icon-provider";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

export function App({ children }) {
  return (
    <IconProvider icons={{ Cancel: XMarkIcon, Check: CheckIcon }}>
      {children}
    </IconProvider>
  );
}
```

Pass components here, not elements, so each component keeps setting the size and colour to match its context. Providers can be nested; the nearest one wins.

A prop beats the provider, and the provider beats the built-in icon. Pass `null` to an icon prop to render no icon at all.

FileUpload's file-type icons and AgentSteps' status icons follow the content, so change those through the provider.

The replaceable icons, typed as `IconName`:

| Group      | Names                                                                                                                                  |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Navigation | `ChevronUp`, `ChevronDown`, `ChevronLeft`, `ChevronRight`, `ChevronFirst`, `ChevronLast`, `ArrowRight`, `UnfoldMore`, `MoreHorizontal` |
| Status     | `Check`, `CheckmarkCircle`, `Alert`, `AlertCircle`, `InformationCircle`, `LoadingSpinner`, `SecurityCheck`                             |
| Actions    | `Cancel`, `Copy`, `Delete`, `Pencil`, `Search`, `PlusSign`, `MinusSign`, `Eye`, `EyeOff`, `Dropper`, `Zap`, `Terminal`                 |
| Files      | `File`, `FileEmpty`, `FileArchive`, `FileAudio`, `FileCode`, `FileImage`, `FileVideo`                                                  |
| Layout     | `GripHorizontal`, `GripVertical`, `ViewSidebarLeft`, `ArrowExpandDiagonalUpRight`, `ArrowShrinkDiagonalUpRight`                        |
| Other      | `Calendar`, `CreditCard`                                                                                                               |

## Theming

Override design tokens after the stylesheet imports to customize colors and the corner radius:

```css
:root {
  --radius: 0.5rem;
  --primary: oklch(0.55 0.22 264);
  --primary-foreground: white;
}

.dark {
  --primary: oklch(0.72 0.19 264);
  --primary-foreground: oklch(0.15 0.02 264);
}
```

For a ready-made palette, add its stylesheet after the base styles:

```css
@import "tailwindcss";
@import "xiod-ui/styles";
@import "xiod-ui/themes/iris";
```

### Palettes

XiodUI ships 20 palettes: the default Neutral plus 19 more. Every palette includes light and dark modes and meets the same contrast thresholds.

**Core** — restrained enough to ship as-is.

| Palette | Import                   | Look                                           |
| :------ | :----------------------- | :--------------------------------------------- |
| Neutral | _(default)_              | The base theme, shipped with `xiod-ui/styles`. |
| Clay    | `xiod-ui/themes/clay`    | Warm cream and terracotta.                     |
| Sepia   | `xiod-ui/themes/sepia`   | Aged paper and tanned leather.                 |
| Sage    | `xiod-ui/themes/sage`    | Muted garden green.                            |
| Lagoon  | `xiod-ui/themes/lagoon`  | Deep teal on cool mineral.                     |
| Cobalt  | `xiod-ui/themes/cobalt`  | Deep cobalt blue on cool grey.                 |
| Iris    | `xiod-ui/themes/iris`    | Indigo and violet on soft lilac.               |
| Roast   | `xiod-ui/themes/roast`   | Dark coffee and steamed cream.                 |
| Crimson | `xiod-ui/themes/crimson` | Oxblood, olive and steel on gunmetal.          |
| Sorbet  | `xiod-ui/themes/sorbet`  | Rose, sky and citrus.                          |

**Expressive** — louder, with a point of view.

| Palette    | Import                      | Look                                             |
| :--------- | :-------------------------- | :----------------------------------------------- |
| Cel        | `xiod-ui/themes/cel`        | Sky blue and marigold, flat and high-key.        |
| Afterglow  | `xiod-ui/themes/afterglow`  | Sunset warmth by day, cerulean by night.         |
| Ion        | `xiod-ui/themes/ion`        | Violet and readout green on instrument grey.     |
| Cathode    | `xiod-ui/themes/cathode`    | Hot magenta and phosphor green on cold concrete. |
| Riso       | `xiod-ui/themes/riso`       | Magenta and cyan misprint on newsprint.          |
| Taffy      | `xiod-ui/themes/taffy`      | Watermelon, sky and lemon.                       |
| Mochi      | `xiod-ui/themes/mochi`      | Milky orchid, mint and blush.                    |
| Blacklight | `xiod-ui/themes/blacklight` | Ultraviolet, acid green and hot pink.            |
| Toxin      | `xiod-ui/themes/toxin`      | Biohazard green and blood on wet concrete.       |
| Cinder     | `xiod-ui/themes/cinder`     | Molten orange on cold ash.                       |

### Dark mode

Add the `dark` class to your page's `<html>` element, or wrap your application with `ThemeProvider`:

```tsx
"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "xiod-ui/theme-provider";

export function Providers({ children }: { children: ReactNode }) {
  return <ThemeProvider defaultTheme="system">{children}</ThemeProvider>;
}
```

The provider follows your system's theme preference and remembers your selection. Within the provider, `useTheme()` returns `theme`, `resolvedTheme`, and `setTheme`. Call `setTheme` with `"light"`, `"dark"`, or `"system"` to change the theme.

## AI Agents

The XiodUI repository includes an [Agent Skill](https://agentskills.io) that
teaches coding agents how to use the library: the install steps, the subpath import rule, the
`render` composition API, theming, swappable icons, and a prop reference for every one
of the 90 components. Without it, agents tend to guess — reaching for a root
import, `asChild`, or a CLI `add` step, none of which exist here.

The skill lives at `skills/xiod-ui/` in this repository.

### Install Agent Skill

The [`skills`](https://skills.sh) CLI installs into Claude Code, Codex, Cursor,
GitHub Copilot, Antigravity, Devin and dozens of other agents.

```bash
npx skills add ImKKingshuk/XiodUI
```

Run it inside a project to install it there, or add `-g` to install it once for
every project. The CLI writes the skill into whichever directory your agent
already reads — `.claude/skills/` for Claude Code, `.agents/skills/` for Codex
and the other tools that share that path — so there is nothing to configure
afterwards.

## Support

Report bugs and request features in [GitHub Issues](https://github.com/ImKKingshuk/XiodUI/issues). When reporting a problem, include the component name, package version, and a minimal example that reproduces the issue.

## License

Licensed under [PolyForm Perimeter 1.0.1](https://polyformproject.org/licenses/perimeter/1.0.1).
Use in personal projects, hobby projects, and commercial projects
is permitted subject to the license, including its restriction on providing
competing products. This is not an unrestricted open-source license.

When distributing any part of the package, include the license terms or their
URL and the required copyright notice below. The complete license and notice are
also included in the package's `LICENSE` file.

```text
Required Notice: Copyright 2026 ImKKingshuk (https://github.com/ImKKingshuk)
```

Dependencies, including `xiod-icons`, retain their own licenses.
