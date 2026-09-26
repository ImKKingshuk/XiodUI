# Migrating from shadcn/ui to XiodUI

Follow the six steps in SKILL.md → "Migrating an existing app". This page
supplies the shadcn/ui specifics for each step.

shadcn/ui copies component source into the app (`components/ui/*.tsx`).
XiodUI is one npm package: the app imports components from `xiod-ui/<slug>`
and keeps no component source. Many names look the same, but the parts
underneath are Base UI, not Radix. Popups, triggers, state attributes, and a
handful of props differ, so **never** assume a shadcn name exists in XiodUI.
Check it against the tables below.

Some newer shadcn/ui projects use its Base UI flavour (`components.json` has a
`"base"` style, and components import `@base-ui/react`). Those already use
`render` and Base UI state attributes. The part names and setup below still
apply.

## 1. Inventory

```bash
cat components.json
ls components/ui
grep -rlE "@/components/ui/|components/ui/" --include=*.tsx --include=*.ts . --exclude-dir=node_modules
grep -rlE "lucide-react|sonner|vaul|cmdk|react-hook-form|next-themes|embla-carousel|react-day-picker|input-otp|react-resizable-panels" --include=*.tsx --include=*.ts . --exclude-dir=node_modules
```

Note which files in `components/ui/` the app has **edited**. Compare them with
the stock shadcn/ui source or read their `git log`. An edit is a behaviour or
style the app relies on. Recreate it with `className`, a variant, or a small
wrapper component in the app's own folder (not `components/ui/`).

## 2. Setup

Install and add the styles (full detail in SKILL.md → "Install"):

```bash
npm install xiod-ui cn
```

Replace the shadcn/ui block in the global stylesheet. Delete all of it:

- `@import "tw-animate-css";` and `@plugin "tailwindcss-animate";`
- `@custom-variant dark (&:is(.dark *));`
- the `:root { --background: …; … }` and `.dark { … }` token blocks
- the `@theme inline { --color-background: var(--background); … }` block
- `@layer base { * { @apply border-border … } body { @apply bg-background … } }`

The stylesheet then starts with exactly:

```css
@import "tailwindcss";
@import "xiod-ui/styles";
```

**Keeping the app's brand colours:** XiodUI uses the same token names as
shadcn/ui (`--background`, `--primary`, `--muted`, `--border`, `--ring`,
`--sidebar-*`, `--radius`, …). If the app changed a token value, copy **only
that value** below the imports. Don't copy the whole block:

```css
:root {
  --primary: oklch(0.55 0.22 264);

  @variant dark {
    --primary: oklch(0.7 0.18 264);
  }
}
```

XiodUI has no `--chart-*` tokens. If the app draws charts, keep those
variables under the imports as well. It adds `--success`, `--warning`, and
`--info` for status colours.

Providers:

| shadcn/ui setup                                          | XiodUI                                                                       |
| :------------------------------------------------------- | :--------------------------------------------------------------------------- |
| `ThemeProvider` from `next-themes` (`attribute="class"`) | `ThemeProvider` from `xiod-ui/theme-provider`; `useTheme` from the same path |
| `<Toaster />` from `@/components/ui/sonner`              | `<ToastProvider>` from `xiod-ui/toast`, wrapping the app                     |
| `<TooltipProvider>` around the app                       | Optional. `TooltipProvider` from `xiod-ui/tooltip` only groups delays        |
| `<SidebarProvider>`                                      | `SidebarProvider` from `xiod-ui/sidebar` (same name)                         |

`useTheme` from XiodUI returns `theme`, `resolvedTheme`, and `setTheme`, like
next-themes. Remove next-themes' `suppressHydrationWarning` from `<html>`:
XiodUI's provider doesn't need it. Move any `.dark { … }` token overrides into
`:root { @variant dark { … } }` (below), or they apply only after hydration.

## 3. Components

Import path: `@/components/ui/<name>` → `xiod-ui/<slug>`. Most slugs match the
file names (`button`, `dialog`, `select`). The exceptions are
`dropdown-menu` → `menu`, `hover-card` → `preview-card`, `sheet` → `drawer`,
`radio-group` → `radio`, `sonner` → `toast`, and `form` → `form` + `field`.

Parts that are **renamed**. The left column does not exist in XiodUI:

