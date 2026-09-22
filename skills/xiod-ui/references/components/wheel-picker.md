# wheel-picker

```tsx
import { useWheelPickerGroup, WheelPicker, WheelPickerGroup } from "xiod-ui/wheel-picker";
```

## useWheelPickerGroup

This hook accepts no arguments.

## WheelPicker

| Prop | Type | Default |
| :--- | :--- | :--- |
| classNames | `WheelPickerClassNames \| undefined` | — |
| defaultValue | `T \| undefined` | — |
| dragSensitivity | `number \| undefined` | `3` |
| infinite | `boolean \| undefined` | `false` |
| onValueChange | `((value: T) => void) \| undefined` | — |
| optionItemHeight | `number \| undefined` | — |
| **options** | `WheelPickerOption<T>[]` | — |
| scrollSensitivity | `number \| undefined` | `5` |
| size | `"sm" \| "lg" \| "md" \| null \| undefined` | `"md"` |
| value | `T \| undefined` | — |
| visibleCount | `number \| undefined` | `20` |

## WheelPickerGroup

| Prop | Type | Default |
| :--- | :--- | :--- |
| **children** | `ReactNode` | — |

Required props are bold. Full docs: https://ui.xiod.dev/docs
