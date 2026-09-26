# Migrating from HeroUI to XiodUI

Follow the six steps in SKILL.md → "Migrating an existing app". This page
supplies the HeroUI specifics for each step.

HeroUI has two incompatible major versions. Check `package.json` first:

- **HeroUI 3** (`@heroui/react` 3.x, `@heroui/styles`): compound parts written
  with a dot (`Modal.Trigger`, `Tabs.Tab`), built on React Aria.
- **HeroUI 2** (`@heroui/react` 2.x, or the older `@nextui-org/react`): flat
  parts (`ModalContent`, `DropdownItem`), a Tailwind plugin (`heroui()`),
  `HeroUIProvider`, and `framer-motion`.

Both versions use React Aria prop names (`onPress`, `isDisabled`, `isOpen`,
`isSelected`). XiodUI uses standard DOM and Base UI names (`onClick`,
`disabled`, `open`, `checked`). Converting those props is most of the work.
They are in one table that covers both versions.

**The trap:** in HeroUI, `Radio` is a single option inside a `RadioGroup`. In
XiodUI, `Radio` is the **group** and `RadioItem` is the option. Never map
HeroUI `Radio` to XiodUI `Radio`.

## 1. Inventory

```bash
grep -rlE "@heroui/|@nextui-org/" --include=*.tsx --include=*.ts --include=*.css . --exclude-dir=node_modules
grep -rlE "framer-motion|@internationalized/date|useDisclosure|addToast|toast\(" --include=*.tsx --include=*.ts . --exclude-dir=node_modules
ls hero.ts hero.js tailwind.config.* 2>/dev/null
```

## 2. Setup

```bash
npm install xiod-ui cn
```

In the global stylesheet, delete the HeroUI lines, then start the file with
the two XiodUI imports:

| Remove (HeroUI 3)           | Remove (HeroUI 2)                                                      |
| :-------------------------- | :--------------------------------------------------------------------- |
| `@import "@heroui/styles";` | `@plugin "./hero.ts";` (and the `hero.ts` file with `heroui()`)        |
|                             | `@source "…/node_modules/@heroui/theme/dist/**/*…";`                   |
|                             | `@custom-variant dark (&:is(.dark *));`                                |
|                             | `plugins: [heroui()]` and the `content` entry in a `tailwind.config.*` |

```css
@import "tailwindcss";
@import "xiod-ui/styles";
```

Providers:

| HeroUI                                                             | XiodUI                                                                           |
| :----------------------------------------------------------------- | :------------------------------------------------------------------------------- |
| `<HeroUIProvider navigate={router.push}>` (v2)                     | Remove it. Links use `render={<Link href="…" />}` instead of `href` + `navigate` |
| `<ToastProvider />` from `@heroui/toast` (v2)                      | `<ToastProvider>` from `xiod-ui/toast`, wrapping the app                         |
| `<Toast.Provider />` (v3)                                          | `<ToastProvider>` from `xiod-ui/toast`                                           |
| next-themes, `className="dark"` or `data-theme="dark"` on `<html>` | `ThemeProvider` + `useTheme` from `xiod-ui/theme-provider`                       |

**Theme colours:** HeroUI 2 defines colours in `heroui({ themes: { light:
{ colors: { primary: … } } } })`. HeroUI 3 uses CSS variables such as
`--accent`. Move the brand colour to the XiodUI token with the same meaning,
after the imports:

```css
:root {
  --primary: #006fee; /* HeroUI "primary" (v2) or "accent" (v3) */
  --primary-foreground: #fff;

  @variant dark {
    --primary: #338ef7;
  }
}
```

HeroUI colour → XiodUI token: `primary`/`accent` → `--primary`, `danger` →
`--destructive`, `success` → `--success`, `warning` → `--warning`,
`default` → `--secondary`/`--muted`, `background` → `--background`,
`foreground` → `--foreground`, `divider` → `--border`, `focus` → `--ring`.

## 3. Props (both versions)

