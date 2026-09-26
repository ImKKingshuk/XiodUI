# carousel

```tsx
import { Carousel, CarouselContent, CarouselDots, CarouselItem, CarouselNext, CarouselPrevious, useCarousel, useCarouselViewport } from "xiod-ui/carousel";
```

## Carousel

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| activeIndex | `number \| undefined` | — |
| autoplay | `boolean \| undefined` | `false` |
| autoplayInterval | `number \| undefined` | `5000` |
| loop | `boolean \| undefined` | `true` |
| opts | `CarouselOptions \| undefined` | — |
| orientation | `"horizontal" \| "vertical" \| undefined` | `"horizontal"` |
| plugins | `CarouselPlugin[] \| undefined` | — |

## CarouselContent

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## CarouselDots

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## CarouselItem

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## CarouselNext

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| icon | `ReactNode` | — |
| size | `"sm" \| "default" \| "lg" \| "xs" \| "xl" \| "icon" \| "icon-lg" \| "icon-sm" \| "icon-xl" \| "icon-xs" \| null \| undefined` | `"icon-sm"` |
| variant | `"link" \| "default" \| "secondary" \| "destructive" \| "destructive-outline" \| "ghost" \| "outline" \| null \| undefined` | `"outline"` |

- `icon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.

## CarouselPrevious

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| icon | `ReactNode` | — |
| size | `"sm" \| "default" \| "lg" \| "xs" \| "xl" \| "icon" \| "icon-lg" \| "icon-sm" \| "icon-xl" \| "icon-xs" \| null \| undefined` | `"icon-sm"` |
| variant | `"link" \| "default" \| "secondary" \| "destructive" \| "destructive-outline" \| "ghost" \| "outline" \| null \| undefined` | `"outline"` |

- `icon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.

## useCarousel

```tsx
useCarousel()
```

## useCarouselViewport

```tsx
useCarouselViewport(options?, plugins?)
```

`options` — `CarouselOptions`:

| Field | Type | Default |
| :--- | :--- | :--- |
| align | `"center" \| "start" \| "end" \| undefined` | — |
| axis | `"x" \| "y" \| undefined` | — |
| containScroll | `boolean \| undefined` | — |
| dragFree | `boolean \| undefined` | — |
| loop | `boolean \| undefined` | — |
| speed | `number \| undefined` | — |

- `plugins` — `CarouselPlugin[]`

Required props are bold. Full docs: https://ui.xiod.dev/docs
