# Migrating from Chakra UI to XiodUI

Follow the six steps in SKILL.md → "Migrating an existing app". This page
supplies the Chakra UI specifics for each step.

Check the version in `package.json`:

- **Chakra UI 3** (`@chakra-ui/react` 3.x): namespaced parts on Ark UI
  (`Dialog.Root`, `Dialog.Content`), `ChakraProvider value={system}`, and
  local "snippet" wrappers in `components/ui/` (added by the Chakra CLI).
- **Chakra UI 2** (`@chakra-ui/react` 2.x): flat parts (`ModalContent`,
  `MenuButton`), `extendTheme`, `useToast`, and `framer-motion`.

Chakra styles with style props (`p={4}`, `bg="bg.muted"`, `_hover={{…}}`) on
Emotion. XiodUI uses Tailwind classes on `className` and CSS tokens. Chakra's
spacing scale matches Tailwind's (`4` = 1rem in both), so `p={4}` → `p-4`.

**Chakra 3 callbacks receive a details object; XiodUI's receive the value.**
Rewrite every handler:

| Chakra 3                                           | XiodUI                                      |
| :------------------------------------------------- | :------------------------------------------ |
| `onOpenChange={(e) => setOpen(e.open)}`            | `onOpenChange={setOpen}`                    |
| `onCheckedChange={(e) => setChecked(!!e.checked)}` | `onCheckedChange={setChecked}`              |
| `onValueChange={(e) => setValue(e.value)}`         | `onValueChange={setValue}`                  |
| `onPageChange={(e) => setPage(e.page)}`            | Your own `onClick` on each `PaginationLink` |
| `Menu.Root onSelect={(e) => run(e.value)}`         | `onClick` on each `MenuItem`                |

**Name traps.**

- Chakra's `components/ui/*` snippet files (`field.tsx`, `tooltip.tsx`,
  `toaster.tsx`, `color-mode.tsx`, …) are the app's own wrappers, like
  shadcn/ui. Replace their call sites with XiodUI parts, then delete the files.
- Chakra 3 uses `asChild` too; XiodUI uses `render`.
- Chakra 2 `Radio` is one option; XiodUI `Radio` is the group and `RadioItem`
  the option. (Chakra 3's `RadioGroup.Root` → XiodUI `Radio`, and
  `RadioGroup.Item` → `RadioItem`.)
- Chakra `Group` (v3) and `ButtonGroup attached` join controls. That matches
  XiodUI `Group`. But `HStack`/`Stack` are layout; use flex classes, not `Group`.

## 1. Inventory

```bash
grep -rlE "@chakra-ui/|@emotion/" --include=*.tsx --include=*.ts --include=*.jsx --include=*.js . --exclude-dir=node_modules
ls components/ui 2>/dev/null
grep -rnE "\b(p|m|px|py|mt|mb|bg|color|w|h|gap|rounded)=\{?[\"'0-9]|_hover=|_dark=|css=\{" --include=*.tsx . --exclude-dir=node_modules | wc -l
grep -rlE "useToast|toaster\.|useColorMode|useDisclosure|framer-motion|next-themes" --include=*.tsx --include=*.ts . --exclude-dir=node_modules
```

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

Providers:

| Chakra                                                                            | XiodUI                                                                                                                                         |
| :-------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| v3 `<ChakraProvider value={defaultSystem}>` / `createSystem(…)`                   | Remove; tokens move to CSS (below)                                                                                                             |
| v3 `ColorModeProvider` snippet (next-themes), `useColorMode`, `useColorModeValue` | `ThemeProvider` + `useTheme` from `xiod-ui/theme-provider`; `useColorModeValue(a, b)` → `resolvedTheme === "dark" ? b : a`, or a `dark:` class |
| v3 `<Toaster />` snippet + `createToaster({ placement })`                         | `<ToastProvider position="…">` from `xiod-ui/toast`                                                                                            |
| v2 `<ChakraProvider theme={extendTheme(…)}>`, `ColorModeScript`                   | Remove; `ThemeProvider` from `xiod-ui/theme-provider`                                                                                          |
| `CacheProvider` (`@chakra-ui/next-js`), Emotion registry                          | Remove                                                                                                                                         |

**Theme → tokens.**