| HeroUI (React Aria)                                                        | XiodUI                                                                                                      |
| :------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------- |
| `onPress`                                                                  | `onClick`                                                                                                   |
| `isDisabled`                                                               | `disabled`                                                                                                  |
| `isReadOnly`, `isRequired`                                                 | `readOnly`, `required`                                                                                      |
| `isInvalid` + `errorMessage`                                               | `<Field invalid>` + `<FieldError match>message</FieldError>`                                                |
| `description` on a field                                                   | `<FieldDescription>`                                                                                        |
| `label` on a field                                                         | `<FieldLabel>` inside `<Field>`                                                                             |
| `isOpen` / `defaultOpen` / `onOpenChange`                                  | `open` / `defaultOpen` / `onOpenChange`                                                                     |
| `isSelected` / `defaultSelected` (Checkbox, Switch)                        | `checked` / `defaultChecked`                                                                                |
| `onValueChange` (v2) or `onChange` (v3) on Checkbox/Switch                 | `onCheckedChange`                                                                                           |
| `selectedKey` or `value`, `onSelectionChange` or `onChange` (Select, Tabs) | `value`, `onValueChange`                                                                                    |
| `selectedKeys={new Set(["a"])}` (v2 Select)                                | `value="a"`, or an array with `multiple`                                                                    |
| `defaultSelectedKey`                                                       | `defaultValue`                                                                                              |
| `key` or `id` that identifies an item or tab                               | `value` (keep `key` only for React lists)                                                                   |
| `onAction={(key) => …}` on a menu                                          | `onClick` on each `MenuItem`                                                                                |
| `isPending` (v3) / `isLoading` (v2) on Button                              | `disabled` plus `<Loader size="sm" />` inside the button                                                    |
| `isIconOnly`                                                               | `size="icon"` (`icon-sm`, `icon-lg`, …) and an `aria-label`                                                 |
| `fullWidth`                                                                | `className="w-full"`                                                                                        |
| `startContent` / `endContent`                                              | Put the icon inside the children, before or after the text; for inputs use `InputGroup` + `InputGroupAddon` |
| `placement` (Drawer, Popover, Tooltip)                                     | Drawer: `position`; popups: `side` + `align` on the `…Popup`                                                |
| `radius="full"`, `radius="none"`                                           | `className="rounded-full"`, `className="rounded-none"`                                                      |
| `size="md"`                                                                | `size="default"` (Button, Badge, Input, Select, Toggle); Avatar, Switch, and Loader use `"md"`              |
| `color="danger"` on Button                                                 | `variant="destructive"` (or `"destructive-outline"`)                                                        |
| `classNames={{ base, trigger, … }}` slots                                  | `className` on each XiodUI part, since every part is its own component                                      |
| `href` on Button or Link                                                   | `render={<Link href="…" />} nativeButton={false}` on `Button`                                               |

## 4. HeroUI 3 components

Most HeroUI 3 compound roots take a series of wrapper parts. XiodUI's `…Popup`
part already contains the portal, backdrop, positioner, and dialog. Drop those
wrappers; don't look for an equivalent.

