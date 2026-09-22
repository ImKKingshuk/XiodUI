# slider

```tsx
import { Slider, SliderValue } from "xiod-ui/slider";
```

## Slider

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: SliderRootState) => string \| undefined) \| undefined` | — |
| defaultValue | `number \| readonly number[] \| undefined` | — |
| disabled | `boolean \| undefined` | — |
| form | `string \| undefined` | — |
| format | `NumberFormatOptions \| undefined` | — |
| largeStep | `number \| undefined` | — |
| locale | `LocalesArgument` | — |
| max | `number \| undefined` | `100` |
| min | `number \| undefined` | `0` |
| minStepsBetweenValues | `number \| undefined` | — |
| name | `string \| undefined` | — |
| onValueChange | `((value: number \| readonly number[], eventDetails: SliderRootChangeEventDetails) => void) \| undefined` | — |
| onValueCommitted | `((value: number \| readonly number[], eventDetails: SliderRootCommitEventDetails) => void) \| undefined` | — |
| orientation | `Orientation \| undefined` | `"horizontal"` |
| step | `number \| undefined` | — |
| style | `CSSProperties \| ((state: SliderRootState) => CSSProperties \| undefined) \| undefined` | — |
| thumbAlignment | `"center" \| "edge" \| "edge-client-only" \| undefined` | — |
| thumbCollisionBehavior | `"none" \| "push" \| "swap" \| undefined` | — |
| value | `number \| readonly number[] \| undefined` | — |
| variant | `"default" \| "expressive" \| "classic" \| "fader" \| "segmented" \| "dotted" \| null \| undefined` | `"default"` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `defaultValue` — The uncontrolled value of the slider when it's initially rendered. To render a controlled slider, use the `value` prop instead.
- `disabled` — Whether the slider should ignore user interaction.
- `form` — Identifies the form that owns the slider inputs. Useful when the slider is rendered outside the form.
- `format` — Options to format the value.
- `largeStep` — The granularity with which the slider can step through values when using Page Up/Page Down or Shift + Arrow Up/Arrow Down.
- `locale` — The locale used by `Intl.NumberFormat` when formatting the value. Defaults to the user's runtime locale.
- `max` — The maximum allowed value of the slider. Should not be equal to min.
- `min` — The minimum allowed value of the slider. Should not be equal to max.
- `minStepsBetweenValues` — The minimum steps between values in a range slider.
- `name` — Identifies the field when a form is submitted.
- `onValueChange` — Callback function that is fired when the slider's value changed. Receives the new value as the first argument; the originating event is available as `eventDetails.event`. The value is also reflected on `eventDetails.event.target.value` for form integration. The `eventDetails.reason` indicates what triggered the change: - `'input-change'` when the hidden range input emits a change event (for example, via form integration) - `'track-press'` when the control track is pressed - `'drag'` while dragging a thumb - `'keyboard'` for keyboard input - `'none'` when the change is triggered without a specific interaction
- `onValueCommitted` — Callback function that is fired when a value change is committed. Does not fire if the value did not change, or if the change was canceled. **Warning**: This is a generic event, not a change event. The `eventDetails.reason` indicates what triggered the commit: - `'drag'` while dragging a thumb - `'track-press'` when the control track is pressed - `'keyboard'` for keyboard input - `'input-change'` when the hidden range input emits a change event (for example, via form integration) - `'none'` when the commit occurs without a specific interaction
- `orientation` — The component orientation.
- `step` — The granularity with which the slider can step through values. (A "discrete" slider.) The `min` prop serves as the origin for the valid values. We recommend (max - min) to be evenly divisible by the step.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.
- `thumbAlignment` — How the thumb(s) are aligned relative to `Slider.Control` when the value is at `min` or `max`: - `center`: The center of the thumb is aligned with the control edge - `edge`: The thumb is inset within the control such that its edge is aligned with the control edge - `edge-client-only`: Same as `edge` but renders after React hydration on the client, reducing bundle size in return
- `thumbCollisionBehavior` — Controls how thumbs behave when they collide during pointer interactions. - `'push'` (default): Thumbs push each other without restoring their previous positions when dragged back. - `'swap'`: Thumbs swap places when dragged past each other. - `'none'`: Thumbs cannot move past each other; excess movement is ignored.
- `value` — The value of the slider. For range sliders, provide an array with one value per thumb.

## SliderValue

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| children | `((formattedValues: readonly string[], values: readonly number[]) => ReactNode) \| null \| undefined` | — |
| className | `string \| ((state: SliderValueState) => string \| undefined) \| undefined` | — |
| style | `CSSProperties \| ((state: SliderValueState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

Required props are bold. Full docs: https://ui.xiod.dev/docs
