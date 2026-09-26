# IconProvider

```tsx
import { IconProvider, IconSlot, useIcon, useIconOverrides } from "xiod-ui/icon-provider";
```

## IconProvider

Replaces XiodUI's default icons for everything rendered inside it.

```tsx
import { IconProvider } from "xiod-ui/icon-provider";
import { X, Check } from "your-icon-library";

<IconProvider icons={{ Cancel: X, Check }}>
  <App />
</IconProvider>
```

Providers nest: an inner one is merged over the outer one, so a section of
the app can override a single icon without restating the rest.

| Prop | Type |
| :--- | :--- |
| children | `ReactNode` |
| **icons** | `Partial<Record<IconName, IconComponent>>` |

- `icons` — Icons to use in place of the built-in ones, keyed by `IconName`. Any name left out keeps its default, so pass only what you want to change.

## IconSlot

Renders one icon, honouring both ways of replacing it: the `icon` prop first,
then an `IconProvider`, then `fallback`.

Prefer `IconProvider` or a component's icon prop. Reach for `IconSlot`
directly only when building a component of your own that should pick up the
same overrides.

A node passed as `icon` renders exactly as given, so give it its own size
classes. A component resolved from the provider or from `fallback` receives
the remaining props, sizing included.

| Prop | Type |
| :--- | :--- |
| **fallback** | `IconComponent` |
| icon | `ReactNode` |
| **name** | `IconName` |

- `fallback` — The icon to render when nothing replaces it.
- `icon` — Replaces this icon. Accepts any node — an element from another icon library, a raw `<svg>`, or `null` to render nothing. Takes precedence over `IconProvider`.
- `name` — Which icon this is. `IconProvider` matches its keys against this.

## useIcon

Returns the icon to render for `name` — the one an `IconProvider` supplies,
or `fallback` when none does. Use this to give a custom component the same
icon overrides the library's own components respect.

```tsx
useIcon(name, fallback)
```

Returns `ComponentClass<SVGProps<SVGSVGElement>, any> | FunctionComponent<SVGProps<SVGSVGElement>>`.

- `name` — `IconName`
- `fallback` — `IconComponent`

## useIconOverrides

Returns the icons in effect at this point in the tree, or `null` when no
`IconProvider` wraps it. Use `useIcon` to resolve a single icon.

```tsx
useIconOverrides()
```

Returns `null | Partial<Record<IconName, IconComponent>>`.

Required props are bold. Full docs: https://ui.xiod.dev/docs