| HeroUI 3                                                                                        | XiodUI                                                                                                                                                              |
| :---------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Button` `variant="primary"`                                                                    | `Button` `variant="default"`                                                                                                                                        |
| `variant="secondary"`, `"tertiary"`                                                             | `variant="secondary"`, `"ghost"`                                                                                                                                    |
| `variant="outline"`, `"ghost"`                                                                  | Same                                                                                                                                                                |
| `variant="danger"`, `"danger-soft"`                                                             | `variant="destructive"`, `"destructive-outline"`                                                                                                                    |
| `Modal`, `Modal.Trigger`                                                                        | `Dialog`, `DialogTrigger render={<Button />}`                                                                                                                       |
| `Modal.Backdrop` > `Modal.Container` > `Modal.Dialog`                                           | `DialogPopup` (one part)                                                                                                                                            |
| `Modal.Header`, `Modal.Heading`, `Modal.Icon`                                                   | `DialogHeader`, `DialogTitle`; put the icon in the header                                                                                                           |
| `Modal.Body`, `Modal.Footer`, `Modal.CloseTrigger`                                              | `DialogPanel`, `DialogFooter`, `DialogClose` (the popup already has an ✕)                                                                                           |
| `AlertDialog.*`                                                                                 | `AlertDialog`, `AlertDialogTrigger`, `AlertDialogPopup`, `AlertDialogHeader`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogClose` |
| `Drawer`, `Drawer.Content`/`Drawer.Dialog`, `Drawer.Handle`                                     | `Drawer position="…"`, `DrawerPopup`, `DrawerPopup showBar`                                                                                                         |
| `Drawer.Header`, `.Heading`, `.Body`, `.Footer`, `.CloseTrigger`                                | `DrawerHeader`, `DrawerTitle`, `DrawerPanel`, `DrawerFooter`, `DrawerClose`                                                                                         |
| `Dropdown`, `Dropdown.Trigger`                                                                  | `Menu`, `MenuTrigger`                                                                                                                                               |
| `Dropdown.Popover` > `Dropdown.Menu`                                                            | `MenuPopup` (one part)                                                                                                                                              |
| `Dropdown.Section`, `Header`, `Dropdown.Item`                                                   | `MenuGroup`, `MenuGroupLabel`, `MenuItem`                                                                                                                           |
| `Dropdown.SubmenuTrigger`                                                                       | `MenuSub` > `MenuSubTrigger` + `MenuSubPopup`                                                                                                                       |
| `Popover`, `.Trigger`, `.Content`/`.Dialog`, `.Heading`, `.Arrow`                               | `Popover`, `PopoverTrigger`, `PopoverPopup`, `PopoverTitle`, `PopoverArrow`                                                                                         |
| `Tooltip`, `.Trigger`, `.Content`, `.Arrow`                                                     | `Tooltip`, `TooltipTrigger`, `TooltipPopup`, `TooltipArrow`                                                                                                         |
| `Tabs`, `.ListContainer` > `.List`, `.Tab id`, `.Indicator`, `.Panel id`                        | `Tabs`, `TabsList`, `TabsTab value`, (built in), `TabsPanel value`                                                                                                  |
| `Tabs variant="secondary"`                                                                      | `Tabs variant="underline"`                                                                                                                                          |
| `Select`, `.Trigger`, `.Value`, `.Indicator`, `.Popover` + `ListBox.Item`                       | `Select items={…}`, `SelectTrigger`, `SelectValue`, (built in), `SelectPopup`, `SelectItem value`                                                                   |
| `ComboBox`, `Autocomplete`                                                                      | `Combobox`, `Autocomplete`                                                                                                                                          |
| `Accordion`, `.Item`, `.Heading` > `.Trigger`, `.Indicator`, `.Panel` > `.Body`                 | `Accordion`, `AccordionItem`, `AccordionTrigger`, (built in), `AccordionPanel`                                                                                      |
| `allowsMultipleExpanded`, `expandedKeys`                                                        | `multiple`, `value` (an array)                                                                                                                                      |
| `Disclosure`, `.Trigger`, `.Content`                                                            | `Collapsible`, `CollapsibleTrigger`, `CollapsiblePanel`                                                                                                             |
| `DisclosureGroup`                                                                               | `Accordion`                                                                                                                                                         |
| `Card`, `.Header`, `.Title`, `.Description`, `.Content`, `.Footer`                              | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardPanel`, `CardFooter`                                                                                     |
| `Card variant="secondary"`/`"tertiary"`/`"transparent"`                                         | `Card` with `className` (`bg-muted`, `bg-transparent`), or `Frame` for a grouped surface                                                                            |
| `Surface`                                                                                       | `Card`, or a `div` with `bg-card`                                                                                                                                   |
| `TextField` > `Label`, `Input`, `Description`, `FieldError`                                     | `Field` > `FieldLabel`, `Input`, `FieldDescription`, `FieldError`                                                                                                   |
| `TextArea`, `SearchField`                                                                       | `Textarea`; `Input type="search"`                                                                                                                                   |
| `NumberField`                                                                                   | `NumberField` > `NumberFieldGroup` > `NumberFieldDecrement`, `NumberFieldInput`, `NumberFieldIncrement`                                                             |
| `InputGroup`, `InputOTP`                                                                        | `InputGroup`, `InputOtp` > `InputOtpGroup` > `InputOtpInput`                                                                                                        |
| `Checkbox` > `.Control` > `.Indicator`, `.Content` > `Label`                                    | `<Label><Checkbox /> Text</Label>`                                                                                                                                  |
| `CheckboxGroup`                                                                                 | `CheckboxGroup`                                                                                                                                                     |
| `RadioGroup` > `Radio`                                                                          | `Radio` > `RadioItem`, each in a `Label`                                                                                                                            |
| `Switch` > `.Control` > `.Thumb`                                                                | `<Label><Switch /> Text</Label>`                                                                                                                                    |
| `SwitchGroup`                                                                                   | `Fieldset` + `FieldsetLegend` with `Switch`es                                                                                                                       |
| `Slider` > `.Output`, `.Track` > `.Fill`, `.Thumb`                                              | `Slider` (one part); `SliderValue` for the output                                                                                                                   |
| `Chip` (`color`)                                                                                | `Badge` (`variant`: `accent`→`default`, `danger`→`destructive`, `default`→`secondary`, `success`, `warning`)                                                        |
| `Badge` (a dot or count on a corner)                                                            | `CornerBadge` + `CornerBadgeAnchor` (`position` like `placement`)                                                                                                   |
| `TagGroup` > `Tag`                                                                              | `ToggleGroup` > `ToggleGroupItem` when tags are selectable; a list of `Badge`s otherwise                                                                            |
| `Alert` (`status`)                                                                              | `Alert` (`variant`: `accent`→`info`, `danger`→`error`, `default`, `success`, `warning`) with `AlertTitle`, `AlertDescription`                                       |
| `Avatar`, `.Image`, `.Fallback`; `AvatarGroup`                                                  | `Avatar`, `AvatarImage`, `AvatarFallback`; `AvatarGroup`                                                                                                            |
| `Spinner`                                                                                       | `Loader`                                                                                                                                                            |
| `ProgressBar`, `ProgressCircle`, `Meter`                                                        | `Progress`, `CircularProgress`, `Meter`                                                                                                                             |
| `Skeleton`, `Separator`, `Kbd`, `Pagination`, `Toolbar`, `ListBox`, `Fieldset`, `Form`, `Label` | Same names (`xiod-ui/<slug>`)                                                                                                                                       |
| `Breadcrumbs`                                                                                   | `Breadcrumb` > `BreadcrumbList` > `BreadcrumbItem` > `BreadcrumbLink`/`BreadcrumbPage`, with `BreadcrumbSeparator`                                                  |
| `ButtonGroup`, `ToggleButton`, `ToggleButtonGroup`                                              | `ButtonGroup`, `Toggle`, `ToggleGroup`                                                                                                                              |
| `CloseButton`                                                                                   | `Button size="icon" variant="ghost" aria-label="Close"` with an icon                                                                                                |
| `EmptyState`                                                                                    | `Empty` > `EmptyHeader` > `EmptyMedia`, `EmptyTitle`, `EmptyDescription`                                                                                            |
| `ScrollShadow`                                                                                  | `ScrollArea`                                                                                                                                                        |
| `Table.*`                                                                                       | `Table`, `TableHeader`, `TableRow`, `TableHead`, `TableBody`, `TableCell` (plain markup)                                                                            |
| `Typography` / `Header`                                                                         | `Text` (`variant="heading1"` … `"heading4"`, `"body"`)                                                                                                              |
| `Calendar`, `RangeCalendar`                                                                     | `Calendar mode="single"` / `mode="range"`                                                                                                                           |
| `DatePicker`, `DateRangePicker`                                                                 | `DatePicker mode="single"` / `mode="range"`                                                                                                                         |
| `ColorPicker`, `ColorArea`, `ColorSlider`, `ColorSwatchPicker`                                  | `ColorPicker` (one component)                                                                                                                                       |
| `Link`                                                                                          | Plain `<a>` or the router's `Link`; `Button variant="link"` for a styled one                                                                                        |

## 5. HeroUI 2 components

| HeroUI 2                                                                    | XiodUI                                                                                                                                            |
| :-------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Button color="primary" variant="solid"`                                    | `Button` (default)                                                                                                                                |
| `color="default"` or `variant="flat"`                                       | `variant="secondary"`                                                                                                                             |
| `variant="bordered"`, `"faded"`, `"ghost"`                                  | `variant="outline"`                                                                                                                               |
| `variant="light"`                                                           | `variant="ghost"`                                                                                                                                 |
| `color="danger"` (solid / bordered, flat, light)                            | `variant="destructive"` / `"destructive-outline"`                                                                                                 |
| `Modal`, `ModalContent`                                                     | `Dialog`, `DialogPopup`                                                                                                                           |
| `{(onClose) => …}` render function inside `ModalContent`                    | Plain children; close with `DialogClose`, or control `open`                                                                                       |
| `ModalHeader`, `ModalBody`, `ModalFooter`                                   | `DialogHeader` + `DialogTitle`, `DialogPanel`, `DialogFooter`                                                                                     |
| `useDisclosure()`                                                           | `const [open, setOpen] = useState(false)` with `open`/`onOpenChange`, or an uncontrolled `DialogTrigger`                                          |
| `Drawer`, `DrawerContent`, `DrawerHeader`, `DrawerBody`, `DrawerFooter`     | `Drawer position="…"`, `DrawerPopup`, `DrawerHeader`, `DrawerPanel`, `DrawerFooter`                                                               |
| `Dropdown`, `DropdownTrigger`, `DropdownMenu`, `DropdownItem key`           | `Menu`, `MenuTrigger`, `MenuPopup`, `MenuItem`                                                                                                    |
| `DropdownSection title="…"`                                                 | `MenuGroup` + `MenuGroupLabel`                                                                                                                    |
| `DropdownItem shortcut="⌘K"`, `color="danger"`                              | `<MenuShortcut>⌘K</MenuShortcut>` child, `variant="destructive"`                                                                                  |
| `Tabs` + `<Tab key="a" title="A">content</Tab>`                             | `Tabs` > `TabsList` > `TabsTab value="a"`, and `TabsPanel value="a"` for the content                                                              |
| `Select label` + `<SelectItem key="a">A</SelectItem>`                       | `Field` > `FieldLabel` + `Select items={…}` > `SelectTrigger` > `SelectValue`, `SelectPopup` > `SelectItem value="a"`                             |
| `Autocomplete` + `AutocompleteItem`                                         | `Combobox` (pick one value) or `Autocomplete` (free text with suggestions)                                                                        |
| `Listbox`, `ListboxItem`, `ListboxSection`                                  | `ListBox`, `ListBoxItem`, `ListBoxGroup` + `ListBoxLabel`                                                                                         |
| `Input label description errorMessage`                                      | `Field` > `FieldLabel`, `Input`, `FieldDescription`, `FieldError`                                                                                 |
| `Input startContent`                                                        | `InputGroup` > `InputGroupAddon` + `InputGroupInput`                                                                                              |
| `Textarea`, `NumberInput`, `InputOtp`                                       | `Textarea`, `NumberField`, `InputOtp`                                                                                                             |
| `Checkbox isSelected onValueChange`                                         | `Checkbox checked onCheckedChange`, wrapped in `Label`                                                                                            |
| `CheckboxGroup`, `RadioGroup` > `Radio`                                     | `CheckboxGroup`, `Radio` > `RadioItem`                                                                                                            |
| `Switch isSelected onValueChange`                                           | `Switch checked onCheckedChange`                                                                                                                  |
| `Slider`                                                                    | `Slider`                                                                                                                                          |
| `Accordion` + `<AccordionItem key title>content`                            | `Accordion` > `AccordionItem value` > `AccordionTrigger` + `AccordionPanel`                                                                       |
| `selectionMode="multiple"` on Accordion                                     | `multiple`                                                                                                                                        |
| `Card`, `CardHeader`, `CardBody`, `CardFooter`                              | `Card`, `CardHeader`, `CardPanel`, `CardFooter`                                                                                                   |
| `Popover`, `PopoverTrigger`, `PopoverContent`                               | `Popover`, `PopoverTrigger`, `PopoverPopup`                                                                                                       |
| `<Tooltip content="Hint"><Button /></Tooltip>`                              | `<Tooltip><TooltipTrigger render={<Button />} /><TooltipPopup>Hint</TooltipPopup></Tooltip>`                                                      |
| `Chip`                                                                      | `Badge`                                                                                                                                           |
| `Badge content="5"` around an element                                       | `CornerBadgeAnchor` + `CornerBadge`                                                                                                               |
| `Alert color`                                                               | `Alert variant` (`danger` → `error`, `primary` → `info`)                                                                                          |
| `Divider`, `Spacer`                                                         | `Separator`; gap or margin classes                                                                                                                |
| `Spinner`, `Progress`, `CircularProgress`                                   | `Loader`, `Progress`, `CircularProgress`                                                                                                          |
| `Skeleton isLoaded={x}`                                                     | `{x ? content : <Skeleton className="h-… w-…" />}`                                                                                                |
| `Avatar`, `AvatarGroup`, `User`                                             | `Avatar` + `AvatarImage` + `AvatarFallback`, `AvatarGroup`; `User` → an `Avatar` beside two lines of `Text`                                       |
| `Breadcrumbs`, `BreadcrumbItem`                                             | `Breadcrumb` > `BreadcrumbList` > `BreadcrumbItem` > `BreadcrumbLink`                                                                             |
| `Pagination total page onChange`                                            | `Pagination` > `PaginationContent` > `PaginationItem` > `PaginationLink`, `PaginationPrevious`, `PaginationNext` (render the page links yourself) |
| `Table`, `TableHeader`, `TableColumn`, `TableBody`, `TableRow`, `TableCell` | `Table`, `TableHeader` > `TableRow` > `TableHead`, `TableBody` > `TableRow` > `TableCell`                                                         |
| `Kbd keys={["command"]}`                                                    | `<Kbd>⌘</Kbd>`                                                                                                                                    |
| `Snippet`                                                                   | `CopyToClipboard` beside the text                                                                                                                 |
| `Code`                                                                      | `<Kbd>` for keys, `Text variant="mono"` for code                                                                                                  |
| `ScrollShadow`                                                              | `ScrollArea`                                                                                                                                      |
| `Image`                                                                     | `<img>` or the framework's image component                                                                                                        |
| `Link`                                                                      | `<a>` or the router's `Link`; `Button variant="link"` for a styled one                                                                            |
| `Navbar`, `NavbarBrand`, `NavbarContent`, `NavbarMenu`                      | No equivalent. Use a `<header>` with `NavigationMenu` for links, and `Drawer` for the mobile menu                                                 |
| `Calendar`, `DatePicker`, `DateRangePicker`                                 | `Calendar`, `DatePicker`, `DatePicker mode="range"`                                                                                               |

