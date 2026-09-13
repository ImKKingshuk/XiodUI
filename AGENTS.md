# XiodUI — Component Authoring Guide (AGENTS.md)

> **This document is the single source of truth for any AI agent creating, editing, or extending components in the XiodUI design system.**
> Study every section. Follow every rule. Deviation breaks visual and behavioural consistency.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Tech Stack & Key Dependencies](#2-tech-stack--key-dependencies)
3. [File Structure & Naming](#3-file-structure--naming)
4. [Component Authoring Patterns](#4-component-authoring-patterns)
5. [Styling System](#5-styling-system)
6. [CVA (class-variance-authority) Variant System](#6-cva-class-variance-authority-variant-system)
7. [Dynamic CSS — calc(), Custom Properties & Computed Values](#7-dynamic-css--calc-custom-properties--computed-values)
8. [The `data-slot` Convention](#8-the-data-slot-convention)
9. [Responsive Design](#9-responsive-design)
10. [Touch & Pointer-Coarse Targets](#10-touch--pointer-coarse-targets)
11. [Dark Mode Strategy](#11-dark-mode-strategy)
12. [Tactile Depth System (Shadow & Before-Pseudo Layering)](#12-tactile-depth-system-shadow--before-pseudo-layering)
13. [Animations & Transitions](#13-animations--transitions)
14. [Focus, Validation & Disabled States](#14-focus-validation--disabled-states)
15. [Accessibility](#15-accessibility)
16. [Polymorphic Rendering — `useRender` + `mergeProps`](#16-polymorphic-rendering--userender--mergeprops)
17. [Overlay & Floating Components](#17-overlay--floating-components)
18. [Icon Handling](#18-icon-handling)
19. [Exports & Backward-Compatible Aliases](#19-exports--backward-compatible-aliases)
20. [Edge Cases & Anti-Patterns](#20-edge-cases--anti-patterns)
21. [Project Registration Workflow](#21-project-registration-workflow)
22. [Base UI Primitives Reference](#22-base-ui-primitives-reference)
23. [Component Composition & Nesting](#23-component-composition--nesting)
24. [React 19 & TypeScript Conventions](#24-react-19--typescript-conventions)
25. [RTL & Direction Support](#25-rtl--direction-support)
26. [Quality Gates: Linting, Formatting & Testing](#26-quality-gates-linting-formatting--testing)
27. [Pattern Selection Guide](#27-pattern-selection-guide)
28. [Base UI Event System & State Customization](#28-base-ui-event-system--state-customization)
29. [Platform & Environment Notes](#29-platform--environment-notes)
30. [Checklist — Before Submitting a New Component](#30-checklist--before-submitting-a-new-component)
31. [Reference: Existing Component Catalog](#31-reference-existing-component-catalog)

---

## 1. Architecture Overview

XiodUI is a **headless-first, styled component library** built on top of **Base UI React** primitives. Components wrap Base UI primitives with opinionated styling via **Tailwind CSS v4**. Variants are managed through **CVA** when a component has multiple visual modes.

```
┌─────────────────────────────────────────────┐
│               Consumer Code                  │
├─────────────────────────────────────────────┤
│          XiodUI Styled Components            │
│   (This layer — cn(), CVA, data-slot)        │
├─────────────────────────────────────────────┤
│          @base-ui/react Primitives           │
│   (Headless behaviour, ARIA, state mgmt)     │
├─────────────────────────────────────────────┤
│              React 19 / Next.js              │
└─────────────────────────────────────────────┘
```

**Core philosophy:**

- Base UI handles **behaviour, accessibility, state**
- XiodUI handles **styling, layout, visual polish**
- Consumers get **zero-config beauty** with full override power

---

## 2. Tech Stack & Key Dependencies

| Dependency                       | Purpose                                                            |
| -------------------------------- | ------------------------------------------------------------------ |
| `@base-ui/react`                 | Headless primitives (Accordion, Dialog, Select, etc.)              |
| `class-variance-authority` (CVA) | Variant-based className composition                                |
| `cn`                             | High-performance class name merging via `cn()` utility             |
| `xiod-icons`                     | Icon library (use static per-icon imports; never mix icon sets)    |
| Tailwind CSS v4                  | Utility-first styling with `@theme`, `@utility`, `@custom-variant` |

### The `cn()` Utility

We use `cn` for zero-overhead, high-performance Tailwind CSS class name merging.

```ts
import { cn } from "cn";
```

**Every** className composition **must** use `cn()`. Never use raw string concatenation.

---

## 3. File Structure & Naming

This repository is the **published npm package** (`xiod-ui`). The documentation
site lives in a separate, private repository.

```
src/
  styles.css           # design tokens + Tailwind @theme mappings (shipped)
  components/
    accordion.tsx      # kebab-case filename
    alert-dialog.tsx   # multi-word → kebab-case
    input-group.tsx
    ...
  hooks/
    use-media-query.ts
    use-copy-to-clipboard.ts
```

### Rules

| Rule                     | Convention                                                                                                                                                                                      |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Filename**             | `kebab-case.tsx` — matches the component concept, not the export name                                                                                                                           |
| **Location**             | Always `src/components/<name>.tsx`                                                                                                                                                              |
| **One concept per file** | A file contains one logical component and its sub-parts                                                                                                                                         |
| **`"use client"`**       | Add at the top of every file that uses Base UI primitives or React hooks. Some purely presentational components (e.g., `table.tsx`, `skeleton.tsx`) may omit it if they use no client-side APIs |
| **Imports order**        | Sorted automatically by `oxfmt` — don't hand-order them                                                                                                                                         |
| **Internal imports**     | Relative only (`./button`, `../hooks/use-media-query`). There is no `@/` alias — it would not resolve for consumers                                                                             |

---

## 4. Component Authoring Patterns

There are **three** component patterns in XiodUI. Choose based on complexity.

### Pattern A: Direct Primitive Wrapper (Most Common)

For components that directly wrap a Base UI primitive with styling:

```tsx
"use client";

import { ComponentName as ComponentPrimitive } from "@base-ui/react/component-name";
import { cn } from "cn";

function Component({ className, ...props }: ComponentPrimitive.Root.Props) {
  return (
    <ComponentPrimitive.Root
      className={cn("...base styles...", className)}
      data-slot="component"
      {...props}
    />
  );
}

export { Component };
```

**Examples:** `Accordion`, `Avatar`, `Checkbox`, `Collapsible`, `Form`, `Field`, `Progress`, `Switch`, `Separator`

**Key rules:**

- Destructure `className` and spread `...props` — **always**
- Merge user `className` **last** inside `cn()` so overrides win
- Add `data-slot="component-name"` to root element
- Use `function` declarations, **not** arrow functions or `React.forwardRef`

### Pattern B: `useRender` + `mergeProps` Polymorphic Pattern

For components that need polymorphic rendering (render as different HTML elements or other components via a `render` prop):

```tsx
"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "cn";

function Component({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  const defaultProps = {
    className: cn("...base styles...", className),
    "data-slot": "component",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export { Component };
```

**Examples:** `Button`, `Badge`, `Card` (and all Card sub-parts), `BreadcrumbLink`

**When to use:** When the consumer may need `<Component render={<Link href="..." />} />` to swap the underlying element.

### Pattern C: CVA Variant Pattern

When a component has multiple **variant** / **size** combinations:

```tsx
"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const componentVariants = cva("...base classes shared across all variants...", {
  defaultVariants: {
    variant: "default",
    size: "default",
  },
  variants: {
    variant: {
      default: "...",
      outline: "...",
      ghost: "...",
    },
    size: {
      default: "...",
      sm: "...",
      lg: "...",
    },
  },
});

function Component({
  className,
  variant,
  size,
  ...props
}: SomePrimitiveProps & VariantProps<typeof componentVariants>) {
  return (
    <SomePrimitive
      className={cn(componentVariants({ className, size, variant }))}
      data-slot="component"
      {...props}
    />
  );
}

export { Component, componentVariants };
```

**Examples:** `Button`, `Badge`, `Alert`, `Toggle`, `Select` (trigger)

**Important:** Always export the `variants` object alongside the component so other components can reuse it (e.g., `Toast` uses `buttonVariants({ size: "xs" })`).

### Combining Patterns B + C

`Button` and `Badge` combine **both** `useRender` polymorphism AND CVA variants:

```tsx
interface ButtonProps extends useRender.ComponentProps<"button"> {
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
}

function Button({ className, variant, size, render, ...props }: ButtonProps) {
  const typeValue: React.ButtonHTMLAttributes<HTMLButtonElement>["type"] =
    render ? undefined : "button";

  const defaultProps = {
    className: cn(buttonVariants({ className, size, variant })),
    "data-slot": "button",
    type: typeValue,
  };

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(defaultProps, props),
    render,
  });
}
```

---

## 5. Styling System

### Design Tokens (`src/styles.css`)

All colours are defined as CSS custom properties in `:root` and `.dark`:

```css
:root {
  --radius: 0.625rem;
  --background: var(--color-white);
  --foreground: var(--color-neutral-800);
  --primary: var(--color-neutral-800);
  --primary-foreground: var(--color-neutral-50);
  --secondary: --alpha(var(--color-black) / 4%);
  --muted: --alpha(var(--color-black) / 4%);
  --muted-foreground: color-mix(
    in srgb,
    var(--color-neutral-500) 90%,
    var(--color-black)
  );
  --destructive: var(--color-red-500);
  --info: var(--color-blue-500);
  --success: var(--color-emerald-500);
  --warning: var(--color-amber-500);
  --border: --alpha(var(--color-black) / 8%);
  --input: --alpha(var(--color-black) / 10%);
  --ring: var(--color-neutral-400);
  /* ... card, popover, sidebar, etc. */
}
```

These are bridged to Tailwind via `@theme inline` blocks:

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  /* ... etc. */
}
```

### Token Usage in Components

| Token                                                                        | Where to use                                              |
| ---------------------------------------------------------------------------- | --------------------------------------------------------- |
| `text-foreground`                                                            | Primary text colour                                       |
| `text-muted-foreground`                                                      | Secondary / descriptive text                              |
| `bg-background`                                                              | Page / default backgrounds                                |
| `bg-popover` / `text-popover-foreground`                                     | Floating surfaces (popover, menu, dialog, tooltip, toast) |
| `bg-card` / `text-card-foreground`                                           | Card-like containers                                      |
| `bg-primary` / `text-primary-foreground`                                     | Primary action fills                                      |
| `bg-accent` / `text-accent-foreground`                                       | Hover / highlighted states (menu items, tabs)             |
| `bg-muted`                                                                   | Subdued backgrounds (tabs list, footer areas)             |
| `border-input`                                                               | Input-type borders (textfield, select trigger, checkbox)  |
| `border-border`                                                              | Generic separator borders                                 |
| `text-destructive-foreground`                                                | Error text                                                |
| `bg-destructive`                                                             | Error fills                                               |
| `text-info-foreground`, `text-success-foreground`, `text-warning-foreground` | Semantic status text                                      |

### Opacity Modifiers

Use Tailwind's `/` alpha syntax for semi-transparent tokens:

```
bg-accent/50          → 50% accent
bg-primary/90         → hover state for primary buttons
bg-destructive/4      → subtle error background
bg-input/32           → dark mode input background
border-destructive/36 → subtle destructive border
shadow-lg/5           → 5% shadow opacity
```

---

## 6. CVA (class-variance-authority) Variant System

### Structure

```tsx
const variants = cva("/* base classes applied to ALL variants */", {
  defaultVariants: { variant: "default", size: "default" },
  variants: {
    variant: {/* each visual style */},
    size: {/* each size */},
  },
});
```

### Size Scale Convention

All size variants follow this **mobile-first, desktop-shrink** pattern:

| Size      | Height (mobile) | Height (desktop `sm:`) |
| --------- | --------------- | ---------------------- |
| `xs`      | `h-7`           | `sm:h-6`               |
| `sm`      | `h-8`           | `sm:h-7`               |
| `default` | `h-9`           | `sm:h-8`               |
| `lg`      | `h-10`          | `sm:h-9`               |
| `xl`      | `h-11`          | `sm:h-10`              |

**Text size follows the same pattern:** `text-base` → `sm:text-sm`, or `text-sm` → `sm:text-xs`.

### Icon-Only Sizes

For icon-only buttons: use `size-N` instead of `h-N`:

```
icon-xs: "size-7 sm:size-6"
icon-sm: "size-8 sm:size-7"
icon:    "size-9 sm:size-8"
icon-lg: "size-10 sm:size-9"
icon-xl: "size-11 sm:size-10"
```

### Padding with Border Compensation

**Critical pattern:** Always subtract 1px from padding to compensate for the 1px border:

```
px-[calc(--spacing(3)-1px)]       // default
px-[calc(--spacing(2.5)-1px)]     // sm
px-[calc(--spacing(2)-1px)]       // xs
p-[calc(--spacing(2.5)-1px)]      // table cells in framed mode
```

This ensures the **inner content** aligns to the design grid, not the outer border edge.

---

## 7. Dynamic CSS — calc(), Custom Properties & Computed Values

This is one of the most distinctive aspects of XiodUI. Many components use CSS `calc()` with custom properties for dynamic, context-aware styling.

### Nested Dialog Stacking

Dialogs and AlertDialogs use `--nested-dialogs` CSS variable (provided by Base UI) to stack/scale nested modals:

```
-translate-y-[calc(1.25rem*var(--nested-dialogs))]
scale-[calc(1-0.1*var(--nested-dialogs))]
opacity-[calc(1-0.1*var(--nested-dialogs))]
```

### Switch Thumb Sizing

The Switch uses a `--thumb-size` custom property for consistent thumb/track calculations:

```
[--thumb-size:--spacing(5)]          // mobile
sm:[--thumb-size:--spacing(4)]       // desktop

// Track uses:
h-[calc(var(--thumb-size)+2px)]
w-[calc(var(--thumb-size)*2.5+2px)]

// Thumb translate uses:
data-checked:translate-x-[calc(var(--thumb-size))]
```

### Toast Positioning System

Toasts use an elaborate system of CSS custom properties:

```
[--toast-calc-height:var(--toast-frontmost-height,var(--toast-height))]
[--toast-gap:--spacing(3)]
[--toast-peek:--spacing(3)]
[--toast-scale:calc(max(0,1-(var(--toast-index)*.1)))]
[--toast-shrink:calc(1-var(--toast-scale))]
[--toast-inset:--spacing(4)]
sm:[--toast-inset:--spacing(8)]
```

### Border Radius Compensation

For `before:` pseudo elements inside rounded containers, always subtract 1px:

```
rounded-2xl                                     // outer element
before:rounded-[calc(var(--radius-2xl)-1px)]    // inner pseudo

rounded-lg
before:rounded-[calc(var(--radius-lg)-1px)]

rounded-md
before:rounded-[calc(var(--radius-md)-1px)]
```

### Available Space Variables

Floating components use Base UI's provided CSS variables:

```
min-w-(--anchor-width)        // match trigger width
max-w-(--available-width)     // don't overflow viewport
max-h-(--available-height)    // respect viewport height
origin-(--transform-origin)   // animate from anchor
h-(--popup-height,auto)       // animated popover height
w-(--popup-width,auto)        // animated popover width
```

---

## 8. The `data-slot` Convention

**Every** sub-part of a component **must** have a `data-slot` attribute. This is the **foundation** of XiodUI's inter-component communication and CSS targeting.

### Naming Convention

```
data-slot="component-name"           // root element
data-slot="component-name-part"      // sub-parts
```

**Examples:**

```
data-slot="button"
data-slot="card"
data-slot="card-header"
data-slot="card-title"
data-slot="card-footer"
data-slot="dialog-popup"
data-slot="dialog-header"
data-slot="dialog-panel"
data-slot="input-control"           // wrapper span
data-slot="input"                   // actual <input> element
```

### Why `data-slot` Matters

Components use `data-slot` to **style children contextually** without tight coupling:

```css
/* Card adjusts padding when it has a panel + header */
in-[[data-slot=card]:has(>[data-slot=card-panel])]:pb-4

/* Dialog panel removes top padding when header exists */
in-[[data-slot=dialog-popup]:has([data-slot=dialog-header])]:pt-1

/* Table body styles cells differently when inside a frame */
in-data-[slot=frame]:*:[td]:border-b
in-data-[slot=frame]:*:[td]:bg-background
```

### Tailwind v4 `data-slot` Selectors

Use these Tailwind selector utilities to target `data-slot`:

| Selector                | Meaning                                                      |
| ----------------------- | ------------------------------------------------------------ |
| `data-slot="X"`         | Direct attribute on the element                              |
| `in-data-[slot=X]:...`  | When this element is inside an ancestor with `data-slot="X"` |
| `*:data-[slot=X]:...`   | Direct children with `data-slot="X"`                         |
| `has-data-[slot=X]:...` | When this element has a descendant with `data-slot="X"`      |
| `**:data-[slot=X]:...`  | Any descendant with `data-slot="X"`                          |

---

## 9. Responsive Design

XiodUI uses a **mobile-first, desktop-shrink** paradigm.

### The Pattern

```
// Base = mobile    → sm: = desktop (≥640px)
h-9 sm:h-8               // slightly smaller on desktop
text-base sm:text-sm      // smaller text on desktop
size-4.5 sm:size-4        // smaller icons on desktop
min-h-8 sm:min-h-7        // smaller hit targets on desktop
```

### Why Mobile-First?

Touch devices need **larger** touch targets and text. The `sm:` breakpoint scales down for mouse/keyboard-driven desktop contexts.

### The `max-sm:` Escape Hatch

For critical mobile-only overrides (especially in overlays):

```
max-sm:grid-rows-[1fr_auto]       // dialog sticks to bottom on mobile
max-sm:p-0                         // remove padding on mobile
max-sm:pt-12                       // leave room for status bar
max-sm:max-w-none                  // full width on mobile
max-sm:rounded-none                // no rounded corners on mobile
max-sm:border-x-0                  // remove side borders on mobile
```

---

## 10. Touch & Pointer-Coarse Targets

Every interactive component must include **pointer-coarse** hit-target expansion:

```tsx
// Applied to buttons, toggles, menu items, etc.
"pointer-coarse:after:absolute";
"pointer-coarse:after:size-full";
"pointer-coarse:after:min-h-11";
"pointer-coarse:after:min-w-11";
```

This creates an invisible 44px × 44px minimum touch target (Apple HIG / WCAG requirement) using an `::after` pseudo-element, so the visual size stays small but the touch area is adequate.

**When to apply:** On **every** clickable element — buttons, toggles, menu items, icon buttons, select triggers, etc.

---

## 11. Dark Mode Strategy

Dark mode is activated via the `.dark` CSS class on an ancestor (configured with `@custom-variant dark (&:is(.dark *))`).

### Techniques

| Technique                                                                                                                             | Usage                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `dark:bg-input/32`                                                                                                                    | Slightly tinted dark input backgrounds                   |
| `not-dark:bg-clip-padding`                                                                                                            | Light-mode-only border-box clipping for clean borders    |
| `dark:before:shadow-[0_-1px_--theme(--color-white/6%)]`                                                                               | Bottom highlight becomes top highlight in dark           |
| `not-disabled:before:shadow-[0_1px_--theme(--color-black/4%)]` → `dark:not-disabled:before:shadow-[0_-1px_--theme(--color-white/6%)]` | Inverted inner shadow direction                          |
| `[--skeleton-highlight:...]` → `dark:[--skeleton-highlight:...]`                                                                      | Skeleton shimmer adapts to dark mode                     |
| `color-mix(in srgb, ...)`                                                                                                             | Used in token definitions for nuanced dark-mode blending |

### Important

**Never** use `dark:` for token-level colour changes. Tokens handle light/dark automatically. Use `dark:` only for:

- Background alpha adjustments (`dark:bg-input/32`)
- Shadow direction inversions
- `bg-clip-padding` toggling
- Custom property value overrides

---

## 12. Tactile Depth System (Shadow & Before-Pseudo Layering)

XiodUI uses a **two-layer depth philosophy**:

1. A **foundational before-pseudo pattern** applied to nearly every bordered surface (Card, Dialog, Popover, Button outline, etc.) for a subtle 3D edge highlight.
2. An **enhanced tactile depth system** applied selectively to interactive controls (Button, Switch, Checkbox, Slider, etc.) that adds recessed ↔ elevated state transitions.

### 12.0 Foundation: The Before-Pseudo Pattern (All Bordered Surfaces)

This is the base visual technique of XiodUI. Nearly every bordered component uses a dual-layer shadow system to create a subtle **3D depth illusion** — a 1px lighter line at the top (light mode) or bottom (dark mode) of the component, mimicking physical depth.

### Rules

```tsx
// Outer: the component itself
"rounded-2xl border bg-card shadow-xs/5";

// Inner: before pseudo — provides the subtle inset highlight
"before:pointer-events-none";
"before:absolute before:inset-0";
"before:rounded-[calc(var(--radius-2xl)-1px)]"; // 1px smaller radius
"before:shadow-[0_1px_--theme(--color-black/4%)]"; // light: bottom highlight
"dark:before:shadow-[0_-1px_--theme(--color-white/6%)]"; // dark: top highlight
```

**Used on:** Card, Dialog, Popover, Drawer, Button (outline), Toggle (outline), Input, Select trigger, and any other bordered container.

**Rules:**

1. **Always** add `before:pointer-events-none` — the pseudo must not interfere with clicks
2. **Always** compute `before:rounded-[calc(var(--radius-SIZE)-1px)]` matching the parent's radius
3. Use `not-dark:bg-clip-padding` on the parent to prevent border-colour bleed-through in light mode
4. The outer shadow uses opacity: `shadow-xs/5`, `shadow-lg/5`, `shadow-md/5`

### 12.1 The Enhanced Tactile Depth Techniques (Interactive Controls Only)

Beyond the foundational before-pseudo, interactive controls that represent **physical objects** get three additional depth techniques. These are applied **only** to components that have a real-world physical analogue (buttons you press, switches you flip, sliders you drag).

#### Technique 1: Beveling / Edge Highlights

Same `before:shadow-[0_1px_var(--border)]` as the foundation, but combined with recessed/elevated states to create interactive affordances:

```
before:pointer-events-none
before:absolute before:inset-0
before:rounded-[calc(var(--radius-SIZE)-1px)]   // 1px smaller than parent
before:shadow-[0_1px_var(--border)]              // subtle bottom highlight
```

#### Technique 2: Recessed vs. Elevated States

Components that toggle between empty/unchecked and filled/active states use **inset shadows** to communicate physical depth:

- **Recessed (empty/unchecked/unpressed):** `inset-shadow-[0_1px_var(--border)]` — creates a subtle sunken well
- **Elevated (filled/checked/active):** `shadow-xs` + `shadow-primary/24` — raises the element above the surface

The state transition between recessed and elevated communicates that something has been "pressed into" or "popped out of" the surface.

#### Technique 3: Layered Highlight System

Filled/active surfaces (primary-colored backgrounds) get a translucent top-edge glow that simulates light hitting a glossy raised surface:

```
inset-shadow-[0_1px_--alpha(var(--primary-foreground)/16%)]
```

This uses the **foreground color** of the filled surface at 16% opacity, ensuring the highlight adapts to any theme — it's white-ish on dark primary backgrounds, dark-ish on light ones.

### 12.2 Token Palette for Depth Effects

**Critical rule:** Never use raw colors (`rgba(0,0,0,...)`, `--theme(--color-black/...)`, `--theme(--color-white/...)`) for depth effects. Always use design system CSS variables:

| Token                       | Use for                                       | Example                                                       |
| --------------------------- | --------------------------------------------- | ------------------------------------------------------------- |
| `var(--border)`             | Subtle 1px edge highlights, bevel lines       | `before:shadow-[0_1px_var(--border)]`                         |
| `var(--input)`              | Deeper recessed track wells (progress, meter) | `inset-shadow-[0_1px_2px_var(--input)]`                       |
| `var(--primary-foreground)` | Layered highlight on filled surfaces          | `inset-shadow-[0_1px_--alpha(var(--primary-foreground)/16%)]` |
| `shadow-primary/24`         | Drop shadow color for primary-filled elements | `data-checked:shadow-primary/24`                              |
| `border-input`              | Semantic border on elevated thumbs/knobs      | `border border-input`                                         |

### 12.3 Where to Apply Depth — Component Categories

Depth effects go on components that represent **physical interactive objects** — things you press, flip, drag, or fill. The guiding question is: _"Does this component have a physical real-world analogue?"_

#### ✅ APPLY depth to:

| Category                | Components                    | Rationale                                                                     |
| ----------------------- | ----------------------------- | ----------------------------------------------------------------------------- |
| **Pressable Actions**   | `Button`, `Toggle`            | Buttons are the primary clickable affordance — depth communicates "pressable" |
| **Binary Controls**     | `Checkbox`, `Radio`, `Switch` | Two clear states: sunken empty slot → raised filled indicator                 |
| **Draggable Controls**  | `Slider` (thumb + track)      | Thumb is a draggable knob sitting in a recessed groove                        |
| **Fill Indicators**     | `Progress`, `Meter`           | The bar fills a recessed channel — sunken track + elevated fill               |
| **Physical Simulators** | `Kbd`                         | Keyboard keys are literal physical raised keycaps                             |
| **Raised Labels**       | `Badge` (solid variants)      | Small pill labels benefit from subtle lift to feel like physical enamel tags  |

#### ❌ DO NOT apply depth to:

| Category               | Components                                           | Rationale                                                                                                            |
| ---------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Flat Containers**    | `Card`, `Dialog`, `Popover`, `Drawer`, `Toast`       | Surfaces/panels — adding depth makes them look overly decorated and busy                                             |
| **Text Inputs**        | `Input`, `Textarea`, `Select` (trigger), `OTP Field` | Already have their own recessed `inset-shadow` for the "well" feel, but no filled/active state that needs elevation  |
| **Navigation**         | `Tabs`, `Breadcrumb`, `Pagination`, `Sidebar`        | Flat navigational aids, not physical objects                                                                         |
| **Display Components** | `Skeleton`, `Avatar`, `Separator`, `Table`           | Purely informational, no interactive state to communicate                                                            |
| **Overlays**           | `Tooltip`, `Menu`, `Context Menu`, `Dropdown`        | Floating panels — they already have positional depth via `shadow-lg`                                                 |
| **Semantic Badges**    | `Badge` (info/success/warning/error variants)        | These are tinted status labels, not physical tags — depth would look inconsistent with their flat tinted backgrounds |
| **Layout**             | `Collapsible`, `Accordion`, `Scroll Area`            | Structural layout components, not interactive affordances                                                            |

### 12.4 Per-Component Depth Recipes

#### Button

```
// Filled variants (default, destructive) — elevated with layered highlight
shadow-xs
inset-shadow-[0_1px_--alpha(var(--primary-foreground)/16%)]    // top highlight
[:active,[data-pressed]]:inset-shadow-[0_1px_var(--border)]     // pressed → recessed
[:disabled,:active,[data-pressed]]:shadow-none                   // kill drop shadow on press

// Outline variant — bevel highlight on before pseudo
shadow-xs/5
not-disabled:not-active:not-data-pressed:before:shadow-[0_1px_var(--border)]
[:disabled,:active,[data-pressed]]:shadow-none
```

#### Checkbox & Radio (Item — unchecked well)

```
// Unchecked state — recessed well
border border-input
shadow-xs/5
before:shadow-[0_1px_var(--border)]                                  // bevel
not-data-checked:not-data-disabled:inset-shadow-[0_1.5px_3px_var(--input)]  // deep recess
[[data-disabled],[data-checked],[aria-invalid]]:shadow-none          // clear on state change
```

#### Checkbox & Radio (Indicator — checked fill)

```
// Checked state — elevated with layered highlight
data-checked:bg-primary
data-checked:shadow-xs
data-checked:shadow-primary/24
data-checked:inset-shadow-[0_1px_--alpha(var(--primary-foreground)/16%)]
```

#### Switch

```
// Track — unchecked recessed, checked elevated
data-unchecked:bg-input
data-unchecked:inset-shadow-[0_1px_var(--border)]                         // subtle recess
data-checked:bg-primary
data-checked:inset-shadow-[0_1px_--alpha(var(--primary-foreground)/16%)]  // layered highlight
data-checked:shadow-xs
data-checked:shadow-primary/24

// Thumb — always elevated
bg-background border border-input shadow-xs
before:shadow-[0_1px_var(--border)]                                       // bevel
```

#### Toggle

```
// Default variant — pressed recessed
data-pressed:bg-input/32
data-pressed:inset-shadow-[0_1px_var(--border)]

// Outline variant — elevated when unpressed, recessed when pressed
shadow-xs/5
not-disabled:not-active:not-data-pressed:before:shadow-[0_1px_var(--border)]
data-pressed:inset-shadow-[0_1px_var(--border)]
[:disabled,:active,[data-pressed]]:shadow-none
```

#### Progress & Meter

```
// Track — recessed channel
bg-input
inset-shadow-[0_1px_2px_var(--input)]

// Indicator — elevated fill bar
bg-primary
inset-shadow-[0_1px_--alpha(var(--primary-foreground)/16%)]
```

#### Slider

```
// Track — recessed groove
inset-shadow-[0_0.5px_1.5px_var(--input)]

// Thumb — elevated knob
border border-input bg-background shadow-xs
before:shadow-[0_1px_var(--border)]
```

#### Badge (solid variants only)

```
// Default, Destructive, Secondary — raised enamel tag
shadow-xs
inset-shadow-[0_1px_--alpha(var(--primary-foreground)/16%)]

// Outline — bevel highlight
shadow-xs/5
before:shadow-[0_1px_var(--border)]
```

#### Kbd

```
// Physical keycap
border border-input border-b-2     // thicker bottom = key depth
bg-popover shadow-xs/5
before:shadow-[0_1px_var(--border)]  // top bevel
```

### 12.5 Intensity Guidelines

The depth effect should be **subtle and barely noticeable** — just enough to communicate physicality without looking heavy or dated:

| Intensity Level                 | Shadow Value                                                  | When to use                                |
| ------------------------------- | ------------------------------------------------------------- | ------------------------------------------ |
| **Whisper** (1px border)        | `inset-shadow-[0_1px_var(--border)]`                          | Toggle pressed, Switch unchecked track     |
| **Subtle** (1px + 2px blur)     | `inset-shadow-[0_1px_2px_var(--input)]`                       | Meter/Progress tracks                      |
| **Medium** (1.5px + 3px blur)   | `inset-shadow-[0_1.5px_3px_var(--input)]`                     | Checkbox/Radio unchecked wells             |
| **Highlight** (1px translucent) | `inset-shadow-[0_1px_--alpha(var(--primary-foreground)/16%)]` | All filled/checked/active primary surfaces |

**Rule of thumb:** If the depth effect is the first thing you notice when looking at the component, it's too strong. Dial it back.

---

## 13. Animations & Transitions

### Base UI Data Attributes for State Transitions

Base UI provides two modes for CSS-driven open/close animations:

**Mode 1: CSS Transitions (Preferred)** — use `data-starting-style` / `data-ending-style`:

```
data-starting-style    → applied during enter animation start
data-ending-style      → applied during exit animation start
```

CSS transitions are **preferred** over CSS animations because they can be smoothly cancelled midway (e.g., if the user closes a popup before it finishes opening).

**Mode 2: CSS Keyframe Animations** — use `data-open` / `data-closed`:

```
data-open              → applied when element becomes visible (for @keyframes)
data-closed            → applied before element becomes hidden (for @keyframes)
```

**Usage pattern (CSS Transitions):**

```tsx
// Accordion panel height animation
"h-(--accordion-panel-height) overflow-hidden transition-[height] duration-200 ease-in-out";
"data-ending-style:h-0";
"data-starting-style:h-0";

// Dialog / toast scale + opacity animation
"data-ending-style:scale-98 data-starting-style:scale-98";
"data-ending-style:opacity-0 data-starting-style:opacity-0";

// Backdrop fade
"transition-all duration-200";
"data-ending-style:opacity-0 data-starting-style:opacity-0";
```

**Usage pattern (CSS Keyframe Animations):**

```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes scaleOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.9);
  }
}

.Popup[data-open] {
  animation: scaleIn 250ms ease-out;
}
.Popup[data-closed] {
  animation: scaleOut 250ms ease-in;
}
```

**XiodUI convention:** Always prefer Mode 1 (CSS transitions) for new components. Use Mode 2 only when keyframe control is specifically required.

### Transition Property Specificity

Always list specific transition properties instead of `transition-all`:

```
transition-[height]                  // accordion
transition-[scale,opacity,translate] // dialog
transition-[background-color,box-shadow] // switch
transition-[width,height,scale,opacity]  // tooltip
transition-[color,background-color,box-shadow,opacity] // tabs
transition-shadow                    // inputs
```

### Keyframe Animations (`src/styles.css`)

```css
@keyframes skeleton {
  to {
    background-position: -200% 0;
  }
}
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
@keyframes spin-slow {
  to {
    transform: rotate(360deg);
  }
}
```

### Durations

| Context                   | Duration                   |
| ------------------------- | -------------------------- |
| Panel collapse/expand     | `duration-200`             |
| Dialog/backdrop           | `duration-200`             |
| Button shadow transitions | default (150ms)            |
| Progress indicator        | `duration-500`             |
| Switch thumb              | `.15s` (custom)            |
| Tab indicator             | `duration-200 ease-in-out` |

---

## 14. Focus, Validation & Disabled States

### Focus Visible

```
focus-visible:ring-2 focus-visible:ring-ring
focus-visible:ring-offset-1 focus-visible:ring-offset-background
```

For inputs (which use a `has-` approach since focus is on the inner input):

```
has-focus-visible:border-ring has-focus-visible:ring-[3px]
```

### Validation / aria-invalid

Inputs:

```
has-aria-invalid:border-destructive/36
has-focus-visible:has-aria-invalid:border-destructive/64
has-focus-visible:has-aria-invalid:ring-destructive/16
dark:has-aria-invalid:ring-destructive/24
```

Checkboxes/radios (directly on the element):

```
aria-invalid:border-destructive/36
focus-visible:aria-invalid:border-destructive/64
focus-visible:aria-invalid:ring-destructive/48
```

### Disabled State

```
disabled:pointer-events-none disabled:opacity-64
// or for Base UI components:
data-disabled:pointer-events-none data-disabled:opacity-64
// or for has- patterns:
has-disabled:opacity-64
```

**Opacity is always `64`**, not `50` — this is a design system constant.

### Shadow Removal on State Change

```
has-[:disabled,:focus-visible,[aria-invalid]]:shadow-none
[:disabled,:active,[data-pressed]]:shadow-none
```

---

## 15. Accessibility

### ARIA Roles

- Use Base UI primitives — they handle ARIA automatically
- For native HTML wrappers (e.g., `Table`, `Breadcrumb`), add semantic roles:
  - `role="alert"` on Alert
  - `aria-label="breadcrumb"` on Breadcrumb `<nav>`
  - `role="link"` + `aria-current="page"` + `aria-disabled="true"` on BreadcrumbPage
  - `aria-hidden="true"` + `role="presentation"` on separators/ellipsis
  - `role="status"` + `aria-label="Loading"` on Loader

### Screen Reader Text

```tsx
<span className="sr-only">More</span>
```

---

## 16. Polymorphic Rendering — `useRender` + `mergeProps`

When a component needs to be renderable as **any** HTML element or another component (e.g., render a Button as a Next.js `<Link>`), use this pattern:

```tsx
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";

interface ComponentProps extends useRender.ComponentProps<"div"> {
  // any extra props
}

function Component({ className, render, ...props }: ComponentProps) {
  const defaultProps = {
    className: cn("...", className),
    "data-slot": "component",
  };

  return useRender({
    defaultTagName: "div", // fallback HTML tag
    props: mergeProps<"div">(defaultProps, props),
    render, // consumer can pass render={<Link />}
  });
}
```

### Special Case: Button `type` Attribute

When using `useRender` for a button, conditionally omit `type` when a custom `render` is provided:

```tsx
const typeValue: React.ButtonHTMLAttributes<HTMLButtonElement>["type"] = render
  ? undefined
  : "button";
```

---

## 17. Overlay & Floating Components

Overlay components (Dialog, Drawer, AlertDialog, Menu, Popover, Tooltip, Select, Autocomplete) share a consistent structure:

### Layering Structure

```
Portal → Positioner (or Viewport) → Popup
```

### Shared Props Pattern for Positioning

Floating components "absorb" positioner props at the Popup level for ergonomic API:

```tsx
function ComponentPopup({
  // Popup's own props
  className,
  children,
  // Positioner props absorbed here
  side = "bottom",
  sideOffset = 4,
  align = "start",
  alignOffset,
  anchor,
  ...props
}: ComponentPrimitive.Popup.Props & {
  side?: ComponentPrimitive.Positioner.Props["side"];
  sideOffset?: ComponentPrimitive.Positioner.Props["sideOffset"];
  align?: ComponentPrimitive.Positioner.Props["align"];
  alignOffset?: ComponentPrimitive.Positioner.Props["alignOffset"];
  anchor?: ComponentPrimitive.Positioner.Props["anchor"];
}) {
  return (
    <ComponentPrimitive.Portal>
      <ComponentPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="z-50"
      >
        <ComponentPrimitive.Popup
          className={cn("...styled popup...", className)}
          data-slot="component-popup"
          {...props}
        >
          {children}
        </ComponentPrimitive.Popup>
      </ComponentPrimitive.Positioner>
    </ComponentPrimitive.Portal>
  );
}
```

### Backdrop Pattern

For modal overlays:

```
"fixed inset-0 z-50 bg-black/32 backdrop-blur-sm transition-all duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0"
```

### Bottom-Stick Mobile Pattern

Dialogs and AlertDialogs use `bottomStickOnMobile` to convert from centered dialog to bottom-sheet on mobile:

```tsx
bottomStickOnMobile && "max-sm:grid-rows-[1fr_auto] max-sm:p-0 max-sm:pt-12";
```

---

## 18. Icon Handling

### SVG Size Rules (Applied Globally in Components)

```
[&_svg:not([class*='size-'])]:size-4.5       // mobile default icon size
sm:[&_svg:not([class*='size-'])]:size-4      // desktop default icon size
[&_svg:not([class*='opacity-'])]:opacity-80  // default icon opacity
[&_svg]:pointer-events-none                  // icons are not clickable
[&_svg]:shrink-0                             // icons don't flex-shrink
[&_svg]:-mx-0.5                              // slight negative margin for optical alignment
```

The `[class*='size-']` and `[class*='opacity-']` guards allow consumers to override with explicit classes.

### Custom SVG Icons

For checkmarks and indeterminate marks (Checkbox, Select, Menu), use **inline SVG** with consistent properties:

```tsx
<svg
  className="size-3.5 sm:size-3"
  fill="none"
  height="24"
  stroke="currentColor"
  strokeLinecap="round"
  strokeLinejoin="round"
  strokeWidth="2" // or "3" for checkboxes
  viewBox="0 0 24 24"
  width="24"
  xmlns="http://www.w3.org/2000/svg"
>
  <path d="M5.252 12.7 10.2 18.63 18.748 5.37" /> // checkmark
</svg>
```

### Arrow SVG Pattern (Menu, Tooltip, Popover)

Floating components with arrows share an identical `ArrowSvg` component:

```tsx
function ArrowSvg(props: React.ComponentProps<"svg">) {
  return (
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none" {...props}>
      <path d="..." className="fill-popover" /> {/* background fill */}
      <path d="..." className="fill-border" /> {/* border stroke */}
    </svg>
  );
}
```

---

## 19. Exports & Backward-Compatible Aliases

### Named Export Structure

**Always** use named exports. **Never** use default exports.

```tsx
export { Component, ComponentVariant, componentVariants };
```

### Export names must be globally unique

**No two modules may export the same name.** There is no barrel to make this a
compile error any more, so the design-system audit enforces this convention.
A duplicated name means two different
subpaths offer the same import, editor auto-import picks one arbitrarily, and
the consumer gets a component they didn't mean to use.

Each name has exactly one owning module:

- `button-group.tsx` owns `ButtonGroup*` — `group.tsx` must not alias them.
- `toggle.tsx` owns `Toggle` — `toggle-group.tsx` exports it as
  `ToggleGroupItem` only.

When adding a component, grep the other modules for each name you export.

### Backward-Compatible Aliases

When XiodUI renames a concept from a well-known convention (e.g., shadcn/ui naming), **export aliases** for discoverability — subject to the uniqueness rule above:

```tsx
export {
  // Primary exports (XiodUI naming)
  AccordionPanel,
  DialogPopup,
  MenuPopup,
  SelectPopup,
  TabsTab,
  TabsPanel,
  TooltipPopup,

  // Backward-compatible aliases (shadcn-style naming)
  AccordionPanel as AccordionContent,
  DialogPopup as DialogContent,
  MenuPopup as DropdownMenuContent,
  SelectPopup as SelectContent,
  TabsTab as TabsTrigger,
  TabsPanel as TabsContent,
  TooltipPopup as TooltipContent,
};
```

### Menu → DropdownMenu Aliases

The entire `Menu` component tree is aliased as `DropdownMenu*` for shadcn/ui compat:

```tsx
Menu as DropdownMenu,
MenuItem as DropdownMenuItem,
MenuSub as DropdownMenuSub,
// etc.
```

---

## 20. Edge Cases & Anti-Patterns

### ✅ DO

| Practice                                                         | Why                                                  |
| ---------------------------------------------------------------- | ---------------------------------------------------- |
| Use `cn()` for ALL className compositions                        | Ensures proper Tailwind class merging                |
| Place `className` parameter last in `cn()`                       | Allows consumer overrides                            |
| Add `data-slot` to every sub-element                             | Powers inter-component CSS targeting                 |
| Use `function` declarations                                      | Consistent with codebase, hoisted, named in devtools |
| Export aliases for known naming conventions                      | Consumer discoverability                             |
| Handle `type="search"` / `type="file"` edge cases in Input       | Removes browser chrome inconsistencies               |
| Use `will-change-transform` on animated overlays                 | GPU acceleration for smooth transitions              |
| Use `select-none` on menu items / select items                   | Prevents accidental text selection                   |
| Use `tabular-nums` on numeric displays (progress, timer)         | Prevents layout shift                                |
| Provide default composite layouts (Progress → Track + Indicator) | Zero-config usage when children not provided         |

### ❌ DON'T

| Anti-Pattern                              | Why                                                                            |
| ----------------------------------------- | ------------------------------------------------------------------------------ |
| `React.forwardRef`                        | Not used in this codebase; Base UI handles ref forwarding internally           |
| Default exports                           | Breaks tree-shaking and naming consistency                                     |
| `React.FC` type                           | Use explicit function declarations with typed parameters                       |
| `transition-all`                          | Too broad; specify exact transition properties                                 |
| `z-[9999]`                                | Use orderly z-index: `z-50` for overlays, `z-10` for within-component stacking |
| Hardcoded colours (`text-red-500`)        | Always use semantic tokens (`text-destructive`)                                |
| `className={className}` without `cn()`    | Loses merge capability                                                         |
| Mixing icon libraries                     | Only `xiod-icons`                                                              |
| Arrow functions for component definitions | Inconsistent with codebase                                                     |
| `"use client"` at the end                 | Must be the very first line                                                    |

---

## 21. Adding a Component to the Package

This repo ships the library only — there is no docs registration step here.
(The documentation site is a separate private repository; adding a component
there is a follow-up in that repo.)

### Step 1: Create the component

Place the source at `src/components/<kebab-name>.tsx`. Use relative imports for
anything internal.

### Step 2: No build registration

There is no barrel and no export list to update. `package.json` maps
`./*` → `dist/components/*` and `./hooks/*` → `dist/hooks/*` with wildcards, and
`tsdown.config.ts` globs `src/components/*.tsx`, so a new file is published at
`xiod-ui/<kebab-name>` automatically.

Check the names you export against §19 first. With the barrel gone a collision
is not a TypeScript compile error, so `scripts/audit.ts` enforces uniqueness.

The test catalog is intentionally explicit. Add the new kebab-case entrypoint to
`expectedEntrypoints` in `tests/components/catalog-entrypoints.test.ts`; this
prevents components from being added, removed, or renamed without a reviewed
catalog change.

### Step 3: Add behavioral tests

Add focused contracts to the relevant file under `tests/components/`. Cover the
component's meaningful public states: default rendering, controlled and
uncontrolled behavior, disabled/read-only/invalid states where applicable,
keyboard navigation, callbacks, polymorphic rendering, and edge cases unique to
the component. Prefer role/name queries and observable behavior over internal
implementation assertions.

Add the component to the Playwright harness only when behavior materially
depends on a real browser, such as focus restoration, portals, layout,
scrolling, pointer interaction, or responsive overflow.

### Step 4: Verify

```bash
bun run check:release
```

This runs the complete lint, format, source/test typecheck, component-test,
design-system audit, theme/build, package validation, and browser-test gate.

### Step 5: Update the README catalog

Add the component to the table in `README.md` under the right category, and bump
the component count in the opening line.

---

## 22. Base UI Primitives Reference

This section documents the core Base UI APIs used throughout XiodUI.

### `useRender` Hook

The `useRender` hook enables polymorphic rendering via a `render` prop.

**API:**

```tsx
import { useRender } from "@base-ui/react/use-render";

const element = useRender({
  defaultTagName: "div",              // Fallback HTML tag
  render,                              // Consumer's render prop (element or function)
  props: mergeProps<"div">(defaults, userProps),  // Merged props
  ref: internalRef,                    // Optional: internal ref to merge with user's ref
  state: { open: true },               // Optional: passed to render callback
  stateAttributesMapping: { ... },     // Optional: maps state to data-* attributes
});
```

**TypeScript types:**

| Type                                     | Usage                                                       |
| ---------------------------------------- | ----------------------------------------------------------- |
| `useRender.ComponentProps<"div">`        | External/public props (includes `render` prop + HTML attrs) |
| `useRender.ComponentProps<"div", State>` | With custom state for render callback                       |
| `useRender.ElementProps<"div">`          | Internal/private props (HTML attrs only, no `render`)       |

### `mergeProps` Utility

Merges multiple sets of React props with intelligent handling:

| Prop type          | Merge behavior                                                                                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Event handlers** | All handlers invoked, rightmost first. Rightmost can call `event.preventBaseUIHandler()` to stop Base UI's internal logic (does NOT call `preventDefault` or `stopPropagation`) |
| **`className`**    | Concatenated right-to-left (rightmost class first)                                                                                                                              |
| **`style`**        | Shallow-merged, rightmost wins per key                                                                                                                                          |
| **`ref`**          | NOT merged — only rightmost ref is kept                                                                                                                                         |
| **All others**     | Rightmost wins (Object.assign behavior)                                                                                                                                         |

**Function arguments:** Each argument can be an object or a function receiving accumulated merged props:

```tsx
mergeProps<"button">(defaultProps, props);
mergeProps<"button">(a, b, (prev) => ({ ...prev, onClick: customHandler }));
```

**Important:** When using a function argument, the return value **replaces** the accumulated props entirely. If you need to chain handlers from previous props, call them manually inside the function.

### ❌ Do NOT Use `className` / `style` as Functions

Base UI supports `className={(state) => ...}` and `style={(state) => ...}` function forms. **XiodUI does not use this pattern.** Always use static Tailwind classes with `data-*` attribute selectors (e.g., `data-checked:bg-primary`) instead.

### Base UI TypeScript Namespaces

Every Base UI component exports namespaced types:

```tsx
import { Tooltip } from "@base-ui/react/tooltip";

// Props type for wrapping:
function MyTooltip(props: Tooltip.Root.Props) { ... }

// State type for render callbacks:
function renderPositioner(props: Popover.Positioner.Props, state: Popover.Positioner.State) { ... }

// Change event types:
function onValueChange(value: string, details: Combobox.Root.ChangeEventDetails) { ... }
```

### Base UI Data Attributes

Base UI provides these data attributes for CSS-driven state:

| Attribute               | Purpose                                                                                 |
| ----------------------- | --------------------------------------------------------------------------------------- |
| `[data-open]`           | Element is in the open state (for CSS keyframe animations)                              |
| `[data-closed]`         | Element is in the closed state (for CSS keyframe animations)                            |
| `[data-starting-style]` | Applied on enter animation start (for CSS transitions — **preferred**)                  |
| `[data-ending-style]`   | Applied on exit animation start (for CSS transitions — **preferred**)                   |
| `[data-pressed]`        | Toggle/button is pressed                                                                |
| `[data-checked]`        | Checkbox/switch is checked                                                              |
| `[data-unchecked]`      | Checkbox/switch is unchecked                                                            |
| `[data-disabled]`       | Element is disabled                                                                     |
| `[data-highlighted]`    | Menu/select item is keyboard-highlighted                                                |
| `[data-popup-open]`     | Trigger has an open popup                                                               |
| `[data-nested-dialogs]` | CSS variable counting nested dialog depth                                               |
| `[data-side]`           | Floating element position relative to anchor (`top`, `bottom`, `left`, `right`, `none`) |
| `[data-state]`          | Custom state attribute (e.g., `"complete"`, `"indeterminate"`)                          |
| `[data-placeholder]`    | Select value when no item is selected                                                   |

### Base UI CSS Variables for Floating Components

Provided automatically by Base UI positioner:

| Variable                      | Purpose                                            |
| ----------------------------- | -------------------------------------------------- |
| `--anchor-width`              | Width of the trigger/anchor element                |
| `--available-width`           | Max width before viewport overflow                 |
| `--available-height`          | Max height before viewport overflow                |
| `--transform-origin`          | Origin point for scale animations                  |
| `--popup-width`               | Animated popup width (for transitions)             |
| `--popup-height`              | Animated popup height (for transitions)            |
| `--positioner-width`          | Width of the positioner wrapper                    |
| `--positioner-height`         | Height of the positioner wrapper                   |
| `--accordion-panel-height`    | Height of accordion panel (for collapse animation) |
| `--collapsible-panel-height`  | Height of collapsible panel                        |
| `--drawer-swipe-progress`     | Drawer swipe progress (0–1)                        |
| `--drawer-swipe-movement-x/y` | Drawer swipe pixel offset                          |
| `--nested-dialogs`            | Number of stacked nested dialogs                   |

---

## 23. Component Composition & Nesting

### The `render` Prop Pattern

Base UI's `render` prop replaces Radix UI's `asChild`. Two forms:

**Element form** — simple tag/component swap:

```tsx
<Menu.Trigger render={<MyButton size="md" />}>Open menu</Menu.Trigger>
```

**Function form** — full control over props and state:

```tsx
<Switch.Thumb
  render={(props, state) => (
    <span {...props}>
      {state.checked ? <CheckedIcon /> : <UncheckedIcon />}
    </span>
  )}
/>
```

### Nested Composition

Multiple `render` props can be nested for multi-concern composition:

```tsx
<Tooltip.Trigger
  render={<Dialog.Trigger render={<Menu.Trigger render={<MyButton />} />} />}
/>
```

### Context Pattern for Compound Components

When a parent component needs to share state with children (e.g., `ButtonSplit`, `ToggleGroup`, `Drawer`):

```tsx
const ComponentContext = React.createContext<{
  variant?: string;
  size?: string;
}>({});

function ComponentRoot({ variant, size, children }: Props) {
  return (
    <ComponentContext.Provider value={{ variant, size }}>
      {children}
    </ComponentContext.Provider>
  );
}

function ComponentChild({ variant: propVariant, ...props }: ChildProps) {
  const { variant: ctxVariant } = React.useContext(ComponentContext);
  const variant = propVariant ?? ctxVariant; // prop overrides context
  // ...
}
```

### Re-exporting Base UI Primitives

When a Base UI sub-part needs no styling, re-export it directly:

```tsx
export const DrawerPortal: typeof DrawerPrimitive.Portal =
  DrawerPrimitive.Portal;
export const DrawerContent: typeof DrawerPrimitive.Content =
  DrawerPrimitive.Content;
```

### Composing XiodUI Components Together

Higher-level components can compose lower-level XiodUI components:

```tsx
// ButtonSplit composes Button, Group, Popover
import { Button } from "./button";
import { Group } from "./group";
import { Popover, PopoverPopup } from "./popover";
```

---

## 24. React 19 & TypeScript Conventions

### No `React.forwardRef`

XiodUI targets **React 19**. In React 19, `ref` is a regular prop — `React.forwardRef()` is **not used** anywhere in this codebase. When you need an internal ref, pass it to `useRender`'s `ref` option:

```tsx
function Component({ render, ...props }: ComponentProps) {
  const internalRef = React.useRef<HTMLElement | null>(null);

  return useRender({
    defaultTagName: "div",
    ref: internalRef, // merged with props.ref automatically
    props,
    render,
  });
}
```

### No `React.FC`

Always use explicit `function` declarations with typed parameters:

```tsx
// ✅ Correct
function Button({ className, ...props }: ButtonProps) { ... }

// ❌ Wrong
const Button: React.FC<ButtonProps> = ({ className, ...props }) => { ... }
```

### No `any`

The project uses **oxlint** for linting, which flags `any`. Use specific types:

```tsx
// ✅ Correct
props as React.ComponentProps<"p">;

// ❌ Wrong — will trigger lint warning
props as any;
```

### Props Typing Hierarchy

1. **Wrapping Base UI primitive:** Use `ComponentPrimitive.Part.Props`
2. **Polymorphic component:** Use `useRender.ComponentProps<"tag">`
3. **CVA + polymorphic:** Extend `useRender.ComponentProps<"tag">` with `VariantProps<typeof variants>`
4. **Pure HTML wrapper:** Use `React.ComponentPropsWithoutRef<"tag">`
5. **Component extending another XiodUI component:** Use `React.ComponentProps<typeof OtherComponent>`

### Import Conventions for React

```tsx
// ✅ Import specific items from React when using hooks/types
import * as React from "react";
import type * as React from "react"; // type-only when no runtime usage
import type React from "react"; // acceptable for type-only
import { createContext, useContext } from "react"; // direct named imports also fine

// ✅ For Base UI, always import the specific primitive
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
```

---

## 25. RTL & Direction Support

Base UI provides `DirectionProvider` for RTL support:

```tsx
import { DirectionProvider } from "@base-ui/react/direction-provider";

<div dir="rtl">
  <DirectionProvider direction="rtl">
    {/* Components adjust behavior for RTL */}
  </DirectionProvider>
</div>;
```

**Important:** `DirectionProvider` only affects Base UI component **behavior** (e.g., Slider direction). It does **not** affect HTML/CSS rendering — you must also set `dir="rtl"` on a DOM element.

When authoring components, prefer **logical properties** (`inset-inline`, `padding-inline-start`, `ms-auto`, `me-0.5`, `border-s`, `border-e`, `rounded-s`, `rounded-e`) over physical ones (`left`, `right`) to support RTL layouts automatically.

---

## 26. Quality Gates: Linting, Formatting & Testing

XiodUI standardises on the **Oxc / VoidZero** toolchain end to end — the same
people behind Vite and Rolldown. No ESLint, Prettier, Biome, Rollup, or webpack.

| Job         | Tool                                     |
| ----------- | ---------------------------------------- |
| Lint        | `oxlint`                                 |
| Format      | `oxfmt`                                  |
| Build       | `tsdown` (Rolldown + Oxc under the hood) |
| Minify      | `oxc-minify` (size reporting)            |
| Size checks | `rolldown`                               |
| Components  | `vitest` + Testing Library               |
| Browser     | `playwright` (Chromium)                  |
| A11y        | `@axe-core/playwright`                   |

```bash
bun run lint          # oxlint
bun run lint:fix      # oxlint --fix
bun run format        # oxfmt . (writes in place)
bun run format:check  # oxfmt --check .
bun run size          # tree-shaking / bundle-size report
bun run audit         # design system conformance (see below)
bun run test:components # jsdom component contracts + exact catalog check
bun run test:browser  # Chromium runtime, interaction, responsive, and a11y tests
bun run check         # fast gate: lint + format + types + components + audit + build
bun run check:release # complete gate: checks, browser tests, package safety and consumer tests
```

**Always run `bun run format` then `bun run lint` after editing a component.**

Config lives in `.oxlintrc.json`, `.oxfmtrc.jsonc`, and `tsdown.config.ts`.

### The design system validates itself

`scripts/audit.ts` checks all 89 components against the rules in this document —
the things a general-purpose linter cannot know: `"use client"` placement, no
`forwardRef`/`React.FC`/`asChild`, `opacity-64` over `opacity-50`, no
`transition-all`, `data-slot` attributes, no raw Tailwind colors, the
before-pseudo shadow and radius system on bordered containers, `cn()` from
`cn` with `className` passed **last**, `cva` variants exported alongside
their component, `data-starting-style`/`data-ending-style` on animated overlays,
pointer-coarse touch targets, and focus-visible rings.

It also enforces §19 across modules: **no two components may export the same
name.** While the root barrel existed, `export *` made that a TS2308 compile
error; without it the design-system audit is the collision gate. A name that one module
imports from a sibling and re-exports is not a collision — that is the same
symbol on a second path (`scroll-area` re-exports `ScrollBar`), which is how
TypeScript treated it too.

Errors fail the build; warnings are advisory. `--json` emits machine-readable
output. The exemption lists at the top of the file (`PURE_PRESENTATIONAL`,
`RAW_COLOR_EXEMPT`, `BORDERED_CONTAINERS`, `ANIMATED_OVERLAYS`) are keyed by
filename — an entry naming a file that no longer exists silently does nothing,
so prune them when renaming or deleting a component.

### The build validates itself

`tsdown.config.ts` runs three checks on every build, all at `level: "error"`:

- **publint** — `package.json` `exports`/`main`/`types` actually match the files
  on disk.
- **attw** — declaration files resolve under every module-resolution mode. The
  wildcard subpath exports (`xiod-ui/button`) can't be auto-discovered, so a
  sample is listed explicitly in `includeEntrypoints`; add to it if the export
  map's shape changes.
- **unplugin-unused** — no declared-but-unimported deps, and no imported-but-
  undeclared ones.

A build that passes is a package that is safe to publish. Don't disable these to
get a green build — fix the cause.

### The component library tests itself

`tests/components/` contains focused Vitest and Testing Library contracts for
the complete public component catalog. The catalog suite dynamically imports
every `src/components/*.tsx` entrypoint and compares it with an explicit list of
89 modules. When adding, removing, or renaming a component, update that list in
the same change.

Component tests should exercise public behavior rather than private state:

- Query interactive elements by accessible role and name.
- Cover meaningful controlled, uncontrolled, disabled, read-only, invalid,
  loading, empty, and completed states where the component supports them.
- Exercise keyboard navigation and callback payloads for interactive controls.
- Test custom canvas/layout components with deterministic browser API mocks from
  `tests/setup.ts`; do not assert animation implementation details.
- Keep tests warning-free. Console warnings, unhandled promises, and React
  `act()` warnings are failures to fix, not output to suppress.

`tests/browser/` is the real-browser interaction harness. Playwright verifies
focus movement and restoration, menus/selects/dialogs, specialized inputs,
mobile overflow, and uncaught console/page errors. Axe scans the settled initial,
open-menu, open-listbox, and open-dialog states against WCAG A/AA rules. Install
Chromium with `bunx playwright install chromium` before running it locally.

Use Bun for dependency installation and scripts. The current development test
tools require Node.js 22.22.2+ (22.x), 24.15.0+ (24.x), or 26+; this is separate
from the published package's Node.js 20 minimum. Use `bun update` after dependency
upgrades to refresh compatible transitive dependencies and installed React peers,
and commit package.json and bun.lock together.

Keep TypeScript pinned to 6.0.3 while the declaration builder's TypeScript 7
integration is experimental. Prefer verified compatible versions over upgrading
through unresolved conflicts; re-evaluate this pin only with release validation.
Require stable releases for directly declared dependencies. Do not override an
upstream tool's transitive prerelease solely because of its version label.

`bun run check` includes component tests and is the normal development gate.
`bun run check:release` adds the Chromium suite and is mandatory before tagging
or publishing. `prepublishOnly` invokes the release gate automatically.

Release packaging must stay source-map-free. `prepack` rebuilds and runs
`check:package` to verify the exact output inventory and reject disclosure
patterns and symlinks. `test:release` regression-tests that gate; `test:package`
installs a real tarball in a temporary consumer and verifies files, exports, SSR,
and types. Both are part of `check:release`. Use `bun run pack:package` to create
a local tarball without publishing. Never bypass hooks for a release. Only the
gate's internal dry-run and the isolated consumer install suppress scripts.

Publishing is local-only; this repository has no GitHub Actions workflows.
Keep README.md consumer-facing. Keep the verification and publishing guidance
in this section aligned with package scripts.
`bun run pack:dry-run` runs the release checks and previews the package inventory.
`bun run publish:package` calls `npm publish`, which invokes the release checks
through `prepublishOnly` and the final packaging gate through `prepack`.
`bun run publish:package --dry-run` rehearses this without uploading. Real
publishing always requires explicit user authorization. Do not add automated
release workflows or publishing tokens without a new request.

### Key rules to follow

| Rule                         | Requirement                                         |
| ---------------------------- | --------------------------------------------------- |
| `typescript/no-explicit-any` | Avoid `any` — use specific types                    |
| `no-unused-vars`             | Remove unused bindings; prefix intentional ones `_` |
| `import/no-cycle`            | No circular imports between components              |
| `no-console`                 | Only `console.warn` / `console.error` are allowed   |
| Import ordering              | `oxfmt` auto-sorts — do not hand-order              |

The lint configuration sets `maxWarnings` to zero. A successful lint run must
report zero errors and zero warnings.

### Tailwind class sorting is deliberately OFF

`oxfmt` can sort Tailwind classes (`sortTailwindcss`), but it is disabled.
XiodUI's `cn` is the `cn` package, a tailwind-merge-style merger that resolves
conflicting utilities by **last-wins within a class string** — so reordering
classes inside a literal can change which utility survives the merge. Do not
enable it without auditing the resulting diff.

---

## 27. Pattern Selection Guide

Use this decision tree to choose the right component pattern:

```
Does the component wrap a Base UI primitive?
├── YES: Does it need polymorphic rendering (render prop)?
│   ├── YES: Does it have visual variants (multiple sizes/styles)?
│   │   ├── YES → Pattern B+C (useRender + mergeProps + CVA)
│   │   │   Examples: Button, Badge, CornerBadge, Text
│   │   └── NO  → Pattern B (useRender + mergeProps)
│   │       Examples: Card parts, BreadcrumbLink, Gauge, AspectRatio
│   └── NO:  Does it have visual variants?
│       ├── YES → Pattern C (CVA on primitive)
│       │   Examples: Alert, Toggle, Select trigger
│       └── NO  → Pattern A (Direct primitive wrapper)
│           Examples: Accordion, Checkbox, Switch, Progress, Field
└── NO:  Is it a pure HTML/presentational component?
    ├── Does it need polymorphic rendering?
    │   ├── YES → Pattern B (useRender + mergeProps)
    │   │   Examples: DrawerMenu, DrawerBar, OTPFieldGroup
    │   └── NO  → Plain HTML with cn()
    │       Examples: Table, Skeleton, Kbd, Empty
    └── Is it a compound component with shared state?
        └── YES → Context pattern + child components
            Examples: ButtonSplit, ToggleGroup, Drawer
```

### When to use `export function` vs `function` + separate `export`

- **Inline `export function`**: OK for simple components and sub-parts when the file has many exports
- **Separate `export { ... }` at bottom**: Preferred for main components and when backward-compatible aliases are needed

---

## 28. Base UI Event System & State Customization

Base UI uses custom event handlers (`onOpenChange`, `onValueChange`, `onPressedChange`) that differ from standard DOM events. Understanding this system is critical for building components that integrate correctly.

### Event Signatures

```tsx
onOpenChange: (open: boolean, eventDetails: EventDetails) => void
onValueChange: (value: T, eventDetails: EventDetails) => void
onPressedChange: (pressed: boolean, eventDetails: EventDetails) => void
```

### The `eventDetails` Object

The second argument to all Base UI change handlers provides:

| Property             | Type         | Purpose                                                                              |
| -------------------- | ------------ | ------------------------------------------------------------------------------------ |
| `reason`             | `string`     | Why the change occurred (e.g., `'trigger-press'`, `'escape-key'`, `'outside-press'`) |
| `event`              | `Event`      | The native DOM event that caused the change                                          |
| `cancel()`           | `() => void` | Stops the component from changing its internal state                                 |
| `allowPropagation()` | `() => void` | Lets the DOM event propagate (Base UI stops Escape propagation by default)           |

### Usage in XiodUI

- Use `cancel()` to prevent a state transition without making the component controlled
- Use `allowPropagation()` to let Escape close parent popups (Base UI stops Escape propagation by default)
- **Always forward** `onOpenChange`/`onValueChange` props when wrapping Base UI primitives so consumers can use controlled or uncontrolled mode
- Keep components **uncontrolled** in examples unless demonstrating controlled behavior

---

## 29. Platform & Environment Notes

### Portal Stacking

XiodUI uses `isolation: isolate` on the app root so portaled popups always render above app content. Do **not** add excessive `z-index` values (`z-[9999]`). Use `z-50` for overlays.

### iOS Safari (iOS 26+)

XiodUI's `src/styles.css` includes `body { position: relative }` so that backdrops (Dialog, AlertDialog, Drawer) correctly cover the visual viewport on iOS 26+ where content beneath the UI chrome is visible. When authoring new backdrop components, test coverage after page scroll on iOS.

---

## 30. Checklist — Before Submitting a New Component

### Source Code

```
[ ] File lives in src/components/<kebab-name>.tsx
[ ] "use client" is the first line (if needed)
[ ] Use static imports from xiod-icons/icons/<Name>; let the formatter sort imports
[ ] Uses function declarations (not arrow functions, not React.FC)
[ ] No React.forwardRef (React 19 — ref is a regular prop)
[ ] No `any` types — use specific types (React.ComponentProps<"tag">, etc.)
[ ] All sub-parts have unique data-slot="<component-part>" attributes
[ ] className is destructured, passed through cn(), and placed LAST for override
[ ] Props extend Base UI primitive types (or React.ComponentProps<"tag">)
[ ] Uses design tokens (text-foreground, bg-popover, etc.), never raw colours
[ ] Responsive: base = mobile, sm: = desktop reduction
[ ] Touch: pointer-coarse targets on all interactive elements
[ ] Focus: focus-visible ring with ring-ring, ring-offset-background
[ ] Disabled: disabled:pointer-events-none disabled:opacity-64
[ ] Validation: aria-invalid states with destructive tokens
[ ] Dark mode: not-dark:bg-clip-padding, dark shadow inversion where applicable
[ ] Before-pseudo layering: rounded radius subtracted by 1px, pointer-events-none
[ ] Shadows: Use /N opacity syntax (shadow-xs/5, shadow-lg/5)
[ ] Animations: data-starting-style + data-ending-style for enter/exit
[ ] Transitions: specific properties, not transition-all
[ ] Padding: calc(--spacing(N)-1px) for bordered elements
[ ] Icons: svg size/opacity/pointer-events guards with [class*=] escapes
[ ] CVA: if variants exist, export the variants constant alongside the component
[ ] Exports: named only, with backward-compatible aliases where applicable
[ ] No unused imports
```

### Project Registration

```
[ ] Entrypoint added to tests/components/catalog-entrypoints.test.ts
[ ] Focused behavior/state tests added under tests/components
[ ] Real-browser coverage added when behavior depends on browser layout/focus/portals
[ ] Export names checked against every other module (see §19; the audit enforces collisions)
[ ] README component table updated (category + count)
```

### Verification

```
[ ] Run `bun run format`, then `bun run check:release`
[ ] Component tests, Chromium tests, and WCAG A/AA scans pass
[ ] Lint reports zero errors and zero warnings
[ ] Thoroughly tested visually in light + dark mode at mobile + desktop widths
```

---

## 31. Reference: Existing Component Catalog

| Component            | File                    | Pattern          | Key Techniques                                                                                         |
| -------------------- | ----------------------- | ---------------- | ------------------------------------------------------------------------------------------------------ |
| **Accordion**        | `accordion.tsx`         | Direct wrapper   | Height animation via `--accordion-panel-height`, chevron rotation                                      |
| **AgentSteps**       | `agent-steps.tsx`       | CVA + Context    | Timed progress sequence, compound step/icon/label parts, status variants                               |
| **AlertDialog**      | `alert-dialog.tsx`      | Direct wrapper   | Nested dialog stacking with `--nested-dialogs`, `bottomStickOnMobile`                                  |
| **Alert**            | `alert.tsx`             | CVA              | Grid layout adapts to svg/action presence via `has-[>svg]` / `has-data-[slot=alert-action]`            |
| **AspectRatio**      | `aspect-ratio.tsx`      | useRender        | CSS aspect-ratio property with polymorphic container                                                   |
| **Autocomplete**     | `autocomplete.tsx`      | Direct wrapper   | Composes `Input`, `ScrollArea`; dynamic padding based on trigger/clear presence                        |
| **Avatar**           | `avatar.tsx`            | Direct wrapper   | Minimal — rounded-full, fallback bg                                                                    |
| **Badge**            | `badge.tsx`             | CVA + useRender  | `[button&,a&]` selectors for interactive badge states                                                  |
| **Breadcrumb**       | `breadcrumb.tsx`        | useRender (link) | Polymorphic BreadcrumbLink, sr-only text                                                               |
| **Button**           | `button.tsx`            | CVA + useRender  | Full variant matrix, inset-shadow depth, `type` guard for render                                       |
| **ButtonGroup**      | `button-group.tsx`      | CVA + useRender  | Grouped control orientation, attached borders, polymorphic group text                                  |
| **ButtonSplit**      | `button-split.tsx`      | Context          | Composed primary action and popup trigger sharing button variants and size                             |
| **Calendar**         | `calendar.tsx`          | Direct wrapper   | Base UI date grid, range selection, month/year controls, locale-aware labels                           |
| **Card**             | `card.tsx`              | useRender        | CardFrame with clip-path for stacked cards, contextual padding via `in-` selectors                     |
| **Carousel**         | `carousel.tsx`          | Context          | Native scroll snap with desktop dragging, loop cycling, keyboard snap commands, and dots               |
| **Checkbox**         | `checkbox.tsx`          | Direct wrapper   | Render prop for indeterminate/checked indicator, inline SVG                                            |
| **CircularProgress** | `circular-progress.tsx` | Direct wrapper   | SVG-based circular indicator with animation                                                            |
| **Collapsible**      | `collapsible.tsx`       | Direct wrapper   | `--collapsible-panel-height` animation, alias export                                                   |
| **ColorPicker**      | `color-picker.tsx`      | Custom state     | Blossom hue picker, alpha control, HEX/RGBA/HSLA editing, controlled and uncontrolled modes            |
| **Combobox**         | `combobox.tsx`          | Direct wrapper   | Composes autocomplete-like pattern                                                                     |
| **Command**          | `command.tsx`           | Direct wrapper   | Search input with kbd styling                                                                          |
| **ContextMenu**      | `context-menu.tsx`      | Direct wrapper   | Right-click triggered menu, wraps Menu primitive                                                       |
| **CopyToClipboard**  | `copy-to-clipboard.tsx` | CVA              | Clipboard API integration, `useCopyToClipboard` hook, feedback animation                               |
| **CornerBadge**      | `corner-badge.tsx`      | CVA + useRender  | Positioned badge overlay for card corners                                                              |
| **DashboardGrid**    | `dashboard-grid.tsx`    | CVA + useRender  | Responsive drag-and-drop dashboard canvas grid, collision prevention, auto-compaction, resizable tiles |
| **DatePicker**       | `date-picker.tsx`       | Context          | Input/popover/calendar composition, date parsing, controlled selection                                 |
| **Dialog**           | `dialog.tsx`            | Direct wrapper   | ScrollArea panel, close button via Button render, `bottomStickOnMobile`                                |
| **DotMatrix**        | `dot-matrix.tsx`        | Custom canvas    | Deterministic dot-grid renderer with animation, palette, and resize handling                           |
| **Draggable**        | `draggable.tsx`         | CVA + useRender  | Draggable, resizable floating window overlay, bounds constraints, minimize/maximize controls           |
| **Drawer**           | `drawer.tsx`            | Direct wrapper   | Swipe-to-close, `--drawer-swipe-progress`, context for compound parts                                  |
| **Empty**            | `empty.tsx`             | Native HTML      | Simple empty-state layout                                                                              |
| **Field**            | `field.tsx`             | Direct wrapper   | Label, description, error sub-parts                                                                    |
| **Fieldset**         | `fieldset.tsx`          | Direct wrapper   | Legend-based fieldset                                                                                  |
| **FileUpload**       | `file-upload.tsx`       | Context          | Drag/drop and input selection, validation, previews, progress, and removal                             |
| **Form**             | `form.tsx`              | Direct wrapper   | Minimal layout (flex column, gap-4)                                                                    |
| **Frame**            | `frame.tsx`             | Direct wrapper   | Dashed border decoration for docs                                                                      |
| **Gauge**            | `gauge.tsx`             | useRender        | SVG arc gauge with configurable range                                                                  |
| **Grid**             | `grid.tsx`              | useRender        | CSS Grid layout wrapper with responsive column props                                                   |
| **Group**            | `group.tsx`             | Direct wrapper   | Flex layout wrapper                                                                                    |
| **InputGroup**       | `input-group.tsx`       | Direct wrapper   | Start/end addon composition                                                                            |
| **Input**            | `input.tsx`             | Direct wrapper   | Span wrapper for border/shadow, `nativeInput` escape hatch, autofill hack                              |
| **KineticClick**     | `kinetic-click.tsx`     | Custom canvas    | Shared particle canvas, 20 effect variants, pointer-origin effects, lifecycle cleanup                  |
| **Kbd**              | `kbd.tsx`               | Native HTML      | Keyboard shortcut display                                                                              |
| **Label**            | `label.tsx`             | Direct wrapper   | Field label styling                                                                                    |
| **ListBox**          | `list-box.tsx`          | Direct wrapper   | Selectable list items                                                                                  |
| **Loader**           | `loader.tsx`            | Native HTML      | Custom animated SVG loader variants, role="status"                                                     |
| **Marker**           | `marker.tsx`            | useRender (root) | Text and icon annotation component supporting separators, borders, and synchronized icon scaling       |
| **Message**          | `message.tsx`           | CVA + useRender  | Multi-layout message bubble suite supporting alignments, reaction overlays, and headers/footers        |
| **Menu**             | `menu.tsx`              | Direct wrapper   | Arrow SVG, submenu, checkbox+switch variants, radio items, DropdownMenu aliases                        |
| **Menubar**          | `menubar.tsx`           | Direct wrapper   | Horizontal menu bar, wraps Menu primitives                                                             |
| **Meter**            | `meter.tsx`             | Direct wrapper   | Track + indicator + value pattern                                                                      |
| **MorphicToast**     | `morphic-toast.tsx`     | External store   | Promise-aware notification store, live-region status, positions, actions, and lifecycle transitions    |
| **NavigationMenu**   | `navigation-menu.tsx`   | Direct wrapper   | Site navigation with nested submenus, viewport animation                                               |
| **NumberField**      | `number-field.tsx`      | Direct wrapper   | Increment/decrement buttons with input                                                                 |
| **OptionPicker**     | `option-picker.tsx`     | Custom state     | Searchable option popover with single/multiple selection and clear controls                            |
| **Orb**              | `orb.tsx`               | CVA + useRender  | 3D halftone point cloud engine, 0-allocation buffer, 16 state engines, 7 shape variants                |
| **InputOtp**         | `input-otp.tsx`         | Direct wrapper   | Multi-digit input with auto-focus, InputOtpGroup compound                                              |
| **Pagination**       | `pagination.tsx`        | Direct wrapper   | Nav with list items                                                                                    |
| **InputPayment**     | `input-payment.tsx`     | Context          | Stripe-like single field or standalone inputs with brand detection, InputPaymentGroup compound         |
| **InputPhone**       | `input-phone.tsx`       | CVA + useRender  | International phone number input with searchable country selector, auto-formatting, E.164 parsing      |
| **Popover**          | `popover.tsx`           | Direct wrapper   | Viewport animation, tooltipStyle mode, calendar detection                                              |
| **PreviewCard**      | `preview-card.tsx`      | Direct wrapper   | Link-triggered preview popover                                                                         |
| **Progress**         | `progress.tsx`          | Direct wrapper   | Default children pattern (auto Track+Indicator)                                                        |
| **Radio**            | `radio.tsx`             | Direct wrapper   | Custom radio indicator SVG                                                                             |
| **Resizable**        | `resizable.tsx`         | Context          | Keyboard/pointer panel resizing, constraints, collapse state, and persisted layouts                    |
| **RulerPicker**      | `ruler-picker.tsx`      | CVA              | Slider semantics, drag/wheel/keyboard value selection, tick rendering                                  |
| **ScrollArea**       | `scroll-area.tsx`       | Direct wrapper   | Scroll fade effect, gutter support                                                                     |
| **ScrollBar**        | `scroll-bar.tsx`        | Direct wrapper   | Base UI scrollbar/track/thumb composition with orientation variants                                    |
| **Select**           | `select.tsx`            | CVA + useRender  | ScrollUpArrow/DownArrow, SelectButton vs SelectTrigger dual pattern                                    |
| **InputSensitive**   | `input-sensitive.tsx`   | Direct wrapper   | Show/hide toggle for password-like inputs                                                              |
| **Separator**        | `separator.tsx`         | Direct wrapper   | Dynamic orientation, self-stretch for vertical                                                         |
| **Sidebar**          | `sidebar.tsx`           | Direct wrapper   | Provider context, cookie state, keyboard shortcut                                                      |
| **Sortable**         | `sortable.tsx`          | CVA + useRender  | Reorderable list/grid container, drag handles, active ghost overlay, keyboard navigation               |
| **Skeleton**         | `skeleton.tsx`          | Native HTML      | CSS gradient animation, dark mode highlight adjustment                                                 |
| **Slider**           | `slider.tsx`            | Direct wrapper   | Multi-thumb support, `thumbAlignment="edge"`, pill-shaped track                                        |
| **Switch**           | `switch.tsx`            | Direct wrapper   | `--thumb-size` custom prop, squish animation on active                                                 |
| **Table**            | `table.tsx`             | Native HTML      | Frame-mode via `data-slot=frame`, contextual cell styling                                              |
| **Tabs**             | `tabs.tsx`              | Direct wrapper   | Animated tab indicator via CSS variables, underline variant                                            |
| **Text**             | `text.tsx`              | CVA + useRender  | Polymorphic typography, auto semantic tags, weight/truncate variants                                   |
| **Textarea**         | `textarea.tsx`          | Direct wrapper   | Follows Input wrapper pattern                                                                          |
| **ThemeProvider**    | `theme-provider.tsx`    | Context          | System theme resolution, persistence, palette scoping, and transition suppression                      |
| **Timeline**         | `timeline.tsx`          | CVA              | Vertical/horizontal layouts, connector lines, variant styles                                           |
| **Toast**            | `toast.tsx`             | Direct wrapper   | Manager pattern, position-aware CSS, anchored variant, icon map                                        |
| **ToggleGroup**      | `toggle-group.tsx`      | Context          | Context provider for variant/size, separator styling                                                   |
| **Toggle**           | `toggle.tsx`            | CVA              | Pressed state, outline/default variants                                                                |
| **Toolbar**          | `toolbar.tsx`           | Direct wrapper   | Button/Link/Input/Group sub-parts                                                                      |
| **Tooltip**          | `tooltip.tsx`           | Direct wrapper   | Arrow SVG, viewport transition, `hideArrow` option                                                     |
| **Waveform**         | `waveform.tsx`          | useRender (root) | Deterministic SSR data, canvas-based visualizer, live microphone updates, accessibility keys           |
| **WheelPicker**      | `wheel-picker.tsx`      | CVA + Context    | 3D wheel rendering, spinbutton semantics, keyboard grouping, disabled options                          |

---

> **Remember:** Consistency is everything. When in doubt, open an existing component that solves a similar problem and mirror its patterns exactly. The design system's power comes from its uniformity.
