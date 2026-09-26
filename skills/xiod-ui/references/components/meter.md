# Meter

```tsx
import { Meter, MeterIndicator, MeterLabel, MeterTrack, MeterValue } from "xiod-ui/meter";
```

## Meter

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| aria-valuetext | `string \| undefined` |
| className | `string \| ((state: MeterRootState) => string \| undefined) \| undefined` |
| format | `NumberFormatOptions \| undefined` |
| getAriaValueText | `((formattedValue: string, value: number) => string) \| undefined` |
| locale | `LocalesArgument` |
| max | `number \| undefined` |
| min | `number \| undefined` |
| style | `CSSProperties \| ((state: MeterRootState) => CSSProperties \| undefined) \| undefined` |
| **value** | `number` |

- `aria-valuetext` — A string value that provides a user-friendly name for `aria-valuenow`, the current value of the meter.
- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `format` — Options to format the value.
- `getAriaValueText` — A function that returns a string value that provides a human-readable text alternative for `aria-valuenow`, the current value of the meter.
- `locale` — The locale used by `Intl.NumberFormat` when formatting the value. Defaults to the user's runtime locale.
- `max` — The maximum value
- `min` — The minimum value
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `value` — The current value.

## MeterIndicator

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: MeterIndicatorState) => string \| undefined) \| undefined` |
| style | `CSSProperties \| ((state: MeterIndicatorState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## MeterLabel

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: MeterLabelState) => string \| undefined) \| undefined` |
| style | `CSSProperties \| ((state: MeterLabelState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## MeterTrack

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: MeterTrackState) => string \| undefined) \| undefined` |
| style | `CSSProperties \| ((state: MeterTrackState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## MeterValue

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| children | `((formattedValue: string, value: number) => ReactNode) \| null \| undefined` |
| className | `string \| ((state: MeterValueState) => string \| undefined) \| undefined` |
| style | `CSSProperties \| ((state: MeterValueState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

Required props are bold. Full docs: https://ui.xiod.dev/docs
