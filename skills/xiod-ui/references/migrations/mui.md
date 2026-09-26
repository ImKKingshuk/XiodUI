# Migrating from MUI (Material UI) to XiodUI

Follow the six steps in SKILL.md → "Migrating an existing app". This page
supplies the MUI specifics for each step.

MUI styles with Emotion (CSS-in-JS), a JavaScript theme (`createTheme`), and
the `sx` prop. XiodUI styles with Tailwind CSS 4 classes and CSS variables.
So a migration from MUI replaces **styling** as well as components: every `sx`, `styled()`,
`makeStyles`, and theme lookup becomes Tailwind classes on `className`.

MUI also gives layout primitives (`Box`, `Stack`, `Grid`, `Container`) and
typography (`Typography`) that XiodUI covers with plain elements plus
Tailwind, or with `Grid` and `Text`.

**Name traps.** These MUI names exist in XiodUI but mean something else:

| MUI name                                        | In MUI it is…                  | In XiodUI it is…                                           | So MUI's maps to…                             |
| :---------------------------------------------- | :----------------------------- | :--------------------------------------------------------- | :-------------------------------------------- |
| `Accordion`                                     | one collapsible item           | the group that holds items                                 | `AccordionItem` (inside one `Accordion`)      |
| `Radio`                                         | one option                     | the group                                                  | `RadioItem` (inside `Radio`)                  |
| `DialogContent`                                 | the dialog body                | does not exist                                             | `DialogPanel`                                 |
| `TableHead`                                     | the header section (`<thead>`) | a header cell (`<th>`)                                     | `TableHeader`                                 |
| `Toolbar`                                       | the bar inside an `AppBar`     | an ARIA toolbar of controls                                | a `<header>`/`<div>` with flex classes        |
| `Group` (none in MUI; don't use it for `Stack`) | —                              | controls joined into one attached segment                  | —                                             |
| `Grid`                                          | responsive 12-column layout    | a CSS grid (`columns`, `GridItem colSpan`), no breakpoints | Tailwind `grid` classes, or `Grid` when fixed |

## 1. Inventory

```bash
grep -rlE "@mui/|@emotion/" --include=*.tsx --include=*.ts --include=*.jsx --include=*.js . --exclude-dir=node_modules
grep -rnE "\bsx=|styled\(|makeStyles|withStyles|useTheme\(|createTheme|ThemeProvider|CssBaseline" --include=*.tsx --include=*.ts . --exclude-dir=node_modules | wc -l
grep -rlE "notistack|@mui/x-date-pickers|@mui/lab|dayjs|date-fns" --include=*.tsx --include=*.ts . --exclude-dir=node_modules
```

The `sx`/`styled` count tells you how much styling needs rewriting. Plan for it.

## 2. Setup

MUI apps often have no Tailwind. Install both:

```bash
npm install xiod-ui cn
npm install -D tailwindcss @tailwindcss/postcss
```

Create or edit the global stylesheet (import it once from the root layout or
`main.tsx`):

```css
@import "tailwindcss";
@import "xiod-ui/styles";
```

For a Vite app without PostCSS, use `@tailwindcss/vite` instead; for Next.js,
add `postcss.config.mjs` with `{ plugins: { "@tailwindcss/postcss": {} } }`.

Providers and globals:

| MUI                                                       | XiodUI                                                                                              |
| :-------------------------------------------------------- | :-------------------------------------------------------------------------------------------------- |
| `<ThemeProvider theme={createTheme(…)}>`                  | `ThemeProvider` from `xiod-ui/theme-provider` (light/dark only). Colours move to CSS tokens (below) |
| `<CssBaseline />`, `ScopedCssBaseline`                    | Remove. `xiod-ui/styles` includes the base reset                                                    |
| `palette.mode`, `colorSchemes`, `useColorScheme()`        | `useTheme()` from `xiod-ui/theme-provider` (`theme`, `resolvedTheme`, `setTheme`)                   |
| `InitColorSchemeScript`                                   | Remove; `ThemeProvider` prevents the flash itself                                                   |
| `<SnackbarProvider>` (notistack)                          | `<ToastProvider>` from `xiod-ui/toast`                                                              |
| `<LocalizationProvider dateAdapter={…}>`                  | Remove; XiodUI date components use `Date`                                                           |
| Next.js `AppRouterCacheProvider` (`@mui/material-nextjs`) | Remove                                                                                              |

**Theme → tokens.** Move `createTheme` values into CSS after the imports:

| `createTheme` key                           | XiodUI token                                                                                          |
| :------------------------------------------ | :---------------------------------------------------------------------------------------------------- |
| `palette.primary.main` / `.contrastText`    | `--primary` / `--primary-foreground`                                                                  |
| `palette.secondary.main`                    | `--secondary` (a neutral surface in XiodUI; use `--accent` if the app's secondary is a strong colour) |
| `palette.error.main`                        | `--destructive`                                                                                       |
| `palette.success.main`, `.warning`, `.info` | `--success`, `--warning`, `--info`                                                                    |
| `palette.background.default` / `.paper`     | `--background` / `--card` and `--popover`                                                             |
| `palette.text.primary` / `.secondary`       | `--foreground` / `--muted-foreground`                                                                 |
| `palette.divider`                           | `--border`                                                                                            |
| `shape.borderRadius` (px)                   | `--radius`                                                                                            |
| `typography.fontFamily`                     | `--font-sans` in an `@theme` block                                                                    |

```css
:root {
  --primary: #1976d2;
  --primary-foreground: #fff;
  --radius: 0.25rem;
}
.dark {
  --primary: #90caf9;
  --primary-foreground: #0a1929;
}
```

Or skip hand-tuning and pick one of the 19 palettes (SKILL.md → "Palettes").

## 3. Styling: `sx`, `styled`, theme lookups

| MUI                                               | XiodUI (Tailwind on `className`)                                                            |
| :------------------------------------------------ | :------------------------------------------------------------------------------------------ |
| `sx={{ p: 2, mt: 1 }}` (8px spacing unit)         | `className="p-4 mt-2"` (Tailwind's unit is 4px: MUI `n` → Tailwind `2n`)                    |
| `sx={{ display: "flex", gap: 2 }}`                | `className="flex gap-4"`                                                                    |
| `sx={{ color: "text.secondary" }}`                | `className="text-muted-foreground"`                                                         |
| `sx={{ bgcolor: "background.paper" }}`            | `className="bg-card"`                                                                       |
| `sx={{ color: "primary.main" }}`                  | `className="text-primary"`                                                                  |
| `sx={{ borderColor: "divider" }}`                 | `className="border-border"` (the default)                                                   |
| `sx={{ width: { xs: "100%", md: 400 } }}`         | `className="w-full md:w-100"`                                                               |
| `theme.breakpoints.up("md")`                      | `md:` variant (Tailwind `md` is 768px; MUI `md` is 900px — pick deliberately)               |
| `styled(Button)(({ theme }) => …)`                | A function component that renders `<Button className={cn("…", className)} />`               |
| `makeStyles` / `withStyles` classes               | Tailwind classes; conditional ones with `cn()`                                              |
| `elevation={n}` / `boxShadow: n`                  | `shadow-xs` … `shadow-xl`                                                                   |
| `slotProps` / `componentsProps` for a sub-part    | `className` or props on the matching XiodUI part                                            |
| `component={Link}` / `component="a"`              | `render={<Link href="…" />}` (and `nativeButton={false}` on `Button`)                       |
| MUI `useMediaQuery(theme.breakpoints.down("sm"))` | `useMediaQuery` / `useIsMobile` from `xiod-ui/hooks/use-media-query`, or a Tailwind variant |

## 4. Components

| MUI                                                                         | XiodUI                                                                                                               |
| :-------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------- |
| `Button variant="contained"`                                                | `Button` (default)                                                                                                   |
| `variant="outlined"`, `variant="text"`                                      | `variant="outline"`, `variant="ghost"` (`"link"` for link-like text)                                                 |
| `color="error"` (contained / outlined)                                      | `variant="destructive"` / `"destructive-outline"`                                                                    |
| `color="secondary"`, `color="inherit"`                                      | `variant="secondary"`; `variant="ghost"`                                                                             |
| `size="small"`/`"medium"`/`"large"`                                         | `size="sm"`/`"default"`/`"lg"`                                                                                       |
| `startIcon`, `endIcon`                                                      | The icon as a child, before or after the text                                                                        |
| `loading`                                                                   | `disabled` plus `<Loader size="sm" />` inside the button                                                             |
| `fullWidth`, `disableElevation`                                             | `className="w-full"`; remove                                                                                         |
| `IconButton`                                                                | `Button size="icon" variant="ghost" aria-label="…"`                                                                  |
| `Fab`                                                                       | `Button size="icon-lg" className="fixed right-4 bottom-4 rounded-full shadow-lg"`                                    |
| `ButtonGroup`                                                               | `ButtonGroup`, or `Group` for attached controls                                                                      |
| `ToggleButtonGroup exclusive` + `ToggleButton`                              | `ToggleGroup` + `ToggleGroupItem`; add `multiple` when not exclusive; `value` is an array                            |
| `TextField label helperText error`                                          | `Field invalid={error}` > `FieldLabel`, `Input`, `FieldDescription` or `FieldError match`                            |
| `TextField multiline rows={4}`                                              | `Textarea rows={4}`                                                                                                  |
| `TextField select` + `MenuItem`                                             | `Select items={…}` > `SelectTrigger` > `SelectValue`, `SelectPopup` > `SelectItem`                                   |
| `TextField type="number"`                                                   | `NumberField` > `NumberFieldGroup` > `NumberFieldInput` (+ increment/decrement)                                      |
| `slotProps.input.startAdornment` / `InputAdornment`                         | `InputGroup` > `InputGroupAddon` + `InputGroupInput`                                                                 |
| `FormControl`, `FormLabel`, `FormHelperText`                                | `Field`, `FieldLabel`, `FieldDescription` (errors: `FieldError`)                                                     |
| `FormControlLabel control={<Checkbox />} label="…"`                         | `<Label><Checkbox /> …</Label>`                                                                                      |
| `FormGroup` of checkboxes                                                   | `CheckboxGroup` (or `Fieldset` + `FieldsetLegend`)                                                                   |
| `Checkbox checked onChange={(e, checked) => …}`                             | `Checkbox checked onCheckedChange={(checked) => …}`                                                                  |
| `Switch checked onChange`                                                   | `Switch checked onCheckedChange`                                                                                     |
| `RadioGroup value onChange={(e, v) => …}` + `Radio`                         | `Radio value onValueChange={(v) => …}` + `RadioItem`, each in a `Label`                                              |
| `Slider value onChange={(e, v) => …}`                                       | `Slider value onValueChange={(v) => …}`; `valueLabelDisplay` → `SliderValue`                                         |
| `Autocomplete options` (pick from a list)                                   | `Combobox items={options}` (add `multiple` for tags, rendered with `ComboboxChips`)                                  |
| `Autocomplete freeSolo`                                                     | `Autocomplete`                                                                                                       |
| `Dialog open onClose`                                                       | `Dialog open onOpenChange={setOpen}`                                                                                 |
| `DialogTitle`, `DialogContent`, `DialogContentText`, `DialogActions`        | `DialogHeader` > `DialogTitle`; `DialogPanel`; `DialogDescription`; `DialogFooter`                                   |
| `Dialog maxWidth="sm" fullWidth`, `fullScreen`                              | `className="sm:max-w-lg"` on `DialogPopup`; `className="h-dvh max-w-none"`                                           |
| `Modal` (bare)                                                              | `Dialog` > `DialogPopup showCloseButton={false}` with your own content                                               |
| `Drawer anchor="left" open onClose`                                         | `Drawer position="left" open onOpenChange` + `DrawerPopup`                                                           |
| `Drawer variant="permanent"`/`"persistent"` (app nav)                       | `SidebarProvider` + `Sidebar` + `SidebarInset`                                                                       |
| `SwipeableDrawer`                                                           | `Drawer` (swipe to dismiss is built in)                                                                              |
| `Menu anchorEl open onClose` + `MenuItem onClick`                           | `Menu` > `MenuTrigger render={<Button />}` + `MenuPopup` > `MenuItem onClick`. No `anchorEl` state                   |
| `ListItemIcon` + `ListItemText` inside `MenuItem`                           | The icon and text as children of `MenuItem`                                                                          |
| `Divider` inside a menu                                                     | `MenuSeparator`                                                                                                      |
| `Popover anchorEl`, `Popper`                                                | `Popover` > `PopoverTrigger` + `PopoverPopup side align`                                                             |
| `ClickAwayListener`                                                         | Remove; popups close on outside click                                                                                |
| `Tooltip title="…" placement="top"`                                         | `Tooltip` > `TooltipTrigger render={…}` + `TooltipPopup side="top"`                                                  |
| `Tabs value onChange={(e, v) => …}` + `Tab label value`                     | `Tabs value onValueChange={(v) => …}` > `TabsList` > `TabsTab value`; content in `TabsPanel value`                   |
| `TabContext`, `TabList`, `TabPanel` (`@mui/lab`)                            | `Tabs`, `TabsList`, `TabsPanel`                                                                                      |
| Consecutive `Accordion`s, each with `AccordionSummary` + `AccordionDetails` | One `Accordion multiple` > `AccordionItem value` > `AccordionTrigger` + `AccordionPanel`                             |
| `Accordion expanded onChange` (controlled)                                  | `value` / `onValueChange` on the XiodUI `Accordion` root                                                             |
| `AccordionActions`                                                          | Buttons at the end of `AccordionPanel`                                                                               |
| `Collapse in={open}`                                                        | `Collapsible open` > `CollapsiblePanel`                                                                              |
| `Fade`, `Grow`, `Slide`, `Zoom`                                             | Popups animate themselves; elsewhere Tailwind `transition-[opacity,scale]`                                           |
| `Alert severity="error"` + `AlertTitle` + `action`                          | `Alert variant="error"` + `AlertTitle`, `AlertDescription`, `AlertAction`                                            |
| `Snackbar` + `Alert`, notistack `enqueueSnackbar`                           | `toastManager.add({ title, type })` (see Patterns)                                                                   |
| `CircularProgress` (spinning)                                               | `Loader`                                                                                                             |
| `CircularProgress variant="determinate" value`                              | `CircularProgress value`                                                                                             |
| `LinearProgress variant="determinate" value`                                | `Progress value`                                                                                                     |
| `LinearProgress` (indeterminate)                                            | `Progress value={null}`                                                                                              |
| `Backdrop` + `CircularProgress` (page loading)                              | A fixed `div` with `bg-background/80` and a `Loader`                                                                 |
| `Skeleton variant="text"`/`"circular"`/`"rectangular"`                      | `Skeleton` with `className` (`h-4 w-40`, `size-10 rounded-full`, `h-32 w-full`)                                      |
| `Chip label`                                                                | `Badge`                                                                                                              |
| `Chip onDelete` in an input                                                 | `Combobox multiple` with `ComboboxChips` / `ComboboxChip`                                                            |
| `Badge badgeContent`, `variant="dot"`, `invisible`, `overlap`               | `CornerBadgeAnchor` + `CornerBadge` with `dot`, `invisible`, `overlap`                                               |
| `Avatar variant="rounded"`/`"square"`, `AvatarGroup`                        | `Avatar shape="square"` + `AvatarImage` + `AvatarFallback`; `AvatarGroup`                                            |
| `Divider`, `Divider orientation="vertical"`                                 | `Separator`, `Separator orientation="vertical"`                                                                      |
| `Card`, `CardHeader title subheader action`                                 | `Card`, `CardHeader` > `CardTitle`, `CardDescription`, `CardAction`                                                  |
| `CardContent`, `CardActions`, `CardMedia`                                   | `CardPanel`, `CardFooter`, an `<img>` at the top of the card                                                         |
| `CardActionArea`                                                            | Wrap the card's content in a link or button with `className`                                                         |
| `Paper`                                                                     | `Card`, or a `div` with `bg-card rounded-lg border`                                                                  |
| `TableContainer` + `Table`                                                  | `Table` (it scrolls sideways by itself)                                                                              |
| `TableHead`, `TableBody`, `TableFooter`, `TableRow`                         | `TableHeader`, `TableBody`, `TableFooter`, `TableRow`                                                                |
| `TableCell` in the header / body                                            | `TableHead` / `TableCell`                                                                                            |
| `TablePagination`, `Pagination count page onChange`                         | `Pagination` > `PaginationContent` > `PaginationItem` > `PaginationLink`, `PaginationPrevious`, `PaginationNext`     |
| `TableSortLabel`                                                            | `Button variant="ghost" size="sm"` inside `TableHead`, with a sort icon                                              |
| `Breadcrumbs` + `Link` + `Typography`                                       | `Breadcrumb` > `BreadcrumbList` > `BreadcrumbItem` > `BreadcrumbLink` / `BreadcrumbPage`, with `BreadcrumbSeparator` |
| `Stepper` + `Step` + `StepLabel`                                            | `Timeline` (`orientation="horizontal"` for a horizontal stepper)                                                     |
| `List`, `ListItem`, `ListItemButton`, `ListItemText`                        | `<ul>`/`<li>` with classes; `ListBox` for a selectable list; `SidebarMenu*` inside a sidebar                         |
| `Typography variant="h1"`…`"h4"`                                            | `Text variant="heading1"`…`"heading4"` (renders the matching heading element)                                        |
| `Typography variant="h5"`/`"h6"`/`"subtitle1"`                              | `Text variant="heading4"`, or a heading element with classes                                                         |
| `Typography variant="body1"`/`"body2"`/`"caption"`                          | `Text` / `Text size="sm"` / `Text size="xs" variant="secondary"`                                                     |
| `Typography color="text.secondary"`                                         | `Text variant="secondary"`                                                                                           |
| `Box`                                                                       | `div` with classes                                                                                                   |
| `Stack spacing={2}` / `direction="row"`                                     | `div className="flex flex-col gap-4"` / `"flex gap-4"`                                                               |
| `Grid container spacing={2}` + `Grid size={{ xs: 12, md: 6 }}`              | `div className="grid grid-cols-12 gap-4"` + `div className="col-span-12 md:col-span-6"`                              |
| `Container maxWidth="lg"`                                                   | `div className="mx-auto w-full max-w-6xl px-4"`                                                                      |
| `AppBar` + `Toolbar`                                                        | `header className="sticky top-0 flex h-14 items-center gap-4 border-b bg-background px-4"`                           |
| `BottomNavigation`                                                          | A fixed `nav` of `Button variant="ghost"` links                                                                      |
| `SpeedDial`                                                                 | `Menu` opened by a floating `Button`                                                                                 |
| `Link`                                                                      | `<a>` or the router's `Link`; `Button variant="link"` for a styled one                                               |
| `@mui/x-date-pickers` `DatePicker`                                          | `DatePicker value onSelect` with `Date` values (convert dayjs with `.toDate()`)                                      |
| `DateCalendar`                                                              | `Calendar selected onSelect`                                                                                         |
| `@mui/icons-material`                                                       | `xiod-icons`, or keep the existing icon package for the app's own icons                                              |

## 5. Patterns

### Menu without `anchorEl`

```tsx
// MUI
const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
<Button onClick={(e) => setAnchorEl(e.currentTarget)}>Options</Button>
<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
  <MenuItem onClick={() => { edit(); setAnchorEl(null); }}>Edit</MenuItem>
</Menu>

// XiodUI: no state; the menu opens, positions, and closes itself
<Menu>
  <MenuTrigger render={<Button />}>Options</MenuTrigger>
  <MenuPopup>
    <MenuItem onClick={edit}>Edit</MenuItem>
  </MenuPopup>
</Menu>
```

The same goes for `Popover` and `Tooltip`: delete the `anchorEl` state.

### Snackbars → toasts

| MUI / notistack                                             | XiodUI                                                  |
| :---------------------------------------------------------- | :------------------------------------------------------ |
| `<Snackbar open message="Saved" autoHideDuration={3000} />` | `toastManager.add({ title: "Saved", timeout: 3000 })`   |
| `<Snackbar><Alert severity="error">…</Alert></Snackbar>`    | `toastManager.add({ title: "…", type: "error" })`       |
| `enqueueSnackbar("Saved", { variant: "success" })`          | `toastManager.add({ title: "Saved", type: "success" })` |
| `action={<Button onClick={undo}>Undo</Button>}`             | `actionProps: { children: "Undo", onClick: undo }`      |
| `anchorOrigin={{ vertical: "top", horizontal: "center" }}`  | `<ToastProvider position="top-center">`                 |

Delete the `open` state that controlled the snackbar.

### Forms

MUI has no form component; state usually lives in `useState`, Formik, or
react-hook-form. Either keep that state and render XiodUI fields:

```tsx
<Field invalid={Boolean(errors.email)}>
  <FieldLabel>Email</FieldLabel>
  <Input value={email} onChange={(e) => setEmail(e.target.value)} />
  <FieldError match>{errors.email}</FieldError>
</Field>
```

or switch to XiodUI's `Form` (`onFormSubmit(values)`, `errors`, and `Field
name`) and native validation. See the shadcn guide's Forms section for the full
example.

## 6. No direct equivalent

`Rating`, `ImageList`, `TransferList`, `TreeView` / `@mui/x-tree-view`,
`DataGrid` (`@mui/x-data-grid`), and charts (`@mui/x-charts`) have no XiodUI
component. Keep those MUI X packages (they need Emotion and a MUI
`ThemeProvider` around them), or build the piece from XiodUI parts (`Table`
for a simple grid, `Toggle`s for a rating). Say so in the migration summary
rather than dropping the feature.

## 7. Remove MUI

When the inventory searches return nothing:

```bash
npm uninstall @mui/material @mui/icons-material @mui/lab @mui/system @mui/material-nextjs @emotion/react @emotion/styled @emotion/cache notistack
npm uninstall @mui/x-date-pickers dayjs   # only if nothing else uses them
```

Keep the MUI X packages and Emotion if step 6 kept a MUI X component.

## Checklist

- [ ] No import of `@mui/` or `@emotion/` remains (except kept MUI X parts)
- [ ] No `sx=`, `styled(`, `makeStyles`, `createTheme`, or `CssBaseline` remains
- [ ] Every MUI `Accordion` became an `AccordionItem` inside one XiodUI `Accordion`
- [ ] Every MUI `Radio` became a `RadioItem`; every `DialogContent` a `DialogPanel`; every header-section `TableHead` a `TableHeader`
- [ ] No `anchorEl` state remains for menus and popovers
- [ ] `onChange={(e, value) => …}` handlers became `onValueChange` / `onCheckedChange` with the value first
- [ ] Build and typecheck pass; light, dark, and phone width checked
