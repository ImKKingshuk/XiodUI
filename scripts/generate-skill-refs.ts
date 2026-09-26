/**
 * Generates `skills/xiod-ui/references/components/<slug>.md` — one reference
 * page per component, read on demand by an agent that has already loaded
 * `skills/xiod-ui/SKILL.md`.
 *
 * Source of truth is `src/components/*.tsx`, read through the TypeScript
 * compiler. No extra dependency: `typescript` is already here, and going
 * through the checker rather than a regex means the prop types printed are the
 * ones the compiler resolves, including the ones Base UI contributes.
 *
 * Props inherited from the DOM (`@types/react`, `typescript/lib`) are dropped.
 * Every component spreads them, so listing them would bury the handful of props
 * that are actually XiodUI's in a few hundred that are not.
 *
 */

import * as fs from "node:fs";
import * as path from "node:path";

import * as ts from "typescript";

const ROOT = process.cwd();
const COMPONENTS_DIR = path.join(ROOT, "src", "components");
const OUT_DIR = path.join(
  ROOT,
  "skills",
  "xiod-ui",
  "references",
  "components",
);

interface PropEntry {
  name: string;
  type: string;
  default?: string;
  description?: string[];
  required: boolean;
}

interface ParamEntry {
  name: string;
  type: string;
  optional: boolean;
}

interface ExportEntry {
  kind: "component" | "hook" | "manager" | "handle";
  name: string;
  description?: string;
  props: PropEntry[];
  /** Undefined when the call signature could not be resolved. */
  params?: ParamEntry[];
  supportsRender: boolean;
  /** The intrinsic element a component renders, when its props name one. */
  element?: string;
  /** A manager's methods. */
  methods?: string[];
  /** A hook's return type. */
  returns?: string;
}

/** A prop declared in React's or TypeScript's own typings is not ours. */
function isAmbientProp(symbol: ts.Symbol): boolean {
  return (symbol.getDeclarations() ?? []).some((declaration) => {
    const file = declaration.getSourceFile().fileName;
    return (
      file.includes("@types/react") || file.includes("node_modules/typescript/")
    );
  });
}

function firstDeclaration(symbol: ts.Symbol): ts.Declaration | undefined {
  return symbol.getDeclarations()?.[0];
}

/**
 * `cva(..., { defaultVariants: { variant: "default" } })` is where a variant's
 * default actually lives; the component signature leaves the prop `undefined`
 * and lets cva fill it in. Keyed by the variable the cva call is assigned to,
 * so a file holding several recipes does not mix them up.
 */
function collectVariantDefaults(
  source: ts.SourceFile,
): Map<string, Map<string, string>> {
  const recipes = new Map<string, Map<string, string>>();

  const visit = (node: ts.Node): void => {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer &&
      ts.isCallExpression(node.initializer) &&
      node.initializer.expression.getText() === "cva"
    ) {
      const config = node.initializer.arguments[1];
      if (config && ts.isObjectLiteralExpression(config)) {
        const entry = config.properties.find(
          (property) =>
            ts.isPropertyAssignment(property) &&
            property.name.getText() === "defaultVariants",
        );
        if (
          entry &&
          ts.isPropertyAssignment(entry) &&
          ts.isObjectLiteralExpression(entry.initializer)
        ) {
          const defaults = new Map<string, string>();
          for (const property of entry.initializer.properties) {
            if (!ts.isPropertyAssignment(property)) continue;
            defaults.set(
              property.name.getText(),
              property.initializer.getText(),
            );
          }
          recipes.set(node.name.getText(), defaults);
        }
      }
    }
    ts.forEachChild(node, visit);
  };

  visit(source);
  return recipes;
}

/** The recipe a component actually uses is the one it names in its body. */
function recipeDefaults(
  declaration: ts.Declaration,
  recipes: Map<string, Map<string, string>>,
): Map<string, string> {
  let found: Map<string, string> | undefined;

  const visit = (node: ts.Node): void => {
    if (found) return;
    if (ts.isIdentifier(node)) {
      const match = recipes.get(node.getText());
      if (match) {
        found = match;
        return;
      }
    }
    ts.forEachChild(node, visit);
  };

  visit(declaration);
  return found ?? new Map();
}

