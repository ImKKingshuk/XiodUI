# AgentSteps

```tsx
import { AgentStep, AgentStepIcon, AgentStepIndicator, AgentStepLabel, AgentSteps } from "xiod-ui/agent-steps";
```

## AgentStep

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| status | `"completed" \| "waiting" \| "running" \| "failed" \| undefined` | `"running"` |

## AgentStepIcon

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| icon | `AgentStepIconValue` | — |
| showSpinner | `boolean \| undefined` | `false` |

## AgentStepIndicator

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| disableShimmer | `boolean \| undefined` | `false` |
| icon | `AgentStepIconValue` | — |
| interval | `number \| undefined` | `4000` |
| label | `ReactNode` | — |
| showIcon | `boolean \| undefined` | `true` |
| showSpinner | `boolean \| undefined` | `false` |
| size | `"sm" \| "lg" \| "md" \| null \| undefined` | `"md"` |
| status | `"completed" \| "waiting" \| "running" \| "failed" \| undefined` | `"running"` |
| steps | `string[] \| AgentStepItem[] \| undefined` | — |

- `disableShimmer` — [Single-mode] Whether to disable the shimmering text sweep. Default is false.
- `icon` — [Single-mode] The icon type or XiodIcons component to show
- `interval` — [Single-mode] Transition interval for automatic cycling in milliseconds. Default is 4000.
- `label` — [Single-mode] The current active step label
- `showIcon` — [Single-mode] Whether to show the icon. Default is true.
- `showSpinner` — [Single-mode] Whether to show the spinning dashed ring. Default is false.
- `status` — [Single-mode] The status of the step. Default is "running".
- `steps` — [Single-mode] Optional array of steps to cycle through automatically

## AgentStepLabel

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| shimmer | `boolean \| undefined` | `true` |

## AgentSteps

Takes the DOM props of the element it renders. Pass `render` to render a different element.

| Prop | Type | Default |
| :--- | :--- | :--- |
| disableShimmer | `boolean \| undefined` | `false` |
| icon | `AgentStepIconValue` | — |
| interval | `number \| undefined` | `4000` |
| label | `ReactNode` | — |
| showIcon | `boolean \| undefined` | `true` |
| showSpinner | `boolean \| undefined` | `false` |
| size | `"sm" \| "lg" \| "md" \| null \| undefined` | `"md"` |
| status | `"completed" \| "waiting" \| "running" \| "failed" \| undefined` | `"running"` |
| steps | `string[] \| AgentStepItem[] \| undefined` | — |

- `disableShimmer` — [Single-mode] Whether to disable the shimmering text sweep. Default is false.
- `icon` — [Single-mode] The icon type or XiodIcons component to show
- `interval` — [Single-mode] Transition interval for automatic cycling in milliseconds. Default is 4000.
- `label` — [Single-mode] The current active step label
- `showIcon` — [Single-mode] Whether to show the icon. Default is true.
- `showSpinner` — [Single-mode] Whether to show the spinning dashed ring. Default is false.
- `status` — [Single-mode] The status of the step. Default is "running".
- `steps` — [Single-mode] Optional array of steps to cycle through automatically

Required props are bold. Full docs: https://ui.xiod.dev/docs
