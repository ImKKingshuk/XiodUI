# Waveform

```tsx
import { useWaveform, Waveform, WaveformHandle, WaveformScrubber, WaveformVisual } from "xiod-ui/waveform";
```

## useWaveform

```tsx
useWaveform()
```

Returns `{ value: number; duration: number; onValueChange?: ((value: number) => void) | undefined; active: boolean; processing: boolean; mode: "static" | "scrolling" | "live"; barWidth: number; barGap: number; barRadius: number; barColor?: string | undefined; progressColor?: string | undefined; fadeEdges: boolean; fadeWidth: number; sensitivity: number; updateRate: number; seed: number; data?: number[] | undefined; canvasRef: RefObject<HTMLCanvasElement | null>; containerRef: RefObject<HTMLDivElement | null>; isDragging: boolean; setIsDragging: (dragging: boolean) => void; seekTo: (clientX: number) => void; liveDataRef: MutableRefObject<number[]>; needsRedrawRef: MutableRefObject<boolean>; requestDrawRef: MutableRefObject<(() => void) | null>; triggerRedraw: () => void }`.

## Waveform

Takes the DOM props of the element it renders. Pass `render` to render a different element.

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

Takes the DOM props of the element it renders. Pass `render` to render a different element.

## WaveformScrubber

Takes the DOM props of the element it renders. Pass `render` to render a different element.

## WaveformVisual

No props of its own. Takes the DOM props of the element it renders.

Required props are bold. Full docs: https://ui.xiod.dev/docs
