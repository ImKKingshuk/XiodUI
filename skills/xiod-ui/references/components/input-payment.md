# input-payment

```tsx
import { InputPayment, InputPaymentBrandIcon, InputPaymentCardNumber, InputPaymentCVC, InputPaymentExpiry, InputPaymentGroup, InputPaymentMethodSelector, InputPaymentUpiGroup, InputPaymentUpiId, InputPaymentUpiProviderIcon, InputPaymentZip, PaymentInput, PaymentInputBrandIcon, PaymentInputCardNumber, PaymentInputCVC, PaymentInputExpiry, PaymentInputGroup, PaymentInputMethodSelector, PaymentInputUpiGroup, PaymentInputUpiId, PaymentInputUpiProviderIcon, PaymentInputZip, useInputPayment, usePaymentInput, usePaymentInputContext } from "xiod-ui/input-payment";
```

## InputPayment

| Prop | Type | Default |
| :--- | :--- | :--- |
| autoFocusNext | `boolean \| undefined` | `true` |
| cardCvc | `string \| undefined` | — |
| cardExpiry | `string \| undefined` | — |
| cardNumber | `string \| undefined` | — |
| cardZip | `string \| undefined` | — |
| children | `ReactNode` | — |
| defaultCardCvc | `string \| undefined` | `""` |
| defaultCardExpiry | `string \| undefined` | `""` |
| defaultCardNumber | `string \| undefined` | `""` |
| defaultCardZip | `string \| undefined` | `""` |
| defaultPaymentMethod | `PaymentMethod \| undefined` | `"card"` |
| defaultUpiId | `string \| undefined` | `""` |
| disabled | `boolean \| undefined` | `false` |
| onCardCvcChange | `((val: string) => void) \| undefined` | — |
| onCardExpiryChange | `((val: string) => void) \| undefined` | — |
| onCardNumberChange | `((val: string) => void) \| undefined` | — |
| onCardZipChange | `((val: string) => void) \| undefined` | — |
| onPaymentMethodChange | `((method: PaymentMethod) => void) \| undefined` | — |
| onUpiIdChange | `((val: string) => void) \| undefined` | — |
| onValidationChange | `((isValid: boolean, errors: PaymentInputErrors) => void) \| undefined` | — |
| paymentMethod | `PaymentMethod \| undefined` | — |
| readOnly | `boolean \| undefined` | `false` |
| upiId | `string \| undefined` | — |

## InputPaymentBrandIcon

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## InputPaymentCardNumber

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| undefined` | — |
| defaultValue | `string \| number \| readonly string[] \| undefined` | — |
| onChange | `ChangeEventHandler<HTMLInputElement, Element> \| undefined` | — |
| onKeyDown | `KeyboardEventHandler<HTMLInputElement> \| undefined` | — |
| onValueChange | `((value: string, eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element \| undefined; }) => void) \| undefined` | — |
| size | `number \| "sm" \| "default" \| "lg" \| undefined` | `"default"` |
| style | `CSSProperties \| undefined` | — |
| value | `string \| number \| readonly string[] \| undefined` | — |

- `defaultValue` — The default value of the input. Use when uncontrolled.
- `onValueChange` — Callback fired when the `value` changes. Use when controlled.
- `value` — The value of the input. Use when controlled.

## InputPaymentCVC

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| undefined` | — |
| defaultValue | `string \| number \| readonly string[] \| undefined` | — |
| onChange | `ChangeEventHandler<HTMLInputElement, Element> \| undefined` | — |
| onKeyDown | `KeyboardEventHandler<HTMLInputElement> \| undefined` | — |
| onValueChange | `((value: string, eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element \| undefined; }) => void) \| undefined` | — |
| size | `number \| "sm" \| "default" \| "lg" \| undefined` | `"default"` |
| style | `CSSProperties \| undefined` | — |
| value | `string \| number \| readonly string[] \| undefined` | — |

- `defaultValue` — The default value of the input. Use when uncontrolled.
- `onValueChange` — Callback fired when the `value` changes. Use when controlled.
- `value` — The value of the input. Use when controlled.