| Chakra token                                          | XiodUI                                              |
| :---------------------------------------------------- | :-------------------------------------------------- |
| `colors.brand` / `colorPalette="brand"` (solid shade) | `--primary`, `--primary-foreground`                 |
| `bg`, `bg.subtle`/`bg.muted`, `bg.panel`              | `--background`, `--muted`, `--card`/`--popover`     |
| `fg`, `fg.muted`                                      | `--foreground`, `--muted-foreground`                |
| `border`                                              | `--border`                                          |
| `red`/`green`/`orange`/`blue` status colours          | `--destructive`, `--success`, `--warning`, `--info` |
| `radii.l2` (default control radius)                   | `--radius`                                          |
| `fonts.body`                                          | `--font-sans` in an `@theme` block                  |

## 3. Style props

| Chakra                                                            | Tailwind on `className`                                                   |
| :---------------------------------------------------------------- | :------------------------------------------------------------------------ |
| `p={4}`, `mt={2}`, `gap={6}`                                      | `p-4`, `mt-2`, `gap-6` (same scale)                                       |
| `bg="bg.muted"`, `color="fg.muted"`                               | `bg-muted`, `text-muted-foreground`                                       |
| `bg="blue.500"`, `color="red.600"`                                | `bg-primary`, `text-destructive` (or a palette colour)                    |
| `borderWidth="1px"`, `borderColor="border"`                       | `border` (colour is the default)                                          |
| `rounded="md"`, `shadow="sm"`                                     | `rounded-md`, `shadow-sm`                                                 |
| `w="full"`, `maxW="md"`, `h="100vh"`                              | `w-full`, `max-w-md`, `h-dvh`                                             |
| `fontWeight="semibold"`, `fontSize="sm"`, `textAlign="center"`    | `font-semibold`, `text-sm`, `text-center`                                 |
| `display={{ base: "none", md: "flex" }}`                          | `hidden md:flex`                                                          |
| `_hover={{ bg: "bg.muted" }}`, `_dark={{ … }}`                    | `hover:bg-muted`, `dark:…`                                                |
| `css={{ … }}`, `sx={{ … }}` (v2)                                  | Tailwind classes; arbitrary values as `[prop:value]`                      |
| `asChild` (v3), `as={Link}` (v2)                                  | `render={<Link href="…" />}` (plus `nativeButton={false}` on `Button`)    |
| `Box`, `Flex`, `Stack`/`VStack`, `HStack`, `Wrap`                 | `div` with `flex`, `flex-col gap-*`, `flex gap-*`, `flex flex-wrap gap-*` |
| `Grid templateColumns`, `SimpleGrid columns={{ base: 1, md: 3 }}` | `grid grid-cols-…`, `grid grid-cols-1 md:grid-cols-3`                     |
| `Container`, `Center`, `Spacer`                                   | `mx-auto max-w-… px-4`, `flex items-center justify-center`, `flex-1`      |
| `Show`/`Hide` (`below="md"`), `For`, `ClientOnly`                 | Responsive classes; `.map()`; nothing (render normally)                   |

## 4. Chakra 3 components

Chakra 3 wraps popups in `Portal` + `…Positioner` + `…Content`. XiodUI's
`…Popup` part does all three, so drop the `Portal` and `Positioner` wrappers.