/**
 * Recovers a default from the destructuring pattern in the component body —
 * `function Button({ variant = "default" })`. Declaration files have no
 * initializers, which is why this script reads sources rather than `dist`.
 */
function collectDefaults(declaration: ts.Declaration): Map<string, string> {
  const defaults = new Map<string, string>();

  const parameters = ts.isFunctionLike(declaration)
    ? declaration.parameters
    : undefined;
  const pattern = parameters?.[0]?.name;
  if (!pattern || !ts.isObjectBindingPattern(pattern)) return defaults;

  for (const element of pattern.elements) {
    if (!element.initializer || !ts.isIdentifier(element.name)) continue;
    const name = (element.propertyName ?? element.name).getText();
    defaults.set(name, element.initializer.getText());
  }

  return defaults;
}

function callSignatureOf(
  checker: ts.TypeChecker,
  symbol: ts.Symbol,
  declaration: ts.Declaration,
): ts.Signature | undefined {
  return checker
    .getTypeOfSymbolAtLocation(symbol, declaration)
    .getCallSignatures()[0];
}

/** The props object is the first parameter of the first call signature. */
function propsTypeOf(
  checker: ts.TypeChecker,
  symbol: ts.Symbol,
  declaration: ts.Declaration,
): ts.Type | undefined {
  const parameter = callSignatureOf(
    checker,
    symbol,
    declaration,
  )?.getParameters()[0];
  if (!parameter) return undefined;

  const parameterDeclaration = firstDeclaration(parameter);
  if (!parameterDeclaration) return undefined;

  return checker.getTypeOfSymbolAtLocation(parameter, parameterDeclaration);
}

/**
 * The full parameter list. A component takes one props object, so only the
 * first parameter matters; a hook can take several, and reporting just the
 * first would silently hide the rest.
 */
function readParams(
  checker: ts.TypeChecker,
  signature: ts.Signature,
): ParamEntry[] {
  return signature.getParameters().map((parameter) => {
    const declaration = firstDeclaration(parameter);
    const type = declaration
      ? checker
          .typeToString(
            checker.getTypeOfSymbolAtLocation(parameter, declaration),
          )
          .replaceAll(/\s+/g, " ")
      : "unknown";

    return {
      name: parameter.getName(),
      type,
      // A parameter with an initializer is optional at the call site even
      // though it carries no question token.
      optional:
        declaration !== undefined &&
        ts.isParameter(declaration) &&
        (declaration.questionToken !== undefined ||
          declaration.initializer !== undefined),
    };
  });
}

/**
 * A prop's doc comment as the lines of a list item. Prose is joined onto one
 * line, but a list inside the comment (Base UI documents each option of a
 * prop as `- \`value\`: …`) stays a list, one line per option, instead of
 * being run together into a single paragraph.
 */
function describe(checker: ts.TypeChecker, symbol: ts.Symbol): string[] {
  const blocks: string[] = [];
  let open = false;
  for (const raw of ts
    .displayPartsToString(symbol.getDocumentationComment(checker))
    .split("\n")) {
    const line = raw.trim();
    if (!line) {
      open = false;
    } else if (open && !line.startsWith("- ")) {
      blocks[blocks.length - 1] += ` ${line}`;
    } else {
      blocks.push(line);
      open = true;
    }
  }
  return blocks.map((block) => block.replaceAll(/\s+/g, " "));
}

/**
 * An export's own doc comment, kept as written. Unlike {@link describe}, which
 * flattens to one line for a list item, this keeps paragraph and fenced-code
 * structure so a doc comment carrying an example stays copy-pasteable.
 */
function describeBlock(checker: ts.TypeChecker, symbol: ts.Symbol): string {
  return ts
    .displayPartsToString(symbol.getDocumentationComment(checker))
    .replaceAll(/[^\S\n]+$/gm, "")
    .replaceAll(/\n{3,}/g, "\n\n")
    .trim();
}