## InputPaymentExpiry

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| undefined` | — |
| defaultValue | `string \| number \| readonly string[] \| undefined` | — |
| onChange | `ChangeEventHandler<HTMLInputElement, Element> \| undefined` | — |
| onKeyDown | `KeyboardEventHandler<HTMLInputElement> \| undefined` | — |
| onValueChange | `((value: string, eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element \| undefined; }) => void) \| undefined` | — |
| size | `number \| "sm" \| "default" \| "lg" \| undefined` | `"default"` |
| style | `CSSProperties \| undefined` | — |
| value | `string \| number \| readonly string[] \| undefined` | — |

- `defaultValue` — The default value of the input. Use when uncontrolled.
- `onValueChange` — Callback fired when the `value` changes. Use when controlled.
- `value` — The value of the input. Use when controlled.

## InputPaymentGroup

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## InputPaymentMethodSelector

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: TabsRootState) => string \| undefined) \| undefined` | — |
| defaultValue | `any` | — |
| onValueChange | `((value: any, eventDetails: TabsRootChangeEventDetails) => void) \| undefined` | — |
| orientation | `Orientation \| undefined` | — |
| style | `CSSProperties \| ((state: TabsRootState) => CSSProperties \| undefined) \| undefined` | — |
| value | `any` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `defaultValue` — The default value. Use when the component is not controlled. When the value is `null`, no Tab will be active.
- `onValueChange` — Callback invoked when new value is being set. The event `reason` is `'none'` for user-initiated changes, such as a click or keyboard navigation; `'initial'` for the first automatic selection or fallback in uncontrolled roots when `defaultValue` is omitted or `undefined`, including when the implicit initial value is disabled or missing; `'disabled'` for automatic fallback when the selected tab becomes disabled in uncontrolled roots; or `'missing'` for automatic fallback when the selected tab is removed, or when an explicit `defaultValue` never matches a mounted tab in uncontrolled roots. For automatic changes, the selected value can be `null` when no enabled Tab is available as a fallback. Automatic changes cannot be canceled; calling `eventDetails.cancel()` for `'initial'`, `'disabled'`, or `'missing'` has no effect.
- `orientation` — The component orientation (layout flow direction).
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `value` — The value of the currently active `Tab`. Use when the component is controlled. When the value is `null`, no Tab will be active.

## InputPaymentUpiGroup

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## InputPaymentUpiId

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| undefined` | — |
| defaultValue | `string \| number \| readonly string[] \| undefined` | — |
| onChange | `ChangeEventHandler<HTMLInputElement, Element> \| undefined` | — |
| onKeyDown | `KeyboardEventHandler<HTMLInputElement> \| undefined` | — |
| onValueChange | `((value: string, eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element \| undefined; }) => void) \| undefined` | — |
| size | `number \| "sm" \| "default" \| "lg" \| undefined` | `"default"` |
| style | `CSSProperties \| undefined` | — |
| value | `string \| number \| readonly string[] \| undefined` | — |

- `defaultValue` — The default value of the input. Use when uncontrolled.
- `onValueChange` — Callback fired when the `value` changes. Use when controlled.
- `value` — The value of the input. Use when controlled.

## InputPaymentUpiProviderIcon

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## InputPaymentZip

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| undefined` | — |
| defaultValue | `string \| number \| readonly string[] \| undefined` | — |
| onChange | `ChangeEventHandler<HTMLInputElement, Element> \| undefined` | — |
| onKeyDown | `KeyboardEventHandler<HTMLInputElement> \| undefined` | — |
| onValueChange | `((value: string, eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element \| undefined; }) => void) \| undefined` | — |
| size | `number \| "sm" \| "default" \| "lg" \| undefined` | `"default"` |
| style | `CSSProperties \| undefined` | — |
| value | `string \| number \| readonly string[] \| undefined` | — |

- `defaultValue` — The default value of the input. Use when uncontrolled.
- `onValueChange` — Callback fired when the `value` changes. Use when controlled.
- `value` — The value of the input. Use when controlled.

## PaymentInput

| Prop | Type | Default |
| :--- | :--- | :--- |
| autoFocusNext | `boolean \| undefined` | — |
| cardCvc | `string \| undefined` | — |
| cardExpiry | `string \| undefined` | — |
| cardNumber | `string \| undefined` | — |
| cardZip | `string \| undefined` | — |
| children | `ReactNode` | — |
| defaultCardCvc | `string \| undefined` | — |
| defaultCardExpiry | `string \| undefined` | — |
| defaultCardNumber | `string \| undefined` | — |
| defaultCardZip | `string \| undefined` | — |
| defaultPaymentMethod | `PaymentMethod \| undefined` | — |
| defaultUpiId | `string \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| onCardCvcChange | `((val: string) => void) \| undefined` | — |
| onCardExpiryChange | `((val: string) => void) \| undefined` | — |
| onCardNumberChange | `((val: string) => void) \| undefined` | — |
| onCardZipChange | `((val: string) => void) \| undefined` | — |
| onPaymentMethodChange | `((method: PaymentMethod) => void) \| undefined` | — |
| onUpiIdChange | `((val: string) => void) \| undefined` | — |
| onValidationChange | `((isValid: boolean, errors: PaymentInputErrors) => void) \| undefined` | — |
| paymentMethod | `PaymentMethod \| undefined` | — |
| readOnly | `boolean \| undefined` | — |
| upiId | `string \| undefined` | — |

## PaymentInputBrandIcon

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## PaymentInputCardNumber

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| undefined` | — |
| defaultValue | `string \| number \| readonly string[] \| undefined` | — |
| onChange | `ChangeEventHandler<HTMLInputElement, Element> \| undefined` | — |
| onKeyDown | `KeyboardEventHandler<HTMLInputElement> \| undefined` | — |
| onValueChange | `((value: string, eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element \| undefined; }) => void) \| undefined` | — |
| size | `number \| "sm" \| "default" \| "lg" \| undefined` | — |
| style | `CSSProperties \| undefined` | — |
| value | `string \| number \| readonly string[] \| undefined` | — |

- `defaultValue` — The default value of the input. Use when uncontrolled.
- `onValueChange` — Callback fired when the `value` changes. Use when controlled.
- `value` — The value of the input. Use when controlled.

