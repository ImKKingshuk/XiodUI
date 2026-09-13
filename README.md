# XiodUI

A React component library for building interfaces with consistent styling, flexible composition, and built-in light and dark themes.

XiodUI includes 89 components built with Base UI, Tailwind CSS 4, and XiodIcons.

## Features

- **Composable components** — combine buttons, forms, navigation, overlays, and layouts.
- **Accessible foundations** — Base UI primitives provide behavior for supported interactive components.
- **Customizable styling** — adjust CSS variables, component variants, and `className`.
- **Light and dark themes** — use the default colors or choose from 19 palettes.
- **TypeScript support** — typed props and individual component imports.
- **XiodIcons included** — built-in icons use the `xiod-icons` package.

## Installation

XiodUI requires React 19.3 or later within React 19, matching React DOM, Node.js 20 or later, and a project configured with Tailwind CSS 4.3 or later.

```bash
npm install xiod-ui
```

If React is not already installed:

```bash
npm install react@^19 react-dom@^19
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

Individual JavaScript modules allow bundlers to include the components you use. The shared stylesheet registers the full component collection for Tailwind scanning; its CSS output does not follow JavaScript tree-shaking.

## Components

| Category           | Examples                                                                    |
| ------------------ | --------------------------------------------------------------------------- |
| Actions            | Button, ButtonGroup, Toggle, Toolbar, CopyToClipboard                       |
| Forms              | Input, Checkbox, Select, Combobox, Slider, Calendar, DatePicker, FileUpload |
| Navigation         | Breadcrumb, Sidebar, Tabs, Menu, Pagination                                 |
| Overlays           | Dialog, AlertDialog, Drawer, Popover, Tooltip, Toast                        |
| Content            | Card, Table, Accordion, Avatar, Badge, Message, Timeline                    |
| Feedback           | Alert, Progress, CircularProgress, Gauge, Loader, Skeleton                  |
| Layout             | Grid, DashboardGrid, Carousel, Resizable, ScrollArea                        |
| Specialized inputs | ColorPicker, InputPhone, InputPayment, InputOtp, InputSensitive             |
| Visuals            | Orb, Waveform, DotMatrix, Marker                                            |

Components expose their own typed props and variants. Use your editor's TypeScript suggestions to explore the available options.

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
