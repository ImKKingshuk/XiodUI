import { AxeBuilder } from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

function monitorRuntime(page: Page): string[] {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      errors.push(`console.${message.type()}: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));

  return errors;
}

test("core controls update state and keyboard interactions work", async ({
  page,
}) => {
  const runtimeErrors = monitorRuntime(page);
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "XiodUI interaction harness" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Increment" }).click();
  await expect(page.getByLabel("click count")).toHaveText("1");

  const checkbox = page.getByRole("checkbox", {
    exact: true,
    name: "Accept terms",
  });
  await checkbox.focus();
  await checkbox.press("Space");
  await expect(checkbox).toBeChecked();

  const toggle = page.getByRole("switch", {
    exact: true,
    name: "Enable notifications",
  });
  await toggle.focus();
  await toggle.press("Space");
  await expect(toggle).toBeChecked();

  const accordionTrigger = page.getByRole("button", {
    name: "How fast is shipping?",
  });
  await accordionTrigger.focus();
  await accordionTrigger.press("Enter");
  await expect(accordionTrigger).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByText("Shipping takes two business days."),
  ).toBeVisible();

  const securityTab = page.getByRole("tab", { name: "Security" });
  await securityTab.click();
  await expect(securityTab).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("Security settings")).toBeVisible();

  expect(runtimeErrors).toEqual([]);
});

test("dialog manages focus and Escape restores the trigger", async ({
  page,
}) => {
  const runtimeErrors = monitorRuntime(page);
  await page.goto("/");

  const trigger = page.getByRole("button", { name: "Open profile dialog" });
  await trigger.click();

  const dialog = page.getByRole("dialog", { name: "Edit profile" });
  const displayName = page.getByRole("textbox", { name: "Display name" });
  await expect(dialog).toBeVisible();
  await expect(displayName).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  expect(runtimeErrors).toEqual([]);
});

test("popup controls and specialized inputs work in a real browser", async ({
  page,
}) => {
  const runtimeErrors = monitorRuntime(page);
  await page.goto("/");

  const actions = page.getByRole("button", { name: "Actions" });
  await actions.focus();
  await actions.press("Enter");
  const rename = page.getByRole("menuitem", { name: "Rename" });
  await expect(rename).toBeFocused();
  await rename.press("Enter");
  await expect(page.getByLabel("menu action")).toHaveText("renamed");
  await expect(actions).toBeFocused();

  const framework = page.getByRole("combobox", { name: "Framework" });
  await framework.focus();
  await framework.press("ArrowDown");
  await expect(page.getByRole("option", { name: "React" })).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("selected framework")).toHaveText("react");

  const phone = page.getByRole("textbox", { name: "Phone number" });
  await phone.fill("5551234567");
  await expect(phone).toHaveValue("(555) 123-4567");
  await expect(page.getByLabel("international phone")).toHaveText(
    "+15551234567",
  );

  const cardNumber = page.getByRole("textbox", { name: "Card number" });
  await cardNumber.fill("4242424242424242");
  await expect(cardNumber).toHaveValue("4242 4242 4242 4242");
  await expect(
    page.getByRole("textbox", { name: "Expiration date" }),
  ).toBeFocused();
  expect(runtimeErrors).toEqual([]);
});

test("the interaction surface has no automatically detectable WCAG A/AA violations", async ({
  page,
}) => {
  const runtimeErrors = monitorRuntime(page);
  await page.goto("/");

  const expectNoViolations = async () => {
    // Axe evaluates composited colors. Let opening opacity transitions settle so
    // it measures the final interactive state rather than a transient frame.
    await page.waitForTimeout(250);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  };

  await expectNoViolations();

  await page.getByRole("button", { name: "Actions" }).click();
  await expect(page.getByRole("menu")).toBeVisible();
  await expectNoViolations();
  await page.keyboard.press("Escape");

  await page.getByRole("combobox", { name: "Framework" }).click();
  await expect(page.getByRole("listbox")).toBeVisible();
  await expectNoViolations();
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: "Open profile dialog" }).click();
  await expect(
    page.getByRole("dialog", { name: "Edit profile" }),
  ).toBeVisible();
  await expectNoViolations();
  expect(runtimeErrors).toEqual([]);
});

test("critical controls remain usable without horizontal overflow on mobile", async ({
  page,
}) => {
  const runtimeErrors = monitorRuntime(page);
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/");

  await expect(page.getByRole("button", { name: "Increment" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Open profile dialog" }),
  ).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);

  await page.getByRole("button", { name: "Open profile dialog" }).click();
  const dialog = page.getByRole("dialog", { name: "Edit profile" });
  await expect(dialog).toBeVisible();

  const bounds = await dialog.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds?.x).toBeGreaterThanOrEqual(0);
  expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(390);
  expect(runtimeErrors).toEqual([]);
});