| Chakra 3                                                                                  | XiodUI                                                                                                                              |
| :---------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| `Button variant="solid"` (default)                                                        | `Button` (default)                                                                                                                  |
| `variant="subtle"`, `"surface"`                                                           | `variant="secondary"`                                                                                                               |
| `variant="outline"`, `"ghost"`, `"plain"`                                                 | `variant="outline"`, `"ghost"`, `"link"`                                                                                            |
| `colorPalette="red"` (solid / outline, subtle)                                            | `variant="destructive"` / `"destructive-outline"`                                                                                   |
| `size="xs"`…`"2xl"`                                                                       | `size="xs"`, `"sm"`, `"default"`, `"lg"`, `"xl"`                                                                                    |
| `loading loadingText`                                                                     | `disabled` + `<Loader size="sm" />` + the text                                                                                      |
| `IconButton`, `CloseButton`                                                               | `Button size="icon" variant="ghost" aria-label="…"`                                                                                 |
| `ButtonGroup attached`, `Group attached`                                                  | `Group` (attached) or `ButtonGroup`                                                                                                 |
| `Dialog.Root open onOpenChange`                                                           | `Dialog open onOpenChange`                                                                                                          |
| `Dialog.Trigger asChild`                                                                  | `DialogTrigger render={<Button />}`                                                                                                 |
| `Dialog.Backdrop` + `Dialog.Positioner` + `Dialog.Content`                                | `DialogPopup`                                                                                                                       |
| `Dialog.Header`, `.Title`, `.Description`, `.Body`, `.Footer`                             | `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogPanel`, `DialogFooter`                                                   |
| `Dialog.CloseTrigger`, `Dialog.ActionTrigger`                                             | Built into `DialogPopup` (the ✕); `DialogClose render={<Button />}`                                                                 |
| `Dialog.Root role="alertdialog"`                                                          | `AlertDialog` with `AlertDialogPopup` and the matching parts                                                                        |
| `Drawer.Root placement="end"`/`"start"`/`"top"`/`"bottom"`                                | `Drawer position="right"`/`"left"`/`"top"`/`"bottom"` + `DrawerPopup`                                                               |
| `Menu.Root`, `Menu.Trigger`, `Menu.Positioner` > `Menu.Content`                           | `Menu`, `MenuTrigger`, `MenuPopup`                                                                                                  |
| `Menu.Item value`, `Menu.ItemCommand`                                                     | `MenuItem onClick`, `MenuShortcut`                                                                                                  |
| `Menu.ItemGroup` + `Menu.ItemGroupLabel`, `Menu.Separator`                                | `MenuGroup` + `MenuGroupLabel`, `MenuSeparator`                                                                                     |
| `Menu.CheckboxItem`, `Menu.RadioItemGroup` + `Menu.RadioItem`                             | `MenuCheckboxItem`, `MenuRadioGroup` + `MenuRadioItem`                                                                              |
| nested `Menu.Root` + `Menu.TriggerItem`                                                   | `MenuSub` > `MenuSubTrigger` + `MenuSubPopup`                                                                                       |
| `Menu.ContextTrigger`                                                                     | `ContextMenu` > `ContextMenuTrigger` + `ContextMenuPopup`                                                                           |
| `Popover.Root`, `.Trigger`, `.Positioner` > `.Content`                                    | `Popover`, `PopoverTrigger`, `PopoverPopup`                                                                                         |
| `Popover.Title`, `.Body`, `.Arrow`                                                        | `PopoverTitle`, the content, `PopoverArrow`                                                                                         |
| `HoverCard.*`                                                                             | `PreviewCard`, `PreviewCardTrigger`, `PreviewCardPopup`                                                                             |
| `Tooltip.Root/Trigger/Content` or snippet `<Tooltip content>`                             | `Tooltip` > `TooltipTrigger render={…}` + `TooltipPopup`                                                                            |
| `Tabs.Root`, `.List`, `.Trigger value`, `.Content value`, `.Indicator`                    | `Tabs`, `TabsList`, `TabsTab value`, `TabsPanel value`, (built in)                                                                  |
| `Tabs.Root variant="line"`                                                                | `Tabs variant="underline"`                                                                                                          |
| `Accordion.Root collapsible multiple`                                                     | `Accordion` (items close on click by default; `multiple` stays)                                                                     |
| `Accordion.Item value`, `.ItemTrigger`, `.ItemIndicator`, `.ItemContent` > `.ItemBody`    | `AccordionItem value`, `AccordionTrigger`, (built in), `AccordionPanel`                                                             |
| `Collapsible.Root`, `.Trigger`, `.Content`                                                | `Collapsible`, `CollapsibleTrigger`, `CollapsiblePanel`                                                                             |
| `Field.Root invalid required`                                                             | `Field invalid` (put `required` on the control)                                                                                     |
| `Field.Label`, `.HelperText`, `.ErrorText`, `.RequiredIndicator`                          | `FieldLabel`, `FieldDescription`, `FieldError match`, an `*` in the label                                                           |
| snippet `<Field label helperText errorText>`                                              | The same, as parts                                                                                                                  |
| `Fieldset.Root`, `.Legend`, `.Content`                                                    | `Fieldset`, `FieldsetLegend`, children                                                                                              |
| `Input`, `Textarea`                                                                       | `Input`, `Textarea`                                                                                                                 |
| `InputGroup startElement endElement`, `InputAddon`                                        | `InputGroup` > `InputGroupAddon` (`align`) + `InputGroupInput`                                                                      |
| `NumberInput.Root`, `.Input`, `.Control` (`.IncrementTrigger`, `.DecrementTrigger`)       | `NumberField` > `NumberFieldGroup` > `NumberFieldDecrement`, `NumberFieldInput`, `NumberFieldIncrement`                             |
| `PinInput.Root`, `.Control`, `.Input index`                                               | `InputOtp length` > `InputOtpGroup` > `InputOtpInput`                                                                               |
| `Select.Root collection={createListCollection({ items })}`                                | `Select items={items}`                                                                                                              |
| `Select.Trigger` > `.ValueText`, `.Positioner` > `.Content` > `.Item item`                | `SelectTrigger` > `SelectValue`, `SelectPopup` > `SelectItem value`                                                                 |
| `Select.Control`, `.IndicatorGroup`, `.HiddenSelect`, `.ItemIndicator`                    | Drop: built in                                                                                                                      |
| `NativeSelect.Root` > `.Field`                                                            | `Select`, or a native `<select>` with classes                                                                                       |
| `Combobox.Root collection`, `TagsInput`                                                   | `Combobox items` (`multiple` with `ComboboxChips` for tags)                                                                         |
| `Listbox.*`                                                                               | `ListBox`, `ListBoxItem`, `ListBoxGroup`, `ListBoxLabel`                                                                            |
| `Checkbox.Root` > `.HiddenInput`, `.Control`, `.Label`                                    | `<Label><Checkbox /> …</Label>`                                                                                                     |
| `CheckboxGroup`, `CheckboxCard`                                                           | `CheckboxGroup`; a `Label` styled as a card around a `Checkbox`                                                                     |
| `RadioGroup.Root` > `RadioGroup.Item` > `.ItemHiddenInput`, `.ItemIndicator`, `.ItemText` | `Radio` > `RadioItem`, each in a `Label`                                                                                            |
| `RadioCard`, `SegmentGroup`                                                               | `ToggleGroup` > `ToggleGroupItem`                                                                                                   |
| `Switch.Root` > `.HiddenInput`, `.Control` > `.Thumb`, `.Label`                           | `<Label><Switch /> …</Label>`                                                                                                       |
| `Slider.Root value={[40]}` > `.Control` > `.Track` > `.Range`, `.Thumbs`                  | `Slider value={40}` (arrays only for a range)                                                                                       |
| `Toggle`                                                                                  | `Toggle`                                                                                                                            |
| `ColorPicker.*`, `FileUpload.*`, `DatePicker.*`                                           | `ColorPicker`, `FileUpload`, `DatePicker` (with `Date` values)                                                                      |
| `Card.Root`, `.Header`, `.Title`, `.Description`, `.Body`, `.Footer`                      | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardPanel`, `CardFooter`                                                     |
| `Alert.Root status` > `.Indicator`, `.Content` > `.Title`, `.Description`                 | `Alert variant` (`error`, `warning`, `success`, `info`) > `AlertTitle`, `AlertDescription`                                          |
| `Badge colorPalette`, `Tag.Root` > `.Label`, `.CloseTrigger`                              | `Badge variant`; a `Button size="icon-xs"` inside for closing                                                                       |
| `Avatar.Root` > `.Image`, `.Fallback`; `AvatarGroup`                                      | `Avatar` > `AvatarImage`, `AvatarFallback`; `AvatarGroup`                                                                           |
| `Float` (badge on a corner)                                                               | `CornerBadgeAnchor` + `CornerBadge`                                                                                                 |
| `Spinner`, `Loader`                                                                       | `Loader`                                                                                                                            |
| `Progress.Root` > `.Track` > `.Range`, `.Label`, `.ValueText`                             | `Progress` > `ProgressTrack` > `ProgressIndicator`, `ProgressLabel`, `ProgressValue` (or just `Progress value`)                     |
| `ProgressCircle.*`                                                                        | `CircularProgress`                                                                                                                  |
| `Skeleton`, `SkeletonText noOfLines`, `SkeletonCircle`                                    | `Skeleton` (one per line), `Skeleton className="rounded-full"`                                                                      |
| `Separator`, `Kbd`, `ScrollArea`                                                          | `Separator`, `Kbd`, `ScrollArea`                                                                                                    |
| `Table.Root` > `.Header`, `.Body` > `.Row` > `.ColumnHeader`, `.Cell`                     | `Table` > `TableHeader`, `TableBody` > `TableRow` > `TableHead`, `TableCell`                                                        |
| `Pagination.Root count pageSize page`                                                     | `Pagination` > `PaginationContent` > `PaginationItem` > `PaginationLink`, `PaginationPrevious`, `PaginationNext` (render the pages) |
| `Breadcrumb.Root` > `.List` > `.Item` > `.Link`, `.CurrentLink`, `.Separator`             | `Breadcrumb` > `BreadcrumbList` > `BreadcrumbItem` > `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`                      |
| `Steps.*`, `Timeline.*`                                                                   | `Timeline` > `TimelineItem` > `TimelineIndicator`, `TimelineHeader` > `TimelineTitle`, `TimelineContent`                            |
| `EmptyState.Root` > `.Indicator`, `.Title`, `.Description`                                | `Empty` > `EmptyHeader` > `EmptyMedia`, `EmptyTitle`, `EmptyDescription`                                                            |
| `Stat.Root` > `.Label`, `.ValueText`                                                      | `Text variant="secondary" size="sm"` over `Text variant="heading2"`                                                                 |
| `DataList.*`                                                                              | `<dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">`                                                                        |
| `Clipboard.*`                                                                             | `CopyToClipboard textToCopy="…"`                                                                                                    |
| `Carousel.*`                                                                              | `Carousel` > `CarouselContent` > `CarouselItem` (+ `CarouselPrevious`, `CarouselNext`, `CarouselDots`)                              |
| `Splitter.*`                                                                              | `ResizablePanelGroup` > `ResizablePanel` + `ResizableHandle`                                                                        |
| `Heading size`, `Text color="fg.muted"`                                                   | `Text variant="heading1"`…`"heading4"`, `Text variant="secondary"`                                                                  |
| `Code`, `Mark`, `Blockquote`, `Link`, `Image`                                             | `Text variant="mono"`, `<mark>`, `<blockquote>`, `<a>`, `<img>` with classes                                                        |

