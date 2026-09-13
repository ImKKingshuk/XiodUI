import fs from "node:fs";
import path from "node:path";

const UI_DIR = path.join(process.cwd(), "src/components");

interface AuditViolation {
  rule: string;
  line?: number;
  message: string;
  severity: "error" | "warning";
}

interface AuditResult {
  file: string;
  violations: AuditViolation[];
}

// Components that render no DOM element of their own — context providers whose
// only output is <Context.Provider>. The data-slot and props-spread rules
// describe how a component forwards to an element it renders; with no element
// there is nothing to mark up and nothing to spread onto.
const NON_RENDERING = new Set(["theme-provider.tsx"]);

// Components that are purely presentational (no client-side APIs)
const PURE_PRESENTATIONAL = new Set([
  "skeleton.tsx",
  "table.tsx",
  "kbd.tsx",
  "empty.tsx",
  "grid.tsx",
]);

// Components that legitimately use raw colors (brand logos, custom visualizations)
const RAW_COLOR_EXEMPT = new Set([
  "color-picker.tsx",
  "kinetic-click.tsx",
  "input-payment.tsx",
  "morphic-toast.tsx",
  "waveform.tsx",
]);

// Components that are overlay/floating containers needing before-pseudo shadow system
const BORDERED_CONTAINERS = new Set([
  "card.tsx",
  "dialog.tsx",
  "alert-dialog.tsx",
  "popover.tsx",
  "drawer.tsx",
  "menu.tsx",
  "menubar.tsx",
  "context-menu.tsx",
  "select.tsx",
  "toast.tsx",
  "combobox.tsx",
  "autocomplete.tsx",
  "command.tsx",
]);

// Overlay components that should have data-starting-style / data-ending-style animations
const ANIMATED_OVERLAYS = new Set([
  "dialog.tsx",
  "alert-dialog.tsx",
  "drawer.tsx",
  "menu.tsx",
  "menubar.tsx",
  "context-menu.tsx",
  "select.tsx",
  "popover.tsx",
  "tooltip.tsx",
  "combobox.tsx",
  "autocomplete.tsx",
  "preview-card.tsx",
  "navigation-menu.tsx",
]);

