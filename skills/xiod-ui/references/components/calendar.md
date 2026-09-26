# calendar

```tsx
import { Calendar } from "xiod-ui/calendar";
```

## Calendar

Supports `render={<Element />}` for composition. Inherited DOM props
remain available through the exported TypeScript type.

| Prop | Type | Default |
| :--- | :--- | :--- |
| classNames | `CalendarClassNames \| undefined` | — |
| disabled | `Matcher \| Matcher[] \| undefined` | — |
| disableOutsideDays | `boolean \| undefined` | `false` |
| fixedWeeks | `boolean \| undefined` | `true` |
| localeMonths | `string[] \| undefined` | — |
| localeMonthsShort | `string[] \| undefined` | — |
| localeWeekdays | `string[] \| undefined` | — |
| localeWeekdaysLong | `string[] \| undefined` | — |
| maxDate | `Date \| undefined` | — |
| minDate | `Date \| undefined` | — |
| mode | `CalendarMode \| undefined` | `"single"` |
| modifiers | `Record<string, Matcher \| Matcher[]> \| undefined` | — |
| modifiersClassNames | `Record<string, string> \| undefined` | — |
| nextIcon | `ReactNode` | — |
| numberOfMonths | `number \| undefined` | `1` |
| onSelect | `((date: Date \| DateRange \| undefined) => void) \| undefined` | — |
| prevIcon | `ReactNode` | — |
| selected | `Date \| DateRange \| null \| undefined` | — |
| showOutsideDays | `boolean \| undefined` | `true` |
| weekStartsOn | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| undefined` | `0` |

- `nextIcon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.
- `prevIcon` — Replaces this icon. Accepts any node; `null` renders no icon. Takes precedence over `IconProvider`.

Required props are bold. Full docs: https://ui.xiod.dev/docs
