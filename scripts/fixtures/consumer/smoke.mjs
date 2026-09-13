import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AgentSteps } from "xiod-ui/agent-steps";
import { Button } from "xiod-ui/button";

const packageRoot = new URL("./", import.meta.resolve("xiod-ui/package.json"));
const imports = [];
for (const folder of ["components", "hooks"]) {
  for (const file of readdirSync(
    new URL(`dist/${folder}/`, packageRoot),
  ).filter((name) => name.endsWith(".js"))) {
    const specifier = `xiod-ui/${folder === "hooks" ? "hooks/" : ""}${file.slice(0, -3)}`;
    imports.push(
      import(specifier).then((module) => {
        assert.ok(
          Object.keys(module).length > 0,
          `${specifier} has no exports`,
        );
        return module;
      }),
    );
  }
}
await Promise.all(imports);
for (const name of readdirSync(new URL("dist/themes/", packageRoot))) {
  const specifier = `xiod-ui/themes/${name.replace(/\.scoped\.css$/, "/scoped").replace(/\.css$/, "")}`;
  assert.ok(
    readFileSync(new URL(import.meta.resolve(specifier)), "utf8").includes(
      "--primary",
    ),
  );
}
for (const specifier of ["xiod-ui/styles", "xiod-ui/styles.css"]) {
  assert.ok(
    readFileSync(new URL(import.meta.resolve(specifier)), "utf8").includes(
      "@source",
    ),
  );
}
assert.match(
  renderToStaticMarkup(createElement(Button, null, "Published button")),
  /Published button/,
);
assert.match(
  renderToStaticMarkup(
    createElement(AgentSteps, { label: "Complete", status: "completed" }),
  ),
  /<svg/,
);
console.log(
  "All component, hook, stylesheet and theme exports resolve; Node SSR passed.",
);
