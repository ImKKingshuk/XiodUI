# Collapsible

```tsx
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "xiod-ui/collapsible";
```

## Collapsible

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: CollapsibleRootState) => string \| undefined) \| undefined` |
| defaultOpen | `boolean \| undefined` |
| disabled | `boolean \| undefined` |
| onOpenChange | `((open: boolean, eventDetails: CollapsibleRootChangeEventDetails) => void) \| undefined` |
| open | `boolean \| undefined` |
| style | `CSSProperties \| ((state: CollapsibleRootState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `defaultOpen` — Whether the collapsible panel is initially open.
  To render a controlled collapsible, use the `open` prop instead.
- `disabled` — Whether the component should ignore user interaction.
- `onOpenChange` — Event handler called when the panel is opened or closed.
- `open` — Whether the collapsible panel is currently open.
  To render an uncontrolled collapsible, use the `defaultOpen` prop instead.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## CollapsiblePanel

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: CollapsiblePanelState) => string \| undefined) \| undefined` |
| hiddenUntilFound | `boolean \| undefined` |
| keepMounted | `boolean \| undefined` |
| style | `CSSProperties \| ((state: CollapsiblePanelState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `hiddenUntilFound` — Allows the browser's built-in page search to find and expand the panel contents.
  Overrides the `keepMounted` prop and uses `hidden="until-found"` to hide the element without removing it from the DOM.
- `keepMounted` — Whether to keep the element in the DOM while the panel is hidden. This prop is ignored when `hiddenUntilFound` is used.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## CollapsibleTrigger

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: CollapsibleTriggerState) => string \| undefined) \| undefined` |
| nativeButton | `boolean \| undefined` |
| style | `CSSProperties \| ((state: CollapsibleTriggerState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `false` if the rendered element is not a button (for example, `<div>`).
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

Required props are bold. Full docs: https://ui.xiod.dev/docs
