# preview-card

```tsx
import { PreviewCard, PreviewCardArrow, PreviewCardPopup, PreviewCardTrigger } from "xiod-ui/preview-card";
```

## PreviewCard

| Prop | Type | Default |
| :--- | :--- | :--- |
| actionsRef | `RefObject<PreviewCardRootActions \| null> \| undefined` | — |
| children | `ReactNode \| PayloadChildRenderFunction<Payload>` | — |
| defaultOpen | `boolean \| undefined` | — |
| defaultTriggerId | `string \| null \| undefined` | — |
| handle | `PreviewCardHandle<Payload> \| undefined` | — |
| onOpenChange | `((open: boolean, eventDetails: PreviewCardRootChangeEventDetails) => void) \| undefined` | — |
| onOpenChangeComplete | `((open: boolean) => void) \| undefined` | — |
| open | `boolean \| undefined` | — |
| triggerId | `string \| null \| undefined` | — |

- `actionsRef` — A ref to imperative actions. - `unmount`: Unmounts the preview card popup. - `close`: Closes the preview card imperatively when called.
- `children` — The content of the preview card. This can be a regular React node or a render function that receives the `payload` of the active trigger.
- `defaultOpen` — Whether the preview card is initially open. To render a controlled preview card, use the `open` prop instead.
- `defaultTriggerId` — ID of the trigger that the preview card is associated with. This is useful in conjunction with the `defaultOpen` prop to create an initially open preview card.
- `handle` — A handle to associate the preview card with a trigger. If specified, allows external triggers to control the card's open state. Can be created with the PreviewCard.createHandle() method.
- `onOpenChange` — Event handler called when the preview card is opened or closed.
- `onOpenChangeComplete` — Event handler called after any animations complete when the preview card is opened or closed.
- `open` — Whether the preview card is currently open.
- `triggerId` — ID of the trigger that the preview card is associated with. This is useful in conjunction with the `open` prop to create a controlled preview card. There's no need to specify this prop when the preview card is uncontrolled (that is, when the `open` prop is not set).

## PreviewCardArrow

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: PreviewCardArrowState) => string \| undefined) \| undefined` | — |
| style | `CSSProperties \| ((state: PreviewCardArrowState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## PreviewCardPopup

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| align | `Align \| undefined` | `"center"` |
| alignOffset | `number \| OffsetFunction \| undefined` | `0` |
| anchor | `Element \| VirtualElement \| RefObject<Element \| null> \| (() => Element \| VirtualElement \| null) \| null \| undefined` | — |
| className | `string \| ((state: PreviewCardPopupState) => string \| undefined) \| undefined` | — |
| hideArrow | `boolean \| undefined` | `false` |
| side | `Side \| undefined` | `"bottom"` |
| sideOffset | `number \| OffsetFunction \| undefined` | `8` |
| style | `CSSProperties \| ((state: PreviewCardPopupState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## PreviewCardTrigger

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: PreviewCardTriggerState) => string \| undefined) \| undefined` | — |
| closeDelay | `number \| undefined` | — |
| delay | `number \| undefined` | — |
| handle | `PreviewCardHandle<unknown> \| undefined` | — |
| payload | `unknown` | — |
| style | `CSSProperties \| ((state: PreviewCardTriggerState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `closeDelay` — How long to wait before closing the preview card. Specified in milliseconds.
- `delay` — How long to wait before the preview card opens. Specified in milliseconds.
- `handle` — A handle to associate the trigger with a preview card.
- `payload` — A payload to pass to the preview card when it is opened.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

Required props are bold. Full docs: https://ui.xiod.dev/docs
