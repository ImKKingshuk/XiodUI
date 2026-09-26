---
name: xiod-ui
description: Build React UIs with XiodUI (the `xiod-ui` npm package) — 90 accessible components, 19 colour palettes, built on Base UI and Tailwind CSS 4. Use when installing xiod-ui, importing or composing its components (Button, Dialog, Field, Form, Select, Toast, ColorPicker, Sidebar, and the rest), wiring dark mode or a palette, swapping a component's built-in icon, or fixing an import that does not resolve. Also use when a task mentions XiodUI, xiod-ui, ui.xiod.dev, or asks for components that turn out to be from this library.
license: PolyForm Perimeter 1.0.1
metadata:
  package: xiod-ui
  homepage: https://ui.xiod.dev
---

# XiodUI

A React component library shipped **only** as an npm package. No CLI, no `init`
command, no copy-the-source-into-your-repo flow. Installing the package installs
every component.

- 90 components, each on its own import subpath
- Built on [Base UI](https://base-ui.com) (bundled — never install it yourself)
- Styled with Tailwind CSS 4 and CSS custom properties
- 19 palettes + a neutral base, light and dark for each
- React 19.3+, Tailwind CSS 4.3+, Node 20+

## Install

```bash
npm install xiod-ui react react-dom
```

Tailwind CSS 4 as a dev dependency, if the project does not have it:

```bash
npm install -D tailwindcss @tailwindcss/postcss
```

Then, in the global stylesheet (`app/globals.css`, `src/index.css`, …):

```css
@import "tailwindcss";
@import "xiod-ui/styles";
```

**Those two lines are the entire setup.** There is no config file and no
Tailwind plugin to register. `xiod-ui/styles` supplies the colour tokens, the
`dark` variant, the base reset, and a `@source` directive that tells Tailwind to
scan the package so the utility classes components reference actually get
generated. Skip the import and every component renders unstyled.

Base UI and XiodIcons arrive as dependencies of `xiod-ui`. Install `xiod-icons`
directly only when importing icons yourself.

## Import

One component family per subpath. The slug is the **kebab-case** file name:

```tsx
import { Button } from "xiod-ui/button";
import { Dialog, DialogPopup, DialogTitle } from "xiod-ui/dialog";
import { InputOtp } from "xiod-ui/input-otp";
import { ThemeProvider, useTheme } from "xiod-ui/theme-provider";
```

Hooks live under `xiod-ui/hooks/<name>`. There are exactly two:

```tsx
import { useCopyToClipboard } from "xiod-ui/hooks/use-copy-to-clipboard";
import { useMediaQuery } from "xiod-ui/hooks/use-media-query";
```

There is **no root barrel**. `import { Button } from "xiod-ui"` throws
`ERR_PACKAGE_PATH_NOT_EXPORTED` — the exports map has no `.` entry, on purpose.

If unsure which subpath a component lives on, check `references/components/`
below, or read `node_modules/xiod-ui/dist/components/` — the installed package
is the source of truth.

### Class merging

Components accept `className` and merge it last-wins. The library uses the
`cn` package (MIT, a compiled clsx + tailwind-merge). To use the same helper:

```bash
npm install cn
```

```tsx
import { cn } from "cn";
```

`xiod-ui` does not re-export it. Never build class strings by concatenation or
template interpolation — conflicting Tailwind utilities will both survive.

## Compose

Components are compound: a root plus named parts, all from the same subpath.

```tsx
import { Button } from "xiod-ui/button";
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
} from "xiod-ui/dialog";
import { Field, FieldLabel } from "xiod-ui/field";
import { Form } from "xiod-ui/form";
import { Input } from "xiod-ui/input";

export function EditProfile() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Open Dialog
      </DialogTrigger>
      <DialogPopup className="sm:max-w-sm">
        <Form className="contents">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here.
            </DialogDescription>
          </DialogHeader>
          <DialogPanel className="grid gap-4">
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input defaultValue="Optimus Prime" type="text" />
            </Field>
          </DialogPanel>
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" />}>
              Cancel
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
}
```

### `render`, not `asChild`

This is the single most common mistake. XiodUI follows Base UI's composition
API: to make a component render as a different element or component, pass
`render` a **React element** (or a function returning one). The parent's props
and behaviour are merged into it.

```tsx
// ✅ Trigger renders as a Button
<DialogTrigger render={<Button variant="outline" />}>Open</DialogTrigger>

// ✅ Render as a plain tag
<Text variant="heading3" render={<h2 id="install" />}>Install</Text>

// ❌ shadcn/Radix pattern — `asChild` does not exist here
<DialogTrigger asChild><Button>Open</Button></DialogTrigger>
```

Children stay where they are — they go on the outer component, not inside the
element passed to `render`.

### Variants

Most components take `variant` and `size`. `Button`, for example:

```tsx
<Button>Default</Button>
<Button variant="secondary" size="sm">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive-outline">Careful</Button>
<Button variant="link">Link</Button>
<Button size="icon" aria-label="Copy"><Copy /></Button>
```

Sizes: `xs` `sm` `default` `lg` `xl`, plus `icon-xs` … `icon-xl` for square
icon buttons. Every component's exact prop table is in
`references/components/<slug>.md`.

### Fields and validation

`Field` wires label, control, description, and error together with the right
ARIA relationships. Put the control inside it and pass state on the `Field`:

```tsx
<Field invalid>
  <FieldLabel>Subdomain</FieldLabel>
  <Input defaultValue="my workspace" type="text" />
  <FieldError match>Subdomains cannot contain spaces.</FieldError>
</Field>

<Field disabled>
  <FieldLabel>Plan</FieldLabel>
  <Input defaultValue="Enterprise" type="text" />
  <FieldDescription>Contact support to change plans.</FieldDescription>
</Field>
```

### Toasts

Toasts are imperative. Mount the provider once near the root, then call the
manager from anywhere:

```tsx
// app/providers.tsx
import { ToastProvider } from "xiod-ui/toast";

// any client component
("use client");
import { toastManager } from "xiod-ui/toast";

toastManager.add({
  title: "Event has been created",
  description: "Monday, January 3rd at 6:00pm",
});
```

`xiod-ui/morphic-toast` exports `MorphicToaster`, an alternative surface with a
gooey merge animation. `xiod-ui/toast` also exports `AnchoredToastProvider`.

### Icons

```tsx
import { ArrowRight, Check, Copy } from "xiod-icons";
```

Named exports only. Icons inherit `currentColor` and size from the surrounding
component.

#### Replacing built-in icons

Every icon a component renders itself is replaceable.

To change one place, pass a prop. A part with one icon takes `icon`; a part with
several takes named props (`prevIcon` / `nextIcon`, `triggerIcon` / `clearIcon`,
`copiedIcon` / `copyIcon`). The value is any `ReactNode`:

```tsx
<DrawerClose closeIcon={<XMarkIcon className="size-4" />} />
```

To change one everywhere, use `IconProvider` at the app root:

```tsx
import { IconProvider } from "xiod-ui/icon-provider";

<IconProvider icons={{ Cancel: XMarkIcon, Check: CheckIcon }}>
  <App />
</IconProvider>;
```

Keys come from the `IconName` union. Pass components, not elements — the
component sets the size and colour. Nested providers merge, the nearest winning.

A prop beats the provider, which beats the default. `null` renders no icon.

FileUpload's file-type icons and AgentSteps' status icons follow the content, so
change those through the provider.

## Theme

### Dark mode

`ThemeProvider` and `useTheme` come from `xiod-ui/theme-provider`. The provider
toggles `light`/`dark` classes on `<html>`, which is exactly what the package's
`dark` variant keys off. Do not add `next-themes`.

```tsx
// app/providers.tsx
"use client";
import { ThemeProvider } from "xiod-ui/theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider defaultTheme="system">{children}</ThemeProvider>;
}
```

```tsx
"use client";
import { useTheme } from "xiod-ui/theme-provider";

const { theme, resolvedTheme, setTheme } = useTheme();
// theme: "light" | "dark" | "system"  (what the user picked)
// resolvedTheme: "light" | "dark"     (never "system")
```

Provider props and their defaults: `defaultTheme` (`"system"`),
`enableSystemTheme` (`true`), `attribute` (`"class"`), `storageKey`
(`"theme"`), `defaultPalette` (unset), `paletteAttribute` (`"data-palette"`),
`paletteStorageKey` (`"palette"`). `attribute` and `paletteAttribute` must
differ, or the two axes overwrite each other on the same element.

### Palettes

A palette is one stylesheet redefining every token plus `--radius`. Nineteen
ship with the package, in two families:

**Core** (restrained enough to ship as-is): `clay` `sepia` `sage` `lagoon`
`cobalt` `iris` `roast` `crimson` `sorbet`

**Expressive** (more personality): `riso` `afterglow` `cathode` `ion` `cel`
`taffy` `mochi` `toxin` `cinder` `blacklight`

The neutral base needs no import — it is what `xiod-ui/styles` already gives.

**One fixed palette** — import it after `xiod-ui/styles`; it overrides the base
tokens outright and nothing in the markup changes:

```css
@import "tailwindcss";
@import "xiod-ui/styles";
@import "xiod-ui/themes/cobalt";
```

Order matters. Before `xiod-ui/styles`, the base tokens win.

**Let users switch at runtime** — import the `/scoped` variants, which apply
only under their own `data-palette` attribute, so importing several is safe:

```css
@import "xiod-ui/styles";
@import "xiod-ui/themes/cobalt/scoped";
@import "xiod-ui/themes/lagoon/scoped";
```

```tsx
"use client";
import { useTheme } from "xiod-ui/theme-provider";

const { palette, setPalette } = useTheme();
setPalette("cobalt");
setPalette(undefined); // back to the neutral base
```

`setPalette` writes `data-palette` on `<html>`, which is the attribute the
`/scoped` stylesheets key off — so runtime switching needs the scoped imports,
not the plain ones.

Theme and palette are independent axes; each palette defines both colour
schemes, so there is no light×palette grid to maintain.

### Adjusting tokens

Override individual tokens **below** the imports in the app's own stylesheet.
A palette is a starting point, not a lock.

```css
@import "xiod-ui/styles";
@import "xiod-ui/themes/cobalt";

:root {
  --radius: 0.25rem;
  --primary: #1d4ed8;
}
```

Components read only tokens, so this reaches all 90 of them at once. Prefer it
over per-component `className` colour overrides.

## Never do this

1. **Root barrel import.** `from "xiod-ui"` is not an export. Use
   `from "xiod-ui/<slug>"`.
2. **Installing `@base-ui/react` separately.** It ships inside `xiod-ui`. A
   second copy means two versions of the same context and broken portals.
3. **`asChild`.** Use `render={<Element />}`.
4. **A CLI, an `init` step, or copying component source into the project.**
   None exist. Any instruction implying otherwise is wrong.
5. **Redefining library tokens, `@custom-variant dark`, or the base reset in the
   app's stylesheet.** The package already declares them; a second declaration
   fights it. Override token _values_ only, as shown above.
6. **Importing from a relative path or from `components/ui/`.** There is no
   vendored copy to edit.
7. **Guessing a slug.** PascalCase, camelCase, and pluralised subpaths do not
   resolve. `InputOtp` lives at `xiod-ui/input-otp`.
8. **Hiding a built-in icon with CSS, or vendoring a component to change one.**
   Pass an icon prop, or set it globally with `IconProvider`.

Remember `"use client"` on any file that holds state or handlers — most
interactive examples need it in the Next.js App Router.

## Finding a component

All 90 slugs:

`accordion` `agent-steps` `alert` `alert-dialog` `aspect-ratio` `autocomplete`
`avatar` `badge` `breadcrumb` `button` `button-group` `button-split` `calendar`
`card` `carousel` `checkbox` `circular-progress` `collapsible` `color-picker`
`combobox` `command` `context-menu` `copy-to-clipboard` `corner-badge`
`dashboard-grid` `date-picker` `dialog` `dot-matrix` `draggable` `drawer`
`empty` `field` `fieldset` `file-upload` `form` `frame` `gauge` `grid` `group` `icon-provider`
`input` `input-group` `input-otp` `input-payment` `input-phone`
`input-sensitive` `kbd` `kinetic-click` `label` `list-box` `loader` `marker`
`menu` `menubar` `message` `meter` `morphic-toast` `navigation-menu`
`number-field` `option-picker` `orb` `pagination` `popover` `preview-card`
`progress` `radio` `resizable` `ruler-picker` `scroll-area` `scroll-bar`
`select` `separator` `sidebar` `skeleton` `slider` `sortable` `switch` `table`
`tabs` `text` `textarea` `theme-provider` `timeline` `toast` `toggle`
`toggle-group` `toolbar` `tooltip` `waveform` `wheel-picker`

For the exports, props, and anatomy of a specific component, read the matching
file under `references/components/` — one per slug, e.g.
`references/components/dialog.md`. Read only the ones the task needs.

Full documentation with live examples: <https://ui.xiod.dev/docs>
