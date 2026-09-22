# waveform

```tsx
import { useWaveform, Waveform, WaveformHandle, WaveformScrubber, WaveformVisual } from "xiod-ui/waveform";
```

## useWaveform

```tsx
useWaveform()
```

## Waveform

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| active | `boolean \| undefined` | `false` |
| barColor | `string \| undefined` | — |
| barGap | `number \| undefined` | `2` |
| barRadius | `number \| undefined` | `1.5` |
| barWidth | `number \| undefined` | `3` |
| data | `number[] \| undefined` | — |
| defaultValue | `number \| undefined` | — |
| deviceId | `string \| undefined` | — |
| duration | `number \| undefined` | `1` |
| fadeEdges | `boolean \| undefined` | `true` |
| fadeWidth | `number \| undefined` | `24` |
| microphone | `boolean \| undefined` | `false` |
| mode | `"static" \| "scrolling" \| "live" \| undefined` | `"static"` |
| onValueChange | `((value: number) => void) \| undefined` | — |
| processing | `boolean \| undefined` | `false` |
| progressColor | `string \| undefined` | — |
| seed | `number \| undefined` | `42` |
| sensitivity | `number \| undefined` | `1` |
| updateRate | `number \| undefined` | `30` |
| value | `number \| undefined` | — |

## WaveformHandle

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## WaveformScrubber

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## WaveformVisual

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

Required props are bold. Full docs: https://ui.xiod.dev/docs