function auditFile(filePath: string): AuditResult {
  const code = fs.readFileSync(filePath, "utf8");
  const baseName = path.basename(filePath);
  const violations: AuditViolation[] = [];
  const lines = code.split("\n");
  const isPurePresentational = PURE_PRESENTATIONAL.has(baseName);
  const isNonRendering = NON_RENDERING.has(baseName);

  // ─── RULE 1: "use client" as first line ───
  const hasClientImports =
    code.includes("@base-ui/react") ||
    code.includes("useState") ||
    code.includes("useEffect") ||
    code.includes("useRef") ||
    code.includes("useCallback") ||
    code.includes("useMemo") ||
    code.includes("useContext") ||
    code.includes("createContext") ||
    code.includes("useRender") ||
    code.includes("useId") ||
    code.includes("useLayoutEffect");

  if (hasClientImports && !isPurePresentational) {
    const firstLine = lines[0]?.trim();
    const secondLine = lines[1]?.trim();
    const hasUseClient =
      firstLine?.startsWith('"use client"') ||
      firstLine?.startsWith("'use client'") ||
      secondLine?.startsWith('"use client"') ||
      secondLine?.startsWith("'use client'");
    if (!hasUseClient) {
      violations.push({
        rule: 'Missing "use client"',
        severity: "error",
        message:
          "Must have '\"use client\"' as the very first line (AGENTS.md §3, §20).",
      });
    }
  }

  // ─── RULE 2: No React.forwardRef (React 19) ───
  if (code.includes("forwardRef") || code.includes("React.forwardRef")) {
    violations.push({
      rule: "No React.forwardRef",
      severity: "error",
      message:
        "Uses forwardRef. React 19 treats ref as a regular prop (AGENTS.md §24).",
    });
  }

  // ─── RULE 3: No React.FC ───
  if (code.includes("React.FC") || /\bFC</.test(code)) {
    violations.push({
      rule: "No React.FC",
      severity: "error",
      message:
        "Uses React.FC or FC<>. Use standard function declarations (AGENTS.md §24).",
    });
  }

  // ─── RULE 4: No default exports ───
  if (code.includes("export default")) {
    violations.push({
      rule: "No Default Exports",
      severity: "error",
      message:
        "Contains 'export default'. Components must use named exports only (AGENTS.md §19, §20).",
    });
  }

  // ─── RULE 5: No transition-all (except backdrops) ───
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (
      line.includes("transition-all") &&
      !line.includes("backdrop") &&
      !line.includes("Backdrop") &&
      !line.trim().startsWith("//") &&
      !line.trim().startsWith("*")
    ) {
      violations.push({
        rule: "No transition-all",
        line: i + 1,
        severity: "error",
        message:
          "Uses 'transition-all'. Specify exact transition properties (AGENTS.md §13).",
      });
    }
  }

  // ─── RULE 6: No asChild (Radix pattern) ───
  if (code.includes("asChild")) {
    violations.push({
      rule: "No asChild",
      severity: "error",
      message:
        "Uses 'asChild'. XiodUI uses Base UI's 'render' prop (AGENTS.md §20).",
    });
  }

  // ─── RULE 7: opacity-64 not opacity-50 ───
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (
      line.includes("opacity-50") &&
      !line.trim().startsWith("//") &&
      !line.trim().startsWith("*") &&
      !baseName.includes("kinetic-click")
    ) {
      violations.push({
        rule: "Opacity Constant Violation",
        line: i + 1,
        severity: "error",
        message: "Uses 'opacity-50' instead of 'opacity-64' (AGENTS.md §14).",
      });
    }
  }

  // ─── RULE 8: No excessive z-index ───
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Match z-[NNNN] patterns, excluding z-[1] or similar small values
    const zMatch = line.match(/z-\[(\d+)\]/);
    if (zMatch) {
      const zVal = Number.parseInt(zMatch[1], 10);
      if (zVal > 50) {
        violations.push({
          rule: "Excessive z-index",
          line: i + 1,
          severity: "warning",
          message: `Uses z-[${zVal}]. Use z-50 for overlays or z-10 for stacking (AGENTS.md §20, §29).`,
        });
      }
    }
  }

  // ─── RULE 9: No raw className concatenation ───
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Skip comments
    if (line.trim().startsWith("//") || line.trim().startsWith("*")) continue;

    if (line.includes("className=")) {
      // Check for template literal interpolation without cn()
      if (line.includes("${") && !line.includes("cn(")) {
        violations.push({
          rule: "Raw className Concatenation",
          line: i + 1,
          severity: "error",
          message:
            "Found template literal interpolation in className without cn() (AGENTS.md §2, §20).",
        });
      }
      // Check for string concatenation with + but exclude CSS sibling combinators (+ in selector strings)
      // Only flag if + is outside quotes and appears to concatenate strings
      if (
        line.includes("className={") &&
        /className=\{[^}]*\+/.test(line) &&
        !line.includes("cn(") &&
        !line.includes("cva(")
      ) {
        // Additional guard: ignore CSS sibling selector `+` inside quoted strings
        const outsideQuotes = line
          .replace(/'[^']*'/g, "")
          .replace(/"[^"]*"/g, "")
          .replace(/`[^`]*`/g, "");
        if (outsideQuotes.includes("+")) {
          violations.push({
            rule: "Raw className Concatenation",
            line: i + 1,
            severity: "error",
            message:
              "Found raw + concatenation in className. Use cn() (AGENTS.md §2).",
          });
        }
      }
    }
  }

  // ─── RULE 10: Border padding compensation (same-element only) ───
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith("//") || line.trim().startsWith("*")) continue;

    // Only check lines where BOTH a border class AND a padding class appear on the same element
    const hasBorderClass =
      /\bborder\b/.test(line) &&
      !line.includes("box-border") &&
      !line.includes("border-0") &&
      !line.includes("border-none") &&
      !line.includes("border-t") && // directional borders don't need all-axis compensation
      !line.includes("border-b") &&
      !line.includes("border-l") &&
      !line.includes("border-r") &&
      !line.includes("border-s") &&
      !line.includes("border-e");

    if (hasBorderClass) {
      // Look for px-N, py-N, or p-N without calc compensation
      const paddingMatch = line.match(
        /\b(p|px|py|pt|pb|pl|pr|ps|pe)-(\d+(?:\.\d+)?)\b/,
      );
      if (
        paddingMatch &&
        !line.includes("calc(") &&
        // Exclude before: pseudo classes
        !paddingMatch[0].includes("before:") &&
        // Exclude border-0 or border-none on the same line
        !line.includes("border-0") &&
        !line.includes("border-none")
      ) {
        violations.push({
          rule: "Missing Border Padding Compensation",
          line: i + 1,
          severity: "warning",
          message: `Border + padding '${paddingMatch[0]}' on same element without calc(-1px) compensation (AGENTS.md §6).`,
        });
      }
    }
  }

  // ─── RULE 11: Pointer-coarse touch targets ───
  // Dynamically detect interactive elements instead of hardcoded list
  const hasClickableElements =
    code.includes("<button") ||
    code.includes("Button.") ||
    code.includes("onClick") ||
    code.includes('type="button"') ||
    code.includes("Trigger") ||
    code.includes("Toggle") ||
    code.includes("Switch") ||
    code.includes("MenuItem") ||
    code.includes("Tab ");

  // Skip components that delegate to other XiodUI components which already have touch targets
  const delegatesInteractivity = [
    "button-group.tsx",
    "button-split.tsx",
    "toolbar.tsx",
    "toggle-group.tsx",
    "form.tsx",
    "field.tsx",
    "fieldset.tsx",
    "tooltip.tsx",
    "command.tsx",
    "dialog.tsx",
    "popover.tsx",
    "alert-dialog.tsx",
    "kinetic-click.tsx",
    "preview-card.tsx",
    "option-picker.tsx",
  ].includes(baseName);

  if (
    hasClickableElements &&
    !isPurePresentational &&
    !delegatesInteractivity &&
    !code.includes("pointer-coarse")
  ) {
    violations.push({
      rule: "Missing Touch Target Expansion",
      severity: "warning",
      message:
        "Interactive component missing 'pointer-coarse:after:...' 44x44px touch target (AGENTS.md §10).",
    });
  }

  // ─── RULE 12: data-slot attributes ───
  const hasDataSlot =
    code.includes("data-slot=") || code.includes('"data-slot"');
  if (
    !hasDataSlot &&
    !isPurePresentational &&
    !isNonRendering &&
    baseName !== "separator.tsx"
  ) {
    violations.push({
      rule: "Missing data-slot",
      severity: "error",
      message:
        "Missing data-slot attribute on component elements (AGENTS.md §8).",
    });
  }

  // ─── RULE 13: No raw Tailwind colors ───
  const rawColorRegex =
    /\b(bg|text|border|ring|shadow|outline|from|to|via)-(red|blue|green|yellow|purple|pink|orange|indigo|emerald|rose|amber|teal|cyan|violet|fuchsia|lime|sky|stone|gray|slate|neutral|zinc)-(50|100|200|300|400|500|600|700|800|900|950)\b/;
  if (!RAW_COLOR_EXEMPT.has(baseName)) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().startsWith("//") || line.trim().startsWith("*")) continue;
      // Also skip JSDoc and inline SVG fill/stroke attributes
      if (line.includes("fill=") || line.includes("stroke=")) continue;

      const match = line.match(rawColorRegex);
      if (match) {
        violations.push({
          rule: "Raw Tailwind Color",
          line: i + 1,
          severity: "error",
          message: `Uses raw color '${match[0]}'. Use semantic tokens (bg-destructive, text-primary, etc.) (AGENTS.md §5, §20).`,
        });
      }
    }
  }

  // ─── RULE 14: Before-pseudo shadow system on bordered containers ───
  if (BORDERED_CONTAINERS.has(baseName)) {
    if (
      code.includes("border") &&
      !code.includes("before:absolute") &&
      !code.includes("before:pointer-events-none") &&
      !code.includes("before:inset-0")
    ) {
      violations.push({
        rule: "Missing Before-Pseudo Shadow",
        severity: "warning",
        message:
          "Bordered container missing dual-layer before-pseudo shadow system (AGENTS.md §12).",
      });
    }
  }

  // ─── RULE 15: Arrow function component definitions ───
  // Detect exported arrow function components: const X = (...) => { ... }
  // We check for patterns like: const ComponentName = (props) => (
  // or: const ComponentName = ({ ... }: Props) => {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith("//") || line.trim().startsWith("*")) continue;

    // Match: export const/let ComponentName = (...) => or const ComponentName = React.memo(
    // But exclude: const someCallback =, const helperFunc =, const someRef =
    const arrowComponentMatch = line.match(
      /^(?:export\s+)?const\s+([A-Z][a-zA-Z0-9]+)\s*=\s*(?:\(|React)/,
    );
    if (arrowComponentMatch) {
      const name = arrowComponentMatch[1];
      // Skip CVA variants (e.g., const buttonVariants = cva(...))
      if (name.toLowerCase().includes("variant")) continue;
      // Skip context (e.g., const DrawerContext = React.createContext)
      if (name.includes("Context") || name.includes("Provider")) continue;
      // Skip re-exports (e.g., const DrawerPortal: typeof ...)
      if (line.includes("typeof") || line.includes(": typeof")) continue;
      // Skip Refs and other non-component constants
      if (line.includes("createContext") || line.includes("useRef")) continue;

      // Check if it's actually an arrow function (look at current or next few lines)
      const nextLines = lines.slice(i, Math.min(i + 5, lines.length)).join(" ");
      if (nextLines.includes("=>")) {
        violations.push({
          rule: "Arrow Function Component",
          line: i + 1,
          severity: "error",
          message: `'${name}' defined as arrow function. Use 'function ${name}(...)' declaration (AGENTS.md §4, §20, §24).`,
        });
      }
    }
  }

  // ─── RULE 16: cn() imported from the cn package ───
  if (code.includes("cn(")) {
    const hasCnPackageImport =
      code.includes('from "cn"') || code.includes("from 'cn'");
    const hasClsxImport =
      code.includes('from "clsx"') || code.includes("from 'clsx'");
    const hasTwMergeImport =
      code.includes("tailwind-merge") || code.includes("twMerge");

    if (!hasCnPackageImport) {
      violations.push({
        rule: "Wrong cn() Source",
        severity: "error",
        message:
          hasClsxImport || hasTwMergeImport
            ? "cn() must be imported from 'cn', not 'clsx' or 'tailwind-merge' (AGENTS.md §2)."
            : "cn() must be imported from 'cn' (AGENTS.md §2).",
      });
    }
  }

  // ─── RULE 17: className passed LAST in cn() for override capability ───
  // Check for cn(className, "...") which puts user className FIRST instead of LAST
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith("//") || line.trim().startsWith("*")) continue;

    // Pattern: cn(className, "some-classes") — className should be last
    if (/cn\(\s*className\s*,\s*["'`]/.test(line)) {
      violations.push({
        rule: "className Not Last in cn()",
        line: i + 1,
        severity: "error",
        message:
          "className must be the LAST argument in cn() so consumer overrides win (AGENTS.md §4).",
      });
    }
  }

  // ─── RULE 18: CVA variants exported alongside component ───
  if (code.includes("= cva(")) {
    // Find all CVA variable names
    const cvaMatches = code.matchAll(/const\s+(\w+)\s*=\s*cva\(/g);
    for (const match of cvaMatches) {
      const variantName = match[1];
      // Check if it's exported
      const isExported =
        code.includes(`export { ${variantName}`) ||
        code.includes(`${variantName},`) ||
        code.includes(`${variantName} }`) ||
        code.includes(`export const ${variantName}`) ||
        // Check in grouped export statement
        new RegExp(`export\\s*\\{[^}]*\\b${variantName}\\b[^}]*\\}`).test(code);
      if (!isExported) {
        violations.push({
          rule: "CVA Variants Not Exported",
          severity: "warning",
          message: `CVA constant '${variantName}' is not exported. Other components may need it (AGENTS.md §4, §6).`,
        });
      }
    }
  }

  // ─── RULE 19: Animated overlays must have data-starting-style / data-ending-style ───
  if (ANIMATED_OVERLAYS.has(baseName)) {
    if (
      !code.includes("data-starting-style") &&
      !code.includes("data-ending-style") &&
      !code.includes("@keyframes") &&
      !code.includes("data-open") &&
      !code.includes("data-closed")
    ) {
      violations.push({
        rule: "Missing Enter/Exit Animation",
        severity: "warning",
        message:
          "Overlay component missing data-starting-style/data-ending-style transitions or keyframe animations (AGENTS.md §13).",
      });
    }
  }

  // ─── RULE 20: No explicit 'any' type ───
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith("//") || line.trim().startsWith("*")) continue;

    // Match `: any`, `as any`, `<any>`, but not inside comments or strings.
    //
    // `React.JSXElementConstructor<any>` is exempt: it is React's own published
    // signature, reproduced verbatim by the explicit return-type annotations,
    // not an `any` anyone chose. Flagging it would report 80 unfixable hits and
    // train everyone to ignore this rule.
    if (
      /\b(:\s*any\b|as\s+any\b|<any>|<any,)/.test(line) &&
      !/JSXElementConstructor<any>/.test(line) &&
      !line.includes("// oxlint-disable") &&
      !line.includes("@ts-ignore") &&
      !line.includes("@ts-expect-error")
    ) {
      violations.push({
        rule: "No 'any' Type",
        line: i + 1,
        severity: "error",
        message:
          "Uses 'any' type. Use specific types (React.ComponentProps<'tag'>, etc.) (AGENTS.md §24, §26).",
      });
    }
  }

  // ─── RULE 21: Kebab-case filename ───
  const nameWithoutExt = baseName.replace(".tsx", "");
  const isKebabCase = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(nameWithoutExt);
  if (!isKebabCase) {
    violations.push({
      rule: "Non-Kebab-Case Filename",
      severity: "error",
      message: `Filename '${baseName}' is not kebab-case (AGENTS.md §3).`,
    });
  }

  // ─── RULE 22: Before-pseudo radius compensation ───
  // If a component uses before: pseudo with rounded, it should subtract 1px
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith("//") || line.trim().startsWith("*")) continue;

    if (
      /before:rounded-(sm|md|lg|xl|2xl|3xl)\b/.test(line) &&
      !line.includes("calc(") &&
      !line.includes("before:rounded-none")
    ) {
      violations.push({
        rule: "Before-Pseudo Radius Not Compensated",
        line: i + 1,
        severity: "warning",
        message:
          "before: pseudo uses rounded-* without calc(-1px) radius compensation (AGENTS.md §7, §12).",
      });
    }
  }

  // ─── RULE 23: SVG icon guards (for components that render icons) ───
  // Components importing xiod-icons should have SVG size/opacity/pointer-events guards
  const importsIcons = code.includes("xiod-icons");
  if (importsIcons && !isPurePresentational) {
    const hasSvgSizeGuard =
      code.includes("[&_svg") ||
      code.includes("[&_svg:not([class*='size-'])]") ||
      code.includes("[&_svg:not([class*=\\'size-\\'])]");
    if (!hasSvgSizeGuard) {
      violations.push({
        rule: "Missing SVG Icon Guards",
        severity: "warning",
        message:
          "Imports XiodIcons but missing [&_svg] size/opacity/pointer-events guards (AGENTS.md §18).",
      });
    }
  }

  // ─── RULE 24: Disabled state uses opacity-64 ───
  // Check for disabled:opacity- patterns that aren't 64
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith("//") || line.trim().startsWith("*")) continue;

    const disabledOpacityMatch = line.match(
      /(?:disabled|data-disabled):(?:\S*:)*opacity-(\d+)/,
    );
    if (disabledOpacityMatch) {
      const opacityVal = disabledOpacityMatch[1];
      if (opacityVal !== "64" && opacityVal !== "0") {
        violations.push({
          rule: "Wrong Disabled Opacity",
          line: i + 1,
          severity: "error",
          message: `Uses disabled opacity-${opacityVal} instead of opacity-64 (AGENTS.md §14).`,
        });
      }
    }
  }

  // ─── RULE 25: className not passed through cn() (direct className={className}) ───
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith("//") || line.trim().startsWith("*")) continue;

    // Match className={className} without cn() wrapping
    if (
      /className=\{className\}/.test(line) &&
      !line.includes("cn(") &&
      !line.includes("// pass-through")
    ) {
      violations.push({
        rule: "className Without cn()",
        line: i + 1,
        severity: "error",
        message:
          "Passes className directly without cn() merge (AGENTS.md §2, §20).",
      });
    }
  }

  // ─── RULE 26: dark: used for token-level color overrides (anti-pattern) ───
  // dark: should only be used for alpha adjustments, shadow inversions, bg-clip toggling
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith("//") || line.trim().startsWith("*")) continue;

    // Flag dark:text-COLOR or dark:bg-COLOR with full semantic token replacements
    // (these should use design tokens that auto-adapt to dark mode)
    const darkColorMatch = line.match(
      /dark:(text|bg|border)-(red|blue|green|yellow|purple|pink|orange|indigo|emerald|rose|amber|teal|cyan|violet|fuchsia|lime|sky)-(50|100|200|300|400|500|600|700|800|900|950)/,
    );
    if (darkColorMatch && !RAW_COLOR_EXEMPT.has(baseName)) {
      violations.push({
        rule: "Dark Mode Raw Color Override",
        line: i + 1,
        severity: "warning",
        message: `Uses 'dark:${darkColorMatch[0].replace("dark:", "")}'. Use tokens that auto-adapt to dark mode (AGENTS.md §11).`,
      });
    }
  }

  // ─── RULE 27: Props spread (...props) on root/primitive element ───
  // Every exported function component should spread ...props
  const exportedFunctions = isNonRendering
    ? []
    : code.matchAll(/(?:export\s+)?function\s+([A-Z][a-zA-Z0-9]+)\s*\(/g);
  for (const match of exportedFunctions) {
    const funcName = match[1];
    // Check if this function is actually exported
    const isExported =
      code.includes(`export function ${funcName}`) ||
      new RegExp(`export\\s*\\{[^}]*\\b${funcName}\\b[^}]*\\}`).test(code);

    if (isExported) {
      // Find the function's parameter destructuring
      const funcIndex = code.indexOf(match[0]);
      const funcBody = new Set(
        code.slice(funcIndex, funcIndex + 1500).match(/\.\.\.(?:props|rest)/g),
      );
      if (
        !funcBody.has("...props") &&
        !funcBody.has("...rest") &&
        // Skip utility functions
        !funcName.includes("Svg") &&
        !funcName.includes("Arrow") &&
        funcName !== "ArrowSvg"
      ) {
        violations.push({
          rule: "Missing Props Spread",
          severity: "warning",
          message: `'${funcName}' does not destructure '...props' for spreading (AGENTS.md §4).`,
        });
      }
    }
  }

  // ─── RULE 28: Accessible focus-visible ring on interactive elements ───
  // Interactive components should have focus-visible ring styles
  const isDirectlyInteractive = [
    "button.tsx",
    "checkbox.tsx",
    "radio.tsx",
    "switch.tsx",
    "toggle.tsx",
    "select.tsx",
    "input.tsx",
    "textarea.tsx",
    "slider.tsx",
    "number-field.tsx",
    "input-otp.tsx",
    "tabs.tsx",
  ].includes(baseName);

  if (isDirectlyInteractive) {
    const hasFocusRing =
      code.includes("focus-visible:ring") ||
      code.includes("has-focus-visible:ring") ||
      code.includes("focus-visible:border-ring") ||
      code.includes("has-focus-visible:border-ring");
    if (!hasFocusRing) {
      violations.push({
        rule: "Missing Focus Ring",
        severity: "warning",
        message:
          "Interactive component missing focus-visible:ring-* or has-focus-visible styles (AGENTS.md §14).",
      });
    }
  }

  // ─── RULE 29: Shadows with opacity syntax ───
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith("//") || line.trim().startsWith("*")) continue;

    // Check for shadow-xs, shadow-sm, shadow-md, shadow-lg WITHOUT /N opacity
    const shadowMatch = line.match(/\bshadow-(xs|sm|md|lg|xl|2xl)\b/);
    if (
      shadowMatch &&
      !line.includes(`${shadowMatch[0]}/`) &&
      !line.includes("shadow-none") &&
      !line.includes("shadow-[") &&
      !line.includes("inset-shadow") &&
      !line.includes("before:shadow") &&
      !line.includes("drop-shadow")
    ) {
      // This is a warning, not error, as some shadows may intentionally use full opacity
      violations.push({
        rule: "Shadow Without Opacity",
        line: i + 1,
        severity: "warning",
        message: `'${shadowMatch[0]}' without /N opacity modifier. Use e.g. shadow-xs/5 (AGENTS.md §12).`,
      });
    }
  }

  // ─── RULE 30: Unused imports detected ───
  // Oxlint checks unused imports through `bun run lint`, included in `bun run check`.
  // Keep this audit focused on design-system rules rather than duplicating lint.

  return {
    file: baseName,
    violations,
  };
}

