# Popover

```tsx
import { Popover, PopoverArrow, PopoverClose, PopoverCreateHandle, PopoverDescription, PopoverPopup, PopoverTitle, PopoverTrigger } from "xiod-ui/popover";
```

## Popover

| Prop | Type |
| :--- | :--- |
| actionsRef | `RefObject<PopoverRootActions \| null> \| undefined` |
| children | `ReactNode \| PayloadChildRenderFunction<Payload>` |
| defaultOpen | `boolean \| undefined` |
| defaultTriggerId | `string \| null \| undefined` |
| handle | `PopoverHandle<Payload> \| undefined` |
| modal | `boolean \| "trap-focus" \| undefined` |
| onOpenChange | `((open: boolean, eventDetails: PopoverRootChangeEventDetails) => void) \| undefined` |
| onOpenChangeComplete | `((open: boolean) => void) \| undefined` |
| open | `boolean \| undefined` |
| triggerId | `string \| null \| undefined` |

- `actionsRef` — A ref to imperative actions.
  - `unmount`: Manually unmounts the popover. Call this after any externally controlled closing animation finishes.
  - `close`: Closes the popover imperatively when called.
- `children` — The content of the popover. This can be a regular React node or a render function that receives the `payload` of the active trigger.
- `defaultOpen` — Whether the popover is initially open.
  To render a controlled popover, use the `open` prop instead.
- `defaultTriggerId` — ID of the trigger that the popover is associated with. This is useful in conjunction with the `defaultOpen` prop to create an initially open popover.
- `handle` — A handle to associate the popover with a trigger. If specified, allows external triggers to control the popover's open state.
- `modal` — Determines if the popover enters a modal state when open.
  - `true`: user interaction is limited to the popover: document page scroll is locked, and pointer interactions on outside elements are disabled.
  - `false`: user interaction with the rest of the document is allowed.
  - `'trap-focus'`: focus is trapped inside the popover, but document page scroll is not locked and pointer interactions outside of it remain enabled.
  On touch devices, a `true` modal blocks outside taps but leaves the page scrollable unless the popup spans nearly the full viewport width, matching native iOS behavior.
  When `modal` is `true`, focus trapping is enabled only if `<PopoverClose>` is rendered inside `<PopoverPopup>`. It can be visually hidden with your own CSS if needed, such as Tailwind's `sr-only` utility.
  When `modal` is `'trap-focus'`, render `<PopoverClose>` inside `<PopoverPopup>` so touch screen readers can escape the popup.
- `onOpenChange` — Event handler called when the popover is opened or closed.
- `onOpenChangeComplete` — Event handler called after any animations complete when the popover is opened or closed.
- `open` — Whether the popover is currently open.
- `triggerId` — ID of the trigger that the popover is associated with. This is useful in conjunction with the `open` prop to create a controlled popover. There's no need to specify this prop when the popover is uncontrolled (that is, when the `open` prop is not set).

## PopoverArrow

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: PopoverArrowState) => string \| undefined) \| undefined` |
| style | `CSSProperties \| ((state: PopoverArrowState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## PopoverClose

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: PopoverCloseState) => string \| undefined) \| undefined` |
| nativeButton | `boolean \| undefined` |
| style | `CSSProperties \| ((state: PopoverCloseState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `false` if the rendered element is not a button (for example, `<div>`).
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## PopoverCreateHandle

A function, not a component. It creates a handle that connects triggers
to a `Popover` they are not nested in:

```tsx
const handle = PopoverCreateHandle();

<Popover handle={handle}>…</Popover>
<PopoverTrigger handle={handle}>Open</PopoverTrigger>
```

Create it outside render, once per instance.

## PopoverDescription

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: PopoverDescriptionState) => string \| undefined) \| undefined` |
| style | `CSSProperties \| ((state: PopoverDescriptionState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## PopoverPopup

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| align | `Align \| undefined` | `"center"` |
| alignOffset | `number \| OffsetFunction \| undefined` | `0` |
| anchor | `Element \| VirtualElement \| RefObject<Element \| null> \| (() => Element \| VirtualElement \| null) \| null \| undefined` | — |
| className | `string \| ((state: PopoverPopupState) => string \| undefined) \| undefined` | — |
| collisionAvoidance | `CollisionAvoidance \| undefined` | — |
| finalFocus | `boolean \| RefObject<HTMLElement \| null> \| ((closeType: InteractionType) => boolean \| void \| HTMLElement \| null) \| undefined` | — |
| hideArrow | `boolean \| undefined` | `false` |
| initialFocus | `boolean \| RefObject<HTMLElement \| null> \| ((openType: InteractionType) => boolean \| void \| HTMLElement \| null) \| undefined` | — |
| side | `Side \| undefined` | `"bottom"` |
| sideOffset | `number \| OffsetFunction \| undefined` | `8` |
| style | `CSSProperties \| ((state: PopoverPopupState) => CSSProperties \| undefined) \| undefined` | — |
| tooltipStyle | `boolean \| undefined` | `false` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `finalFocus` — Determines the element to focus when the popover is closed.
  - `false`: Do not move focus.
  - `true`: Move focus based on the default behavior (trigger or previously focused element).
  - `RefObject`: Move focus to the ref element.
  - `function`: Called with the interaction type (`mouse`, `touch`, `pen`, or `keyboard`). Return an element to focus, `true` to use the default behavior, `null` to fall back to the default behavior, or `false`/`undefined` to do nothing.
- `initialFocus` — Determines the element to focus when the popover is opened. By default, focus moves to the first tabbable element inside the popup, except when the popover is opened by touch — then the popup itself is focused to avoid opening the virtual keyboard.
  - `false`: Do not move focus.
  - `true`: Move focus based on the default behavior (first tabbable element or popup).
  - `RefObject`: Move focus to the ref element.
  - `function`: Called with the interaction type (`mouse`, `touch`, `pen`, or `keyboard`). Return an element to focus, `true` to use the default behavior, `null` to fall back to the default behavior, or `false`/`undefined` to do nothing.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## PopoverTitle

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: PopoverTitleState) => string \| undefined) \| undefined` |
| style | `CSSProperties \| ((state: PopoverTitleState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## PopoverTrigger

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: PopoverTriggerState) => string \| undefined) \| undefined` |
| closeDelay | `number \| undefined` |
| delay | `number \| undefined` |
| handle | `PopoverHandle<unknown> \| undefined` |
| nativeButton | `boolean \| undefined` |
| openOnHover | `boolean \| undefined` |
| payload | `unknown` |
| style | `CSSProperties \| ((state: PopoverTriggerState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `closeDelay` — How long to wait before closing the popover that was opened on hover. Specified in milliseconds.
  Requires the `openOnHover` prop.
- `delay` — How long to wait before the popover may be opened on hover. Specified in milliseconds.
  Requires the `openOnHover` prop.
- `handle` — A handle to associate the trigger with a popover.
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `false` if the rendered element is not a button (for example, `<div>`). Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `false` if the rendered element is not a button (e.g. `<div>`).
- `openOnHover` — Whether the popover should also open when the trigger is hovered.
- `payload` — A payload to pass to the popover when it is opened.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

Required props are bold. Full docs: https://ui.xiod.dev/docs
