# Migrating from Ant Design to XiodUI

Follow the six steps in SKILL.md → "Migrating an existing app". This page
supplies the Ant Design (antd) specifics for each step.

Ant Design is **data-driven**. Most components take arrays (`items`,
`options`, `columns`, `dataSource`) and build the markup themselves. XiodUI is
**composed**: you render the parts as JSX children. The core move of this
migration is turning each array into a `.map()` over XiodUI parts:

```tsx
// antd
<Tabs items={[{ key: "a", label: "Account", children: <Account /> }]} />

// XiodUI
<Tabs defaultValue="a">
  <TabsList>
    {tabs.map((t) => <TabsTab key={t.key} value={t.key}>{t.label}</TabsTab>)}
  </TabsList>
  {tabs.map((t) => <TabsPanel key={t.key} value={t.key}>{t.children}</TabsPanel>)}
</Tabs>
```

antd styles with CSS-in-JS (`@ant-design/cssinjs`) and a JavaScript token
theme. XiodUI styles with Tailwind classes and CSS variables, so `style={{…}}`
and `ConfigProvider` tokens become classes and CSS tokens.

**Name traps.**

- antd Button's `type` prop is the **style** (`"primary"`, `"dashed"`). XiodUI
  `Button`'s `type` is the HTML button type. antd `htmlType="submit"` →
  XiodUI `type="submit"`; antd `type="primary"` → XiodUI `variant="default"`.
- antd `Menu` is a navigation menu (sidebar or top nav). XiodUI `Menu` is a
  dropdown of actions. Map antd `Menu` to `Sidebar` or `NavigationMenu`, and
  antd `Dropdown` to XiodUI `Menu`.
- antd `Radio` is one option; XiodUI `Radio` is the group and `RadioItem` is
  the option.
- antd `Layout.Content` / `Card` body are not `DialogContent`/`CardContent`;
  XiodUI has neither. Card body → `CardPanel`.

## 1. Inventory

```bash
grep -rlE "from \"antd|from 'antd|@ant-design/" --include=*.tsx --include=*.ts --include=*.jsx --include=*.js . --exclude-dir=node_modules
grep -rnE "Form\.useForm|App\.useApp|message\.|notification\.|Modal\.(confirm|info|success|error|warning)" --include=*.tsx --include=*.ts . --exclude-dir=node_modules
grep -rlE "dayjs|moment" --include=*.tsx --include=*.ts . --exclude-dir=node_modules
```

## 2. Setup

antd apps often have no Tailwind. Install both:

```bash
npm install xiod-ui cn
npm install -D tailwindcss @tailwindcss/postcss
```

Global stylesheet, imported once from the root layout or `main.tsx`:

```css
@import "tailwindcss";
@import "xiod-ui/styles";
```

Remove `import "antd/dist/reset.css"` (or `antd.css` / `antd.less` in older
apps) once antd is gone. `xiod-ui/styles` has its own base reset.

Providers:

| antd                                                              | XiodUI                                                                                             |
| :---------------------------------------------------------------- | :------------------------------------------------------------------------------------------------- |
| `<ConfigProvider theme={{ token, algorithm }}>`                   | CSS tokens (below) + `ThemeProvider` from `xiod-ui/theme-provider`                                 |
| `algorithm: theme.darkAlgorithm` / `defaultAlgorithm`             | `ThemeProvider defaultTheme="dark"` / `"light"` (or `"system"`); switch with `useTheme().setTheme` |
| `<App>` + `App.useApp()` for `message` / `notification` / `modal` | `<ToastProvider>` for messages; `AlertDialog` for confirms                                         |
| `<AntdRegistry>` (`@ant-design/nextjs-registry`)                  | Remove                                                                                             |
| `ConfigProvider locale={…}`                                       | Remove; XiodUI components use the browser locale (`NumberField` also takes `locale`)               |
| `ConfigProvider componentSize="small"`                            | `size="sm"` on each component                                                                      |

**Tokens.** Move `theme.token` values to CSS after the imports:

| antd token                                                | XiodUI token                                        |
| :-------------------------------------------------------- | :-------------------------------------------------- |
| `colorPrimary`                                            | `--primary` (and a readable `--primary-foreground`) |
| `colorError`, `colorSuccess`, `colorWarning`, `colorInfo` | `--destructive`, `--success`, `--warning`, `--info` |
| `colorBgBase` / `colorBgContainer`                        | `--background` / `--card` and `--popover`           |
| `colorTextBase`, `colorTextSecondary`                     | `--foreground`, `--muted-foreground`                |
| `colorBorder`                                             | `--border` and `--input`                            |
| `borderRadius` (px)                                       | `--radius`                                          |
| `fontFamily`                                              | `--font-sans` in an `@theme` block                  |