## 6. Patterns

### Dates

HeroUI's date components use `@internationalized/date` values
(`CalendarDate`, `parseDate("2026-01-03")`). XiodUI's `Calendar` and
`DatePicker` use plain `Date` objects and `{ from, to }` ranges. `Calendar`
takes `selected` + `onSelect`; `DatePicker` takes `value` + `onSelect`:

```tsx
// HeroUI
<DatePicker value={parseDate("2026-01-03")} onChange={setDate} />

// XiodUI
<DatePicker value={new Date(2026, 0, 3)} onSelect={(date) => setDate(date)} />
```

Convert stored values at the boundary (`calendarDate.toDate(getLocalTimeZone())`,
or `new Date(y, m - 1, d)`), then remove `@internationalized/date` if nothing
else uses it. XiodUI has no `DateField` or `TimeField`; use
`<Input type="date">` / `<Input type="time">` inside a `Field`.

### Toasts

| HeroUI                                                         | XiodUI                                                      |
| :------------------------------------------------------------- | :---------------------------------------------------------- |
| v2 `addToast({ title, description, color: "success" })`        | `toastManager.add({ title, description, type: "success" })` |
| v3 `toast("Saved", { description })`                           | `toastManager.add({ title: "Saved", description })`         |
| v3 `toast.success(…)`, `.danger(…)`, `.warning(…)`, `.info(…)` | `type: "success"`, `"error"`, `"warning"`, `"info"`         |
| v3 `toast.promise(p, { loading, success, error })`             | `toastManager.promise(p, { loading, success, error })`      |
| `timeout`, `actionProps`                                       | Same option names                                           |
| `toast.close(key)`                                             | `toastManager.close(id)`                                    |

