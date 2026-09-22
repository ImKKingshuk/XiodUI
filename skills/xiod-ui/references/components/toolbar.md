# toolbar

```tsx
import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarInput, ToolbarLink, ToolbarSeparator } from "xiod-ui/toolbar";
```

## Toolbar

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: ToolbarRootState) => string \| undefined) \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| loopFocus | `boolean \| undefined` | — |
| orientation | `Orientation \| undefined` | — |
| style | `CSSProperties \| ((state: ToolbarRootState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `loopFocus` — If `true`, using keyboard navigation will wrap focus to the other end of the toolbar once the end is reached.
- `orientation` — The orientation of the toolbar.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## ToolbarButton

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: ToolbarButtonState) => string \| undefined) \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| focusableWhenDisabled | `boolean \| undefined` | — |
| nativeButton | `boolean \| undefined` | — |
| style | `CSSProperties \| ((state: ToolbarButtonState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `disabled` — When `true` the item is disabled.
- `focusableWhenDisabled` — When `true` the item remains focusable when disabled.
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `false` if the rendered element is not a button (for example, `<div>`).
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## ToolbarGroup

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: ToolbarGroupState) => string \| undefined) \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| style | `CSSProperties \| ((state: ToolbarGroupState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `disabled` — When `true` all toolbar items in the group are disabled.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## ToolbarInput

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: ToolbarInputState) => string \| undefined) \| undefined` | — |
| defaultValue | `string \| number \| readonly string[] \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| focusableWhenDisabled | `boolean \| undefined` | — |
| style | `CSSProperties \| ((state: ToolbarInputState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `disabled` — When `true` the item is disabled.
- `focusableWhenDisabled` — When `true` the item remains focusable when disabled.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## ToolbarLink

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: ToolbarLinkState) => string \| undefined) \| undefined` | — |
| style | `CSSProperties \| ((state: ToolbarLinkState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## ToolbarSeparator

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: SeparatorState) => string \| undefined) \| undefined` | — |
| orientation | `Orientation \| undefined` | — |
| style | `CSSProperties \| ((state: SeparatorState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `orientation` — The orientation of the separator. Defaults to the opposite of the toolbar's orientation, so a horizontal toolbar renders vertical separators.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

Required props are bold. Full docs: https://ui.xiod.dev/docs