```css
:root {
  --primary: #1677ff;
  --primary-foreground: #fff;
  --radius: 0.375rem;

  @variant dark {
    --primary: #1668dc;
  }
}
```

## 3. Events and common props

| antd                                                 | XiodUI                                   |
| :--------------------------------------------------- | :--------------------------------------- |
| `open` / `onCancel` / `onClose` (Modal, Drawer)      | `open` / `onOpenChange={(open) => …}`    |
| `Select onChange={(value, option) => …}`             | `onValueChange={(value) => …}`           |
| `Checkbox onChange={(e) => e.target.checked}`        | `onCheckedChange={(checked) => …}`       |
| `Switch onChange={(checked) => …}`                   | `onCheckedChange={(checked) => …}`       |
| `Radio.Group onChange={(e) => e.target.value}`       | `onValueChange={(value) => …}`           |
| `Slider onChange`, `InputNumber onChange`            | `onValueChange`                          |
| `disabled`                                           | `disabled`                               |
| `size="small"`/`"middle"`/`"large"`                  | `size="sm"`/`"default"`/`"lg"`           |
| `status="error"` on an input                         | `<Field invalid>` around it              |
| `placement` on popups                                | `side` + `align` on the `…Popup`         |
| `style={{ marginTop: 16 }}`                          | `className="mt-4"`                       |
| `className` + `rootClassName` + `classNames={{ … }}` | `className` on the matching XiodUI part  |
| `destroyOnHidden`/`destroyOnClose`                   | Remove; closed popups unmount by default |
| `getPopupContainer`                                  | Remove; popups portal to `body`          |

## 4. Components

