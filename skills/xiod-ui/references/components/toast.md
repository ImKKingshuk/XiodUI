# toast

```tsx
import { anchoredToastManager, AnchoredToastProvider, toastManager, ToastProvider } from "xiod-ui/toast";
```

## anchoredToastManager

Imperative manager export; it is not a React component.

## AnchoredToastProvider

| Prop | Type | Default |
| :--- | :--- | :--- |
| children | `ReactNode` | — |
| closeButton | `boolean \| undefined` | `false` |
| limit | `number \| undefined` | — |
| timeout | `number \| undefined` | — |
| toastManager | `ToastManager<any> \| undefined` | — |

- `limit` — The maximum number of toasts that can be displayed at once. When the limit is exceeded, the oldest toasts are marked as `limited` (via the `data-limited` attribute) rather than removed, so they can be hidden or animated out.
- `timeout` — The default amount of time (in ms) before a toast is auto dismissed. A value of `0` will prevent the toast from being dismissed automatically.
- `toastManager` — A global manager for toasts to use outside of a React component.

## toastManager

Imperative manager export; it is not a React component.

## ToastProvider

| Prop | Type | Default |
| :--- | :--- | :--- |
| children | `ReactNode` | — |
| closeButton | `boolean \| undefined` | `false` |
| limit | `number \| undefined` | — |
| position | `ToastPosition \| undefined` | `"bottom-right"` |
| timeout | `number \| undefined` | — |
| toastManager | `ToastManager<any> \| undefined` | — |

- `limit` — The maximum number of toasts that can be displayed at once. When the limit is exceeded, the oldest toasts are marked as `limited` (via the `data-limited` attribute) rather than removed, so they can be hidden or animated out.
- `timeout` — The default amount of time (in ms) before a toast is auto dismissed. A value of `0` will prevent the toast from being dismissed automatically.
- `toastManager` — A global manager for toasts to use outside of a React component.

Required props are bold. Full docs: https://ui.xiod.dev/docs
