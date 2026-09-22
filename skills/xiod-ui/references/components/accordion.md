# accordion

```tsx
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from "xiod-ui/accordion";
```

## Accordion

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: State<any>) => string \| undefined) \| undefined` | — |
| defaultValue | `AccordionValue<any> \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| hiddenUntilFound | `boolean \| undefined` | — |
| keepMounted | `boolean \| undefined` | — |
| loopFocus | `boolean \| undefined` | — |
| multiple | `boolean \| undefined` | — |
| onValueChange | `((value: AccordionValue<any>, eventDetails: AccordionRootChangeEventDetails) => void) \| undefined` | — |
| orientation | `Orientation \| undefined` | — |
| style | `CSSProperties \| ((state: State<any>) => CSSProperties \| undefined) \| undefined` | — |
| value | `AccordionValue<any> \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `defaultValue` — The uncontrolled value of the item(s) that should be initially expanded. To render a controlled accordion, use the `value` prop instead.
- `disabled` — Whether the component should ignore user interaction.
- `hiddenUntilFound` — Allows the browser's built-in page search to find and expand the panel contents. Overrides the `keepMounted` prop and uses `hidden="until-found"` to hide the element without removing it from the DOM.
- `keepMounted` — Whether to keep the element in the DOM while the panel is closed. This prop is ignored when `hiddenUntilFound` is used.
- `loopFocus` — Deprecated following the [APG guidance update](https://github.com/w3c/aria-practices/pull/3434) to remove roving focus. This prop no longer affects keyboard focus behavior.
- `multiple` — Whether multiple items can be open at the same time.
- `onValueChange` — Event handler called when an accordion item is expanded or collapsed. Provides the new value as an argument.
- `orientation` — Deprecated following the [APG guidance update](https://github.com/w3c/aria-practices/pull/3434) to remove roving focus. This prop no longer affects keyboard focus behavior.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `value` — The controlled value of the item(s) that should be expanded. To render an uncontrolled accordion, use the `defaultValue` prop instead.

## AccordionItem

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: AccordionItemState) => string \| undefined) \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| onOpenChange | `((open: boolean, eventDetails: AccordionItemChangeEventDetails) => void) \| undefined` | — |
| style | `CSSProperties \| ((state: AccordionItemState) => CSSProperties \| undefined) \| undefined` | — |
| value | `any` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `disabled` — Whether the component should ignore user interaction.
- `onOpenChange` — Event handler called when the panel is opened or closed.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `value` — A unique value that identifies this accordion item. If no value is provided, a unique ID will be generated automatically. Use when controlling the accordion programmatically, or to set an initial open state.

## AccordionPanel

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: AccordionPanelState) => string \| undefined) \| undefined` | — |
| hiddenUntilFound | `boolean \| undefined` | — |
| keepMounted | `boolean \| undefined` | — |
| style | `CSSProperties \| ((state: AccordionPanelState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `hiddenUntilFound` — Allows the browser's built-in page search to find and expand the panel contents. Overrides the `keepMounted` prop and uses `hidden="until-found"` to hide the element without removing it from the DOM.
- `keepMounted` — Whether to keep the element in the DOM while the panel is closed. This prop is ignored when `hiddenUntilFound` is used.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## AccordionTrigger

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: AccordionTriggerState) => string \| undefined) \| undefined` | — |
| nativeButton | `boolean \| undefined` | — |
| style | `CSSProperties \| ((state: AccordionTriggerState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `false` if the rendered element is not a button (for example, `<div>`).
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

Required props are bold. Full docs: https://ui.xiod.dev/docs