function readProps(
  checker: ts.TypeChecker,
  symbol: ts.Symbol,
  declaration: ts.Declaration,
  recipes: Map<string, Map<string, string>>,
): PropEntry[] {
  const propsType = propsTypeOf(checker, symbol, declaration);
  if (!propsType) return [];

  const defaults = new Map([
    ...recipeDefaults(declaration, recipes),
    ...collectDefaults(declaration),
  ]);

  return (
    propsType
      .getProperties()
      // When a component supports `render`, its printed type is several lines
      // long. SKILL.md explains the API once, so omit it from prop tables.
      .filter((property) => property.getName() !== "render")
      .filter((property) => !isAmbientProp(property))
      .map((property) => {
        const propertyDeclaration = firstDeclaration(property);
        const type = propertyDeclaration
          ? checker.typeToString(
              checker.getTypeOfSymbolAtLocation(property, propertyDeclaration),
            )
          : "unknown";

        return {
          name: property.getName(),
          type: type.replaceAll(/\s+/g, " "),
          default: defaults.get(property.getName()),
          description: describe(checker, property),
          required: (property.flags & ts.SymbolFlags.Optional) === 0,
        };
      })
      .toSorted((a, b) => a.name.localeCompare(b.name))
  );
}

/** Public API values useful to an agent composing interfaces. */
function publicValueKind(
  checker: ts.TypeChecker,
  name: string,
  type: ts.Type,
): ExportEntry["kind"] | undefined {
  if (name.startsWith("use")) return "hook";
  // An imperative API object: `toastManager`, `morphicToast`.
  if (
    /^[a-z]/.test(name) &&
    type.getCallSignatures().length === 0 &&
    type
      .getProperties()
      .some(
        (member) =>
          checker.getTypeOfSymbol(member).getCallSignatures().length > 0,
      )
  ) {
    return "manager";
  }
  if (name.endsWith("CreateHandle")) return "handle";
  if (
    /^[A-Z]/.test(name) &&
    !name.endsWith("Context") &&
    type.getCallSignatures().length > 0
  ) {
    return "component";
  }
  return undefined;
}

function cell(value: string): string {
  return value.replaceAll("|", "\\|").replaceAll("\n", " ");
}

/**
 * Base UI's doc comments name parts the Base UI way — `Dialog.Root`,
 * `<Popover.Close>`, `Dialog.createHandle()`. XiodUI exports them flat, as
 * `Dialog`, `PopoverClose` and `DialogCreateHandle`, and an agent that copies
 * the dotted form writes code that does not compile. Rewrite a dotted name
 * only when the flat name really is an export of the library.
 */
let exportedNames = new Set<string>();

function xiodNames(text: string): string {
  return text.replaceAll(
    /\b([A-Z][A-Za-z]*)\.(Root|createHandle|[A-Z][A-Za-z]*)\b/g,
    (match, root: string, part: string) => {
      const flat =
        part === "Root"
          ? root
          : part === "createHandle"
            ? `${root}CreateHandle`
            : `${root}${part}`;
      return exportedNames.has(flat) ? flat : match;
    },
  );
}

function propsTable(props: PropEntry[], firstHeading: string): string[] {
  // Most props leave their default to Base UI or to `undefined`; a column of
  // dashes tells the reader nothing, so it appears only when a row fills it.
  const withDefaults = props.some((prop) => prop.default);
  const lines = withDefaults
    ? [`| ${firstHeading} | Type | Default |`, "| :--- | :--- | :--- |"]
    : [`| ${firstHeading} | Type |`, "| :--- | :--- |"];

  for (const prop of props) {
    const name = prop.required ? `**${prop.name}**` : prop.name;
    const type = `\`${cell(prop.type)}\``;
    if (!withDefaults) {
      lines.push(`| ${name} | ${type} |`);
      continue;
    }
    const fallback = prop.default ? `\`${cell(prop.default)}\`` : "—";
    lines.push(`| ${name} | ${type} | ${fallback} |`);
  }
  lines.push("");

  const documented = props.filter((prop) => prop.description?.length);
  for (const prop of documented) {
    const [first, ...rest] = (prop.description ?? []).map(xiodNames);
    lines.push(`- \`${prop.name}\` — ${first}`);
    for (const block of rest) {
      lines.push(`  ${block}`);
    }
  }
  if (documented.length > 0) lines.push("");

  return lines;
}

