# ListBox

```tsx
import { ListBox, ListBoxGroup, ListBoxItem, ListBoxLabel, ListBoxSeparator } from "xiod-ui/list-box";
```

## ListBox

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| defaultValue | `ListBoxValue \| undefined` |
| multiple | `boolean \| undefined` |
| name | `string \| undefined` |
| onValueChange | `((value: ListBoxValue) => void) \| undefined` |
| value | `ListBoxValue \| undefined` |

- `name` — Submits the selection with a form: one hidden input per selected value.

## ListBoxGroup

Renders a `<div>` and takes its props. Pass `render` to render a different element.

## ListBoxItem

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| disabled | `boolean \| undefined` |
| **value** | `string` |

## ListBoxLabel

Renders a `<div>` and takes its props. Pass `render` to render a different element.

## ListBoxSeparator

Renders a `<div>` and takes its props. Pass `render` to render a different element.

Required props are bold. Full docs: https://ui.xiod.dev/docs
