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
  description?: string;
  required: boolean;
}

interface ExportEntry {
  kind: "component" | "hook" | "manager";
  name: string;
  description?: string;
  props: PropEntry[];
  supportsRender: boolean;
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

/** The props object is the first parameter of the first call signature. */
function propsTypeOf(
  checker: ts.TypeChecker,
  symbol: ts.Symbol,
  declaration: ts.Declaration,
): ts.Type | undefined {
  const type = checker.getTypeOfSymbolAtLocation(symbol, declaration);
  const signature = type.getCallSignatures()[0];
  const parameter = signature?.getParameters()[0];
  if (!parameter) return undefined;

  const parameterDeclaration = firstDeclaration(parameter);
  if (!parameterDeclaration) return undefined;

  return checker.getTypeOfSymbolAtLocation(parameter, parameterDeclaration);
}

function describe(checker: ts.TypeChecker, symbol: ts.Symbol): string {
  return ts
    .displayPartsToString(symbol.getDocumentationComment(checker))
    .replaceAll(/\s+/g, " ")
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
          description: describe(checker, property) || undefined,
          required: (property.flags & ts.SymbolFlags.Optional) === 0,
        };
      })
      .toSorted((a, b) => a.name.localeCompare(b.name))
  );
}

/** Public API values useful to an agent composing interfaces. */
function publicValueKind(
  name: string,
  type: ts.Type,
): ExportEntry["kind"] | undefined {
  if (name.startsWith("use")) return "hook";
  if (name.endsWith("Manager")) return "manager";
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

function renderPage(slug: string, exports: ExportEntry[]): string {
  const lines: string[] = [`# ${slug}`, ""];

  lines.push(
    "```tsx",
    `import { ${exports.map((entry) => entry.name).join(", ")} } from "xiod-ui/${slug}";`,
    "```",
    "",
  );

  for (const entry of exports) {
    lines.push(`## ${entry.name}`, "");
    if (entry.description) lines.push(entry.description, "");

    if (entry.supportsRender) {
      lines.push(
        "Supports `render={<Element />}` for composition. Inherited DOM props",
        "remain available through the exported TypeScript type.",
        "",
      );
    }

    if (entry.props.length === 0) {
      if (entry.kind === "hook") {
        lines.push("This hook accepts no arguments.", "");
      } else if (entry.kind === "manager") {
        lines.push(
          "Imperative manager export; it is not a React component.",
          "",
        );
      } else {
        lines.push(
          "No XiodUI-specific props were detected. Refer to the exported",
          "TypeScript type for inherited element or primitive props.",
          "",
        );
      }
      continue;
    }

    lines.push("| Prop | Type | Default |", "| :--- | :--- | :--- |");
    for (const prop of entry.props) {
      const name = prop.required ? `**${prop.name}**` : prop.name;
      lines.push(
        `| ${name} | \`${cell(prop.type)}\` | ${prop.default ? `\`${cell(prop.default)}\`` : "—"} |`,
      );
    }
    lines.push("");

    const documented = entry.props.filter((prop) => prop.description);
    for (const prop of documented) {
      lines.push(`- \`${prop.name}\` — ${prop.description}`);
    }
    if (documented.length > 0) lines.push("");
  }

  lines.push("Required props are bold. Full docs: https://ui.xiod.dev/docs");
  return `${lines.join("\n")}\n`;
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
    const kind = publicValueKind(name, type);
    if (!kind) continue;

    const propsType = propsTypeOf(checker, symbol, declaration);

    exports.push({
      kind,
      name,
      description: describe(checker, exported) || undefined,
      props: readProps(checker, symbol, declaration, recipes),
      supportsRender: propsType?.getProperty("render") !== undefined,
    });
  }

  if (exports.length === 0) continue;

  const sorted = exports.toSorted((a, b) => a.name.localeCompare(b.name));
  pages.set(`${slug}.md`, renderPage(slug, sorted));
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