/**
 * Cross-module rule: no two modules may export the same name.
 *
 * This one is package-specific and has no equivalent in the docs site. While a
 * root barrel existed, `export *` turned a duplicate name into a compile error
 * (TS2308) — that is how the `ButtonGroup` and `Toggle` collisions were caught.
 * The barrel is gone, so nothing enforces it any more: two modules can export
 * the same name, both build fine, and the consumer silently gets whichever one
 * their editor auto-imported. See AGENTS.md §19.
 */
function auditExportNames(files: string[]): AuditResult[] {
  const owners = new Map<string, string[]>();

  for (const file of files) {
    const code = fs.readFileSync(path.join(UI_DIR, file), "utf8");
    const names = new Set<string>();

    // Names this module imported from a sibling module. Re-exporting one of
    // those is not a collision — it is the *same* symbol surfaced from a second
    // path, which is a deliberate convenience (`scroll-area` re-exports
    // `ScrollBar`). TypeScript treated these the same way: `export *` dedupes
    // identical symbols, so they never raised TS2308 either.
    const reExported = new Set<string>();
    for (const m of code.matchAll(
      /^import\s*\{([^}]*)\}\s*from\s*"\.\/[^"]+"/gm,
    )) {
      for (const raw of m[1].split(",")) {
        const name = raw
          .trim()
          .replace(/^type\s+/, "")
          .split(/\s+as\s+/)
          .pop();
        if (name) reExported.add(name);
      }
    }

    // Trailing `export { A, B as C, type D }` blocks — the house convention.
    for (const m of code.matchAll(/^export\s*\{([^}]*)\}/gms)) {
      for (const raw of m[1].split(",")) {
        const name = raw
          .trim()
          .replace(/^type\s+/, "")
          .split(/\s+as\s+/)
          .pop();
        if (name) names.add(name);
      }
    }
    // Inline `export const/function/type/interface Foo`.
    for (const m of code.matchAll(
      /^export\s+(?:declare\s+)?(?:const|function|class|type|interface)\s+(\w+)/gm,
    )) {
      if (m[1]) names.add(m[1]);
    }

    for (const name of names) {
      if (reExported.has(name)) continue;
      owners.set(name, [...(owners.get(name) ?? []), file]);
    }
  }

  const results: AuditResult[] = [];
  for (const [name, files_] of owners) {
    if (files_.length < 2) continue;
    for (const file of files_) {
      const others = files_.filter((f) => f !== file).join(", ");
      results.push({
        file,
        violations: [
          {
            rule: "Duplicate Export Name",
            severity: "error",
            message: `Exports '${name}', which is also exported by ${others}. Each name must have exactly one owning module (AGENTS.md §19).`,
          },
        ],
      });
    }
  }
  return results;
}

