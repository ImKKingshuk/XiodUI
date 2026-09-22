# carousel

```tsx
import { Carousel, CarouselContent, CarouselDots, CarouselItem, CarouselNext, CarouselPrevious, useCarousel, useEmblaCarousel } from "xiod-ui/carousel";
```

## Carousel

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

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## CarouselDots

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## CarouselItem

No XiodUI-specific props were detected. Refer to the exported
TypeScript type for inherited element or primitive props.

## CarouselNext

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| size | `"sm" \| "default" \| "lg" \| "xs" \| "xl" \| "icon" \| "icon-lg" \| "icon-sm" \| "icon-xl" \| "icon-xs" \| null \| undefined` | `"icon-sm"` |
| variant | `"link" \| "default" \| "secondary" \| "destructive" \| "destructive-outline" \| "ghost" \| "outline" \| null \| undefined` | `"outline"` |

## CarouselPrevious

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| size | `"sm" \| "default" \| "lg" \| "xs" \| "xl" \| "icon" \| "icon-lg" \| "icon-sm" \| "icon-xl" \| "icon-xs" \| null \| undefined` | `"icon-sm"` |
| variant | `"link" \| "default" \| "secondary" \| "destructive" \| "destructive-outline" \| "ghost" \| "outline" \| null \| undefined` | `"outline"` |

## useCarousel

This hook accepts no arguments.

## useEmblaCarousel

| Prop | Type | Default |
| :--- | :--- | :--- |
| align | `"center" \| "start" \| "end" \| undefined` | — |
| axis | `"x" \| "y" \| undefined` | — |
| containScroll | `boolean \| undefined` | — |
| dragFree | `boolean \| undefined` | — |
| loop | `boolean \| undefined` | — |
| speed | `number \| undefined` | — |

Required props are bold. Full docs: https://ui.xiod.dev/docs