## 5. Chakra 2 components

| Chakra 2                                                                            | XiodUI                                                                                                                          |
| :---------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------ |
| `Button colorScheme variant="solid"`/`"outline"`/`"ghost"`/`"link"`                 | `Button` / `variant="outline"`/`"ghost"`/`"link"`; `colorScheme="red"` → `"destructive"`                                        |
| `isLoading`, `isDisabled`, `leftIcon`, `rightIcon`                                  | `disabled` + `Loader`; `disabled`; icons as children                                                                            |
| `Modal isOpen onClose`                                                              | `Dialog open onOpenChange`                                                                                                      |
| `ModalOverlay` + `ModalContent`                                                     | `DialogPopup`                                                                                                                   |
| `ModalHeader`, `ModalCloseButton`, `ModalBody`, `ModalFooter`                       | `DialogHeader` > `DialogTitle`, (built in), `DialogPanel`, `DialogFooter`                                                       |
| `AlertDialog` + `AlertDialogOverlay` + `AlertDialogContent` + `leastDestructiveRef` | `AlertDialog` + `AlertDialogPopup` (focus is handled; drop the ref)                                                             |
| `Drawer placement isOpen onClose` + `DrawerOverlay` + `DrawerContent`               | `Drawer position open onOpenChange` + `DrawerPopup`                                                                             |
| `Menu`, `MenuButton as={Button}`, `MenuList`, `MenuItem`                            | `Menu`, `MenuTrigger render={<Button />}`, `MenuPopup`, `MenuItem`                                                              |
| `MenuGroup title`, `MenuDivider`, `MenuItemOption`, `MenuOptionGroup`               | `MenuGroup` + `MenuGroupLabel`, `MenuSeparator`, `MenuRadioItem`/`MenuCheckboxItem`, `MenuRadioGroup`                           |
| `Popover`, `PopoverTrigger`, `PopoverContent`, `PopoverBody`                        | `Popover`, `PopoverTrigger`, `PopoverPopup`, the content                                                                        |
| `Tooltip label`                                                                     | `Tooltip` > `TooltipTrigger render={…}` + `TooltipPopup`                                                                        |
| `Tabs index onChange` + `TabList` > `Tab`, `TabPanels` > `TabPanel`                 | `Tabs value onValueChange` + `TabsList` > `TabsTab value`, `TabsPanel value` (give each tab a `value`; Chakra 2 used positions) |
| `Accordion allowToggle allowMultiple`                                               | `Accordion` (toggling is the default) + `multiple`                                                                              |
| `AccordionItem`, `AccordionButton` + `AccordionIcon`, `AccordionPanel`              | `AccordionItem value`, `AccordionTrigger`, `AccordionPanel`                                                                     |
| `FormControl isInvalid isRequired`                                                  | `Field invalid`; `required` on the control                                                                                      |
| `FormLabel`, `FormHelperText`, `FormErrorMessage`                                   | `FieldLabel`, `FieldDescription`, `FieldError match`                                                                            |
| `InputGroup` + `InputLeftElement`/`InputRightAddon`                                 | `InputGroup` > `InputGroupAddon` + `InputGroupInput`                                                                            |
| `Select placeholder` (native)                                                       | `Select items` > `SelectTrigger` > `SelectValue placeholder`, `SelectPopup` > `SelectItem`                                      |
| `Checkbox isChecked onChange`, `Switch isChecked onChange`                          | `checked onCheckedChange={(checked) => …}`                                                                                      |
| `RadioGroup` + `Radio`                                                              | `Radio` + `RadioItem`                                                                                                           |
| `Slider` > `SliderTrack` > `SliderFilledTrack`, `SliderThumb`                       | `Slider`                                                                                                                        |
| `PinInput` + `PinInputField`                                                        | `InputOtp` > `InputOtpGroup` > `InputOtpInput`                                                                                  |
| `NumberInput` + `NumberInputField` + `NumberInputStepper`                           | `NumberField` > `NumberFieldGroup` > …                                                                                          |
| `Tag`, `Badge`, `Divider`, `Spinner`, `CircularProgress`                            | `Badge`, `Badge`, `Separator`, `Loader`, `CircularProgress`                                                                     |
| `Alert status` + `AlertIcon`, `AlertTitle`, `AlertDescription`                      | `Alert variant` + `AlertTitle`, `AlertDescription` (icon built in)                                                              |
| `Card`, `CardHeader`, `CardBody`, `CardFooter`                                      | `Card`, `CardHeader`, `CardPanel`, `CardFooter`                                                                                 |
| `Table`, `Thead`, `Tbody`, `Tr`, `Th`, `Td`, `TableContainer`                       | `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`                                                       |
| `Stat`, `StatLabel`, `StatNumber`                                                   | Two `Text`s                                                                                                                     |
| `useDisclosure()`                                                                   | `useState` + `open`/`onOpenChange`, or uncontrolled triggers                                                                    |