function runAudit() {
  const files = fs.readdirSync(UI_DIR).filter((f) => f.endsWith(".tsx"));
  const results: AuditResult[] = [];
  let totalViolations = 0;
  let errorCount = 0;
  let warningCount = 0;

  for (const file of files) {
    const filePath = path.join(UI_DIR, file);
    const result = auditFile(filePath);
    if (result.violations.length > 0) results.push(result);
  }

  results.push(...auditExportNames(files));

  for (const r of results) {
    totalViolations += r.violations.length;
    errorCount += r.violations.filter((v) => v.severity === "error").length;
    warningCount += r.violations.filter((v) => v.severity === "warning").length;
  }

  // Output summary
  console.log(
    "═══════════════════════════════════════════════════════════════",
  );
  console.log("  XiodUI Design System Audit — AGENTS.md Compliance");
  console.log(
    "═══════════════════════════════════════════════════════════════",
  );
  console.log(`  Files scanned: ${files.length}`);
  console.log(`  Files with issues: ${results.length}`);
  console.log(`  Total violations: ${totalViolations}`);
  console.log(`  Errors: ${errorCount}  |  Warnings: ${warningCount}`);
  console.log(
    "═══════════════════════════════════════════════════════════════\n",
  );

  for (const result of results) {
    console.log(`\n📄 ${result.file}`);
    console.log("─".repeat(50));
    for (const v of result.violations) {
      const icon = v.severity === "error" ? "❌" : "⚠️";
      const lineInfo = v.line ? ` L${v.line}` : "";
      console.log(`  ${icon} [${v.rule}]${lineInfo}`);
      console.log(`     ${v.message}`);
    }
  }

  if (results.length === 0) {
    console.log("✅ All components pass AGENTS.md compliance checks!\n");
  }

  // JSON is opt-in (`--json`). Dumping it unconditionally buries the readable
  // report under a few hundred lines whenever anything fails.
  if (process.argv.includes("--json")) {
    console.log("\n--- JSON Output ---");
    console.log(JSON.stringify(results, null, 2));
  }

  // Errors fail the build; warnings are advisory. Without this the audit is a
  // report nobody reads rather than a gate.
  if (errorCount > 0) process.exit(1);
}

runAudit();
