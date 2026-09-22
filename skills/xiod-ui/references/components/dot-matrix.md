# dot-matrix

```tsx
import { DotMatrix } from "xiod-ui/dot-matrix";
```

## DotMatrix

| Prop | Type | Default |
| :--- | :--- | :--- |
| ariaLabel | `string \| undefined` | `"Dot matrix loader"` |
| autoplay | `boolean \| undefined` | `true` |
| bloom | `boolean \| undefined` | `true` |
| bloomIntensity | `number \| undefined` | `1.8` |
| color | `string \| undefined` | `"currentColor"` |
| colorOff | `string \| undefined` | `"var(--muted-foreground)"` |
| colorPreset | `DotMatrixColorPreset \| undefined` | `"solid"` |
| cols | `number \| undefined` | `5` |
| dotSize | `number \| undefined` | `8` |
| fps | `number \| undefined` | `12` |
| frames | `number[][][] \| undefined` | — |
| gap | `number \| undefined` | `3` |
| halo | `boolean \| undefined` | `false` |
| isPlaying | `boolean \| undefined` | `true` |
| levels | `number[] \| undefined` | — |
| loop | `boolean \| undefined` | `true` |
| mode | `"animation" \| "static" \| "vu" \| undefined` | `"animation"` |
| onFrame | `((index: number) => void) \| undefined` | — |
| pattern | `number[][] \| boolean[][] \| undefined` | — |
| preset | `DotMatrixPreset \| undefined` | `"ripple"` |
| rows | `number \| undefined` | `5` |
| shape | `DotMatrixShape \| undefined` | `"circle"` |
| speed | `number \| undefined` | `1` |

Required props are bold. Full docs: https://ui.xiod.dev/docs
