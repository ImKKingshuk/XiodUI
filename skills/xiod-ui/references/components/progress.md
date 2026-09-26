# Progress

```tsx
import { Progress, ProgressIndicator, ProgressLabel, ProgressTrack, ProgressValue } from "xiod-ui/progress";
```

## Progress

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| aria-valuetext | `string \| undefined` | — |
| className | `string \| ((state: ProgressRootState) => string \| undefined) \| undefined` | — |
| format | `NumberFormatOptions \| undefined` | — |
| getAriaValueText | `((formattedValue: string, value: number \| null) => string) \| undefined` | — |
| locale | `LocalesArgument` | — |
| max | `number \| undefined` | — |
| min | `number \| undefined` | — |
| size | `"sm" \| "default" \| "lg" \| "xl" \| "2xl" \| undefined` | `"default"` |
| style | `CSSProperties \| ((state: ProgressRootState) => CSSProperties \| undefined) \| undefined` | — |
| **value** | `number \| null` | — |
| variant | `"default" \| "expressive" \| undefined` | `"default"` |

- `aria-valuetext` — A string value that provides a user-friendly name for `aria-valuenow`, the current value of the progress bar.
- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `format` — Options to format the value.
- `getAriaValueText` — Accepts a function which returns a string value that provides a human-readable text alternative for the current value of the progress bar.
- `locale` — The locale used by `Intl.NumberFormat` when formatting the value. Defaults to the user's runtime locale.
- `max` — The maximum value.
- `min` — The minimum value.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `value` — The current value. The component is indeterminate when value is `null`.

## ProgressIndicator

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: ProgressIndicatorState) => string \| undefined) \| undefined` |
| style | `CSSProperties \| ((state: ProgressIndicatorState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## ProgressLabel

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: ProgressLabelState) => string \| undefined) \| undefined` |
| style | `CSSProperties \| ((state: ProgressLabelState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## ProgressTrack

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: ProgressTrackState) => string \| undefined) \| undefined` |
| style | `CSSProperties \| ((state: ProgressTrackState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## ProgressValue

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| children | `((formattedValue: string \| null, value: number \| null) => ReactNode) \| null \| undefined` |
| className | `string \| ((state: ProgressValueState) => string \| undefined) \| undefined` |
| style | `CSSProperties \| ((state: ProgressValueState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

Required props are bold. Full docs: https://ui.xiod.dev/docs
