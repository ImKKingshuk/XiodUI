# input-phone

```tsx
import { InputPhone, InputPhoneCountrySelect, InputPhoneFlag, InputPhoneInput, PhoneInput, PhoneInputCountrySelect, PhoneInputFlag, PhoneInputInput, useInputPhone, usePhoneInput } from "xiod-ui/input-phone";
```

## InputPhone

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| countries | `CountryData[] \| undefined` | `COUNTRIES` |
| defaultCountry | `string \| undefined` | `"US"` |
| defaultValue | `string \| undefined` | `""` |
| disabled | `boolean \| undefined` | — |
| onChange | `((e164: string, country: CountryData, nationalNumber: string) => void) \| undefined` | — |
| readOnly | `boolean \| undefined` | — |
| size | `"sm" \| "default" \| "lg" \| null \| undefined` | `"default"` |
| value | `string \| undefined` | — |
| variant | `"default" \| "ghost" \| "filled" \| null \| undefined` | `"default"` |

## InputPhoneCountrySelect

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## InputPhoneFlag

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| code | `string \| undefined` | — |

## InputPhoneInput

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| undefined` | — |
| defaultValue | `string \| number \| readonly string[] \| undefined` | — |
| nativeInput | `boolean \| undefined` | — |
| onValueChange | `((value: string, eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element \| undefined; }) => void) \| undefined` | — |
| size | `number \| "sm" \| "default" \| "lg" \| undefined` | — |
| style | `CSSProperties \| undefined` | — |
| unstyled | `boolean \| undefined` | — |

- `defaultValue` — The default value of the input. Use when uncontrolled.
- `onValueChange` — Callback fired when the `value` changes. Use when controlled.

## PhoneInput

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| countries | `CountryData[] \| undefined` | — |
| defaultCountry | `string \| undefined` | — |
| defaultValue | `string \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| onChange | `((e164: string, country: CountryData, nationalNumber: string) => void) \| undefined` | — |
| readOnly | `boolean \| undefined` | — |
| size | `"sm" \| "default" \| "lg" \| null \| undefined` | — |
| value | `string \| undefined` | — |
| variant | `"default" \| "ghost" \| "filled" \| null \| undefined` | — |

## PhoneInputCountrySelect

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## PhoneInputFlag

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| code | `string \| undefined` | — |

## PhoneInputInput

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| undefined` | — |
| defaultValue | `string \| number \| readonly string[] \| undefined` | — |
| nativeInput | `boolean \| undefined` | — |
| onValueChange | `((value: string, eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element \| undefined; }) => void) \| undefined` | — |
| size | `number \| "sm" \| "default" \| "lg" \| undefined` | — |
| style | `CSSProperties \| undefined` | — |
| unstyled | `boolean \| undefined` | — |

- `defaultValue` — The default value of the input. Use when uncontrolled.
- `onValueChange` — Callback fired when the `value` changes. Use when controlled.

## useInputPhone

```tsx
useInputPhone()
```

## usePhoneInput

```tsx
usePhoneInput()
```

Required props are bold. Full docs: https://ui.xiod.dev/docs