| antd                                                            | XiodUI                                                                                                                                     |
| :-------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| `Button type="primary"` (v6: `variant="solid" color="primary"`) | `Button` (default)                                                                                                                         |
| `Button` (default, bordered) / `variant="outlined"`             | `variant="outline"`                                                                                                                        |
| `type="dashed"` / `variant="dashed"`                            | `variant="outline" className="border-dashed"`                                                                                              |
| `variant="filled"`                                              | `variant="secondary"`                                                                                                                      |
| `type="text"` / `variant="text"`, `type="link"`                 | `variant="ghost"`, `variant="link"`                                                                                                        |
| `danger` (primary / default)                                    | `variant="destructive"` / `"destructive-outline"`                                                                                          |
| `color="blue"`, `"purple"`, … (preset colours)                  | Pick the closest variant, or a palette (SKILL.md → "Palettes")                                                                             |
| `icon={<X />}` (+ `iconPlacement="end"`)                        | The icon as a child, before (or after) the text                                                                                            |
| `shape="circle"` + icon only                                    | `size="icon" className="rounded-full" aria-label="…"`                                                                                      |
| `loading`, `block`, `htmlType="submit"`                         | `disabled` + `<Loader size="sm" />`; `className="w-full"`; `type="submit"`                                                                 |
| `Space`, `Flex`                                                 | `div className="flex gap-2"` (`flex-col` for `vertical`)                                                                                   |
| `Space.Compact` of inputs/buttons                               | `Group` (attached controls) or `InputGroup`                                                                                                |
| `Row gutter={16}` + `Col span={12}` (24 columns)                | `div className="grid grid-cols-24 gap-4"` + `div className="col-span-12"`; responsive `md={8}` → `md:col-span-8`                           |
| `Layout`, `Header`, `Content`, `Footer`                         | `<div className="flex min-h-dvh flex-col">`, `<header>`, `<main>`, `<footer>` with classes                                                 |
| `Layout.Sider` + `Menu mode="inline"`                           | `SidebarProvider` > `Sidebar` > `SidebarMenu` > `SidebarMenuItem` > `SidebarMenuButton`, with `SidebarInset` for the page                  |
| `Menu mode="horizontal"` (top navigation)                       | `NavigationMenu` > `NavigationMenuList` > `NavigationMenuItem` > `NavigationMenuLink`                                                      |
| `Dropdown menu={{ items, onClick }}`                            | `Menu` > `MenuTrigger render={…}` + `MenuPopup` > one `MenuItem onClick` per item                                                          |
| `items: [{ type: "divider" }]`, `{ type: "group", label }`      | `MenuSeparator`, `MenuGroup` + `MenuGroupLabel`                                                                                            |
| `{ danger: true }` item, `children` (submenu)                   | `MenuItem variant="destructive"`, `MenuSub` > `MenuSubTrigger` + `MenuSubPopup`                                                            |
| `Dropdown trigger={["contextMenu"]}`                            | `ContextMenu` > `ContextMenuTrigger` + `ContextMenuPopup`                                                                                  |
| `Modal open title onOk onCancel footer`                         | `Dialog open onOpenChange` > `DialogPopup` > `DialogHeader` > `DialogTitle`, `DialogPanel`, `DialogFooter` with your own OK/Cancel buttons |
| `Modal width={720}`                                             | `DialogPopup className="sm:max-w-180"`                                                                                                     |
| `Modal.confirm({ title, content, onOk })`                       | A controlled `AlertDialog` (see Patterns)                                                                                                  |
| `Popconfirm title onConfirm`                                    | `AlertDialog` for destructive actions; `Popover` with two buttons for light ones                                                           |
| `Drawer placement="right" open onClose size`                    | `Drawer position="right" open onOpenChange` > `DrawerPopup` (`className` for width)                                                        |
| `Tabs items`                                                    | `Tabs` > `TabsList` > `TabsTab value`, plus `TabsPanel value` (map the array)                                                              |
| `Tabs type="card"` / default line tabs                          | `Tabs` (default) / `Tabs variant="underline"`                                                                                              |
| `Segmented options`                                             | `ToggleGroup` > `ToggleGroupItem` (single value by default)                                                                                |
| `Collapse items` (`accordion` prop: one open at a time)         | `Accordion` (+ `multiple` when antd had no `accordion` prop) > `AccordionItem` > `AccordionTrigger` + `AccordionPanel`                     |
| `Card title extra actions`                                      | `Card` > `CardHeader` > `CardTitle` + `CardAction`; body `CardPanel`; `actions` → `CardFooter`                                             |
| `Card cover`                                                    | An `<img>` as the card's first child                                                                                                       |
| `Descriptions items`                                            | A `<dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">`, or `Table`                                                                 |
| `Table columns dataSource rowKey`                               | `Table` > `TableHeader` > `TableRow` > `TableHead` per column; `TableBody` > one `TableRow` per record > `TableCell` per column            |
| `Table pagination`, `rowSelection`, `sorter`                    | `Pagination` under the table; a `Checkbox` column; `Button variant="ghost"` in `TableHead` with your own sort state                        |
| `List dataSource renderItem`                                    | `<ul>` + `.map()`, or `ListBox` for a selectable list                                                                                      |
| `Pagination current total onChange`                             | `Pagination` > `PaginationContent` > `PaginationItem` > `PaginationLink`, `PaginationPrevious`, `PaginationNext` (render the pages)        |
| `Breadcrumb items`                                              | `Breadcrumb` > `BreadcrumbList` > `BreadcrumbItem` > `BreadcrumbLink`/`BreadcrumbPage`, with `BreadcrumbSeparator`                         |
| `Steps items current`, `Timeline items`                         | `Timeline` > `TimelineItem` > `TimelineIndicator`, `TimelineHeader` > `TimelineTitle`, `TimelineContent`                                   |
| `Input`, `Input.TextArea`, `Input.Password`                     | `Input`, `Textarea`, `Input type="password"`                                                                                               |
| `Input prefix suffix addonBefore addonAfter`                    | `InputGroup` > `InputGroupAddon` (`align="inline-start"`/`"inline-end"`) + `InputGroupInput`                                               |
| `Input.Search onSearch`                                         | `InputGroup` with a search `InputGroupAddon` + a submit `Button`                                                                           |
| `Input.OTP length`                                              | `InputOtp length` > `InputOtpGroup` > `InputOtpInput`                                                                                      |
| `InputNumber min max step`                                      | `NumberField min max step` > `NumberFieldGroup` > `NumberFieldDecrement`, `NumberFieldInput`, `NumberFieldIncrement`                       |
| `Select options`                                                | `Select items={options}` > `SelectTrigger` > `SelectValue`; `SelectPopup` > `SelectItem` per option                                        |
| `Select showSearch`, `mode="multiple"`/`"tags"`                 | `Combobox items` (`multiple`, with `ComboboxChips` for tags)                                                                               |
| `AutoComplete options`                                          | `Autocomplete items`                                                                                                                       |
| `Cascader`, `TreeSelect`, `Transfer`, `Mentions`                | No equivalent (see step 6)                                                                                                                 |
| `Checkbox`, `Checkbox.Group options`                            | `<Label><Checkbox /> …</Label>`; `CheckboxGroup` with one labelled `Checkbox` per option                                                   |
| `Radio.Group options`                                           | `Radio` > `RadioItem` per option, each in a `Label`                                                                                        |
| `Radio.Group optionType="button"`                               | `ToggleGroup` > `ToggleGroupItem`                                                                                                          |
| `Switch`, `Slider` (`range`)                                    | `Switch`; `Slider` (an array `value` for a range)                                                                                          |
| `Rate`                                                          | No equivalent (step 6)                                                                                                                     |
| `DatePicker`, `RangePicker` (dayjs values)                      | `DatePicker value onSelect` / `mode="range"`, with `Date` values (`dayjs.toDate()`)                                                        |
| `TimePicker`                                                    | `Input type="time"`, or `WheelPicker` for a wheel                                                                                          |
| `Calendar`                                                      | `Calendar` (a date picker grid, not an event calendar)                                                                                     |
| `ColorPicker`                                                   | `ColorPicker`                                                                                                                              |
| `Upload`, `Upload.Dragger`                                      | `FileUpload` (`accept`, `maxFiles`, `onFilesChange`, `onFilesRejected`); upload the files yourself                                         |
| `Form` + `Form.Item`                                            | `Form` + `Field` (see Patterns)                                                                                                            |
| `Tag color closable`                                            | `Badge variant`; a `Button size="icon-xs"` inside it for closing                                                                           |
| `Badge count`, `dot`                                            | `CornerBadgeAnchor` + `CornerBadge` (`dot` for a dot)                                                                                      |
| `Avatar`, `Avatar.Group`                                        | `Avatar` + `AvatarImage` + `AvatarFallback`; `AvatarGroup`                                                                                 |
| `Tooltip title`                                                 | `Tooltip` > `TooltipTrigger render={…}` + `TooltipPopup`                                                                                   |
| `Popover title content`                                         | `Popover` > `PopoverTrigger` + `PopoverPopup` > `PopoverTitle` + content                                                                   |
| `Alert type message description showIcon closable`              | `Alert variant` (`type` → `success`/`info`/`warning`/`error`) > `AlertTitle`, `AlertDescription`; closing → `AlertAction` with a button    |
| `Result`, `Empty`                                               | `Empty` > `EmptyHeader` > `EmptyMedia`, `EmptyTitle`, `EmptyDescription`; actions in `EmptyContent`                                        |
| `Spin`                                                          | `Loader`                                                                                                                                   |
| `Spin spinning` wrapping content                                | The content, plus an `absolute inset-0` overlay holding a `Loader` while loading                                                           |
| `Skeleton active paragraph`                                     | Several `Skeleton`s sized with `className`                                                                                                 |
| `Progress percent`, `type="circle"`, `type="dashboard"`         | `Progress value`, `CircularProgress value`, `Gauge`                                                                                        |
| `Statistic title value`                                         | `Text variant="secondary" size="sm"` over `Text variant="heading2"`                                                                        |
| `Typography.Title level={1…4}`                                  | `Text variant="heading1"`…`"heading4"`                                                                                                     |
| `Typography.Text type="secondary"`, `Typography.Paragraph`      | `Text variant="secondary"`, `Text`                                                                                                         |
| `Typography.Text code`, `copyable`                              | `Text variant="mono"`, `CopyToClipboard`                                                                                                   |
| `Typography.Link`                                               | `<a>` or the router's `Link`                                                                                                               |
| `Divider`, `Divider type="vertical"`                            | `Separator`, `Separator orientation="vertical"`                                                                                            |
| `Carousel`                                                      | `Carousel` > `CarouselContent` > `CarouselItem` (+ `CarouselPrevious`, `CarouselNext`, `CarouselDots`)                                     |
| `Splitter`                                                      | `ResizablePanelGroup` > `ResizablePanel` + `ResizableHandle`                                                                               |
| `Image`                                                         | `<img>` or the framework's image component                                                                                                 |
| `Affix`                                                         | `className="sticky top-0"`                                                                                                                 |
| `FloatButton`                                                   | `Button size="icon-lg" className="fixed right-6 bottom-6 rounded-full shadow-lg"`                                                          |
| `Anchor`, `BackTop`                                             | In-page `<a href="#id">` links; a scroll-to-top `Button`                                                                                   |