/**
 * A hook is documented by its arity, not by a prop table. `props` here holds
 * the members of the first argument, which says nothing about how many
 * arguments there are — an empty list means "no documented fields on the first
 * argument", never "takes nothing".
 */
function renderHook(entry: ExportEntry): string[] {
  const { params } = entry;

  if (!params) {
    return [
      "Call signature could not be resolved. Refer to the exported",
      "TypeScript type.",
      "",
    ];
  }

  const lines = [
    "```tsx",
    `${entry.name}(${params
      .map((parameter) =>
        parameter.optional ? `${parameter.name}?` : parameter.name,
      )
      .join(", ")})`,
    "```",
    "",
  ];

  if (entry.returns && entry.returns !== "void") {
    lines.push(`Returns \`${entry.returns}\`.`, "");
  }

  if (params.length === 0) return lines;

  const [first, ...rest] = params;

  if (entry.props.length > 0) {
    lines.push(`\`${first.name}\` — \`${cell(first.type)}\`:`, "");
    lines.push(...propsTable(entry.props, "Field"));
  } else {
    lines.push(`- \`${first.name}\` — \`${cell(first.type)}\``);
    if (rest.length === 0) lines.push("");
  }

  if (rest.length > 0) {
    for (const parameter of rest) {
      lines.push(`- \`${parameter.name}\` — \`${cell(parameter.type)}\``);
    }
    lines.push("");
  }

  return lines;
}

/**
 * A hook's return type with named object types spelled out. `useTheme()`
 * returning `ThemeContextValue` tells an agent nothing it can destructure;
 * `{ theme: …; setTheme: … }` does. Unions keep their other members, so
 * `TimelineContextValue | undefined` still reads as possibly undefined.
 */
function returnShape(
  checker: ts.TypeChecker,
  type: ts.Type,
  at: ts.Node,
): string {
  const print = (inner: ts.Type): string =>
    checker.typeToString(inner, undefined, ts.TypeFormatFlags.NoTruncation);

  const expand = (inner: ts.Type): string => {
    const named = inner.aliasSymbol ?? inner.getSymbol();
    const properties = inner.getProperties();
    // Only object shapes XiodUI declares itself. React's types and mapped
    // types (`Partial<Record<IconName, …>>`) read better by name.
    const declaration = named && firstDeclaration(named);
    const ownShape =
      declaration !== undefined &&
      declaration.getSourceFile().fileName.startsWith(COMPONENTS_DIR) &&
      (ts.isInterfaceDeclaration(declaration) ||
        (ts.isTypeAliasDeclaration(declaration) &&
          (ts.isTypeLiteralNode(declaration.type) ||
            ts.isIntersectionTypeNode(declaration.type))));
    if (
      !named ||
      !ownShape ||
      properties.length === 0 ||
      inner.getCallSignatures().length > 0 ||
      checker.isArrayType(inner) ||
      checker.isTupleType(inner)
    ) {
      return print(inner);
    }
    const members = properties.map((property) => {
      const optional = property.flags & ts.SymbolFlags.Optional ? "?" : "";
      return `${property.getName()}${optional}: ${print(checker.getTypeOfSymbolAtLocation(property, at))}`;
    });
    return `{ ${members.join("; ")} }`;
  };

  const text = type.isUnion()
    ? type.types.map(expand).join(" | ")
    : expand(type);
  return text.replaceAll(/\s+/g, " ");
}

/** `input-otp` → `InputOtp`, the name of the component a page is about. */
function pascalCase(slug: string): string {
  return slug.replaceAll(/(?:^|-)([a-z])/g, (_, letter: string) =>
    letter.toUpperCase(),
  );
}

