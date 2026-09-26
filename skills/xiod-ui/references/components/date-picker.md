# date-picker

```tsx
import { DatePicker } from "xiod-ui/date-picker";
```

## DatePicker

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| defaultValue | `Date \| DateRange \| undefined` | — |
| disabled | `boolean \| Date \| Date[] \| ((date: Date) => boolean) \| undefined` | — |
| disableOutsideDays | `boolean \| undefined` | `false` |
| fixedWeeks | `boolean \| undefined` | `true` |
| formatStr | `"PPP" \| "LLL dd, y" \| "yyyy-MM-dd" \| undefined` | `"PPP"` |
| icon | `ReactNode` | — |
| maxDate | `Date \| undefined` | — |
| minDate | `Date \| undefined` | — |
| mode | `"single" \| "range" \| undefined` | `"single"` |
| numberOfMonths | `number \| undefined` | `1` |
| onSelect | `((value: Date \| DateRange \| undefined) => void) \| undefined` | — |
| placeholder | `string \| undefined` | — |
| showOutsideDays | `boolean \| undefined` | `true` |
| triggerClassName | `string \| undefined` | — |
| triggerSize | `"sm" \| "default" \| "lg" \| "xs" \| undefined` | `"default"` |
| triggerType | `"button" \| "input" \| undefined` | `"button"` |
| triggerVariant | `"default" \| "secondary" \| "ghost" \| "outline" \| undefined` | `"outline"` |
| value | `Date \| DateRange \| undefined` | — |
| weekStartsOn | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| undefined` | `0` |

- `icon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.

Required props are bold. Full docs: https://ui.xiod.dev/docs
