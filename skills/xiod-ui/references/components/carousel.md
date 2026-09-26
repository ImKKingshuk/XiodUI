# Carousel

```tsx
import { Carousel, CarouselContent, CarouselDots, CarouselItem, CarouselNext, CarouselPrevious, useCarousel, useCarouselViewport } from "xiod-ui/carousel";
```

## Carousel

Renders a `<div>` and takes its props. Pass `render` to render a different element.

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

Renders a `<div>` and takes its props. Pass `render` to render a different element.

## CarouselDots

Renders a `<div>` and takes its props. Pass `render` to render a different element.

## CarouselItem

Renders a `<div>` and takes its props. Pass `render` to render a different element.

## CarouselNext

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| icon | `ReactNode` | — |
| size | `"sm" \| "default" \| "lg" \| "xs" \| "xl" \| "icon" \| "icon-lg" \| "icon-sm" \| "icon-xl" \| "icon-xs" \| null \| undefined` | `"icon-sm"` |
| variant | `"link" \| "default" \| "secondary" \| "destructive" \| "destructive-outline" \| "ghost" \| "outline" \| null \| undefined` | `"outline"` |

- `icon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.

## CarouselPrevious

Takes the DOM props of the element it renders. Pass `render` to render a different element.

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

Returns `{ carouselRef: (node: HTMLElement | null) => void; api: CarouselApi | undefined; scrollPrev: () => void; scrollNext: () => void; canScrollPrev: boolean; canScrollNext: boolean; orientation: "horizontal" | "vertical"; autoplay?: boolean | undefined; autoplayInterval?: number | undefined; loop?: boolean | undefined; activeIndex?: number | undefined }`.

## useCarouselViewport

```tsx
useCarouselViewport(options?, plugins?)
```

Returns `UseCarouselViewport`.

`options` — `CarouselOptions`:

| Field | Type |
| :--- | :--- |
| align | `"center" \| "start" \| "end" \| undefined` |
| axis | `"x" \| "y" \| undefined` |
| containScroll | `boolean \| undefined` |
| dragFree | `boolean \| undefined` |
| loop | `boolean \| undefined` |
| speed | `number \| undefined` |

- `plugins` — `CarouselPlugin[]`

Required props are bold. Full docs: https://ui.xiod.dev/docs