/**
 * What a component renders and what that means for its props. The table lists
 * only XiodUI's own props, so this line is where the reader learns that the
 * element's DOM props (`className`, `children`, `aria-*`, handlers) are
 * accepted too.
 */
function elementNote(entry: ExportEntry): string | undefined {
  const renders = entry.element
    ? `Renders a \`<${entry.element}>\` and takes its props`
    : undefined;
  if (renders && entry.supportsRender) {
    return `${renders}. Pass \`render\` to render a different element.`;
  }
  if (renders) return `${renders}.`;
  if (entry.supportsRender) {
    return "Takes the DOM props of the element it renders. Pass `render` to render a different element.";
  }
  if (entry.props.length === 0) {
    return "No props of its own. Takes the DOM props of the element it renders.";
  }
  return undefined;
}

function renderHandle(entry: ExportEntry, names: Set<string>): string[] {
  const root = entry.name.replace(/CreateHandle$/, "");
  const trigger = `${root}Trigger`;
  const lines = [
    "A function, not a component. It creates a handle that connects triggers",
    `to a \`${root}\` they are not nested in:`,
    "",
    "```tsx",
    `const handle = ${entry.name}();`,
    "",
    `<${root} handle={handle}>…</${root}>`,
  ];
  if (names.has(trigger)) {
    lines.push(`<${trigger} handle={handle}>Open</${trigger}>`);
  }
  lines.push("```", "", "Create it outside render, once per instance.", "");
  return lines;
}

function renderPage(slug: string, exports: ExportEntry[]): string {
  const names = new Set(exports.map((entry) => entry.name));
  const lines: string[] = [`# ${pascalCase(slug)}`, ""];

  lines.push(
    "```tsx",
    `import { ${exports.map((entry) => entry.name).join(", ")} } from "xiod-ui/${slug}";`,
    "```",
    "",
  );

  for (const entry of exports) {
    lines.push(`## ${entry.name}`, "");
    if (entry.description) lines.push(xiodNames(entry.description), "");

    if (entry.kind === "hook") {
      lines.push(...renderHook(entry));
      continue;
    }

    if (entry.kind === "handle") {
      lines.push(...renderHandle(entry, names));
      continue;
    }

    if (entry.kind === "manager") {
      const methods = entry.methods?.map((method) => `\`${method}\``);
      lines.push(
        "An object, not a component. Its methods work from anywhere in client",
        "code, even outside React, while the component that renders the toasts",
        "is mounted.",
        "",
      );
      if (methods?.length) lines.push(`Methods: ${methods.join(", ")}.`, "");
      continue;
    }

    const note = elementNote(entry);
    if (note) lines.push(note, "");

    if (entry.props.length > 0) {
      lines.push(...propsTable(entry.props, "Prop"));
    }
  }

  lines.push("Required props are bold. Full docs: https://ui.xiod.dev/docs");
  return `${lines.join("\n")}\n`;
}

/**
 * The intrinsic element named in a component's props annotation:
 * `ComponentProps<"div">`, `useRender.ComponentProps<"nav">`,
 * `HTMLAttributes<HTMLSpanElement>`. Base UI parts are typed by their own
 * props and name no element, so they return undefined.
 */
function renderedElement(declaration: ts.Declaration): string | undefined {
  if (!ts.isFunctionLike(declaration)) return undefined;
  const annotation = declaration.parameters[0]?.type?.getText();
  if (!annotation) return undefined;
  const intrinsic = annotation.match(/ComponentProps(?:WithoutRef)?<"(\w+)">/);
  if (intrinsic) return intrinsic[1];
  const element = annotation.match(/HTMLAttributes<HTML(\w+)Element>/);
  if (!element) return undefined;
  const known: Record<string, string> = {
    Anchor: "a",
    Div: "div",
    Paragraph: "p",
    Span: "span",
  };
  return known[element[1]];
}

const files = fs
  .readdirSync(COMPONENTS_DIR)
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => path.join(COMPONENTS_DIR, file));

