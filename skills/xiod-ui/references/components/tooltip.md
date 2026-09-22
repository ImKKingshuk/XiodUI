# tooltip

```tsx
import { Tooltip, TooltipArrow, TooltipCreateHandle, TooltipPopup, TooltipProvider, TooltipTrigger } from "xiod-ui/tooltip";
```

## Tooltip

| Prop | Type | Default |
| :--- | :--- | :--- |
| actionsRef | `RefObject<TooltipRootActions \| null> \| undefined` | — |
| children | `ReactNode \| PayloadChildRenderFunction<Payload>` | — |
| defaultOpen | `boolean \| undefined` | — |
| defaultTriggerId | `string \| null \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| disableHoverablePopup | `boolean \| undefined` | — |
| handle | `TooltipHandle<Payload> \| undefined` | — |
| onOpenChange | `((open: boolean, eventDetails: TooltipRootChangeEventDetails) => void) \| undefined` | — |
| onOpenChangeComplete | `((open: boolean) => void) \| undefined` | — |
| open | `boolean \| undefined` | — |
| trackCursorAxis | `"none" \| "x" \| "y" \| "both" \| undefined` | — |
| triggerId | `string \| null \| undefined` | — |

- `actionsRef` — A ref to imperative actions. - `unmount`: Unmounts the tooltip popup. - `close`: Closes the tooltip imperatively when called.
- `children` — The content of the tooltip. This can be a regular React node or a render function that receives the `payload` of the active trigger.
- `defaultOpen` — Whether the tooltip is initially open. To render a controlled tooltip, use the `open` prop instead.
- `defaultTriggerId` — ID of the trigger that the tooltip is associated with. This is useful in conjunction with the `defaultOpen` prop to create an initially open tooltip.
- `disabled` — Whether the tooltip is disabled.
- `disableHoverablePopup` — Whether the tooltip contents can be hovered without closing the tooltip.
- `handle` — A handle to associate the tooltip with a trigger. If specified, allows external triggers to control the tooltip's open state. Can be created with the Tooltip.createHandle() method.
- `onOpenChange` — Event handler called when the tooltip is opened or closed.
- `onOpenChangeComplete` — Event handler called after any animations complete when the tooltip is opened or closed.
- `open` — Whether the tooltip is currently open.
- `trackCursorAxis` — Determines which axis the tooltip should track the cursor on.
- `triggerId` — ID of the trigger that the tooltip is associated with. This is useful in conjunction with the `open` prop to create a controlled tooltip. There's no need to specify this prop when the tooltip is uncontrolled (that is, when the `open` prop is not set).

## TooltipArrow

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: TooltipArrowState) => string \| undefined) \| undefined` | — |
| style | `CSSProperties \| ((state: TooltipArrowState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## TooltipCreateHandle

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## TooltipPopup

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| align | `Align \| undefined` | `"center"` |
| anchor | `Element \| VirtualElement \| RefObject<Element \| null> \| (() => Element \| VirtualElement \| null) \| null \| undefined` | — |
| className | `string \| ((state: TooltipPopupState) => string \| undefined) \| undefined` | — |
| hideArrow | `boolean \| undefined` | `false` |
| side | `Side \| undefined` | `"top"` |
| sideOffset | `number \| OffsetFunction \| undefined` | `10` |
| style | `CSSProperties \| ((state: TooltipPopupState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## TooltipProvider

| Prop | Type | Default |
| :--- | :--- | :--- |
| children | `ReactNode` | — |
| closeDelay | `number \| undefined` | — |
| delay | `number \| undefined` | — |
| timeout | `number \| undefined` | — |

- `closeDelay` — How long to wait before closing a tooltip. Specified in milliseconds.
- `delay` — How long to wait before opening the tooltip on hover. Specified in milliseconds.
- `timeout` — Another tooltip will open instantly if the previous tooltip is closed within this timeout. Specified in milliseconds.

## TooltipTrigger

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: TooltipTriggerState) => string \| undefined) \| undefined` | — |
| closeDelay | `number \| undefined` | — |
| closeOnClick | `boolean \| undefined` | — |
| delay | `number \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| handle | `TooltipHandle<unknown> \| undefined` | — |
| payload | `unknown` | — |
| style | `CSSProperties \| ((state: TooltipTriggerState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `closeDelay` — How long to wait before closing the tooltip. Specified in milliseconds.
- `closeOnClick` — Whether the tooltip should close when this trigger is clicked.
- `delay` — How long to wait before opening the tooltip on hover. Specified in milliseconds.
- `disabled` — If `true`, the tooltip will not open when interacting with this trigger. Note that this doesn't apply the `disabled` attribute to the trigger element. If you want to disable the trigger element itself, you can pass the `disabled` prop to the trigger element via the `render` prop.
- `handle` — A handle to associate the trigger with a tooltip.
- `payload` — A payload to pass to the tooltip when it is opened.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

Required props are bold. Full docs: https://ui.xiod.dev/docs
