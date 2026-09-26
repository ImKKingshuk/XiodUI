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

Standalone hooks live under `xiod-ui/hooks/<name>`. There are two modules:

```tsx
import { useCopyToClipboard } from "xiod-ui/hooks/use-copy-to-clipboard";
import { useIsMobile, useMediaQuery } from "xiod-ui/hooks/use-media-query";

const { copyToClipboard, isCopied } = useCopyToClipboard({ timeout: 2000 });

const wide = useMediaQuery("lg"); // min-width: 1024px
const narrow = useMediaQuery("max-md"); // below 800px
const tablet = useMediaQuery({ min: "sm", max: "lg", pointer: "coarse" });
const isMobile = useIsMobile(); // same as useMediaQuery("max-md")
```

Named breakpoints follow Tailwind except `md`, which is **800px**, not 768. Pass
a number (`{ max: 768 }`) to match Tailwind's `md:` exactly. Both hooks return
`false` during server rendering.

Hooks tied to one component (`useSidebar`, `useTheme`, `useCarousel`, …) come
from that component's subpath and are listed on its reference page.

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

Toasts are imperative. Mount the provider once near the root:

```tsx
// app/providers.tsx
"use client";

import { ToastProvider } from "xiod-ui/toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ToastProvider position="bottom-right">{children}</ToastProvider>;
}
```

Then call the manager from any client code — an event handler, a server
action's result, a plain function:

```tsx
import { toastManager } from "xiod-ui/toast";

toastManager.add({
  title: "Event has been created",
  description: "Monday, January 3rd at 6:00pm",
});
```

`toastManager` only shows toasts while a `ToastProvider` is mounted. For toasts
anchored to an element, mount `AnchoredToastProvider` and call
`anchoredToastManager` instead.

`xiod-ui/morphic-toast` is a separate toast system with a gooey merge
animation. Mount `<MorphicToaster />` once, then call `morphicToast`:

```tsx
import { morphicToast } from "xiod-ui/morphic-toast";

morphicToast.success({ title: "Saved", description: "All changes synced." });
```

The two systems are independent: `toastManager` does not reach
`MorphicToaster`, and `morphicToast` does not reach `ToastProvider`.

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

## Coming from shadcn/ui

Most training data is shadcn/ui, and XiodUI is **not** shadcn/ui. The part
names, props, state attributes, setup, and icon set all differ. Do not write a
shadcn name and hope it resolves: none of the names in the left column exist
in XiodUI, and a wrong name fails at build time or renders nothing.

### Part names

| shadcn/ui writes                                              | XiodUI uses                                                                |
| :------------------------------------------------------------ | :------------------------------------------------------------------------- |
| `DialogContent`, `DialogOverlay`                              | `DialogPopup`, `DialogBackdrop`                                            |
| `AlertDialogContent`                                          | `AlertDialogPopup`                                                         |
| `AlertDialogAction`, `AlertDialogCancel`                      | `AlertDialogClose render={<Button />}` for both                            |
| `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`  | `Menu`, `MenuTrigger`, `MenuPopup` from `xiod-ui/menu`                     |
| `DropdownMenuItem`, `DropdownMenuLabel`, `DropdownMenuSub`    | `MenuItem`, `MenuGroupLabel`, `MenuSub` (every `DropdownMenu*` is `Menu*`) |
| `ContextMenuContent`, `MenubarContent`                        | `ContextMenuPopup`, `MenubarPopup`                                         |
| `HoverCard`, `HoverCardTrigger`, `HoverCardContent`           | `PreviewCard`, `PreviewCardTrigger`, `PreviewCardPopup`                    |
| `PopoverContent`, `TooltipContent`, `SelectContent`           | `PopoverPopup`, `TooltipPopup`, `SelectPopup`                              |
| `SelectLabel`                                                 | `SelectGroupLabel`                                                         |
| `TabsTrigger`, `TabsContent`                                  | `TabsTab`, `TabsPanel`                                                     |
| `AccordionContent`, `CardContent`, `CollapsibleContent`       | `AccordionPanel`, `CardPanel`, `CollapsiblePanel`                          |
| `RadioGroup`, `RadioGroupItem`                                | `Radio`, `RadioItem` from `xiod-ui/radio`                                  |
| `Sheet`, `SheetContent`, `side="right"`                       | `Drawer`, `DrawerPopup`, `position="right"`                                |
| `InputOTP`, `InputOTPGroup`, `InputOTPSlot`                   | `InputOtp`, `InputOtpGroup`, `InputOtpInput`                               |
| `Toaster` + `toast("…")` from sonner                          | `ToastProvider` + `toastManager.add({ title })`                            |
| `Form`, `FormField`, `FormItem`, `FormControl`, `FormMessage` | `Form` + `Field`, `FieldLabel`, `FieldDescription`, `FieldError`           |
| `Spinner`, `Typography`                                       | `Loader`, `Text`                                                           |