const configPath = path.join(ROOT, "tsconfig.json");
const config = ts.parseJsonConfigFileContent(
  ts.readConfigFile(configPath, (file) => ts.sys.readFile(file)).config,
  ts.sys,
  ROOT,
);

const program = ts.createProgram(files, {
  ...config.options,
  noEmit: true,
  skipLibCheck: true,
});
const checker = program.getTypeChecker();

const entries = new Map<string, ExportEntry[]>();
const pages = new Map<string, string>();

for (const file of files) {
  const slug = path.basename(file, ".tsx");
  const source = program.getSourceFile(file);
  const moduleSymbol = source && checker.getSymbolAtLocation(source);
  if (!moduleSymbol) {
    throw new Error(`Could not resolve module symbol for ${slug}`);
  }

  const recipes = collectVariantDefaults(source);
  const exports: ExportEntry[] = [];

  for (const exported of checker.getExportsOfModule(moduleSymbol)) {
    const name = exported.getName();

    const symbol =
      (exported.flags & ts.SymbolFlags.Alias) === 0
        ? exported
        : checker.getAliasedSymbol(exported);

    // Types and interfaces are exported alongside the values; only values have
    // props to document, and the type names duplicate them.
    if ((symbol.flags & ts.SymbolFlags.Value) === 0) continue;

    const declaration = firstDeclaration(symbol);
    if (!declaration) continue;

    const type = checker.getTypeOfSymbolAtLocation(symbol, declaration);
    const kind = publicValueKind(checker, name, type);
    if (!kind) continue;

    const propsType = propsTypeOf(checker, symbol, declaration);
    const signature = callSignatureOf(checker, symbol, declaration);

    exports.push({
      kind,
      name,
      description: describeBlock(checker, exported) || undefined,
      props: readProps(checker, symbol, declaration, recipes),
      params: signature ? readParams(checker, signature) : undefined,
      supportsRender: propsType?.getProperty("render") !== undefined,
      element: renderedElement(declaration),
      returns:
        kind === "hook" && signature
          ? returnShape(checker, signature.getReturnType(), declaration)
          : undefined,
      methods:
        kind === "manager"
          ? type
              .getProperties()
              .map((member) => member.getName())
              .filter((member) => /^[A-Za-z_$][\w$]*$/.test(member))
              .toSorted()
          : undefined,
    });
  }

  if (exports.length === 0) continue;

  entries.set(
    slug,
    exports.toSorted((a, b) => a.name.localeCompare(b.name)),
  );
}

// Every page is rendered after every export is known, so a description on
// one page can be rewritten to a name exported from another.
exportedNames = new Set(
  [...entries.values()].flat().map((entry) => entry.name),
);
for (const [slug, exports] of entries) {
  pages.set(`${slug}.md`, renderPage(slug, exports));
}

if (process.argv.includes("--check")) {
  const existingFiles = fs.existsSync(OUT_DIR)
    ? fs
        .readdirSync(OUT_DIR)
        .filter((file) => file.endsWith(".md"))
        .toSorted()
    : [];
  const expectedFiles = [...pages.keys()].toSorted();
  const mismatches = expectedFiles.filter(
    (file) =>
      !existingFiles.includes(file) ||
      fs.readFileSync(path.join(OUT_DIR, file), "utf8") !== pages.get(file),
  );
  const extras = existingFiles.filter((file) => !pages.has(file));

  if (mismatches.length > 0 || extras.length > 0) {
    for (const file of mismatches) console.error(`Stale reference: ${file}`);
    for (const file of extras) console.error(`Unexpected reference: ${file}`);
    console.error("Run `bun run skill:refs` and commit the generated changes.");
    process.exit(1);
  }

  console.log(`Verified ${pages.size} generated skill reference pages`);
} else {
  fs.rmSync(OUT_DIR, { force: true, recursive: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const [file, content] of pages) {
    fs.writeFileSync(path.join(OUT_DIR, file), content);
  }
  console.log(
    `Wrote ${pages.size} reference pages to ${path.relative(ROOT, OUT_DIR)}`,
  );
}
