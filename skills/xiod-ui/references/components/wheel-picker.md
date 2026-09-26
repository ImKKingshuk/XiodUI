# WheelPicker

```tsx
import { useWheelPickerGroup, WheelPicker, WheelPickerGroup } from "xiod-ui/wheel-picker";
```

## useWheelPickerGroup

```tsx
useWheelPickerGroup()
```

Returns `null | { activeIndex: number; setActiveIndex: (index: number) => void; register: (existingIndex: number | null, ref: HTMLDivElement) => number; getPickerRef: (index: number) => HTMLDivElement | null; getPickerIndices: () => number[] }`.

## WheelPicker

Takes the DOM props of the element it renders. Pass `render` to render a different element.

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

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| children | `ReactNode` |

Required props are bold. Full docs: https://ui.xiod.dev/docs
