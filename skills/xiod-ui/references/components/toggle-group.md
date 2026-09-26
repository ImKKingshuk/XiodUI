# ToggleGroup

```tsx
import { ToggleGroup, ToggleGroupItem, ToggleGroupSeparator } from "xiod-ui/toggle-group";
```

## ToggleGroup

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: ToggleGroupState) => string \| undefined) \| undefined` | — |
| defaultValue | `readonly string[] \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| loopFocus | `boolean \| undefined` | — |
| multiple | `boolean \| undefined` | — |
| onValueChange | `((groupValue: string[], eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element \| undefined; }) => void) \| undefined` | — |
| orientation | `Orientation \| undefined` | `"horizontal"` |
| size | `"sm" \| "default" \| "lg" \| null \| undefined` | `"default"` |
| style | `CSSProperties \| ((state: ToggleGroupState) => CSSProperties \| undefined) \| undefined` | — |
| value | `readonly string[] \| undefined` | — |
| variant | `"default" \| "outline" \| null \| undefined` | `"default"` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `defaultValue` — The pressed state of the toggle group represented by an array of the values of all pressed toggle buttons. This is the uncontrolled counterpart of `value`.
- `disabled` — Whether the toggle group should ignore user interaction.
- `loopFocus` — Whether to loop keyboard focus back to the first item when the end of the list is reached while using the arrow keys.
- `multiple` — When `false` only one item in the group can be pressed. If any item in the group becomes pressed, the others will become unpressed. When `true` multiple items can be pressed.
- `onValueChange` — Callback fired when the pressed states of the toggle group changes.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `value` — The pressed state of the toggle group represented by an array of the values of all pressed toggle buttons. This is the controlled counterpart of `defaultValue`.

## ToggleGroupItem

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: ToggleState) => string \| undefined) \| undefined` |
| defaultPressed | `boolean \| undefined` |
| disabled | `boolean \| undefined` |
| nativeButton | `boolean \| undefined` |
| onPressedChange | `((pressed: boolean, eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element \| undefined; }) => void) \| undefined` |
| pressed | `boolean \| undefined` |
| size | `"sm" \| "default" \| "lg" \| null \| undefined` |
| style | `CSSProperties \| ((state: ToggleState) => CSSProperties \| undefined) \| undefined` |
| value | `string \| undefined` |
| variant | `"default" \| "outline" \| null \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `defaultPressed` — Whether the toggle button is currently pressed. This is the uncontrolled counterpart of `pressed`.
- `disabled` — Whether the component should ignore user interaction.
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `false` if the rendered element is not a button (for example, `<div>`).
- `onPressedChange` — Callback fired when the pressed state is changed.
- `pressed` — Whether the toggle button is currently pressed. This is the controlled counterpart of `defaultPressed`.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `value` — A unique string that identifies the toggle when used inside a toggle group.

## ToggleGroupSeparator

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| (string & ((state: SeparatorState) => string \| undefined)) \| undefined` | — |
| orientation | `Orientation \| undefined` | `"vertical"` |
| style | `CSSProperties \| ((state: SeparatorState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `orientation` — The orientation of the separator.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

Required props are bold. Full docs: https://ui.xiod.dev/docs
