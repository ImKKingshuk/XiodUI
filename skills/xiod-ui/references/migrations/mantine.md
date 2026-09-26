# Migrating from Mantine to XiodUI

Follow the six steps in SKILL.md → "Migrating an existing app". This page
supplies the Mantine specifics for each step.

Mantine's component structure is close to XiodUI's: compound parts, `value`
on tabs and accordion items, `multiple` on `Accordion`. The differences are
in three places:

- **Part names.** Mantine writes parts with a dot (`Menu.Target`); XiodUI
  imports each part by name (`MenuTrigger`).
- **Styling.** Mantine uses style props (`p="md"`, `c="dimmed"`), the
  `classNames`/`styles` API, and a JavaScript theme. XiodUI uses Tailwind
  classes on `className` and CSS tokens.
- **Extensions.** Toasts, forms, modals manager, dates, spotlight, carousel,
  and dropzone are separate `@mantine/*` packages. XiodUI has most of them
  built in.

**Name traps.**

| Mantine name   | In Mantine it is…                 | In XiodUI it is…                          | So Mantine's maps to…                         |
| :------------- | :-------------------------------- | :---------------------------------------- | :-------------------------------------------- |
| `Group`        | a horizontal flex row             | controls joined into one attached segment | `div className="flex items-center gap-4"`     |
| `Chip`         | a selectable toggle pill          | does not exist                            | `Toggle`; `Chip.Group` → `ToggleGroup`        |
| `Radio`        | one option                        | the group                                 | `RadioItem` (inside `Radio`)                  |
| `Grid`         | 12 columns with responsive `span` | a CSS grid, no breakpoint props           | Tailwind `grid` classes, or `Grid` when fixed |
| `Notification` | an inline notice card             | does not exist                            | `Alert`                                       |
| `Dialog`       | a small fixed corner panel        | a modal dialog                            | a fixed `Card`, or a toast                    |

## 1. Inventory

```bash
grep -rlE "@mantine/" --include=*.tsx --include=*.ts --include=*.jsx --include=*.js --include=*.css . --exclude-dir=node_modules
grep -rnE "\b(p|m|px|py|mt|mb|ml|mr|c|bg|fw|fz|w|h|maw|miw)=\{?[\"'0-9]" --include=*.tsx . --exclude-dir=node_modules | wc -l
grep -rlE "classNames=\{|styles=\{|createTheme|useMantineTheme|useMantineColorScheme" --include=*.tsx --include=*.ts . --exclude-dir=node_modules
ls postcss.config.* 2>/dev/null
```

The style-prop count tells you how much styling needs rewriting.

## 2. Setup

```bash
npm install xiod-ui cn
npm install -D tailwindcss @tailwindcss/postcss
```

Global stylesheet, imported once from the root layout or `main.tsx`:

```css
@import "tailwindcss";
@import "xiod-ui/styles";
```

Replace `postcss-preset-mantine` and `postcss-simple-vars` in the PostCSS
config with `"@tailwindcss/postcss": {}` (or use `@tailwindcss/vite` in Vite).

Providers and document setup:

| Mantine                                                                  | XiodUI                                                                            |
| :----------------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| `import "@mantine/core/styles.css"` (and other `@mantine/*/styles.css`)  | Remove; `xiod-ui/styles` covers every component                                   |
| `<MantineProvider theme={createTheme(…)}>`                               | `ThemeProvider` from `xiod-ui/theme-provider`; colours move to CSS tokens (below) |
| `defaultColorScheme="auto"`                                              | `defaultTheme="system"`                                                           |
| `<ColorSchemeScript />` in `<head>`, `{...mantineHtmlProps}` on `<html>` | Remove both; keep `suppressHydrationWarning` on `<html>`                          |
| `useMantineColorScheme()` (`setColorScheme`, `toggleColorScheme`)        | `useTheme()` (`setTheme`, `resolvedTheme`)                                        |
| `useComputedColorScheme()`                                               | `useTheme().resolvedTheme`                                                        |
| `<Notifications />` (`@mantine/notifications`)                           | `<ToastProvider>` from `xiod-ui/toast`, wrapping the app                          |
| `<ModalsProvider>` (`@mantine/modals`)                                   | Remove; render `Dialog`/`AlertDialog` where they're used                          |
| `<DatesProvider settings={…}>`                                           | Remove                                                                            |

**Theme → tokens.**

