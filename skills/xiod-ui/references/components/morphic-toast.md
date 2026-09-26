# MorphicToast

```tsx
import { morphicToast, MorphicToaster } from "xiod-ui/morphic-toast";
```

## morphicToast

An object, not a component. Its methods work from anywhere in client
code, even outside React, while the component that renders the toasts
is mounted.

Methods: `action`, `clear`, `dismiss`, `error`, `info`, `promise`, `show`, `success`, `warning`.

## MorphicToaster

| Prop | Type | Default |
| :--- | :--- | :--- |
| children | `ReactNode` | — |
| offset | `MorphicToastOffsetValue \| Partial<Record<"top" \| "bottom" \| "left" \| "right", MorphicToastOffsetValue>> \| undefined` | — |
| options | `Partial<MorphicToastOptions> \| undefined` | — |
| position | `MorphicToastPosition \| undefined` | `"top-right"` |

Required props are bold. Full docs: https://ui.xiod.dev/docs
