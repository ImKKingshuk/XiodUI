# avatar

```tsx
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "xiod-ui/avatar";
```

## Avatar

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: AvatarRootState) => string \| undefined) \| undefined` | — |
| shape | `"circle" \| "square" \| null \| undefined` | `"circle"` |
| size | `"sm" \| "lg" \| "xs" \| "md" \| "xl" \| "2xl" \| null \| undefined` | `"md"` |
| style | `CSSProperties \| ((state: AvatarRootState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## AvatarFallback

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: AvatarFallbackState) => string \| undefined) \| undefined` | — |
| delay | `number \| undefined` | — |
| style | `CSSProperties \| ((state: AvatarFallbackState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `delay` — How long to wait before showing the fallback. Specified in milliseconds.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## AvatarGroup

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## AvatarImage

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: AvatarImageState) => string \| undefined) \| undefined` | — |
| keepMounted | `boolean \| undefined` | — |
| onLoadingStatusChange | `((status: ImageLoadingStatus) => void) \| undefined` | — |
| style | `CSSProperties \| ((state: AvatarImageState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `keepMounted` — Whether the image element stays mounted and loads in place instead of being preloaded. Supports `loading="lazy"` and optimized image components such as `next/image`.
- `onLoadingStatusChange` — Callback fired when the loading status changes.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

Required props are bold. Full docs: https://ui.xiod.dev/docs