| `createTheme` key                        | XiodUI                                         |
| :--------------------------------------- | :--------------------------------------------- |
| `primaryColor` + `colors[primary][6]`    | `--primary` (shade 6 in light, 8 or 9 in dark) |
| `defaultRadius` (`"sm"`=4px, `"md"`=8px) | `--radius` (`0.25rem`, `0.5rem`)               |
| `fontFamily`                             | `--font-sans` in an `@theme` block             |
| `white` / `black`, `colors.dark[7]`      | `--background` in light / dark                 |
| `colors.gray` / `dimmed` text            | `--muted`, `--muted-foreground`                |

```css
:root {
  --primary: #228be6; /* blue.6 */
  --primary-foreground: #fff;
  --radius: 0.25rem;
}
.dark {
  --primary: #1971c2; /* blue.8 */
}
```

A XiodUI palette (SKILL.md → "Palettes") replaces a whole `colors` scale.

## 3. Style props and styles API

Mantine sizes: `xs` 10px, `sm` 12px, `md` 16px, `lg` 20px, `xl` 32px. In
Tailwind's 4px scale that is `2.5`, `3`, `4`, `5`, `8`.

| Mantine                                                | Tailwind on `className`                                                |
| :----------------------------------------------------- | :--------------------------------------------------------------------- |
| `p="md"`, `px="lg"`, `mt="xl"`                         | `p-4`, `px-5`, `mt-8`                                                  |
| `c="dimmed"`                                           | `text-muted-foreground`                                                |
| `c="red"`, `c="blue.6"`                                | `text-destructive`, `text-primary` (or a palette colour)               |
| `bg="gray.0"`, `bg="var(--mantine-color-body)"`        | `bg-muted`, `bg-background`                                            |
| `fw={500}`, `fz="sm"`, `ta="center"`, `tt="uppercase"` | `font-medium`, `text-sm`, `text-center`, `uppercase`                   |
| `w={200}`, `maw={400}`, `h="100%"`                     | `w-50`, `max-w-100`, `h-full`                                          |
| `hiddenFrom="sm"` / `visibleFrom="sm"`                 | `sm:hidden` / `hidden sm:block`                                        |
| `radius="xl"`                                          | `rounded-xl`                                                           |
| `shadow="sm"`                                          | `shadow-sm`                                                            |
| `classNames={{ root, label, … }}`, `styles={{ … }}`    | `className` on the matching XiodUI part                                |
| `component={Link} href="…"`, `renderRoot`              | `render={<Link href="…" />}` (plus `nativeButton={false}` on `Button`) |
| `useMantineTheme()` values in JS                       | CSS variables (`var(--primary)`) or classes                            |
| `@mantine/hooks` `useMediaQuery`                       | Keep it, or `useMediaQuery` from `xiod-ui/hooks/use-media-query`       |

`@mantine/hooks` has no UI and does not depend on `@mantine/core`. The app may
keep it (`useDisclosure`, `useDebouncedValue`, …). Replace only
`useClipboard` with `useCopyToClipboard` from
`xiod-ui/hooks/use-copy-to-clipboard` if you want one fewer package.

## 4. Components

