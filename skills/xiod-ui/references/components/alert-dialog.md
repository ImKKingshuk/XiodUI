# alert-dialog

```tsx
import { AlertDialog, AlertDialogBackdrop, AlertDialogClose, AlertDialogContent, AlertDialogCreateHandle, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertDialogPopup, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger, AlertDialogViewport } from "xiod-ui/alert-dialog";
```

## AlertDialog

| Prop | Type | Default |
| :--- | :--- | :--- |
| actionsRef | `RefObject<DialogRootActions \| null> \| undefined` | — |
| children | `ReactNode \| PayloadChildRenderFunction<Payload>` | — |
| defaultOpen | `boolean \| undefined` | — |
| defaultTriggerId | `string \| null \| undefined` | — |
| handle | `AlertDialogHandle<Payload> \| undefined` | — |
| onOpenChange | `((open: boolean, eventDetails: AlertDialogRootChangeEventDetails) => void) \| undefined` | — |
| onOpenChangeComplete | `((open: boolean) => void) \| undefined` | — |
| open | `boolean \| undefined` | — |
| triggerId | `string \| null \| undefined` | — |

- `actionsRef` — A ref to imperative actions. - `unmount`: Manually unmounts the alert dialog. Call this after any externally controlled closing animation finishes. - `close`: Closes the alert dialog imperatively when called.
- `children` — The content of the dialog. This can be a regular React node or a render function that receives the `payload` of the active trigger.
- `defaultOpen` — Whether the dialog is initially open. To render a controlled dialog, use the `open` prop instead.
- `defaultTriggerId` — ID of the trigger that the dialog is associated with. This is useful in conjunction with the `defaultOpen` prop to create an initially open dialog.
- `handle` — A handle to associate the alert dialog with a trigger. If specified, allows external triggers to control the alert dialog's open state. Can be created with the AlertDialog.createHandle() method.
- `onOpenChange` — Event handler called when the alert dialog is opened or closed.
- `onOpenChangeComplete` — Event handler called after any animations complete when the dialog is opened or closed.
- `open` — Whether the dialog is currently open.
- `triggerId` — ID of the trigger that the dialog is associated with. This is useful in conjunction with the `open` prop to create a controlled dialog. There's no need to specify this prop when the dialog is uncontrolled (that is, when the `open` prop is not set).

## AlertDialogBackdrop

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

## AlertDialogClose

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

## AlertDialogContent

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| bottomStickOnMobile | `boolean \| undefined` | `true` |
| className | `string \| ((state: DialogPopupState) => string \| undefined) \| undefined` | — |
| finalFocus | `boolean \| RefObject<HTMLElement \| null> \| ((closeType: InteractionType) => boolean \| void \| HTMLElement \| null) \| undefined` | — |
| initialFocus | `boolean \| RefObject<HTMLElement \| null> \| ((openType: InteractionType) => boolean \| void \| HTMLElement \| null) \| undefined` | — |
| style | `CSSProperties \| ((state: DialogPopupState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `finalFocus` — Determines the element to focus when the dialog is closed. - `false`: Do not move focus. - `true`: Move focus based on the default behavior (trigger or previously focused element). - `RefObject`: Move focus to the ref element. - `function`: Called with the interaction type (`mouse`, `touch`, `pen`, or `keyboard`). Return an element to focus, `true` to use the default behavior, `null` to fall back to the default behavior, or `false`/`undefined` to do nothing.
- `initialFocus` — Determines the element to focus when the dialog is opened. By default, focus moves to the first tabbable element inside the popup, except when the dialog is opened by touch — then the popup itself is focused to avoid opening the virtual keyboard. - `false`: Do not move focus. - `true`: Move focus based on the default behavior (first tabbable element or popup). - `RefObject`: Move focus to the ref element. - `function`: Called with the interaction type (`mouse`, `touch`, `pen`, or `keyboard`). Return an element to focus, `true` to use the default behavior, `null` to fall back to the default behavior, or `false`/`undefined` to do nothing.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## AlertDialogCreateHandle

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## AlertDialogDescription

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: DialogDescriptionState) => string \| undefined) \| undefined` | — |
| style | `CSSProperties \| ((state: DialogDescriptionState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## AlertDialogFooter

| Prop | Type | Default |
| :--- | :--- | :--- |
| variant | `"default" \| "bare" \| undefined` | `"default"` |

## AlertDialogHeader

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## AlertDialogOverlay

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

## AlertDialogPopup

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| bottomStickOnMobile | `boolean \| undefined` | `true` |
| className | `string \| ((state: DialogPopupState) => string \| undefined) \| undefined` | — |
| finalFocus | `boolean \| RefObject<HTMLElement \| null> \| ((closeType: InteractionType) => boolean \| void \| HTMLElement \| null) \| undefined` | — |
| initialFocus | `boolean \| RefObject<HTMLElement \| null> \| ((openType: InteractionType) => boolean \| void \| HTMLElement \| null) \| undefined` | — |
| style | `CSSProperties \| ((state: DialogPopupState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `finalFocus` — Determines the element to focus when the dialog is closed. - `false`: Do not move focus. - `true`: Move focus based on the default behavior (trigger or previously focused element). - `RefObject`: Move focus to the ref element. - `function`: Called with the interaction type (`mouse`, `touch`, `pen`, or `keyboard`). Return an element to focus, `true` to use the default behavior, `null` to fall back to the default behavior, or `false`/`undefined` to do nothing.
- `initialFocus` — Determines the element to focus when the dialog is opened. By default, focus moves to the first tabbable element inside the popup, except when the dialog is opened by touch — then the popup itself is focused to avoid opening the virtual keyboard. - `false`: Do not move focus. - `true`: Move focus based on the default behavior (first tabbable element or popup). - `RefObject`: Move focus to the ref element. - `function`: Called with the interaction type (`mouse`, `touch`, `pen`, or `keyboard`). Return an element to focus, `true` to use the default behavior, `null` to fall back to the default behavior, or `false`/`undefined` to do nothing.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## AlertDialogPortal

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

## AlertDialogTitle

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: DialogTitleState) => string \| undefined) \| undefined` | — |
| style | `CSSProperties \| ((state: DialogTitleState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## AlertDialogTrigger

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: DialogTriggerState) => string \| undefined) \| undefined` | — |
| handle | `AlertDialogHandle<unknown> \| undefined` | — |
| id | `string \| undefined` | — |
| nativeButton | `boolean \| undefined` | — |
| payload | `unknown` | — |
| style | `CSSProperties \| ((state: DialogTriggerState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `handle` — A handle to associate the trigger with an alert dialog. Can be created with the AlertDialog.createHandle() method.
- `id` — ID of the trigger. In addition to being forwarded to the rendered element, it is also used to specify the active trigger for the dialog in controlled mode (with the DialogRoot `triggerId` prop).
- `nativeButton` — Whether the component renders a native `<button>` element when replacing it via the `render` prop. Set to `false` if the rendered element is not a button (for example, `<div>`).
- `payload` — A payload to pass to the dialog when it is opened.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## AlertDialogViewport

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: DialogViewportState) => string \| undefined) \| undefined` | — |
| style | `CSSProperties \| ((state: DialogViewportState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

Required props are bold. Full docs: https://ui.xiod.dev/docs
