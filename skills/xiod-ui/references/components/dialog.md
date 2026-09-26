# dialog

```tsx
import { Dialog, DialogBackdrop, DialogClose, DialogCreateHandle, DialogDescription, DialogFooter, DialogHeader, DialogPanel, DialogPopup, DialogPortal, DialogTitle, DialogTrigger, DialogViewport } from "xiod-ui/dialog";
```

## Dialog

| Prop | Type | Default |
| :--- | :--- | :--- |
| actionsRef | `RefObject<DialogRootActions \| null> \| undefined` | — |
| children | `ReactNode \| PayloadChildRenderFunction<Payload>` | — |
| defaultOpen | `boolean \| undefined` | — |
| defaultTriggerId | `string \| null \| undefined` | — |
| disablePointerDismissal | `boolean \| undefined` | — |
| handle | `DialogHandle<Payload> \| undefined` | — |
| modal | `boolean \| "trap-focus" \| undefined` | — |
| onOpenChange | `((open: boolean, eventDetails: DialogRootChangeEventDetails) => void) \| undefined` | — |
| onOpenChangeComplete | `((open: boolean) => void) \| undefined` | — |
| open | `boolean \| undefined` | — |
| triggerId | `string \| null \| undefined` | — |

- `actionsRef` — A ref to imperative actions. - `unmount`: Manually unmounts the dialog. Call this after any externally controlled closing animation finishes. - `close`: Closes the dialog imperatively when called.
- `children` — The content of the dialog. This can be a regular React node or a render function that receives the `payload` of the active trigger.
- `defaultOpen` — Whether the dialog is initially open. To render a controlled dialog, use the `open` prop instead.
- `defaultTriggerId` — ID of the trigger that the dialog is associated with. This is useful in conjunction with the `defaultOpen` prop to create an initially open dialog.
- `disablePointerDismissal` — Whether to prevent the dialog from closing on outside presses. For non-modal dialogs, this also prevents the dialog from closing when focus moves outside of it.
- `handle` — A handle to associate the dialog with a trigger. If specified, allows external triggers to control the dialog's open state. Can be created with the Dialog.createHandle() method.
- `modal` — Determines if the dialog enters a modal state when open. - `true`: user interaction is limited to just the dialog: focus is trapped, document page scroll is locked, and pointer interactions on outside elements are disabled. - `false`: user interaction with the rest of the document is allowed. - `'trap-focus'`: focus is trapped inside the dialog, but document page scroll is not locked and pointer interactions outside of it remain enabled. When `modal` is `true` or `'trap-focus'`, render `<Dialog.Close>` inside `<Dialog.Popup>` so touch screen readers can escape the popup.
- `onOpenChange` — Event handler called when the dialog is opened or closed.
- `onOpenChangeComplete` — Event handler called after any animations complete when the dialog is opened or closed.
- `open` — Whether the dialog is currently open.
- `triggerId` — ID of the trigger that the dialog is associated with. This is useful in conjunction with the `open` prop to create a controlled dialog. There's no need to specify this prop when the dialog is uncontrolled (that is, when the `open` prop is not set).

## DialogBackdrop

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: DialogBackdropState) => string \| undefined) \| undefined` | — |
| forceRender | `boolean \| undefined` | — |
| style | `CSSProperties \| ((state: DialogBackdropState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `forceRender` — Whether the backdrop is forced to render even when nested.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## DialogClose

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: DialogCloseState) => string \| undefined) \| undefined` | — |
| nativeButton | `boolean \| undefined` | — |
| style | `CSSProperties \| ((state: DialogCloseState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `false` if the rendered element is not a button (for example, `<div>`).
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## DialogCreateHandle

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## DialogDescription

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: DialogDescriptionState) => string \| undefined) \| undefined` | — |
| style | `CSSProperties \| ((state: DialogDescriptionState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## DialogFooter

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| variant | `"default" \| "bare" \| undefined` | `"default"` |

## DialogHeader

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## DialogPanel

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| scrollFade | `boolean \| undefined` | `true` |

## DialogPopup

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| bottomStickOnMobile | `boolean \| undefined` | `true` |
| className | `string \| ((state: DialogPopupState) => string \| undefined) \| undefined` | — |
| closeIcon | `ReactNode` | — |
| closeProps | `DialogCloseProps \| undefined` | — |
| finalFocus | `boolean \| RefObject<HTMLElement \| null> \| ((closeType: InteractionType) => boolean \| void \| HTMLElement \| null) \| undefined` | — |
| initialFocus | `boolean \| RefObject<HTMLElement \| null> \| ((openType: InteractionType) => boolean \| void \| HTMLElement \| null) \| undefined` | — |
| showCloseButton | `boolean \| undefined` | `true` |
| style | `CSSProperties \| ((state: DialogPopupState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `closeIcon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `finalFocus` — Determines the element to focus when the dialog is closed. - `false`: Do not move focus. - `true`: Move focus based on the default behavior (trigger or previously focused element). - `RefObject`: Move focus to the ref element. - `function`: Called with the interaction type (`mouse`, `touch`, `pen`, or `keyboard`). Return an element to focus, `true` to use the default behavior, `null` to fall back to the default behavior, or `false`/`undefined` to do nothing.
- `initialFocus` — Determines the element to focus when the dialog is opened. By default, focus moves to the first tabbable element inside the popup, except when the dialog is opened by touch — then the popup itself is focused to avoid opening the virtual keyboard. - `false`: Do not move focus. - `true`: Move focus based on the default behavior (first tabbable element or popup). - `RefObject`: Move focus to the ref element. - `function`: Called with the interaction type (`mouse`, `touch`, `pen`, or `keyboard`). Return an element to focus, `true` to use the default behavior, `null` to fall back to the default behavior, or `false`/`undefined` to do nothing.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## DialogPortal

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: DialogPortalState) => string \| undefined) \| undefined` | — |
| container | `HTMLElement \| ShadowRoot \| RefObject<HTMLElement \| ShadowRoot \| null> \| null \| undefined` | — |
| keepMounted | `boolean \| undefined` | — |
| style | `CSSProperties \| ((state: DialogPortalState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `container` — A parent element to render the portal element into.
- `keepMounted` — Whether to keep the portal mounted in the DOM while the popup is hidden.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## DialogTitle

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: DialogTitleState) => string \| undefined) \| undefined` | — |
| style | `CSSProperties \| ((state: DialogTitleState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## DialogTrigger

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: DialogTriggerState) => string \| undefined) \| undefined` | — |
| handle | `DialogHandle<unknown> \| undefined` | — |
| id | `string \| undefined` | — |
| nativeButton | `boolean \| undefined` | — |
| payload | `unknown` | — |
| style | `CSSProperties \| ((state: DialogTriggerState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `handle` — A handle to associate the trigger with a dialog. Can be created with the Dialog.createHandle() method.
- `id` — ID of the trigger. In addition to being forwarded to the rendered element, it is also used to specify the active trigger for the dialog in controlled mode (with the DialogRoot `triggerId` prop).
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `false` if the rendered element is not a button (for example, `<div>`).
- `payload` — A payload to pass to the dialog when it is opened.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## DialogViewport

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: DialogViewportState) => string \| undefined) \| undefined` | — |
| style | `CSSProperties \| ((state: DialogViewportState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

Required props are bold. Full docs: https://ui.xiod.dev/docs
