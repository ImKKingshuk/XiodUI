# Avatar

```tsx
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "xiod-ui/avatar";
```

## Avatar

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| className | `string \| ((state: AvatarRootState) => string \| undefined) \| undefined` | — |
| shape | `"circle" \| "square" \| null \| undefined` | `"circle"` |
| size | `"sm" \| "lg" \| "xs" \| "md" \| "xl" \| "2xl" \| null \| undefined` | `"md"` |
| style | `CSSProperties \| ((state: AvatarRootState) => CSSProperties \| undefined) \| undefined` | — |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## AvatarFallback

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: AvatarFallbackState) => string \| undefined) \| undefined` |
| delay | `number \| undefined` |
| style | `CSSProperties \| ((state: AvatarFallbackState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `delay` — How long to wait before showing the fallback. Specified in milliseconds.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

## AvatarGroup

Takes the DOM props of the element it renders. Pass `render` to render a different element.

## AvatarImage

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type |
| :--- | :--- |
| className | `string \| ((state: AvatarImageState) => string \| undefined) \| undefined` |
| keepMounted | `boolean \| undefined` |
| onLoadingStatusChange | `((status: ImageLoadingStatus) => void) \| undefined` |
| style | `CSSProperties \| ((state: AvatarImageState) => CSSProperties \| undefined) \| undefined` |

- `className` — CSS class applied to the element, or a function that returns a class based on the component's state.
- `keepMounted` — Whether the image element stays mounted and loads in place instead of being preloaded. Supports `loading="lazy"` and optimized image components such as `next/image`.
- `onLoadingStatusChange` — Callback fired when the loading status changes.
- `style` — Style applied to the element, or a function that returns a style object based on the component's state.

Required props are bold. Full docs: https://ui.xiod.dev/docs