## PaymentInputCVC

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| undefined` | — |
| defaultValue | `string \| number \| readonly string[] \| undefined` | — |
| onChange | `ChangeEventHandler<HTMLInputElement, Element> \| undefined` | — |
| onKeyDown | `KeyboardEventHandler<HTMLInputElement> \| undefined` | — |
| onValueChange | `((value: string, eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element \| undefined; }) => void) \| undefined` | — |
| size | `number \| "sm" \| "default" \| "lg" \| undefined` | — |
| style | `CSSProperties \| undefined` | — |
| value | `string \| number \| readonly string[] \| undefined` | — |

- `defaultValue` — The default value of the input. Use when uncontrolled.
- `onValueChange` — Callback fired when the `value` changes. Use when controlled.
- `value` — The value of the input. Use when controlled.

## PaymentInputExpiry

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| undefined` | — |
| defaultValue | `string \| number \| readonly string[] \| undefined` | — |
| onChange | `ChangeEventHandler<HTMLInputElement, Element> \| undefined` | — |
| onKeyDown | `KeyboardEventHandler<HTMLInputElement> \| undefined` | — |
| onValueChange | `((value: string, eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element \| undefined; }) => void) \| undefined` | — |
| size | `number \| "sm" \| "default" \| "lg" \| undefined` | — |
| style | `CSSProperties \| undefined` | — |
| value | `string \| number \| readonly string[] \| undefined` | — |

- `defaultValue` — The default value of the input. Use when uncontrolled.
- `onValueChange` — Callback fired when the `value` changes. Use when controlled.
- `value` — The value of the input. Use when controlled.

## PaymentInputGroup

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## PaymentInputMethodSelector

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: TabsRootState) => string \| undefined) \| undefined` | — |
| defaultValue | `any` | — |
| onValueChange | `((value: any, eventDetails: TabsRootChangeEventDetails) => void) \| undefined` | — |
| orientation | `Orientation \| undefined` | — |
| style | `CSSProperties \| ((state: TabsRootState) => CSSProperties \| undefined) \| undefined` | — |
| value | `any` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `defaultValue` — The default value. Use when the component is not controlled. When the value is `null`, no Tab will be active.
- `onValueChange` — Callback invoked when new value is being set. The event `reason` is `'none'` for user-initiated changes, such as a click or keyboard navigation; `'initial'` for the first automatic selection or fallback in uncontrolled roots when `defaultValue` is omitted or `undefined`, including when the implicit initial value is disabled or missing; `'disabled'` for automatic fallback when the selected tab becomes disabled in uncontrolled roots; or `'missing'` for automatic fallback when the selected tab is removed, or when an explicit `defaultValue` never matches a mounted tab in uncontrolled roots. For automatic changes, the selected value can be `null` when no enabled Tab is available as a fallback. Automatic changes cannot be canceled; calling `eventDetails.cancel()` for `'initial'`, `'disabled'`, or `'missing'` has no effect.
- `orientation` — The component orientation (layout flow direction).
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `value` — The value of the currently active `Tab`. Use when the component is controlled. When the value is `null`, no Tab will be active.

## PaymentInputUpiGroup

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## PaymentInputUpiId

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| undefined` | — |
| defaultValue | `string \| number \| readonly string[] \| undefined` | — |
| onChange | `ChangeEventHandler<HTMLInputElement, Element> \| undefined` | — |
| onKeyDown | `KeyboardEventHandler<HTMLInputElement> \| undefined` | — |
| onValueChange | `((value: string, eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element \| undefined; }) => void) \| undefined` | — |
| size | `number \| "sm" \| "default" \| "lg" \| undefined` | — |
| style | `CSSProperties \| undefined` | — |
| value | `string \| number \| readonly string[] \| undefined` | — |

- `defaultValue` — The default value of the input. Use when uncontrolled.
- `onValueChange` — Callback fired when the `value` changes. Use when controlled.
- `value` — The value of the input. Use when controlled.

## PaymentInputUpiProviderIcon

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## PaymentInputZip

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| undefined` | — |
| defaultValue | `string \| number \| readonly string[] \| undefined` | — |
| onChange | `ChangeEventHandler<HTMLInputElement, Element> \| undefined` | — |
| onKeyDown | `KeyboardEventHandler<HTMLInputElement> \| undefined` | — |
| onValueChange | `((value: string, eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element \| undefined; }) => void) \| undefined` | — |
| size | `number \| "sm" \| "default" \| "lg" \| undefined` | — |
| style | `CSSProperties \| undefined` | — |
| value | `string \| number \| readonly string[] \| undefined` | — |

- `defaultValue` — The default value of the input. Use when uncontrolled.
- `onValueChange` — Callback fired when the `value` changes. Use when controlled.
- `value` — The value of the input. Use when controlled.

## useInputPayment

```tsx
useInputPayment()
```

## usePaymentInput

```tsx
usePaymentInput()
```

## usePaymentInputContext

```tsx
usePaymentInputContext()
```

Required props are bold. Full docs: https://ui.xiod.dev/docs
