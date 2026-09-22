# copy-to-clipboard

```tsx
import { CopyToClipboard } from "xiod-ui/copy-to-clipboard";
```

## CopyToClipboard

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| copiedText | `string \| undefined` | `"Copied!"` |
| disableTooltip | `boolean \| undefined` | `false` |
| size | `"sm" \| "default" \| "lg" \| null \| undefined` | `"default"` |
| **text** | `string` | — |
| textToCopy | `string \| undefined` | — |
| tooltipText | `string \| undefined` | `"Copy"` |

- `copiedText` — Text shown in the toast after copying.
- `disableTooltip` — Disable the tooltip entirely.
- `text` — The text to display in the field
- `textToCopy` — If provided, this text will be copied to clipboard instead of the `text` prop.
- `tooltipText` — Text shown in the tooltip on hover.

Required props are bold. Full docs: https://ui.xiod.dev/docs