| Mantine                                                                        | XiodUI                                                                                                                                                                                                                                                |
| :----------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button variant="filled"` (default), `"gradient"`                              | `Button` (default)                                                                                                                                                                                                                                    |
| `variant="light"`, `"white"`                                                   | `variant="secondary"`                                                                                                                                                                                                                                 |
| `variant="outline"`, `"default"`                                               | `variant="outline"`                                                                                                                                                                                                                                   |
| `variant="subtle"`, `"transparent"`                                            | `variant="ghost"`                                                                                                                                                                                                                                     |
| `color="red"` (filled / light, outline)                                        | `variant="destructive"` / `"destructive-outline"`                                                                                                                                                                                                     |
| `size="xs"`…`"xl"`                                                             | `size="xs"`, `"sm"`, `"default"`, `"lg"`, `"xl"`                                                                                                                                                                                                      |
| `leftSection`, `rightSection`                                                  | The icon as a child, before or after the text                                                                                                                                                                                                         |
| `loading`, `fullWidth`                                                         | `disabled` + `<Loader size="sm" />`; `className="w-full"`                                                                                                                                                                                             |
| `Button.Group`                                                                 | `ButtonGroup`                                                                                                                                                                                                                                         |
| `ActionIcon`, `CloseButton`                                                    | `Button size="icon" variant="ghost" aria-label="…"` with an icon                                                                                                                                                                                      |
| `CopyButton`                                                                   | `CopyToClipboard textToCopy="…"`                                                                                                                                                                                                                      |
| `TextInput label description error withAsterisk`                               | `Field invalid={!!error}` > `FieldLabel`, `Input required`, `FieldDescription`, `FieldError match`                                                                                                                                                    |
| `TextInput leftSection`/`rightSection`                                         | `InputGroup` > `InputGroupAddon` + `InputGroupInput`                                                                                                                                                                                                  |
| `PasswordInput`                                                                | `Input type="password"` (`InputSensitive` is for secrets like API keys: it adds reveal and copy)                                                                                                                                                      |
| `Textarea autosize`                                                            | `Textarea` (grows with content)                                                                                                                                                                                                                       |
| `NumberInput`                                                                  | `NumberField` > `NumberFieldGroup` > `NumberFieldDecrement`, `NumberFieldInput`, `NumberFieldIncrement`                                                                                                                                               |
| `PinInput length`                                                              | `InputOtp length` > `InputOtpGroup` > `InputOtpInput`                                                                                                                                                                                                 |
| `Select data`                                                                  | `Select items={data}` > `SelectTrigger` > `SelectValue`; `SelectPopup` > `SelectItem` per entry                                                                                                                                                       |
| `Select searchable`, `MultiSelect`, `TagsInput`                                | `Combobox items` (`multiple`, with `ComboboxChips` for tags)                                                                                                                                                                                          |
| `Autocomplete data`                                                            | `Autocomplete items`                                                                                                                                                                                                                                  |
| `NativeSelect`                                                                 | `Select`, or a native `<select>` with classes                                                                                                                                                                                                         |
| `Checkbox label`, `Checkbox.Group`                                             | `<Label><Checkbox /> …</Label>`; `CheckboxGroup`                                                                                                                                                                                                      |
| `Checkbox onChange={(e) => e.currentTarget.checked}`                           | `onCheckedChange={(checked) => …}`                                                                                                                                                                                                                    |
| `Radio.Group` + `Radio value label`                                            | `Radio` + `RadioItem value`, each in a `Label`                                                                                                                                                                                                        |
| `Switch label onChange`                                                        | `<Label><Switch /> …</Label>`, `onCheckedChange`                                                                                                                                                                                                      |
| `Chip`, `Chip.Group`                                                           | `Toggle`, `ToggleGroup` > `ToggleGroupItem`                                                                                                                                                                                                           |
| `SegmentedControl data`                                                        | `ToggleGroup` > `ToggleGroupItem` (or `Tabs` when it switches panels)                                                                                                                                                                                 |
| `Slider`, `RangeSlider`                                                        | `Slider` (an array `value` for a range)                                                                                                                                                                                                               |
| `ColorInput`, `ColorPicker`                                                    | `ColorPicker`                                                                                                                                                                                                                                         |
| `FileInput`, `FileButton`                                                      | `FileUpload`, or `Input type="file"`                                                                                                                                                                                                                  |
| `MaskInput` for phone / card numbers                                           | `InputPhone` / `InputPayment`                                                                                                                                                                                                                         |
| `Fieldset legend`                                                              | `Fieldset` > `FieldsetLegend`                                                                                                                                                                                                                         |
| `Modal opened onClose title`                                                   | `Dialog open onOpenChange` > `DialogPopup` > `DialogHeader` > `DialogTitle`, `DialogPanel`                                                                                                                                                            |
| `Modal fullScreen`, `size="lg"`                                                | `DialogPopup className="h-dvh max-w-none"`, `className="sm:max-w-2xl"`                                                                                                                                                                                |
| `Drawer position opened onClose`                                               | `Drawer position open onOpenChange` > `DrawerPopup`                                                                                                                                                                                                   |
| `Menu` + `Menu.Target` + `Menu.Dropdown`                                       | `Menu` + `MenuTrigger render={…}` + `MenuPopup`                                                                                                                                                                                                       |
| `Menu.Item leftSection rightSection`, `color="red"`                            | `MenuItem` with the icon as a child and `MenuShortcut`; `variant="destructive"`                                                                                                                                                                       |
| `Menu.Label`, `Menu.Divider`                                                   | `MenuGroup` > `MenuGroupLabel`; `MenuSeparator`                                                                                                                                                                                                       |
| `Menu.Sub` + `Menu.Sub.Target` + `Menu.Sub.Dropdown`                           | `MenuSub` > `MenuSubTrigger` + `MenuSubPopup`                                                                                                                                                                                                         |
| `Menu trigger="hover"`                                                         | `MenuTrigger openOnHover`                                                                                                                                                                                                                             |
| `Popover` + `Popover.Target` + `Popover.Dropdown`                              | `Popover` + `PopoverTrigger` + `PopoverPopup`                                                                                                                                                                                                         |
| `HoverCard` + `HoverCard.Target` + `HoverCard.Dropdown`                        | `PreviewCard` + `PreviewCardTrigger` + `PreviewCardPopup`                                                                                                                                                                                             |
| `Tooltip label position`                                                       | `Tooltip` > `TooltipTrigger render={…}` + `TooltipPopup side`                                                                                                                                                                                         |
| `Tabs` + `Tabs.List` + `Tabs.Tab value` + `Tabs.Panel value`                   | `Tabs` + `TabsList` + `TabsTab value` + `TabsPanel value`                                                                                                                                                                                             |
| `Tabs onChange={(v) => …}`                                                     | `onValueChange={(v) => …}`                                                                                                                                                                                                                            |
| `Tabs variant="outline"`/`"pills"`                                             | `Tabs` (default) / `variant="underline"` for line tabs                                                                                                                                                                                                |
| `Accordion` + `Accordion.Item value` + `Accordion.Control` + `Accordion.Panel` | `Accordion` + `AccordionItem value` + `AccordionTrigger` + `AccordionPanel`                                                                                                                                                                           |
| `Accordion value="a"` (single) / `multiple`                                    | `value={["a"]}` (always an array) / `multiple`                                                                                                                                                                                                        |
| `Collapse in={opened}`, `Spoiler`                                              | `Collapsible open` > `CollapsiblePanel`                                                                                                                                                                                                               |
| `Card` + `Card.Section`                                                        | `Card` > `CardHeader`, `CardPanel`, `CardFooter`; an `<img>` for an image section                                                                                                                                                                     |
| `Paper`                                                                        | `Card`, or a `div` with `bg-card rounded-lg border`                                                                                                                                                                                                   |
| `Alert title color icon`                                                       | `Alert variant` (`red` → `error`, `yellow` → `warning`, `green` → `success`, `blue` → `info`) > `AlertTitle`, `AlertDescription`                                                                                                                      |
| `Notification` (inline)                                                        | `Alert`                                                                                                                                                                                                                                               |
| `Badge variant color`                                                          | `Badge variant` (`default`, `secondary`, `outline`, `success`, `warning`, `destructive`, `info`)                                                                                                                                                      |
| `Indicator label`, `dot`                                                       | `CornerBadgeAnchor` + `CornerBadge` (`dot`)                                                                                                                                                                                                           |
| `Avatar src alt`, `Avatar.Group`                                               | `Avatar` > `AvatarImage src alt` + `AvatarFallback`; `AvatarGroup`                                                                                                                                                                                    |
| `Loader type="oval"`/`"dots"`/`"bars"`                                         | `Loader` (`variant="ring"`, `"dots"`, or another of its variants)                                                                                                                                                                                     |
| `LoadingOverlay visible`                                                       | An `absolute inset-0` overlay holding a `Loader`                                                                                                                                                                                                      |
| `Progress value`, `Progress.Root` + `Progress.Section`                         | `Progress value`; stacked sections have no equivalent                                                                                                                                                                                                 |
| `RingProgress`, `SemiCircleProgress`                                           | `CircularProgress`, `Gauge`                                                                                                                                                                                                                           |
| `Skeleton`, `Divider`, `Kbd`, `ScrollArea`                                     | `Skeleton`, `Separator`, `Kbd`, `ScrollArea`                                                                                                                                                                                                          |
| `Divider label="or"`                                                           | `div className="flex items-center gap-3"` with two `Separator`s around the text                                                                                                                                                                       |
| `Table` + `Table.Thead`/`Tbody`/`Tr`/`Th`/`Td`                                 | `Table` + `TableHeader`/`TableBody`/`TableRow`/`TableHead`/`TableCell`                                                                                                                                                                                |
| `Table data={{ head, body }}`                                                  | Map `head` to `TableHead`s and `body` rows to `TableRow`s                                                                                                                                                                                             |
| `Pagination total value onChange`                                              | `Pagination` > `PaginationContent` > `PaginationItem` > `PaginationLink`, `PaginationPrevious`, `PaginationNext` (render the pages)                                                                                                                   |
| `Breadcrumbs`                                                                  | `Breadcrumb` > `BreadcrumbList` > `BreadcrumbItem` > `BreadcrumbLink`/`BreadcrumbPage`, with `BreadcrumbSeparator`                                                                                                                                    |
| `Stepper` + `Stepper.Step`, `Timeline` + `Timeline.Item`                       | `Timeline` > `TimelineItem` > `TimelineIndicator`, `TimelineHeader` > `TimelineTitle`, `TimelineContent`                                                                                                                                              |
| `AppShell` (`header`, `navbar`, `AppShell.Main`)                               | `SidebarProvider` > `Sidebar` + `SidebarInset` (the page, with your own `<header>`)                                                                                                                                                                   |
| `NavLink label leftSection active`                                             | `SidebarMenuItem` > `SidebarMenuButton isActive render={<Link …/>}`                                                                                                                                                                                   |
| `Burger opened onClick`                                                        | `SidebarTrigger` in a sidebar layout; otherwise `Button size="icon" variant="ghost"`                                                                                                                                                                  |
| `Stack gap="md"`, `Group`, `Flex`                                              | `div className="flex flex-col gap-4"`, `"flex items-center gap-4"`, `"flex …"`                                                                                                                                                                        |
| `SimpleGrid cols={{ base: 1, sm: 3 }}`                                         | `div className="grid grid-cols-1 gap-4 sm:grid-cols-3"`                                                                                                                                                                                               |
| `Grid` + `Grid.Col span={{ base: 12, md: 6 }}`                                 | `div className="grid grid-cols-12 gap-4"` + `div className="col-span-12 md:col-span-6"`                                                                                                                                                               |
| `Container size="md"`, `Center`, `Space`, `Box`                                | `div className="mx-auto max-w-3xl px-4"`, `"flex items-center justify-center"`, margin classes, `div`                                                                                                                                                 |
| `Title order={1…4}`                                                            | `Text variant="heading1"`…`"heading4"`                                                                                                                                                                                                                |
| `Text c="dimmed" size="sm"`                                                    | `Text variant="secondary" size="sm"`                                                                                                                                                                                                                  |
| `Code`, `Mark`/`Highlight`, `Blockquote`                                       | `Text variant="mono"`, `<mark>`, `<blockquote>` with classes                                                                                                                                                                                          |
| `Anchor`                                                                       | `<a>` or the router's `Link`                                                                                                                                                                                                                          |
| `Image`, `BackgroundImage`                                                     | `<img>` or the framework's image component; a `div` with `bg-[url(…)]`                                                                                                                                                                                |
| `ThemeIcon`                                                                    | `span className="inline-flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground"` with the icon                                                                                                                         |
| `VisuallyHidden`                                                               | `span className="sr-only"`                                                                                                                                                                                                                            |
| `Affix`, `Transition`, `FocusTrap`, `Portal`                                   | `fixed` classes; CSS transitions; built into popups; built into popups                                                                                                                                                                                |
| `Splitter`                                                                     | `ResizablePanelGroup` > `ResizablePanel` + `ResizableHandle`                                                                                                                                                                                          |
| `EmptyState`                                                                   | `Empty` > `EmptyHeader` > `EmptyMedia`, `EmptyTitle`, `EmptyDescription`                                                                                                                                                                              |
| `Menubar`                                                                      | `Menubar` > `MenubarMenu` > `MenubarTrigger` + `MenubarPopup`                                                                                                                                                                                         |
| `@mantine/carousel` `Carousel` + `Carousel.Slide`                              | `Carousel` > `CarouselContent` > `CarouselItem` (+ `CarouselPrevious`, `CarouselNext`, `CarouselDots`)                                                                                                                                                |
| `@mantine/dropzone` `Dropzone`                                                 | `FileUpload`                                                                                                                                                                                                                                          |
| `@mantine/spotlight` `Spotlight actions` + `spotlight.open()`                  | `CommandDialog open onOpenChange` > `CommandDialogPopup` > `Command items={actions}` > `CommandInput` + `CommandPanel` > `CommandList` (a render function) > `CommandItem onClick`. The shadcn guide's "Command palette" pattern has the full example |
| `@mantine/dates` `DatePickerInput`, `DatePicker`, `Calendar`                   | `DatePicker value onSelect`, `Calendar selected onSelect` (see Patterns)                                                                                                                                                                              |
| `@mantine/dates` `TimeInput`                                                   | `Input type="time"`, or `WheelPicker`                                                                                                                                                                                                                 |

## 5. Patterns

### Notifications → toasts

| `@mantine/notifications`                           | XiodUI                                                 |
| :------------------------------------------------- | :----------------------------------------------------- |
| `notifications.show({ title, message })`           | `toastManager.add({ title, description: message })`    |
| `color: "red"` / `"green"` / `"yellow"` / `"blue"` | `type: "error"` / `"success"` / `"warning"` / `"info"` |
| `loading: true`                                    | `type: "loading"`                                      |
| `autoClose: 3000`, `autoClose: false`              | `timeout: 3000`, `timeout: 0`                          |
| `notifications.update({ id, … })`                  | `toastManager.update(id, { … })`                       |
| `notifications.hide(id)`                           | `toastManager.close(id)`                               |
| `<Notifications position="top-right" />`           | `<ToastProvider position="top-right">`                 |

### `modals.openConfirmModal` → `AlertDialog`

`@mantine/modals` opens dialogs from code. XiodUI renders them in JSX:
an `AlertDialog` with `AlertDialogPopup`, `AlertDialogTitle`,
`AlertDialogDescription`, and two `AlertDialogClose render={<Button …/>}`
buttons (Cancel, and the confirm action with `onClick`). When it opened from
code, hold `open` in state and pass `open`/`onOpenChange`.

### Forms (`@mantine/form` → `Form` + `Field`)

`useForm` can stay: it holds state and runs validation, and XiodUI renders
the fields. Spread what `getInputProps` returns into the XiodUI control, and
pass the error to `Field`:

```tsx
const email = form.getInputProps("email");

