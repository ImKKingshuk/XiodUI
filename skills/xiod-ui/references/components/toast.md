# Toast

```tsx
import { anchoredToastManager, AnchoredToastProvider, toastManager, ToastProvider } from "xiod-ui/toast";
```

## anchoredToastManager

An object, not a component. Its methods work from anywhere in client
code, even outside React, while the component that renders the toasts
is mounted.

Methods: `add`, `close`, `promise`, `update`.

## AnchoredToastProvider

| Prop | Type | Default |
| :--- | :--- | :--- |
| children | `ReactNode` | — |
| closeButton | `boolean \| undefined` | `false` |
| closeIcon | `ReactNode` | — |
| limit | `number \| undefined` | — |
| timeout | `number \| undefined` | — |
| toastManager | `ToastManager<any> \| undefined` | — |

- `closeIcon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `limit` — The maximum number of toasts that can be displayed at once. When the limit is exceeded, the oldest toasts are marked as `limited` (via the `data-limited` attribute) rather than removed, so they can be hidden or animated out.
- `timeout` — The default amount of time (in ms) before a toast is auto dismissed. A value of `0` will prevent the toast from being dismissed automatically.
- `toastManager` — A global manager for toasts to use outside of a React component.

## toastManager

An object, not a component. Its methods work from anywhere in client
code, even outside React, while the component that renders the toasts
is mounted.

Methods: `add`, `close`, `promise`, `update`.

## ToastProvider

| Prop | Type | Default |
| :--- | :--- | :--- |
| children | `ReactNode` | — |
| closeButton | `boolean \| undefined` | `false` |
| closeIcon | `ReactNode` | — |
| limit | `number \| undefined` | — |
| position | `ToastPosition \| undefined` | `"bottom-right"` |
| timeout | `number \| undefined` | — |
| toastManager | `ToastManager<any> \| undefined` | — |

- `closeIcon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `limit` — The maximum number of toasts that can be displayed at once. When the limit is exceeded, the oldest toasts are marked as `limited` (via the `data-limited` attribute) rather than removed, so they can be hidden or animated out.
- `timeout` — The default amount of time (in ms) before a toast is auto dismissed. A value of `0` will prevent the toast from being dismissed automatically.
- `toastManager` — A global manager for toasts to use outside of a React component.

Required props are bold. Full docs: https://ui.xiod.dev/docs