## 5. Patterns

### Messages and notifications → toasts

| antd                                                                | XiodUI                                                                                                 |
| :------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------- |
| `message.success("Saved")` (or `App.useApp().message`)              | `toastManager.add({ title: "Saved", type: "success" })`                                                |
| `message.error`, `.warning`, `.info`, `.loading`                    | `type: "error"`, `"warning"`, `"info"`, `"loading"`                                                    |
| `notification.open({ message, description })`                       | `toastManager.add({ title, description })`                                                             |
| `duration: 3` (seconds)                                             | `timeout: 3000` (milliseconds)                                                                         |
| `const key = …; message.loading({ key }); message.success({ key })` | `const id = toastManager.add({ type: "loading", … }); toastManager.update(id, { type: "success", … })` |
| `notification` `placement: "topRight"`                              | `<ToastProvider position="top-right">`                                                                 |

### `Modal.confirm` → `AlertDialog`

```tsx
// antd
Modal.confirm({
  title: "Delete this item?",
  content: "This cannot be undone.",
  okType: "danger",
  onOk: remove,
});

// XiodUI
<AlertDialog>
  <AlertDialogTrigger render={<Button variant="destructive" />}>
    Delete
  </AlertDialogTrigger>
  <AlertDialogPopup>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete this item?</AlertDialogTitle>
      <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogClose render={<Button variant="ghost" />}>
        Cancel
      </AlertDialogClose>
      <AlertDialogClose
        render={<Button variant="destructive" onClick={remove} />}
      >
        Delete
      </AlertDialogClose>
    </AlertDialogFooter>
  </AlertDialogPopup>
</AlertDialog>;
```

