# color-picker

```tsx
import { BlossomColorPicker, ColorPicker } from "xiod-ui/color-picker";
```

## BlossomColorPicker

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| adaptivePositioning | `boolean \| undefined` | `true` |
| animationDuration | `number \| undefined` | `300` |
| circularBarWidth | `number \| undefined` | `BAR_WIDTH` |
| collapsible | `boolean \| undefined` | `true` |
| colors | `ColorInput[] \| undefined` | — |
| coreSize | `number \| undefined` | `32` |
| defaultValue | `BlossomColorPickerValue \| undefined` | — |
| disabled | `boolean \| undefined` | `false` |
| initialExpanded | `boolean \| undefined` | `false` |
| onChange | `((color: BlossomColorPickerColor) => void) \| undefined` | — |
| onCollapse | `((color: BlossomColorPickerColor) => void) \| undefined` | — |
| openOnHover | `boolean \| undefined` | `false` |
| petalSize | `number \| undefined` | `32` |
| showAlphaSlider | `boolean \| undefined` | `true` |
| showCoreColor | `boolean \| undefined` | `true` |
| showOpacitySlider | `boolean \| undefined` | `true` |
| sliderOffset | `number \| undefined` | `SLIDER_OFFSET` |
| sliderPosition | `SliderPosition \| undefined` | — |
| sliderWidth | `number \| undefined` | `BAR_WIDTH` |
| value | `BlossomColorPickerValue \| undefined` | — |

## ColorPicker

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| adaptivePositioning | `boolean \| undefined` | `true` |
| animationDuration | `number \| undefined` | `300` |
| circularBarWidth | `number \| undefined` | `BAR_WIDTH` |
| className | `string \| undefined` | — |
| collapsible | `boolean \| undefined` | `false` |
| colors | `ColorInput[] \| undefined` | — |
| coreSize | `number \| undefined` | `36` |
| darkMode | `boolean \| undefined` | — |
| defaultValue | `BlossomColorPickerValue \| undefined` | — |
| disabled | `boolean \| undefined` | `false` |
| initialExpanded | `boolean \| undefined` | `true` |
| onChange | `((color: BlossomColorPickerColor) => void) \| undefined` | — |
| onCollapse | `((color: BlossomColorPickerColor) => void) \| undefined` | — |
| openOnHover | `boolean \| undefined` | `false` |
| petalSize | `number \| undefined` | `32` |
| showAlphaSlider | `boolean \| undefined` | `true` |
| showCoreColor | `boolean \| undefined` | `true` |
| showOpacitySlider | `boolean \| undefined` | — |
| sliderOffset | `number \| undefined` | `SLIDER_OFFSET` |
| sliderPosition | `SliderPosition \| undefined` | — |
| sliderWidth | `number \| undefined` | `BAR_WIDTH` |
| value | `BlossomColorPickerValue \| undefined` | — |

Required props are bold. Full docs: https://ui.xiod.dev/docs