| shadcn/ui                                                                                     | XiodUI                                                                      |
| :-------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| `DialogContent`, `DialogOverlay`                                                              | `DialogPopup`, `DialogBackdrop`                                             |
| body `<div>` inside `DialogContent`                                                           | `DialogPanel` (the scrollable body)                                         |
| `AlertDialogContent`                                                                          | `AlertDialogPopup`                                                          |
| `AlertDialogAction`, `AlertDialogCancel`                                                      | `AlertDialogClose render={<Button variant="…" />}`                          |
| `DropdownMenu`                                                                                | `Menu`                                                                      |
| `DropdownMenuTrigger`, `DropdownMenuContent`                                                  | `MenuTrigger`, `MenuPopup`                                                  |
| `DropdownMenuItem`, `DropdownMenuCheckboxItem`                                                | `MenuItem`, `MenuCheckboxItem`                                              |
| `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`                                             | `MenuRadioGroup`, `MenuRadioItem`                                           |
| `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuShortcut`                          | `MenuGroupLabel`, `MenuSeparator`, `MenuShortcut`                           |
| `DropdownMenuGroup`, `DropdownMenuSub`                                                        | `MenuGroup`, `MenuSub`                                                      |
| `DropdownMenuSubTrigger`, `DropdownMenuSubContent`                                            | `MenuSubTrigger`, `MenuSubPopup`                                            |
| `ContextMenuContent`, `ContextMenuSubContent`                                                 | `ContextMenuPopup`, `ContextMenuSubPopup`                                   |
| `MenubarContent`, `MenubarSubContent`                                                         | `MenubarPopup`, `MenubarSubPopup`                                           |
| `HoverCard`, `HoverCardTrigger`, `HoverCardContent`                                           | `PreviewCard`, `PreviewCardTrigger`, `PreviewCardPopup`                     |
| `PopoverContent`                                                                              | `PopoverPopup`                                                              |
| `TooltipContent`                                                                              | `TooltipPopup`                                                              |
| `SelectContent`, `SelectLabel`                                                                | `SelectPopup`, `SelectGroupLabel`                                           |
| `TabsTrigger`, `TabsContent`                                                                  | `TabsTab`, `TabsPanel`                                                      |
| `AccordionContent`                                                                            | `AccordionPanel`                                                            |
| `CollapsibleContent`                                                                          | `CollapsiblePanel`                                                          |
| `CardContent`                                                                                 | `CardPanel`                                                                 |
| `RadioGroup`, `RadioGroupItem`                                                                | `Radio`, `RadioItem`                                                        |
| `Sheet`, `SheetTrigger`, `SheetContent`, `SheetClose`                                         | `Drawer`, `DrawerTrigger`, `DrawerPopup`, `DrawerClose`                     |
| `SheetHeader`, `SheetTitle`, `SheetDescription`, `SheetFooter`                                | `DrawerHeader`, `DrawerTitle`, `DrawerDescription`, `DrawerFooter`          |
| `Drawer*` from vaul (`DrawerContent`)                                                         | `DrawerPopup` (XiodUI's `DrawerContent` is an inner wrapper, not the popup) |
| `InputOTP`, `InputOTPGroup`, `InputOTPSlot`, `InputOTPSeparator`                              | `InputOtp`, `InputOtpGroup`, `InputOtpInput`, `InputOtpSeparator`           |
| `Spinner`                                                                                     | `Loader`                                                                    |
| `Toaster` + `toast()` (sonner)                                                                | `ToastProvider` + `toastManager.add()`                                      |
| `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage` | `Form` + `Field`, `FieldLabel`, `FieldDescription`, `FieldError`            |
| `Combobox` recipe (Popover + Command)                                                         | `Combobox` from `xiod-ui/combobox`                                          |
| `DatePicker` recipe (Popover + Calendar)                                                      | `DatePicker` from `xiod-ui/date-picker`                                     |

Parts that keep **the same name**: `Button`, `Badge`, `Input`, `Textarea`,
`Label`, `Checkbox`, `Switch`, `Slider`, `Separator`, `Skeleton`, `Progress`,
`Avatar*`, `Alert`, `AlertTitle`, `AlertDescription`, `Card`, `CardHeader`,
`CardTitle`, `CardDescription`, `CardAction`, `CardFooter`, `Table*`,
`Breadcrumb*`, `Pagination*`, `Tabs`, `TabsList`, `Accordion`, `AccordionItem`,
`AccordionTrigger`, `Dialog`, `DialogTrigger`, `DialogHeader`, `DialogTitle`,
`DialogDescription`, `DialogFooter`, `DialogClose`, `Popover`,
`PopoverTrigger`, `Tooltip`, `TooltipTrigger`, `Select`, `SelectTrigger`,
`SelectValue`, `SelectItem`, `SelectGroup`, `SelectSeparator`, `Carousel*` (`CarouselContent`, `CarouselItem`, `CarouselPrevious`,
`CarouselNext`), `Resizable*` (`ResizablePanelGroup`, `ResizablePanel`,
`ResizableHandle`), `Sidebar*`, `NavigationMenu*`, `Toggle`, `ToggleGroup`,
`ToggleGroupItem`, `ScrollArea`, `ScrollBar`, `AspectRatio`, `Calendar`, `Kbd`,
`Empty*`, `InputGroup*`. Their props can still differ, so check the next
section.

`Command` keeps its part names but **not** its structure. See "Command
palette" under Patterns.

## 4. Props

| shadcn/ui                                                  | XiodUI                                                                                            |
| :--------------------------------------------------------- | :------------------------------------------------------------------------------------------------ |
| `asChild` on any part                                      | `render={<Element />}`. See SKILL.md → "`render`, not `asChild`"                                  |
| `<Button asChild><Link href="/x">Go</Link></Button>`       | `<Button render={<Link href="/x" />} nativeButton={false}>Go</Button>`                            |
| Accordion `type="single" collapsible`                      | Remove both. One open item at a time is the default, and items close on click                     |
| Accordion `type="multiple"`                                | `multiple`                                                                                        |
| Accordion `defaultValue="item-1"` (single)                 | `defaultValue={["item-1"]}` (always an array)                                                     |
| ToggleGroup `type="single"` / `type="multiple"`            | Remove / `multiple`; `value` and `defaultValue` are arrays                                        |
| Menu item `onSelect={…}`                                   | `onClick={…}`; `closeOnClick={false}` to keep the menu open                                       |
| Slider `defaultValue={[50]}`, `onValueChange={([v]) => …}` | `defaultValue={50}`, `onValueChange={(v) => …}` for one thumb; arrays for a range                 |
| Select without `items`                                     | Pass `items={[{ label, value }]}` to `Select` so `SelectValue` shows the label, not the raw value |
| `SelectContent position="popper"`                          | Remove. `SelectPopup` takes `side`, `align`, `sideOffset`                                         |
| `PopoverContent align="start" sideOffset={8}`              | Same props on `PopoverPopup`                                                                      |
| `SheetContent side="right"`                                | `position="right"` on `Drawer` (default `"bottom"`)                                               |
| `InputOTP maxLength={6}` + `InputOTPSlot index={0}`        | `InputOtp length={6}` + `InputOtpInput` (no `index`; give each an `aria-label`)                   |
| `Alert variant="destructive"`                              | `variant="error"`. Alert also has `success`, `warning`, `info`                                    |
| `Badge variant="destructive"`                              | Same. Badge also has `success`, `warning`, `info`, `error`                                        |
| Button `size="icon"`                                       | Same. Also `icon-xs`, `icon-sm`, `icon-lg`, `icon-xl`, and `xs`, `xl`                             |
| `Checkbox checked onCheckedChange`                         | Same                                                                                              |
| `<Checkbox id="x" /><Label htmlFor="x">`                   | Works, but prefer wrapping: `<Label><Checkbox /> Accept</Label>`                                  |
| `Progress value={40}`                                      | Same; add `size` or `variant="expressive"` if wanted                                              |
| `buttonVariants({ variant: "outline" })` on a link         | Same: `import { buttonVariants } from "xiod-ui/button"` (also `badgeVariants`, `toggleVariants`)  |
| `Carousel opts={{ loop: true }}`                           | Same, or the `loop` and `autoplay` props. No embla install needed                                 |

## 5. Patterns

### Dialog

```tsx
// shadcn/ui
<Dialog>
  <DialogTrigger asChild><Button>Edit</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader><DialogTitle>Edit</DialogTitle></DialogHeader>
    <form>…</form>
    <DialogFooter><Button type="submit">Save</Button></DialogFooter>
  </DialogContent>
</Dialog>

// XiodUI
<Dialog>
  <DialogTrigger render={<Button />}>Edit</DialogTrigger>
  <DialogPopup>
    <DialogHeader><DialogTitle>Edit</DialogTitle></DialogHeader>
    <DialogPanel>…</DialogPanel>
    <DialogFooter>
      <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
      <Button type="submit">Save</Button>
    </DialogFooter>
  </DialogPopup>
</Dialog>
```

Controlled: `open` and `onOpenChange` work the same. `DialogPopup` already
includes the close button, backdrop, and portal, so don't add them yourself.

### Dropdown menu

```tsx
// shadcn/ui
<DropdownMenu>
  <DropdownMenuTrigger asChild><Button variant="ghost">Open</Button></DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>Account</DropdownMenuLabel>
    <DropdownMenuItem onSelect={logout}>Log out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

// XiodUI
<Menu>
  <MenuTrigger render={<Button variant="ghost" />}>Open</MenuTrigger>
  <MenuPopup align="end">
    <MenuGroup>
      <MenuGroupLabel>Account</MenuGroupLabel>
      <MenuItem onClick={logout}>Log out</MenuItem>
    </MenuGroup>
  </MenuPopup>
</Menu>
```

`MenuGroupLabel` must sit inside a `MenuGroup`. A destructive item takes
`variant="destructive"`.

### Forms (react-hook-form → Form + Field)

shadcn/ui's `Form` wraps react-hook-form. XiodUI's `Form` is Base UI's form and
works with native constraints, `validate` functions, or a schema.

```tsx
// shadcn/ui
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField control={form.control} name="email" render={({ field }) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl><Input {...field} /></FormControl>
        <FormMessage />
      </FormItem>
    )} />
    <Button type="submit">Save</Button>
  </form>
</Form>

// XiodUI
<Form errors={errors} onFormSubmit={onSubmit}>
  <Field name="email">
    <FieldLabel>Email</FieldLabel>
    <Input required type="email" />
    <FieldError />
  </Field>
  <Button type="submit">Save</Button>
</Form>
```

- `onFormSubmit(values)` receives the values keyed by each `Field`'s `name`.
- Put errors from a zod schema or the server into `errors` (a
  `{ [name]: message }` object). `FieldError` shows them. zod can stay.
- Rules per field: native attributes (`required`, `minLength`, `pattern`,
  `type="email"`) or `validate={(value) => "message" | null}` on `Field`.
- If the app depends heavily on react-hook-form (field arrays, watch), it can
  keep react-hook-form for state. Drop only shadcn's wrapper parts, and render
  `Field` + `FieldLabel` + the control + `FieldError`, passing `invalid` to
  `Field` and the message as `FieldError`'s children with `match`.

### Command palette (cmdk → Command)

shadcn/ui's `Command` is cmdk: static `CommandItem` children filtered by their
text. XiodUI's `Command` is data-driven: pass the entries as `items`, and
`CommandList` renders them through a function. Filtering only works through
`items`.

```tsx
// shadcn/ui
<CommandDialog open={open} onOpenChange={setOpen}>
  <CommandInput placeholder="Search…" />
  <CommandList>
    <CommandEmpty>No results.</CommandEmpty>
    <CommandGroup heading="Pages">
      <CommandItem onSelect={() => go("/settings")}>Settings</CommandItem>
    </CommandGroup>
  </CommandList>
</CommandDialog>;

// XiodUI
const groups = [
  {
    value: "Pages",
    items: [{ value: "settings", label: "Settings", href: "/settings" }],
  },
];

<CommandDialog open={open} onOpenChange={setOpen}>
  <CommandDialogPopup>
    <Command items={groups}>
      <CommandInput placeholder="Search…" />
      <CommandPanel>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandList>
          {(group: (typeof groups)[number]) => (
            <CommandGroup key={group.value} items={group.items}>
              <CommandGroupLabel>{group.value}</CommandGroupLabel>
              <CommandCollection>
                {(item: (typeof group.items)[number]) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onClick={() => go(item.href)}
                  >
                    {item.label}
                  </CommandItem>
                )}
              </CommandCollection>
            </CommandGroup>
          )}
        </CommandList>
      </CommandPanel>
    </Command>
  </CommandDialogPopup>
</CommandDialog>;
```

- `CommandGroup heading="…"` → a `CommandGroupLabel` child.
- `CommandItem onSelect` → `onClick`.
- `CommandDialogTrigger render={<Button />}` opens it from a button;
  keyboard shortcuts still need your own `keydown` listener that sets `open`.

### Toasts (sonner → toastManager)

| sonner                                            | XiodUI                                                                            |
| :------------------------------------------------ | :-------------------------------------------------------------------------------- |
| `toast("Saved")`                                  | `toastManager.add({ title: "Saved" })`                                            |
| `toast("Saved", { description })`                 | `toastManager.add({ title: "Saved", description })`                               |
| `toast.success(…)`, `.error`, `.warning`, `.info` | `toastManager.add({ title, type: "success" })` (`"error"`, `"warning"`, `"info"`) |
| `toast.loading("Saving…")`                        | `toastManager.add({ title: "Saving…", type: "loading" })`                         |
| `toast.promise(p, { loading, success, error })`   | `toastManager.promise(p, { loading, success, error })`                            |
| `toast.dismiss(id)`                               | `toastManager.close(id)`                                                          |
| `action: { label, onClick }`                      | `actionProps: { children: label, onClick }`                                       |
| `<Toaster position="top-center" />`               | `<ToastProvider position="top-center">`                                           |

### Icons

shadcn/ui components import `lucide-react`. XiodUI components bring their own
icons, so you don't pass one. For icons the app renders itself, keep
`lucide-react` or switch to `xiod-icons`. Either works in `Button`, `MenuItem`,
and the rest.

### Styling selectors

Rewrite any `className` that targets Radix attributes. See SKILL.md →
"Styling state": `data-[state=open]:` → `data-open:` (or `data-popup-open:`
on the trigger), `data-[state=checked]:` → `data-checked:`,
`data-[state=active]:` → `data-active:`, `--radix-*-trigger-width` →
`--anchor-width`. Remove `animate-in`/`animate-out`/`fade-in-0`/`zoom-in-95`
classes: XiodUI popups animate themselves.

## 6. No direct equivalent

| shadcn/ui                      | Do this                                                                              |
| :----------------------------- | :----------------------------------------------------------------------------------- |
| `Chart` (recharts)             | Keep `components/ui/chart.tsx` and recharts; keep the `--chart-*` tokens             |
| `Typography` examples          | `Text` from `xiod-ui/text` (`variant="heading1"` … `"heading4"`, `"body"`, `"mono"`) |
| `navigationMenuTriggerStyle()` | Remove it: `NavigationMenuTrigger` and `NavigationMenuLink` are already styled       |
| Custom `components/ui` files   | Move them to the app's own folder and switch their internals to XiodUI parts         |

## 7. Remove shadcn/ui

When the inventory searches return nothing:

```bash
rm components.json
rm -r components/ui           # only files with no remaining imports
npm uninstall tw-animate-css tailwindcss-animate next-themes sonner vaul cmdk embla-carousel-react react-day-picker input-otp react-resizable-panels @hookform/resolvers react-hook-form
npm uninstall $(node -e "console.log(Object.keys({...require('./package.json').dependencies}).filter(n=>n.startsWith('@radix-ui/')).join(' '))")
```

Keep `react-hook-form`, `recharts`, or `lucide-react` if the app still uses them
directly. Delete `lib/utils.ts` only if `cn` was all it held, and switch those
imports to `import { cn } from "cn"`. Keep `class-variance-authority` if the
app's own components use `cva`.

## Checklist

- [ ] No import of `@/components/ui/`, `@radix-ui/`, `sonner`, `vaul`, or `cmdk` remains
- [ ] No `asChild`, `data-[state=`, `--radix-`, `animate-in`, or `hsl(var(--` remains
- [ ] The global stylesheet starts with the two imports and has no token blocks, `@theme inline`, or `@custom-variant dark`
- [ ] `ThemeProvider` and `useTheme` come from `xiod-ui/theme-provider`
- [ ] Every `Select` that shows a label passes `items`
- [ ] Build and typecheck pass; light, dark, and phone width checked
