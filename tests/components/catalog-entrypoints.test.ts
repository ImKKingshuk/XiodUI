import { describe, expect, it } from "vitest";

const expectedEntrypoints = [
  "accordion",
  "agent-steps",
  "alert-dialog",
  "alert",
  "aspect-ratio",
  "autocomplete",
  "avatar",
  "badge",
  "breadcrumb",
  "button-group",
  "button-split",
  "button",
  "calendar",
  "card",
  "carousel",
  "checkbox",
  "circular-progress",
  "collapsible",
  "color-picker",
  "combobox",
  "command",
  "context-menu",
  "copy-to-clipboard",
  "corner-badge",
  "dashboard-grid",
  "date-picker",
  "dialog",
  "dot-matrix",
  "draggable",
  "drawer",
  "empty",
  "field",
  "fieldset",
  "file-upload",
  "form",
  "frame",
  "gauge",
  "grid",
  "group",
  "icon-provider",
  "input-group",
  "input-otp",
  "input-payment",
  "input-phone",
  "input-sensitive",
  "input",
  "kbd",
  "kinetic-click",
  "label",
  "list-box",
  "loader",
  "marker",
  "menu",
  "menubar",
  "message",
  "meter",
  "morphic-toast",
  "navigation-menu",
  "number-field",
  "option-picker",
  "orb",
  "pagination",
  "popover",
  "preview-card",
  "progress",
  "radio",
  "resizable",
  "ruler-picker",
  "scroll-area",
  "scroll-bar",
  "select",
  "separator",
  "sidebar",
  "skeleton",
  "slider",
  "sortable",
  "switch",
  "table",
  "tabs",
  "text",
  "textarea",
  "theme-provider",
  "timeline",
  "toast",
  "toggle-group",
  "toggle",
  "toolbar",
  "tooltip",
  "waveform",
  "wheel-picker",
] as const;

const modules = import.meta.glob("../../src/components/*.tsx");

function entrypointName(path: string): string {
  return path.slice(path.lastIndexOf("/") + 1, -".tsx".length);
}

describe("public component entrypoints", () => {
  it("covers the complete 90-component catalog", () => {
    const actualEntrypoints = Object.keys(modules)
      .map(entrypointName)
      .toSorted();

    expect(actualEntrypoints).toEqual(expectedEntrypoints.toSorted());
    expect(actualEntrypoints).toHaveLength(90);
  });

  it.each(Object.entries(modules))(
    "%s loads and exposes a public API",
    async (_path, loadModule) => {
      const publicModule = (await loadModule()) as Record<string, unknown>;

      expect(Object.keys(publicModule)).not.toHaveLength(0);
    },
  );
});