### Forms

HeroUI `Form` with `validationErrors` and `onSubmit` → XiodUI `Form` with
`errors` and `onFormSubmit(values)`. Give each `Field` a `name`. React Aria's
`validate` on an input moves to `validate` on the `Field`. `validationBehavior`
has no equivalent: XiodUI validates natively on submit, and
`validationMode="onChange"`/`"onBlur"` on `Form` or `Field` changes when.

### Motion

HeroUI 2 animates with `framer-motion`. XiodUI animates in CSS. After
migrating, remove `framer-motion` if the app's own code does not import it.
`disableAnimation` props have no equivalent; XiodUI already respects
`prefers-reduced-motion`.

## 7. Remove HeroUI

```bash
npm uninstall @heroui/react @heroui/styles @heroui/theme @heroui/toast @nextui-org/react
npm uninstall framer-motion @internationalized/date   # only if nothing else imports them
rm hero.ts                                            # HeroUI 2
```

Also remove every other `@heroui/*` package listed in `package.json`.

## Checklist

- [ ] No import of `@heroui/` or `@nextui-org/` remains
- [ ] No `onPress`, `isDisabled`, `isOpen`, `isSelected`, `onSelectionChange`, `startContent`, or `classNames=` on XiodUI parts
- [ ] Every HeroUI `Radio` became a `RadioItem` inside a XiodUI `Radio`
- [ ] Dates are `Date` objects; `@internationalized/date` is gone or used only at boundaries
- [ ] The stylesheet has the two imports and no `@plugin` for HeroUI; no `hero.ts`
- [ ] Build and typecheck pass; light, dark, and phone width checked
