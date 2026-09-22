# calendar

```tsx
import { Calendar } from "xiod-ui/calendar";
```

## Calendar

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
| numberOfMonths | `number \| undefined` | `1` |
| onSelect | `((date: Date \| DateRange \| undefined) => void) \| undefined` | — |
| selected | `Date \| DateRange \| null \| undefined` | — |
| showOutsideDays | `boolean \| undefined` | `true` |
| weekStartsOn | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| undefined` | `0` |

Required props are bold. Full docs: https://ui.xiod.dev/docs