When the confirm was opened from code (not a button), control it with
`open` / `onOpenChange` and drop `AlertDialogTrigger`.

### Forms (`Form.Item` rules → `Field`)

```tsx
// antd
<Form form={form} layout="vertical" onFinish={onFinish}>
  <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Enter an email" }]}>
    <Input />
  </Form.Item>
  <Button type="primary" htmlType="submit">Save</Button>
</Form>

// XiodUI
<Form onFormSubmit={onFinish} errors={serverErrors}>
  <Field name="email">
    <FieldLabel>Email</FieldLabel>
    <Input required type="email" />
    <FieldError match="valueMissing">Enter an email</FieldError>
    <FieldError match="typeMismatch">Enter a valid email</FieldError>
  </Field>
  <Button type="submit">Save</Button>
</Form>
```

| antd `rules` / `Form.Item`                          | XiodUI                                                            |
| :-------------------------------------------------- | :---------------------------------------------------------------- |
| `{ required: true }`                                | `required` on the control; `FieldError match="valueMissing"`      |
| `{ type: "email" }`, `{ type: "url" }`              | `type="email"`/`"url"`; `match="typeMismatch"`                    |
| `{ min: 4 }`, `{ max: 20 }` (strings)               | `minLength={4}`, `maxLength={20}`; `match="tooShort"`/`"tooLong"` |
| `{ pattern: /…/ }`                                  | `pattern="…"`; `match="patternMismatch"`                          |
| `{ validator }`                                     | `validate={(value) => "message" or null}` on `Field`              |
| `extra="…"` / `help="…"`                            | `FieldDescription` / `FieldError`                                 |
| `valuePropName="checked"` (checkbox)                | Remove; `Checkbox` inside a `Field name` submits its state        |
| `form.setFields([{ name, errors }])`, server errors | `errors={{ [name]: message }}` on `Form`                          |
| `form.getFieldsValue()`, `form.setFieldsValue`      | Controlled inputs (`value` + `onChange`) with your own state      |
| `Form.List`                                         | Your own array state, rendering one `Field` group per entry       |
| `layout="horizontal"`                               | `Field className="grid grid-cols-[10rem_1fr] items-center"`       |

## 6. No direct equivalent

`Cascader`, `TreeSelect`, `Tree`, `Transfer`, `Mentions`, `Rate`, `Tour`,
`Watermark`, `QRCode`, `Masonry`, and the advanced parts of `Table`
(virtual scroll, fixed columns, tree data). Build them from XiodUI parts when
simple (a `Tree` as nested `Collapsible`s, `Masonry` as `columns-3`), keep a
dedicated library for complex ones (TanStack Table for data grids), and list
anything left out in the migration summary.

## 7. Remove Ant Design

```bash
npm uninstall antd @ant-design/icons @ant-design/nextjs-registry @ant-design/cssinjs @ant-design/pro-components
npm uninstall dayjs   # only if nothing else uses it
```

## Checklist

- [ ] No import from `antd` or `@ant-design/` remains
- [ ] No `ConfigProvider`, `App.useApp`, `message.`, `notification.`, or `Modal.confirm` remains
- [ ] Every `items`/`options`/`columns` array renders XiodUI parts with `.map()`
- [ ] Buttons use `variant` for style and `type` only for `"submit"`/`"reset"`/`"button"`
- [ ] antd `Menu` became `Sidebar`/`NavigationMenu`; antd `Dropdown` became XiodUI `Menu`
- [ ] Build and typecheck pass; light, dark, and phone width checked
