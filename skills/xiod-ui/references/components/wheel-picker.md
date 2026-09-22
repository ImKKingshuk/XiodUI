# wheel-picker

```tsx
import { useWheelPickerGroup, WheelPicker, WheelPickerGroup } from "xiod-ui/wheel-picker";
```

## useWheelPickerGroup

```tsx
useWheelPickerGroup()
```

## WheelPicker

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

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

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| children | `ReactNode` | — |

Required props are bold. Full docs: https://ui.xiod.dev/docs