### Props and behaviour

- **`asChild` → `render`.** See [`render`, not `asChild`](#render-not-aschild).
- **Accordion:** there is no `type="single"` or `collapsible`. One item open at
  a time is the default, and any item can close. Pass `multiple` to allow
  several.
- **Menu items:** use `onClick`, not `onSelect`. The menu closes on click by
  default; pass `closeOnClick={false}` to keep it open.
- **Forms:** there is no react-hook-form wrapper. Use `Form` (`errors`,
  `onFormSubmit`) with `Field` parts, as in [Fields and validation](#fields-and-validation).
- **Slider:** `value` and `defaultValue` take a number for one thumb. Pass an
  array only for a range.

### Styling state

Components set Base UI's data attributes, not Radix's `data-state`:

| Radix / shadcn/ui                    | XiodUI                                                                                                                 |
| :----------------------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| `data-[state=open]:`                 | `data-open:` on popups, `data-popup-open:` on popup triggers, `data-panel-open:` on accordion and collapsible triggers |
| `data-[state=checked]:`              | `data-checked:` (`data-unchecked:`, `data-indeterminate:`)                                                             |
| `data-[state=active]:` (tabs)        | `data-active:`                                                                                                         |
| `data-[highlighted]:`                | `data-highlighted:`                                                                                                    |
| `data-[disabled]:`                   | `data-disabled:`                                                                                                       |
| `animate-in fade-in` / `animate-out` | nothing — popups already animate with `data-starting-style` and `data-ending-style`                                    |
| `var(--radix-popover-trigger-width)` | `var(--anchor-width)`                                                                                                  |

Colour tokens hold complete colours (`--primary: var(--color-neutral-800)`).
Use the utilities (`bg-primary`, `text-muted-foreground`) or `var(--primary)`.
Never wrap a token in `hsl(…)` or `oklch(…)`.

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
9. **shadcn part names.** `DialogContent`, `DropdownMenu`, `SheetContent`,
   `TabsTrigger` and the rest do not exist. Use the table in
   [Coming from shadcn/ui](#coming-from-shadcnui).
10. **`npx shadcn add`, `components.json`, or `cn` from `@/lib/utils`.** There
    is nothing to add. `cn` comes from the `cn` package.
11. **`lucide-react` or another icon set for a component's own icons.** Built-in
    icons come from `xiod-icons`; replace them with icon props or
    `IconProvider`, not by installing a second set.
12. **`tailwindcss-animate`, `tw-animate-css`, `framer-motion`, or `motion` to
    animate components.** Every component animates itself in CSS. Adding
    `animate-in` / `animate-out` classes doubles the animation.
13. **A `tailwind.config.js`, a `theme.extend.colors` block, or `hsl(var(--…))`
    colours.** Tailwind 4 needs no config file, and the tokens are complete
    colours already.
14. **`sonner`, `vaul`, `cmdk`, `embla-carousel-react`, or `react-hook-form` to
    get a toast, drawer, command palette, carousel, or form.** XiodUI ships its
    own: `xiod-ui/toast`, `xiod-ui/drawer`, `xiod-ui/command`, `xiod-ui/carousel`,
    `xiod-ui/form` with `xiod-ui/field`.
15. **`data-[state=…]:` selectors on library parts.** Use the Base UI attributes
    in [Styling state](#styling-state).

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
