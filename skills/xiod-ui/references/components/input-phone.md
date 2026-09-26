# InputPhone

```tsx
import { InputPhone, InputPhoneCountrySelect, InputPhoneFlag, InputPhoneInput, PhoneInput, PhoneInputCountrySelect, PhoneInputFlag, PhoneInputInput, useInputPhone, usePhoneInput } from "xiod-ui/input-phone";
```

## InputPhone

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| countries | `CountryData[] \| undefined` | `COUNTRIES` |
| defaultCountry | `string \| undefined` | `"US"` |
| defaultValue | `string \| undefined` | `""` |
| disabled | `boolean \| undefined` | — |
| name | `string \| undefined` | — |
| onChange | `((e164: string, country: CountryData, nationalNumber: string) => void) \| undefined` | — |
| readOnly | `boolean \| undefined` | — |
| size | `"sm" \| "default" \| "lg" \| null \| undefined` | `"default"` |
| value | `string \| undefined` | — |
| variant | `"default" \| "ghost" \| "filled" \| null \| undefined` | `"default"` |

- `name` — Submits the E.164 value (e.g. "+15550000000") with a form under this name.

## InputPhoneCountrySelect

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| clearIcon | `ReactNode` |
| searchIcon | `ReactNode` |
| selectedIcon | `ReactNode` |
| triggerIcon | `ReactNode` |

- `clearIcon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `searchIcon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `selectedIcon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `triggerIcon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.

## InputPhoneFlag

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| code | `string \| undefined` |

## InputPhoneInput

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| undefined` |
| clearIcon | `ReactNode` |
| defaultValue | `string \| number \| readonly string[] \| undefined` |
| nativeInput | `boolean \| undefined` |
| onValueChange | `((value: string, eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element \| undefined; }) => void) \| undefined` |
| size | `number \| "sm" \| "default" \| "lg" \| undefined` |
| style | `CSSProperties \| undefined` |
| unstyled | `boolean \| undefined` |

- `clearIcon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `defaultValue` — The default value of the input. Use when uncontrolled.
- `onValueChange` — Callback fired when the `value` changes. Use when controlled.

## PhoneInput

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| countries | `CountryData[] \| undefined` |
| defaultCountry | `string \| undefined` |
| defaultValue | `string \| undefined` |
| disabled | `boolean \| undefined` |
| name | `string \| undefined` |
| onChange | `((e164: string, country: CountryData, nationalNumber: string) => void) \| undefined` |
| readOnly | `boolean \| undefined` |
| size | `"sm" \| "default" \| "lg" \| null \| undefined` |
| value | `string \| undefined` |
| variant | `"default" \| "ghost" \| "filled" \| null \| undefined` |

- `name` — Submits the E.164 value (e.g. "+15550000000") with a form under this name.

## PhoneInputCountrySelect

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| clearIcon | `ReactNode` |
| searchIcon | `ReactNode` |
| selectedIcon | `ReactNode` |
| triggerIcon | `ReactNode` |

- `clearIcon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `searchIcon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `selectedIcon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `triggerIcon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.

## PhoneInputFlag

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| code | `string \| undefined` |

## PhoneInputInput

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| undefined` |
| clearIcon | `ReactNode` |
| defaultValue | `string \| number \| readonly string[] \| undefined` |
| nativeInput | `boolean \| undefined` |
| onValueChange | `((value: string, eventDetails: { reason: "none"; event: Event; cancel: () => void; allowPropagation: () => void; isCanceled: boolean; isPropagationAllowed: boolean; trigger: Element \| undefined; }) => void) \| undefined` |
| size | `number \| "sm" \| "default" \| "lg" \| undefined` |
| style | `CSSProperties \| undefined` |
| unstyled | `boolean \| undefined` |

- `clearIcon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `defaultValue` — The default value of the input. Use when uncontrolled.
- `onValueChange` — Callback fired when the `value` changes. Use when controlled.

## useInputPhone

```tsx
useInputPhone()
```

Returns `{ containerRef: RefObject<HTMLDivElement | null>; selectedCountry: CountryData; setSelectedCountry: (country: CountryData) => void; nationalNumber: string; setNationalNumber: (num: string) => void; e164Value: string; disabled?: boolean | undefined; readOnly?: boolean | undefined; countries: CountryData[]; onChange?: ((e164: string, country: CountryData, nationalNumber: string) => void) | undefined }`.

## usePhoneInput

```tsx
usePhoneInput()
```

Returns `{ containerRef: RefObject<HTMLDivElement | null>; selectedCountry: CountryData; setSelectedCountry: (country: CountryData) => void; nationalNumber: string; setNationalNumber: (num: string) => void; e164Value: string; disabled?: boolean | undefined; readOnly?: boolean | undefined; countries: CountryData[]; onChange?: ((e164: string, country: CountryData, nationalNumber: string) => void) | undefined }`.

Required props are bold. Full docs: https://ui.xiod.dev/docs