<Field invalid={Boolean(email.error)}>
  <FieldLabel>Email</FieldLabel>
  <Input value={email.value} onChange={email.onChange} onBlur={email.onBlur} />
  <FieldError match>{email.error}</FieldError>
</Field>;
```

For checkboxes, use `getInputProps("agree", { type: "checkbox" })` and pass
`checked` + `onCheckedChange={(v) => form.setFieldValue("agree", v)}`.
To drop `@mantine/form`, switch to XiodUI `Form` (`onFormSubmit`, `errors`,
`Field name`, native constraints or `Field validate`).

### Dates

`@mantine/dates` 8+ uses `"YYYY-MM-DD"` strings (7 used `Date`), with dayjs.
XiodUI uses `Date` and `{ from, to }` ranges. Convert at the boundary:
`new Date(\`${value}T00:00:00\`)`in,`date.toISOString().slice(0, 10)` out
(or keep dayjs for formatting).

## 6. No direct equivalent

`Rating`, `AngleSlider`, `JsonInput`, `Tree`, `TreeSelect`, `Cascader`,
`TableOfContents`, `Marquee`, `FloatingWindow`, stacked `Progress.Section`s,
and `@mantine/charts`. Build a simple version from XiodUI parts, or keep the
Mantine package for that one piece, and say so in the migration summary.

## 7. Remove Mantine

```bash
npm uninstall @mantine/core @mantine/notifications @mantine/modals @mantine/dates @mantine/spotlight @mantine/carousel @mantine/dropzone @mantine/form postcss-preset-mantine postcss-simple-vars
npm uninstall @mantine/hooks dayjs embla-carousel-react   # only if nothing else uses them
```

## Checklist

- [ ] No import of `@mantine/core` or its UI extensions remains (`@mantine/hooks`/`@mantine/form` only if kept on purpose)
- [ ] No `@mantine/*/styles.css` import, `MantineProvider`, or `ColorSchemeScript` remains
- [ ] No Mantine style props (`p=`, `c=`, `fw=`, `classNames=`, `styles=`) on XiodUI parts
- [ ] Mantine `Group` became a flex `div` (not XiodUI `Group`); `Chip` became `Toggle`; `Radio` became `RadioItem`
- [ ] Build and typecheck pass; light, dark, and phone width checked
