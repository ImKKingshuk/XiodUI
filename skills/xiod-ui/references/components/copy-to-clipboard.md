# copy-to-clipboard

```tsx
import { CopyToClipboard } from "xiod-ui/copy-to-clipboard";
```

## CopyToClipboard

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| copiedIcon | `ReactNode` | — |
| copiedText | `string \| undefined` | `"Copied!"` |
| copyIcon | `ReactNode` | — |
| disableTooltip | `boolean \| undefined` | `false` |
| size | `"sm" \| "default" \| "lg" \| null \| undefined` | `"default"` |
| **text** | `string` | — |
| textToCopy | `string \| undefined` | — |
| tooltipText | `string \| undefined` | `"Copy"` |

- `copiedIcon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `copiedText` — Text shown in the toast after copying.
- `copyIcon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `disableTooltip` — Disable the tooltip entirely.
- `text` — The text to display in the field
- `textToCopy` — If provided, this text will be copied to clipboard instead of the `text` prop.
- `tooltipText` — Text shown in the tooltip on hover.

Required props are bold. Full docs: https://ui.xiod.dev/docs