## 6. Patterns

### Toasts

| Chakra                                                                           | XiodUI                                                      |
| :------------------------------------------------------------------------------- | :---------------------------------------------------------- |
| v3 `toaster.create({ title, description, type: "success" })`                     | `toastManager.add({ title, description, type: "success" })` |
| v3 `toaster.promise(p, { loading, success, error })`                             | `toastManager.promise(p, { loading, success, error })`      |
| v3 `toaster.update(id, …)`, `toaster.dismiss(id)`                                | `toastManager.update(id, …)`, `toastManager.close(id)`      |
| v2 `const toast = useToast(); toast({ title, status: "error", duration: 3000 })` | `toastManager.add({ title, type: "error", timeout: 3000 })` |
| `isClosable: true` / `closable: true`                                            | `<ToastProvider closeButton>`                               |
| `action: { label, onClick }`                                                     | `actionProps: { children: label, onClick }`                 |

### Colour-mode values in JS

`useColorModeValue("white", "gray.800")` usually picks a colour. Replace it with
a token class (`bg-background`) so no JS is needed. When JS really needs the
mode, use `useTheme().resolvedTheme`.

## 7. No direct equivalent

`RatingGroup`, `Editable`, `TreeView`, `QrCode`, `Marquee`, `ActionBar`,
`FloatingPanel`, and Chakra charts. Build a simple version from XiodUI parts,
or keep a focused library for that piece, and list it in the migration summary.

## 8. Remove Chakra

```bash
npm uninstall @chakra-ui/react @chakra-ui/next-js @chakra-ui/icons @emotion/react @emotion/styled framer-motion next-themes
rm -r components/ui   # Chakra snippets, once nothing imports them
```

Keep `framer-motion` or `next-themes` only if the app's own code imports them.

## Checklist

- [ ] No import of `@chakra-ui/` or `@emotion/` remains; no Chakra snippet files remain
- [ ] No handler reads `e.open`, `e.checked`, `e.value`, or `e.page` from a XiodUI callback
- [ ] No Chakra style props (`p=`, `bg=`, `_hover=`, `css=`), `asChild`, or `as=` on XiodUI parts
- [ ] No `Portal` or `…Positioner` wrappers left around XiodUI popups
- [ ] Build and typecheck pass; light, dark, and phone width checked
